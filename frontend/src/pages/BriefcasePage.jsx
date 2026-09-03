import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Components
import DocumentList from '../components/Resources/DocumentList';
import ResourceCategoryTab from '../components/Resources/ResourceCategoryTab';
import ResourceCard from '../components/Resources/DocumentCard';

// Pointing to DownloadButton.jsx since you merged the modal code there!
import ResourceDownloadModal from '../components/Resources/DownloadButton';

// Styles
import '../styles/briefcase.css';

const API_BASE = 'http://127.0.0.1:8000';

export const BriefcasePage = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE FROM EXISTING CODE (API & Filters)
  // ==========================================
  const [resources, setResources] = useState([]);
  const [briefcaseItems, setBriefcaseItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('all'); // all, briefcase, featured
  const [fileType, setFileType] = useState('all');
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // ==========================================
  // STATE FROM UPDATED CODE (UI & Modals)
  // ==========================================
  const [userProfile, setUserProfile] = useState(null);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadedResources, setDownloadedResources] = useState([]);
  const [bookmarkedResources, setBookmarkedResources] = useState([]);

  // ============= RESOURCE CATEGORIES =============
  const categories = [
    { id: 'all', label: 'All Resources', icon: '📚', count: 0 },
    { id: 'template', label: 'Templates', icon: '📋', count: 0 },
    { id: 'guide', label: 'Guides', icon: '📖', count: 0 },
    { id: 'case_study', label: 'Case Studies', icon: '📑', count: 0 },
    { id: 'whitepaper', label: 'Whitepapers', icon: '📄', count: 0 },
    { id: 'video', label: 'Videos', icon: '🎬', count: 0 },
    { id: 'tool', label: 'Tools', icon: '🛠️', count: 0 },
  ];

  // ============= MOCK RESOURCES DATA =============
  const initialResources = [
    {
      id: 'res-1',
      title: 'HR Strategy Template',
      description: 'Comprehensive template for developing a 3-year HR strategy aligned with business objectives.',
      category: 'template',
      author: 'EVENT AI Expert Panel',
      publishedDate: '2026-03-15',
      fileSize: 2500000,
      fileType: 'docx',
      tags: ['Strategy', 'Planning', 'HR'],
      downloads: 1240,
      rating: 4.8,
      previewUrl: 'https://via.placeholder.com/400x500?text=HR+Strategy',
      features: ['Executive summary template', 'SWOT analysis framework', 'Strategic goals worksheet', 'Implementation roadmap', 'Resource planning guide'],
    },
    {
      id: 'res-2',
      title: 'Employee Engagement Survey',
      description: 'Ready-to-use survey questions and scoring framework for measuring employee engagement.',
      category: 'template',
      author: 'Engagement Research Team',
      publishedDate: '2026-02-20',
      fileSize: 1800000,
      fileType: 'xlsx',
      tags: ['Engagement', 'Survey', 'Analytics'],
      downloads: 856,
      rating: 4.6,
      previewUrl: 'https://via.placeholder.com/400x500?text=Survey',
      features: ['30 survey questions', 'Scoring guide', 'Analysis dashboard', 'Benchmark data', 'Action planning worksheet'],
    },
    {
      id: 'res-3',
      title: 'AI in HR Implementation Guide',
      description: 'Step-by-step guide for implementing AI solutions in HR processes and decision-making.',
      category: 'guide',
      author: 'AI Adoption Experts',
      publishedDate: '2026-03-01',
      fileSize: 4200000,
      fileType: 'pdf',
      tags: ['AI', 'Implementation', 'Technology', 'Digital'],
      downloads: 2103,
      rating: 4.9,
      previewUrl: 'https://via.placeholder.com/400x500?text=AI+Guide',
      features: ['Use case identification', 'Vendor evaluation framework', 'Change management playbook', 'Skills assessment', 'ROI calculator'],
    }
  ];

  // ==========================================
  // EFFECT HOOKS & API CALLS
  // ==========================================
  
  // 1. Existing API Fetch Logic
  useEffect(() => {
    fetchAllData();
  }, [fileType, category]);

