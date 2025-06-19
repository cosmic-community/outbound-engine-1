import { NextRequest, NextResponse } from 'next/server'
import { getProspects, createProspect } from '@/lib/cosmic'
import type { ProspectFormData } from '@/types'

export async function GET() {
  try {
    const prospects = await getProspects()
    return NextResponse.json({ prospects })
  } catch (error) {
    console.error('Error fetching prospects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prospects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: ProspectFormData = await request.json()
    
    // Validate required fields
    if (!data.full_name || !data.email_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const prospect = await createProspect(data)
    return NextResponse.json({ prospect })
  } catch (error) {
    console.error('Error creating prospect:', error)
    return NextResponse.json(
      { error: 'Failed to create prospect' },
      { status: 500 }
    )
  }
}