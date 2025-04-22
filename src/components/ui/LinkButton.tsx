import { type ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export function LinkButton({
  href,
  children,
  className = '',
  variant = 'default',
}: LinkButtonProps) {
  const baseStyles = 'w-full px-6 py-3 rounded-lg transition-all duration-200 text-center font-medium';
  const variants = {
    default: 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm',
    outline: 'border border-white/20 hover:bg-white/10 text-white',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
} 