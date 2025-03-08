import { BookOpen, Calendar, Clock, GraduationCap, Target, Users } from "lucide-react"

interface CourseRendererProps {
    content: string
}

export default function CourseRenderer({ content }: CourseRendererProps) {
    const sections = parseCourseOutline(content)

    return (
        <div className="space-y-6">
            {sections.map((section, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-blue-50 p-4 border-b flex items-center">
                        {getCourseIcon(section.title)}
                        <h3 className="font-semibold text-lg ml-2">{section.title}</h3>
                    </div>
                    <div className="p-4 bg-white">
                        {section.content.map((paragraph, pIndex) => {
                            // Check if this is a list item
                            if (paragraph.startsWith("•") || paragraph.startsWith("-")) {
                                return (
                                    <ul key={pIndex} className="list-disc pl-5 mb-2">
                                        <li>{paragraph.replace(/^[•-]\s*/, "")}</li>
                                    </ul>
                                )
                            }

                            // Check if this is a numbered list item
                            if (paragraph.match(/^\d+\.\s/)) {
                                return (
                                    <ol key={pIndex} className="list-decimal pl-5 mb-2">
                                        <li>{paragraph.replace(/^\d+\.\s*/, "")}</li>
                                    </ol>
                                )
                            }

                            // Check if this is a module or unit
                            if (paragraph.match(/^(Module|Unit|Week)\s+\d+:/i)) {
                                return (
                                    <div key={pIndex} className="font-medium text-blue-700 mt-4 mb-2">
                                        {paragraph}
                                    </div>
                                )
                            }

                            // Regular paragraph
                            return (
                                <p key={pIndex} className="mb-2">
                                    {paragraph}
                                </p>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

function parseCourseOutline(content: string) {
    const lines = content.split("\n").filter((line) => line.trim() !== "")
    const sections = []

    let currentSection = null
    let currentContent = []

    for (const line of lines) {
        // Check if this is a section header (all caps, or has a colon, or is short)
        const isHeader =
            line.toUpperCase() === line ||
            (line.includes(":") && !line.match(/^(Module|Unit|Week)\s+\d+:/i) && !line.match(/^\d+[.)]\s/)) ||
            (line.length < 30 && !line.startsWith("•") && !line.startsWith("-") && !line.match(/^\d+[.)]\s/))

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

function getCourseIcon(title: string) {
    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes("objective") || lowerTitle.includes("goal")) {
        return <Target className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("duration") || lowerTitle.includes("schedule")) {
        return <Calendar className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("content") || lowerTitle.includes("module") || lowerTitle.includes("topic")) {
        return <BookOpen className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("student") || lowerTitle.includes("audience") || lowerTitle.includes("prerequisite")) {
        return <Users className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("assessment") || lowerTitle.includes("evaluation") || lowerTitle.includes("grading")) {
        return <GraduationCap className="w-5 h-5 text-blue-600" />
    } else if (lowerTitle.includes("time") || lowerTitle.includes("hour")) {
        return <Clock className="w-5 h-5 text-blue-600" />
    } else {
        return <BookOpen className="w-5 h-5 text-blue-600" />
    }
}

