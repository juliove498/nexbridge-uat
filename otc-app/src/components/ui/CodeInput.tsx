import { useRef, useEffect, type KeyboardEvent, type ClipboardEvent } from 'react';
import { cn } from '@/lib/utils';

interface CodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
}

export function CodeInput({
  length = 6,
  value,
  onChange,
  error,
  label,
}: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length).split('').slice(0, length);

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function handleChange(idx: number, char: string) {
    if (!/^\d?$/.test(char)) return;
    const arr = [...digits];
    arr[idx] = char;
    const next = arr.join('');
    onChange(next.replace(/\s/g, ''));
    if (char && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  }

  function handleKeyDown(idx: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    const focusIdx = Math.min(pasted.length, length - 1);
    refs.current[focusIdx]?.focus();
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] font-medium text-muted-foreground">{label}</label>}
      <div className="flex gap-2.5 justify-center py-2">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={d.trim()}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            placeholder="–"
            className={cn(
              'w-[52px] h-[60px] text-center text-2xl font-semibold font-mono bg-accent border-2 border-[var(--border-hover)] rounded-[var(--radius-md-compat)] text-foreground outline-none transition-all duration-200 caret-primary',
              'placeholder:text-[var(--text-tertiary)] placeholder:text-[28px]',
              'focus:border-primary focus:bg-accent focus:shadow-[0_0_0_3px_var(--orange-subtle)]',
              error && 'border-[var(--error)] animate-shake'
            )}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <span className="text-xs text-[var(--error)]">{error}</span>}
    </div>
  );
}
