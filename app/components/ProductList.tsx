"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { products, type Product } from "../../lib/products"
import { Loader2, Check, ShoppingCart } from "lucide-react"
import { useCart } from "../../lib/CartContext"

interface ProductListProps {
  recommendations: string
  isLoading: boolean
}

export function ProductList({ recommendations, isLoading }: ProductListProps) {
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const { addToCart } = useCart()
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({})
  const [allAdded, setAllAdded] = useState(false)

  useEffect(() => {
    if (recommendations) {
      const recommendedIds =
        recommendations.match(/\[(.*?)\]/g)?.map((id) => id.replace("[", "").replace("]", "")) || []

      const filteredProducts = recommendedIds.length > 0 ? products.filter((p) => recommendedIds.includes(p.id)) : []

      setRecommendedProducts(filteredProducts)
    } else {
      setRecommendedProducts([])
    }
  }, [recommendations])

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product)
      setAddedProducts((prev) => ({ ...prev, [product.id]: true }))
      setTimeout(() => {
        setAddedProducts((prev) => ({ ...prev, [product.id]: false }))
      }, 300)
    },
    [addToCart],
  )

  const handleAddAllToCart = useCallback(() => {
    recommendedProducts.forEach((product) => {
      addToCart(product)
    })
    setAllAdded(true)
    setTimeout(() => {
      setAllAdded(false)
    }, 300)
  }, [recommendedProducts, addToCart])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-[#1f513f]" />
      </div>
    )
  }

  if (!recommendations) {
    return null
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1f513f] mb-2 sm:mb-0">Recommended Products</h2>
        {recommendedProducts.length > 0 && (
          <button
            className={`w-full sm:w-auto px-4 py-2 rounded-full transition-colors flex items-center justify-center ${
              allAdded ? "bg-green-500 text-white" : "bg-[#1f513f] text-white hover:bg-[#173d2f]"
            }`}
            onClick={handleAddAllToCart}
            disabled={allAdded}
          >
            {allAdded ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                All Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-1" />
                Add All to Cart
              </>
            )}
          </button>
        )}
      </div>
      {recommendedProducts.length === 0 ? (
        <p className="text-gray-600">No products found matching your criteria. Try a different query!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative h-48">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-grow">
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-semibold mb-2 text-[#1f513f] hover:text-[#173d2f] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-[#1f513f]">${product.price.toFixed(2)}</span>
                  </div>
                  <button
                    className={`w-full px-4 py-2 rounded-full transition-colors flex items-center justify-center ${
                      addedProducts[product.id]
                        ? "bg-green-500 text-white"
                        : "bg-[#1f513f] text-white hover:bg-[#173d2f]"
                    }`}
                    onClick={() => handleAddToCart(product)}
                    disabled={addedProducts[product.id]}
                  >
                    {addedProducts[product.id] ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add to Cart
                      </>
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

