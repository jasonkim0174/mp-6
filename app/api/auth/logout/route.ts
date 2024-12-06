import { NextResponse } from "next/server";
import { cookies } from "next/headers";

async function clearSessionCookie() {
  const cookieStore = await cookies(); 
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, 
  });
}

export async function POST() {
    await clearSessionCookie(); 
    return NextResponse.json({ message: "Logged out successfully" });
}
