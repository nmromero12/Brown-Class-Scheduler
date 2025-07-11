// CalendarView.tsx
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; 
import rrulePlugin from '@fullcalendar/rrule';
import { EventInput, EventApi } from "@fullcalendar/core";
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { getFriends } from '../firebase/friends';
import { useUser } from '../context/UserContext';
import { CartItem } from '../types/course';
import { Friend } from '../types/friend';

const API_BASE = import.meta.env.VITE_API_BASE;

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
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const { user } = useUser();

  // State for clicked event details
  const [selectedEvent, setSelectedEvent] = useState<EventApi | null>(null);

  /**
   * Fetches parsed calendar events from the backend for a given cart.
   * @param cart - Array of CartItem objects.
   * @returns Promise resolving to an array of parsed event objects.
   */
  async function fetchParsedEvents(cart: CartItem[]): Promise<any[]> {
    const idToken = await user?.getIdToken()
    const response = await fetch(`${API_BASE}/api/calendar/parse-cart`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(cart),
    });
    return await response.json();
  }

  /**
   * Fetches the cart for a friend by UID.
   * @param friendUid - The friend's user ID.
   * @returns Promise resolving to an array of CartItem.
   */
  async function fetchFriendCart(friendUid: string) {
    const idToken = await user?.getIdToken()
    const response = await fetch(`${API_BASE}/cart/user/${friendUid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json",
      },
    })
    const data = await response.json();
    if (data.result === "success") {
      return data.items;
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
    setSelectedFriend(friend.email);
  }

  /**
   * Clears friend events from the calendar.
   */
  function clearFriendSchedule() {
    setFriendEvents([]);
    setSelectedFriend(null);
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
    if (user) {
      getFriends(user.uid).then(setFriends);
    }
  }, [user]);

  // eventClick handler for calendar events
  const handleEventClick = (info: { event: EventApi }) => {
    setSelectedEvent(info.event);
  };

  // Helper to format dates nicely
  const formatDate = (date: Date | null) =>
    date ? date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : "N/A";

  return (
  <div className="p-6 h-[calc(100vh-5rem)] overflow-x-auto relative">
    <div className="flex h-full min-w-[1024px] rounded-2xl border border-gray-200 shadow bg-white">
      
      {/* Calendar Section */}
      <div className="flex-grow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Course Calendar</h2>
          {selectedFriend && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Viewing: <span className="font-medium text-red-600">{selectedFriend}</span>
              </span>
              <button
                onClick={clearFriendSchedule}
                className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        
        <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin, rrulePlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay',
            }}
            events={[...myEvents, ...friendEvents]}
            height="auto"
            contentHeight="auto"
            expandRows={true}
            nowIndicator={true}
            slotMinTime="06:00:00"
            slotMaxTime="21:00:00"
            allDaySlot={false}
            eventDisplay="block"
            eventMinHeight={35}
            slotDuration="00:30:00"
            slotLabelInterval="01:00:00"
            scrollTime="08:00:00"
            dayHeaderFormat={{ weekday: 'short' }}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              omitZeroMinute: false,
              meridiem: 'short'
            }}
            eventClick={handleEventClick}
          />
        </div>
      </div>

      {/* Friends Panel */}
      <div className="w-80 flex-shrink-0 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto flex flex-col h-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Friends</h3>

        {friends.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-center">No friends found.</p>
          </div>
        ) : (
          <div className="space-y-3 flex-1">
            {friends.map(friend => (
              <div
                key={friend.email}
                className={`flex items-center justify-between bg-white border p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                  selectedFriend === friend.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-gray-800 font-medium truncate pr-3">
                  {friend.email}
                </span>
                <button
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    selectedFriend === friend.email
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  onClick={() => viewFriendSchedule(friend)}
                >
                  {selectedFriend === friend.email ? 'Viewing' : 'View'}
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedFriend && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">
              <span className="text-blue-600">■</span> Your courses
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-red-600">■</span> {selectedFriend}'s courses
            </p>
          </div>
        )}
      </div>

      {/* Modal Popup for Event Details */}
      {selectedEvent && (
        <>
        {/* 🔒 Overlay to disable all interactions */}
           <div className="fixed inset-0 z-50 pointer-events-auto"></div>
  

          {/* Modal Box */}
          <div className="fixed z-60 top-1/2 left-1/2 w-80 max-w-full p-6 bg-white rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2">
            <h3 className="text-xl font-bold mb-2">{selectedEvent.title}</h3>
            <p><strong>Starts:</strong> {formatDate(selectedEvent.start)}</p>
            <p><strong>Ends:</strong> {formatDate(selectedEvent.end)}</p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-4 px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

}
