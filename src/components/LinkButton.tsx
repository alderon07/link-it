import { type ReactNode } from 'react';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function LinkButton({
  href,
  children,
  className = '',
}: LinkButtonProps) {
  const baseStyles = [
    'w-full',
    'px-4 py-2.5 sm:px-6 sm:py-3',
    'rounded-2xl',
    'transition-all duration-200',
    'text-center',
    'text-sm sm:text-base',
    'backdrop-blur-xs',
    'active:scale-[0.98]',
  ].join(' ');

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseStyles} ${className}`}
    >
      {children}
    </a>
  );
} 