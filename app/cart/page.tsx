"use client"

import { useCart } from "../../lib/CartContext"
import Image from "next/image"
import { X, ShoppingCart, Trash2 } from "lucide-react"
import { CartRecommendations } from "../components/CartRecommendations"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart()
  const router = useRouter()

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#1f513f]">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center border rounded-lg p-4 bg-white shadow-sm">
                <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-[#1f513f]">{item.name}</h3>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="mx-2 text-sm">{item.quantity}</span>
                    <button
                      className="bg-gray-200 px-2 py-1 rounded-full text-sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700 ml-4" onClick={() => removeFromCart(item.id)}>
                  <X size={24} />
                </button>
              </div>
            ))}
          </div>
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 text-[#1f513f]">Order Summary</h2>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <button
                className="bg-[#1f513f] text-white w-full px-4 py-2 rounded-full hover:bg-[#173d2f] transition-colors mt-4 flex items-center justify-center"
                onClick={handleCheckout}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Checkout
              </button>
              <button
                className="border border-[#1f513f] text-[#1f513f] w-full px-4 py-2 rounded-full hover:bg-[#1f513f] hover:text-white transition-colors mt-2 flex items-center justify-center"
                onClick={clearCart}
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {cart.length > 0 && (
        <div className="mt-12">
          <CartRecommendations cartItems={cart} />
        </div>
      )}
    </div>
  )
}

