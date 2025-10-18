import React from 'react';

interface CardProps {
  children: React.ReactNode;
  // FIX: Update onClick prop to accept a MouseEvent to allow for event handling like stopPropagation.
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  isHoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, onClick, className = '', isHoverable = true }) => {
  const baseClasses = 'bg-white/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/20';
  
  const hoverClasses = isHoverable 
    ? 'transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:bg-white/70 cursor-pointer' 
    : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
