import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'success' | 'warning' | 'error';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-ieee-blue/10 text-ieee-blue border-ieee-blue/20',
    outline: 'bg-transparent border-white/10 text-white/40',
    ghost: 'bg-white/5 border-transparent text-white/60',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
