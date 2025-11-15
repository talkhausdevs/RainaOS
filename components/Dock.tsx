import React from 'react';
import { AppDefinition } from '../types';

interface DockProps {
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
}

export const Dock: React.FC<DockProps> = ({ apps, onOpenApp }) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 h-24 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center space-x-4 px-4">
      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onOpenApp(app.id)}
          className="w-16 h-16 flex flex-col items-center justify-center group"
          aria-label={`Open ${app.name}`}
        >
          <div className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden transform group-active:scale-90 transition-transform">
            <app.icon />
          </div>
        </button>
      ))}
    </div>
  );
};