
import React from 'react';

export const GeminiIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ${className}`}>
    <svg viewBox="0 0 24 24" fill="white" className="w-10 h-10">
      <path d="M12 7.5C11.125 7.5 10.5 8.125 10.5 9V10.5H9C8.125 10.5 7.5 11.125 7.5 12C7.5 12.875 8.125 13.5 9 13.5H10.5V15C10.5 15.875 11.125 16.5 12 16.5C12.875 16.5 13.5 15.875 13.5 15V13.5H15C15.875 13.5 16.5 12.875 16.5 12C16.5 11.125 15.875 10.5 15 10.5H13.5V9C13.5 8.125 12.875 7.5 12 7.5Z" />
    </svg>
  </div>
);

export const NotesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`w-full h-full bg-yellow-300 p-2 ${className}`}>
    <div className="w-full h-full border-t-8 border-yellow-500" />
  </div>
);

export const CalculatorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-full h-full grid grid-cols-2 grid-rows-2 gap-px bg-gray-500 ${className}`}>
        <div className="bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">÷</div>
        <div className="bg-orange-500 flex items-center justify-center text-white text-2xl font-bold">×</div>
        <div className="bg-gray-700 flex items-center justify-center text-white text-2xl font-bold">7</div>
        <div className="bg-gray-700 flex items-center justify-center text-white text-2xl font-bold">8</div>
    </div>
);

export const WeatherIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-full h-full flex items-center justify-center bg-blue-400 ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 9.168A6 6 0 0110 6c1.54 0 2.943.586 4.004 1.538a.75.75 0 001.126-.98A7.5 7.5 0 0010 4.5 7.492 7.492 0 003.08 9.043a.75.75 0 101.252.125z" clipRule="evenodd" />
            <path d="M10 14a.75.75 0 01-.75-.75V11.5a.75.75 0 011.5 0V13.25A.75.75 0 0110 14zM10 8a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
    </div>
);

export const PhotosIcon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-full h-full grid grid-cols-2 grid-rows-2 ${className}`}>
        <div className="bg-red-400"></div>
        <div className="bg-green-400"></div>
        <div className="bg-blue-400"></div>
        <div className="bg-yellow-400"></div>
    </div>
);

export const ExploreV2Icon: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`w-full h-full flex items-center justify-center bg-[#0A0A0C] relative ${className}`}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="64" fill="#0A0A0C"/>
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{stopColor: '#1E7CFF', stopOpacity: 0.6}} />
            <stop offset="100%" style={{stopColor: '#1E7CFF', stopOpacity: 0}} />
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="20" fill="url(#glow)" />
        <path d="M25.4142 22.5858C24.6332 21.8047 23.3668 21.8047 22.5858 22.5858C21.8047 23.3668 21.8047 24.6332 22.5858 25.4142L28.1716 31H24C22.8954 31 22 31.8954 22 33V35C22 36.1046 22.8954 37 24 37H39C40.1046 37 41 36.1046 41 35V33C41 31.8954 40.1046 31 39 31H34.8284L40.4142 25.4142C41.1953 24.6332 41.1953 23.3668 40.4142 22.5858C39.6332 21.8047 38.3668 21.8047 37.5858 22.5858L32 28.1716L25.4142 22.5858Z" fill="#C6CDDA"/>
        <path d="M32 37V42" stroke="#1E7CFF" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
);

// Explorer App UI Icons
const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg className={`w-6 h-6 ${className}`} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);

export const FoodIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21.5v-4.5" /><path d="M8 17h8v-1.5a2.5 2.5 0 1 0 -5 0v1.5h-3z" /><path d="M12 12.5v-9.5" /><path d="M15 5l-3 -3l-3 3" /></IconWrapper>;
export const GasIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 21h4v-10a2 2 0 0 0 -2 -2h-3v-4h4" /><path d="M14 7h1a2 2 0 0 1 2 2v2" /><path d="M13 13h1a2 2 0 0 0 2 -2v-2" /><path d="M12 21v-10" /></IconWrapper>;
export const HospitalIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 21h18" /><path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" /><path d="M9 9h6v6h-6z" /><path d="M12 6v12" /></IconWrapper>;
export const LgbtqIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" /><path d="M12 16.5l0 -4.5" /><path d="M14.5 14.5l-5 -2.5" /><path d="M9.5 14.5l5 -2.5" /></IconWrapper>;
export const BlackOwnedIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 3v18" /><path d="M3 12h18" /></IconWrapper>;
export const ChillIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M9.5 15a3.5 3.5 0 0 0 5 0" /></IconWrapper>;
export const EventsIcon = () => <IconWrapper><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 5m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M16 3l0 4" /><path d="M8 3l0 4" /><path d="M4 11l16 0" /><path d="M11 15h1v4h-1z" /></IconWrapper>;

export const SearchIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" /><path d="M21 21l-6 -6" /></IconWrapper>;
export const DirectionsIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 11l18 -8l-9 18l-4 -9l-9 -4z" /></IconWrapper>;
export const BackIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></IconWrapper>;
export const ShareIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M8.7 10.7l6.6 -3.4" /><path d="M8.7 13.3l6.6 3.4" /></IconWrapper>;
export const CloseIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></IconWrapper>;

// Profile System Icons
export const HomeIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 2l9 7v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></IconWrapper>;
export const ProfileIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" /></IconWrapper>;
export const ARIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8v-2a2 2 0 0 1 2 -2h2" /><path d="M4 16v2a2 2 0 0 0 2 2h2" /><path d="M16 4h2a2 2 0 0 1 2 2v2" /><path d="M16 20h2a2 2 0 0 0 2 -2v-2" /><path d="M12 12.5l-2.5 4.5l2.5 2l2.5 -2l-2.5 -4.5z" /><path d="M12 3v5" /></IconWrapper>;
export const StarIcon = ({ className, isFilled }: { className?: string, isFilled?: boolean }) => (
    <IconWrapper className={className}>
        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"
              fill={isFilled ? "currentColor" : "none"} />
    </IconWrapper>
);
export const ListIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></IconWrapper>;
export const PlusIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></IconWrapper>;
export const EndNavigationIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></IconWrapper>;

// Vibe Mode Icons
export const ChillVibeIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M9.5 15a3.5 3.5 0 0 0 5 0" /></IconWrapper>;
export const HypeVibeIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 3l-4 9h5l-4 9" /></IconWrapper>;
export const AestheticVibeIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M6.35 11.65a4 4 0 1 0 0 4.7" /><path d="M17.65 11.65a4 4 0 1 1 0 4.7" /></IconWrapper>;
export const SilentVibeIcon = ({ className }: { className?: string }) => <IconWrapper className={className}><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12l0 .01" /></IconWrapper>;


// Map Marker Icons
export const UserLocationMarkerIcon: React.FC = () => (
    <div className="w-6 h-6 rounded-full bg-[#1E7CFF] border-2 border-white shadow-lg animate-pulse"></div>
);

export const PlaceMarkerIcon: React.FC = () => (
    <div className="w-8 h-8 flex items-center justify-center">
        <div className="absolute w-3 h-3 rounded-full bg-white"></div>
        <div className="absolute w-8 h-8 rounded-full bg-[#1E7CFF]/50 animate-ping"></div>
        <div className="absolute w-6 h-6 rounded-full bg-[#1E7CFF]/70"></div>
    </div>
);
