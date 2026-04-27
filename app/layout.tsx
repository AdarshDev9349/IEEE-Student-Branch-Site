import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "./components/NavigationWrapper";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-poppins",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-montserrat",
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
        className={`${poppins.variable} ${montserrat.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <NavigationWrapper>
          {children}
        </NavigationWrapper>
      </body>
    </html>
  );
}
