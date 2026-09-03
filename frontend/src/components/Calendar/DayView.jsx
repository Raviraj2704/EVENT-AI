import React from 'react';
import EventBlock from './EventBlock';

export const DayView = ({ date, events, userCalendar, onRegister, onUnregister }) => {
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const dayEvents = events.filter((e) => {
    const eventDate = new Date(e.start_time);
    return eventDate.toDateString() === date.toDateString();
  });

  const registeredIds = userCalendar.map((uc) => uc.calendar_event_id);

  return (
    <div className="mb-8">
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 p-4 border-b-2 border-orange-500 mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
          {dayName}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{monthDay}</p>
      </div>

      {dayEvents.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No events scheduled for this day
        </p>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <EventBlock
              key={event.id}
              event={event}
              isRegistered={registeredIds.includes(event.id)}
              onRegister={() => onRegister(event.id)}
              onUnregister={() => onUnregister(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DayView;