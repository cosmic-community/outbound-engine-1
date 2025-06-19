import { createBucketClient } from '@cosmicjs/sdk'
import type { 
  SenderProfile, 
  Prospect, 
  EmailSequence, 
  EmailStep, 
  EmailTemplate,
  CosmicResponse,
  SenderProfileFormData,
  ProspectFormData,
  SequenceFormData,
  GeneratedEmail
} from '@/types'

export const cosmic = createBucketClient({
  bucketSlug: process.env.COSMIC_BUCKET_SLUG as string,
  readKey: process.env.COSMIC_READ_KEY as string,
  writeKey: process.env.COSMIC_WRITE_KEY as string,
})

// Simple error helper for Cosmic SDK
function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}

// Sender Profiles
export async function getSenderProfiles(): Promise<SenderProfile[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'sender-profiles' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as SenderProfile[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch sender profiles');
  }
}

export async function getSenderProfile(slug: string): Promise<SenderProfile | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'sender-profiles',
      slug
    }).depth(1);
    return response.object as SenderProfile;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createSenderProfile(data: SenderProfileFormData): Promise<SenderProfile> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'sender-profiles',
      title: `${data.full_name} - ${data.job_title}`,
      metadata: {
        full_name: data.full_name,
        email_address: data.email_address,
        job_title: data.job_title,
        company_name: data.company_name,
        company_description: data.company_description || '',
        phone_number: data.phone_number || '',
        linkedin_url: data.linkedin_url || '',
        active: true
      }
    });
    return response.object as SenderProfile;
  } catch (error) {
    console.error('Error creating sender profile:', error);
    throw new Error('Failed to create sender profile');
  }
}

// Prospects
export async function getProspects(): Promise<Prospect[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'prospects' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as Prospect[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch prospects');
  }
}

export async function getProspect(slug: string): Promise<Prospect | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'prospects',
      slug
    }).depth(1);
    return response.object as Prospect;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createProspect(data: ProspectFormData): Promise<Prospect> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'prospects',
      title: `${data.full_name} - ${data.job_title || data.company_name || 'Contact'}`,
      metadata: {
        full_name: data.full_name,
        email_address: data.email_address,
        job_title: data.job_title || '',
        company_name: data.company_name || '',
        company_industry: data.company_industry || '',
        notes: data.notes || '',
        linkedin_url: data.linkedin_url || '',
        status: 'new'
      }
    });
    return response.object as Prospect;
  } catch (error) {
    console.error('Error creating prospect:', error);
    throw new Error('Failed to create prospect');
  }
}

// Email Templates
export async function getEmailTemplates(): Promise<EmailTemplate[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-templates' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as EmailTemplate[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email templates');
  }
}

// Email Sequences
export async function getEmailSequences(): Promise<EmailSequence[]> {
  try {
    const response = await cosmic.objects
      .find({ type: 'email-sequences' })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as EmailSequence[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email sequences');
  }
}

export async function getEmailSequence(slug: string): Promise<EmailSequence | null> {
  try {
    const response = await cosmic.objects.findOne({
      type: 'email-sequences',
      slug
    }).depth(1);
    return response.object as EmailSequence;
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createEmailSequence(
  data: SequenceFormData,
  senderProfile: SenderProfile,
  prospect: Prospect
): Promise<EmailSequence> {
  try {
    const response = await cosmic.objects.insertOne({
      type: 'email-sequences',
      title: `${prospect.metadata.full_name} - ${senderProfile.metadata.full_name}`,
      metadata: {
        sequence_name: `Outreach to ${prospect.metadata.full_name}`,
        sender_profile: senderProfile.id,
        prospect: prospect.id,
        email_count: data.email_count,
        frequency_days: data.frequency_days,
        tone: data.tone,
        goal: data.goal,
        status: 'draft',
        generated_at: new Date().toISOString()
      }
    });
    return response.object as EmailSequence;
  } catch (error) {
    console.error('Error creating email sequence:', error);
    throw new Error('Failed to create email sequence');
  }
}

// Email Steps
export async function getEmailSteps(sequenceId: string): Promise<EmailStep[]> {
  try {
    const response = await cosmic.objects
      .find({ 
        type: 'email-steps',
        'metadata.email_sequence': sequenceId
      })
      .props(['id', 'title', 'slug', 'metadata'])
      .depth(1);
    return response.objects as EmailStep[];
  } catch (error) {
    if (hasStatus(error) && error.status === 404) {
      return [];
    }
    throw new Error('Failed to fetch email steps');
  }
}

export async function createEmailSteps(
  sequenceId: string,
  emails: GeneratedEmail[]
): Promise<EmailStep[]> {
  try {
    const steps: EmailStep[] = [];
    
    for (const email of emails) {
      const response = await cosmic.objects.insertOne({
        type: 'email-steps',
        title: `Step ${email.step_number} - ${email.subject_line}`,
        metadata: {
          email_sequence: sequenceId,
          step_number: email.step_number,
          subject_line: email.subject_line,
          email_body: email.email_body,
          send_delay_days: email.send_delay_days,
          status: 'draft'
        }
      });
      steps.push(response.object as EmailStep);
    }
    
    return steps;
  } catch (error) {
    console.error('Error creating email steps:', error);
    throw new Error('Failed to create email steps');
  }
}

export async function updateEmailStep(
  stepId: string,
  updates: { subject_line?: string; email_body?: string; status?: string }
): Promise<EmailStep> {
  try {
    const response = await cosmic.objects.updateOne(stepId, {
      metadata: {
        ...updates
      }
    });
    return response.object as EmailStep;
  } catch (error) {
    console.error('Error updating email step:', error);
    throw new Error('Failed to update email step');
  }
}

export async function sendEmailStep(stepId: string): Promise<EmailStep> {
  try {
    const response = await cosmic.objects.updateOne(stepId, {
      metadata: {
        status: 'sent',
        sent_at: new Date().toISOString()
      }
    });
    return response.object as EmailStep;
  } catch (error) {
    console.error('Error sending email step:', error);
    throw new Error('Failed to send email step');
  }
}