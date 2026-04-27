import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'warning' | 'error' | 'secondary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-ieee-blue/5 text-ieee-blue border-ieee-blue/10',
    secondary: 'bg-slate-100 text-slate-500 border-slate-200',
    outline: 'bg-transparent border-slate-200 text-slate-400',
    ghost: 'bg-slate-50 border-transparent text-slate-400',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    error: 'bg-red-50 text-red-600 border-red-100',
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
