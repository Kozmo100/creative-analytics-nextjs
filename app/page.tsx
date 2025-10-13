'use client';

import React, { useState, useEffect } from 'react';
import { MetricCard, MetricCardGroup } from './components/metrics/MetricCard';
import { CSVUpload } from './components/CSVUpload';
import { Button } from './components/ui/Button';
import { StatusBadge } from './components/ui/StatusBadge';
import { 
  calculateAllMetrics, 
  formatCurrency, 
  formatPercentage, 
  formatROAS,
  formatLargeNumber,
  getPerformanceScore,
  getPerformanceColor,
  getPerformanceLabel,
  type CreativeData, 
  type CalculatedMetrics 
} from './lib/metrics';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  FileText,
  Filter
} from 'lucide-react';

interface ProcessedCreative extends CreativeData, CalculatedMetrics {
  performanceScore: number;
}

export default function Dashboard() {
  const [creatives, setCreatives] = useState<ProcessedCreative[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 days');
  
  // Calculate aggregate metrics
  const aggregateMetrics = creatives.length > 0 ? {
    totalSpend: creatives.reduce((sum, c) => sum + c['Amount Spent'], 0),
    totalRevenue: creatives.reduce((sum, c) => sum + c['Purchase Value'], 0),
    avgROAS: creatives.reduce((sum, c) => sum + c.roas, 0) / creatives.length,
    avgHookRate: creatives.reduce((sum, c) => sum + c.hookRate, 0) / creatives.length,
    avgHoldRate: creatives.reduce((sum, c) => sum + c.holdRate, 0) / creatives.length,
    avgCPA: creatives.reduce((sum, c) => sum + c.cpa, 0) / creatives.length,
  } : null;

  const handleDataLoaded = (data: any[]) => {
    const processedData = data.map(row => {
      const metrics = calculateAllMetrics(row);
      const performanceScore = getPerformanceScore(metrics);
      return {
        ...row,
        ...metrics,
        performanceScore
      };
    });
    
    // Sort by performance score
    processedData.sort((a, b) => b.performanceScore - a.performanceScore);
    setCreatives(processedData);
  };

  // Get top performers
  const topPerformers = creatives.slice(0, 5);

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="bg-white border-b border-border-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <h1 className="text-2xl font-semibold text-text-primary">KOOSMIC AI</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                className="px-4 py-2 border border-border-gray rounded-md text-sm"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option>Last 30 days</option>
                <option>Last 14 days</option>
                <option>Last 7 days</option>
                <option>Today</option>
              </select>
              
              <Button variant="secondary" icon={Filter}>
                Filter
              </Button>
              
              <Button variant="primary" icon={FileText}>
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {creatives.length === 0 ? (
          // Upload State
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-text-primary mb-2">
                Creative Analytics Dashboard
              </h2>
              <p className="text-text-secondary">
                Upload your CSV to analyze creative performance
              </p>
            </div>
            
            <CSVUpload onDataLoaded={handleDataLoaded} />
            
            <div className="bg-info-blue/10 rounded-lg p-4">
              <h3 className="font-medium text-info-blue mb-2">Expected CSV Format:</h3>
              <p className="text-sm text-text-secondary">
                Creative Name, Ad Set, Amount Spent, Impressions, Link Clicks, Purchases, 
                Purchase Value, 3-Second Video Views, ThruPlays, etc.
              </p>
            </div>
          </div>
        ) : (
          // Dashboard View
          <div className="space-y-8">
            {/* Page Title */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-semibold text-text-primary">
                  Performance Overview
                </h2>
                <p className="text-text-secondary mt-1">
                  {creatives.length} creatives analyzed • {dateRange}
                </p>
              </div>
              
              <CSVUpload onDataLoaded={handleDataLoaded} />
            </div>

            {/* Key Metrics */}
            {aggregateMetrics && (
              <MetricCardGroup columns={4}>
                <MetricCard
                  label="Average ROAS"
                  value={formatROAS(aggregateMetrics.avgROAS)}
                  change={12.5}
                  isHighlighted={true}
                />
                
                <MetricCard
                  label="Average CPA"
                  value={formatCurrency(aggregateMetrics.avgCPA)}
                  change={-8.3}
                  trend="down"
                />
                
                <MetricCard
                  label="Avg Hook Rate"
                  value={formatPercentage(aggregateMetrics.avgHookRate)}
                  change={5.2}
                />
                
                <MetricCard
                  label="Avg Hold Rate"
                  value={formatPercentage(aggregateMetrics.avgHoldRate)}
                  change={3.7}
                />
              </MetricCardGroup>
            )}

            {/* Top Performers Table */}
            <div className="bg-white rounded-lg shadow-sm border border-border-gray">
              <div className="px-6 py-4 border-b border-border-gray">
                <h3 className="text-lg font-semibold text-text-primary">
                  Top Performing Creatives
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-secondary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Creative
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Hook Rate
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Hold Rate
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        ROAS
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-border-gray">
                    {topPerformers.map((creative, idx) => (
                      <tr key={idx} className="hover:bg-bg-secondary transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-text-primary">
                              {creative['Creative Name']}
                            </div>
                            <div className="text-xs text-text-tertiary">
                              {creative['Ad Set']}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={creative.Status || 'Active'} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={creative.hookRate > 20 ? 'text-success-green' : 'text-text-primary'}>
                            {formatPercentage(creative.hookRate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={creative.holdRate > 30 ? 'text-success-green' : 'text-text-primary'}>
                            {formatPercentage(creative.holdRate)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={creative.roas > 2 ? 'text-success-green font-medium' : 'text-text-primary'}>
                            {formatROAS(creative.roas)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className={`font-medium ${getPerformanceColor(creative.performanceScore)}`}>
                              {creative.performanceScore}
                            </span>
                            <span className="text-xs text-text-tertiary">
                              {getPerformanceLabel(creative.performanceScore)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
