"use client";

import React, { useState, useEffect } from "react";
import { User } from "@/types/User";
import Image from "next/image";


export default function UserPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser)); 
    } else {
      const fetchUser = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`);
          if (!response.ok) {
            throw new Error("User not authenticated");
          }
          const data = await response.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user)); 
            setUser(data.user);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser(null);
        }
      };
      fetchUser();
    }
  }, []);

  if (!user)
    return (
      <div className="container">
        <p>No user data available. Please sign in.</p>
      </div>
    );

  return (
    <div className="container bg-white p-8 rounded shadow-2xl max-w-md text-center">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Image
        src={user.picture || "/default-profile.png"}
        alt="Profile Picture"
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <p className="text-lg mb-2">
        <strong>Name:</strong> {user.name}
      </p>
      <p className="text-lg">
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
