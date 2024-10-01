import { ClerkProvider } from "@clerk/nextjs";
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "../styles/prism.css";
import React from "react";
import { ThemeProvider } from "@/context/ThemeProvider";
import { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});
export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "**DevFlow** is a Next.js-powered web application designed for developers to ask and answer programming-related questions, similar to Stack Overflow. It features user authentication, dynamic routing, and a modern, responsive UI. With robust search functionality and real-time updates, DevFlow provides an intuitive platform for developers to collaborate, share knowledge, and solve coding challenges efficiently.",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
  openGraph: {
    title: "DevFlow",
    description:
      "A developer-focused web app for asking and answering coding questions. Built on Next.js with real-time features and robust search functionality.",
    url: "https://stack-overflow-nextjs-beige.vercel.app/",
    images: [
      {
        url: "/assets/images/optimized-logo.jpg",
        width: 1200,
        height: 630,
        alt: "DevFlow Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevFlow",
    title: "DevFlow",
    description:
      "A developer-focused web app for asking and answering coding questions. Built on Next.js with real-time features and robust search functionality.",
    images: [
      {
        url: "/assets/images/optimized-logo.jpg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "text-primary-gradient hover:text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
