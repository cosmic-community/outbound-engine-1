import Link from 'next/link'
import { Mail, Plus, Zap, Eye } from 'lucide-react'
import { getEmailTemplates } from '@/lib/cosmic'

export default async function EmailTemplatesPage() {
  const templates = await getEmailTemplates()

  const getCategoryColor = (category: string) => {
    const colors = {
      introduction: 'bg-blue-100 text-blue-800',
      follow_up: 'bg-green-100 text-green-800',
      demo_request: 'bg-purple-100 text-purple-800',
      closing: 'bg-red-100 text-red-800',
      nurture: 'bg-orange-100 text-orange-800'
    }
    return colors[category as keyof typeof colors] || colors.introduction
  }

  const getToneColor = (tone: string) => {
    const colors = {
      friendly: 'bg-green-50 text-green-700',
      direct: 'bg-blue-50 text-blue-700',
      formal: 'bg-purple-50 text-purple-700',
      funny: 'bg-orange-50 text-orange-700'
    }
    return colors[tone as keyof typeof colors] || colors.friendly
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <Link href="/" className="text-gray-500 hover:text-gray-700 mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Email Templates</h1>
              <p className="text-gray-600 mt-1">Pre-built email templates for your sequences</p>
            </div>
            <Link 
              href="/email-templates/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No email templates yet</h3>
            <p className="text-gray-600 mb-6">
              Create reusable email templates to streamline your sequence generation.
            </p>
            <Link 
              href="/email-templates/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Email Template
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="card">
                <div className="card-content">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-indigo-50 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                        <Mail className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {template.metadata.template_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Template
                        </p>
                      </div>
                    </div>
                    {template.metadata.active ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Category and Goal */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.metadata.template_category && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCategoryColor(template.metadata.template_category.key)}`}>
                        {template.metadata.template_category.value}
                      </span>
                    )}
                    {template.metadata.goal && (
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        {template.metadata.goal.value}
                      </span>
                    )}
                  </div>

                  {/* Subject Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Subject:</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {template.metadata.subject_template}
                    </p>
                  </div>

                  {/* Body Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Preview:</h4>
                    <div 
                      className="text-sm text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: template.metadata.body_template.replace(/<[^>]*>/g, '').substring(0, 120) + '...' 
                      }}
                    />
                  </div>

                  {/* Tone */}
                  {template.metadata.tone && (
                    <div className="mb-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getToneColor(template.metadata.tone.key)}`}>
                        {template.metadata.tone.value} tone
                      </span>
                    </div>
                  )}

                  {/* Variables Count */}
                  {template.metadata.variables?.variables && (
                    <div className="mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Zap className="h-4 w-4 mr-2" />
                        <span>{template.metadata.variables.variables.length} variables</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Link 
                      href={`/email-templates/${template.slug}`}
                      className="text-primary hover:text-primary-600 text-sm font-medium inline-flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Template
                    </Link>
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/email-templates/${template.slug}/edit`}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}