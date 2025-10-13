import React from 'react';
import { getScoreColor, getStatusColor } from '../lib/metrics';

interface CreativeCardProps {
  creative: any;
}

export const CreativeCard: React.FC<CreativeCardProps> = ({ creative }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="mb-3">
        <div className="flex justify-between items-start">
          <p className="text-xs text-gray-500 uppercase tracking-wider">
            {creative['Ad Set Name']}
          </p>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(creative['Ad Status'])}`}>
            {creative['Ad Status']}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-gray-900">{creative['Ad Name']}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(creative['Overall Score'])}`}>
          {creative['Overall Score']}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">ROAS</p>
          <p className="text-lg font-bold">{creative['ROAS']}x</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-500">CPA</p>
          <p className="text-lg font-bold">€{creative['CPA (€)']}</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <ProgressBar
          label="Hook Rate"
          value={creative['Hook Rate (%)']}
          score={creative['Hook Score']}
        />
        
        <ProgressBar
          label="Hold Rate"
          value={creative['Hold Rate (%)']}
          score={creative['Hold Score']}
        />
        
        <ProgressBar
          label="CTR"
          value={creative['CTR (%)']}
          score={creative['CTR Score']}
        />
        
        <div className="pt-2 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Engaged View Rate (50%)</span>
            <span className="font-medium">{creative['Engaged View Rate 50% (%)']}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  label: string;
  value: string;
  score: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, value, score }) => {
  const getBarColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
