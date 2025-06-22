
import React from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  colorClass?: string;
  bgColorClass?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  colorClass = 'bg-red-500', // Default to red for "Heat"
  bgColorClass = 'bg-gray-700',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full ${bgColorClass} rounded-full h-3.5`}>
      <div
        className={`${colorClass} h-3.5 rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${clampedValue}%` }}
      ></div>
    </div>
  );
};
