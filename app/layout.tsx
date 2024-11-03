import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Besley } from 'next/font/google'


const besley = Besley({
  weight: '400',
  subsets: ['latin']
})

const besleySemiBold = Besley({
  weight: '600',
  subsets: ['latin']
})

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Ashwin John Chempolil",
  description: "Ashwin's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${besleySemiBold.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
