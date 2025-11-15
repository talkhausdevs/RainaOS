import React, { ReactNode } from 'react';
import { StatusBar } from './StatusBar';

interface WindowProps {
  appName: string;
  children: ReactNode;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const Window: React.FC<WindowProps> = ({ appName, children, onClose, theme = 'light' }) => {
  return (
    <div className="absolute inset-0 bg-white flex flex-col animate-fade-in">
      <StatusBar theme={theme} />
      <div className="flex-grow pt-11 flex flex-col">
        {children}
      </div>
      <div className="flex-shrink-0 h-8 flex items-center justify-center" onClick={onClose} onTouchEnd={onClose}>
        <div className="w-36 h-1.5 bg-gray-300 rounded-full" />
      </div>
    </div>
  );
};