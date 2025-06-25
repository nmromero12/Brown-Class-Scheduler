import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./components/Login.tsx";

import { initializeApp} from "firebase/app";
import  SignUp  from "./components/SignUp.tsx"
import AuthRoute from "./components/AuthRoute.tsx";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { Friends } from "./components/Friends.tsx";
import { Calendar } from "./components/Calendar.tsx";
import { getFirestore } from "firebase/firestore";
import Layout  from "./components/Layout.tsx";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig)
const authentication = getAuth()
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db }



setPersistence(authentication, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence set");
  })
  .catch((error) => {
    console.error("Error setting session persistence", error);
  });




ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>

      <Routes>
        <Route path="/" element={<AuthRoute><Layout /></AuthRoute>}>
        <Route index element={<App />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="friends" element={<Friends />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
