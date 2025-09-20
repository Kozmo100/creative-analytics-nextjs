<details>
<summary>Click to expand (this is the long one - your main dashboard)</summary>
```javascript
'use client'
import { useState } from 'react';
import FileUpload from './components/FileUpload';
import MetricCard from './components/MetricCard';
import CreativeScore from './components/CreativeScore';
import { processCreativeData } from './lib/calculations';
import { BarChart, TrendingUp, DollarSign, Award } from 'lucide-react';
// Import Papaparse dynamically since we're in browser
import Papa from 'papaparse';
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
'Fifteen-second video views': 807,
'Cost (EUR)': 250,
'ROAS': 3.2
},
{
'Ad name': 'Creative Beta',
'Impressions': 45000,
'Three-second video views': 3555,
'ThruPlay Actions': 1600,
'Link Clicks': 355,
'Fifteen-second video views': 947,
'Cost (EUR)': 225,
'ROAS': 4.1
},
{
'Ad name': 'Creative Gamma',
'Impressions': 38000,
'Three-second video views': 3002,
'ThruPlay Actions': 1020,
'Link Clicks': 204,
'Fifteen-second video views': 500,
'Cost (EUR)': 190,
'ROAS': 2.1
}
];
const processedData = processCreativeData(sampleData);
setData(processedData);
};
const getAverageMetric = (metric) => {
if (!data) return 0;
const sum = data.reduce((acc, item) => acc + parseFloat(item[metric] || 0), 0);
return (sum / data.length).toFixed(1);
};
return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
{/* Header */}
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
        
        <FileUpload onFileUpload={handleFileUpload} />
        
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
          <MetricCard title="Total Creatives" value={data.length} icon={<BarChart className="h-8 w-8" />} />
          <MetricCard title="Avg Hook Rate" value={`${getAverageMetric('Hook Rate (%)')}%`} icon={<TrendingUp className="h-8 w-8" />} />
          <MetricCard title="Avg Hold Rate" value={`${getAverageMetric('Hold Rate (%)')}%`} icon={<Award className="h-8 w-8" />} />
          <MetricCard title="Avg ROAS" value={`${getAverageMetric('ROAS')}x`} icon={<DollarSign className="h-8 w-8" />} />
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
              <CreativeScore key={index} creative={creative} />
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Overall Score</th>
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
</details>

#### **File 8:** `app/components/FileUpload.js`
```javascript
'use client'

import { Upload } from 'lucide-react';

export default function FileUpload({ onFileUpload }) {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
      <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-block">
        Browse Files
        <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />
      </label>
    </div>
  );
}
