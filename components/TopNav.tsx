'use client';

import Link from 'next/link';
import { Home, Compass, Flame, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function TopNav() {
  const [hasQuizResults, setHasQuizResults] = useState(false);

  useEffect(() => {
    const checkQuizCompletion = () => {
      try {
        const savedAnswers = localStorage.getItem('pm_quiz_answers');
        if (savedAnswers) {
          const answers = JSON.parse(savedAnswers);
          const answerCount = Object.keys(answers).length;
          setHasQuizResults(answerCount >= 7);
        } else {
          setHasQuizResults(false);
        }
      } catch (e) {
        console.error('Error checking quiz completion:', e);
      }
    };

    // Check on mount
    checkQuizCompletion();

    // Listen for quiz updates
    const handleQuizUpdate = () => checkQuizCompletion();
    window.addEventListener('quizUpdated', handleQuizUpdate);

    return () => {
      window.removeEventListener('quizUpdated', handleQuizUpdate);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-brand-background/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Home */}
          <Link
            href="/"
            className="flex items-center gap-2 text-brand-secondary hover:text-brand-primary transition-colors font-brand-display font-semibold tracking-wide"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">PM Intelligence</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              href="/explore"
              className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors text-sm"
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Explore</span>
            </Link>

            {hasQuizResults ? (
              <Link
                href="/results"
                className="flex items-center gap-2 text-brand-text-secondary hover:text-brand-primary transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Results</span>
              </Link>
            ) : (
              <Link
                href="/quiz"
                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white hover:bg-brand-primary/90 transition-all text-sm font-semibold rounded-lg"
              >
                <Flame className="w-4 h-4" />
                <span className="hidden sm:inline">Take Quiz</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
