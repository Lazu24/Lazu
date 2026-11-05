import React from 'react';

interface ProgressRingProps {
  progress: number; // 0 to 100
  timeText: string;
  sessionSubtitle?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  timeText,
  sessionSubtitle = 'Sesión 4 · 25 minutos',
  size = 280,
  strokeWidth = 8,
  color = '#67E8B4',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progress goes from full to zero or zero to full
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center select-none" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90 transform"
        style={{ filter: `drop-shadow(0 0 16px ${color}33)` }}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(232, 231, 240, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300 ease-linear"
        />
      </svg>

      {/* Center text display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
        <span className="text-[11px] font-medium tracking-[0.2em] text-[#9B97AC] uppercase mb-1">
          Tiempo restante
        </span>
        <span className="font-mono text-5xl md:text-6xl font-bold tracking-tight text-[#E8E7F0] drop-shadow-sm">
          {timeText}
        </span>
        {sessionSubtitle && (
          <span className="text-xs text-[#9B97AC] mt-2 font-normal">
            {sessionSubtitle}
          </span>
        )}
      </div>
    </div>
  );
};
