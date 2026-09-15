import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jbmono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jason Dank — Software Engineer",
  description:
    "Portfolio of Jason Dank, a full-stack software engineer specializing in systems design, automation, and AI/ML integration. Endpoint Systems Engineer Intern at Harvard University IT; Computer Science student at Wentworth Institute of Technology.",
  keywords: [
    "Jason Dank",
    "Software Engineer",
    "Full Stack Developer",
    "AI/ML",
    "Systems Design",
    "Harvard University IT",
    "Wentworth Institute of Technology",
  ],
  authors: [{ name: "Jason Dank" }],
  creator: "Jason Dank",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jasondank.com",
    title: "Jason Dank — Software Engineer",
    description:
      "Full-stack software engineer specializing in systems design, automation, and AI/ML integration.",
    siteName: "Jason Dank",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Dank — Software Engineer",
    description:
      "Full-stack software engineer specializing in systems design, automation, and AI/ML integration.",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground font-mono overflow-x-hidden">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
