'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import TopNav from '@/components/TopNav';
import { ArrowRight, Sparkles, Users, BookOpen } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [hasQuizResults, setHasQuizResults] = useState(false);

  // Check if user has completed the quiz
  useEffect(() => {
    const checkQuizCompletion = () => {
      try {
        const savedAnswers = localStorage.getItem('pm_quiz_answers');
        if (savedAnswers) {
          const answers = JSON.parse(savedAnswers);
          const answerCount = Object.keys(answers).length;
          setHasQuizResults(answerCount >= 7);
        }
      } catch (e) {
        console.error('Error checking quiz completion:', e);
      }
    };

    checkQuizCompletion();
  }, []);

  const handleRetakeQuiz = () => {
    try {
      localStorage.removeItem('pm_quiz_answers');
      localStorage.removeItem('pm_map_name');
      localStorage.removeItem('pm_map_role');
      localStorage.removeItem('pm_map_quiz_progress');
      setHasQuizResults(false);
      window.dispatchEvent(new Event('quizUpdated'));
      router.push('/quiz');
    } catch (e) {
      console.error('Error clearing quiz data:', e);
      router.push('/quiz');
    }
  };

  return (
    <main className="min-h-screen bg-brand-background">
      <TopNav />

      {/* Hero Section */}
      <div className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4" />
              AI-Curated Insights from 295 Episodes
            </motion.div>

            {/* Main Heading */}
            <h1 className="font-brand-display text-4xl md:text-6xl lg:text-7xl font-bold text-brand-secondary leading-tight mb-6">
              Discover Your
              <span className="text-brand-primary block">Product Philosophy</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-brand-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Take a 10-question quiz and get personalized podcast recommendations
              that match how you think and work as a product manager.
            </p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {hasQuizResults ? (
                <>
                  <button
                    onClick={() => router.push('/results')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    View Your Results
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleRetakeQuiz}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-secondary font-semibold rounded-lg border border-brand-border hover:border-brand-primary hover:text-brand-primary transition-all"
                  >
                    Retake Quiz
                  </button>
                </>
              ) : (
                <button
                  onClick={() => router.push('/quiz')}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
                >
                  Start the Quiz
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => router.push('/explore')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-secondary font-semibold rounded-lg border border-brand-border hover:border-brand-primary hover:text-brand-primary transition-all"
              >
                Browse Episodes
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-16 md:py-24 bg-brand-bg-secondary">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-brand-display text-3xl md:text-4xl font-bold text-brand-secondary mb-4">
              How It Works
            </h2>
            <p className="text-brand-text-secondary max-w-xl mx-auto">
              Three simple steps to discover your product management style
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Answer Questions',
                description: 'Complete a 10-question quiz about how you approach product decisions and challenges.',
                icon: BookOpen,
              },
              {
                step: '02',
                title: 'Get Your Profile',
                description: 'Discover your unique product philosophy based on eight distinct PM archetypes.',
                icon: Users,
              },
              {
                step: '03',
                title: 'Find Episodes',
                description: 'Get personalized podcast recommendations that match your thinking style.',
                icon: Sparkles,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-brand-border hover:border-brand-primary/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-brand-primary" />
                </div>
                <div className="text-sm font-medium text-brand-primary mb-2">Step {item.step}</div>
                <h3 className="font-brand-display text-xl font-semibold text-brand-secondary mb-3">
                  {item.title}
                </h3>
                <p className="text-brand-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '295', label: 'Episodes Analyzed' },
              { value: '8', label: 'Philosophy Types' },
              { value: '10', label: 'Quiz Questions' },
              { value: '100%', label: 'AI-Curated' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-center"
              >
                <div className="font-brand-display text-4xl md:text-5xl font-bold text-brand-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-brand-text-secondary text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 md:py-24 bg-brand-secondary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-brand-display text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to discover your PM philosophy?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Join product managers who have discovered their unique approach to building great products.
            </p>
            <button
              onClick={() => router.push(hasQuizResults ? '/results' : '/quiz')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-secondary font-semibold rounded-lg hover:bg-brand-background transition-all"
            >
              {hasQuizResults ? 'View Your Results' : 'Start the Quiz'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
