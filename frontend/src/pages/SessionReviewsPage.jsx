// ============================================================================
// FEATURE 17: PAGE 16 - RATINGS & SESSION REVIEWS
// ============================================================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Modular Reviews Components
import { ReviewCard, RatingCard } from '../components/Reviews/ReviewCard';
import { ReviewStats, RatingStats } from '../components/Reviews/ReviewStats';
import { ReviewForm, RatingModal } from '../components/Reviews/ReviewForm';

// No missing CSS files needed - fully styled with Tailwind!
const API_BASE = 'http://127.0.0.1:8000';

export const SessionsReviewPage = ({ sessionId = 1 }) => {
  const navigate = useNavigate();

  // ==========================================================================
  // STATE 1: EXISTING CODE (Session Reviews API)
  // ==========================================================================
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');

  // ==========================================================================
  // STATE 2: UPDATED CODE (Ratings Dashboard UI)
  // ==========================================================================
  const [userProfile, setUserProfile] = useState(null);
  const [ratingItems, setRatingItems] = useState([]);
  const [userRatings, setUserRatings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('sessions');
  const [filteredItems, setFilteredItems] = useState([]);

  // ============= MOCK RATING ITEMS DATA =============
  const initialItems = [
    // SESSIONS
    { id: 'session-1', type: 'Session', category: 'sessions', icon: '📅', title: 'AI-Ready HR Leaders: Transforming Talent Strategy', description: 'Learn how to leverage AI to transform your talent strategy', averageRating: 4.7, totalRatings: 124, speaker: 'Sarah Johnson' },
    { id: 'session-2', type: 'Session', category: 'sessions', icon: '📅', title: 'Future Workplace Technologies', description: 'Explore emerging technologies shaping the future of work', averageRating: 4.5, totalRatings: 98, speaker: 'Mike Chen' },
    { id: 'session-3', type: 'Session', category: 'sessions', icon: '📅', title: 'Digital HR Summit - Next Generation Tools', description: 'Discover cutting-edge HR technology solutions', averageRating: 4.6, totalRatings: 112, speaker: 'Emily Davis' },
    { id: 'session-4', type: 'Session', category: 'sessions', icon: '📅', title: 'Personal Branding in HR', description: 'Build your personal brand as an HR professional', averageRating: 4.8, totalRatings: 87, speaker: 'Jennifer Lee' },
    // SPEAKERS
    { id: 'speaker-1', type: 'Speaker', category: 'speakers', icon: '🎤', title: 'Sarah Johnson', description: 'Chief People Officer at Microsoft India', averageRating: 4.8, totalRatings: 156 },
    { id: 'speaker-2', type: 'Speaker', category: 'speakers', icon: '🎤', title: 'Mike Chen', description: 'VP Talent & Culture at Google Asia', averageRating: 4.6, totalRatings: 134 },
    { id: 'speaker-3', type: 'Speaker', category: 'speakers', icon: '🎤', title: 'Patricia White', description: 'Learning & Development Expert', averageRating: 4.7, totalRatings: 98 },
    // EVENT EXPERIENCE
    { id: 'event-1', type: 'Event Experience', category: 'experience', icon: '🎉', title: 'EventAI Venue & Logistics', description: 'Rate your experience with venue, facilities, and logistics', averageRating: 4.4, totalRatings: 267 },
    { id: 'event-2', type: 'Event Experience', category: 'experience', icon: '🎉', title: 'Networking Sessions Quality', description: 'Rate the quality and effectiveness of networking opportunities', averageRating: 4.6, totalRatings: 245 },
    { id: 'event-3', type: 'Event Experience', category: 'experience', icon: '🎉', title: 'Overall Event Experience', description: 'Rate your overall EventAI experience', averageRating: 4.7, totalRatings: 312 },
    // PARTNERS
    { id: 'partner-1', type: 'Partner', category: 'partners', icon: '🤝', title: 'Microsoft India', description: 'Rate the Microsoft India booth and team interaction', averageRating: 4.5, totalRatings: 89 },
    { id: 'partner-2', type: 'Partner', category: 'partners', icon: '🤝', title: 'SAP SuccessFactors', description: 'Rate your interaction with the SAP team', averageRating: 4.3, totalRatings: 76 },
  ];

  // ==========================================================================
  // EFFECTS & LOGIC 1: API FETCHING (Existing Code)
  // ==========================================================================
  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [sortBy, sessionId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/reviews/session/${sessionId}`, {
        params: { event_id: 1, sort_by: sortBy, limit: 50 }
      }).catch(() => ({ data: { reviews: [] } })); // Silent catch for Dev Mode offline backend
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/reviews/stats/${sessionId}`, {
        params: { event_id: 1 }
      }).catch(() => ({ data: null })); // Silent catch for Dev Mode offline backend
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleReviewSubmitted = () => {
    fetchReviews();
    fetchStats();
  };

  // ==========================================================================
  // EFFECTS & LOGIC 2: RATINGS DASHBOARD (Updated Code)
  // ==========================================================================
  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    if (!profile) {
      // DEV MODE Fallback to prevent redirect loops while building
      setUserProfile({ name: 'Test User' }); 
      // navigate('/auth/login'); return;
    } else {
      setUserProfile(JSON.parse(profile));
    }
    setRatingItems(initialItems);
    filterByTab('sessions');
  }, [navigate]);

  const filterByTab = (tabName) => {
    setActiveTab(tabName);
    const filtered = initialItems.filter((item) => item.category === tabName);
    setFilteredItems(filtered);
  };

  const handleRateClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmitRating = (ratingData) => {
    const existingRatingIndex = userRatings.findIndex((r) => r.itemId === ratingData.itemId);
    if (existingRatingIndex > -1) {
      const updatedRatings = [...userRatings];
      updatedRatings[existingRatingIndex] = ratingData;
      setUserRatings(updatedRatings);
    } else {
      setUserRatings([...userRatings, ratingData]);
    }

    setRatingItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === ratingData.itemId) {
          const allRatings = [
            ...userRatings.filter((r) => r.itemId === ratingData.itemId).map((r) => r.rating),
            ratingData.rating,
          ];
          const newAverage = allRatings.reduce((a, b) => a + b, 0) / allRatings.length;
          return {
            ...item,
            averageRating: newAverage,
            totalRatings: item.totalRatings + 1,
          };
        }
        return item;
      })
    );
  };

  const hasUserRated = (itemId) => userRatings.some((r) => r.itemId === itemId);
  const handleBack = () => navigate('/hub');
  const handlePicbot = () => navigate('/picbot');

  if (!userProfile) {
    return (
      <div className="ratings-loading min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="ratings-spinner animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const allUserRatings = userRatings.map((r) => r.rating);
  const overallAverage = allUserRatings.length > 0
    ? allUserRatings.reduce((a, b) => a + b, 0) / allUserRatings.length
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col w-full">

      <div className="flex-1 overflow-y-auto px-6 py-8 max-w-7xl mx-auto w-full">
        
        {/* ========================================================= */}
        {/* SECTION 1: RATINGS DASHBOARD (From Updated Code)          */}
        {/* ========================================================= */}
        
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
            <h1 className="text-4xl font-bold text-white mb-1">Ratings</h1>
            <p className="text-slate-400">Rate sessions, speakers & experience</p>
          </div>
        </div>

        {/* Your Rating Summary */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg p-6 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="text-4xl">⭐</div>
            <div>
              <p className="text-slate-400 font-semibold text-sm">Your Ratings</p>
              <p className="text-white">
                <span className="text-2xl font-bold mr-2">{userRatings.length}</span>
                <span className="text-slate-400">ratings submitted</span>
              </p>
              {userRatings.length > 0 && (
                <p className="text-orange-400 mt-1 text-sm">
                  Your average: <strong>{overallAverage.toFixed(1)}/5</strong>
                </p>
              )}
            </div>
          </div>
          <div className="ratings-summary-action">
            {userRatings.length > 0 && (
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">✓ Active</span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-slate-700 pb-4 overflow-x-auto">
          {[
            { id: 'sessions', label: 'Sessions (4)' },
            { id: 'speakers', label: 'Speakers (3)' },
            { id: 'experience', label: 'Experience (3)' },
            { id: 'partners', label: 'Partners (2)' }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-semibold transition-all whitespace-nowrap rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-orange-400 border-b-2 border-orange-500 bg-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              onClick={() => filterByTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-4 flex gap-4 mb-8">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="text-white font-semibold text-lg">Help Us Improve</h3>
            <p className="text-blue-200 text-sm mt-1">
              Your feedback helps us deliver better experiences for future events
            </p>
          </div>
        </div>

        {/* Rating Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <RatingCard
                key={item.id}
                item={item}
                onRateClick={handleRateClick}
                hasRated={hasUserRated(item.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-lg font-medium text-white mb-1">No items to rate</p>
            </div>
          )}
        </div>

        {/* Overall Event Statistics */}
        {ratingItems.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6">📊 Event Statistics</h3>
            <RatingStats
              ratings={ratingItems}
              averageRating={
                ratingItems.length > 0
                  ? ratingItems.reduce((sum, item) => sum + item.averageRating, 0) / ratingItems.length
                  : 0
              }
              totalRatings={ratingItems.reduce((sum, item) => sum + item.totalRatings, 0)}
            />
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl shadow-lg mt-8 mb-16">
          <h3 className="text-lg font-bold text-white mb-4">💫 Rating Tips</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li>✓ Your honest feedback is valuable to us</li>
            <li>✓ Detailed feedback helps us improve the most</li>
            <li>✓ You can edit your ratings anytime</li>
            <li>✓ All feedback is kept confidential</li>
            <li>✓ Help us reach 100% event feedback!</li>
          </ul>
        </div>


        {/* ========================================================= */}
        {/* SECTION 2: SESSION REVIEWS API (From Existing Code)       */}
        {/* ========================================================= */}
        
        <div className="border-t border-slate-700 pt-16 mb-8 max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              💬 Detailed Session Reviews
            </h1>
            <p className="text-slate-400">
              Help other attendees by sharing your experience
            </p>
          </div>

          {/* Review Form */}
          <ReviewForm sessionId={sessionId} onSubmit={handleReviewSubmitted} />

          {/* Detailed API Stats */}
          {stats && <ReviewStats stats={stats} />}

          {/* Sort Options */}
          <div className="mb-6 flex gap-3 flex-wrap justify-center">
            {['recent', 'helpful', 'rating_high', 'rating_low'].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSortBy(option)}
                className={`
                  px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer border
                  ${sortBy === option
                    ? 'bg-orange-600 border-orange-500 text-white shadow-lg'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-orange-500'
                  }
                `}
              >
                {option === 'recent' && '🕐 Recent'}
                {option === 'helpful' && '👍 Most Helpful'}
                {option === 'rating_high' && '⭐⭐⭐⭐⭐ Highest'}
                {option === 'rating_low' && '⭐ Lowest'}
              </button>
            ))}
          </div>

          {/* Reviews List */}
          <div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 bg-slate-800 rounded-xl animate-pulse border border-slate-700" />
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-xl shadow-md">
                <p className="text-slate-400 text-lg">
                  No reviews yet. Be the first to review this session!
                </p>
              </div>
            ) : (
              <div>
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} onHelpful={handleReviewSubmitted} />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Rating Modal */}
      <RatingModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitRating={handleSubmitRating}
      />
    </div>
  );
};

// Satisfy both naming conventions from your prompts!
export const RatingsScreen = SessionsReviewPage;
export default SessionsReviewPage;