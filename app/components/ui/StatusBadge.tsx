import React from 'react';

interface StatusBadgeProps {
  status: 'Active' | 'Paused' | 'Review' | 'Ad Fatigue';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md' 
}) => {
  const statusStyles = {
    'Active': 'bg-primary-purple text-white',
    'Paused': 'bg-warning-orange text-white',
    'Review': 'bg-info-blue text-white',
    'Ad Fatigue': 'bg-error-red text-white',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={`
      inline-flex items-center justify-center rounded-full font-medium
      ${statusStyles[status]}
      ${sizeStyles[size]}
    `}>
      {status}
    </span>
  );
};
