// ============================================================================
// Partners Screen
// ============================================================================
// File: src/pages/engagement/PartnersScreen.jsx
// Purpose: Display event partners and sponsors
// Status: Production-Ready ✅

import React, { useEffect, useState } from 'react'
import { Globe, MapPin, Users, Award, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '../../components/layout/Header'
import BottomNavigation from '../../components/layout/BottomNavigation'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import apiClient from '../../config/apiClient'

const PartnersScreen = () => {
  const [loading, setLoading] = useState(true)
  const [partners, setPartners] = useState([])
  const [filteredPartners, setFilteredPartners] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTier, setSelectedTier] = useState('')
  const [categories, setCategories] = useState([])
  const [tiers, setTiers] = useState([])

  useEffect(() => {
    loadPartners()
  }, [selectedCategory, selectedTier])

  const loadPartners = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 50,
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedTier && { tier: selectedTier })
      }

      const response = await apiClient.get('/partnerships', { params })
      const data = response.data.data || []
      
      setPartners(data)
      setFilteredPartners(data)

      // Extract unique categories and tiers
      const uniqueCategories = [...new Set(data.map(p => p.category))]
      const uniqueTiers = [...new Set(data.map(p => p.tier))]
      
      setCategories(uniqueCategories)
      setTiers(uniqueTiers)
    } catch (error) {
      console.error('Error loading partners:', error)
      toast.error('Failed to load partners')
    } finally {
      setLoading(false)
    }
  }

  const getTierColor = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-cyan-100 text-cyan-900 border-cyan-300'
      case 'gold':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300'
      case 'silver':
        return 'bg-gray-100 text-gray-900 border-gray-300'
      case 'bronze':
        return 'bg-orange-100 text-orange-900 border-orange-300'
      default:
        return 'bg-neutral-100 text-neutral-900 border-neutral-300'
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
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Partners & Sponsors</h1>
            <p className="text-white/80">
              Meet the organizations powering this event
            </p>
          </div>
        </div>

        <div className="container-max py-8">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {tiers.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Sponsorship Tier
                </label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Tiers</option>
                  {tiers.map(tier => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Partners Grid */}
          {filteredPartners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition-all hover:scale-105 active:scale-100"
                >
                  {/* Logo Section */}
                  <div className="h-40 bg-neutral-100 flex items-center justify-center p-6 border-b border-neutral-200">
                    {partner.logo_url ? (
                      <img
                        src={partner.logo_url}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Award className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
                        <p className="text-xs text-neutral-600">{partner.name}</p>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Name & Tier */}
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">
                      {partner.name}
                    </h3>

                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getTierColor(partner.tier)}`}>
                        {partner.tier}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {partner.description}
                    </p>

                    {/* Info Grid */}
                    <div className="space-y-2 mb-6 text-sm">
                      {partner.industry && (
                        <div className="flex items-center gap-2 text-neutral-700">
                          <Globe className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <span>{partner.industry}</span>
                        </div>
                      )}

                      {partner.location && (
                        <div className="flex items-center gap-2 text-neutral-700">
                          <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <span>{partner.location}</span>
                        </div>
                      )}

                      {partner.employees && (
                        <div className="flex items-center gap-2 text-neutral-700">
                          <Users className="w-4 h-4 text-primary-600 flex-shrink-0" />
                          <span>{partner.employees} employees</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2 pt-4 border-t border-neutral-200">
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full btn btn-outline btn-sm flex items-center justify-center gap-2"
                        >
                          <Globe className="w-4 h-4" />
                          Visit Website
                        </a>
                      )}

                      <button className="w-full btn btn-primary btn-sm flex items-center justify-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-lg border border-neutral-200 p-12 text-center">
              <Award className="w-12 h-12 text-neutral-400 mx-auto mb-4 opacity-50" />
              <p className="text-neutral-600 mb-4">No partners found</p>
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setSelectedTier('')
                }}
                className="btn btn-primary"
              >
                View All Partners
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </>
  )
}

export default PartnersScreen