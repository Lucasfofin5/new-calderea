
import React from 'react';

export const BriefcaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={`w-6 h-6 ${className || 'text-yellow-500'}`} // Changed to gold/yellowish
  >
    <path d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5A1.5 1.5 0 007.5 20.25h9a1.5 1.5 0 001.5-1.5V5.25A1.5 1.5 0 0016.5 3.75h-9zM6.75 5.25a.75.75 0 01.75-.75H9v.75a.75.75 0 001.5 0V4.5h1.5v.75a.75.75 0 001.5 0V4.5h.75a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75V5.25z" />
    <path d="M9.41 12.55a.75.75 0 010-1.06L10.97 10a.75.75 0 011.06 0l1.56 1.56a.75.75 0 11-1.06 1.06L11.5 11.53l-1.03 1.03a.75.75 0 01-1.06 0z" />
    <path d="M10.75 15a.75.75 0 00-1.5 0v1.5h-.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5H12.5V15a.75.75 0 00-.75-.75z" />
  </svg>
);
