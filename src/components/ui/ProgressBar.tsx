import React from 'react';

interface ProgressBarProps {
  value: number; // Current value
  max?: number; // Max value, defaults to 100
  color?: string; // Fill color, defaults to mint green #67E8B4
  height?: string; // e.g. 'h-2', 'h-1.5'
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = '#67E8B4',
  height = 'h-2',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full bg-[#1F1B33] rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}66`,
        }}
      />
    </div>
  );
};
