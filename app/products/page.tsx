"use client"
import Image from "next/image"
import { products } from "../../lib/products"
import { useCart } from "../../lib/CartContext"

export default function ProductListPage() {
  const { addToCart } = useCart()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
            <div className="relative h-48">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4 h-20 overflow-hidden">{product.description}</p>
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
    </div>
  )
}

