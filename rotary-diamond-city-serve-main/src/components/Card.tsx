
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className = '', hover = true }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        hover ? 'transition-transform duration-300 hover:scale-105 hover:shadow-lg' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
