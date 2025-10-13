'use client';

import React, { useState } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/Button';

interface CSVUploadProps {
  onDataLoaded: (data: any[]) => void;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({ onDataLoaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a CSV file');
    }
  };

  const processCSV = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const data = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(',').map(v => v.trim());
          const row: any = {};
          
          headers.forEach((header, index) => {
            const value = values[index] || '';
            // Parse numbers for metric columns
            if (header.includes('Views') || 
                header.includes('Clicks') || 
                header.includes('Impressions') || 
                header.includes('Purchases') || 
                header.includes('ThruPlays')) {
              row[header] = parseInt(value) || 0;
            } else if (header.includes('Value') || 
                      header.includes('Amount') || 
                      header.includes('Spent')) {
              row[header] = parseFloat(value) || 0;
            } else {
              row[header] = value;
            }
          });
          
          return row;
        });

      onDataLoaded(data);
      setFile(null);
    } catch (err) {
      setError('Error processing CSV file');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="bg-white rounded-lg border-2 border-dashed border-border-gray p-8">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-text-tertiary mb-4" />
        
        <div className="mb-4">
          <label htmlFor="csv-upload" className="cursor-pointer">
            <span className="text-primary-purple hover:text-purple-dark font-medium">
              Click to upload
            </span>
            <span className="text-text-secondary"> or drag and drop</span>
          </label>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        
        <p className="text-xs text-text-tertiary">CSV files only</p>
        
        {file && (
          <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-bg-secondary rounded-md">
            <FileText className="h-4 w-4 text-primary-purple" />
            <span className="text-sm text-text-primary">{file.name}</span>
            <button
              onClick={clearFile}
              className="ml-2 text-text-tertiary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        
        {error && (
          <p className="mt-2 text-sm text-error-red">{error}</p>
        )}
        
        {file && (
          <Button
            onClick={processCSV}
            loading={loading}
            className="mt-4"
            variant="primary"
          >
            Process CSV
          </Button>
        )}
      </div>
    </div>
  );
};
