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
          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 ml-1">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 text-sm text-slate-900 focus:border-ieee-blue/50 focus:ring-4 focus:ring-ieee-blue/5 outline-none transition-all placeholder:text-slate-300 font-medium",
            error && "border-red-300 bg-red-50/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
