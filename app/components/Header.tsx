"use client"

import Link from "next/link"
import { useCart } from "../../lib/CartContext"
import { ShoppingCart, Menu } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  const { cart } = useCart()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#1f513f]">
            Outdoor Adventure
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-[#1f513f] transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-600 hover:text-[#1f513f] transition-colors">
              Shop
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#1f513f] transition-colors">
              About
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#1f513f] transition-colors">
              Contact
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onCartClick} className="relative text-gray-600 hover:text-[#1f513f] transition-colors">
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-[#1f513f] transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-gray-600 hover:text-[#1f513f] transition-colors">
                Home
              </Link>
              <Link href="/products" className="text-gray-600 hover:text-[#1f513f] transition-colors">
                Shop
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#1f513f] transition-colors">
                About
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#1f513f] transition-colors">
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