const fetchAllData = async () => {
    setLoading(true);
    
    // 🛑 DEV MODE: Bypassing actual axios.get calls to prevent 404 Console Errors!
    // We are relying entirely on local state and mock data right now.

    try {
      // Mocking the stats so your UI still looks great and populated
      setStats({
        total_resources: 8,
        total_downloads: 12450,
        total_views: 45200
      });
      
      // Simulating a tiny network delay for a smooth user experience
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (err) {
      console.error('Error in mock data:', err);
    } finally {
      setLoading(false);
    }
  };
  // 2. Updated User Profile & Mock Data Logic
  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (!profile) {
      // Mock profile for Dev Mode to stop redirect loops!
      setUserProfile({ name: 'Test User' }); 
    } else {
      setUserProfile(JSON.parse(profile));
    }
    setResources(initialResources);
    setFilteredResources(initialResources);
  }, [navigate]);

  // 3. Update Category Counts
  useEffect(() => {
    const updatedCategories = categories.map((cat) => {
      if (cat.id === 'all') {
        return { ...cat, count: resources.length };
      }
      return {
        ...cat,
        count: resources.filter((r) => r.category === cat.id || r.resource_category === cat.id).length,
      };
    });
  }, [resources]);

  // ==========================================
  // FILTERING LOGIC (Combined)
  // ==========================================
  
  // Filter resources based on Existing Code search
  let currentFilteredResources = resources.filter((r) =>
    (r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (view === 'briefcase') {
    currentFilteredResources = briefcaseItems.map((item) => item.resource).filter((r) =>
      r.title && r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } else if (view === 'featured') {
    currentFilteredResources = currentFilteredResources.filter((r) => r.is_featured);
  }

  // Update the UI state whenever filters change
  useEffect(() => {
    setFilteredResources(currentFilteredResources);
  }, [searchTerm, view, resources, briefcaseItems]);

  const applyFilters = (catId, query) => {
    let filtered = resources;
    if (catId !== 'all') {
      filtered = filtered.filter((r) => r.category === catId || r.resource_category === catId);
    }
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter((r) =>
        (r.title && r.title.toLowerCase().includes(lowerQuery)) ||
        (r.description && r.description.toLowerCase().includes(lowerQuery))
      );
    }
    setFilteredResources(filtered);
  };

  // ==========================================
  // EVENT HANDLERS (Updated for Dev Mode UI)
  // ==========================================

  const handleSaveBriefcase = async (resourceId) => {
    // 1. Instantly update UI for frontend
    const resourceToAdd = resources.find(r => r.id === resourceId);
    if (resourceToAdd && !briefcaseItems.some(item => item.resource?.id === resourceId)) {
      setBriefcaseItems(prev => [...prev, { briefcase: { id: Date.now() }, resource: resourceToAdd }]);
    }
    
    // 2. Try API (Will silently fail gracefully if backend is off)
    try {
      await axios.post(`${API_BASE}/api/briefcase/save`, null, {
        params: { user_id: 1, event_id: 1, resource_id: resourceId }
      });
    } catch (err) {
      console.log('Saved to local state (Backend offline)');
    }
  };

  const handleRemoveBriefcase = async (resourceId) => {
    // 1. Instantly update UI for frontend
    setBriefcaseItems(prev => prev.filter(item => item.resource?.id !== resourceId));

    // 2. Try API
    try {
      const briefcaseItem = briefcaseItems.find((item) => item.resource?.id === resourceId);
      if (briefcaseItem) {
        await axios.delete(`${API_BASE}/api/briefcase/${briefcaseItem.briefcase.id}`, {
          params: { user_id: 1 }
        });
      }
    } catch (err) {
      console.log('Removed from local state (Backend offline)');
    }
  };

  const handleToggleStar = (resourceId) => {
    // Instantly toggle the is_featured flag so it shows up in the Featured tab
    setResources(prev => prev.map(r => 
      r.id === resourceId ? { ...r, is_featured: !r.is_featured } : r
    ));
  };

  // Updated Handlers
  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCategory(categoryId); // Sync existing code category
    applyFilters(categoryId, searchQuery);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchTerm(query); // Sync existing code search term
    applyFilters(activeCategory, query);
  };

  const handleDownload = (resourceId) => {
    const resource = resources.find((r) => r.id === resourceId);
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleConfirmDownload = (resourceId) => {
    if (!downloadedResources.includes(resourceId)) {
      setDownloadedResources([...downloadedResources, resourceId]);
    }
    alert(`Resource downloaded successfully!`);
  };

  const handlePreview = (resourceId) => {
    const resource = resources.find((r) => r.id === resourceId);
    if (resource?.previewUrl) {
      window.open(resource.previewUrl, '_blank');
    }
  };

  const handleShare = (resourceId, shareType) => {
    const resource = resources.find((r) => r.id === resourceId);
    if (shareType === 'bookmark') {
      if (!bookmarkedResources.includes(resourceId)) {
        setBookmarkedResources([...bookmarkedResources, resourceId]);
        alert(`${resource?.title} bookmarked!`);
      } else {
        setBookmarkedResources(bookmarkedResources.filter((id) => id !== resourceId));
        alert(`${resource?.title} removed from bookmarks!`);
      }
    } else {
      alert(`Share option: ${shareType}\nResource: ${resource?.title}`);
    }
  };

  const handleBack = () => navigate('/hub');

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col w-full">

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">
        
        {/* ================= HEADER ================= */}
        <div className="flex items-center mb-8">
          <button
            className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-white mr-4 transition-colors"
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              💼 Briefcase & Resources
            </h1>
            <p className="text-slate-400">
              Download presentations, guides, and event materials
            </p>
          </div>
        </div>

        {/* ================= STATISTICS ================= */}
        {stats ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-blue-500">{stats.total_resources}</p>
              <p className="text-sm text-slate-400 mt-2">Resources</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-emerald-500">{stats.total_downloads}</p>
              <p className="text-sm text-slate-400 mt-2">Downloads</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-purple-500">{stats.total_views}</p>
              <p className="text-sm text-slate-400 mt-2">Views</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 text-center">
              <p className="text-3xl font-bold text-orange-500">{briefcaseItems.length}</p>
              <p className="text-sm text-slate-400 mt-2">In Briefcase</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-slate-800 rounded-xl shadow p-4 border border-slate-700 text-center">
              <p className="text-sm text-slate-400">Resources</p>
              <p className="text-2xl font-bold text-white">{resources.length}</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow p-4 border border-slate-700 text-center">
              <p className="text-sm text-slate-400">Downloaded</p>
              <p className="text-2xl font-bold text-white">{downloadedResources.length}</p>
            </div>
            <div className="bg-slate-800 rounded-xl shadow p-4 border border-slate-700 text-center">
              <p className="text-sm text-slate-400">Bookmarked</p>
              <p className="text-2xl font-bold text-white">{bookmarkedResources.length}</p>
            </div>
          </div>
        )}

        {/* ================= SEARCH & DROPDOWNS ================= */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8 border border-slate-700">
          
          <div className="mb-6 relative">
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-3 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-900 text-white placeholder-slate-500"
            />
          </div>

          <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4 overflow-x-auto">
            {[
              { id: 'all', label: '📋 All Resources' },
              { id: 'briefcase', label: '💼 My Briefcase' },
              { id: 'featured', label: '⭐ Featured' }
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`
                  px-4 py-2 font-semibold transition-all whitespace-nowrap rounded-t-lg
                  ${view === v.id
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-slate-900'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                  }
                `}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {view === 'all' && (
              <>
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-2">File Type</p>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-900 text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="pdf">📄 PDF</option>
                    <option value="doc">📝 Document</option>
                    <option value="ppt">🎨 Presentation</option>
                    <option value="xls">📊 Spreadsheet</option>
                    <option value="video">🎬 Video</option>
                  </select>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-2">Category</p>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setActiveCategory(e.target.value); 
                    }}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-900 text-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="presentation">🎨 Presentation</option>
                    <option value="handout">📝 Handout</option>
                    <option value="guide">📖 Guide</option>
                    <option value="template">📋 Template</option>
                    <option value="recording">🎬 Recording</option>
                    <option value="article">📰 Article</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ================= CATEGORY TABS ================= */}
        <div className="mb-6">
          <ResourceCategoryTab
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* ================= INFO BANNER ================= */}
        <div className="bg-blue-900/40 border border-blue-500/30 rounded-xl p-4 flex gap-4 mb-8">
          <div className="text-2xl">💼</div>
          <div>
            <h3 className="text-white font-semibold text-lg">Your Resource Library</h3>
            <p className="text-blue-200 text-sm mt-1">
              Download templates, guides, and tools to maximize your EVENT AI Expert Panel experience
            </p>
          </div>
        </div>

        {/* ================= RESOURCES GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onDownload={handleDownload}
                onPreview={handlePreview}
                onShare={handleShare}
                isSaved={briefcaseItems.some(item => item.resource?.id === resource.id)}
                onSaveBriefcase={() => handleSaveBriefcase(resource.id)}
                onRemoveBriefcase={() => handleRemoveBriefcase(resource.id)}
                onToggleStar={() => handleToggleStar(resource.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-lg font-medium text-white mb-1">No resources found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* ================= DOCUMENT LIST ================= */}
        <div className="mb-12 border-t border-slate-700 pt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Detailed Document List</h2>
          <DocumentList
            resources={currentFilteredResources}
            briefcaseItems={briefcaseItems || []}
            onSaveBriefcase={handleSaveBriefcase}
            onRemoveBriefcase={handleRemoveBriefcase}
            onDownload={fetchAllData}
            loading={loading}
          />
        </div>

        {/* ================= TIPS ================= */}
        {filteredResources.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg mt-8">
            <h3 className="text-lg font-bold text-white mb-4">💡 Resource Tips</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>✓ All resources are available offline after download</li>
              <li>✓ Use templates as-is or customize for your organization</li>
              <li>✓ Bookmark resources for quick access later</li>
              <li>✓ Share resources with your team via email</li>
              <li>✓ Preview before downloading to verify content</li>
            </ul>
          </div>
        )}

      </div>

      {/* ================= DOWNLOAD MODAL ================= */}
      <ResourceDownloadModal
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirmDownload={handleConfirmDownload}
      />
      
    </div>
  );
};

export default BriefcasePage;