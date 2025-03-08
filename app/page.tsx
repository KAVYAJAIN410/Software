"use client"
import Image from "next/image";
import NavBar from "../components/nav";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, FileEdit, FileCheck, HelpCircle, Sparkles } from "lucide-react"
import Link from "next/link"

export default function Home() {
  // const router=useRouter();
  // const { data: session, status } = useSession();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [activities, setActivities] = useState([]);

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     getUserData();
  //   }
  // }, [status]);
  // const getUserData = () => {
  //   fetch(`/api/userInfo`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${session?.accessTokenBackend}`,
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {

  //     });
  // };

  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FeatureCard
                  title="Lesson Plan"
                  description="Generate and modify comprehensive lesson plans."
                  icon={<FileEdit className="w-10 h-10 text-blue-500" />}
                  type="lesson-plan"
                />
      
                <FeatureCard
                  title="Worksheet"
                  description="Generate a worksheet on any subject or topic."
                  icon={<FileCheck className="w-10 h-10 text-blue-500" />}
                  type="worksheet"
                  />
                   <CourseCard></CourseCard>
      
                <FeatureCard
                  title="Multiple Choice Quiz"
                  description="Generate and modify comprehensive lesson plans."
                  icon={<HelpCircle className="w-10 h-10 text-blue-500" />}
                  type="quiz"
                />
              </div>
            </div>
          </main>
    </>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  type: string
}

function FeatureCard({ title, description, icon, type }: FeatureCardProps) {
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
      <Link href={`/generate/${type}`}>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-500 bg-blue-50 hover:bg-blue-100">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate
          </button>
        </Link>
      </div>
    </div>
  )
}
function CourseCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className="flex items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2">Course</h3>
          <p className="text-gray-600">upload and view th ematerials</p>
        </div>
      </div>
      <div className="mt-4 border-t pt-4">
      <Link href={`/courses`}>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-500 bg-blue-50 hover:bg-blue-100">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate
          </button>
        </Link>
      </div>
    </div>
  )
}
