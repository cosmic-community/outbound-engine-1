'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, Save, Loader2 } from 'lucide-react'
import type { ProspectFormData } from '@/types'

export default function NewProspectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProspectFormData>({
    full_name: '',
    email_address: '',
    job_title: '',
    company_name: '',
    company_industry: '',
    notes: '',
    linkedin_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/prospects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create prospect')
      }

      const result = await response.json()
      router.push(`/prospects/${result.prospect.slug}`)
    } catch (error) {
      console.error('Error creating prospect:', error)
      alert('Failed to create prospect. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link href="/prospects" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
              ← Back to Prospects
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Add Prospect</h1>
            <p className="text-gray-600 mt-1">Enter prospect details for your outreach campaigns</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <div className="bg-green-50 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h2 className="card-title">Prospect Information</h2>
                <p className="card-description">
                  Add contact and company details for this prospect
                </p>
              </div>
            </div>
          </div>

          <div className="card-content">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Sarah Johnson"
                  />
                </div>

                <div>
                  <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email_address"
                    name="email_address"
                    required
                    value={formData.email_address}
                    onChange={handleChange}
                    className="input"
                    placeholder="sarah@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                    className="input"
                    placeholder="VP of Marketing"
                  />
                </div>

                <div>
                  <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://linkedin.com/in/prospect"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="input"
                    placeholder="TechCorp Solutions"
                  />
                </div>

                <div>
                  <label htmlFor="company_industry" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Industry
                  </label>
                  <input
                    type="text"
                    id="company_industry"
                    name="company_industry"
                    value={formData.company_industry}
                    onChange={handleChange}
                    className="input"
                    placeholder="Technology Services"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="Additional information about this prospect, their company, or relevant context for outreach..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link 
                  href="/prospects"
                  className="btn-outline"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary inline-flex items-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Adding...' : 'Add Prospect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}