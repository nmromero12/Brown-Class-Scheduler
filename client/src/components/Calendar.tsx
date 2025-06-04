import { useEffect, useState } from "react";

declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { error?: string; access_token?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
          revoke: (token: string) => void;
        };
      };
    };
  }
}

const CLIENT_ID = "258944424686-9q49i46gskidoaftott0e99bev4p3dve.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile";


export default function Calendar() {
  const [calendarId, setCalendarId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<{ picture?: string } | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('googleAccessToken');
    const storedProfile = localStorage.getItem('googleUserProfile');
    const storedCalendarId = localStorage.getItem('calendarId');
    
    if (storedToken && storedProfile && storedCalendarId) {
      setAccessToken(storedToken);
      setUserProfile(JSON.parse(storedProfile));
      setCalendarId(storedCalendarId);
      window.dispatchEvent(new CustomEvent('googleProfileLoaded', { 
        detail: JSON.parse(storedProfile) 
      }));
      window.dispatchEvent(new Event('googleSignIn'));
    }

    const loadGoogleIdentityServices = () => {
      if (isGoogleScriptLoaded) return;
      
      console.log("Loading Google Identity Services...");
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Identity Services loaded successfully");
        setIsGoogleScriptLoaded(true);
      };
      script.onerror = (e) => {
        console.error("Failed to load Google Identity Services:", e);
        setError("Failed to load Google Identity Services");
      };
      document.body.appendChild(script);
    };

    const handleGoogleSignInEvent = () => {
      if (!accessToken) {  // Only trigger sign in if we don't have a token
        handleGoogleSignIn();
      }
    };

    const handleSignOut = () => {
      localStorage.removeItem('googleAccessToken');
      localStorage.removeItem('googleUserProfile');
      localStorage.removeItem('calendarId');
      setAccessToken(null);
      setUserProfile(null);
      setCalendarId(null);
      window.dispatchEvent(new Event('googleSignOut'));
    };

    const handleCalendarRefresh = () => {
      // Force iframe refresh by updating the src with a timestamp
      const iframe = document.querySelector('iframe');
      if (iframe && calendarId) {
        const currentSrc = iframe.src;
        const separator = currentSrc.includes('?') ? '&' : '?';
        iframe.src = `${currentSrc}${separator}t=${Date.now()}`;
      }
    };

    loadGoogleIdentityServices();
    window.addEventListener('googleSignIn', handleGoogleSignInEvent);
    window.addEventListener('googleSignOut', handleSignOut);
    window.addEventListener('calendarRefresh', handleCalendarRefresh);

    return () => {
      window.removeEventListener('googleSignIn', handleGoogleSignInEvent);
      window.removeEventListener('googleSignOut', handleSignOut);
      window.removeEventListener('calendarRefresh', handleCalendarRefresh);
    };
  }, [isGoogleScriptLoaded, accessToken, calendarId]);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      const data = await response.json();
      console.log('Fetched user profile:', data);
      setUserProfile(data);
      localStorage.setItem('googleUserProfile', JSON.stringify(data));
      const event = new CustomEvent('googleProfileLoaded', { detail: data });
      console.log('Dispatching profile event:', event);
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const findExistingCalendar = async (token: string): Promise<string | null> => {
    try {
      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const existingCalendar = data.items.find((calendar: any) => 
        calendar.summary === "Course Scheduler Calendar"
      );

      if (existingCalendar) {
        console.log("Found existing calendar:", existingCalendar.id);
        return existingCalendar.id;
      }

      return null;
    } catch (error) {
      console.error("Error finding existing calendar:", error);
      return null;
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isGoogleScriptLoaded) {
      setError("Google services not loaded yet. Please try again in a moment.");
      return;
    }

    try {
      console.log("Initializing Google Auth...");
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (response: { error?: string; access_token?: string }) => {
          if (response.error) {
            console.error("Auth error:", response.error);
            setError(`Authentication error: ${response.error}`);
            return;
          }
          if (response.access_token) {
            console.log("Authentication successful");
            setAccessToken(response.access_token);
            localStorage.setItem('googleAccessToken', response.access_token);
            await fetchUserProfile(response.access_token);
            
            // First try to find an existing calendar
            const existingCalendarId = await findExistingCalendar(response.access_token);
            if (existingCalendarId) {
              console.log("Using existing calendar");
              setCalendarId(existingCalendarId);
              localStorage.setItem('calendarId', existingCalendarId);
            } else {
              // If no existing calendar found, create a new one
              await createPublicCalendar(response.access_token);
            }
            
            // Dispatch sign in event after everything is set up
            window.dispatchEvent(new Event('googleSignIn'));
          }
        },
      });

      console.log("Requesting token...");
      tokenClient.requestAccessToken();
    } catch (error: any) {
      console.error("Error initializing Google Auth:", error);
      setError(`Failed to initialize Google Auth: ${error.message}`);
    }
  };

  const createPublicCalendar = async (token: string) => {
    try {
      console.log("Attempting to create calendar...");
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          summary: "Course Scheduler Calendar",
          timeZone: "America/New_York",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const newCalendarId = data.id;
      console.log("Created new calendar with ID:", newCalendarId);
      localStorage.setItem('calendarId', newCalendarId);

      // Make the calendar public
      console.log("Attempting to make calendar public...");
      const aclResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${newCalendarId}/acl`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: "reader",
          scope: { type: "default" },
        }),
      });

      if (!aclResponse.ok) {
        throw new Error(`HTTP error! status: ${aclResponse.status}`);
      }

      console.log("Made calendar public");
      setCalendarId(newCalendarId);
    } catch (error: any) {
      console.error("Detailed calendar creation error:", error);
      const errorMessage = error.message || "Failed to create calendar";
      setError(`Failed to create calendar: ${errorMessage}`);
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div className="w-full shadow-md h-[94vh] sticky top-0">
      {calendarId ? (
        <iframe
          title="User Calendar"
          src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
            calendarId
          )}&ctz=America/New_York`}
          style={{ 
            border: "solid 1px #777", 
            width: "100%", 
            height: "94vh",
            position: "sticky",
            top: 0
          }}
          frameBorder="0"
          scrolling="no"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-lg">Click "Sign In" in the navbar to get started</p>
        </div>
      )}
    </div>
  );
}

