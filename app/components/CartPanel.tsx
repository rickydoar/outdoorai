"use client"

import { useCart } from "../../lib/CartContext"
import Image from "next/image"
import { X, ShoppingCart, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { CartRecommendations } from "./CartRecommendations"
import { useRouter } from "next/navigation"

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const [isAnimating, setIsAnimating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isAnimating && !isOpen) return null

  const handleCheckout = () => {
    onClose()
    router.push("/checkout")
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out overflow-hidden flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <div className="p-4">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center border-b pb-4">
                    <div className="relative w-20 h-20 mr-4">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="mx-2 text-sm">{item.quantity}</span>
                        <button
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button className="text-red-500 hover:text-red-700 text-sm" onClick={() => removeFromCart(item.id)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {cart.length > 0 && (
            <div className="px-4 pb-4">
              <CartRecommendations cartItems={cart} compact={true} onProductClick={onClose} />
            </div>
          )}
        </div>
        <div className="p-4 border-t bg-white">
          <p className="text-xl font-bold mb-4">Total: ${getCartTotal().toFixed(2)}</p>
          <div className="flex flex-col space-y-2">
            <button
              className="bg-[#1f513f] text-white px-4 py-2 rounded-full hover:bg-[#173d2f] transition-colors w-full flex items-center justify-center"
              onClick={handleCheckout}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Checkout
            </button>
            <button
              className="border border-[#1f513f] text-[#1f513f] px-4 py-2 rounded-full hover:bg-[#1f513f] hover:text-white transition-colors w-full flex items-center justify-center"
              onClick={clearCart}
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

