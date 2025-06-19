'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Save, Loader2, ArrowRight } from 'lucide-react'
import type { SenderProfile, Prospect, SequenceFormData, EmailTone, EmailGoal } from '@/types'

export default function NewSequencePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [senderProfiles, setSenderProfiles] = useState<SenderProfile[]>([])
  const [prospects, setProspects] = useState<Prospect[]>([])
  
  const [formData, setFormData] = useState<SequenceFormData>({
    sender_profile_id: '',
    prospect_id: searchParams.get('prospect') || '',
    email_count: 3,
    frequency_days: 2,
    tone: 'friendly',
    goal: 'book_demo'
  })

  useEffect(() => {
    // Fetch sender profiles and prospects
    Promise.all([
      fetch('/api/sender-profiles').then(res => res.json()),
      fetch('/api/prospects').then(res => res.json())
    ]).then(([senderData, prospectData]) => {
      setSenderProfiles(senderData.profiles || [])
      setProspects(prospectData.prospects || [])
      
      // Auto-select first active sender profile
      const activeSender = senderData.profiles?.find((p: SenderProfile) => p.metadata.active)
      if (activeSender && !formData.sender_profile_id) {
        setFormData(prev => ({ ...prev, sender_profile_id: activeSender.id }))
      }
    }).catch(console.error)
  }, [formData.sender_profile_id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/sequences/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate email sequence')
      }

      const result = await response.json()
      router.push(`/sequences/${result.sequence.slug}/edit`)
    } catch (error) {
      console.error('Error generating sequence:', error)
      alert('Failed to generate email sequence. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'email_count' || name === 'frequency_days' ? parseInt(value) : value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link href="/sequences" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
              ← Back to Sequences
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create Email Sequence</h1>
            <p className="text-gray-600 mt-1">Generate AI-powered email sequences for your prospects</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <div className="bg-purple-50 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="card-title">Sequence Configuration</h2>
                <p className="card-description">
                  Configure your email sequence preferences and let AI generate personalized emails
                </p>
              </div>
            </div>
          </div>

          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sender Profile Selection */}
              <div>
                <label htmlFor="sender_profile_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Profile *
                </label>
                <select
                  id="sender_profile_id"
                  name="sender_profile_id"
                  required
                  value={formData.sender_profile_id}
                  onChange={handleChange}
                  className="select w-full"
                >
                  <option value="">Select a sender profile</option>
                  {senderProfiles.map((profile) => (
                    <option key={profile.id} value={profile.id}>
                      {profile.metadata.full_name} - {profile.metadata.job_title} ({profile.metadata.company_name})
                    </option>
                  ))}
                </select>
                {senderProfiles.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    <Link href="/sender-profiles/new" className="text-primary hover:text-primary-600">
                      Create a sender profile first
                    </Link>
                  </p>
                )}
              </div>

              {/* Prospect Selection */}
              <div>
                <label htmlFor="prospect_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Target Prospect *
                </label>
                <select
                  id="prospect_id"
                  name="prospect_id"
                  required
                  value={formData.prospect_id}
                  onChange={handleChange}
                  className="select w-full"
                >
                  <option value="">Select a prospect</option>
                  {prospects.map((prospect) => (
                    <option key={prospect.id} value={prospect.id}>
                      {prospect.metadata.full_name} - {prospect.metadata.job_title || 'Contact'} 
                      {prospect.metadata.company_name && ` (${prospect.metadata.company_name})`}
                    </option>
                  ))}
                </select>
                {prospects.length === 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    <Link href="/prospects/new" className="text-primary hover:text-primary-600">
                      Add a prospect first
                    </Link>
                  </p>
                )}
              </div>

              {/* Sequence Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email_count" className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Emails
                  </label>
                  <select
                    id="email_count"
                    name="email_count"
                    value={formData.email_count}
                    onChange={handleChange}
                    className="select w-full"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} email{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="frequency_days" className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency (Days Between Emails)
                  </label>
                  <select
                    id="frequency_days"
                    name="frequency_days"
                    value={formData.frequency_days}
                    onChange={handleChange}
                    className="select w-full"
                  >
                    <option value={1}>Every day</option>
                    <option value={2}>Every 2 days</option>
                    <option value={3}>Every 3 days</option>
                    <option value={5}>Every 5 days</option>
                    <option value={7}>Every week</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Tone
                  </label>
                  <select
                    id="tone"
                    name="tone"
                    value={formData.tone}
                    onChange={handleChange}
                    className="select w-full"
                  >
                    <option value="friendly">Friendly</option>
                    <option value="direct">Direct</option>
                    <option value="formal">Formal</option>
                    <option value="funny">Funny</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Goal
                  </label>
                  <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    className="select w-full"
                  >
                    <option value="book_demo">Book a demo</option>
                    <option value="introduce_product">Introduce product</option>
                    <option value="close_deal">Close deal</option>
                    <option value="network">Network</option>
                    <option value="follow_up">Follow up</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              {formData.sender_profile_id && formData.prospect_id && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Sequence Preview</h3>
                  <p className="text-sm text-blue-700">
                    {formData.email_count} emails will be generated from{' '}
                    <strong>
                      {senderProfiles.find(p => p.id === formData.sender_profile_id)?.metadata.full_name}
                    </strong>{' '}
                    to{' '}
                    <strong>
                      {prospects.find(p => p.id === formData.prospect_id)?.metadata.full_name}
                    </strong>{' '}
                    with a {formData.tone} tone, spaced {formData.frequency_days} day{formData.frequency_days > 1 ? 's' : ''} apart.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link 
                  href="/sequences"
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading || !formData.sender_profile_id || !formData.prospect_id}
                  className="btn-primary inline-flex items-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Generating...' : 'Generate with AI'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}