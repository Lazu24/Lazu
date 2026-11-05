import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0A12]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Box */}
      <div
        className={`relative w-full ${maxWidth} bg-[#171426] border border-[rgba(232,231,240,0.12)] rounded-2xl p-6 shadow-2xl text-[#E8E7F0] z-10 animate-in fade-in zoom-in-95 duration-150`}
      >
        {title && (
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[rgba(232,231,240,0.08)]">
            <h3 className="text-lg font-semibold text-[#E8E7F0]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9B97AC] hover:text-[#E8E7F0] hover:bg-[#231F38] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
