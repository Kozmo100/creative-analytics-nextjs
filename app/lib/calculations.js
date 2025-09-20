export function calculateHookRate(impressions, threeSecondViews) {
  if (!impressions || impressions === 0) return 0;
  return ((threeSecondViews / impressions) * 100).toFixed(2);
}

export function calculateHoldRate(threeSecondViews, thruPlayActions) {
  if (!threeSecondViews || threeSecondViews === 0) return 0;
  return ((thruPlayActions / threeSecondViews) * 100).toFixed(2);
}

export function calculateCTR(impressions, linkClicks) {
  if (!impressions || impressions === 0) return 0;
  return ((linkClicks / impressions) * 100).toFixed(2);
}

export function calculateScore(value, goodThreshold, mediumThreshold) {
  const numValue = parseFloat(value) || 0;
  if (numValue >= goodThreshold) {
    return Math.min(70 + (numValue - goodThreshold) * 2, 100);
  } else if (numValue >= mediumThreshold) {
    return 50 + ((numValue - mediumThreshold) / (goodThreshold - mediumThreshold)) * 19;
  } else {
    return Math.max(0, (numValue / mediumThreshold) * 49);
  }
}

export function processCreativeData(data) {
  return data.map(row => {
    const hookRate = calculateHookRate(row.Impressions, row['Three-second video views']);
    const holdRate = calculateHoldRate(row['Three-second video views'], row['ThruPlay Actions']);
    const ctr = calculateCTR(row.Impressions, row['Link Clicks']);
    
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
