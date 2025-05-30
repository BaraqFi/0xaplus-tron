import type { Metadata } from 'next'
import './globals.css'
import ContextProvider from "@/context"
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieHeaders = headers()
  const cookies = (await cookieHeaders).get('cookie')

  return (
    <html lang="en">
      <body><ContextProvider cookies={cookies}>{children}</ContextProvider></body>
    </html>
  )
}
