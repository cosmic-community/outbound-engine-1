<!-- README_START -->
# Outbound Engine

A comprehensive sales automation platform that helps sales teams create personalized email sequences using AI and manage prospect outreach efficiently. This prototype leverages your existing Cosmic content models for prospects, sender profiles, email templates, and sequences.

![Outbound Engine Banner](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=300&fit=crop&auto=format,compress)

## Features

- 🧑 **Sender Profile Management** - Set up and manage sender information
- 🧑‍💼 **Prospect Database** - Add and organize prospect information  
- ✉️ **Email Sequence Builder** - Configure sequence preferences (count, frequency, tone, goal)
- 🤖 **AI-Powered Email Generation** - Use ChatGPT to generate personalized email sequences
- 📝 **Email Editing Interface** - Review and edit generated emails before sending
- 📤 **Email Sending Simulation** - Track email status and send timestamps
- 📊 **Dashboard Overview** - View all sequences, prospects, and templates
- 🔄 **Template Management** - Create and reuse email templates
- 📱 **Mobile Responsive** - Clean, modern interface built with Tailwind CSS

## Clone this Bucket

Want to create your own version of this project with all the content and structure? Clone this Cosmic bucket to get started instantly:

[![Clone this Bucket](https://img.shields.io/badge/Clone%20this%20Bucket-4F46E5?style=for-the-badge&logo=cosmic&logoColor=white)](https://app.cosmic-staging.com/projects/new?clone_bucket=outbound-engine-production)

## Original Prompt

This application was built based on the following request:

> I want to create a working prototype of a website called Outbound Engine. This tool should let me enter basic information about myself and my company, input prospect details, decide how many emails I want to send and how frequently, use ChatGPT to generate the email sequence, and allow editing and sending of each email in the sequence.

The app has been tailored to work with your existing Cosmic content structure and includes all the features requested above.

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS
- **CMS**: [Cosmic](https://www.cosmicjs.com) for content management
- **AI Integration**: OpenAI GPT-4 API for email generation
- **Icons**: Lucide React
- **Package Manager**: Bun

## Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- [Cosmic](https://www.cosmicjs.com) account with a bucket
- OpenAI API key for ChatGPT integration

## Getting Started

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd outbound-engine
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your credentials to `.env.local`:
```env
COSMIC_BUCKET_SLUG=your-bucket-slug
COSMIC_READ_KEY=your-read-key
COSMIC_WRITE_KEY=your-write-key
OPENAI_API_KEY=your-openai-api-key
```

5. Run the development server:
```bash
bun run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Cosmic SDK Examples

### Fetching Prospects
```typescript
import { cosmic } from '@/lib/cosmic'

const prospects = await cosmic.objects
  .find({ type: 'prospects' })
  .props(['id', 'title', 'slug', 'metadata'])
  .depth(1)
```

### Creating Email Sequence
```typescript
const sequence = await cosmic.objects.insertOne({
  type: 'email-sequences',
  title: `${prospect.title} - ${senderProfile.title}`,
  metadata: {
    sequence_name: `Outreach to ${prospect.metadata.full_name}`,
    sender_profile: senderProfile.id,
    prospect: prospect.id,
    email_count: emailCount,
    frequency_days: frequencyDays,
    tone: tone,
    goal: goal,
    status: 'draft'
  }
})
```

## Cosmic CMS Integration

This application leverages your existing Cosmic content models:

- **Sender Profiles** - Store sender information and company details
- **Prospects** - Manage prospect database with contact information
- **Email Sequences** - Track complete email campaigns
- **Email Steps** - Individual emails within sequences
- **Email Templates** - Reusable email templates with variables

For more information about Cosmic's capabilities, visit the [Cosmic documentation](https://www.cosmicjs.com/docs).

## Deployment Options

### Vercel (Recommended for Next.js)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect repository to Netlify
2. Set build command: `bun run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

For production deployment, ensure all environment variables are properly configured in your hosting platform.

<!-- README_END -->