'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    // Fetch leaderboard data
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard');

        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }

        const data = await response.json();

        // Sort participants by score (descending)
        const sortedParticipants = data.sort((a, b) => b.score - a.score);
        setParticipants(sortedParticipants);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen w-screen overflow-hidden bg-gradient-to-br from-blue-400 via-cyan-600 to-blue-900 p-4 md:p-8"> {/* Full screen bg, water gradient, padding */}
      <div className="w-full max-w-6xl mx-auto"> {/* Increased max-width to take up more space */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-white border-opacity-30"> {/* Frosted glass effect */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0">Deep Dive Leaderboard</h1> {/* Darker text, adjusted size */}
            <Link
              href="/"
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors font-semibold" // Darker blue button, themed focus ring
            >
              Back to Shore (Home)
            </Link>
          </div>

          {loading && (
            <div className="flex justify-center py-8">
              {/* Adjusted spinner color */}
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-teal-500"></div>
            </div>
          )}

          {error && (

            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && participants.length === 0 && (

            <div className="text-center py-8 text-gray-700">
              No quiz participants yet. Dive in to be the first!
            </div>
          )}

          {!loading && !error && participants.length > 0 && (
            <div className="overflow-x-auto"> 
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-blue-100 bg-opacity-30"> 
                  <tr>
                   
                    <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                      Rank
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                      Phone
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-blue-800 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200"> 
                  {participants.map((participant, index) => (
                    <tr
                      key={index}
                      className={index === 0 ? 'bg-teal-200 bg-opacity-40 text-gray-900 font-bold' : 'text-gray-800'} // Highlight first place with light teal and bolder darker text, others dark gray text
                    >
                      {/* Darker text for table data */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {index + 1}
                        {index === 0 && ' 🏆'} {/* Keep trophy */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {participant.name}
                      </td>
                      {/* Darker text for phone */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {participant.phone}
                      </td>
                      {/* Darker, bolder text for score */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {participant.score} / 10
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}