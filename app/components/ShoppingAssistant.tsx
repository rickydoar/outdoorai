"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCompletion } from "ai/react"
import { ProductList } from "./ProductList"
import { Loader2 } from "lucide-react"
import { products } from "../../lib/products"

export function ShoppingAssistant() {
  const [query, setQuery] = useState("")
  const [lastQuery, setLastQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [structuredResponse, setStructuredResponse] = useState<string>("")

  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/shopping-assistant",
    onError: (error) => {
      console.error("Completion Error:", error)
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
    },
  })

  useEffect(() => {
    if (completion) {
      structureResponse(completion)
    }
  }, [completion])

  const structureResponse = (text: string) => {
    const structuredText = text.replace(/\[(\w+(-\w+)*)\]/g, (match, id) => {
      const product = products.find((p) => p.id === id)
      return product ? product.name : match
    })
    setStructuredResponse(structuredText)
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
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Personal Shopping Assistant</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
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
  )
}
