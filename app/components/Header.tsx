"use client"

import Link from "next/link"
import { useCart } from "../../lib/CartContext"
import { ShoppingCart } from "lucide-react"

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const { cart } = useCart()

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-[#1f513f] text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Outdoor Adventure Shop</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:underline">
                All Products
              </Link>
            </li>
            <li>
              <button onClick={onCartClick} className="flex items-center hover:underline">
                <ShoppingCart size={20} className="mr-1" />
                <span>Cart ({itemCount})</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

