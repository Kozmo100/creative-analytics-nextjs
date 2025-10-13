'use client';

import { useState } from 'react';
import { 
  BarChart, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Target, 
  Eye, 
  Percent 
} from 'lucide-react';
import Papa from 'papaparse';
import { 
  processCreativeData, 
  getAverageMetric, 
  sampleData,
  type ProcessedCreative 
} from './lib/metrics';
import { CSVUpload } from './components/CSVUpload';
import { CreativeCard } from './components/CreativeCard';
import { KPICard } from './components/KPICard';
import { PerformanceTable } from './components/PerformanceTable';

export default function Home() {
  const [data, setData] = useState<ProcessedCreative[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDataLoaded = (processedData: ProcessedCreative[]) => {
    setData(processedData);
  };

  const loadSampleData = () => {
    setData(processCreativeData(sampleData));
  };

  // Filter data by status
  const filteredData = data ? (
    statusFilter === 'all' 
      ? data 
      : data.filter(item => item['Ad Status'] === statusFilter)
  ) : null;

  const exportCSV = () => {
    if (!filteredData) return;
    const csv = Papa.unparse(filteredData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `creative_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Creative Analytics Platform</h1>
            </div>
            {data && (
              <button 
                onClick={() => setData(null)} 
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Upload New File
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {!data ? (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Upload Your Creative Data</h2>
              <p className="text-lg text-gray-600">
                Transform your Meta, Google, or TikTok ad data into actionable insights
              </p>
            </div>
            
            <CSVUpload 
              onDataLoaded={handleDataLoaded} 
              loading={loading} 
              setLoading={setLoading} 
            />
            
            <div className="text-center mt-8">
              <button 
                onClick={loadSampleData} 
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Or try with sample data →
              </button>
            </div>
            
            <div className="mt-12 bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Required CSV Columns:</h3>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Dimensions:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Date</li>
                    <li>• Ad Set Name</li>
                    <li>• Ad Name</li>
                    <li>• Ad Status</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Metrics:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Cost (EUR)</li>
                    <li>• Purchase value</li>
                    <li>• Website purchases</li>
                    <li>• Impressions</li>
                    <li>• Three-second video views</li>
                    <li>• Video Plays 50%</li>
                    <li>• Link Clicks</li>
                    <li>• ThruPlay Actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Status Filter */}
            {filteredData && (
              <div className="mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700">Filter by Status:</span>
                    <div className="flex space-x-2">
                      {['all', 'ACTIVE', 'PAUSED', 'ADSET_PAUSED'].map(status => (
                        <button
                          key={status}
                          onClick={() => setStatusFilter(status)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            statusFilter === status
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {status === 'all' ? 'All' : status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <KPICard
                label="Avg ROAS"
                value={`${getAverageMetric(filteredData || [], 'ROAS')}x`}
                icon={DollarSign}
                iconColor="text-green-500"
                subtitle="Target: above 3.0x"
                subtitleColor="text-green-600"
              />
              
              <KPICard
                label="Avg CPA"
                value={`€${getAverageMetric(filteredData || [], 'CPA (€)')}`}
                icon={Target}
                iconColor="text-blue-500"
                subtitle="Lower is better"
              />
              
              <KPICard
                label="Avg Hook Rate"
                value={`${getAverageMetric(filteredData || [], 'Hook Rate (%)')}%`}
                icon={Eye}
                iconColor="text-purple-500"
                subtitle="3-sec views / impressions"
                subtitleColor="text-purple-600"
              />
              
              <KPICard
                label="Avg CTR"
                value={`${getAverageMetric(filteredData || [], 'CTR (%)')}%`}
                icon={Percent}
                iconColor="text-orange-500"
                subtitle="Click-through rate"
                subtitleColor="text-orange-600"
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
              <div className="border-b">
                <nav className="flex">
                  {['overview', 'performance', 'insights'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-4 px-6 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab 
                          ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && filteredData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((creative, index) => (
                  <CreativeCard key={index} creative={creative} />
                ))}
              </div>
            )}

            {activeTab === 'performance' && filteredData && (
              <PerformanceTable data={filteredData} />
            )}

            {activeTab === 'insights' && filteredData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Top Performers</h3>
                  <div className="space-y-3">
                    {filteredData
                      .sort((a, b) => parseFloat(b['ROAS']) - parseFloat(a['ROAS']))
                      .slice(0, 3)
                      .map((creative, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{creative['Ad Name']}</p>
                            <p className="text-xs text-gray-600">{creative['Ad Set Name']}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">ROAS: {creative['ROAS']}x</p>
                            <p className="text-xs text-gray-600">CPA: €{creative['CPA (€)']}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Need Optimization</h3>
                  <div className="space-y-3">
                    {filteredData
                      .filter(c => parseFloat(c['ROAS']) < 1.5 && parseFloat(c['ROAS']) > 0)
                      .slice(0, 3)
                      .map((creative, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{creative['Ad Name']}</p>
                            <p className="text-xs text-gray-600">{creative['Ad Set Name']}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-red-600">ROAS: {creative['ROAS']}x</p>
                            <p className="text-xs text-gray-600">Hook: {creative['Hook Rate (%)']}%</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">📊 Portfolio Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">📈 Average Performance</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• AOV: €{getAverageMetric(filteredData, 'AOV (€)')}</li>
                        <li>• Hold Rate: {getAverageMetric(filteredData, 'Hold Rate (%)')}%</li>
                        <li>• Engaged View Rate (50%): {getAverageMetric(filteredData, 'Engaged View Rate 50% (%)')}%</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">🎯 Recommendations</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• {filteredData.filter(c => parseFloat(c['ROAS']) >= 3).length} ads ready to scale</li>
                        <li>• {filteredData.filter(c => parseFloat(c['Hook Rate (%)']) < 20).length} ads need hook optimization</li>
                        <li>• {filteredData.filter(c => c['Ad Status'] === 'PAUSED').length} paused ads to review</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Export Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={exportCSV}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Export Enhanced Data CSV
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
