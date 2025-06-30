// CalendarView.tsx
import FullCalendar  from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import {EventInput} from "@fullcalendar/core";
import { useCart } from './CartContext';
import { useState, useEffect } from 'react';
import { getFriends } from '../firebase/friends';
import { useUser } from './UserContext';
import { CartItem } from '../types/course';
import { Friend } from '../types/friend';






export async function fetchParsedEvents(cart: CartItem[]): Promise<any[]> {
  const response = await fetch("http://localhost:8080/api/calendar/parse-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });
  return await response.json();
}




export default function CalendarView() {
  const { parsedEvents } = useCart()
  const [myEvents, setMyEvents] = useState<EventInput[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendEvents, setFriendEvents] = useState<EventInput[]>([]);
  const { user } = useUser();

  


  async function fetchFriendCart(friendUid: string) {
  const response = await fetch(`http://localhost:8080/cart/user/${friendUid}`);
  const data = await response.json();
  if (data.result === "success") {
    return data.items; // This should be an array of CartItem
  }
  return [];
}

async function setUserCalendar(e: any[]) {
  const formatTime = (timeStr: string) =>
      `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}:${timeStr.slice(4, 6)}`;
  const transformed: EventInput[] = [];

  for (const event of e) {
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

  return transformed;


}


async function viewFriendSchedule(friend: Friend) {
  const cart = await fetchFriendCart(friend.uid);
  const parsedCart = await fetchParsedEvents(cart);
  const selectedEvents = await setUserCalendar(parsedCart);
  const redEvents = selectedEvents.map(ev => ({
    ...ev,
    color: "#ef4444"
  }))
  setFriendEvents(redEvents);
  
}


  

  useEffect(() => {
    async function fetchAndSetEvents() {
      const userEvents = await setUserCalendar(parsedEvents);
      setMyEvents(userEvents);
    }

    fetchAndSetEvents();
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
        events={[...myEvents, ...friendEvents]}
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
                className="ml-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  viewFriendSchedule(friend);
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
