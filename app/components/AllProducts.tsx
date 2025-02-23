"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { products } from "../../lib/products"
import { useCart } from "../../lib/CartContext"
import { Check, ShoppingCart } from "lucide-react"
import { CategoryFilter } from "./CategoryFilter"
import { useInView } from "react-intersection-observer"

const PRODUCTS_PER_PAGE = 12

export function AllProducts() {
  const { addToCart } = useCart()
  const [addedProducts, setAddedProducts] = useState<{ [key: string]: boolean }>({})
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [displayedProducts, setDisplayedProducts] = useState<typeof products>([])
  const [page, setPage] = useState(1)

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  const allCategories = Array.from(new Set(products.flatMap((product) => product.category)))

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(
        products.filter((product) => product.category.some((cat) => selectedCategories.includes(cat))),
      )
    }
    setPage(1)
    setDisplayedProducts([])
  }, [selectedCategories])

  useEffect(() => {
    loadMoreProducts()
  }, [])

  useEffect(() => {
    if (inView) {
      loadMoreProducts()
    }
  }, [inView])

  const loadMoreProducts = useCallback(() => {
    const nextProducts = filteredProducts.slice(displayedProducts.length, displayedProducts.length + PRODUCTS_PER_PAGE)
    setDisplayedProducts((prev) => [...prev, ...nextProducts])
    setPage((prev) => prev + 1)
  }, [filteredProducts, displayedProducts])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleAddToCart = (product: (typeof products)[0]) => {
    addToCart(product)
    setAddedProducts({ ...addedProducts, [product.id]: true })
    setTimeout(() => {
      setAddedProducts({ ...addedProducts, [product.id]: false })
    }, 2000)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-3xl font-bold text-[#1f513f] mb-6">Our Products</h2>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 mb-6 md:mb-0 md:pr-6">
          <CategoryFilter
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
        </div>
        <div className="w-full md:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="relative h-48">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold mb-2 text-[#1f513f] hover:text-[#173d2f] transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#1f513f]">${product.price.toFixed(2)}</span>
                    <button
                      className={`px-4 py-2 rounded-full transition-colors flex items-center ${
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
                          Added
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
          {displayedProducts.length < filteredProducts.length && (
            <div ref={ref} className="flex justify-center mt-8">
              <button
                onClick={loadMoreProducts}
                className="bg-[#1f513f] text-white px-6 py-2 rounded-full hover:bg-[#173d2f] transition-colors"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

