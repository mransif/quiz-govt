'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!name.trim() || !phone.trim()) {
      setError('Please enter both name and phone number');
      return;
    }
    
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    
    try {
      // Store participant info in session storage
      sessionStorage.setItem('participant', JSON.stringify({ name, phone }));
      
      // Navigate to quiz page
      router.push('/quiz');
    } catch (error) {
      console.error('Error storing participant data:', error);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-300 to-teal-400 p-4">
  <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-8 md:p-12">
    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 text-center mb-10">
      Deep Dive Quiz Challenge
    </h1>

    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label htmlFor="name" className="block text-base font-semibold text-gray-700 mb-2">
          Your Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-4 text-lg text-gray-800 focus:ring-teal-500 focus:border-teal-500 transition"
          placeholder="Enter your full name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-base font-semibold text-gray-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm p-4 text-lg text-gray-800 focus:ring-teal-500 focus:border-teal-500 transition"
          placeholder="Enter your 10-digit phone number"
        />
      </div>

      {error && (
        <p className="text-red-600 text-center text-base">{error}</p>
      )}

      <button
        type="submit"
        className="w-full bg-teal-600 text-white text-xl font-bold py-4 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors transform hover:scale-105"
      >
        Embark on the Challenge
      </button>
    </form>

    <div className="mt-10 text-center">
      <Link href="/leaderboard" className="text-blue-700 hover:text-blue-900 text-lg underline transition-colors">
        View The Depths (Leaderboard)
      </Link>
    </div>
  </div>
</main>
  );
}