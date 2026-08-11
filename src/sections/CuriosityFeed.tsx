'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, CheckCircle, Tag, Search, Plus, X } from 'lucide-react';
import { questions as initialQuestions } from '@/data/mockData';
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/context/ThemeContext';
import { getAuthorAvatar } from '@/lib/utils';

interface CuriosityFeedProps {
  isLoggedIn: boolean;
}

export default function CuriosityFeed({ isLoggedIn }: CuriosityFeedProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);

  // Ask question form state
  const [askTitle, setAskTitle] = useState('');
  const [askDetails, setAskDetails] = useState('');
  const [askTags, setAskTags] = useState('');

  // Answer input per question (keyed by question id)
  const [answerText, setAnswerText] = useState('');

  const allTags = Array.from(new Set(questions.flatMap(q => q.tags)));

  const filteredQuestions = questions.filter(q => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || q.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handlePostQuestion = () => {
    if (!askTitle.trim() || !askDetails.trim()) return;
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      title: askTitle.trim(),
      content: askDetails.trim(),
      author: 'You',
      tags: askTags.split(',').map(t => t.trim()).filter(Boolean),
      answers: [],
      likes: 0,
      date: new Date().toISOString().split('T')[0],
    };
    setQuestions(prev => [newQuestion, ...prev]);
    setAskTitle('');
    setAskDetails('');
    setAskTags('');
    setShowAskModal(false);
  };

  const handlePostAnswer = () => {
    if (!answerText.trim() || !selectedQuestion) return;
    const newAnswer = {
      id: `a-${Date.now()}`,
      content: answerText.trim(),
      author: 'You',
      likes: 0,
      isHelpful: false,
      date: new Date().toISOString().split('T')[0],
    };
    const updatedQuestion = {
      ...selectedQuestion,
      answers: [...selectedQuestion.answers, newAnswer],
    };
    setQuestions(prev => prev.map(q => q.id === selectedQuestion.id ? updatedQuestion : q));
    setSelectedQuestion(updatedQuestion);
    setAnswerText('');
  };

  const inputCls = `bg-white/5 border-white/10 text-white placeholder:text-slate-500`;

  return (
    <section id="curiosity" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} className="text-center mb-16">
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Ask. Learn. <span className="text-gradient">Share.</span>
          </h2>
          <p className={`text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            A traveler-friendly Q&A community where curiosity meets experience. Get answers from those who've been there.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 1, 0.5, 1] }} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`pl-12 py-6 ${inputCls}`}
              />
            </div>
            {isLoggedIn && (
              <Button
                onClick={() => setShowAskModal(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-medium px-6"
              >
                <Plus className="w-4 h-4 mr-2" />Ask Question
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-3 py-1.5 rounded-full text-sm transition-all duration-500 ease-smooth ${!selectedTag ? 'bg-sky-500 text-white' : isDark ? 'glass text-slate-400 hover:text-white' : 'glass text-slate-600 hover:text-slate-900'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all duration-500 ease-smooth ${selectedTag === tag ? 'bg-sky-500 text-white' : isDark ? 'glass text-slate-400 hover:text-white' : 'glass text-slate-600 hover:text-slate-900'}`}
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
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 1, 0.5, 1] }}
              className="group cursor-pointer"
              onClick={() => { setSelectedQuestion(question); setAnswerText(''); }}
            >
              <div className="h-full p-6 rounded-2xl glass hover:border-sky-500/30 transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:shadow-xl hover:shadow-sky-500/8 transform-gpu flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map(tag => (
                      <span key={tag} className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-full font-medium ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-200 text-slate-700'}`}>
                        <Tag className="w-3 h-3 text-amber-400" />{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className={`text-lg font-semibold mb-2 group-hover:text-sky-400 transition-colors duration-500 ease-smooth line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {question.title}
                  </h3>
                  <p className={`text-sm line-clamp-2 mb-6 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{question.content}</p>
                </div>
                <div className={`flex items-center justify-between pt-4 border-t mt-auto ${isDark ? 'border-white/8' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getAuthorAvatar(question.author)}
                      alt={question.author}
                      className="w-8 h-8 rounded-full object-cover border border-amber-500/30 shrink-0 shadow-sm"
                    />
                    <span className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{question.author}</span>
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                    <span className="flex items-center gap-1.5"><MessageCircle className="w-4 h-4" />{question.answers.length}</span>
                    <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" />{question.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
          <Button variant="outline" className={`px-8 ${isDark ? 'border-white/20 text-white hover:bg-white/5' : 'border-slate-300 text-slate-900 hover:bg-slate-100'}`}>
            View All Questions
          </Button>
        </motion.div>
      </div>

      {/* Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestion && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedQuestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-2xl glass"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedQuestion(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedQuestion.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">{tag}</span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">{selectedQuestion.title}</h2>
                <p className="text-slate-300 mb-6">{selectedQuestion.content}</p>
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                  <img
                    src={getAuthorAvatar(selectedQuestion.author)}
                    alt={selectedQuestion.author}
                    className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shrink-0 shadow-sm"
                  />
                  <div>
                    <p className="text-white font-medium">{selectedQuestion.author}</p>
                    <p className="text-sm text-slate-400">{selectedQuestion.date}</p>
                  </div>
                </div>

                {/* Answers */}
                <h3 className="text-lg font-semibold text-white mb-4">Answers ({selectedQuestion.answers.length})</h3>
                <div className="space-y-4">
                  {selectedQuestion.answers.length === 0 && (
                    <p className="text-slate-500 text-sm italic">No answers yet. Be the first to answer!</p>
                  )}
                  {selectedQuestion.answers.map(answer => (
                    <div key={answer.id} className="p-4 rounded-xl bg-white/5">
                      <div className="flex items-start gap-3">
                        <img
                          src={getAuthorAvatar(answer.author)}
                          alt={answer.author}
                          className="w-8 h-8 rounded-full object-cover border border-sky-400/40 shrink-0 shadow-sm"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{answer.author}</span>
                            {answer.isHelpful && (
                              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                                <CheckCircle className="w-3 h-3" />Helpful
                              </span>
                            )}
                          </div>
                          <p className="text-slate-300 text-sm">{answer.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                            <button className="flex items-center gap-1 hover:text-amber-400 transition-colors">
                              <ThumbsUp className="w-4 h-4" />{answer.likes}
                            </button>
                            <span>{answer.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Answer input */}
                {isLoggedIn ? (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex gap-3">
                      <img
                        src={getAuthorAvatar('You')}
                        alt="You"
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/40 shrink-0 shadow-sm"
                      />
                      <div className="flex-1">
                        <textarea
                          placeholder="Share your experience..."
                          value={answerText}
                          onChange={e => setAnswerText(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 resize-none outline-none focus:border-amber-500/50"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={handlePostAnswer}
                            disabled={!answerText.trim()}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 disabled:opacity-50"
                          >
                            Post Answer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-500">
                    <a href="/signin" className="text-amber-400 hover:underline">Sign in</a> to post an answer
                  </p>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowAskModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full rounded-2xl glass p-8"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowAskModal(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Ask the Community</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Title *</label>
                  <Input
                    placeholder="What's your question?"
                    value={askTitle}
                    onChange={e => setAskTitle(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Details *</label>
                  <textarea
                    placeholder="Provide more context..."
                    value={askDetails}
                    onChange={e => setAskDetails(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 resize-none outline-none focus:border-amber-500/50"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Tags</label>
                  <Input
                    placeholder="e.g. safety, solo, culture"
                    value={askTags}
                    onChange={e => setAskTags(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <Button
                  onClick={handlePostQuestion}
                  disabled={!askTitle.trim() || !askDetails.trim()}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 font-semibold disabled:opacity-50"
                >
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
