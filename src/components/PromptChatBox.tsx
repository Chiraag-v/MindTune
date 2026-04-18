'use client';

import { Mic, MicOff, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface PromptChatBoxProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  onAutoTune?: () => void;
}

type RecordState = 'idle' | 'listening' | 'processing' | 'unsupported';

export function PromptChatBox({ value, onChange, disabled, onAutoTune }: PromptChatBoxProps) {
  const [recState, setRecState] = useState<RecordState>('idle');
  const [interimText, setInterimText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const baseTextRef = useRef(''); // text before the current speech session
  // Always hold the latest callback so recognition.onend never uses a stale closure
  const onAutoTuneRef = useRef(onAutoTune);
  useEffect(() => { onAutoTuneRef.current = onAutoTune; }, [onAutoTune]);

  // Check browser support on mount
  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      (typeof SpeechRecognition !== 'undefined' || typeof webkitSpeechRecognition !== 'undefined');
    if (!supported) setRecState('unsupported');
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setInterimText('');
    setRecState('idle');
  }, []);

  const startRecording = useCallback(() => {
    const Api =
      (typeof SpeechRecognition !== 'undefined' ? SpeechRecognition : null) ??
      (typeof webkitSpeechRecognition !== 'undefined' ? webkitSpeechRecognition : null);

    if (!Api) return;

    const recognition = new Api();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Snapshot current text so we can append speech to it
    baseTextRef.current = value;

    recognition.onstart = () => setRecState('listening');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript + ' ';
        } else {
          interim += transcript;
        }
      }

      if (final) {
        const separator = baseTextRef.current.trim() ? ' ' : '';
        baseTextRef.current = baseTextRef.current + separator + final.trim();
        onChange(baseTextRef.current);
        setInterimText('');
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = () => {
      setInterimText('');
      setRecState('idle');
    };

    recognition.onend = () => {
      setInterimText('');
      if (baseTextRef.current.trim() && onAutoTuneRef.current) {
        setRecState('processing');
        setTimeout(() => {
          setRecState('idle');
          onAutoTuneRef.current?.();
        }, 400);
      } else {
        setRecState('idle');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [value, onChange]);

  const toggleRecording = () => {
    if (recState === 'listening') {
      stopRecording();
    } else if (recState === 'idle') {
      startRecording();
    }
  };

  // Cleanup on unmount
  useEffect(() => () => recognitionRef.current?.stop(), []);

  const isListening = recState === 'listening';
  const isProcessing = recState === 'processing';
  const isUnsupported = recState === 'unsupported';

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className={`card-animated-border rounded-[28px] border bg-white/50 p-5 shadow-sm backdrop-blur transition-all duration-300 dark:bg-zinc-950/30 md:p-7 ${
      isListening
        ? 'border-rose-400/50 shadow-rose-500/10 shadow-lg'
        : 'border-zinc-200/80 hover:border-violet-300/30 hover:shadow-violet-500/5 dark:border-zinc-800/80 dark:hover:border-violet-800/30'
    }`}>
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold tracking-widest uppercase text-zinc-500 dark:text-zinc-500">
            Prompt
          </div>
          {isListening && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-rose-500">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
              Listening…
            </span>
          )}
          {isProcessing && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-violet-500">
              <span className="inline-flex gap-0.5">
                <span className="thinking-dot h-1 w-1 rounded-full bg-violet-500" />
                <span className="thinking-dot h-1 w-1 rounded-full bg-violet-500" />
                <span className="thinking-dot h-1 w-1 rounded-full bg-violet-500" />
              </span>
              Tuning…
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
            {wordCount > 0 ? `${wordCount} words` : ' '}
          </div>

          {/* Mic button */}
          {!isUnsupported && (
            <button
              type="button"
              onClick={toggleRecording}
              disabled={disabled || isProcessing}
              title={isListening ? 'Stop recording' : 'Speak your prompt'}
              className={`relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-all duration-200 disabled:opacity-40 ${
                isListening
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                  : 'border border-zinc-200/80 bg-white/60 text-zinc-500 hover:border-violet-300/50 hover:bg-white hover:text-violet-600 hover:shadow-md hover:shadow-violet-500/10 dark:border-zinc-700/80 dark:bg-zinc-900/50 dark:text-zinc-500 dark:hover:border-violet-700/50 dark:hover:bg-zinc-800 dark:hover:text-violet-400'
              }`}
            >
              {isListening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-25" />
              )}
              {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={isListening ? value + (interimText ? ` ${interimText}` : '') : value}
          onChange={(e) => { if (!isListening) onChange(e.target.value); }}
          disabled={disabled || isListening}
          placeholder={isListening ? 'Speak now… MindTune is listening.' : 'Speak or type messy. Get clarity.'}
          rows={16}
          className={`min-h-[420px] w-full resize-none rounded-2xl border px-5 py-4 text-sm leading-7 backdrop-blur outline-none transition-all duration-300 ${
            isListening
              ? 'border-rose-400/40 bg-rose-50/30 text-zinc-900 placeholder:text-rose-400/50 dark:bg-rose-950/10 dark:text-zinc-50'
              : 'border-zinc-200/60 bg-white/60 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400/50 focus:shadow-lg focus:shadow-violet-500/5 focus:bg-white/80 disabled:opacity-50 dark:border-zinc-800/60 dark:bg-zinc-950/40 dark:text-zinc-50 dark:placeholder:text-zinc-600 dark:focus:border-violet-700/50 dark:focus:bg-zinc-950/60'
          }`}
        />
        {isListening && interimText && (
          <div className="pointer-events-none absolute bottom-4 left-5 right-5 text-xs italic text-rose-400/70">
            {interimText}
          </div>
        )}
      </div>

      {/* Helper text */}
      {!isUnsupported && (
        <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-600">
          {isListening
            ? 'Speak naturally — click the mic again or pause to stop.'
            : 'Click the mic to speak your idea. MindTune will tune it automatically.'}
        </p>
      )}
    </div>
  );
}
