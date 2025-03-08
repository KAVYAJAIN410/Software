import Image from "next/image"
import Link from "next/link"
import back from "@/assets/Rectangle.svg"
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      

      {/* Hero Section */}
      <main className="flex-1 relative">
        <div className="absolute inset-0 z-0">
          <Image
            src={back}
            alt="Student studying with laptop and book"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="justify-center relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col h-full ">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Empowering <span className="text-blue-400">Educators</span>,<br />
                Enhancing <span className="text-blue-400">Learning</span>
              </h1>
            </div>

            <div className="space-y-8">
              <p className="text-white text-lg md:text-xl">
                Discover, learn, and grow with our curated courses and community resources
              </p>

              <div className="flex flex-wrap gap-4">
                <button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-2xl p-4">
                  Get Started
                </button>
                <button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
