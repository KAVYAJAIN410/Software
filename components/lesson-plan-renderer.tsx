import { BookOpen, Clock, Target, Users, List, CheckSquare } from "lucide-react"

interface LessonPlanRendererProps {
    content: string
}

export default function LessonPlanRenderer({ content }: LessonPlanRendererProps) {
    // Parse the lesson plan content
    const sections = parseLessonPlan(content)

    return (
        <div className="space-y-6">
            {sections.map((section, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b flex items-center">
                        {getSectionIcon(section.title)}
                        <h3 className="font-semibold text-lg ml-2">{section.title}</h3>
                    </div>
                    <div className="p-4 bg-white">
                        {section.content.map((paragraph, pIndex) => (
                            <div key={pIndex} className="mb-3">
                                {paragraph.startsWith("•") || paragraph.startsWith("-") ? (
                                    <ul className="list-disc pl-5">
                                        <li>{paragraph.replace(/^[•-]\s*/, "")}</li>
                                    </ul>
                                ) : paragraph.match(/^\d+\.\s/) ? (
                                    <ol className="list-decimal pl-5">
                                        <li>{paragraph.replace(/^\d+\.\s*/, "")}</li>
                                    </ol>
                                ) : (
                                    <p>{paragraph}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function parseLessonPlan(content: string) {
    const lines = content.split("\n").filter((line) => line.trim() !== "")
    const sections = []

    let currentSection = null
    let currentContent = []

    for (const line of lines) {
        // Check if this is a section header (all caps, or has a colon, or is short)
        const isHeader =
            line.toUpperCase() === line ||
            line.includes(":") ||
            (line.length < 30 && !line.startsWith("•") && !line.startsWith("-") && !line.match(/^\d+\.\s/))

        if (isHeader) {
            // Save previous section if it exists
            if (currentSection && currentContent.length > 0) {
                sections.push({
                    title: currentSection,
                    content: currentContent,
                })
            }

            // Start new section
            currentSection = line.replace(/:$/, "")
            currentContent = []
        } else if (currentSection) {
            // Add to current section
            currentContent.push(line)
        }
    }

    // Add the last section
    if (currentSection && currentContent.length > 0) {
        sections.push({
            title: currentSection,
            content: currentContent,
        })
    }

    return sections
}

function getSectionIcon(title: string) {
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes("objective") || lowerTitle.includes("goal")) {
        return <Target className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("duration") || lowerTitle.includes("time")) {
        return <Clock className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("material") || lowerTitle.includes("resource")) {
        return <BookOpen className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("student") || lowerTitle.includes("audience")) {
        return <Users className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("activity") || lowerTitle.includes("procedure")) {
        return <List className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("assessment") || lowerTitle.includes("evaluation")) {
        return <CheckSquare className="w-5 h-5 text-blue-600" />
    } else {
        return <BookOpen className="w-5 h-5 text-blue-600" />
    }
}

