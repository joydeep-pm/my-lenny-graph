'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check } from 'lucide-react';
import { questions } from '@/lib/questions';
import { QuizAnswers } from '@/lib/types';

interface QuizAnswersOverviewProps {
  answers: QuizAnswers;
  userName: string;
}

export default function QuizAnswersOverview({ answers, userName }: QuizAnswersOverviewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyAnswers = () => {
    // Create a formatted text version of the answers
    let text = `${userName !== 'Your' ? `${userName}'s` : 'My'} Product Philosophy Quiz Answers\n\n`;

    questions.forEach((question, index) => {
      const answerId = answers[question.id];
      const selectedAnswer = question.answers.find(a => a.id === answerId);

      if (selectedAnswer) {
        text += `${index + 1}. ${question.text}\n`;
        text += `   → ${selectedAnswer.icon} ${selectedAnswer.text}\n\n`;
      }
    });

    text += `\nTake the quiz: ${window.location.origin}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `I just mapped out how I think as a PM! Check out my quiz answers and discover your own product philosophy.`;

    if (navigator.share) {
      navigator.share({
        title: `${userName !== 'Your' ? `${userName}'s` : 'My'} Product Philosophy`,
        text: text,
        url: window.location.origin,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      handleCopyAnswers();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="border-2 border-ash-darker bg-void-light/50 backdrop-blur-sm p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-amber mb-2">
            How You Think
          </h2>
          <p className="text-sm md:text-base text-ash-dark">
            Your answers to the 10 philosophy questions
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyAnswers}
            className="p-2 md:p-3 border border-ash-darker text-ash-dark hover:text-amber hover:border-amber transition-all"
            title="Copy answers"
          >
            {copied ? <Check className="w-4 h-4 md:w-5 md:h-5 text-amber" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2 md:p-3 border border-ash-darker text-ash-dark hover:text-amber hover:border-amber transition-all"
            title="Share answers"
          >
            <Share2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      {/* Quiz Answers */}
      <div className="space-y-4 md:space-y-6">
        {questions.map((question, index) => {
          const answerId = answers[question.id];
          const selectedAnswer = question.answers.find(a => a.id === answerId);

          if (!selectedAnswer) return null;

          return (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="border-l-2 border-amber/30 pl-4 md:pl-6 py-2"
            >
              {/* Question Number & Text */}
              <div className="flex items-start gap-3 mb-2">
                <span className="text-xs md:text-sm font-mono text-amber font-bold flex-shrink-0 mt-1">
                  Q{index + 1}
                </span>
                <p className="text-sm md:text-base text-ash-dark leading-relaxed">
                  {question.text}
                </p>
              </div>

              {/* Selected Answer */}
              <div className="ml-7 md:ml-9 flex items-start gap-2 bg-void border border-amber/20 p-3 md:p-4">
                <span className="text-xl md:text-2xl flex-shrink-0">{selectedAnswer.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-amber font-mono font-bold mb-1">
                    YOUR ANSWER
                  </p>
                  <p className="text-sm md:text-base text-ash leading-relaxed">
                    {selectedAnswer.text}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Copy confirmation */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-amber/10 border border-amber text-amber text-sm text-center font-mono"
        >
          ✓ Answers copied to clipboard!
        </motion.div>
      )}

      {/* Footer note */}
      <div className="mt-6 pt-6 border-t border-ash-darker/50">
        <p className="text-xs text-ash-darker text-center font-mono">
          Share this with your team to understand how each person approaches product decisions
        </p>
      </div>
    </motion.div>
  );
}
