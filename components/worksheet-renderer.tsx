import { FileText, HelpCircle, PenTool } from "lucide-react"

interface WorksheetRendererProps {
    content: string
}

export default function WorksheetRenderer({ content }: WorksheetRendererProps) {
    const sections = parseWorksheet(content)

    return (
        <div className="space-y-6 bg-white p-6 border rounded-lg">
            <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-bold text-center">Worksheet</h2>
            </div>

            {sections.map((section, index) => (
                <div key={index} className="mb-8">
                    {section.title && (
                        <div className="flex items-center mb-3">
                            {getWorksheetIcon(section.title)}
                            <h3 className="font-bold text-lg">{section.title}</h3>
                        </div>
                    )}

                    <div className="space-y-3 pl-2">
                        {section.content.map((item, itemIndex) => {
                            // Check if this is a question
                            const isQuestion =
                                item.trim().endsWith("?") ||
                                item.match(/^\d+[.)]\s/) ||
                                item.toLowerCase().includes("explain") ||
                                item.toLowerCase().includes("describe")

                            if (isQuestion) {
                                return (
                                    <div key={itemIndex} className="mb-4">
                                        <div className="font-medium mb-2">{item}</div>
                                        <div className="border-b border-dashed border-gray-300 pt-6"></div>
                                    </div>
                                )
                            }

                            // Check if this is a list item
                            if (item.startsWith("•") || item.startsWith("-")) {
                                return (
                                    <ul key={itemIndex} className="list-disc pl-5">
                                        <li>{item.replace(/^[•-]\s*/, "")}</li>
                                    </ul>
                                )
                            }

                            // Check if this is a numbered list item
                            if (item.match(/^\d+\.\s/)) {
                                return (
                                    <ol key={itemIndex} className="list-decimal pl-5">
                                        <li>{item.replace(/^\d+\.\s*/, "")}</li>
                                    </ol>
                                )
                            }

                            // Regular paragraph
                            return <p key={itemIndex}>{item}</p>
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}

function parseWorksheet(content: string) {
    const lines = content.split("\n").filter((line) => line.trim() !== "")
    const sections = []

    let currentSection = null
    let currentContent = []

    for (const line of lines) {
        // Check if this is a section header (all caps, or has a colon, or is short)
        const isHeader =
            line.toUpperCase() === line ||
            (line.includes(":") && !line.match(/^\d+[.)]\s/)) ||
            (line.length < 30 && !line.startsWith("•") && !line.startsWith("-") && !line.match(/^\d+[.)]\s/))

        if (isHeader) {
            // Save previous section if it exists
            if (currentContent.length > 0) {
                sections.push({
                    title: currentSection,
                    content: currentContent,
                })
            }

            // Start new section
            currentSection = line.replace(/:$/, "")
            currentContent = []
        } else {
            // Add to current section
            currentContent.push(line)
        }
    }

    // Add the last section
    if (currentContent.length > 0) {
        sections.push({
            title: currentSection,
            content: currentContent,
        })
    }

    return sections
}

function getWorksheetIcon(title: string) {
    if (!title) return <FileText className="w-5 h-5 mr-2 text-blue-500" />

    const lowerTitle = title.toLowerCase()

    if (lowerTitle.includes("question") || lowerTitle.includes("exercise")) {
        return <HelpCircle className="w-5 h-5 mr-2 text-blue-500" />
    } else if (lowerTitle.includes("activity") || lowerTitle.includes("practice")) {
        return <PenTool className="w-5 h-5 mr-2 text-blue-500" />
    } else {
        return <FileText className="w-5 h-5 mr-2 text-blue-500" />
    }
}

