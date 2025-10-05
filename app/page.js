'use client'

import { useState } from 'react';
import { BarChart, TrendingUp, DollarSign, Award, Upload, Target, Eye, Percent } from 'lucide-react';
import Papa from 'papaparse';

// Calculation functions with your exact formulas
function processCreativeData(data) {
  return data.map(row => {
    // Parse all non-calculated metrics
    const cost = parseFloat(row['Cost (EUR)']) || 0;
    const purchaseValue = parseFloat(row['Purchase value']) || 0;
    const websitePurchases = parseFloat(row['Website purchases']) || 0;
    const impressions = parseFloat(row['Impressions']) || 0;
    const linkClicks = parseFloat(row['Link Clicks']) || 0;
    const threeSecViews = parseFloat(row['Three-second video views']) || 0;
    const watches75 = parseFloat(row['Video Watches 75%']) || 0;
    const plays50 = parseFloat(row['Video Plays 50%']) || 0;
    const thruPlayActions = parseFloat(row['ThruPlay Actions']) || 0;
    
    // Calculate all metrics according to your specifications
    const roas = cost > 0 ? (purchaseValue / cost).toFixed(2) : 0;
    const cpa = websitePurchases > 0 ? (cost / websitePurchases).toFixed(2) : 0;
    const hookRate = impressions > 0 ? ((threeSecViews / impressions) * 100).toFixed(2) : 0;
    const holdRate = threeSecViews > 0 ? ((thruPlayActions / threeSecViews) * 100).toFixed(2) : 0;
    const ctr = impressions > 0 ? ((linkClicks / impressions) * 100).toFixed(2) : 0;
    const engagedViewRate50 = threeSecViews > 0 ? ((plays50 / threeSecViews) * 100).toFixed(2) : 0;
    const aov = websitePurchases > 0 ? (purchaseValue / websitePurchases).toFixed(2) : 0;
    
    // Calculate performance scores (0-100)
    const roasScore = calculateScore(roas * 20, 60, 30); // ROAS Good >3, Medium >1.5
    const hookScore = calculateScore(hookRate, 40, 20); // Hook Good >40%, Medium >20%
    const holdScore = calculateScore(holdRate, 30, 15); // Hold Good >30%, Medium >15%
    const ctrScore = calculateScore(ctr * 10, 10, 5); // CTR Good >1%, Medium >0.5%
    
    return {
      ...row,
      'ROAS': roas,
      'CPA (€)': cpa,
      'Hook Rate (%)': hookRate,
      'Hold Rate (%)': holdRate,
      'CTR (%)': ctr,
      'Engaged View Rate 50% (%)': engagedViewRate50,
      'AOV (€)': aov,
      'ROAS Score': Math.round(roasScore),
      'Hook Score': Math.round(hookScore),
      'Hold Score': Math.round(holdScore),
      'CTR Score': Math.round(ctrScore),
      'Overall Score': Math.round((roasScore + hookScore + holdScore + ctrScore) / 4)
    };
  });
}

