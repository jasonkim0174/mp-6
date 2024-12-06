import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import NavBar from "./components/Navigation";

const geistSansFont = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMonoFont = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Next.js OAuth Application",
  description: "This is an example app that implements OAuth authentication from Next.js",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSansFont.variable} ${geistMonoFont.variable} antialiased bg-white text-gray-900`}
      >
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
