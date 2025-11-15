
import React, { useState, useMemo } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { Window } from './components/Window';
import { AppDefinition } from './types';
import { apps } from './apps/apps';

const App: React.FC = () => {
  const [activeApp, setActiveApp] = useState<string | null>(null);

  const handleOpenApp = (appId: string) => {
    setActiveApp(appId);
  };

  const handleCloseApp = () => {
    setActiveApp(null);
  };

  const ActiveAppComponent = useMemo(() => {
    if (!activeApp) return null;
    const app = apps.find(a => a.id === activeApp);
    return app ? app.component : null;
  }, [activeApp]);


  return (
    <div className="bg-gray-800 flex items-center justify-center w-full h-screen overflow-hidden">
      <div className="w-full h-full sm:w-[414px] sm:h-[896px] sm:max-w-sm sm:max-h-[95vh] bg-black rounded-none sm:rounded-[60px] sm:border-[14px] border-black sm:shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[55%] h-8 bg-black rounded-b-3xl z-20"></div>
        <div className="w-full h-full">
          {activeApp && ActiveAppComponent ? (
            <Window appName={apps.find(a => a.id === activeApp)?.name || ''} onClose={handleCloseApp}>
              <ActiveAppComponent />
            </Window>
          ) : (
            <HomeScreen apps={apps} onOpenApp={handleOpenApp} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
