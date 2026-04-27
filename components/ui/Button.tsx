import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md', 
  className, 
  disabled,
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-[0.2em] active:scale-95";
  
  const sizes = {
    sm: "px-4 py-2 text-[9px] rounded-lg",
    md: "px-6 py-3.5 text-[10px] rounded-xl",
    lg: "px-8 py-4 text-xs rounded-2xl",
  };

  const variants = {
    primary: "bg-ieee-blue text-white hover:bg-ieee-blue/90 shadow-lg shadow-ieee-blue/20",
    secondary: "bg-slate-100 text-slate-600 hover:bg-slate-200",
    danger: "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100",
    ghost: "bg-transparent text-slate-400 hover:text-slate-900",
    outline: "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50",
  };

  return (
    <button
      className={cn(baseStyles, sizes[size], variants[variant as keyof typeof variants], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : null}
      {children}
    </button>
  );
}
