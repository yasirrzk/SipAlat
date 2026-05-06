import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  className 
}) => {
  const variants = {
    success: 'bg-green-900/30 text-green-400 border-green-800/50',
    warning: 'bg-orange-900/30 text-orange-400 border-orange-800/50',
    danger: 'bg-red-900/30 text-red-400 border-red-800/50',
    info: 'bg-indigo-900/30 text-indigo-400 border-indigo-800/50',
    neutral: 'bg-slate-800/50 text-slate-400 border-slate-700/50',
  };

  return (
    <span className={cn(
      'px-2 py-0.5 text-[10px] font-bold uppercase rounded border tracking-wider',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
