"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ShoppingCart } from "lucide-react"
import { useCart } from "../../lib/CartContext"
import { products, type Product } from "../../lib/products"

interface CartRecommendationsProps {
  cartItems: Product[]
  compact?: boolean
}

export function CartRecommendations({ cartItems, compact = false }: CartRecommendationsProps) {
  const { addToCart } = useCart()
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({})

  // Get recommendations based on cart items
  const recommendations = getRecommendations(cartItems)

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault() // Prevent navigation when clicking the "Add to Cart" button
    e.stopPropagation() // Prevent the click event from bubbling up to the parent link
    addToCart(product)
    setAddedProducts({ ...addedProducts, [product.id]: true })
    setTimeout(() => {
      setAddedProducts({ ...addedProducts, [product.id]: false })
    }, 2000)
  }

  if (recommendations.length === 0) {
    return null
  }

  return (
    <div className={`${compact ? "mt-4" : "mt-12"} bg-gray-50 rounded-lg p-4`}>
      <h2 className={`${compact ? "text-lg" : "text-xl"} font-bold text-[#1f513f] mb-2`}>Complete Your Adventure</h2>
      <p className={`text-gray-600 mb-4 ${compact ? "text-sm" : ""}`}>These items pair well with your cart:</p>
      <div className="space-y-4">
        {recommendations.map((product) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <div
              className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:scale-105 flex items-center"
              style={{ height: compact ? "120px" : "160px" }}
            >
              <div className="relative h-full" style={{ width: compact ? "120px" : "160px" }}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 120px, 160px"
                />
              </div>
              <div className="flex-grow p-3 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-sm font-semibold text-[#1f513f] line-clamp-2" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">${product.price.toFixed(2)}</p>
                </div>
                <button
                  className={`w-full mt-2 px-2 py-1 text-sm rounded transition-colors flex items-center justify-center ${
                    addedProducts[product.id] ? "bg-green-500 text-white" : "bg-[#1f513f] text-white hover:bg-[#173d2f]"
                  }`}
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={addedProducts[product.id]}
                >
                  {addedProducts[product.id] ? (
                    <>
                      <Check className="w-3 h-3 mr-1" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// Helper function to get recommendations based on cart items
function getRecommendations(cartItems: Product[]): Product[] {
  if (cartItems.length === 0) return []

  // Collect all categories, activities, and weather conditions from cart items
  const cartCategories = new Set<string>()
  const cartActivities = new Set<string>()
  const cartWeather = new Set<string>()

  cartItems.forEach((item) => {
    item.category.forEach((cat) => cartCategories.add(cat))
    item.activities.forEach((activity) => cartActivities.add(activity))
    item.weather.forEach((weather) => cartWeather.add(weather))
  })

  // Score each product based on how well it matches with cart items
  const scoredProducts = products
    .filter((product) => !cartItems.some((item) => item.id === product.id)) // Exclude items already in cart
    .map((product) => {
      let score = 0

      // Score based on matching categories
      product.category.forEach((cat) => {
        if (cartCategories.has(cat)) score += 2
      })

      // Score based on matching activities
      product.activities.forEach((activity) => {
        if (cartActivities.has(activity)) score += 3
      })

      // Score based on matching weather conditions
      product.weather.forEach((weather) => {
        if (cartWeather.has(weather)) score += 2
      })

      return { product, score }
    })
    .filter((item) => item.score > 0) // Only consider products with some relevance
    .sort((a, b) => b.score - a.score) // Sort by score (highest first)

  // Return top 3 recommendations
  return scoredProducts.slice(0, 3).map((item) => item.product)
}

