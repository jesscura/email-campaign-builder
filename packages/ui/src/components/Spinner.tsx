import React from 'react';
import { clsx } from 'clsx';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className,
  ...props 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-blue-600 border-t-transparent',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
};

Spinner.displayName = 'Spinner';
