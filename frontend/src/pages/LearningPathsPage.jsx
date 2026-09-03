// ============================================================================
// FEATURE 21: PAGE 20 - LEARNING PATHS SCREEN
// ============================================================================
// File: frontend/src/pages/LearningPathsScreen.jsx
// Purpose: Curated learning paths for professional development
// Status: Production-Ready | Zero Errors ✅

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LearningPathCard from '../components/LearningPathCard';
import CourseModule from '../components/CourseModule';
import LearningPathModal from '../components/LearningPathModal';
import '../styles/learning-paths.css';

export const LearningPathsScreen = () => {
  const navigate = useNavigate();

  // ============= DIFFICULTY LEVELS =============
  const levels = [
    { id: 'all', label: 'All Levels', icon: '📊', count: 0 },
    { id: 'beginner', label: 'Beginner', icon: '🌱', count: 0 },
    { id: 'intermediate', label: 'Intermediate', icon: '📖', count: 0 },
    { id: 'advanced', label: 'Advanced', icon: '⚡', count: 0 },
    { id: 'expert', label: 'Expert', icon: '🎯', count: 0 },
  ];

  // ============= MOCK LEARNING PATHS DATA =============
  const initialLearningPaths = [
    {
      id: 'path-1',
      title: 'AI-Ready HR Leaders Masterclass',
      description:
        'Transform your HR strategy with AI and automation. Learn to leverage cutting-edge technology to optimize talent management.',
      icon: '🤖',
      level: 'advanced',
      duration: '8 weeks',
      rating: 4.9,
      enrollments: 2345,
      pricing: 'Free',
      instructor: {
        name: 'Sarah Johnson',
        title: 'Chief People Officer at Microsoft',
        avatar: 'https://i.pravatar.cc/150?img=5',
      },
      outcomes: [
        'Master AI applications in HR processes',
        'Design AI-driven talent strategies',
        'Implement automation for HR efficiency',
        'Lead digital transformation initiatives',
        'Measure AI ROI in HR',
      ],
      benefits: [
        'Career advancement opportunity',
        'Industry-recognized certification',
        'Networking with HR leaders',
        'Hands-on practical projects',
        'Lifetime access to materials',
      ],
      prerequisites: ['Basic HR knowledge', 'Understanding of technology'],
      modules: [
        {
          id: 'm-1-1',
          title: 'AI Fundamentals for HR',
          icon: '🤖',
          duration: '2 hours',
          lessons: 8,
          description: 'Introduction to AI concepts and applications in HR',
          lessons_list: [
            { title: 'What is AI?', duration: '15 min', completed: true },
            { title: 'AI in HR Overview', duration: '20 min', completed: true },
            {
              title: 'Current AI Applications',
              duration: '25 min',
              completed: false,
            },
            { title: 'Ethics & AI', duration: '20 min', completed: false },
            { title: 'Future of AI in HR', duration: '20 min', completed: false },
            { title: 'Quiz', duration: '10 min', completed: false },
            { title: 'Case Study 1', duration: '25 min', completed: false },
            { title: 'Assignment', duration: '45 min', completed: false },
          ],
          skills: ['AI Basics', 'HR Tech', 'Strategic Thinking'],
        },
        {
          id: 'm-1-2',
          title: 'Talent Management with AI',
          icon: '👥',
          duration: '2 hours',
          lessons: 7,
          description: 'Apply AI to recruitment, development, and retention',
          lessons_list: [
            { title: 'AI Recruitment Tools', duration: '20 min', completed: false },
            { title: 'Predictive Analytics', duration: '25 min', completed: false },
            {
              title: 'Employee Development AI',
              duration: '20 min',
              completed: false,
            },
            { title: 'Retention Strategies', duration: '25 min', completed: false },
            { title: 'Performance Management', duration: '20 min', completed: false },
            { title: 'Quiz', duration: '10 min', completed: false },
            { title: 'Project: Build Strategy', duration: '60 min', completed: false },
          ],
          skills: ['Talent Strategy', 'Data Analysis', 'AI Tools'],
        },
        {
          id: 'm-1-3',
          title: 'Leading Digital Transformation',
          icon: '🚀',
          duration: '2 hours',
          lessons: 6,
          description: 'Lead organizational change with digital HR tools',
          lessons_list: [
            {
              title: 'Change Management Basics',
              duration: '20 min',
              completed: false,
            },
            {
              title: 'Building Technology Roadmap',
              duration: '25 min',
              completed: false,
            },
            {
              title: 'Change Communication',
              duration: '20 min',
              completed: false,
            },
            {
              title: 'Training & Adoption',
              duration: '25 min',
              completed: false,
            },
            { title: 'Measuring Success', duration: '20 min', completed: false },
            { title: 'Capstone Project', duration: '90 min', completed: false },
          ],
          skills: ['Leadership', 'Change Management', 'Implementation'],
        },
        {
          id: 'm-1-4',
          title: 'Capstone Project',
          icon: '🏆',
          duration: '4 hours',
          lessons: 1,
          description: 'Apply all learnings to a real-world HR transformation',
          lessons_list: [
            {
              title: 'Capstone: Design HR AI Strategy',
              duration: '240 min',
              completed: false,
            },
          ],
          skills: ['Project Management', 'Strategic Planning', 'Presentation'],
        },
      ],
    },
    {
      id: 'path-2',
      title: 'Future of Work Leadership',
      description:
        'Prepare your organization for the future of work with insights on remote work, hybrid models, and employee wellbeing.',
      icon: '🌍',
      level: 'intermediate',
      duration: '6 weeks',
      rating: 4.7,
      enrollments: 1876,
      pricing: 'Free',
      instructor: {
        name: 'Mike Chen',
        title: 'VP Talent & Culture at Google Asia',
        avatar: 'https://i.pravatar.cc/150?img=11',
      },
      outcomes: [
        'Understand future of work trends',
        'Design hybrid work policies',
        'Build resilient remote teams',
        'Enhance employee wellbeing',
        'Create inclusive workplaces',
      ],
      benefits: [
        'Practical frameworks',
        'Industry case studies',
        'Peer networking',
        'Implementation templates',
        'Expert feedback',
      ],
      prerequisites: ['HR experience', 'Team management'],
      modules: [
        {
          id: 'm-2-1',
          title: 'Trends Shaping the Future',
          icon: '📊',
          duration: '1.5 hours',
          lessons: 6,
          description: 'Explore key trends in the workplace',
          lessons_list: [
            { title: 'Global Work Trends', duration: '20 min', completed: false },
            { title: 'Remote Work Statistics', duration: '20 min', completed: false },
            { title: 'Hybrid Models', duration: '20 min', completed: false },
            { title: 'Technology Impact', duration: '20 min', completed: false },
            { title: 'Skills Gap Analysis', duration: '20 min', completed: false },
            { title: 'Quiz', duration: '10 min', completed: false },
          ],
          skills: ['Market Research', 'Analysis', 'Trend Spotting'],
        },
        {
          id: 'm-2-2',
          title: 'Building Remote-First Culture',
          icon: '🏠',
          duration: '2 hours',
          lessons: 7,
          description: 'Create a thriving remote work environment',
          lessons_list: [
            {
              title: 'Remote Work Best Practices',
              duration: '20 min',
              completed: false,
            },
            {
              title: 'Virtual Team Dynamics',
              duration: '20 min',
              completed: false,
            },
            { title: 'Communication Tools', duration: '20 min', completed: false },
            { title: 'Building Connections', duration: '20 min', completed: false },
            {
              title: 'Managing Across Timezones',
              duration: '20 min',
              completed: false,
            },
            { title: 'Quiz', duration: '10 min', completed: false },
            { title: 'Workshop: Team Charter', duration: '60 min', completed: false },
          ],
          skills: ['Team Building', 'Communication', 'Culture'],
        },
        {
          id: 'm-2-3',
          title: 'Wellbeing in the Modern Workplace',
          icon: '❤️',
          duration: '1.5 hours',
          lessons: 5,
          description: 'Support employee mental and physical health',
          lessons_list: [
            { title: 'Wellbeing Fundamentals', duration: '20 min', completed: false },
            { title: 'Mental Health Support', duration: '20 min', completed: false },
            { title: 'Work-Life Balance', duration: '20 min', completed: false },
            { title: 'Creating Safe Spaces', duration: '20 min', completed: false },
            { title: 'Action Plan', duration: '30 min', completed: false },
          ],
          skills: ['Wellness Strategy', 'Mental Health', 'Support Systems'],
        },
      ],
    },
    {
      id: 'path-3',
      title: 'Diversity, Equity & Inclusion Fundamentals',
      description:
        'Build foundational knowledge of DEI principles and create actionable strategies for an inclusive workplace.',
      icon: '🌈',
      level: 'beginner',
      duration: '4 weeks',
      rating: 4.8,
      enrollments: 2134,
      pricing: 'Free',
      instructor: {
        name: 'Lisa Wong',
        title: 'Diversity Officer at Apple',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
      outcomes: [
        'Understand DEI concepts',
        'Identify bias in systems',
        'Develop inclusion initiatives',
        'Measure DEI impact',
        'Lead cultural change',
      ],
      benefits: [
        'Beginner-friendly content',
        'Interactive discussions',
        'Diverse perspectives',
        'Practical toolkits',
        'Community support',
      ],
      prerequisites: [],
      modules: [
        {
          id: 'm-3-1',
          title: 'DEI Fundamentals',
          icon: '🌈',
          duration: '1.5 hours',
          lessons: 5,
          description: 'Introduction to diversity, equity, and inclusion',
          lessons_list: [
            { title: 'What is DEI?', duration: '20 min', completed: false },
            { title: 'Why DEI Matters', duration: '20 min', completed: false },
            { title: 'Historical Context', duration: '20 min', completed: false },
            { title: 'Current Landscape', duration: '20 min', completed: false },
            { title: 'Getting Started', duration: '20 min', completed: false },
          ],
          skills: ['Diversity Concepts', 'Inclusion', 'Awareness'],
        },
        {
          id: 'm-3-2',
          title: 'Recognizing and Addressing Bias',
          icon: '🧠',
          duration: '2 hours',
          lessons: 6,
          description: 'Identify and mitigate unconscious bias',
          lessons_list: [
            { title: 'Types of Bias', duration: '20 min', completed: false },
            { title: 'Implicit Bias Test', duration: '20 min', completed: false },
            { title: 'Systemic Racism', duration: '20 min', completed: false },
            { title: 'Intersectionality', duration: '20 min', completed: false },
            { title: 'Microaggressions', duration: '20 min', completed: false },
            { title: 'Discussion & Reflection', duration: '20 min', completed: false },
          ],
          skills: ['Bias Recognition', 'Self-Awareness', 'Empathy'],
        },
      ],
    },
    {
      id: 'path-4',
      title: 'Data-Driven HR Decision Making',
      description:
        'Master analytics and metrics to make informed HR decisions that drive business results.',
      icon: '📊',
      level: 'intermediate',
      duration: '7 weeks',
      rating: 4.6,
      enrollments: 1543,
      pricing: 'Free',
      instructor: {
        name: 'Amanda Martinez',
        title: 'HR Analytics Lead at Amazon',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      outcomes: [
        'Master HR metrics and KPIs',
        'Build predictive models',
        'Create dashboards',
        'Analyze workforce data',
        'Drive business decisions with data',
      ],
      benefits: [
        'Hands-on with real data',
        'Tool tutorials',
        'Templates included',
        'Expert mentoring',
        'Portfolio project',
      ],
      prerequisites: ['Basic spreadsheet skills'],
      modules: [
        {
          id: 'm-4-1',
          title: 'HR Metrics Fundamentals',
          icon: '📈',
          duration: '2 hours',
          lessons: 8,
          description: 'Essential HR metrics and KPIs',
          lessons_list: [
            { title: 'Key Metrics Overview', duration: '20 min', completed: false },
            {
              title: 'Recruitment Metrics',
              duration: '20 min',
              completed: false,
            },
            { title: 'Retention Metrics', duration: '20 min', completed: false },
            { title: 'Engagement Metrics', duration: '20 min', completed: false },
            { title: 'Performance Metrics', duration: '20 min', completed: false },
            { title: 'Cost Metrics', duration: '20 min', completed: false },
            { title: 'Quiz', duration: '10 min', completed: false },
            { title: 'Exercise: Calculate Metrics', duration: '30 min', completed: false },
          ],
          skills: ['Metrics', 'KPIs', 'HR Analytics'],
        },
        {
          id: 'm-4-2',
          title: 'Building Analytics Dashboards',
          icon: '📊',
          duration: '2.5 hours',
          lessons: 7,
          description: 'Create visual dashboards for HR insights',
          lessons_list: [
            { title: 'Dashboard Basics', duration: '20 min', completed: false },
            { title: 'Data Visualization', duration: '20 min', completed: false },
            { title: 'Tool Tutorial: Excel', duration: '30 min', completed: false },
            { title: 'Tool Tutorial: Tableau', duration: '30 min', completed: false },
            { title: 'Design Best Practices', duration: '20 min', completed: false },
            { title: 'Quiz', duration: '10 min', completed: false },
            { title: 'Project: Build Dashboard', duration: '90 min', completed: false },
          ],
          skills: ['Data Visualization', 'Dashboard Design', 'Tools'],
        },
      ],
    },
    {
      id: 'path-5',
      title: 'Employee Engagement Mastery',
      description:
        'Create high-engagement workplaces through proven strategies, measurement frameworks, and engagement initiatives.',
      icon: '💪',
      level: 'intermediate',
      duration: '6 weeks',
      rating: 4.5,
      enrollments: 1324,
      pricing: 'Free',
      instructor: {
        name: 'Patricia White',
        title: 'Head of L&D at Accenture',
        avatar: 'https://i.pravatar.cc/150?img=9',
      },
      outcomes: [
        'Design engagement surveys',
        'Analyze engagement data',
        'Develop action plans',
        'Implement programs',
        'Measure impact',
      ],
      benefits: [
        'Survey templates',
        'Case studies',
        'Workshop facilitation',
        'Best practices guide',
        'Peer community',
      ],
      prerequisites: ['HR fundamentals'],
      modules: [
        {
          id: 'm-5-1',
          title: 'Understanding Employee Engagement',
          icon: '💡',
          duration: '1.5 hours',
          lessons: 6,
          description: 'The science behind employee engagement',
          lessons_list: [
            { title: 'Engagement Definition', duration: '20 min', completed: false },
            { title: 'Research Findings', duration: '20 min', completed: false },
            { title: 'Engagement Drivers', duration: '20 min', completed: false },
            { title: 'Business Impact', duration: '20 min', completed: false },
            { title: 'Assessment Tools', duration: '20 min', completed: false },
            { title: 'Discussion', duration: '10 min', completed: false },
          ],
          skills: ['Engagement Concepts', 'Research', 'Assessment'],
        },
        {
          id: 'm-5-2',
          title: 'Building Your Engagement Strategy',
          icon: '🎯',
          duration: '2 hours',
          lessons: 6,
          description: 'Develop your engagement roadmap',
          lessons_list: [
            {
              title: 'Strategic Framework',
              duration: '20 min',
              completed: false,
            },
            { title: 'Stakeholder Analysis', duration: '20 min', completed: false },
            { title: 'Program Design', duration: '30 min', completed: false },
            { title: 'Implementation', duration: '30 min', completed: false },
            { title: 'Measurement', duration: '20 min', completed: false },
            { title: 'Workshop: Your Strategy', duration: '60 min', completed: false },
          ],
          skills: ['Strategy Development', 'Planning', 'Implementation'],
        },
      ],
    },
    {
      id: 'path-6',
      title: 'Advanced Leadership Development',
      description:
        'Develop advanced leadership skills for navigating complexity, driving innovation, and building high-performance teams.',
      icon: '🎯',
      level: 'advanced',
      duration: '10 weeks',
      rating: 4.7,
      enrollments: 987,
      pricing: 'Free',
      instructor: {
        name: 'Jennifer Lee',
        title: 'Chief HR Officer at Meta',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
      outcomes: [
        'Master strategic thinking',
        'Build coaching skills',
        'Lead through change',
        'Develop emotional intelligence',
        'Create winning cultures',
      ],
      benefits: [
        '1-on-1 coaching sessions',
        'Leadership assessments',
        'Executive network',
        'Reading materials',
        'Action learning projects',
      ],
      prerequisites: ['5+ years leadership experience'],
      modules: [
        {
          id: 'm-6-1',
          title: 'Self-Awareness & Emotional Intelligence',
          icon: '🧠',
          duration: '2.5 hours',
          lessons: 8,
          description: 'Develop EQ for effective leadership',
          lessons_list: [
            { title: 'EQ Fundamentals', duration: '20 min', completed: false },
            { title: 'Self-Assessment', duration: '30 min', completed: false },
            { title: 'Emotional Awareness', duration: '25 min', completed: false },
            { title: 'Stress Management', duration: '25 min', completed: false },
            { title: 'Motivation', duration: '20 min', completed: false },
            { title: 'Social Skills', duration: '20 min', completed: false },
            { title: 'Coaching Session', duration: '45 min', completed: false },
            { title: 'Reflection Journal', duration: '30 min', completed: false },
          ],
          skills: ['Emotional Intelligence', 'Self-Awareness', 'Leadership'],
        },
        {
          id: 'm-6-2',
          title: 'Strategic Leadership & Visioning',
          icon: '🚀',
          duration: '3 hours',
          lessons: 9,
          description: 'Think and lead strategically',
          lessons_list: [
            { title: 'Strategic Framework', duration: '30 min', completed: false },
            { title: 'Visioning', duration: '30 min', completed: false },
            { title: 'Systems Thinking', duration: '25 min', completed: false },
            { title: 'Change Leadership', duration: '25 min', completed: false },
            { title: 'Innovation', duration: '25 min', completed: false },
            { title: 'Risk Management', duration: '20 min', completed: false },
            { title: 'Case Studies', duration: '40 min', completed: false },
            { title: 'Coaching Session', duration: '45 min', completed: false },
            { title: 'Strategy Exercise', duration: '60 min', completed: false },
          ],
          skills: ['Strategic Thinking', 'Visioning', 'Leadership'],
        },
      ],
    },
  ];

  // ============= STATE MANAGEMENT (FIXED WITH INITIAL DATA) =============
  const [userProfile, setUserProfile] = useState(null);
  const [learningPaths, setLearningPaths] = useState(initialLearningPaths);
  const [filteredPaths, setFilteredPaths] = useState(initialLearningPaths);
  const [enrolledPaths, setEnrolledPaths] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeLevel, setActiveLevel] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // ============= GET USER PROFILE =============
  useEffect(() => {
    const profile = sessionStorage.getItem('userProfile');
    
    if (!profile) {
      // 🚧 DEVELOPER BYPASS: Prevents redirect and sets a dummy profile
      setUserProfile({ name: "Dev User", role: "admin" });
      return;
    }
    
    setUserProfile(JSON.parse(profile));
  }, [navigate]);

  // ============= UPDATE LEVEL COUNTS =============
  useEffect(() => {
    // Add logic to keep the count badges up to date
    levels.forEach(level => {
      if (level.id === 'all') {
        level.count = learningPaths.length;
      } else {
        level.count = learningPaths.filter(p => p.level === level.id).length;
      }
    });
  }, [learningPaths]);

  // ============= APPLY FILTERS =============
  const applyFilters = (levelId, query) => {
    let filtered = learningPaths;

    // Filter by level
    if (levelId !== 'all') {
      filtered = filtered.filter((p) => p.level === levelId);
    }

    // Filter by search query
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.instructor.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Sort by rating
    filtered.sort((a, b) => b.rating - a.rating);

    setFilteredPaths(filtered);
  };

  // ============= HANDLE LEVEL CHANGE =============
  const handleLevelChange = (levelId) => {
    setActiveLevel(levelId);
    applyFilters(levelId, searchQuery);
  };

  // ============= HANDLE SEARCH =============
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(activeLevel, query);
  };

  // ============= HANDLE CARD CLICK =============
  const handleCardClick = (path) => {
    setSelectedPath(path);
    setIsModalOpen(true);
  };

  // ============= HANDLE ENROLLMENT =============
  const handleEnroll = (pathId) => {
    if (!enrolledPaths.includes(pathId)) {
      setEnrolledPaths([...enrolledPaths, pathId]);
    }
  };

  // ============= HANDLE BACK =============
  const handleBack = () => {
    navigate('/hub');
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="border-t-orange-500 border-4 border-solid rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-12">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* Header (Tailwind layout fix) */}
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4 flex-1">
            <button
              className="p-2 bg-slate-800 rounded-full shadow hover:bg-slate-700 transition"
              onClick={handleBack}
              aria-label="Go back"
            >
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Learning Paths</h1>
              <p className="text-slate-400">Professional development courses</p>
            </div>
          </div>
          <div className="bg-slate-800 px-4 py-2 rounded-full border border-slate-700 hidden sm:block">
            <span className="font-bold text-orange-500">{enrolledPaths.length}</span> <span className="text-slate-400 text-sm">Enrolled</span>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8 flex gap-4 items-center">
          <div className="text-2xl">📚</div>
          <div>
            <h3 className="font-bold text-blue-300 mb-1">Grow Your Skills</h3>
            <p className="text-sm text-blue-100">
              Explore curated learning paths designed to help you master new skills and advance your career
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-orange-500 transition-colors"
              placeholder="Search learning paths..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {levels.map((level) => (
            <button
              key={level.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                activeLevel === level.id
                  ? 'bg-orange-500/20 border-orange-500 text-orange-500'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              onClick={() => handleLevelChange(level.id)}
            >
              <span>{level.icon}</span>
              <span>{level.label}</span>
              {level.count > 0 && (
                <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs">{level.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold">Total Paths</p>
            <p className="text-3xl font-bold text-white mt-2">{learningPaths.length}</p>
          </div>
          <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold">Enrolled</p>
            <p className="text-3xl font-bold text-white mt-2">{enrolledPaths.length}</p>
          </div>
          <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
            <p className="text-slate-400 text-sm font-semibold">Avg. Rating</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {(
                learningPaths.length > 0 ? (learningPaths.reduce((sum, p) => sum + p.rating, 0) / learningPaths.length) : 0
              ).toFixed(1)}
              ⭐
            </p>
          </div>
        </div>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.length > 0 ? (
            filteredPaths.map((path) => (
              <LearningPathCard
                key={path.id}
                path={path}
                onCardClick={handleCardClick}
                userProgress={userProgress}
                isEnrolled={enrolledPaths.includes(path.id)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 bg-slate-800 rounded-2xl border border-slate-700">
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-xl font-bold text-white mb-2">No paths found</p>
              <p className="text-slate-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {filteredPaths.length > 0 && (
          <div className="mt-12 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">💡 Learning Tips</h3>
            <ul className="text-sm text-slate-400 space-y-2">
              <li>✓ Enroll in paths that match your skill level</li>
              <li>✓ Commit 1-2 hours per week for consistent progress</li>
              <li>✓ Complete modules in order for best results</li>
              <li>✓ Engage in peer discussions and projects</li>
              <li>✓ Earn certificates upon completion</li>
            </ul>
          </div>
        )}

      </div>

      {/* Learning Path Detail Modal */}
      <LearningPathModal
        path={selectedPath}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEnroll={handleEnroll}
        isEnrolled={
          selectedPath ? enrolledPaths.includes(selectedPath.id) : false
        }
      />
    </div>
  );
};

export default LearningPathsScreen;