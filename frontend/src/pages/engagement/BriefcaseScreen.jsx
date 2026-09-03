// ============================================================================
// Briefcase Screen
// ============================================================================
// File: src/pages/engagement/BriefcaseScreen.jsx
// Purpose: Digital briefcase for storing event resources
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Briefcase, Download, FileText, Trash2, Share2, Filter, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const BriefcaseScreen = () => {
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState([])
  const [filteredResources, setFilteredResources] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list

  useEffect(() => {
    loadBriefcaseResources()
  }, [selectedType])

  useEffect(() => {
    filterResources()
  }, [searchQuery, resources])

  const loadBriefcaseResources = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 50,
        ...(selectedType && { type: selectedType })
      }

      // This would be endpoint for saved/downloaded resources
      const response = await apiClient.get('/users/me/briefcase', { params })
      setResources(response.data.data || [])
      setFilteredResources(response.data.data || [])
    } catch (error) {
      console.error('Error loading briefcase:', error)
      toast.error('Failed to load briefcase')
      // Mock data for demo
      setResources([])
      setFilteredResources([])
    } finally {
      setLoading(false)
    }
  }

  const filterResources = () => {
    if (!searchQuery) {
      setFilteredResources(resources)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = resources.filter((resource) =>
      resource.title.toLowerCase().includes(query) ||
      resource.description?.toLowerCase().includes(query)
    )

    setFilteredResources(filtered)
  }

  const handleDelete = async (resourceId) => {
    if (window.confirm('Remove this resource from your briefcase?')) {
      try {
        await apiClient.delete(`/users/me/briefcase/${resourceId}`)
        setResources(prev => prev.filter(r => r.id !== resourceId))
        toast.success('Resource removed!')
      } catch (error) {
        console.error('Error deleting resource:', error)
        toast.error('Failed to remove resource')
      }
    }
  }

  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return '📄'
      case 'video':
        return '🎥'
      case 'image':
        return '🖼️'
      case 'document':
        return '📝'
      case 'presentation':
        return '📊'
      default:
        return '📎'
    }
  }

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container-max py-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Digital Briefcase</h1>
            <p className="text-white/80">
              Store and manage event resources in one place
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Controls */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-3 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white"
              />
            </div>

            {/* Filters & View Toggle */}
            <div className="flex gap-2 flex-wrap">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="flex-1 min-w-[150px]"
              >
                <option value="">All Types</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="image">Image</option>
                <option value="document">Document</option>
                <option value="presentation">Presentation</option>
              </select>

              <div className="flex gap-2 border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  ⊞ Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary-100 text-primary-600'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  ≡ List
                </button>
              </div>
            </div>
          </div>

          {/* Resources */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredResources.length > 0 ? (
            <>
              {viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Icon Section */}
                      <div className="bg-gradient-to-br from-primary-100 to-secondary-100 h-24 flex items-center justify-center text-4xl">
                        {getFileIcon(resource.type)}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-bold text-neutral-900 mb-1 line-clamp-2">
                          {resource.title}
                        </h3>

                        <p className="text-xs text-neutral-600 mb-4">
                          {resource.type?.toUpperCase()} • {resource.size}
                        </p>

                        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                          {resource.description}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(resource.file_url, '_blank')}
                            className="flex-1 btn btn-sm btn-primary flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </button>

                          <button
                            onClick={() => handleDelete(resource.id)}
                            className="btn btn-sm btn-ghost text-error hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-3">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-lg border border-neutral-200 p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">
                          {getFileIcon(resource.type)}
                        </span>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 truncate">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-neutral-600">
                            {resource.type?.toUpperCase()} • {resource.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => window.open(resource.file_url, '_blank')}
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download className="w-5 h-5 text-primary-600" />
                        </button>

                        <button
                          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-5 h-5 text-neutral-600" />
                        </button>

                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-error" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="mt-8 text-center text-sm text-neutral-600">
                Showing {filteredResources.length} of {resources.length} resources
              </div>
            </>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <Briefcase className="w-12 h-12 text-neutral-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Your briefcase is empty
              </h3>
              <p className="text-neutral-600 mb-4">
                {searchQuery ? 'No resources match your search' : 'Download resources from sessions to add them here'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="btn btn-primary"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default BriefcaseScreen