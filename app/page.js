'use client'

import { useState } from 'react';
import { BarChart, TrendingUp, DollarSign, Award, Upload, Target, Eye } from 'lucide-react';
import Papa from 'papaparse';

// Calculation functions with your exact formulas
function processCreativeData(data) {
  return data.map(row => {
    // Parse all numeric values
    const cost = parseFloat(row['Cost (EUR)']) || 0;
    const purchases = parseFloat(row['Website purchases']) || 0;
    const purchaseValue = parseFloat(row['Purchase value']) || 0;
    const impressions = parseFloat(row['Impressions']) || 0;
    const reach = parseFloat(row['Reach']) || 0;
    const linkClicks = parseFloat(row['Link Clicks']) || 0;
    const threeSecViews = parseFloat(row['Three-second video views']) || 0;
    const plays25 = parseFloat(row['Video Plays 25%']) || 0;
    const plays50 = parseFloat(row['Video Plays 50%']) || 0;
    const watches75 = parseFloat(row['Video Watches 75%']) || 0;
    const avgWatchTime = parseFloat(row['Video Avg Watch Time']) || 0;
    
    // Calculate your exact metrics
    const cpa = purchases > 0 ? (cost / purchases).toFixed(2) : 0;
    const roas = cost > 0 ? (purchaseValue / cost).toFixed(2) : 0;
    const aov = purchases > 0 ? (purchaseValue / purchases).toFixed(2) : 0;
    const hookRate = impressions > 0 ? ((threeSecViews / impressions) * 100).toFixed(2) : 0;
    const retention50_3s = threeSecViews > 0 ? ((plays50 / threeSecViews) * 100).toFixed(2) : 0;
    const watches75Rate = impressions > 0 ? ((watches75 / impressions) * 100).toFixed(2) : 0;
    const convertScore = impressions > 0 ? ((linkClicks / impressions) * 100).toFixed(2) : 0;
    
    // Calculate performance scores (0-100)
    const hookScore = calculateScore(hookRate, 40, 20); // Good >40%, Medium >20%
    const retentionScore = calculateScore(retention50_3s, 30, 15); // Good >30%, Medium >15%
    const convertScoreValue = calculateScore(convertScore * 10, 10, 5); // CTR Good >1%, Medium >0.5%
    const roasScore = calculateScore(roas * 20, 60, 30); // ROAS Good >3, Medium >1.5
    
    return {
      ...row,
      'CPA (€)': cpa,
      'ROAS': roas,
      'AOV (€)': aov,
      'Hook Rate (%)': hookRate,
      '50%/3s Rate (%)': retention50_3s,
      '75% Watch Rate (%)': watches75Rate,
      'Convert Score (%)': convertScore,
      'Hook Score': Math.round(hookScore),
      'Retention Score': Math.round(retentionScore),
      'Convert Score Value': Math.round(convertScoreValue),
      'ROAS Score': Math.round(roasScore),
      'Overall Score': Math.round((hookScore + retentionScore + convertScoreValue + roasScore) / 4)
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
    // Realistic sample data with proper Ad Set Names
    const sampleData = [
      {
        'Date': '2025-04-01',
        'Ad Set Name': 'Influencer Campaign Q2',
        'Ad name': 'Influencer 1 - Hook A',
        'Ad preview URL': 'https://business.facebook.com/adsmanager',
        'Cost (EUR)': 9.97,
        'Website purchases': 2,
        'Purchase value': 33.44,
        'Impressions': 2923,
        'Reach': 2845,
        'Link Clicks': 16,
        'Video Avg Watch Time': 7.00,
        'Three-second video views': 1252,
        'Video Plays 25%': 587,
        'Video Plays 50%': 390,
        'Video Watches 75%': 274
      },
      {
        'Date': '2025-04-01',
        'Ad Set Name': 'Influencer Campaign Q2',
        'Ad name': 'Influencer 2 - Story Format',
        'Ad preview URL': 'https://business.facebook.com/adsmanager',
        'Cost (EUR)': 15.50,
        'Website purchases': 3,
        'Purchase value': 67.20,
        'Impressions': 4521,
        'Reach': 4102,
        'Link Clicks': 42,
        'Video Avg Watch Time': 9.50,
        'Three-second video views': 2103,
        'Video Plays 25%': 1205,
        'Video Plays 50%': 842,
        'Video Watches 75%': 623
      },
      {
        'Date': '2025-04-01',
        'Ad Set Name': 'Product Demo Series',
        'Ad name': 'Product Demo - Version A',
        'Ad preview URL': 'https://business.facebook.com/adsmanager',
        'Cost (EUR)': 22.30,
        'Website purchases': 1,
        'Purchase value': 18.50,
        'Impressions': 3890,
        'Reach': 3455,
        'Link Clicks': 28,
        'Video Avg Watch Time': 5.20,
        'Three-second video views': 890,
        'Video Plays 25%': 356,
        'Video Plays 50%': 198,
        'Video Watches 75%': 95
      },
      {
        'Date': '2025-04-02',
        'Ad Set Name': 'UGC Content Test',
        'Ad name': 'Customer Review 1',
        'Ad preview URL': 'https://business.facebook.com/adsmanager',
        'Cost (EUR)': 45.00,
        'Website purchases': 8,
        'Purchase value': 245.60,
        'Impressions': 8900,
        'Reach': 8234,
        'Link Clicks': 125,
        'Video Avg Watch Time': 11.30,
        'Three-second video views': 5234,
        'Video Plays 25%': 3890,
        'Video Plays 50%': 2567,
        'Video Watches 75%': 1890
      },
      {
        'Date': '2025-04-02',
        'Ad Set Name': 'Spring Sale Campaign',
        'Ad name': 'Sale Announcement v1',
        'Ad preview URL': 'https://business.facebook.com/adsmanager',
        'Cost (EUR)': 31.20,
        'Website purchases': 5,
        'Purchase value': 156.80,
        'Impressions': 6750,
        'Reach': 6200,
        'Link Clicks': 89,
        'Video Avg Watch Time': 8.40,
        'Three-second video views': 3100,
        'Video Plays 25%': 2015,
        'Video Plays 50%': 1240,
        'Video Watches 75%': 810
      },
      {
        'Date': '2025-04-02',
        'Ad Set Name': 'Retargeting Warm Audience',
        'Ad name': 'Testimonial Compilation',
        'Ad preview URL': 'https://business.facebook.com/adsmanager',
        'Cost (EUR)': 18.75,
        'Website purchases': 4,
        'Purchase value': 98.40,
        'Impressions': 3200,
        'Reach': 2900,
        'Link Clicks': 76,
        'Video Avg Watch Time': 12.10,
        'Three-second video views': 2080,
        'Video Plays 25%': 1560,
        'Video Plays 50%': 1040,
        'Video Watches 75%': 832
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
              <ul className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                <li>• Ad Set Name</li>
                <li>• Ad name</li>
                <li>• Cost (EUR)</li>
                <li>• Website purchases</li>
                <li>• Purchase value</li>
                <li>• Impressions</li>
                <li>• Three-second video views</li>
                <li>• Video Plays 50%</li>
                <li>• Video Watches 75%</li>
                <li>• Link Clicks</li>
              </ul>
            </div>
          </div>
        ) : (
          <>
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
                  <p className="text-sm font-medium text-gray-600">Avg 50%/3s Rate</p>
                  <Award className="h-5 w-5 text-orange-500" />
                </div>
                <p className="text-3xl font-bold">{getAverageMetric('50%/3s Rate (%)')}%</p>
                <p className="text-xs text-orange-600 mt-1">Retention quality</p>
              </div>
            </div>

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

            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.map((creative, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{creative['Ad Set Name']}</p>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-lg text-gray-900">{creative['Ad name']}</h3>
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
                          <span className="text-gray-600">50%/3s Retention</span>
                          <span className="font-medium">{creative['50%/3s Rate (%)']}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              creative['Retention Score'] >= 70 ? 'bg-green-500' : 
                              creative['Retention Score'] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creative['Retention Score']}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Convert Score</span>
                          <span className="font-medium">{creative['Convert Score (%)']}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              creative['Convert Score Value'] >= 70 ? 'bg-green-500' : 
                              creative['Convert Score Value'] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creative['Convert Score Value']}%` }}
                          />
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
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Set</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creative</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROAS</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPA</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hook Rate</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">50%/3s</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Convert</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {data.map((creative, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-600">{creative['Ad Set Name']}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{creative['Ad name']}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className={`font-semibold ${parseFloat(creative['ROAS']) >= 3 ? 'text-green-600' : parseFloat(creative['ROAS']) >= 1.5 ? 'text-yellow-600' : 'text-red-600'}`}>
                              {creative['ROAS']}x
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">€{creative['CPA (€)']}</td>
                          <td className="px-6 py-4 text-sm">{creative['Hook Rate (%)']}%</td>
                          <td className="px-6 py-4 text-sm">{creative['50%/3s Rate (%)']}%</td>
                          <td className="px-6 py-4 text-sm">{creative['Convert Score (%)']}%</td>
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
                    {data
                      .sort((a, b) => parseFloat(b['ROAS']) - parseFloat(a['ROAS']))
                      .slice(0, 3)
                      .map((creative, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{creative['Ad name']}</p>
                            <p className="text-xs text-gray-600">{creative['Ad Set Name']}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green-600">ROAS: {creative['ROAS']}x</p>
                            <p className="text-xs text-gray-600">Score: {creative['Overall Score']}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Need Optimization</h3>
                  <div className="space-y-3">
                    {data
                      .filter(c => parseFloat(c['ROAS']) < 1.5)
                      .slice(0, 3)
                      .map((creative, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{creative['Ad name']}</p>
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
                  <h3 className="text-lg font-semibold mb-4">💡 Key Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">🎯 Hook Rate Optimization</p>
                      <p className="text-sm text-gray-600">
                        {data.filter(c => parseFloat(c['Hook Rate (%)']) < 30).length} creatives have hook rates below 30%. 
                        Focus on stronger opening 3 seconds.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">📈 Scaling Opportunities</p>
                      <p className="text-sm text-gray-600">
                        {data.filter(c => parseFloat(c['ROAS']) >= 3).length} creatives with ROAS above 3x. 
                        Consider increasing budget allocation.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">🔄 Retention Issues</p>
                      <p className="text-sm text-gray-600">
                        Average 50%/3s retention: {getAverageMetric('50%/3s Rate (%)')}%. 
                        Review mid-content pacing and storytelling.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <p className="font-medium text-gray-900 mb-2">💰 Budget Efficiency</p>
                      <p className="text-sm text-gray-600">
                        Average CPA: €{getAverageMetric('CPA (€)')}. 
                        Pause creatives with CPA above €{(parseFloat(getAverageMetric('CPA (€)')) * 1.5).toFixed(2)}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  const csv = Papa.unparse(data);
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
