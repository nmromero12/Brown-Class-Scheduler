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









export default function CalendarView() {
  const { parsedEvents } = useCart()
  const [myEvents, setMyEvents] = useState<EventInput[]>([]);


  

  useEffect(() => {
  const formatTime = (timeStr: string) => `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
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
        dtstart: "2025-09-01T09:00:00",
        until: '2025-12-12T23:59:59',
      },
      duration: event.duration,
      location: event.location || 'TBD',
    });
  }

  setMyEvents(transformed);
}, [parsedEvents]);



  


  return (
    <div style={{ padding: '1rem' }}>
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
  );
}
