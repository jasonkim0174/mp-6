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
  try {
    await clearSessionCookie(); 
    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
