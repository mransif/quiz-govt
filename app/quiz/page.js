'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(questions.length).fill(''));
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [participant, setParticipant] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get participant info from session storage
    const participantData = sessionStorage.getItem('participant');
    if (!participantData) {
      // Redirect to welcome page if no participant data
      router.push('/');
      return;
    }
    
    setParticipant(JSON.parse(participantData));
  }, [router]);

  useEffect(() => {
    // Start countdown when showing result
    if (showResult) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Go back to welcome page when timer ends
            router.push('/');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [showResult, router]);

  const handleOptionSelect = (option) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = option;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score
      let finalScore = 0;
      questions.forEach((question, index) => {
        if (selectedAnswers[index] === question.correctAnswer) {
          finalScore += 1;
        }
      });
      setScore(finalScore);
      
      // Submit score to API and show result
      submitScore(finalScore);
      // Note: setShowResult(true) is now called in submitScore
    }
  };

  const submitScore = async (finalScore) => {
    if (!participant) return;
    
    try {
      setShowResult(true); // Show result popup immediately
      
      const response = await fetch('/api/participants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: participant.name,
          phone: participant.phone,
          score: finalScore
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit score');
      }
      
      console.log('Score submitted successfully');
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const handleOkClick = () => {
    router.push('/');
  };

  if (!participant) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-3xl mx-auto">
        {/* Quiz progress */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Quiz Progress</h2>
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* Question and answers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-2xl font-medium mb-6">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left p-4 rounded-lg border ${
                  selectedAnswers[currentQuestionIndex] === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
          
          <button
            className="mt-8 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300"
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestionIndex]}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
          </button>
        </div>
      </div>
      
      {/* Results popup */}
      {showResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">Quiz Results</h2>
            <p className="text-center text-xl mb-6">
              Your score: <span className="font-bold">{score} / {questions.length}</span>
            </p>
            <div className="text-center mb-6">
              <p>Returning to welcome page in <span className="font-bold">{countdown}</span> seconds</p>
            </div>
            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={handleOkClick}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}