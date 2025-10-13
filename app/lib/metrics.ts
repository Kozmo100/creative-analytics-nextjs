// Type definitions matching your exact CSV structure
export interface CreativeData {
  'Date': string;
  'Ad Set Name': string;
  'Ad Name': string;
  'Ad Status': string;
  'Cost (EUR)': number;
  'Purchase value': number;
  'Website purchases': number;
  'Impressions': number;
  'Link Clicks': number;
  'Three-second video views': number;
  'Video Watches 75%': number;
  'Video Plays 50%': number;
  'ThruPlay Actions': number;
}

// Calculated metrics matching your implementation
export interface CalculatedMetrics {
  'ROAS': string;
  'CPA (€)': string;
  'Hook Rate (%)': string;
  'Hold Rate (%)': string;
  'CTR (%)': string;
  'Engaged View Rate 50% (%)': string;
  'AOV (€)': string;
  'ROAS Score': number;
  'Hook Score': number;
  'Hold Score': number;
  'CTR Score': number;
  'Overall Score': number;
}

export interface ProcessedCreative extends CreativeData, CalculatedMetrics {}

// Calculate score based on thresholds (matching your exact logic)
export function calculateScore(value: string | number, goodThreshold: number, mediumThreshold: number): number {
  const numValue = parseFloat(value.toString()) || 0;
  if (numValue >= goodThreshold) {
    return Math.min(70 + (numValue - goodThreshold), 100);
  } else if (numValue >= mediumThreshold) {
    return 50 + ((numValue - mediumThreshold) / (goodThreshold - mediumThreshold)) * 20;
  }
  return Math.max(0, (numValue / mediumThreshold) * 50);
}

// Process creative data with your exact formulas
export function processCreativeData(data: any[]): ProcessedCreative[] {
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
    const roas = cost > 0 ? (purchaseValue / cost).toFixed(2) : '0';
    const cpa = websitePurchases > 0 ? (cost / websitePurchases).toFixed(2) : '0';
    const hookRate = impressions > 0 ? ((threeSecViews / impressions) * 100).toFixed(2) : '0';
    const holdRate = threeSecViews > 0 ? ((thruPlayActions / threeSecViews) * 100).toFixed(2) : '0';
    const ctr = impressions > 0 ? ((linkClicks / impressions) * 100).toFixed(2) : '0';
    const engagedViewRate50 = threeSecViews > 0 ? ((plays50 / threeSecViews) * 100).toFixed(2) : '0';
    const aov = websitePurchases > 0 ? (purchaseValue / websitePurchases).toFixed(2) : '0';
    
    // Calculate performance scores (0-100)
    const roasScore = calculateScore(parseFloat(roas) * 20, 60, 30); // ROAS Good >3, Medium >1.5
    const hookScore = calculateScore(parseFloat(hookRate), 40, 20); // Hook Good >40%, Medium >20%
    const holdScore = calculateScore(parseFloat(holdRate), 30, 15); // Hold Good >30%, Medium >15%
    const ctrScore = calculateScore(parseFloat(ctr) * 10, 10, 5); // CTR Good >1%, Medium >0.5%
    
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

// Get average metric
export function getAverageMetric(data: ProcessedCreative[], metric: keyof CalculatedMetrics): string {
  if (!data || data.length === 0) return '0';
  const sum = data.reduce((acc, item) => acc + parseFloat(item[metric].toString() || '0'), 0);
  return (sum / data.length).toFixed(2);
}

// Get score color classes
export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-green-600 bg-green-100';
  if (score >= 50) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}

// Get status color classes
export function getStatusColor(status: string): string {
  if (status === 'ACTIVE') return 'text-green-600 bg-green-100';
  if (status === 'PAUSED') return 'text-yellow-600 bg-yellow-100';
  return 'text-gray-600 bg-gray-100';
}

// Sample data for testing
export const sampleData = [
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
