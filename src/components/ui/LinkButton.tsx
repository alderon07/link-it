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
  const baseStyles = 'w-full px-6 py-3 rounded-full transition-all duration-200 text-center font-medium';

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