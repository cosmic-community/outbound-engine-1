import { NextRequest, NextResponse } from 'next/server'
import { getEmailSteps, updateEmailStep, sendEmailStep } from '@/lib/cosmic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sequenceId = searchParams.get('sequenceId')
    
    if (!sequenceId) {
      return NextResponse.json(
        { error: 'sequenceId parameter is required' },
        { status: 400 }
      )
    }

    const steps = await getEmailSteps(sequenceId)
    return NextResponse.json({ steps })
  } catch (error) {
    console.error('Error fetching email steps:', error)
    return NextResponse.json(
      { error: 'Failed to fetch email steps' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { stepId, updates } = await request.json()
    
    if (!stepId) {
      return NextResponse.json(
        { error: 'stepId is required' },
        { status: 400 }
      )
    }

    const step = await updateEmailStep(stepId, updates)
    return NextResponse.json({ step })
  } catch (error) {
    console.error('Error updating email step:', error)
    return NextResponse.json(
      { error: 'Failed to update email step' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { stepId, action } = await request.json()
    
    if (!stepId || action !== 'send') {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      )
    }

    const step = await sendEmailStep(stepId)
    return NextResponse.json({ step, message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email step:', error)
    return NextResponse.json(
      { error: 'Failed to send email step' },
      { status: 500 }
    )
  }
}