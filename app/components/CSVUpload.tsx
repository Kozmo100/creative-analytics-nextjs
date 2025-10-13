'use client';

import React from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { processCreativeData } from '../lib/metrics';

interface CSVUploadProps {
  onDataLoaded: (data: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({ 
  onDataLoaded, 
  loading, 
  setLoading 
}) => {
  const handleFileUpload = (file: File) => {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const results = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      });
      const processedData = processCreativeData(results.data);
      onDataLoaded(processedData);
      setLoading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <p className="text-lg font-medium mb-2">Drop your CSV file here</p>
      <label className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 cursor-pointer inline-block transition-opacity">
        Browse Files
        <input 
          type="file" 
          accept=".csv" 
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
          className="hidden" 
        />
      </label>
      <p className="text-xs text-gray-500 mt-4">Accepts CSV exports from Facebook Ads Manager</p>
      
      {loading && (
        <div className="text-center mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Processing your data...</p>
        </div>
      )}
    </div>
  );
};
