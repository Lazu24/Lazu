import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5',
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center font-medium bg-[#67E8B4] text-[#0B0A12] transition-all duration-150 active:scale-[0.98] hover:bg-[#7ff3c3] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer shadow-[0_0_20px_rgba(103,232,180,0.18)] ${sizeStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center font-medium bg-[#171426] border border-[rgba(232,231,240,0.08)] text-[#E8E7F0] transition-all duration-150 hover:bg-[#231f38] hover:border-[#8B5CF6]/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sizeStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0 text-[#9B97AC]">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export const DangerButton: React.FC<ButtonProps> = ({
  children,
  icon,
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm rounded-xl gap-2',
    lg: 'px-5 py-2.5 text-base rounded-xl gap-2.5',
  }[size];

  return (
    <button
      className={`inline-flex items-center justify-center font-medium bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#FDA4AF] transition-all duration-150 hover:bg-[#F43F5E]/25 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sizeStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
