interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Array<SegmentedOption<T>>;
  disabled?: boolean;
}

export function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
  disabled,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <div
        className="grid rounded-2xl border border-white/6 bg-white/3 p-1 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/40"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              disabled={disabled}
              className={[
                'h-9 rounded-xl px-2 text-xs font-bold transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5 dark:text-zinc-500 dark:hover:text-zinc-300',
                disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
