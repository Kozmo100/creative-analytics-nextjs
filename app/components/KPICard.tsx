import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconColor: string;
  subtitle?: string;
  subtitleColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor,
  subtitle,
  subtitleColor = 'text-gray-500'
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {subtitle && (
        <p className={`text-xs mt-1 ${subtitleColor}`}>{subtitle}</p>
      )}
    </div>
  );
};
