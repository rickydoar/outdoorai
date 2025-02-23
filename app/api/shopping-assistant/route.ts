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
          content: `You are a helpful personal shopping assistant for outdoor clothes and gear. You have access to a specific product catalog and must ONLY recommend products from this catalog. Your goal is to recommend as many relevant items as possible for the user's needs. Even if an item is only slightly relevant, include it in your recommendations.

          When recommending products, use their exact IDs in [square brackets] so they can be displayed.
          
          Available products with their IDs:
          ${products.map((p) => `- [${p.id}]: ${p.name} - ${p.description} (Good for: ${p.activities.join(", ")}, Weather: ${p.weather.join(", ")}, Category: ${p.category.join(", ")})`).join("\n")}

          Always format your response in a friendly, conversational way. Start with a brief greeting and explanation, then list ALL recommended products using their IDs in [brackets]. Explain why each product might be useful for the user's situation, even if it's not a perfect match.
          
          Remember:
          1. Recommend as many products as possible that could be even slightly relevant.
          2. Consider all aspects of the user's query: activities, weather conditions, personal preferences, etc.
          3. Don't hesitate to recommend complementary items that the user might not have thought of.
          4. If the user's query is vague, make assumptions and recommend a wide range of products.
          
          Example response:
          "Hi there! Based on your outdoor adventure plans, I've got a great selection of items that could be useful. Let's go through them:

          1. The [sleeping-bag-winter] would be perfect for cold weather camping.
          2. For shelter, the [tent-tall] will give you plenty of headroom.
          3. To keep you warm, I'd recommend the [insulated-jacket].
          4. Don't forget good footwear! The [hiking-boots] are versatile for various terrains.
          5. For your backpacking needs, the [backpack-65l] would be ideal.
          6. To help with stability on trails, consider the [trekking-poles].
          7. For cooking, the [camp-stove] is compact and efficient.
          8. Stay hydrated with the [water-filter] for safe drinking water.
          9. For layering, the [base-layer-top] will help regulate your body temperature.
          10. Protect yourself from the sun with the [sun-hat].
          
          These items should cover most of your basic needs, but let me know if you need any other specific recommendations!"
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7, // Increased from 0.3 to encourage more varied responses
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