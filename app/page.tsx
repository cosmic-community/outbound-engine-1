import Link from 'next/link'
import { 
  User, 
  Users, 
  Mail, 
  Zap, 
  BarChart3,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { getSenderProfiles, getProspects, getEmailSequences } from '@/lib/cosmic'

export default async function HomePage() {
  // Fetch data for dashboard stats
  const [senderProfiles, prospects, sequences] = await Promise.all([
    getSenderProfiles(),
    getProspects(),
    getEmailSequences()
  ])

  const stats = [
    {
      label: 'Sender Profiles',
      value: senderProfiles.length,
      icon: User,
      href: '/sender-profiles'
    },
    {
      label: 'Prospects',
      value: prospects.length,
      icon: Users,
      href: '/prospects'
    },
    {
      label: 'Email Sequences',
      value: sequences.length,
      icon: Mail,
      href: '/sequences'
    }
  ]

  const quickActions = [
    {
      title: 'Set up Sender Profile',
      description: 'Create your sender information and company details',
      icon: User,
      href: '/sender-profiles/new',
      color: 'bg-blue-500'
    },
    {
      title: 'Add Prospect',
      description: 'Input prospect details for outreach campaigns',
      icon: Users,
      href: '/prospects/new',
      color: 'bg-green-500'
    },
    {
      title: 'Create Email Sequence',
      description: 'Generate AI-powered email sequences for your prospects',
      icon: Zap,
      href: '/sequences/new',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Outbound Engine</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/sequences" className="text-gray-500 hover:text-gray-900">
                Sequences
              </Link>
              <Link href="/prospects" className="text-gray-500 hover:text-gray-900">
                Prospects
              </Link>
              <Link href="/sender-profiles" className="text-gray-500 hover:text-gray-900">
                Profiles
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              AI-Powered Sales Email Automation
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Create personalized email sequences using ChatGPT, manage prospects, 
              and track your outreach campaigns all in one place.
            </p>
            <div className="flex justify-center space-x-4">
              <Link 
                href="/sequences/new" 
                className="btn-primary inline-flex items-center text-lg px-8 py-3"
              >
                Create Email Sequence
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="/prospects/new" 
                className="btn-outline inline-flex items-center text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary"
              >
                Add Prospect
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <Link 
                key={stat.label}
                href={stat.href}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <stat.icon className="h-8 w-8 text-primary mr-4" />
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these steps to set up your first email sequence and start reaching out to prospects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickActions.map((action, index) => (
              <Link 
                key={action.title}
                href={action.href}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="card-content">
                  <div className="flex items-center mb-4">
                    <div className={`${action.color} rounded-lg p-3 mr-4`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold text-gray-700">
                      {index + 1}
                    </span>
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-primary">
                    <span className="text-sm font-medium">Get started</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h3>
            <p className="text-lg text-gray-600">
              Everything you need to run successful email outreach campaigns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI Email Generation',
                description: 'Use ChatGPT to create personalized email sequences automatically'
              },
              {
                icon: Users,
                title: 'Prospect Management',
                description: 'Organize and manage your prospect database efficiently'
              },
              {
                icon: Mail,
                title: 'Email Templates',
                description: 'Create and reuse email templates for consistent messaging'
              },
              {
                icon: BarChart3,
                title: 'Campaign Tracking',
                description: 'Monitor your email sequences and track engagement metrics'
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="bg-primary-50 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold">Outbound Engine</span>
            </div>
            <p className="text-gray-400">
              Built with Cosmic CMS and powered by OpenAI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}