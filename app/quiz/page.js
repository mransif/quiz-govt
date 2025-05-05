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

            // Submit score to API
            submitScore(finalScore);

            // Show result popup
            setShowResult(true);
        }
    };

    const submitScore = async (finalScore) => {
        if (!participant) return;

        try {
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
        <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-400 via-cyan-600 to-blue-900 flex items-center justify-center p-4 md:p-8">
  <div className="w-full max-w-6xl mx-auto"> {/* Increased max-width */}
    {/* Quiz progress */}
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 mb-8 border border-white border-opacity-30">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Quiz Progress</h2> {/* Darker text */}
        <span className="text-xl md:text-2xl text-gray-700 font-medium"> {/* Darker text */}
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>
      <div className="w-full bg-white bg-opacity-30 rounded-full h-4"> {/* Progress bar background */}
        <div
          className="bg-teal-500 h-4 rounded-full transition-all duration-500 ease-out" // Teal progress color
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>
    </div>

    {/* Question and answers */}
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 border border-white border-opacity-30">
      <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">{currentQuestion.question}</h3> {/* Darker text */}

      <div className="space-y-5">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            className={`w-full text-left p-4 md:p-6 rounded-xl border-2 transition-all duration-300 text-lg md:text-xl font-semibold
                  ${selectedAnswers[currentQuestionIndex] === option
                    ? 'border-teal-400 bg-teal-500 bg-opacity-30 text-gray-900' // Selected: teal border, light teal fill, very dark text
                    : 'border-white border-opacity-40 hover:bg-blue-500 hover:bg-opacity-20 text-gray-800 hover:text-gray-900' // Default/Hover: subtle border, subtle hover fill, dark text
                  }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <button
        className="mt-10 w-full bg-blue-700 text-white text-xl md:text-2xl font-bold py-4 px-6 rounded-xl hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-400 transition-colors disabled:bg-gray-500 disabled:text-gray-300" // Darker blue button, adjusted disabled state
        onClick={handleNext}
        disabled={!selectedAnswers[currentQuestionIndex]}
      >
        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Quiz'}
      </button>
    </div>
  </div>

  {/* Results popup - Styled below */}
  {showResult && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm z-50"> {/* Added z-50 to ensure it's on top */}
    <div className="bg-gradient-to-b from-blue-600 to-cyan-700 rounded-xl shadow-2xl p-8 md:p-10 max-w-lg w-full border border-white border-opacity-20 transform scale-100 opacity-100 transition-all duration-300 ease-out"> {/* Slightly adjusted gradient, padding */}
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-6">Quiz Results</h2> {/* Kept white for strong contrast on dark background */}
      <p className="text-center text-xl md:text-2xl mb-8 text-blue-100"> {/* Lighter blue text for readability */}
        Your score: <span className="font-bold text-white">{score} / {questions.length}</span> {/* Score itself is white */}
      </p>
      <div className="text-center mb-8 text-blue-100 text-lg md:text-xl"> {/* Lighter blue text */}
        <p>Returning to welcome page in <span className="font-bold text-white">{countdown}</span> seconds</p> {/* Countdown itself is white */}
      </div>
      <button
        className="w-full bg-white text-blue-800 py-4 px-6 rounded-xl hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition-colors text-xl md:text-2xl font-bold" // White button with darker blue text
        onClick={handleOkClick}
      >
        OK
      </button>
    </div>
  </div>
)}
</main>

// Separate JSX snippet for the Results Popup

    );
}