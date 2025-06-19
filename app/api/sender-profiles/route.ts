import { NextRequest, NextResponse } from 'next/server'
import { getSenderProfiles, createSenderProfile } from '@/lib/cosmic'
import type { SenderProfileFormData } from '@/types'

export async function GET() {
  try {
    const profiles = await getSenderProfiles()
    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Error fetching sender profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sender profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: SenderProfileFormData = await request.json()
    
    // Validate required fields
    if (!data.full_name || !data.email_address || !data.job_title || !data.company_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const profile = await createSenderProfile(data)
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error creating sender profile:', error)
    return NextResponse.json(
      { error: 'Failed to create sender profile' },
      { status: 500 }
    )
  }
}