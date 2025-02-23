import { Suspense } from "react"
import { ShoppingAssistant } from "./components/ShoppingAssistant"
import { AllProducts } from "./components/AllProducts"

export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-[#1f513f] mb-4">Welcome to Outdoor Adventure</h1>
          <p className="text-xl text-gray-600">Discover the best gear for your next adventure</p>
        </section>
        <Suspense fallback={<div className="text-center">Loading Shopping Assistant...</div>}>
          <ShoppingAssistant />
        </Suspense>
        <Suspense fallback={<div className="text-center">Loading Products...</div>}>
          <AllProducts />
        </Suspense>
      </div>
    </div>
  )
}

