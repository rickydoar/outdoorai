import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { products } from "../../../lib/products"

export async function POST(req: Request) {
  console.log("API route called")
  try {
    const { prompt } = await req.json()
    console.log("Received prompt:", prompt)

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set")
    }

    console.log("Calling OpenAI API")
    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        {
          role: "system",
          content: `You are a helpful outdoor gear shopping assistant. You have access to a specific product catalog and must ONLY recommend products from this catalog. 
          Recommend as many relevant items as you can.

          When recommending products, use their exact IDs in [square brackets] so they can be displayed.
          
          Available products with their IDs:
          ${products.map((p) => `- [${p.id}]: ${p.name} - ${p.description} (Good for: ${p.activities.join(", ")})`).join("\n")}

          Always format your response in a friendly, conversational way. Start with a brief greeting and explanation, then list recommended products using their IDs in [brackets].
          
          Example response:
          "Hi! Based on your needs, I recommend the following items:
          The [sleeping-bag-winter] would be perfect for cold weather, and the [tent-tall] will give you plenty of headroom..."
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    })

    console.log("OpenAI API response received")
    return result.toDataStreamResponse()
  } catch (error) {
    console.error("API Error:", error)
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

