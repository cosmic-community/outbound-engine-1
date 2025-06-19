import Link from 'next/link'
import { Users, Plus, Mail, Building, ExternalLink } from 'lucide-react'
import { getProspects } from '@/lib/cosmic'

export default async function ProspectsPage() {
  const prospects = await getProspects()

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      responded: 'bg-green-100 text-green-800',
      qualified: 'bg-purple-100 text-purple-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || colors.new
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
              <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
              <p className="text-gray-600 mt-1">Manage your prospect database and contact information</p>
            </div>
            <Link 
              href="/prospects/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prospect
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {prospects.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No prospects yet</h3>
            <p className="text-gray-600 mb-6">
              Add your first prospect to start creating personalized email sequences.
            </p>
            <Link 
              href="/prospects/new"
              className="btn-primary inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Prospect
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prospects.map((prospect) => (
              <div key={prospect.id} className="card">
                <div className="card-content">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-50 rounded-lg w-12 h-12 flex items-center justify-center mr-3">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prospect.metadata.full_name}
                        </h3>
                        {prospect.metadata.job_title && (
                          <p className="text-sm text-gray-600">
                            {prospect.metadata.job_title}
                          </p>
                        )}
                      </div>
                    </div>
                    {prospect.metadata.status && (
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(prospect.metadata.status.key)}`}>
                        {prospect.metadata.status.value}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {prospect.metadata.email_address}
                    </div>
                    {prospect.metadata.company_name && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="h-4 w-4 mr-2" />
                        {prospect.metadata.company_name}
                        {prospect.metadata.company_industry && (
                          <span className="text-gray-400 ml-1">
                            • {prospect.metadata.company_industry}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {prospect.metadata.notes && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {prospect.metadata.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Link 
                      href={`/prospects/${prospect.slug}`}
                      className="text-primary hover:text-primary-600 text-sm font-medium"
                    >
                      View Details
                    </Link>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/sequences/new?prospect=${prospect.id}`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Create Sequence
                      </Link>
                      {prospect.metadata.linkedin_url && (
                        <a
                          href={prospect.metadata.linkedin_url}
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
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}