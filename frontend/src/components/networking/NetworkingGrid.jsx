export const NetworkingGrid = ({ people, onConnect, connections }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(people);

  useEffect(() => {
    const filtered = people.filter(person =>
      person.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.headline.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPeople(filtered);
  }, [searchQuery, people]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🤝 Network & Connect
          </h1>
          <p className="text-gray-600">
            Discover professionals, build relationships, and expand your network at the event
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, company, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg focus:outline-none text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">Total Professionals</p>
            <p className="text-3xl font-bold">{people.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">Your Connections</p>
            <p className="text-3xl font-bold">{connections?.filter(c => c.status === 'accepted').length || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90">Pending Requests</p>
            <p className="text-3xl font-bold">{connections?.filter(c => c.status === 'pending').length || 0}</p>
          </div>
        </div>
      </div>

      {/* People Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredPeople.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              onConnect={onConnect}
              isConnected={connections?.some(c => (c.requester_id === person.id || c.recipient_id === person.id) && c.status === 'accepted')}
              isPending={connections?.some(c => (c.requester_id === person.id || c.recipient_id === person.id) && c.status === 'pending')}
            />
          ))}
        </div>

        {/* Right Sidebar - Suggestions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">✨ AI Suggestions</h2>
            <p className="text-sm text-gray-600 mb-4">
              Based on your profile, here are people you should connect with
            </p>
            <div className="space-y-3">
              {people.slice(0, 5).map((person) => (
                <div
                  key={person.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-sm text-gray-900">{person.full_name}</p>
                  <p className="text-xs text-gray-500 mt-1">{person.headline}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-green-600">85% Match</span>
                    <button className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};