// 1. PEOPLE DISCOVERY CARD (LinkedIn-style)
export const PersonCard = ({ person, onConnect, isConnected, isPending }) => {
  const [showMessage, setShowMessage] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  
  const getStatusColor = () => {
    if (isConnected) return 'bg-green-100 text-green-700';
    if (isPending) return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };
  
  const getStatusText = () => {
    if (isConnected) return 'Connected';
    if (isPending) return 'Pending';
    return 'Connect';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 mb-4 border border-gray-100">
      {/* Header with profile image and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <img
            src={person.profile_photo_url || 'https://via.placeholder.com/60'}
            alt={person.full_name}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-200"
          />
          <div>
            <h3 className="font-bold text-lg text-gray-900">{person.full_name}</h3>
            <p className="text-sm text-gray-600">{person.headline}</p>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-xs text-gray-500">📍 {person.location}</span>
            </div>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Bio */}
      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{person.bio}</p>

      {/* Company info */}
      <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100">
        <div>
          <p className="text-xs text-gray-500 uppercase">Company</p>
          <p className="font-semibold text-gray-900">{person.company}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase">Role</p>
          <p className="font-semibold text-gray-900">{person.job_title}</p>
        </div>
      </div>

      {/* Skills & Interests */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills & Interests</p>
        <div className="flex flex-wrap gap-2">
          {(person.interests || []).map((interest, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 mt-6">
        <button
          onClick={() => setShowMessage(!showMessage)}
          className="flex-1 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
        >
          💬 Message
        </button>
        
        {!isConnected && (
          <button
            onClick={() => onConnect(person.id)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            🤝 {isPending ? 'Pending' : 'Connect'}
          </button>
        )}
        
        {isConnected && (
          <button className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg cursor-default">
            ✓ Connected
          </button>
        )}
      </div>

      {/* Message Input (Collapsible) */}
      {showMessage && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Send a personalized message..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-sm"
            rows={3}
          />
          <button
            onClick={() => {
              onConnect(person.id, customMessage);
              setShowMessage(false);
            }}
            className="mt-2 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors"
          >
            Send Request
          </button>
        </div>
      )}
    </div>
  );
};