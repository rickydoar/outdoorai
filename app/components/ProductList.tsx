"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { products, type Product } from "../../lib/products"
import { Loader2, Check } from "lucide-react"
import { useCart } from "../../lib/CartContext"

interface ProductListProps {
  recommendations: string
  isLoading: boolean
}

export function ProductList({ recommendations, isLoading }: ProductListProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({})

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

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    setAddedProducts({ ...addedProducts, [product.id]: true })
    setTimeout(() => {
      setAddedProducts({ ...addedProducts, [product.id]: false })
    }, 2000)
  }

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
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 hover:text-[#1f513f]">{product.name}</h3>
                </Link>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#1f513f]">${product.price.toFixed(2)}</span>
                  <button
                    className={`px-4 py-2 rounded transition-colors ${
                      addedProducts[product.id]
                        ? "bg-green-500 text-white"
                        : "bg-[#1f513f] text-white hover:bg-[#173d2f]"
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedProducts[product.id]}
                  >
                    {addedProducts[product.id] ? (
                      <>
                        <Check className="inline-block w-4 h-4 mr-1" />
                        Added
                      </>
                    ) : (
                      "Add to Cart"
                    )}
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

