import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Space_Grotesk } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Scratch Code | Learn to Code in Your Browser",
    template: "%s | Scratch Code"
  },
  description: "Learn Python, JavaScript, HTML & CSS, and more through interactive, bite-sized lessons with live sandboxed compiler executing inside your browser. No setups, just clean coding.",
  keywords: ["learn to code", "browser compiler", "python online compiler", "javascript sandbox", "web development lessons", "judge0"],
  authors: [{ name: "Scratch Code Team" }],
  metadataBase: new URL("https://scratch-code.vercel.app"),
  openGraph: {
    title: "Scratch Code | Learn to Code in Your Browser",
    description: "Learn Python, JavaScript, HTML & CSS, and more through interactive, bite-sized lessons with live sandboxed compiler executing inside your browser.",
    url: "https://scratch-code.vercel.app",
    siteName: "Scratch Code",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Scratch Code Interactive Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scratch Code | Learn to Code in Your Browser",
    description: "Short lessons. Real code. No local installs. Start learning in 30 seconds.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${spaceGrotesk.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-[#0b0c10]">{children}</body>
    </html>
  );
}
