// import { useEffect, useState } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { gapi } from "gapi-script";

// const CLIENT_ID = "258944424686-9q49i46gskidoaftott0e99bev4p3dve.apps.googleusercontent.com";
// const API_KEY = "AIzaSyBKUpiGya2Ba0qbDs5EkbjF-Ukg-XT7kpU";
// const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
// const CALENDAR_ID = "primary";


// export default function Calendar(){

// type CalendarEvent = {
//     title: string;
//     start: string;
//     end?: string;
//   };
  
//   const [events, setEvents] = useState<CalendarEvent[]>([]);


//   useEffect(() => {
//     function start() {
//       gapi.client
//         .init({
//           apiKey: API_KEY,
//           clientId: CLIENT_ID,
//           discoveryDocs: [
//             "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
//           ],
//           scope: SCOPES,
//         })
//         .then(() => gapi.auth2.getAuthInstance().signIn())
//         .then(() =>
//           gapi.client.calendar.events.list({
//             calendarId: CALENDAR_ID,
//             timeMin: new Date().toISOString(),
//             showDeleted: false,
//             singleEvents: true,
//             maxResults: 100,
//             orderBy: "startTime",
//           })
//         )
//         .then((response: { result: { items: any[]; }; }) => {
//           const events = response.result.items.map((event) => ({
//             title: event.summary,
//             start: event.start.dateTime || event.start.date,
//             end: event.end?.dateTime || event.end?.date,
//           }));
//           setEvents(events);
//         })
//         .catch((err: any) => console.error("Error fetching events", err));
//     }

//     gapi.load("client:auth2", start);
//   }, []);

//   return (
//     <div className="p-4">
//       <FullCalendar
//         plugins={[dayGridPlugin]}
//         initialView="dayGridMonth"
//         events={events} // manually loaded private events
//         height="auto"
//       />
//     </div>
//   );
// }
