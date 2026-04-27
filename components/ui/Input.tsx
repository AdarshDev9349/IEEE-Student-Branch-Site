import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="space-y-2.5 w-full">
        {label && (
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:border-ieee-blue/50 outline-none transition-all placeholder:text-white/10 font-medium",
            error && "border-red-500/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] text-red-500/80 font-bold uppercase tracking-wider ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
