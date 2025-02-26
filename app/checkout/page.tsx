"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "../../lib/CartContext"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard } from "lucide-react"

export default function CheckoutPage() {
  const { cart, getCartTotal } = useCart()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically process the payment and submit the order
    alert("Order placed successfully! (This is a demo)")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/cart" className="text-[#1f513f] hover:underline flex items-center mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Link>
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center mb-4 border-b pb-4">
              <div className="relative w-20 h-20 mr-4">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="text-xl font-bold mt-4">Total: ${getCartTotal().toFixed(2)}</div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                className="border p-2 rounded"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="border p-2 rounded"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border p-2 rounded w-full"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              className="border p-2 rounded w-full"
              value={formData.address}
              onChange={handleInputChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                className="border p-2 rounded"
                value={formData.city}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                required
                className="border p-2 rounded"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </div>
            <input
              type="text"
              name="country"
              placeholder="Country"
              required
              className="border p-2 rounded w-full"
              value={formData.country}
              onChange={handleInputChange}
            />
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Payment</h2>
              <button
                type="submit"
                className="bg-[#1f513f] text-white px-6 py-3 rounded-full hover:bg-[#173d2f] transition-colors w-full flex items-center justify-center"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

