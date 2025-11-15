import React from 'react';
import { AppDefinition } from '../types';
import { StatusBar } from './StatusBar';
import { Dock } from './Dock';

interface HomeScreenProps {
  apps: AppDefinition[];
  onOpenApp: (appId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ apps, onOpenApp }) => {
  const dockedApps = apps.filter(app => app.isDocked);
  const homeApps = apps.filter(app => !app.isDocked);

  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative flex flex-col">
      <StatusBar />
      <div className="flex-grow p-4 pt-16">
        <div className="grid grid-cols-4 gap-y-6">
          {homeApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center group"
              aria-label={`Open ${app.name}`}
            >
              <div className="w-16 h-16 bg-white rounded-xl shadow-md overflow-hidden transform group-active:scale-90 transition-transform">
                <app.icon className="w-full h-full" />
              </div>
              <span className="text-white text-xs mt-2 truncate w-16">{app.name}</span>
            </button>
          ))}
        </div>
      </div>
      <Dock apps={dockedApps} onOpenApp={onOpenApp} />
    </div>
  );
};