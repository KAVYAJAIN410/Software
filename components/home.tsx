import type React from "react"
import { BookOpen, FileEdit, FileCheck, HelpCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-blue-400 font-bold text-xl">
                EduConnect
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <Link href="/" className="text-white hover:text-gray-300">
                  Home
                </Link>
                <Link href="/courses" className="text-white hover:text-gray-300">
                  Courses
                </Link>
                <Link href="/dashboard" className="text-white hover:text-gray-300">
                  Dashboard
                </Link>
                <Link href="/about" className="text-white hover:text-gray-300">
                  About Us
                </Link>
                <Link href="/contact" className="text-white hover:text-gray-300">
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-white mr-2">Hello, Pakhi</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            title="Lesson Plan"
            description="Generate and modify comprehensive lesson plans."
            icon={<FileEdit className="w-10 h-10 text-blue-500" />}
          />

          <FeatureCard
            title="Worksheet"
            description="Generate a worksheet on any subject or topic."
            icon={<FileCheck className="w-10 h-10 text-blue-500" />}
          />

          <FeatureCard
            title="Courses"
            description="Generate and modify comprehensive lesson plans."
            icon={<BookOpen className="w-10 h-10 text-blue-500" />}
          />

          <FeatureCard
            title="Multiple Choice Quiz"
            description="Generate and modify comprehensive lesson plans."
            icon={<HelpCircle className="w-10 h-10 text-blue-500" />}
          />
        </div>
      </div>
    </main>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className="flex items-start mb-4">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-500 bg-blue-50 hover:bg-blue-100">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate
        </button>
      </div>
    </div>
  )
}

