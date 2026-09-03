import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Megaphone, Download, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const HubScreen = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    loadHubData()
  }, [])

  const loadHubData = async () => {
    setLoading(true)
    try {
      // Fetch resources
      const resourcesResponse = await apiClient.get('/resources', {
        params: { limit: 8 }
      })
      setResources(resourcesResponse.data.data || [])

      // Fetch announcements
      const announcementsResponse = await apiClient.get('/announcements', {
        params: { limit: 5 }
      })
      setAnnouncements(announcementsResponse.data.data || [])
    } catch (error) {
      console.error('Error loading hub data:', error)
      toast.error('Failed to load hub data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner fullScreen />
        <BottomNavigation />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Hub</h1>
            <p className="text-white/80">
              Resources, announcements, and essential event information
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Announcements Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-neutral-900">Announcements</h2>
              </div>
              <button
                onClick={() => navigate('/announcements')}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-900 flex-1">
                        {announcement.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        announcement.category === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : announcement.category === 'info'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {announcement.category}
                      </span>
                    </div>
                    
                    <p className="text-neutral-600 mb-3">
                      {announcement.content}
                    </p>
                    
                    <p className="text-xs text-neutral-500">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 text-center">
                <p className="text-neutral-600">No announcements yet</p>
              </div>
            )}
          </section>

          {/* Resources Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-secondary-600" />
                <h2 className="text-2xl font-bold text-neutral-900">Resources</h2>
              </div>
              <button
                onClick={() => navigate('/resources')}
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {resources.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg border border-neutral-200 p-6 hover:shadow-md transition-all hover:scale-105 active:scale-100"
                  >
                    {/* Resource Type Icon */}
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center mb-4">
                      {resource.resource_type === 'pdf' && (
                        <span className="text-lg font-bold text-primary-600">PDF</span>
                      )}
                      {resource.resource_type === 'video' && (
                        <span className="text-lg font-bold text-secondary-600">▶</span>
                      )}
                      {resource.resource_type === 'document' && (
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      )}
                    </div>

                    <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {resource.description}
                    </p>

                    <button
                      onClick={() => window.open(resource.file_url, '_blank')}
                      className="w-full btn btn-sm btn-outline flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-8 text-center">
                <p className="text-neutral-600">No resources available yet</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default HubScreen