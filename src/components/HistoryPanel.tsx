'use client';

import { Clock, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface HistoryItem {
  id: string;
  original_prompt: string;
  optimized_prompt: string;
  mode: string;
  created_at: string;
  prompt_score: number | null;
  explanation?: string;
  changes?: string;
  feedback?: string;
  feedback_text?: string;
  session_id: string;
  provider?: string;
  model?: string;
}

interface HistoryPanelProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
}

export function HistoryPanel({ userId, isOpen, onClose, onSelect }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && userId) {
      setIsLoading(true);
      fetch(`/api/history?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.history) {
            setHistory(data.history);
          }
        })
        .catch((err) => console.error('Failed to fetch history:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, userId]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId) return;
    
    if (!confirm('Are you sure you want to delete this prompt?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/history/${id}?user_id=${userId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete');
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
      alert('Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm dark:bg-black/40"
          onClick={onClose}
        />
      )}
      
      {/* Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform border-l border-zinc-200 bg-white/95 p-6 shadow-2xl backdrop-blur transition-transform duration-300 ease-in-out dark:border-zinc-800 dark:bg-zinc-950/95 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Prompts
          </h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto h-[calc(100vh-100px)] pr-2">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-zinc-500">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-700 dark:border-t-zinc-400" />
              <span className="text-sm">Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-sm text-zinc-500 text-center py-10">
              No recent prompts found.
              <br />
              Optimized prompts will appear here.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(item);
                    onClose();
                  }
                }}
                className="group w-full text-left p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md transition-all dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 cursor-pointer"
              >
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-3 mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {item.original_prompt}
                </div>
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>
                      {(() => {
                        const date = new Date(item.created_at);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="capitalize px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800">
                      {item.mode}
                    </span>
                    {item.prompt_score !== null && (
                      <span className={`font-medium ${
                        item.prompt_score >= 80 ? 'text-emerald-600 dark:text-emerald-400' :
                        item.prompt_score >= 60 ? 'text-amber-600 dark:text-amber-400' :
                        'text-rose-600 dark:text-rose-400'
                      }`}>
                        {item.prompt_score}
                      </span>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      disabled={deletingId === item.id}
                      className="ml-2 p-1.5 rounded-md text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors disabled:opacity-50"
                      title="Delete prompt"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