function calculateScore(value, goodThreshold, mediumThreshold) {
  const numValue = parseFloat(value) || 0;
  if (numValue >= goodThreshold) {
    return Math.min(70 + (numValue - goodThreshold), 100);
  } else if (numValue >= mediumThreshold) {
    return 50 + ((numValue - mediumThreshold) / (goodThreshold - mediumThreshold)) * 20;
  }
  return Math.max(0, (numValue / mediumThreshold) * 50);
}

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleFileUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const results = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
      const processedData = processCreativeData(results.data);
      setData(processedData);
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    const sampleData = [
      {
        'Date': '2025-07-01',
        'Ad Set Name': 'Warm audience',
        'Ad Name': '10% kod Ad',
        'Ad Status': 'PAUSED',
        'Cost (EUR)': 30.39,
        'Purchase value': 1128.39,
        'Three-second video views': 0,
        'Video Watches 75%': 0,
        'Video Plays 50%': 0,
        'Link Clicks': 27,
        'Website purchases': 7,
        'Impressions': 12722,
        'ThruPlay Actions': 0
      },
      {
        'Date': '2025-07-01',
        'Ad Set Name': 'Warm audience',
        'Ad Name': '10% kod Ad - Q3',
        'Ad Status': 'PAUSED',
        'Cost (EUR)': 37.99,
        'Purchase value': 3522.47,
        'Three-second video views': 0,
        'Video Watches 75%': 0,
        'Video Plays 50%': 0,
        'Link Clicks': 55,
        'Website purchases': 8,
        'Impressions': 17198,
        'ThruPlay Actions': 0
      },
      {
        'Date': '2025-07-01',
        'Ad Set Name': '1-6-2025-Pruzky',
        'Ad Name': 'František 8.1',
        'Ad Status': 'ADSET_PAUSED',
        'Cost (EUR)': 0.19,
        'Purchase value': 0,
        'Three-second video views': 0,
        'Video Watches 75%': 0,
        'Video Plays 50%': 2,
        'Link Clicks': 0,
        'Website purchases': 0,
        'Impressions': 65,
        'ThruPlay Actions': 2
      },
      {
        'Date': '2025-07-01',
        'Ad Set Name': '1-6-2025-Pruzky',
        'Ad Name': 'František 8.2',
        'Ad Status': 'ADSET_PAUSED',
        'Cost (EUR)': 0.26,
        'Purchase value': 0,
        'Three-second video views': 14,
        'Video Watches 75%': 0,
        'Video Plays 50%': 0,
        'Link Clicks': 0,
        'Website purchases': 0,
        'Impressions': 67,
        'ThruPlay Actions': 0
      },
      {
        'Date': '2025-07-01',
        'Ad Set Name': '12-7-2025-Pruzky',
        'Ad Name': 'Miro 1.1',
        'Ad Status': 'ADSET_PAUSED',
        'Cost (EUR)': 208.7,
        'Purchase value': 10634.31,
        'Three-second video views': 20798,
        'Video Watches 75%': 3000,
        'Video Plays 50%': 4928,
        'Link Clicks': 388,
        'Website purchases': 30,
        'Impressions': 77863,
        'ThruPlay Actions': 5656
      },
      {
        'Date': '2025-07-01',
        'Ad Set Name': '10-7-2025-Pruzky',
        'Ad Name': 'Static 6.1',
        'Ad Status': 'ADSET_PAUSED',
        'Cost (EUR)': 106.37,
        'Purchase value': 9470.86,
        'Three-second video views': 0,
        'Video Watches 75%': 0,
        'Video Plays 50%': 0,
        'Link Clicks': 275,
        'Website purchases': 23,
        'Impressions': 37888,
        'ThruPlay Actions': 0
      }
    ];
    setData(processCreativeData(sampleData));
  };

  const getAverageMetric = (metric) => {
    if (!data || data.length === 0) return '0';
    const sum = data.reduce((acc, item) => acc + parseFloat(item[metric] || 0), 0);
    return (sum / data.length).toFixed(2);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getStatusColor = (status) => {
    if (status === 'ACTIVE') return 'text-green-600 bg-green-100';
    if (status === 'PAUSED') return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  // Filter data by status
  const filteredData = data ? (
    statusFilter === 'all' ? data : data.filter(item => item['Ad Status'] === statusFilter)
  ) : null;

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
              <button onClick={() => setData(null)} className="text-sm text-gray-600 hover:text-gray-900">
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
              <p className="text-lg text-gray-600">Transform your Meta, Google, or TikTok ad data into actionable insights</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
              <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 cursor-pointer inline-block transition-opacity">
                Browse Files
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])} 
                  className="hidden" 
                />
              </label>
              <p className="text-xs text-gray-500 mt-4">Accepts CSV exports from Facebook Ads Manager</p>
            </div>
            
            {loading && (
              <div className="text-center mt-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 mt-2">Processing your data...</p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <button onClick={loadSampleData} className="text-blue-600 hover:text-blue-700 font-medium">
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
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Avg ROAS</p>
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold">{getAverageMetric('ROAS')}x</p>
                <p className="text-xs text-green-600 mt-1">Target: above 3.0x</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Avg CPA</p>
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold">€{getAverageMetric('CPA (€)')}</p>
                <p className="text-xs text-gray-500 mt-1">Lower is better</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Avg Hook Rate</p>
                  <Eye className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold">{getAverageMetric('Hook Rate (%)')}%</p>
                <p className="text-xs text-purple-600 mt-1">3-sec views / impressions</p>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                  <Percent className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{getAverageMetric('CTR (%)')}%</p>
                <p className="text-xs text-orange-600 mt-1">Click-through rate</p>
              </div>
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
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredData.map((creative, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">{creative['Ad Set Name']}</p>
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
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Hook Rate</span>
                          <span className="font-medium">{creative['Hook Rate (%)']}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              creative['Hook Score'] >= 70 ? 'bg-green-500' : 
                              creative['Hook Score'] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creative['Hook Score']}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Hold Rate</span>
                          <span className="font-medium">{creative['Hold Rate (%)']}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              creative['Hold Score'] >= 70 ? 'bg-green-500' : 
                              creative['Hold Score'] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creative['Hold Score']}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">CTR</span>
                          <span className="font-medium">{creative['CTR (%)']}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              creative['CTR Score'] >= 70 ? 'bg-green-500' : 
                              creative['CTR Score'] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creative['CTR Score']}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Engaged View Rate (50%)</span>
                          <span className="font-medium">{creative['Engaged View Rate 50% (%)']}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Set</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creative</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hook</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredData.map((creative, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{creative['Date']}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{creative['Ad Set Name']}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{creative['Ad Name']}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(creative['Ad Status'])}`}>
                              {creative['Ad Status']}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`font-semibold ${parseFloat(creative['ROAS']) >= 3 ? 'text-green-600' : parseFloat(creative['ROAS']) >= 1.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {creative['ROAS']}x
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">€{creative['CPA (€)']}</td>
                          <td className="px-6 py-4 text-sm">{creative['Hook Rate (%)']}%</td>
                          <td className="px-6 py-4 text-sm">{creative['CTR (%)']}%</td>
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
            )}

            {activeTab === 'insights' && (
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
                        <li>• AOV: €{getAverageMetric('AOV (€)')}</li>
                        <li>• Hold Rate: {getAverageMetric('Hold Rate (%)')}%</li>
                        <li>• Engaged View Rate (50%): {getAverageMetric('Engaged View Rate 50% (%)')}%</li>
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
                onClick={() => {
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
                }}
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
