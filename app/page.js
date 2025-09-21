'use client'

import { useState } from 'react';
import { BarChart, TrendingUp, DollarSign, Award, Upload } from 'lucide-react';
import Papa from 'papaparse';

// Calculation functions
function calculateScore(value, goodThreshold, mediumThreshold) {
  const numValue = parseFloat(value) || 0;
  if (numValue >= goodThreshold) {
    return Math.min(70 + (numValue - goodThreshold) * 2, 100);
  } else if (numValue >= mediumThreshold) {
    return 50 + ((numValue - mediumThreshold) / (goodThreshold - mediumThreshold)) * 19;
  }
  return Math.max(0, (numValue / mediumThreshold) * 49);
}

function processCreativeData(data) {
  return data.map(row => {
    const impressions = parseFloat(row.Impressions) || 0;
    const threeSecViews = parseFloat(row['Three-second video views']) || 0;
    const thruPlay = parseFloat(row['ThruPlay Actions']) || 0;
    const clicks = parseFloat(row['Link Clicks']) || 0;
    
    const hookRate = impressions ? ((threeSecViews / impressions) * 100).toFixed(2) : 0;
    const holdRate = threeSecViews ? ((thruPlay / threeSecViews) * 100).toFixed(2) : 0;
    const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : 0;
    
    const hookScore = Math.round(calculateScore(hookRate, 8, 4));
    const watchScore = Math.round(calculateScore(holdRate, 35, 20));
    const clickScore = Math.round(calculateScore(ctr * 10, 70, 40));
    
    return {
      ...row,
      'Hook Rate (%)': hookRate,
      'Hold Rate (%)': holdRate,
      'CTR (%)': ctr,
      'Hook Score': hookScore,
      'Watch Score': watchScore,
      'Click Score': clickScore,
      'Overall Score': Math.round((hookScore + watchScore + clickScore) / 3)
    };
  });
}

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('scores');

  const handleFileUpload = (file) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target.result;
      const results = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
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
        'Ad name': 'Creative Alpha',
        'Impressions': 50000,
        'Three-second video views': 4000,
        'ThruPlay Actions': 1600,
        'Link Clicks': 320,
        'Cost (EUR)': 250,
        'ROAS': 3.2
      },
      {
        'Ad name': 'Creative Beta',
        'Impressions': 45000,
        'Three-second video views': 3555,
        'ThruPlay Actions': 1600,
        'Link Clicks': 355,
        'Cost (EUR)': 225,
        'ROAS': 4.1
      },
      {
        'Ad name': 'Creative Gamma',
        'Impressions': 38000,
        'Three-second video views': 3002,
        'ThruPlay Actions': 1020,
        'Link Clicks': 204,
        'Cost (EUR)': 190,
        'ROAS': 2.1
      }
    ];
    setData(processCreativeData(sampleData));
  };

  const getAverageMetric = (metric) => {
    if (!data) return 0;
    const sum = data.reduce((acc, item) => acc + parseFloat(item[metric] || 0), 0);
    return (sum / data.length).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-2xl font-bold">Creative Analytics</h1>
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
              <p className="text-lg text-gray-600">Transform your ad performance data into actionable insights</p>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
                Browse Files
                <input 
                  type="file" 
                  accept=".csv" 
                  onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])} 
                  className="hidden" 
                />
              </label>
            </div>
            
            {loading && (
              <div className="text-center mt-8">
                <p className="text-gray-600">Processing your data...</p>
              </div>
            )}
            
            <div className="text-center mt-8">
              <button onClick={loadSampleData} className="text-blue-600 hover:text-blue-700 font-medium">
                Or try with sample data →
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Creatives</p>
                    <p className="text-2xl font-bold mt-1">{data.length}</p>
                  </div>
                  <BarChart className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Hook Rate</p>
                    <p className="text-2xl font-bold mt-1">{getAverageMetric('Hook Rate (%)')}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Hold Rate</p>
                    <p className="text-2xl font-bold mt-1">{getAverageMetric('Hold Rate (%)')}%</p>
                  </div>
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg ROAS</p>
                    <p className="text-2xl font-bold mt-1">{getAverageMetric('ROAS')}x</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="border-b">
                <nav className="flex space-x-8 px-6">
                  {['scores', 'table', 'insights'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
                      }`}
                    >
                      {tab === 'scores' ? 'Visual Scores' : tab}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {activeTab === 'scores' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.map((creative, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="font-bold text-lg mb-2">{creative['Ad name']}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Hook Score</span>
                          <span>{creative['Hook Score']}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              creative['Hook Score'] >= 70 ? 'bg-green-500' : 
                              creative['Hook Score'] >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${creative['Hook Score']}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-100 rounded">
                      <div className="text-2xl font-bold">{creative['Overall Score']}</div>
                      <div className="text-xs text-gray-600">Overall Score</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'table' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creative</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hook Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hold Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((creative, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 text-sm">{creative['Ad name']}</td>
                        <td className="px-6 py-4 text-sm">{creative['Hook Rate (%)']}%</td>
                        <td className="px-6 py-4 text-sm">{creative['Hold Rate (%)']}%</td>
                        <td className="px-6 py-4 text-sm">{creative['Overall Score']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                <ul className="space-y-2">
                  <li>• Top performer: {data[0]['Ad name']} with score {data[0]['Overall Score']}</li>
                  <li>• Average portfolio performance: {getAverageMetric('Overall Score')}/100</li>
                  <li>• Recommendation: Scale creatives with scores above 70</li>
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
