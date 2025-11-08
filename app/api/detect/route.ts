import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import { tmpdir } from 'os'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG and PNG images are supported' }, { status: 400 })
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 })
    }

    // Save file temporarily
    const tempDir = tmpdir()
    const tempFilePath = path.join(tempDir, `temp_${Date.now()}_${file.name}`)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(tempFilePath, buffer)

    try {
      // Run Python detection script
      const detections = await runPythonDetection(tempFilePath)

      return NextResponse.json({
        success: true,
        detections: detections
      })
    } finally {
      // Clean up temp file
      try {
        await unlink(tempFilePath)
      } catch (error) {
        console.error('Failed to clean up temp file:', error)
      }
    }
  } catch (error) {
    console.error('Detection error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}

function runPythonDetection(imagePath: string): Promise<{
  detections: Array<{
    class: string
    confidence: number
    bbox: [number, number, number, number]
  }>
  violations: Array<{
    type: string
    description: string
    bbox: [number, number, number, number]
    confidence: number
  }>
  total_vehicles: number
  total_violations: number
}> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['ai/detect.py', imagePath], {
      cwd: process.cwd(),
    })

    let stdout = ''
    let stderr = ''

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python script error:', stderr)
        reject(new Error(`Python script failed: ${stderr}`))
        return
      }

      try {
        const result = JSON.parse(stdout.trim())
        resolve({
          detections: result.detections || [],
          violations: result.violations || [],
          total_vehicles: result.total_vehicles || 0,
          total_violations: result.total_violations || 0
        })
      } catch (error) {
        console.error('Failed to parse Python output:', stdout)
        reject(new Error('Failed to parse detection results'))
      }
    })

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error)
      reject(error)
    })
  })
}
