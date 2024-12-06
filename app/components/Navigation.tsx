"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";


export default function NavBar() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    setIsSignedIn(!!userData); 
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("user"); 
    setIsSignedIn(false); 
    window.location.href = "/"; 
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-blue-600 text-white shadow-lg">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold tracking-wide">OAuth App</h1>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link
            href="/user"
            className="text-lg font-medium hover:text-gray-200 transition duration-200"
          >
            View Profile
          </Link>
        </li>
        {isSignedIn ? (
          <li>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              Click here to Sign Out
            </button>
          </li>
        ) : (
          <li>
            <Link
              href="/api/auth/login"
              className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-200"
            >
              Click here to Sign In
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
  
  
  
}
