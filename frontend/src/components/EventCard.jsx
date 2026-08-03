export default function EventCard({ event }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer">
      <h3 className="text-xl font-bold mb-2">{event.name}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {new Date(event.date).toLocaleDateString()}
        </span>
        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
          {event.location}
        </span>
      </div>
    </div>
  );
}


