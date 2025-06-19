import Link from 'next/link'
import { User, Plus, Mail, Phone, ExternalLink } from 'lucide-react'
import { getSenderProfiles } from '@/lib/cosmic'

export default async function SenderProfilesPage() {
  const senderProfiles = await getSenderProfiles()

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
              <h1 className="text-3xl font-bold text-gray-900">Sender Profiles</h1>
              <p className="text-gray-600 mt-1">Manage your sender information and company details</p>
            </div>
            <Link 
              href="/sender-profiles/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Profile
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {senderProfiles.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No sender profiles yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first sender profile to start sending personalized emails.
            </p>
            <Link 
              href="/sender-profiles/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Sender Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {senderProfiles.map((profile) => (
              <div key={profile.id} className="card">
                <div className="card-content">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-primary-50 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {profile.metadata.full_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {profile.metadata.job_title}
                        </p>
                      </div>
                    </div>
                    {profile.metadata.active && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile.metadata.email_address}
                    </div>
                    {profile.metadata.phone_number && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {profile.metadata.phone_number}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {profile.metadata.company_name}
                    </h4>
                    {profile.metadata.company_description && (
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {profile.metadata.company_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Link 
                      href={`/sender-profiles/${profile.slug}`}
                      className="text-primary hover:text-primary-600 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    {profile.metadata.linkedin_url && (
                      <a
                        href={profile.metadata.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
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