export default function CreativeScore({ creative }) {
  const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-bold text-lg mb-2">{creative['Ad name']}</h3>
      
      <div className="space-y-2 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Hook Score</span>
            <span>{creative['Hook Score']}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`${getScoreColor(creative['Hook Score'])} h-2 rounded-full`} 
                 style={{ width: `${creative['Hook Score']}%` }} />
          </div>
        </div>
      </div>
      
      <div className="text-center p-3 bg-gray-100 rounded">
        <div className="text-2xl font-bold">{creative['Overall Score']}</div>
        <div className="text-xs text-gray-600">Overall Score</div>
      </div>
    </div>
  );
}
