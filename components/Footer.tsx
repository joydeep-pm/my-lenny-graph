'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Github, Home, Compass, Flame, CheckCircle, Brain, ExternalLink } from 'lucide-react';
import MethodologyModal from './MethodologyModal';

export default function Footer() {
  const [hasQuizResults, setHasQuizResults] = useState(false);
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);

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

    checkQuizCompletion();

    const handleFocus = () => checkQuizCompletion();
    window.addEventListener('focus', handleFocus);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'pm_quiz_answers') {
        checkQuizCompletion();
      }
    };
    window.addEventListener('storage', handleStorage);

    const handleQuizUpdate = () => checkQuizCompletion();
    window.addEventListener('quizUpdated', handleQuizUpdate);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('quizUpdated', handleQuizUpdate);
    };
  }, []);

  return (
    <footer className="bg-brand-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="font-brand-display text-xl font-semibold text-white mb-4 block">
              PM Intelligence
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Discover your product philosophy through AI-curated insights from 295 podcast episodes.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Navigation</h3>
            <nav className="space-y-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              {hasQuizResults ? (
                <Link
                  href="/results"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Your Results
                </Link>
              ) : (
                <Link
                  href="/quiz"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
                >
                  <Flame className="w-4 h-4" />
                  Take Quiz
                </Link>
              )}
              <Link
                href="/explore"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Compass className="w-4 h-4" />
                Explore Episodes
              </Link>
              <button
                onClick={() => setIsMethodologyOpen(true)}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Brain className="w-4 h-4" />
                Methodology
              </button>
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://www.joydeepsarkar.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                joydeepsarkar.me
              </a>
              <a
                href="https://github.com/joydeep-pm/my-lenny-graph"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                View on GitHub
              </a>
            </div>
          </div>

          {/* Built With */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Built With</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Next.js, React, Tailwind CSS, Framer Motion, and Claude Code for AI-powered curation.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <div>
              © 2026 <a href="https://www.joydeepsarkar.me" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Joydeep Sarkar</a>
            </div>
            <div className="flex gap-6">
              <a
                href="https://www.joydeepsarkar.me"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/joydeep-pm/my-lenny-graph/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>

      <MethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
      />
    </footer>
  );
}
