import { useMemo } from 'react';

function CircularGauge({ score, size = 140, strokeWidth = 10 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#00CAAA'; // turtle
    if (score >= 60) return '#F59D00'; // tangerine
    return '#FF4A48'; // coral
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        role="img"
        aria-label={`Legal coverage score: ${score}%`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#434F58"
          strokeWidth={strokeWidth}
          opacity="0.3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            '--gauge-circumference': circumference,
            '--gauge-offset': offset,
          }}
          className="gauge-animate"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{score}%</span>
        <span className="text-xs text-galactic mt-0.5">Coverage</span>
      </div>
    </div>
  );
}

function RiskBadge({ riskLevel }) {
  const config = {
    low: { bg: 'bg-turtle/15', border: 'border-turtle/30', text: 'text-turtle', label: 'Low Risk' },
    medium: { bg: 'bg-tangerine/15', border: 'border-tangerine/30', text: 'text-tangerine', label: 'Medium Risk' },
    high: { bg: 'bg-coral/15', border: 'border-coral/30', text: 'text-coral', label: 'High Risk' },
    critical: { bg: 'bg-coral/20', border: 'border-coral/40', text: 'text-coral', label: 'Critical Risk' },
  };
  const c = config[riskLevel] || config.medium;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${c.bg} ${c.border} ${c.text}`}>
      <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        {riskLevel === 'low' ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        )}
      </svg>
      {c.label}
    </span>
  );
}

export default function ScoreDashboard({ scoreData, hasStarted }) {
  const metrics = useMemo(() => {
    if (!hasStarted) return null;
    return scoreData;
  }, [scoreData, hasStarted]);

  if (!metrics) {
    return (
      <div className="card-gradient rounded-2xl border border-metal/20 p-6 mb-8">
        <p className="text-galactic text-center text-sm">Complete the website profile to see your legal coverage score.</p>
      </div>
    );
  }

  return (
    <div className="card-gradient rounded-2xl border border-metal/20 p-6 mb-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <CircularGauge score={metrics.score} />
        <div className="flex-1 min-w-0 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center md:text-left">
          <div>
            <p className="text-2xl font-bold text-turtle">{metrics.presentCount}</p>
            <p className="text-xs text-galactic mt-0.5">Present</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-coral">{metrics.missingCount}</p>
            <p className="text-xs text-galactic mt-0.5">Missing</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-tangerine">{metrics.outdatedCount}</p>
            <p className="text-xs text-galactic mt-0.5">Needs Update</p>
          </div>
          <div>
            <RiskBadge riskLevel={metrics.riskLevel} />
          </div>
        </div>
      </div>
    </div>
  );
}
