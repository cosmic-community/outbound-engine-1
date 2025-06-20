import { cosmic } from '@/lib/cosmic'
import type { GeneratedEmail, SenderProfile, Prospect, EmailTone, EmailGoal, EmailTemplate } from '@/types'

// Template variable replacement function
function replaceVariables(template: string, variables: Record<string, string>): string {
  let result = template
  
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g')
    result = result.replace(regex, value)
  })
  
  return result
}

// Generate context and value propositions based on prospect data
function generateContextualContent(prospect: Prospect, senderProfile: SenderProfile, goal: EmailGoal): Record<string, string> {
  const contexts = {
    'Software Development': 'scaling your engineering team and improving development processes',
    'Technology Services': 'streamlining your service delivery and client management',
    'Marketing': 'optimizing your marketing campaigns and lead generation',
    'Sales': 'improving your sales processes and conversion rates',
    'Finance': 'automating financial processes and improving efficiency',
    'Healthcare': 'enhancing patient care and operational efficiency',
    'Education': 'improving educational outcomes and administrative processes',
    'Retail': 'optimizing customer experience and inventory management',
    'Manufacturing': 'streamlining operations and supply chain management',
    'default': 'growing your business and improving operational efficiency'
  }

  const valueProps = {
    book_demo: 'streamline your sales processes and increase conversion rates',
    introduce_product: 'automate repetitive tasks and save valuable time',
    close_deal: 'achieve your business goals faster and more efficiently',
    network: 'connect and share industry insights',
    follow_up: 'continue our valuable conversation and explore opportunities'
  }

  const industry = prospect.metadata.company_industry || 'default'
  const companyContext = contexts[industry as keyof typeof contexts] || contexts.default
  const valueProposition = valueProps[goal] || valueProps.introduce_product

  return {
    prospect_name: prospect.metadata.full_name,
    prospect_company: prospect.metadata.company_name || 'your company',
    sender_name: senderProfile.metadata.full_name,
    sender_title: senderProfile.metadata.job_title,
    sender_company: senderProfile.metadata.company_name,
    company_context: companyContext,
    value_proposition: valueProposition,
    specific_challenge: `${industry.toLowerCase()} challenges`,
    success_metric: 'reduce manual work by 40% and increase productivity',
    suggested_timeframe: 'week',
    time_option_1: 'Tuesday at 2:00 PM',
    time_option_2: 'Wednesday at 10:00 AM',
    time_option_3: 'Thursday at 3:00 PM'
  }
}

// Get suitable templates based on tone and goal
async function getSuitableTemplates(tone: EmailTone, goal: EmailGoal, emailCount: number): Promise<EmailTemplate[]> {
  try {
    // Fetch all active email templates
    const response = await cosmic.objects.find({ type: 'email-templates' })
      .props(['title', 'slug', 'metadata'])
      .depth(1)

    const allTemplates = response.objects as EmailTemplate[]

    // Filter templates by tone and goal if available
    let suitableTemplates = allTemplates.filter(template => 
      template.metadata.active && 
      (template.metadata.tone === tone || !template.metadata.tone) &&
      (template.metadata.goal === goal || !template.metadata.goal)
    )

    // If no matching templates, use all active templates
    if (suitableTemplates.length === 0) {
      suitableTemplates = allTemplates.filter(template => template.metadata.active)
    }

    // If still no templates, create default templates
    if (suitableTemplates.length === 0) {
      return getDefaultTemplates()
    }

    return suitableTemplates
  } catch (error) {
    console.error('Error fetching templates:', error)
    return getDefaultTemplates()
  }
}

// Default templates as fallback
function getDefaultTemplates(): EmailTemplate[] {
  return [
    {
      id: 'default-1',
      title: 'Introduction Email',
      slug: 'default-introduction',
      metadata: {
        template_name: 'Default Introduction',
        template_category: 'introduction',
        subject_template: 'Quick question about {{prospect_company}}',
        body_template: `<p>Hi {{prospect_name}},</p>
          <p>I hope this email finds you well. I'm {{sender_name}}, {{sender_title}} at {{sender_company}}.</p>
          <p>I noticed that {{prospect_company}} is focused on {{company_context}}, and I thought you might be interested in how we help companies like yours {{value_proposition}}.</p>
          <p>Would you be open to a brief 15-minute conversation to explore how this could benefit {{prospect_company}}?</p>
          <p>Best regards,<br>{{sender_name}}<br>{{sender_title}}<br>{{sender_company}}</p>`,
        variables: {},
        tone: 'friendly',
        goal: 'introduce_product',
        active: true
      }
    } as EmailTemplate,
    {
      id: 'default-2', 
      title: 'Follow Up Email',
      slug: 'default-followup',
      metadata: {
        template_name: 'Default Follow Up',
        template_category: 'follow_up',
        subject_template: 'Following up on {{prospect_company}}',
        body_template: `<p>Hi {{prospect_name}},</p>
          <p>I wanted to follow up on my previous email about helping {{prospect_company}} {{value_proposition}}.</p>
          <p>I understand you're likely busy, but I believe a quick conversation could be valuable for {{prospect_company}}.</p>
          <p>Would you have 15 minutes this {{suggested_timeframe}} for a brief call?</p>
          <p>Best,<br>{{sender_name}}</p>`,
        variables: {},
        tone: 'friendly',
        goal: 'follow_up',
        active: true
      }
    } as EmailTemplate,
    {
      id: 'default-3',
      title: 'Final Follow Up',
      slug: 'default-final',
      metadata: {
        template_name: 'Default Final Follow Up', 
        template_category: 'closing',
        subject_template: 'Last follow up - {{prospect_company}}',
        body_template: `<p>Hi {{prospect_name}},</p>
          <p>This will be my final follow up regarding how {{sender_company}} can help {{prospect_company}} {{value_proposition}}.</p>
          <p>If you're not interested at this time, I completely understand. Feel free to reach out if anything changes in the future.</p>
          <p>Wishing you continued success at {{prospect_company}}.</p>
          <p>Best regards,<br>{{sender_name}}</p>`,
        variables: {},
        tone: 'friendly',
        goal: 'follow_up',
        active: true
      }
    } as EmailTemplate
  ]
}

export async function generateEmailSequenceFromTemplates(
  senderProfile: SenderProfile,
  prospect: Prospect,
  emailCount: number,
  frequencyDays: number,
  tone: EmailTone,
  goal: EmailGoal
): Promise<GeneratedEmail[]> {
  try {
    // Get suitable templates
    const templates = await getSuitableTemplates(tone, goal, emailCount)
    
    // Generate contextual variables
    const variables = generateContextualContent(prospect, senderProfile, goal)
    
    // Generate emails from templates
    const emails: GeneratedEmail[] = []
    
    for (let i = 0; i < emailCount; i++) {
      const template = templates[i % templates.length] // Cycle through templates if needed
      
      // Replace variables in subject and body
      const subject = replaceVariables(template.metadata.subject_template, variables)
      const body = replaceVariables(template.metadata.body_template, variables)
      
      emails.push({
        step_number: i + 1,
        subject_line: subject,
        email_body: body,
        send_delay_days: i * frequencyDays
      })
    }
    
    return emails
  } catch (error) {
    console.error('Error generating email sequence from templates:', error)
    throw new Error('Failed to generate email sequence from templates')
  }
}