"use client"

import { useCart } from "../../lib/CartContext"
import Image from "next/image"
import { CartRecommendations } from "../components/CartRecommendations"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center border-b pb-4">
                <div className="relative w-24 h-24 mr-4">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="bg-gray-200 px-2 py-1 rounded"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700" onClick={() => removeFromCart(item.id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-xl font-bold">Total: ${getCartTotal().toFixed(2)}</p>
            <div className="mt-4 space-x-4">
              <button
                className="bg-[#1f513f] text-white px-4 py-2 rounded hover:bg-[#173d2f] transition-colors"
                onClick={() => alert("Checkout functionality not implemented")}
              >
                Checkout
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </>
      )}
      {cart.length > 0 && <CartRecommendations cartItems={cart} />}
    </div>
  )
}

