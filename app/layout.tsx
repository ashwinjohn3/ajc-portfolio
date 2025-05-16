/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Besley } from 'next/font/google'
import { ThemeProvider } from "next-themes";


const besley = Besley({
  weight: '400',
  subsets: ['latin']
})

const besleySemiBold = Besley({
  weight: '600',
  subsets: ['latin']
})

const gambarino = localFont({
  src: "./fonts/Gambarino-Regular.ttf",
  variable: "--font-gambarino-regular",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "Ashwin John Chempolil",
  description: "Ashwin's Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${gambarino.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
