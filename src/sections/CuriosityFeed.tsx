'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, CheckCircle, Tag, Search, Plus, X } from 'lucide-react';
import { questions as initialQuestions } from '@/data/mockData';
import type { Question } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAuthorAvatar } from '@/lib/utils';
import { useModalLayer } from '@/hooks/use-modal-layer';

/* Same entrance curve as `.lift`, the hero reveal, MoodSearch, CountryStories
   and HiddenGems — one hand across the page instead of a second near-identical
   bezier per section. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Overlay control shared by both modals' close buttons. Spelt out rather than
   `.glass`, because `.glass` sets the `border` shorthand and these need a
   single border colour that can animate on hover. */
const CLOSE_BUTTON =
  'absolute top-4 right-4 rounded-full border border-border bg-card/80 p-2 text-muted-foreground backdrop-blur-sm transition-colors duration-200 hover:border-aurora hover:text-aurora';

/* Multi-line fields. Nothing here suppresses the outline: the old rule removed
   it in every state rather than only on mouse focus, which took the global
   :focus-visible aurora ring with it. */
const FIELD =
  'w-full resize-none rounded-xl border border-border bg-card p-3 text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus-visible:border-aurora';

interface CuriosityFeedProps {
  isLoggedIn: boolean;
}

export default function CuriosityFeed({ isLoggedIn }: CuriosityFeedProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAskModal, setShowAskModal] = useState(false);

  /* Two overlays, the same contract as every other one on the site: Escape
     closes, the page underneath holds still, focus goes in and comes back.
     Both are driven from here because both are rendered inline rather than
     lifted into their own component. */
  const closeQuestion = () => setSelectedQuestion(null);
  const closeAsk = () => setShowAskModal(false);
  const questionPanelRef = useModalLayer(selectedQuestion !== null, closeQuestion);
  const askPanelRef = useModalLayer(showAskModal, closeAsk);

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

  /* The Input primitive is already fully tokenised (border, placeholder, ring),
     so this only has to name the surface it sits on. */
  const inputCls = `bg-card text-foreground`;

  return (
    <section id="curiosity" className="section-y relative isolate overflow-hidden cv-auto">
      {/* Zero-cost GPU Gradient */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-wash absolute inset-0" />
      </div>

      {/* `.shell` owns width, gutters and centring. It sets the `max-width`
          property itself, so no width or inline-padding utility sits beside it. */}
      <div className="shell relative">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: EASE }} className="text-center mb-16">
          <h2 className="t-title mb-4 text-foreground">
            Ask. Learn. <span className="text-aurora">Share.</span>
          </h2>
          <p className="t-lead mx-auto max-w-2xl">
            A traveler-friendly Q&A community where curiosity meets experience. Get answers from those who&apos;ve been there.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, delay: 0.15, ease: EASE }} className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`pl-12 py-6 ${inputCls}`}
              />
            </div>
            {isLoggedIn && (
              /* The default Button variant already resolves to primary/
                 primary-foreground, so only the teal hover needs stating. */
              <Button
                onClick={() => setShowAskModal(true)}
                className="px-6 font-medium hover:bg-primary-hover"
              >
                <Plus className="w-4 h-4 mr-2" />Ask Question
              </Button>
            )}
          </div>

          {/* Selection is one accent, not a second hue per tag. `.glass` sets
              the `border` shorthand, so no `border-*` is paired with it. */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setSelectedTag(null)}
              aria-pressed={!selectedTag}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors duration-500 ease-smooth ${!selectedTag ? 'bg-primary text-primary-foreground shadow-aurora' : 'glass text-muted-foreground hover:text-foreground'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                aria-pressed={selectedTag === tag}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors duration-500 ease-smooth ${selectedTag === tag ? 'bg-primary text-primary-foreground shadow-aurora' : 'glass text-muted-foreground hover:text-foreground'}`}
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
              transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
              className="group cursor-pointer"
              onClick={() => { setSelectedQuestion(question); setAnswerText(''); }}
            >
              {/* `.lift` owns the hover rise, the shadow and its own transition
                  shorthand, so no `transition-*`/`-translate-y` here — the two
                  would cancel on stylesheet order. The surface is spelt out
                  rather than `.ink-panel`/`.glass` because the border colour
                  animates, and both of those set the `border` shorthand. */}
              <div className="lift flex h-full flex-col justify-between rounded-2xl bg-card p-6 shadow-cast hover:shadow-2xl transition-all duration-300">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map(tag => (
                      <span key={tag} className="flex items-center gap-1 rounded-full bg-muted/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                        <Tag className="w-3 h-3 text-aurora" />{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="t-sub mb-2 line-clamp-2 text-foreground transition-colors duration-500 ease-smooth group-hover:text-aurora">
                    {question.title}
                  </h3>
                  <p className="text-sm line-clamp-2 mb-6 leading-relaxed text-muted-foreground">{question.content}</p>
                </div>
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-border/20">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={getAuthorAvatar(question.author)}
                      alt={question.author}
                      className="w-8 h-8 rounded-full object-cover border border-aurora/30 shrink-0"
                    />
                    <span className="text-sm font-medium text-foreground">{question.author}</span>
                  </div>
                  {/* Real counts, which is exactly where the mono face is
                      allowed to appear. */}
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <span className="t-data flex items-center gap-1.5"><MessageCircle className="w-4 h-4" />{question.answers.length}</span>
                    <span className="t-data flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" />{question.likes}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* The `outline` variant already resolves to border/background/accent
            tokens, so there is nothing left to override but the width. */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
          <Button variant="outline" className="px-8">
            View All Questions
          </Button>
        </motion.div>
      </div>

      {/* Question Detail Modal */}
      <AnimatePresence>
        {selectedQuestion && typeof document !== 'undefined' && createPortal(
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[99999] overflow-y-auto flex min-h-full items-center justify-center p-3 sm:p-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="fixed inset-0 bg-black/85 dark:bg-[#03060f]/92 backdrop-blur-md"
              onClick={closeQuestion}
              aria-hidden="true"
            />
            <motion.div
              ref={questionPanelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="question-modal-title"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 my-auto w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl text-left"
              style={{ overscrollBehavior: 'contain' }}
              onClick={e => e.stopPropagation()}
            >
              <button type="button" onClick={closeQuestion} aria-label="Close question" className={CLOSE_BUTTON}>
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 sm:p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedQuestion.tags.map(tag => (
                    <span key={tag} className="rounded-full border border-aurora/20 bg-aurora/10 px-3 py-1 text-xs font-medium capitalize text-aurora">{tag}</span>
                  ))}
                </div>
                <h2 id="question-modal-title" className="t-sub mb-4 text-foreground">{selectedQuestion.title}</h2>
                <p className="t-body mb-6">{selectedQuestion.content}</p>
                <div className="hairline-b flex items-center gap-3 mb-8 pb-6">
                  <img
                    src={getAuthorAvatar(selectedQuestion.author)}
                    alt={selectedQuestion.author}
                    className="w-10 h-10 rounded-full object-cover border border-aurora/40 shrink-0"
                  />
                  <div>
                    <p className="font-medium text-foreground">{selectedQuestion.author}</p>
                    <p className="t-data text-muted-foreground">{selectedQuestion.date}</p>
                  </div>
                </div>

                <h3 className="t-label mb-4 text-aurora">Answers ({selectedQuestion.answers.length})</h3>
                <div className="space-y-4">
                  {selectedQuestion.answers.length === 0 && (
                    <p className="text-sm italic text-muted-foreground">No answers yet. Be the first to answer!</p>
                  )}
                  {selectedQuestion.answers.map(answer => (
                    <div key={answer.id} className="p-4 rounded-xl bg-muted">
                      <div className="flex items-start gap-3">
                        <img
                          src={getAuthorAvatar(answer.author)}
                          alt={answer.author}
                          className="w-8 h-8 rounded-full object-cover border border-orchid/40 shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">{answer.author}</span>
                            {answer.isHelpful && (
                              <span className="flex items-center gap-1 rounded-full bg-aurora/15 px-2 py-0.5 text-xs text-aurora">
                                <CheckCircle className="w-3 h-3" />Helpful
                              </span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground">{answer.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-muted-foreground">
                            <button
                              aria-label={`Like this answer — ${answer.likes} likes`}
                              className="t-data flex items-center gap-1 transition-colors duration-200 hover:text-aurora"
                            >
                              <ThumbsUp className="w-4 h-4" />{answer.likes}
                            </button>
                            <span className="t-data">{answer.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {isLoggedIn ? (
                  <div className="hairline-t mt-6 pt-6">
                    <div className="flex gap-3">
                      <img
                        src={getAuthorAvatar('You')}
                        alt="You"
                        className="w-10 h-10 rounded-full object-cover border border-aurora/40 shrink-0"
                      />
                      <div className="flex-1">
                        <textarea
                          aria-label="Your answer"
                          placeholder="Share your experience..."
                          value={answerText}
                          onChange={e => setAnswerText(e.target.value)}
                          className={FIELD}
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <Button
                            size="sm"
                            onClick={handlePostAnswer}
                            disabled={!answerText.trim()}
                            className="disabled:opacity-50 hover:bg-primary-hover"
                          >
                            Post Answer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="hairline-t mt-6 pt-6 text-center text-sm text-muted-foreground">
                    <a href="/signin" className="text-aurora hover:underline">Sign in</a> to post an answer
                  </p>
                )}
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>

      {/* Ask Question Modal */}
      <AnimatePresence>
        {showAskModal && typeof document !== 'undefined' && createPortal(
          <div
            data-lenis-prevent="true"
            className="fixed inset-0 z-[99999] overflow-y-auto flex min-h-full items-center justify-center p-3 sm:p-6 text-center"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="fixed inset-0 bg-black/85 dark:bg-[#03060f]/92 backdrop-blur-md"
              onClick={closeAsk}
              aria-hidden="true"
            />
            <motion.div
              ref={askPanelRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ask-modal-title"
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="relative z-10 my-auto w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-card border border-border/80 shadow-2xl p-6 sm:p-8 text-left"
              style={{ overscrollBehavior: 'contain' }}
              onClick={e => e.stopPropagation()}
            >
              <button type="button" onClick={closeAsk} aria-label="Close" className={CLOSE_BUTTON}>
                <X className="w-5 h-5" />
              </button>

              <h2 id="ask-modal-title" className="t-sub mb-6 text-foreground">Ask the Community</h2>

              <div className="space-y-4">
                <div>
                  <label className="t-label mb-2 block text-muted-foreground">Title *</label>
                  <Input
                    placeholder="What's your question?"
                    value={askTitle}
                    onChange={e => setAskTitle(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="t-label mb-2 block text-muted-foreground">Details *</label>
                  <textarea
                    aria-label="Question details"
                    placeholder="Provide more context..."
                    value={askDetails}
                    onChange={e => setAskDetails(e.target.value)}
                    className={FIELD}
                    rows={4}
                  />
                </div>
                <div>
                  <label className="t-label mb-2 block text-muted-foreground">Tags</label>
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
                  className="w-full font-semibold disabled:opacity-50 hover:bg-primary-hover"
                >
                  Post Question
                </Button>
              </div>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
    </section>
  );
}
