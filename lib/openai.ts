import OpenAI from 'openai';
import type { GeneratedEmail, SenderProfile, Prospect, EmailTone, EmailGoal } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateEmailSequence(
  senderProfile: SenderProfile,
  prospect: Prospect,
  emailCount: number,
  frequencyDays: number,
  tone: EmailTone,
  goal: EmailGoal
): Promise<GeneratedEmail[]> {
  const toneMap = {
    friendly: 'Friendly',
    direct: 'Direct',
    formal: 'Formal',
    funny: 'Funny'
  };

  const goalMap = {
    book_demo: 'Book a demo',
    introduce_product: 'Introduce product',
    close_deal: 'Close deal',
    network: 'Network',
    follow_up: 'Follow up'
  };

  const prompt = `Write a ${emailCount}-step cold email sequence from ${senderProfile.metadata.full_name}, a ${senderProfile.metadata.job_title} at ${senderProfile.metadata.company_name}, to ${prospect.metadata.full_name}, a ${prospect.metadata.job_title || 'professional'} at ${prospect.metadata.company_name || 'their company'}.

Company Context:
- Sender Company: ${senderProfile.metadata.company_name}
- Company Description: ${senderProfile.metadata.company_description || 'A sales automation platform'}
- Prospect Company: ${prospect.metadata.company_name || 'the prospect\'s company'}
- Prospect Industry: ${prospect.metadata.company_industry || 'their industry'}

Email Sequence Requirements:
- The tone should be ${toneMap[tone]}, and the goal is to ${goalMap[goal]}
- Space emails ${frequencyDays} days apart
- Each email should build on the previous one
- Keep emails concise and personalized
- Include a clear call-to-action in each email

For each email, provide:
1. Subject line (without "Subject:" prefix)
2. Email body (professional HTML format with proper paragraphs)
3. Send delay in days from sequence start

Return the response as a JSON array where each email has this exact structure:
{
  "step_number": 1,
  "subject_line": "Subject here",
  "email_body": "<p>Email body here with HTML formatting</p>",
  "send_delay_days": 0
}

Make sure the response is valid JSON that can be parsed directly.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert sales email writer. Generate personalized email sequences that are professional, engaging, and effective. Always return valid JSON responses that match the requested format exactly."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Try to parse the JSON response
    try {
      const emails = JSON.parse(content) as GeneratedEmail[];
      
      // Validate the response structure
      if (!Array.isArray(emails)) {
        throw new Error('Response is not an array');
      }

      emails.forEach((email, index) => {
        if (!email.step_number || !email.subject_line || !email.email_body) {
          throw new Error(`Email ${index + 1} is missing required fields`);
        }
        
        // Set default send delay if not provided
        if (email.send_delay_days === undefined) {
          email.send_delay_days = index * frequencyDays;
        }
      });

      return emails;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('Error generating email sequence:', error);
    throw new Error('Failed to generate email sequence with AI');
  }
}