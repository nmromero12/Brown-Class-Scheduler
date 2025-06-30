// CalendarView.tsx
import React from 'react';
import FullCalendar  from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import {EventInput} from "@fullcalendar/core";
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';
import { Friend, getFriends } from './Friends';
import { useUser } from './UserContext';









export default function CalendarView() {
  const { parsedEvents } = useCart()
  const [myEvents, setMyEvents] = useState<EventInput[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const { user } = useUser();


  

  useEffect(() => {
  const formatTime = (timeStr: string) =>
      `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`;
  const transformed: EventInput[] = [];

  for (const event of parsedEvents) {
    if (!event.days || !event.startTime || !event.endTime || !event.description) {
      console.warn('Skipping invalid event:', event);
      continue;
    }

    transformed.push({
      title: event.description,
      rrule: {
        freq: 'weekly',
        byweekday: event.days,
        dtstart: `2025-09-03T${formatTime(event.startTime)}`,
        until: '2025-12-12T23:59:59',
      },
      duration: event.duration,
      location: event.location || 'TBD',
    });
  }

  setMyEvents(transformed);
}, [parsedEvents]);




  useEffect(() => {
    // Fetch friends when user is available
    if (user) {
      getFriends(user.uid).then(setFriends);
    }
  }, [user]);



  


  return (
  <div className="flex h-screen">
    {/* Calendar Area - Left Side */}
    <div className="flex-grow p-4">
      <h2 className="text-2xl font-bold mb-4">Shared Course Calendar</h2>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, rrulePlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay,dayGridMonth',
        }}
        events={myEvents}
        height="80vh"
        nowIndicator={true}
      />
    </div>

    {/* Friends Tab - Right Side */}
    <div className="w-72 bg-gray-100 border-l border-gray-300 p-4 overflow-y-auto">
      <h3 className="text-xl font-semibold mb-4">Friends</h3>

      {friends.length === 0 ? (
        <p className="text-gray-500">No friends found.</p>
      ) : (
        <ul className="space-y-3">
          {friends.map(friend => (
            <li
              key={friend.email}
              className="flex items-center justify-between bg-white p-3 rounded shadow hover:bg-gray-50"
            >
              <span className="font-medium">{friend.email}</span>
              <button
                className="ml-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  // your functionality here
                }}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
);

}
