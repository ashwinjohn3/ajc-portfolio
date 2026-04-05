// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import localFont from 'next/font/local'

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ashwin John Chempolil',
  description: 'Software Engineer at Amazon Web Services',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
