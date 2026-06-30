import { Inter } from 'next/font/google'
import '../src/styles/App.css'
import '../src/styles/mobile.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Shelf Intelligence Agent',
  description: 'AI-powered retail inventory management and predictive replenishment system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}