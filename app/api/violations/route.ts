import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const violations = await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    })

    // Transform to match frontend expectations
    const transformedViolations = violations.map(v => ({
      id: v.id,
      type: v.violationType,
      location: v.location,
      date: v.createdAt.toISOString().replace('T', ' ').substring(0, 16),
      status: v.status,
      severity: v.severity || 'medium',
      vehiclePlate: v.vehiclePlate,
      description: v.description,
      aiResults: v.aiResults
    }))

    return NextResponse.json(transformedViolations)
  } catch (error) {
    console.error('Fetch violations error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
