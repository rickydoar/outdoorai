import { Suspense } from "react"
import { ShoppingAssistant } from "./components/ShoppingAssistant"
import { AllProducts } from "./components/AllProducts"

export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
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

