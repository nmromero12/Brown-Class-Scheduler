// src/components/Layout.tsx
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brown-200 via-brown-50 to-brown-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Outlet /> {/* This renders the child route content */}
      </div>
    </div>
  );
}
