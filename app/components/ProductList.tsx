"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { products, type Product } from "../../lib/products"
import { Loader2 } from "lucide-react"
import { useCart } from "../../lib/CartContext"

interface ProductListProps {
  recommendations: string
  isLoading: boolean
}

export function ProductList({ recommendations, isLoading }: ProductListProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const { addToCart } = useCart()

  useEffect(() => {
    if (recommendations) {
      const recommendedIds =
        recommendations.match(/\[(.*?)\]/g)?.map((id) => id.replace("[", "").replace("]", "")) || []

      const filteredProducts = recommendedIds.length > 0 ? products.filter((p) => recommendedIds.includes(p.id)) : []

      setRecommendedProducts(filteredProducts)
    } else {
      // Show default products when there are no recommendations
      setRecommendedProducts(products.slice(0, 6))
    }
  }, [recommendations])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#1f513f]" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {recommendedProducts.length > 0 ? "Recommended Products" : "Featured Products"}
      </h2>
      {recommendedProducts.length === 0 && !isLoading ? (
        <p className="text-gray-600">No products found matching your criteria. Try a different query!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="relative h-48">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#1f513f]">${product.price.toFixed(2)}</span>
                  <button
                    className="bg-[#1f513f] text-white px-4 py-2 rounded hover:bg-[#173d2f] transition-colors"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

