"use client"
import { useState, useEffect, useCallback } from "react"
import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { products } from "../lib/products"
import { useCart } from "../lib/CartContext"
import { Check, Loader2 } from "lucide-react"
import { CategoryFilter } from "./components/CategoryFilter"
import { useInView } from "react-intersection-observer"
import { useCompletion } from "ai/react"
import { ProductList } from "./components/ProductList"

const PRODUCTS_PER_PAGE = 12 // Adjust this number as needed

export default function HomePage() {
  // Shopping Assistant states
  const [query, setQuery] = useState("")
  const [lastQuery, setLastQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [structuredResponse, setStructuredResponse] = useState<string>("")

  // All Products states
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

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/shopping-assistant",
    onError: (error) => {
      console.error("Completion Error:", error)
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
    },
  })

  // Get unique categories
  const allCategories = Array.from(new Set(products.flatMap((product) => product.category)))

  useEffect(() => {
    if (completion) {
      structureResponse(completion)
    }
  }, [completion])

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

  const structureResponse = (text: string) => {
    const structuredText = text.replace(/\[(\w+(-\w+)*)\]/g, (match, id) => {
      const product = products.find((p) => p.id === id)
      return product ? product.name : match
    })
    setStructuredResponse(structuredText)
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    setStructuredResponse("")
    if (query.trim() && query !== lastQuery) {
      setLastQuery(query)
      try {
        console.log("Sending query:", query)
        await complete(query)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Shopping Assistant Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Personal Shopping Assistant</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., I'm going camping in Yosemite next month. It will be cold..."
              className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-[#1f513f] focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-[#1f513f] text-white px-6 py-2 rounded-lg hover:bg-[#173d2f] transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={isLoading || !query.trim()}
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Thinking..." : "Ask Assistant"}
            </button>
          </form>
          {isLoading && (
            <div className="mt-4 p-4 bg-[#f3f7f5] rounded-lg border border-[#1f513f]/20">
              <p className="text-gray-700">Fetching recommendations for: &quot;{lastQuery}&quot;</p>
            </div>
          )}
          {structuredResponse && !isLoading && (
            <div className="mt-4 p-4 bg-[#f3f7f5] rounded-lg border border-[#1f513f]/20">
              <h3 className="font-semibold text-[#1f513f] mb-2">Assistant Recommendations:</h3>
              <div className="text-gray-700 whitespace-pre-wrap">{structuredResponse}</div>
            </div>
          )}
          {(error || errorMessage) && (
            <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-300">
              <p className="text-red-700">{errorMessage || error?.message || "An unknown error occurred"}</p>
            </div>
          )}
        </div>
        <ProductList recommendations={completion} isLoading={isLoading} />
      </div>

      {/* All Products Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Products</h2>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <CategoryFilter
              categories={allCategories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg bg-white">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-48">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-lg font-semibold mb-2 hover:text-[#1f513f]">{product.name}</h3>
                    </Link>
                    <p className="text-gray-600 mb-4 h-20 overflow-hidden">{product.description}</p>
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
            {displayedProducts.length < filteredProducts.length && (
              <div ref={ref} className="flex justify-center mt-8">
                <button
                  onClick={loadMoreProducts}
                  className="bg-[#1f513f] text-white px-6 py-2 rounded-lg hover:bg-[#173d2f] transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

