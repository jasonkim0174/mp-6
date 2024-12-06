"use client";

import React from "react";

export default function HomePage() {
  const handleLogin = () => {
    window.location.href = "/api/auth/login";
  };

  return (
    <div className="container bg-white text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to my CS391 OAuth App!</h1>
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
}
