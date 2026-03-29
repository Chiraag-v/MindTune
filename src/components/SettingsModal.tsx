'use client';

import { useState } from 'react';
import { getSupabaseClient } from '@/lib/client/supabase';
import { X, Trash2, LogOut, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);
    const supabase = getSupabaseClient();
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Call the API route to delete the user
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      onLogout();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Settings</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Logout Section */}
          <div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Account Actions</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage your session and account access.
            </p>
            <div className="mt-4">
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex w-full items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800" />

          {/* Delete Account Section */}
          <div>
            <h3 className="text-lg font-medium text-rose-600 dark:text-rose-400">Danger Zone</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Permanently delete your account and all associated data.
            </p>
            
            <div className="mt-4">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex w-full items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete my account
                </button>
              ) : (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/30">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-rose-900 dark:text-rose-200">Are you absolutely sure?</h4>
                      <p className="mt-1 text-sm text-rose-700 dark:text-rose-300">
                        This will immediately delete your account, prompt history, and all settings.
                      </p>
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                        >
                          {loading ? 'Deleting...' : 'Yes, delete everything'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          disabled={loading}
                          className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 disabled:opacity-50 dark:bg-transparent dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
