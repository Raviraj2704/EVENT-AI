export const ConversationsList = ({ conversations, onSelectConversation, selectedId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-blue-100 text-sm mt-1">{conversations.length} conversations</p>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${
              selectedId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="https://via.placeholder.com/48"
                  alt="User"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-900">User #{conv.participant_2_id}</h3>
                  <span className="text-xs text-gray-500">
                    {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString() : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conv.last_message}</p>
              </div>
              
              {conv.unread_count > 0 && (
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {conv.unread_count}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};