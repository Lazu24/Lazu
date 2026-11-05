import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'active' | 'paused' | string;
  label?: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className = '',
}) => {
  const norm = status.toLowerCase();

  if (norm === 'pending' || norm === 'pendiente') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C4B5FD] ${className}`}
      >
        {label || 'Pendiente'}
      </span>
    );
  }

  if (norm === 'completed' || norm === 'completada' || norm === 'finalizada') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#67E8B4]/15 border border-[#67E8B4]/30 text-[#67E8B4] ${className}`}
      >
        {label || 'Completada'}
      </span>
    );
  }

  if (norm === 'active' || norm === 'en curso') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#67E8B4]/15 border border-[#67E8B4]/30 text-[#67E8B4] ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#67E8B4] animate-pulse"></span>
        {label || 'En curso'}
      </span>
    );
  }

  if (norm === 'paused' || norm === 'pausado') {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#FCD34D] ${className}`}
      >
        {label || 'Pausado'}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[rgba(232,231,240,0.08)] border border-[rgba(232,231,240,0.12)] text-[#9B97AC] ${className}`}
    >
      {label || status}
    </span>
  );
};
