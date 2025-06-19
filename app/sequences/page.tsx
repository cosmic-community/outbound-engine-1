import Link from 'next/link'
import { Mail, Plus, User, Users, Calendar, Target } from 'lucide-react'
import { getEmailSequences } from '@/lib/cosmic'

export default async function SequencesPage() {
  const sequences = await getEmailSequences()

  const getStatusColor = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800'
    }
    return colors[status as keyof typeof colors] || colors.draft
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
              <h1 className="text-3xl font-bold text-gray-900">Email Sequences</h1>
              <p className="text-gray-600 mt-1">Manage your AI-generated email campaigns</p>
            </div>
            <Link 
              href="/sequences/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Sequence
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {sequences.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No email sequences yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first AI-powered email sequence to start reaching out to prospects.
            </p>
            <Link 
              href="/sequences/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Email Sequence
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sequences.map((sequence) => (
              <div key={sequence.id} className="card">
                <div className="card-content">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-purple-50 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                        <Mail className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {sequence.metadata.sequence_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {sequence.metadata.email_count} emails
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(sequence.metadata.status || 'draft')}`}>
                      {sequence.metadata.status || 'Draft'}
                    </span>
                  </div>

                  {/* Prospect and Sender Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>To: {sequence.metadata.prospect?.title || sequence.metadata.prospect}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>From: {sequence.metadata.sender_profile?.title || sequence.metadata.sender_profile}</span>
                    </div>
                  </div>

                  {/* Sequence Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600">Every {sequence.metadata.frequency_days} day{sequence.metadata.frequency_days > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Target className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-gray-600 capitalize">{sequence.metadata.goal?.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {/* Tone Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-full ${getToneColor(sequence.metadata.tone)}`}>
                      {sequence.metadata.tone} tone
                    </span>
                  </div>

                  {/* Generated Date */}
                  {sequence.metadata.generated_at && (
                    <div className="text-xs text-gray-500 mb-4">
                      Generated {new Date(sequence.metadata.generated_at).toLocaleDateString()}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Link 
                      href={`/sequences/${sequence.slug}`}
                      className="text-primary hover:text-primary-600 text-sm font-medium"
                    >
                      View Sequence
                    </Link>
                    <div className="flex items-center space-x-3">
                      <Link 
                        href={`/sequences/${sequence.slug}/edit`}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      {sequence.metadata.status === 'draft' && (
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                          Start
                        </button>
                      )}
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