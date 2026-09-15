import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ScrollProgress from "@/components/ScrollProgress";

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
    "Portfolio of Jason Dank, a full-stack software engineer at Fidelity Investments building on the Fidelity Private Shares platform. Previously Endpoint Systems Engineer at Harvard University IT.",
  keywords: [
    "Jason Dank",
    "Software Engineer",
    "Full Stack Developer",
    "Fidelity Investments",
    "Fidelity Private Shares",
    "Fintech",
    "AI/ML",
    "Systems Design",
    "Harvard University IT",
    "Wentworth Institute of Technology",
  ],
  authors: [{ name: "Jason Dank" }],
  creator: "Jason Dank",
  metadataBase: new URL("https://jasondank.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jasondank.com",
    title: "Jason Dank — Software Engineer",
    description:
      "Full-stack software engineer at Fidelity Investments, on the Private Shares platform. Fintech, systems design, and AI/ML.",
    siteName: "Jason Dank",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jason Dank — Software Engineer",
    description:
      "Full-stack software engineer at Fidelity Investments, on the Private Shares platform. Fintech, systems design, and AI/ML.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0d" },
  ],
};

// Runs before first paint so a saved theme choice never flashes the other one.
const themeBootScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.dataset.theme = saved;
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground font-mono overflow-x-hidden">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-md focus:border focus:border-foreground focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
        >
          skip to content
        </a>
        <ScrollProgress />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
