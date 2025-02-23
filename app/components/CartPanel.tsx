"use client"

import { useCart } from "../../lib/CartContext"
import Image from "next/image"
import { X } from "lucide-react"

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 180px)" }}>
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <p className="text-xl font-bold mb-4">Total: ${getCartTotal().toFixed(2)}</p>
          <div className="flex justify-between">
            <button
              className="bg-[#1f513f] text-white px-4 py-2 rounded hover:bg-[#173d2f] transition-colors w-full mr-2"
              onClick={() => alert("Checkout functionality not implemented")}
            >
              Checkout
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              onClick={clearCart}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

