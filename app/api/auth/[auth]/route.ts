import { NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const CALLBACK_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`;

async function getAuthUrl(): Promise<string> {
  return `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${CALLBACK_URL}&response_type=code&scope=email%20profile%20openid`;
}

async function exchangeCodeForToken(code: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: CALLBACK_URL,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Token Exchange Error:", error);
    throw new Error(`Failed to exchange code: ${response.statusText}`);
  }

  return response.json();
}

async function fetchUserInfo(accessToken: string) {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("User Info Fetch Error:", error);
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  return response.json();
}

export async function GET(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === "/api/auth/login") {
    const authUrl = await getAuthUrl();
    console.log("Redirecting to Google Auth URL:", authUrl);
    return NextResponse.redirect(authUrl);
  }

  if (url.pathname === "/api/auth/callback/google") {
    const code = url.searchParams.get("code");
    if (!code) {
      console.error("Authorization code missing in callback");
      return NextResponse.json({ error: "Authorization code is missing" });
    }

    try {
      const tokenData = await exchangeCodeForToken(code);
      const userInfo = await fetchUserInfo(tokenData.access_token);

      const response = NextResponse.redirect(new URL("/user", request.url).toString());
      console.log("Fetched user info successfully:", userInfo);

      response.cookies.set("session", JSON.stringify(userInfo), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, 
      });

      return response;
    } catch (error) {
      console.error("Error in OAuth callback:", error);
      return NextResponse.json({ error: (error as Error).message });
    }
  }

  console.error("Unsupported route:", url.pathname);
  return NextResponse.json({ error: "Unsupported route" });
}
