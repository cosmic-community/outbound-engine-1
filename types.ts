// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type_slug: string;
  created_at: string;
  modified_at: string;
}

// Sender Profile interface
export interface SenderProfile extends CosmicObject {
  type_slug: 'sender-profiles';
  metadata: {
    full_name: string;
    email_address: string;
    job_title: string;
    company_name: string;
    company_description?: string;
    phone_number?: string;
    linkedin_url?: string;
    active?: boolean;
  };
}

// Prospect interface
export interface Prospect extends CosmicObject {
  type_slug: 'prospects';
  metadata: {
    full_name: string;
    email_address: string;
    job_title?: string;
    company_name?: string;
    company_industry?: string;
    notes?: string;
    linkedin_url?: string;
    status?: {
      key: ProspectStatus;
      value: string;
    };
  };
}

// Email Template interface - Fixed to match actual usage
export interface EmailTemplate extends CosmicObject {
  type_slug: 'email-templates';
  metadata: {
    template_name: string;
    template_category?: string; // Changed from object to string
    subject_template: string;
    body_template: string;
    variables?: string[]; // Changed structure to match usage
    tone?: string; // Changed from object to string
    goal?: string; // Changed from object to string
    active?: boolean;
  };
}

// Email Sequence interface
export interface EmailSequence extends CosmicObject {
  type_slug: 'email-sequences';
  metadata: {
    sequence_name: string;
    sender_profile: SenderProfile;
    prospect: Prospect;
    email_count: number;
    frequency_days: number;
    tone: EmailTone;
    goal: EmailGoal;
    status?: SequenceStatus;
    generated_at?: string;
    started_at?: string;
  };
}

// Email Step interface
export interface EmailStep extends CosmicObject {
  type_slug: 'email-steps';
  metadata: {
    email_sequence: EmailSequence;
    step_number: number;
    subject_line: string;
    email_body: string;
    send_delay_days?: number;
    status?: {
      key: StepStatus;
      value: string;
    };
    scheduled_send_date?: string;
    sent_at?: string;
    open_count?: number;
    click_count?: number;
  };
}

// Type literals for select-dropdown values
export type ProspectStatus = 'new' | 'contacted' | 'responded' | 'qualified' | 'closed';
export type TemplateCategory = 'introduction' | 'follow_up' | 'demo_request' | 'closing' | 'nurture';
export type EmailTone = 'friendly' | 'direct' | 'formal' | 'funny';
export type EmailGoal = 'book_demo' | 'introduce_product' | 'close_deal' | 'network' | 'follow_up';
export type SequenceStatus = 'draft' | 'active' | 'paused' | 'completed';
export type StepStatus = 'draft' | 'scheduled' | 'sent' | 'failed';

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Form data types
export interface SenderProfileFormData {
  full_name: string;
  email_address: string;
  job_title: string;
  company_name: string;
  company_description?: string;
  phone_number?: string;
  linkedin_url?: string;
}

export interface ProspectFormData {
  full_name: string;
  email_address: string;
  job_title?: string;
  company_name?: string;
  company_industry?: string;
  notes?: string;
  linkedin_url?: string;
}

export interface SequenceFormData {
  sender_profile_id: string;
  prospect_id: string;
  email_count: number;
  frequency_days: number;
  tone: EmailTone;
  goal: EmailGoal;
}

// AI Generated Email interface
export interface GeneratedEmail {
  step_number: number;
  subject_line: string;
  email_body: string;
  send_delay_days: number;
}

// Type guards for runtime validation
export function isSenderProfile(obj: CosmicObject): obj is SenderProfile {
  return obj.type_slug === 'sender-profiles';
}

export function isProspect(obj: CosmicObject): obj is Prospect {
  return obj.type_slug === 'prospects';
}

export function isEmailSequence(obj: CosmicObject): obj is EmailSequence {
  return obj.type_slug === 'email-sequences';
}

export function isEmailStep(obj: CosmicObject): obj is EmailStep {
  return obj.type_slug === 'email-steps';
}

export function isEmailTemplate(obj: CosmicObject): obj is EmailTemplate {
  return obj.type_slug === 'email-templates';
}