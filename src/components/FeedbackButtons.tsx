'use client';

import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FeedbackButtonsProps {
  sessionId: string;
  mode: string;
  disabled: boolean;
  initialRating?: 'up' | 'down' | null;
  initialFeedbackText?: string;
}

export function FeedbackButtons({ sessionId, mode, disabled, initialRating, initialFeedbackText }: FeedbackButtonsProps) {
  const [submitted, setSubmitted] = useState(!!initialRating);
  const [ratingUsed, setRatingUsed] = useState<'up' | 'down' | null>(initialRating || null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState(initialFeedbackText || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialRating) {
      setRatingUsed(initialRating);
      setSubmitted(true);
      if (initialFeedbackText) {
        setComment(initialFeedbackText);
      }
    }
  }, [initialRating, initialFeedbackText]);

  useEffect(() => {
    if (showComment && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [showComment, comment]);

  const submitFeedback = async (rating: 'up' | 'down', feedbackText?: string) => {
    if (submitted || disabled || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          rating,
          mode,
          feedback_text: feedbackText,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? 'Request failed');
      }

      setRatingUsed(rating);
      setSubmitted(true);
      setShowComment(false);
    } catch (err) {
      console.error('[FeedbackButtons]', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbsUp = () => {
    if (submitted) return;
    submitFeedback('up');
  };

  const handleThumbsDown = () => {
    if (submitted) return;
    setShowComment(true);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback('down', comment);
  };

  const isDisabled = disabled || (submitted && !showComment) || isSubmitting;
  const isUpActive = ratingUsed === 'up';
  const isDownActive = ratingUsed === 'down' || showComment;

  return (
    <div className="flex w-full items-start gap-3">
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={handleThumbsUp}
          disabled={isDisabled}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isUpActive
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400'
              : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
          }`}
          aria-label="Thumbs up"
        >
          <ThumbsUp className={`h-5 w-5 ${isUpActive ? 'fill-current' : ''}`} />
        </button>
        <button
          type="button"
          onClick={handleThumbsDown}
          disabled={isDisabled}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition disabled:cursor-not-allowed disabled:opacity-50 ${
            isDownActive
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400'
              : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700'
          }`}
          aria-label="Thumbs down"
        >
          <ThumbsDown className={`h-5 w-5 ${isDownActive ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {showComment && (
          <form onSubmit={handleCommentSubmit} className="flex w-full flex-col gap-2">
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What could be better?"
              className="min-h-[80px] w-full resize-none overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-50"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowComment(false)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {submitted && !showComment && (
          <span
            className={`text-sm font-medium ${
              ratingUsed === 'up'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            Thanks for the feedback
          </span>
        )}
      </div>
    </div>
  );
}
