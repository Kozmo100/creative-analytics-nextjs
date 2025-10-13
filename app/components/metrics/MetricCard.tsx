import React from 'react';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'percentage' | 'absolute';
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
  isHighlighted?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  changeType = 'percentage',
  trend,
  prefix = '',
  suffix = '',
  isHighlighted = false,
  loading = false,
  onClick,
}) => {
  const actualTrend = trend || (change ? (change > 0 ? 'up' : 'down') : 'neutral');
  const isPositive = actualTrend === 'up';
  
  const formatChange = () => {
    if (!change) return null;
    
    const formattedValue = changeType === 'percentage' 
      ? `${Math.abs(change).toFixed(1)}%`
      : Math.abs(change).toLocaleString();
    
    return `${change > 0 ? '+' : '-'}${formattedValue}`;
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg transition-all duration-150
        ${isHighlighted 
          ? 'bg-purple-gradient shadow-lg' 
          : 'bg-white border border-border-gray shadow-sm hover:shadow-md'
        }
        ${onClick ? 'cursor-pointer' : ''}
        ${loading ? 'animate-pulse' : ''}
      `}
      onClick={onClick}
    >
      <div className="p-6">
        <div className={`text-xs font-medium ${isHighlighted ? 'text-white/80' : 'text-text-secondary'} uppercase tracking-wide mb-2`}>
          {label}
        </div>
        
        <div className={`flex items-baseline gap-2 ${isHighlighted ? 'text-white' : 'text-text-primary'}`}>
          {loading ? (
            <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
          ) : (
            <>
              {prefix && <span className="text-2xl">{prefix}</span>}
              <span className="text-4xl font-bold">
                {typeof value === 'number' ? value.toLocaleString() : value}
              </span>
              {suffix && <span className="text-2xl">{suffix}</span>}
            </>
          )}
        </div>
        
        {change !== undefined && !loading && (
          <div className="mt-3 flex items-center gap-2">
            <div className={`
              flex items-center gap-1 text-sm font-medium
              ${isHighlighted 
                ? 'text-white' 
                : isPositive ? 'text-success-green' : 'text-error-red'
              }
            `}>
              {isPositive ? (
                <ArrowUp className="w-4 h-4" strokeWidth={2} />
              ) : (
                <ArrowDown className="w-4 h-4" strokeWidth={2} />
              )}
              <span>{formatChange()}</span>
            </div>
            <span className={`text-xs ${isHighlighted ? 'text-white/60' : 'text-text-tertiary'}`}>
              vs last period
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export const MetricCardGroup: React.FC<{ 
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}> = ({ children, columns = 4 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {children}
    </div>
  );
};
