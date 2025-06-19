'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Save, Loader2 } from 'lucide-react'
import type { SenderProfileFormData } from '@/types'

export default function NewSenderProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<SenderProfileFormData>({
    full_name: '',
    email_address: '',
    job_title: '',
    company_name: '',
    company_description: '',
    phone_number: '',
    linkedin_url: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/sender-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create sender profile')
      }

      const result = await response.json()
      router.push(`/sender-profiles/${result.profile.slug}`)
    } catch (error) {
      console.error('Error creating sender profile:', error)
      alert('Failed to create sender profile. Please try again.')
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
            <Link href="/sender-profiles" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
              ← Back to Sender Profiles
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create Sender Profile</h1>
            <p className="text-gray-600 mt-1">Set up your sender information and company details</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="card-header">
            <div className="flex items-center">
              <div className="bg-primary-50 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="card-title">Sender Information</h2>
                <p className="card-description">
                  Enter your details that will be used for email signatures and outreach
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
                    placeholder="John Smith"
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
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="job_title"
                    name="job_title"
                    required
                    value={formData.job_title}
                    onChange={handleChange}
                    className="input"
                    placeholder="Sales Director"
                  />
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    required
                    value={formData.company_name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Your Company Inc."
                  />
                </div>
              </div>

              {/* Company Description */}
              <div>
                <label htmlFor="company_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Company Description
                </label>
                <textarea
                  id="company_description"
                  name="company_description"
                  rows={4}
                  value={formData.company_description}
                  onChange={handleChange}
                  className="textarea"
                  placeholder="Brief description of your company and what you do..."
                />
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="input"
                    placeholder="+1 (555) 123-4567"
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
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link 
                  href="/sender-profiles"
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
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}