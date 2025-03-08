"use client"

import { useState } from "react"
import { Check, X } from 'lucide-react'

interface QuizRendererProps {
  content: string
}

interface Question {
  question: string
  options: { label: string; text: string }[]
  correctAnswer: string
}

export default function QuizRenderer({ content }: QuizRendererProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  // Parse the quiz content
  const parseQuiz = (content: string): Question[] => {
    const questions: Question[] = []
    
    // Split content into lines for easier processing
    const lines = content.trim().split('\n');
    
    let currentQuestion: Partial<Question> | null = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Check for question pattern (numbered questions or starting with "Question")
      const questionMatch = line.match(/^(\d+\.|Question\s+\d+:|Q\d+:)\s*(.+)/i);
      
      if (questionMatch) {
        // Save previous question if exists
        if (currentQuestion?.question && currentQuestion?.options?.length >= 2 && currentQuestion?.correctAnswer) {
          questions.push(currentQuestion as Question);
        }
        
        // Start new question
        currentQuestion = {
          question: questionMatch[2].trim(),
          options: [],
          correctAnswer: ''
        };
        continue;
      }
      
      // If we have a current question, look for options
      if (currentQuestion) {
        // Option pattern: a) Option text or A. Option text or A: Option text
        const optionMatch = line.match(/^([a-d])[.)\s:]\s*(.+)/i);
        
        if (optionMatch) {
          const label = optionMatch[1].toUpperCase();
          const text = optionMatch[2].trim();
          currentQuestion.options = [...(currentQuestion.options || []), { label, text }];
          
          // Check if this option is marked as correct (with asterisk or "correct" word)
          if (text.includes('*') || text.toLowerCase().includes('correct')) {
            currentQuestion.correctAnswer = label;
          }
          continue;
        }
        
        // Look for explicit correct answer indication
        const answerMatch = line.match(/correct\s+answer\s*[:\s]\s*([A-Da-d])/i) ||
                           line.match(/answer\s*[:\s]\s*([A-Da-d])/i) ||
                           line.match(/^([A-Da-d])\s+is\s+correct/i) ||
                           line.match(/correct\s+option\s*[:\s]\s*([A-Da-d])/i);
        
        if (answerMatch) {
          currentQuestion.correctAnswer = answerMatch[1].toUpperCase();
        }
      }
    }
    
    // Add the last question if it exists
    if (currentQuestion?.question && currentQuestion?.options?.length >= 2 && currentQuestion?.correctAnswer) {
      questions.push(currentQuestion as Question);
    }
    
    // If no correct answers were found in any questions, try to infer from context
    // This is a fallback for simple quiz formats
    if (questions.length > 0 && !questions.some(q => q.correctAnswer)) {
      // For educational quizzes, option D is often correct for "NOT" questions
      questions.forEach(q => {
        if (q.question.includes(" NOT ") && q.options.some(o => o.label === "D")) {
          q.correctAnswer = "D";
        }
      });
    }
    
    return questions;
  }

  const questions = parseQuiz(content)
  
  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (showResults) return
    
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }
  
  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return correct
  }

  return (
    <div className="space-y-8">
      {questions.length === 0 ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            Could not parse quiz questions. The AI might have generated content in an unexpected format. 
            Try generating again or check the downloaded PDF for the complete quiz.
          </p>
          <pre className="mt-4 p-3 bg-gray-50 rounded text-xs overflow-auto max-h-100">
            {content}...
          </pre>
        </div>
      ) : (
        <>
          {questions.map((question, qIndex) => (
            <div key={qIndex} className="border rounded-lg p-4 bg-gray-50">
              <h3 className="font-medium text-lg mb-3">Question {qIndex + 1}: {question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option) => (
                  <div 
                    key={option.label}
                    onClick={() => handleSelectAnswer(qIndex, option.label)}
                    className={`
                      p-3 rounded-md cursor-pointer flex items-center
                      ${selectedAnswers[qIndex] === option.label ? 'bg-blue-100 border border-blue-300' : 'bg-white border hover:bg-gray-100'}
                      ${showResults && option.label === question.correctAnswer ? 'bg-green-100 border-green-300' : ''}
                      ${showResults && selectedAnswers[qIndex] === option.label && option.label !== question.correctAnswer ? 'bg-red-100 border-red-300' : ''}
                    `}
                  >
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center mr-3 font-medium
                      ${selectedAnswers[qIndex] === option.label ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                      ${showResults && option.label === question.correctAnswer ? 'bg-green-500 text-white' : ''}
                      ${showResults && selectedAnswers[qIndex] === option.label && option.label !== question.correctAnswer ? 'bg-red-500 text-white' : ''}
                    `}>
                      {option.label}
                    </div>
                    <span>{option.text}</span>
                    {showResults && option.label === question.correctAnswer && (
                      <Check className="ml-auto text-green-500 w-5 h-5" />
                    )}
                    {showResults && selectedAnswers[qIndex] === option.label && option.label !== question.correctAnswer && (
                      <X className="ml-auto text-red-500 w-5 h-5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex justify-center mt-6">
            {showResults ? (
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">
                  Your Score: {calculateScore()}/{questions.length}
                </div>
                <button
                  onClick={() => {
                    setShowResults(false)
                    setSelectedAnswers({})
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Retry Quiz
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length !== questions.length}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Answers
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
