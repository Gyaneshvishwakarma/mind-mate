import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { ProductivityProvider } from "@/contexts/productivity-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MindMate - Productivity Dashboard",
  description: "A comprehensive productivity dashboard with tasks, notes, goals, and focus tracking",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
    
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ProductivityProvider>{children}</ProductivityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
