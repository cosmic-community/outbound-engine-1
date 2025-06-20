import { NextRequest, NextResponse } from 'next/server'
import { cosmic, createEmailSequence, createEmailSteps } from '@/lib/cosmic'
import { generateEmailSequence } from '@/lib/openai'
import type { SequenceFormData, SenderProfile, Prospect } from '@/types'

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      )
    }

    const data: SequenceFormData = await request.json()
    
    // Validate required fields
    if (!data.sender_profile_id || !data.prospect_id || !data.email_count || !data.frequency_days || !data.tone || !data.goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Fetch sender profile and prospect
    const [senderResponse, prospectResponse] = await Promise.all([
      cosmic.objects.findOne({ type: 'sender-profiles', id: data.sender_profile_id }).depth(1),
      cosmic.objects.findOne({ type: 'prospects', id: data.prospect_id }).depth(1)
    ])

    const senderProfile = senderResponse.object as SenderProfile
    const prospect = prospectResponse.object as Prospect

    if (!senderProfile || !prospect) {
      return NextResponse.json(
        { error: 'Sender profile or prospect not found' },
        { status: 404 }
      )
    }

    // Generate emails using OpenAI
    const generatedEmails = await generateEmailSequence(
      senderProfile,
      prospect,
      data.email_count,
      data.frequency_days,
      data.tone,
      data.goal
    )

    // Create email sequence
    const sequence = await createEmailSequence(data, senderProfile, prospect)

    // Create email steps
    const steps = await createEmailSteps(sequence.id, generatedEmails)

    return NextResponse.json({ 
      sequence,
      steps,
      message: 'Email sequence generated successfully'
    })
  } catch (error) {
    console.error('Error generating email sequence:', error)
    return NextResponse.json(
      { error: 'Failed to generate email sequence' },
      { status: 500 }
    )
  }
}