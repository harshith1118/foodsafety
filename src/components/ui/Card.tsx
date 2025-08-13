// Reusable Card component
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  hover = false
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200';
  const hoverClasses = hover ? 'hover:shadow-md transition-shadow duration-200 cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${paddings[padding]} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};