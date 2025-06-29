// CalendarView.tsx
import React from 'react';
import FullCalendar  from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import {EventInput} from "@fullcalendar/core";

const myEvents: EventInput[] = [
  {
    title: 'CSCI 0320 Lecture',
    rrule: {
      freq: 'weekly',
      interval: 1,
      byweekday: ['mo', 'we', 'fr'],
      dtstart: '2025-09-01T10:30:00',
      until: '2025-12-15',
    },
    duration: '01:20', // 1 hour 20 minutes
  }
];

export default function CalendarView() {
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
