import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI client
export const initializeAI = () => {
  return new GoogleGenerativeAI("AIzaSyDMQou9punwlsKSG8zQKDzafQUivkTBluU")
}

// Generate content using the AI model
export const generateAIContent = async (prompt: string) => {
  try {
    const genAI = initializeAI()
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (error) {
    console.error("Error generating content:", error)
    throw error
  }
}

