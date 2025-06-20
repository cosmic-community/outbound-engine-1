import { NextRequest, NextResponse } from 'next/server'
import { getEmailTemplates } from '@/lib/cosmic'

export async function GET() {
  try {
    const templates = await getEmailTemplates()
    return NextResponse.json({ templates })
  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}