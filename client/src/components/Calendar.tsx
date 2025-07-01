// CalendarView.tsx
import FullCalendar  from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import {EventInput} from "@fullcalendar/core";
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { getFriends } from '../firebase/friends';
import { useUser } from '../context/UserContext';
import { CartItem } from '../types/course';
import { Friend } from '../types/friend';

/**
 * Fetches parsed calendar events from the backend for a given cart.
 * @param cart - Array of CartItem objects.
 * @returns Promise resolving to an array of parsed event objects.
 */
export async function fetchParsedEvents(cart: CartItem[]): Promise<any[]> {
  const response = await fetch("http://localhost:8080/api/calendar/parse-cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cart),
  });
  return await response.json();
}

/**
 * CalendarView component displays the user's and friends' course schedules.
 * Allows viewing friends' schedules on the calendar.
 * @returns JSX.Element
 */
export default function CalendarView() {
  const { parsedEvents } = useCart()
  const [myEvents, setMyEvents] = useState<EventInput[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendEvents, setFriendEvents] = useState<EventInput[]>([]);
  const { user } = useUser();

  /**
   * Fetches the cart for a friend by UID.
   * @param friendUid - The friend's user ID.
   * @returns Promise resolving to an array of CartItem.
   */
  async function fetchFriendCart(friendUid: string) {
    const response = await fetch(`http://localhost:8080/cart/user/${friendUid}`);
    const data = await response.json();
    if (data.result === "success") {
      return data.items; // This should be an array of CartItem
    }
    return [];
  }

  /**
   * Converts parsed event data into FullCalendar EventInput objects.
   * @param e - Array of parsed event objects.
   * @returns Promise resolving to an array of EventInput.
   */
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

  /**
   * Loads and displays a friend's schedule on the calendar.
   * @param friend - The friend whose schedule to view.
   */
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

  /**
   * Effect to update the user's events when parsedEvents changes.
   */
  useEffect(() => {
    async function fetchAndSetEvents() {
      const userEvents = await setUserCalendar(parsedEvents);
      setMyEvents(userEvents);
    }

    fetchAndSetEvents();
  }, [parsedEvents]);

  /**
   * Effect to fetch friends when the user is available.
   */
  useEffect(() => {
    // Fetch friends when user is available
    if (user) {
      getFriends(user.uid).then(setFriends);
    }
  }, [user]);

  


  return (
    <div className="p-6 h-[calc(100vh-5rem)]"> {/* adjust for navbar height */}
      <div className="flex h-full rounded-2xl border border-gray-200 shadow overflow-hidden bg-white">
        
        {/* Calendar Section */}
        <div className="flex-grow p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Shared Course Calendar</h2>
          <div className="rounded-xl overflow-hidden border border-gray-300 shadow">
            <FullCalendar
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin, rrulePlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'timeGridWeek,timeGridDay,dayGridMonth',
              }}
              events={[...myEvents, ...friendEvents]}
              height="70vh"
              nowIndicator={true}
            />
          </div>
        </div>

        {/* Friends Panel */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto flex flex-col h-full">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Friends</h3>

          {friends.length === 0 ? (
            <p className="text-gray-500 flex-1">No friends found.</p>
          ) : (
            <ul className="space-y-4 flex-1">
              {friends.map(friend => (
                <li
                  key={friend.email}
                  className="flex items-center justify-between bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <span className="text-gray-800 font-medium truncate">{friend.email}</span>
                  <button
                    className="ml-2 px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg"
                    onClick={() => viewFriendSchedule(friend)}
                  >
                    View
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            className="mt-6 px-3 py-2 text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg w-full"
            onClick={() => setFriendEvents([])}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );  

}
