import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import QueryProvider from "@/components/QueryProvider";
import { Toaster } from 'react-hot-toast';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import getQueryClient from '@/lib/getQueryClient';
import api from '@/lib/api';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "APNews.in - తెలుగు వార్తలు",
  description: "తెలుగు వార్తల్లో మీ నమ్మకమైన మూలం. రాజకీయాలు, క్రీడలు, వినోదం, వ్యాపారం మరియు మరెన్నో.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // Direct fetch or use API helper if it works on server (axios might need full URL)
      // Using fetch with absolute URL for SSR
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 3600 } });
      const data = await res.json();
      return data;
    },
    staleTime: 60 * 60 * 1000,
  });

  return (
    <html lang="te" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            forcedTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <HydrationBoundary state={dehydrate(queryClient)}>
               {/* Navbar moved to specific layouts */}
            </HydrationBoundary>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
              {children}
            </div>
            <Toaster position="top-center" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
