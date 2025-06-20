import { NextRequest, NextResponse } from 'next/server'
import { getEmailSequences } from '@/lib/cosmic'

export async function GET() {
  try {
    const sequences = await getEmailSequences()
    return NextResponse.json({ sequences })
  } catch (error) {
    console.error('Error fetching email sequences:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email sequences' },
      { status: 500 }
    )
  }
}