import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Playfair_Display, Oswald, Crimson_Text, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jason Dank - Software Engineer | AI Systems | Product Builder",
  description: "Portfolio of Jason Dank, a software engineer and technical leader specializing in AI systems, full-stack development, and product building. Building systems that actually matter.",
  keywords: ["Jason Dank", "Software Engineer", "AI Systems", "Product Builder", "Full Stack Developer", "Harvard IT", "Technical Leader"],
  authors: [{ name: "Jason Dank" }],
  creator: "Jason Dank",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jasondank.com",
    title: "Jason Dank - Software Engineer | AI Systems | Product Builder",
    description: "Building systems that actually matter. Portfolio of Jason Dank, technical leader and product builder.",
    siteName: "Jason Dank Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Dank - Software Engineer | AI Systems | Product Builder",
    description: "Building systems that actually matter. Portfolio of Jason Dank, technical leader and product builder.",
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
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable} ${oswald.variable} ${crimsonText.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-black text-white font-sans overflow-x-hidden">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
