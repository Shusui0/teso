import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) return null

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return await prisma.user.findUnique({ where: { id: decoded.userId } })
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const violationType = formData.get('violationType') as string
    const vehiclePlate = formData.get('vehiclePlate') as string
    const location = formData.get('location') as string
    const description = formData.get('description') as string
    const file = formData.get('file') as File | null

    if (!violationType || !vehiclePlate || !location || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let fileUrl: string | null = null
    let aiResults: any = null

    if (file) {
      // Validate file
      if (file.size > 50 * 1024 * 1024) { // 50MB
        return NextResponse.json({ error: 'File too large' }, { status: 400 })
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
      }

      // Save file
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })
      const fileName = `${Date.now()}-${file.name}`
      const filePath = path.join(uploadsDir, fileName)
      const buffer = Buffer.from(await file.arrayBuffer())
      await writeFile(filePath, buffer)
      fileUrl = `/uploads/${fileName}`

      // Run AI detection
      try {
        aiResults = await runAIDetection(filePath)
      } catch (error) {
        console.error('AI detection failed:', error)
        // Continue without AI results
      }
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        userId: user.id,
        violationType,
        vehiclePlate,
        location,
        description,
        fileUrl,
        aiResults,
      }
    })

    return NextResponse.json({ message: 'Report submitted successfully', report })
  } catch (error) {
    console.error('Report submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function runAIDetection(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python3', ['detect.py', filePath], {
      cwd: path.join(process.cwd(), 'ai'),
      stdio: ['pipe', 'pipe', 'pipe']
    })

    let output = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          const results = JSON.parse(output)
          resolve(results)
        } catch (e) {
          reject(new Error('Invalid AI output'))
        }
      } else {
        reject(new Error(`AI process failed: ${errorOutput}`))
      }
    })

    pythonProcess.on('error', (error) => {
      reject(error)
    })
  })
}
