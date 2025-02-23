"use client"

import type React from "react"

import { useState } from "react"
import { useCompletion } from "ai/react"
import { ProductList } from "./ProductList"
import { Loader2 } from "lucide-react"

export function ShoppingAssistant() {
  const [query, setQuery] = useState("")
  const [lastQuery, setLastQuery] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const { complete, completion, isLoading, error } = useCompletion({
    api: "/api/shopping-assistant",
    onError: (error) => {
      console.error("Completion Error:", error)
      setErrorMessage(`Error: ${error.message || "Unknown error occurred"}`)
    },
    onFinish: (result) => {
      console.log("Completion finished:", result)
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")
    if (query.trim() && query !== lastQuery) {
      setLastQuery(query)
      try {
        console.log("Sending query:", query)
        const result = await complete(query)
        console.log("OpenAI Response:", result)
        if (!result) {
          throw new Error("No response from OpenAI")
        }
      } catch (error: any) {
        console.error("Error fetching recommendations:", error)
        setErrorMessage(`Failed to get recommendations: ${error.message || "Unknown error"}`)
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
            <p className="text-gray-700">Fetching recommendations for: "{lastQuery}"</p>
          </div>
        )}
        {completion && !isLoading && (
          <div className="mt-4 p-4 bg-[#f3f7f5] rounded-lg border border-[#1f513f]/20">
            <h3 className="font-semibold text-[#1f513f] mb-2">Assistant Recommendations:</h3>
            <p className="text-gray-700">{completion}</p>
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

