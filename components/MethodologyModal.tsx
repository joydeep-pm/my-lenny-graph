'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Brain, Code, Sparkles, Database, FileText } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-secondary/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-brand-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-primary/10 rounded-xl">
                  <Brain className="w-6 h-6 text-brand-primary" />
                </div>
                <h2 className="text-xl font-brand-display font-bold text-brand-secondary">
                  Methodology
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-bg-secondary rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-brand-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <p className="text-lg text-brand-text-secondary leading-relaxed">
                This PM Intelligence Engine was built using <span className="text-brand-primary font-semibold">Claude Code</span> to extract, analyze, and curate insights from podcast transcripts.
              </p>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-secondary flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand-primary" />
                  Data Collection
                </h3>
                <p className="text-brand-text-secondary leading-relaxed">
                  295 podcast episode transcripts were processed, each containing conversations with product leaders from companies like Airbnb, Stripe, Figma, and more.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-secondary flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-primary" />
                  AI-Powered Extraction
                </h3>
                <p className="text-brand-text-secondary leading-relaxed">
                  Claude Code analyzed each transcript to identify key quotes, themes, and insights. The AI was instructed to:
                </p>
                <ul className="list-disc list-inside text-brand-text-secondary space-y-2 ml-4">
                  <li>Extract substantive quotes (120-500 characters)</li>
                  <li>Skip promotional content from the first 5 minutes</li>
                  <li>Tag quotes with relevant philosophy zones</li>
                  <li>Verify timestamps and line numbers for accuracy</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-secondary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-primary" />
                  Philosophy Framework
                </h3>
                <p className="text-brand-text-secondary leading-relaxed">
                  Eight distinct product philosophy zones were identified through pattern analysis:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    'Visionary Builder',
                    'Data Scientist',
                    'User Advocate',
                    'Growth Hacker',
                    'Technical Architect',
                    'Team Leader',
                    'Strategic Thinker',
                    'Execution Machine'
                  ].map((zone) => (
                    <div
                      key={zone}
                      className="px-3 py-2 bg-brand-primary/10 text-brand-primary text-sm rounded-lg"
                    >
                      {zone}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-brand-secondary flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-primary" />
                  Quality Assurance
                </h3>
                <p className="text-brand-text-secondary leading-relaxed">
                  Every extracted quote is validated against the original transcript with exact line numbers. The build system automatically fails if quotes don't match their source, ensuring 100% accuracy.
                </p>
              </div>

              <div className="mt-8 p-4 bg-brand-bg-secondary border border-brand-border rounded-xl">
                <p className="text-sm text-brand-text-secondary">
                  <span className="text-brand-primary font-semibold">Built with Claude Code</span> — Anthropic's AI-powered development tool that enables intelligent code generation, analysis, and automation.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-brand-border">
              <button
                onClick={onClose}
                className="w-full py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for using the modal
export function useMethodologyModal() {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
  };
}
