import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'neumorphic-raised' | 'neumorphic-inset';
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
  
  const baseStyles = "inline-flex items-center justify-center transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-[0.2em]";
  
  const sizes = {
    sm: "px-4 py-2 text-[10px] rounded-xl",
    md: "px-6 py-3 text-[11px] rounded-2xl",
    lg: "px-8 py-4 text-xs rounded-3xl",
  };

  const variants = {
    primary: "bg-ieee-blue text-white hover:bg-ieee-blue/90 shadow-lg shadow-ieee-blue/20",
    secondary: "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white",
    danger: "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20",
    ghost: "bg-transparent text-white/40 hover:text-white",
    'neumorphic-raised': "nm-raised-sm text-white/80 hover:text-white active:shadow-inner",
    'neumorphic-inset': "nm-inset text-white/60",
  };

  return (
    <button
      className={cn(baseStyles, sizes[size], variants[variant], className)}
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
