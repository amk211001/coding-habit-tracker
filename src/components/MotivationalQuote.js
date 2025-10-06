import { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

// A self-contained list of quotes. This can be easily expanded.
const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Consistency is more important than perfection.", author: "Unknown" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" }
];

function MotivationalQuote() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  // This useEffect runs only once when the component is first mounted.
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []); // Empty dependency array ensures it runs only once.

  if (!quote.text) {
    return null; // Don't render anything until a quote is selected
  }

  return (
    // This entire component is styled using existing utility classes from the project.
    <div className="w-full max-w-2xl mx-auto p-4 mb-6 bg-gray-100 border border-gray-200 rounded-lg shadow-sm text-center">
      <div className="flex items-center justify-center gap-2">
        <Lightbulb size={20} className="text-yellow-500" />
        <h3 className="font-semibold text-gray-800">Food for Thought</h3>
      </div>
      <p className="text-lg italic text-gray-700 mt-2">"{quote.text}"</p>
      <span className="block text-right text-sm text-gray-500 font-medium mt-2">- {quote.author}</span>
    </div>
  );
}

export default MotivationalQuote;