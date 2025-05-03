import React, { useState } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';

const CalendarAddEvent: React.FC = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [message, setMessage] = useState('');

  

    const handleAddEvent = async () => {
        if (!user) {
          setMessage('Please sign in to add events.');
          return;
        }
      
        try {
          const clerkToken = await getToken();
      
          const response = await fetch('http://localhost:8080/api/calendar/add-event', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${clerkToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              summary,
              description,
              startTime,
              endTime,
            }),
          });
      
          if (!response.ok) throw new Error('Failed to add event');
      
          const result = await response.text();
          setMessage(result);
        } catch (err) {
          console.error('Error adding event:', err);
          setMessage('Failed to add event.');
        }
      };

  return (
    <div>
      <h2>Add Event to Google Calendar</h2>
      <div>
        <label>Summary:</label>
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
      </div>
      <div>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label>Start Time (ISO):</label>
        <input
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          placeholder="e.g., 2025-05-02T10:00:00Z"
        />
      </div>
      <div>
        <label>End Time (ISO):</label>
        <input
          type="text"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          placeholder="e.g., 2025-05-02T11:00:00Z"
        />
      </div>
      <button onClick={handleAddEvent}>Add Event</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CalendarAddEvent;