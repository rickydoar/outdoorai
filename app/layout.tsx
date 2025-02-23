"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { CartProvider } from "../lib/CartContext"
import { Header } from "./components/Header"
import { CartPanel } from "./components/CartPanel"
import { useState } from "react"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <html lang="en">
      <head>
        <title>Outdoor Adventure Shop</title>
        <meta name="description" content="Your personal assistant for outdoor gear" />
      </head>
      <body className={`${inter.className} bg-white`}>
        <CartProvider>
          <Header onCartClick={() => setIsCartOpen(true)} />
          <main className="container mx-auto p-4">{children}</main>
          <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </CartProvider>
      </body>
    </html>
  )
}

