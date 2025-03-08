"use client"

import { useState } from "react"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ArrowLeft, Loader2, Download } from "lucide-react"
import Link from "next/link"
import QuizRenderer from "@/components/quiz-renderer"
import LessonPlanRenderer from "@/components/lesson-plan-renderer"
import WorksheetRenderer from "@/components/worksheet-renderer"
import CourseRenderer from "@/components/course-renderer"

// Type definitions for our page props and generation types
interface GeneratePageProps {
  params: {
    type: string
  }
}

// Map of generation types to their prompts
const typeToPromptMap: Record<string, string> = {
  "lesson-plan": "Generate a comprehensive lesson plan for the course: ",
  worksheet: "Generate a worksheet on the topic: ",
  courses: "Generate a course outline for: ",
  quiz: "Generate a quiz with 10 multiple choice questions on the topic: . For each question, provide 4 options labeled A, B, C, and D, and indicate the correct answer. Format each question as 'Q1:', 'Q2:', etc.",
}

// Map of generation types to their labels
const typeToLabelMap: Record<string, string> = {
  "lesson-plan": "Course Name",
  worksheet: "Subject or Topic",
  courses: "Course Subject",
  quiz: "Quiz Topic",
}

export default function GeneratePage({ params }: GeneratePageProps) {
  const [input, setInput] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const type = params.type
  const promptPrefix = typeToPromptMap[type] || "Generate content about: "
  const inputLabel = typeToLabelMap[type] || "Topic"

  const generateContent = async () => {
    if (!input.trim()) return

    setIsGenerating(true)
    setGeneratedContent("")

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyDMQou9punwlsKSG8zQKDzafQUivkTBluU")
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = promptPrefix + input
      const result = await model.generateContent(prompt)
      setGeneratedContent(result.response.text())
    } catch (error) {
      console.error("Error generating content:", error)
      setGeneratedContent("Sorry, there was an error generating content. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Format the type for display (e.g., "lesson-plan" -> "Lesson Plan")
  const formatType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const renderContent = () => {
    if (!generatedContent) return null

    switch (type) {
      case "quiz":
        return <QuizRenderer content={generatedContent} />
      case "lesson-plan":
        return <LessonPlanRenderer content={generatedContent} />
      case "worksheet":
        return <WorksheetRenderer content={generatedContent} />
      case "courses":
        return <CourseRenderer content={generatedContent} />
      default:
        return (
          <div className="prose max-w-none">
            {generatedContent.split("\n").map((line, index) => (
              <p key={index} className={line.trim() === "" ? "my-4" : "my-2"}>
                {line}
              </p>
            ))}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="text-blue-400 font-bold text-xl">
              EduConnect
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Generate {formatType(type)}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Enter {inputLabel}
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
              placeholder={`e.g., "Introduction to JavaScript"`}
            />
            <button
              onClick={generateContent}
              disabled={isGenerating || !input.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </div>
        </div>

        {generatedContent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Generated {formatType(type)}</h2>
              <button
                onClick={() => {
                  const blob = new Blob([generatedContent], { type: "text/plain" })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement("a")
                  a.href = url
                  a.download = `${formatType(type)}_${input.replace(/\s+/g, "_")}.txt`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                }}
                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
            {renderContent()}
          </div>
        )}
      </div>
    </div>
  )
}