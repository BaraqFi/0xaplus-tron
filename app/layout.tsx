import type { Metadata } from 'next'
import './globals.css'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: '0xaplus',
  description: 'test tron and evms',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieHeaders = await headers()
  const cookies = cookieHeaders.get('cookie')
  

  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
