import React, { useState } from 'react';
import DayView from './DayView';
import CalendarFilters from './CalendarFilters';
import EventBlock from './EventBlock';

export const CalendarView = ({ events, userCalendar, onRegister, onUnregister }) => {
  const [viewType, setViewType] = useState('upcoming');
  const [sessionType, setSessionType] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter events
  let filteredEvents = events.filter((e) => {
    if (!e.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (sessionType !== 'all' && e.session_type !== sessionType) return false;
    if (difficulty !== 'all' && e.difficulty_level !== difficulty) return false;
    return true;
  });

  // Sort by start time
  filteredEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

  // Get unique days
  const days = [];
  filteredEvents.forEach((e) => {
    const date = new Date(e.start_time);
    const dateStr = date.toDateString();
    if (!days.find((d) => d.toDateString() === dateStr)) {
      days.push(date);
    }
  });

  return (
    <div>
      {/* View Type Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-300 dark:border-gray-700">
        {[
          { id: 'upcoming', label: '📅 Upcoming' },
          { id: 'mySchedule', label: '⭐ My Schedule' }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setViewType(view.id)}
            className={`
              px-4 py-3 font-semibold border-b-2 transition-all
              ${viewType === view.id
                ? 'border-orange-600 text-orange-600 dark:text-orange-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900'
              }
            `}
          >
            {view.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <CalendarFilters
        sessionType={sessionType}
        setSessionType={setSessionType}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Events */}
      <div>
        {viewType === 'mySchedule' ? (
          // My Schedule View
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              ⭐ My Registered Events
            </h3>
            {userCalendar.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                You haven't registered for any events yet
              </p>
            ) : (
              <div className="space-y-3">
                {userCalendar.map((reg) => {
                  const event = events.find((e) => e.id === reg.calendar_event_id);
                  return event ? (
                    <EventBlock
                      key={event.id}
                      event={event}
                      isRegistered={true}
                      onUnregister={() => onUnregister(event.id)}
                    />
                  ) : null;
                })}
              </div>
            )}
          </div>
        ) : (
          // All Events View by Day
          <div>
            {days.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No events found matching your filters
                </p>
              </div>
            ) : (
              days.map((day) => (
                <DayView
                  key={day.toDateString()}
                  date={day}
                  events={filteredEvents}
                  userCalendar={userCalendar}
                  onRegister={onRegister}
                  onUnregister={onUnregister}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;