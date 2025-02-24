"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { products, type Product } from "../../../lib/products"
import { useCart } from "../../../lib/CartContext"
import { Check } from "lucide-react"
import Link from "next/link"

export default function ProductDetailPage() {
  const params = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === params.id)
    setProduct(foundProduct || null)
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 2000)
    }
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-[#1f513f] hover:underline mb-4 inline-block">
        &larr; Back to All Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative w-full aspect-square">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-xl font-bold text-[#1f513f] mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Categories:</h2>
            <div className="flex flex-wrap gap-2">
              {product.category.map((cat) => (
                <span key={cat} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {cat}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Suitable for:</h2>
            <div className="flex flex-wrap gap-2">
              {product.weather.map((w) => (
                <span key={w} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                  {w}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Activities:</h2>
            <div className="flex flex-wrap gap-2">
              {product.activities.map((activity) => (
                <span key={activity} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {activity}
                </span>
              ))}
            </div>
          </div>
          <button
            className={`px-6 py-2 rounded transition-colors ${
              isAdded ? "bg-green-500 text-white" : "bg-[#1f513f] text-white hover:bg-[#173d2f]"
            }`}
            onClick={handleAddToCart}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <Check className="inline-block w-4 h-4 mr-1" />
                Added to Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

