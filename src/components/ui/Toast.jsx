'use client';
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  // Auto close after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800',
  };

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-fade-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-md min-w-[280px] max-w-[380px] ${styles[type]}`}>
        {/* Icon */}
        <span className="text-lg font-bold">{icons[type]}</span>

        {/* Message */}
        <p className="flex-1 text-sm font-medium">{message}</p>

        {/* Close button */}
        <button
          onClick={onClose}
          className="text-lg font-bold opacity-60 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
}