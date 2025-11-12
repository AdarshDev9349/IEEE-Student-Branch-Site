import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IEEE SB UCEK",
  description: "IEEE SB UCEK is one of the most active IEEE communities in the Trivandrum Hub. It started in 2022, with a dedicated team and a lively community. Since then, IEEE SB UCEK has come a long way and has organized remarkable events that are certain to continue in the future. The IEEE SB UCEK is a hardworking family that aims to improve our society and nation. Around 50-100 new members join the IEEE SB UCEK community with great dedication and enthusiasm every year. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
