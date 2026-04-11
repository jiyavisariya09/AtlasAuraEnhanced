'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, CheckCircle, Tag, Search, Plus, X } from 'lucide-react';
import { questions } from '@/data/mockData';
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/context/ThemeContext';

interface CuriosityFeedProps {
  isLoggedIn: boolean;
}

export default function CuriosityFeed({ isLoggedIn }: CuriosityFeedProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || q.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <section id="curiosity" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Global Curiosity Feed</span>
          </div>
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ask. Learn. <span className="text-gradient">Share.</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
            A traveler-friendly Q&A community where curiosity meets experience. 
            Get answers from those who've been there.
          </p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 bg-white/5 border-white/10 text-white placeholder:text-slate-500"
              />
            </div>
            {isLoggedIn && (
              <Button
                onClick={() => setShowAskModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-medium px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                !selectedTag ? 'bg-amber-500 text-slate-900' : 'glass text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                  selectedTag === tag ? 'bg-amber-500 text-slate-900' : isDark ? 'glass text-slate-400 hover:text-white' : 'glass text-slate-700 hover:text-slate-900'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => setSelectedQuestion(question)}
            >
              <div className="h-full p-6 rounded-2xl glass hover:border-amber-500/30 transition-all duration-300">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-200 text-slate-700'}`}
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h3 className={`text-lg font-semibold mb-2 group-hover:text-amber-400 transition-colors line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {question.title}
                </h3>

                {/* Content Preview */}
                <p className={`text-sm line-clamp-2 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
                  {question.content}
                </p>

                {/* Footer */}
                <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{question.author}</span>
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {question.answers.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {question.likes}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" className={`px-8 ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
            View All Questions
          </Button>
        </motion.div>
      </div>

      {/* Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedQuestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl glass"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedQuestion(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="p-8">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedQuestion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-4">
                  {selectedQuestion.title}
                </h2>

                {/* Content */}
                <p className="text-slate-300 mb-6">{selectedQuestion.content}</p>

                {/* Author */}
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  <div>
                    <p className="text-white font-medium">{selectedQuestion.author}</p>
                    <p className="text-sm text-slate-400">{selectedQuestion.date}</p>
                  </div>
                </div>

                {/* Answers */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Answers ({selectedQuestion.answers.length})
                  </h3>
                  <div className="space-y-4">
                    {selectedQuestion.answers.map((answer) => (
                      <div
                        key={answer.id}
                        className="p-4 rounded-xl bg-white/5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-white font-medium">{answer.author}</span>
                              {answer.isHelpful && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                                  <CheckCircle className="w-3 h-3" />
                                  Helpful
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm">{answer.content}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                              <button className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                                <ThumbsUp className="w-4 h-4" />
                                {answer.likes}
                              </button>
                              <span>{answer.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer Input */}
                {isLoggedIn && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0" />
                      <div className="flex-1">
                        <textarea
                          placeholder="Share your experience..."
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 resize-none"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900"
                          >
                            Post Answer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full rounded-2xl glass p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAskModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Ask the Community</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Title</label>
                  <Input
                    placeholder="What's your question?"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Details</label>
                  <textarea
                    placeholder="Provide more context..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 resize-none"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tags</label>
                  <Input
                    placeholder="Add tags (comma separated)"
                    className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold">
                  Post Question
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
