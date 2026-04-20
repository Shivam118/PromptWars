import { Inter } from "next/font/google";
import { EventProvider } from "@/store/EventContext";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Schema } from "@/components/Schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MatchDay | Event Coordination Platform",
    template: "%s | MatchDay",
  },
  description: "Real-time insights on crowd movement, waiting times, and coordinate data for an optimized physical event experience.",
  keywords: ["Sporting Event", "Crowd Density", "Wait Times", "Event Dashboard", "Stadium Logistics"],
  authors: [{ name: "MatchDay Ops Team" }],
  publisher: "MatchDay Organization",
  robots: "index, follow",
  openGraph: {
    title: "MatchDay | Event Coordination Platform",
    description: "Navigate the venue efficiently with real-time wait times and spatial insights.",
    type: "website",
    url: "https://matchday-app-1048219509828.us-central1.run.app",
    locale: "en_US",
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
      className={`${inter.variable} antialiased dark`}
    >
      <head>
        <Schema />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0a0a] dark:text-gray-100 selection:bg-blue-500/30 flex flex-col">
        <EventProvider>
          {children}
        </EventProvider>
        {/* Google Services Integration: GA4 Analysis */}
        <GoogleAnalytics gaId="G-MEASUREMENT-ID" />
      </body>
    </html>
  );
}
