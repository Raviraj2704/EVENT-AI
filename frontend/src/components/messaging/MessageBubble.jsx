const MessageBubble = ({ message, isOwn, sender }) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md xl:max-w-lg`}>
        {!isOwn && (
          <img
            src={sender?.profile_photo_url || 'https://via.placeholder.com/32'}
            alt={sender?.full_name}
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        
        <div>
          <div
            className={`px-4 py-2 rounded-2xl ${
              isOwn
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none'
                : 'bg-gray-100 text-gray-900 rounded-bl-none'
            } shadow-md`}
          >
            <p className="text-sm break-words">{message.content}</p>
          </div>
          <p className={`text-xs ${isOwn ? 'text-right' : 'text-left'} text-gray-500 mt-1`}>
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};