import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../components/SocialWall/CreatePost';
import PostCard from '../components/SocialWall/PostCard';

export const SocialWallPage = () => {
  const navigate = useNavigate();
  // YOUR NEW STATE:
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Added 'id' to userProfile so we can filter "My Posts"
  const userProfile = {
    id: "user123",
    firstName: "Ravi",
    lastName: "Raja",
    avatar: null
  };

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { id: "other1", name: "Sarah Jenkins", title: "AI Researcher", initials: "SJ" },
      content: "Amazing keynote on Agentic AI today! The future of automation is here. 🚀 #EventAI #FutureOfWork",
      likes: 12,
      comments: [{ name: "Alex", text: "Totally agree!" }],
      timestamp: new Date(),
      isLikedByUser: true
    },
    {
      id: 2,
      author: { id: "other2", name: "David Chen", title: "Product Manager", initials: "DC" },
      content: "Just grabbed a coffee at the Hub. Anyone want to meet up and discuss the Picbot architecture? #Networking",
      likes: 4,
      comments: [],
      timestamp: new Date(Date.now() - 3600000), 
      isLikedByUser: false
    }
  ]);

  const handleNewPost = (newPostData) => {
    const newPost = {
      id: Date.now(),
      author: { id: userProfile.id, name: `${userProfile.firstName} ${userProfile.lastName}`, title: "Agentic AI Engineer", initials: "RR" },
      content: newPostData.content,
      image: newPostData.image,
      likes: 0,
      comments: [],
      timestamp: newPostData.timestamp,
      isLikedByUser: false
    };
    setPosts([newPost, ...posts]);
  };

  // YOUR HASHTAG EXTRACTOR:
  // (I added 'Set' so it only shows unique tags instead of repeating ones!)
  const trendingHashtags = [...new Set(posts.flatMap(p => p.content.match(/#\w+/g)).filter(Boolean))];

  // YOUR FILTER LOGIC:
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterTab === 'liked') return matchesSearch && post.isLikedByUser;
    // Your new 'mine' condition:
    if (filterTab === 'mine') return matchesSearch && post.author.id === userProfile.id;
    
    return matchesSearch; // 'all' fallback
  });

  return (
    <div className="bg-slate-950 h-screen w-full overflow-y-auto text-white font-sans flex flex-col pb-32">
      
      <div className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md px-6 py-4 border-b border-white/10 flex justify-between items-center shadow-lg">
        <button onClick={() => navigate('/hub')} className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-lg hover:bg-slate-800 transition-colors">←</button>
        <h1 className="font-bold text-lg tracking-wide">Social Wall</h1>
        <div className="w-10"></div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 w-full flex-1">
        <CreatePost userProfile={userProfile} onPostSubmit={handleNewPost} />

        {/* Trending Hashtags UI */}
        {trendingHashtags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs text-slate-400 font-bold py-1">Trending:</span>
            {trendingHashtags.map((tag, i) => (
              <span key={i} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-1 rounded-md border border-blue-500/30">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mb-4 relative">
          <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 text-white placeholder-slate-500"
          />
        </div>

        {/* Updated Filter Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-2">
          {['all', 'liked', 'mine'].map(tab => (
            <button 
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors capitalize ${filterTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              {tab === 'mine' ? 'My Posts' : tab}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-10 text-slate-500"><p>No posts found. 😢</p></div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-lg border-t border-white/10 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center text-slate-400 hover:text-white"><span className="text-xl mb-1">🏠</span><span className="text-[10px]">Home</span></button>
        <button onClick={() => navigate('/hub')} className="flex flex-col items-center text-blue-500"><span className="text-xl mb-1">⚡</span><span className="text-[10px] font-bold">Hub</span></button>
      </div>
    </div>
  );
};

export default SocialWallPage;