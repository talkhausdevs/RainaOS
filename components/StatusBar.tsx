import React from 'react';
import { useTime } from '../hooks/useTime';

interface StatusBarProps {
  theme?: 'dark' | 'light';
}

export const StatusBar: React.FC<StatusBarProps> = ({ theme = 'dark' }) => {
  const time = useTime();
  const textColor = theme === 'dark' ? 'text-white' : 'text-black';

  return (
    <div className={`absolute top-0 left-0 right-0 px-8 h-11 flex items-center justify-between z-10 ${textColor}`}>
      <span className="text-sm font-semibold">{time}</span>
      <div className="flex items-center space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.556A5.5 5.5 0 0112 15c1.472 0 2.822.55 3.889 1.556M12 21a9 9 0 100-18 9 9 0 000 18z" />
        </svg>
        <div className="w-6 h-3 border rounded-sm flex items-center p-0.5">
          <div className="w-full h-full bg-current rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};