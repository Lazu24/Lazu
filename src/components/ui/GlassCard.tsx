import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'base' | 'translucent' | 'interactive';
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'base',
  glow = false,
  ...props
}) => {
  const bgStyles = {
    base: 'bg-[#171426]',
    translucent: 'bg-[#171426]/75 backdrop-blur-md',
    interactive: 'bg-[#171426] hover:border-[#8B5CF6]/40 transition-all duration-200',
  }[variant];

  const glowStyle = glow
    ? 'border-[#8B5CF6]/40 shadow-[0_0_24px_rgba(139,92,246,0.15)]'
    : 'border-[rgba(232,231,240,0.08)]';

  return (
    <div
      className={`rounded-2xl border ${bgStyles} ${glowStyle} p-6 text-[#E8E7F0] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
