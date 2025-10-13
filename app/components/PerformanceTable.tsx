import React from 'react';
import { getScoreColor, getStatusColor } from '../lib/metrics';

interface PerformanceTableProps {
  data: any[];
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({ data }) => {
  const getROASColor = (roas: string) => {
    const value = parseFloat(roas);
    if (value >= 3) return 'text-green-600';
    if (value >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Set
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creative
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPA
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hook
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CTR
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Score
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((creative, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-600">
                  {creative['Date']}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {creative['Ad Set Name']}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {creative['Ad Name']}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(creative['Ad Status'])}`}>
                    {creative['Ad Status']}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-semibold ${getROASColor(creative['ROAS'])}`}>
                    {creative['ROAS']}x
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  €{creative['CPA (€)']}
                </td>
                <td className="px-6 py-4 text-sm">
                  {creative['Hook Rate (%)']}%
                </td>
                <td className="px-6 py-4 text-sm">
                  {creative['CTR (%)']}%
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreColor(creative['Overall Score'])}`}>
                    {creative['Overall Score']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
