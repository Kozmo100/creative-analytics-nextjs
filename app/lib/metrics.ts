// Aligning with your existing CSV structure from Streamlit implementation
export interface CreativeData {
  // Identifiers
  'Creative Name': string;
  'Ad Set': string;
  Date?: string;
  Status?: 'Active' | 'Paused' | 'Review' | 'Ad Fatigue';
  
  // Performance Metrics (from CSV)
  'Amount Spent': number;
  'Impressions': number;
  'Link Clicks': number;
  'Purchases': number;
  'Purchase Value': number;
  '3-Second Video Views': number;
  'Video Views at 25%': number;
  'Video Views at 50%': number;
  'Video Views at 75%': number;
  'Video Views at 95%': number;
  'ThruPlays': number;
}

// Calculated metrics matching your Streamlit dashboard
export interface CalculatedMetrics {
  hookRate: number;        // (3-sec views / impressions) × 100
  holdRate: number;         // (ThruPlays / 3-sec views) × 100
  ctr: number;             // (Link clicks / impressions) × 100
  cpa: number;             // Amount spent / Purchases
  roas: number;            // Purchase value / Amount spent
  aov: number;             // Purchase value / Purchases
  retention3s: number;     // 3-sec views / impressions × 100
  retention15s: number;    // ThruPlays / impressions × 100
  dropOff: number;         // (3-sec views - ThruPlays) / 3-sec views × 100
  conversionRate: number;  // Purchases / Link clicks × 100
}

// Hook Rate: First 3 seconds retention
export const calculateHookRate = (threeSecViews: number, impressions: number): number => {
  if (impressions <= 0) return 0;
  return Number(((threeSecViews / impressions) * 100).toFixed(2));
};

// Hold Rate: Full video retention
export const calculateHoldRate = (thruPlays: number, threeSecViews: number): number => {
  if (threeSecViews <= 0) return 0;
  return Number(((thruPlays / threeSecViews) * 100).toFixed(2));
};

// CTR
export const calculateCTR = (linkClicks: number, impressions: number): number => {
  if (impressions <= 0) return 0;
  return Number(((linkClicks / impressions) * 100).toFixed(2));
};

// CPA
export const calculateCPA = (amountSpent: number, purchases: number): number => {
  if (purchases <= 0) return 0;
  return Number((amountSpent / purchases).toFixed(2));
};

// ROAS
export const calculateROAS = (purchaseValue: number, amountSpent: number): number => {
  if (amountSpent <= 0) return 0;
  return Number((purchaseValue / amountSpent).toFixed(2));
};

// AOV
export const calculateAOV = (purchaseValue: number, purchases: number): number => {
  if (purchases <= 0) return 0;
  return Number((purchaseValue / purchases).toFixed(2));
};

// 3s Retention (same as Hook Rate)
export const calculate3sRetention = (threeSecViews: number, impressions: number): number => {
  return calculateHookRate(threeSecViews, impressions);
};

// 15s Retention (ThruPlay rate)
export const calculate15sRetention = (thruPlays: number, impressions: number): number => {
  if (impressions <= 0) return 0;
  return Number(((thruPlays / impressions) * 100).toFixed(2));
};

// Drop-off Rate
export const calculateDropOff = (threeSecViews: number, thruPlays: number): number => {
  if (threeSecViews <= 0) return 0;
  const dropOff = ((threeSecViews - thruPlays) / threeSecViews) * 100;
  return Number(dropOff.toFixed(2));
};

// Conversion Rate
export const calculateConversionRate = (purchases: number, linkClicks: number): number => {
  if (linkClicks <= 0) return 0;
  return Number(((purchases / linkClicks) * 100).toFixed(2));
};

// Calculate all metrics for a creative
export const calculateAllMetrics = (creative: CreativeData): CalculatedMetrics => {
  return {
    hookRate: calculateHookRate(creative['3-Second Video Views'], creative['Impressions']),
    holdRate: calculateHoldRate(creative['ThruPlays'], creative['3-Second Video Views']),
    ctr: calculateCTR(creative['Link Clicks'], creative['Impressions']),
    cpa: calculateCPA(creative['Amount Spent'], creative['Purchases']),
    roas: calculateROAS(creative['Purchase Value'], creative['Amount Spent']),
    aov: calculateAOV(creative['Purchase Value'], creative['Purchases']),
    retention3s: calculate3sRetention(creative['3-Second Video Views'], creative['Impressions']),
    retention15s: calculate15sRetention(creative['ThruPlays'], creative['Impressions']),
    dropOff: calculateDropOff(creative['3-Second Video Views'], creative['ThruPlays']),
    conversionRate: calculateConversionRate(creative['Purchases'], creative['Link Clicks']),
  };
};

// Format utilities matching your Streamlit display
export const formatCurrency = (value: number): string => {
  return `€${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatROAS = (value: number): string => {
  return `${value.toFixed(2)}x`;
};

export const formatLargeNumber = (value: number): string => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

// Performance scoring (matching your Streamlit logic)
export const getPerformanceScore = (metrics: CalculatedMetrics): number => {
  let score = 0;
  
  // Hook Rate scoring
  if (metrics.hookRate > 30) score += 25;
  else if (metrics.hookRate > 20) score += 15;
  else if (metrics.hookRate > 10) score += 5;
  
  // Hold Rate scoring
  if (metrics.holdRate > 50) score += 25;
  else if (metrics.holdRate > 30) score += 15;
  else if (metrics.holdRate > 15) score += 5;
  
  // CTR scoring
  if (metrics.ctr > 2) score += 25;
  else if (metrics.ctr > 1) score += 15;
  else if (metrics.ctr > 0.5) score += 5;
  
  // ROAS scoring
  if (metrics.roas > 3) score += 25;
  else if (metrics.roas > 2) score += 15;
  else if (metrics.roas > 1) score += 5;
  
  return score;
};

export const getPerformanceColor = (score: number): string => {
  if (score >= 70) return 'text-success-green';
  if (score >= 40) return 'text-warning-orange';
  return 'text-error-red';
};

export const getPerformanceLabel = (score: number): string => {
  if (score >= 70) return 'High Performer';
  if (score >= 40) return 'Average';
  return 'Needs Improvement';
};
