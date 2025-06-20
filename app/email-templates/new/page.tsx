'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Save, Eye, Zap } from 'lucide-react'
import type { TemplateCategory, EmailTone, EmailGoal } from '@/types'

interface TemplateFormData {
  template_name: string
  template_category: TemplateCategory
  subject_template: string
  body_template: string
  tone: EmailTone
  goal: EmailGoal
  variables: string[]
  active: boolean
}

export default function NewEmailTemplatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  
  const [formData, setFormData] = useState<TemplateFormData>({
    template_name: '',
    template_category: 'introduction',
    subject_template: '',
    body_template: '',
    tone: 'friendly',
    goal: 'book_demo',
    variables: [],
    active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          variables: { variables: formData.variables }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create email template')
      }

      const result = await response.json()
      router.push(`/email-templates/${result.template.slug}`)
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create email template. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{[^}]+\}\}/g)
    return matches ? Array.from(new Set(matches)) : []
  }

  const handleTemplateChange = (field: 'subject_template' | 'body_template', value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }
      // Auto-extract variables from both subject and body
      const allVariables = [
        ...extractVariables(updated.subject_template),
        ...extractVariables(updated.body_template)
      ]
      updated.variables = Array.from(new Set(allVariables))
      return updated
    })
  }

  const previewTemplate = () => {
    let preview = formData.body_template
    formData.variables.forEach(variable => {
      const placeholder = variable.replace(/[{}]/g, '').replace(/_/g, ' ')
      preview = preview.replace(new RegExp(variable.replace(/[{}]/g, '\\{\\}'), 'g'), `[${placeholder}]`)
    })
    return preview
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Link href="/email-templates" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
              ← Back to Templates
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Create Email Template</h1>
            <p className="text-gray-600 mt-1">Build reusable email templates with variables</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center">
                  <div className="bg-indigo-50 rounded-lg w-12 h-12 flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="card-title">Template Details</h2>
                    <p className="card-description">
                      Configure your email template with variables and formatting
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-content">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Template Name */}
                  <div>
                    <label htmlFor="template_name" className="block text-sm font-medium text-gray-700 mb-2">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      id="template_name"
                      name="template_name"
                      required
                      value={formData.template_name}
                      onChange={handleChange}
                      placeholder="e.g., Introduction Email Template"
                      className="input w-full"
                    />
                  </div>

                  {/* Category and Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="template_category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="template_category"
                        name="template_category"
                        value={formData.template_category}
                        onChange={handleChange}
                        className="select w-full"
                      >
                        <option value="introduction">Introduction</option>
                        <option value="follow_up">Follow Up</option>
                        <option value="demo_request">Demo Request</option>
                        <option value="closing">Closing</option>
                        <option value="nurture">Nurture</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-2">
                        Tone
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
                        Goal
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

                  {/* Subject Template */}
                  <div>
                    <label htmlFor="subject_template" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject Line Template *
                    </label>
                    <input
                      type="text"
                      id="subject_template"
                      name="subject_template"
                      required
                      value={formData.subject_template}
                      onChange={(e) => handleTemplateChange('subject_template', e.target.value)}
                      placeholder="e.g., Quick question about {{prospect_company}}'s sales process"
                      className="input w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use {`{{variable_name}}`} for dynamic content
                    </p>
                  </div>

                  {/* Body Template */}
                  <div>
                    <label htmlFor="body_template" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Body Template *
                    </label>
                    <textarea
                      id="body_template"
                      name="body_template"
                      required
                      rows={12}
                      value={formData.body_template}
                      onChange={(e) => handleTemplateChange('body_template', e.target.value)}
                      placeholder={`<p>Hi {{prospect_name}},</p>

<p>I hope this email finds you well. I'm {{sender_name}}, {{sender_title}} at {{sender_company}}.</p>

<p>I noticed that {{prospect_company}} is growing rapidly, and I thought you might be interested in how we help companies like yours streamline their sales process.</p>

<p>Would you be open to a brief 15-minute conversation?</p>

<p>Best regards,<br>
{{sender_name}}<br>
{{sender_title}}<br>
{{sender_company}}</p>`}
                      className="textarea w-full font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      HTML formatting supported. Use {`{{variable_name}}`} for dynamic content.
                    </p>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      name="active"
                      checked={formData.active}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                      Set as active template
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                    <Link 
                      href="/email-templates"
                      className="btn-outline"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary inline-flex items-center"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isLoading ? 'Creating...' : 'Create Template'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Template Preview</h3>
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className="text-sm text-primary hover:text-primary-600"
                  >
                    <Eye className="h-4 w-4 inline mr-1" />
                    {isPreview ? 'Hide' : 'Show'} Preview
                  </button>
                </div>
              </div>

              <div className="card-content">
                {/* Variables List */}
                {formData.variables.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      Variables ({formData.variables.length})
                    </h4>
                    <div className="space-y-1">
                      {formData.variables.map((variable, index) => (
                        <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                          {variable}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email Preview */}
                {isPreview && (formData.subject_template || formData.body_template) && (
                  <div className="border rounded-lg p-3 bg-white">
                    {formData.subject_template && (
                      <div className="mb-3 pb-3 border-b border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Subject:</div>
                        <div className="text-sm font-medium">
                          {formData.subject_template.replace(/\{\{[^}]+\}\}/g, (match) => 
                            `[${match.replace(/[{}]/g, '').replace(/_/g, ' ')}]`
                          )}
                        </div>
                      </div>
                    )}
                    {formData.body_template && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Body:</div>
                        <div 
                          className="text-sm prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: previewTemplate() }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}