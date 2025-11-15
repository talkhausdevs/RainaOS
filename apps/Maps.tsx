
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Place, UserProfile, UserList, RouteType, NavigationPlan, NavigationVibe } from '../types';
import { ARIcon, BackIcon, BlackOwnedIcon, ChillIcon, CloseIcon, DirectionsIcon, EndNavigationIcon, EventsIcon, FoodIcon, GasIcon, HomeIcon, HospitalIcon, LgbtqIcon, ListIcon, PlusIcon, ProfileIcon, SearchIcon, ShareIcon, StarIcon, ChillVibeIcon, HypeVibeIcon, AestheticVibeIcon, SilentVibeIcon, UserLocationMarkerIcon, PlaceMarkerIcon } from '../assets/icons';
import Map, { Marker } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

// --- CONSTANTS ---
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'; // Public token to fix loading issues
const PROFILE_STORAGE_KEY = 'exploreAppUserProfile';

// --- TYPES ---
interface Location {
  latitude: number;
  longitude: number;
}
type AppView = 'home' | 'searchResults' | 'placeDetails' | 'navigation';
type AppTab = 'explore' | 'profile' | 'ar';

// --- MOCK / INITIAL DATA ---
const trendingPlaces: Place[] = [
    { id: 'trending-1', name: "Neon District Cafe", category: "Cafe", latitude: 34.0522, longitude: -118.2437 },
    { id: 'trending-2', name: "Cyber Sunset Park", category: "Park", latitude: 34.0522, longitude: -118.2437 },
    { id: 'trending-3', name: "Glitch Gallery", category: "Museum", latitude: 34.0522, longitude: -118.2437 },
];

const categoryButtons = [
    { label: "Food", icon: FoodIcon, query: "restaurants" },
    { label: "Gas", icon: GasIcon, query: "gas stations" },
    { label: "Hospitals", icon: HospitalIcon, query: "hospitals" },
    { label: "LGBTQ+", icon: LgbtqIcon, query: "lgbtq friendly places" },
    { label: "Black-Owned", icon: BlackOwnedIcon, query: "black owned businesses" },
    { label: "Chill Spots", icon: ChillIcon, query: "chill spots to hang out" },
    { label: "Events", icon: EventsIcon, query: "events tonight" },
];

const initialProfile: UserProfile = {
  name: "Raina",
  avatar: `https://api.multiavatar.com/Raina.svg`,
  favorites: [],
  lists: [],
  recentTrips: [],
};

// --- CUSTOM HOOK FOR PROFILE MANAGEMENT ---
const useProfile = () => {
    const [profile, setProfile] = useState<UserProfile>(initialProfile);
    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
            if (savedProfile) {
                const parsedProfile = JSON.parse(savedProfile);
                // Validate data to prevent crashes from corrupted localStorage
                const validatedProfile: UserProfile = {
                    ...initialProfile,
                    ...parsedProfile,
                    favorites: Array.isArray(parsedProfile.favorites) ? parsedProfile.favorites : [],
                    lists: Array.isArray(parsedProfile.lists) ? parsedProfile.lists : [],
                    recentTrips: Array.isArray(parsedProfile.recentTrips) ? parsedProfile.recentTrips : [],
                };
                setProfile(validatedProfile);
            } else {
                 localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(initialProfile));
            }
        } catch (error) {
            console.error("Failed to parse profile from localStorage", error);
            localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(initialProfile));
        }
    }, []);
    const saveProfile = (newProfile: UserProfile) => {
        setProfile(newProfile);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
    };
    return { profile, saveProfile };
};


// --- MAIN APP COMPONENT ---
export const MapsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const { profile, saveProfile } = useProfile();
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This is a workaround for a Mapbox GL issue with cross-origin frames.
    (mapboxgl as any).workerCount = 0;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          setError(null);
        },
        (err) => setError('Enable location services to use Explore.'),
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported.');
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#0A0A0C] text-[#C6CDDA] font-sans overflow-hidden">
      <div className="flex-grow relative">
        {activeTab === 'explore' && <ExploreView profile={profile} saveProfile={saveProfile} userLocation={userLocation} error={error} />}
        {activeTab === 'profile' && <ProfileView profile={profile} saveProfile={saveProfile} />}
        {activeTab === 'ar' && <ARView userLocation={userLocation} error={error} />}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

// --- EXPLORE VIEW ---
const ExploreView: React.FC<{profile: UserProfile, saveProfile: (p: UserProfile) => void, userLocation: Location | null, error: string | null}> = ({ profile, saveProfile, userLocation, error }) => {
  const [viewState, setViewState] = useState({ latitude: 34.0522, longitude: -118.2437, zoom: 10, pitch: 45 });
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState<Place[]>(trendingPlaces);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [view, setView] = useState<AppView>('home');
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isAddToListModalOpen, setAddToListModalOpen] = useState(false);
  const [isRouteModalOpen, setRouteModalOpen] = useState(false);
  const [placeToAdd, setPlaceToAdd] = useState<Place | null>(null);
  const [navigationPlan, setNavigationPlan] = useState<NavigationPlan | null>(null);
  const [navigationVibe, setNavigationVibe] = useState<NavigationVibe>('chill');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  useEffect(() => {
    if (userLocation) setViewState(prev => ({ ...prev, latitude: userLocation.latitude, longitude: userLocation.longitude, zoom: 14 }));
  }, [userLocation]);

  useEffect(() => {
    if (selectedPlace) setViewState(prev => ({ ...prev, latitude: selectedPlace.latitude, longitude: selectedPlace.longitude, zoom: 16 }));
  }, [selectedPlace]);
  
  const runSearch = async (search: string) => {
    if (!search.trim() || !userLocation) return;
    setIsLoading(true); setPlaces([]); setSelectedPlace(null); setSearchQuery(search); setView('searchResults'); setIsPanelExpanded(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Find "${search}" near latitude ${userLocation.latitude}, longitude ${userLocation.longitude}. Return a JSON array of up to 10 places. Each place should be an object with "name", "category", "latitude", and "longitude".`;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: prompt,
        config: { responseMimeType: 'application/json', responseSchema: {
            type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, category: { type: Type.STRING }, latitude: { type: Type.NUMBER }, longitude: { type: Type.NUMBER }}},
        }},
      });
      const responseData = JSON.parse(response.text.trim());
      if (Array.isArray(responseData)) {
        const data = responseData.map((p: Omit<Place, 'id'>) => ({...p, id: `${p.name}-${p.latitude}-${p.longitude}`}));
        setPlaces(data);
      } else {
        console.error("Search results from Gemini were not an array:", responseData);
        setPlaces([]);
      }
    } catch (err) { 
      console.error("Search failed", err);
      setPlaces([]);
    } 
    finally { setIsLoading(false); }
  };

  const fetchPlaceDetails = async (place: Place) => {
    setIsLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const prompt = `Give me details for the place named "${place.name}" near latitude ${place.latitude}, longitude ${place.longitude}. Return a JSON object with a short "description" (max 30 words) and an array of 5 "vibeTags" (e.g., 'aesthetic', 'cheap', 'quiet', 'safe', 'date night').`;
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', contents: prompt,
            config: { responseMimeType: 'application/json', responseSchema: {
                type: Type.OBJECT, properties: { description: { type: Type.STRING }, vibeTags: { type: Type.ARRAY, items: { type: Type.STRING } } }
            }}
        });
        const details = JSON.parse(response.text.trim());
        if (details && typeof details === 'object') {
          setSelectedPlace({ ...place, ...details });
        } else {
          console.error("Place details from Gemini were not an object:", details);
          setSelectedPlace(place);
        }
    } catch (err) { 
      console.error("Failed to fetch place details", err);
      setSelectedPlace(place); 
    } 
    finally { setIsLoading(false); }
  };

  const startNavigation = async (routeType: RouteType, vibe: NavigationVibe) => {
      if (!selectedPlace || !userLocation) return;
      setRouteModalOpen(false); setIsLoading(true); setNavigationVibe(vibe);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const prompt = `Generate a turn-by-turn navigation route from latitude ${userLocation.latitude}, longitude ${userLocation.longitude} to "${selectedPlace.name}" at latitude ${selectedPlace.latitude}, longitude ${selectedPlace.longitude}. The route should be the "${routeType}" option. The instructions should be casual and friendly, with a "${vibe}" vibe. Provide a JSON object with "totalDistance", "totalDuration", and an array of "steps". Each step object should have "instruction", "distance", "duration", and an optional "speedLimit" (in mph).`;
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash', contents: prompt,
              config: { responseMimeType: 'application/json', responseSchema: {
                  type: Type.OBJECT, properties: {
                      totalDistance: { type: Type.STRING }, totalDuration: { type: Type.STRING },
                      steps: { type: Type.ARRAY, items: {
                          type: Type.OBJECT, properties: {
                              instruction: { type: Type.STRING }, distance: { type: Type.STRING },
                              duration: { type: Type.STRING }, speedLimit: { type: Type.NUMBER }
                          }}}}}}
          });
          
          const navigationData = JSON.parse(response.text.trim());
          if (!navigationData || typeof navigationData !== 'object' || !Array.isArray(navigationData.steps) || navigationData.steps.length === 0) {
            console.error("Navigation plan from Gemini is invalid or has no steps.", navigationData);
            setIsLoading(false);
            return;
          }

          setNavigationPlan(navigationData);
          setCurrentStepIndex(0); setView('navigation'); setIsPanelExpanded(false);
          const newProfile = {...profile};
          if (!newProfile.recentTrips.some(p => p.id === selectedPlace.id)) {
              newProfile.recentTrips = [selectedPlace, ...newProfile.recentTrips].slice(0, 20);
              saveProfile(newProfile);
          }
      } catch (err) { console.error("Failed to generate route", err); } 
      finally { setIsLoading(false); }
  };

  const handlePlaceSelect = (place: Place) => { fetchPlaceDetails(place); setView('placeDetails'); };
  const handleBack = () => {
    setSelectedPlace(null);
    if (userLocation) setViewState(prev => ({...prev, latitude: userLocation.latitude, longitude: userLocation.longitude, zoom: 14}));
    if(view === 'placeDetails') setView('searchResults');
    else { setView('home'); setPlaces(trendingPlaces); setIsPanelExpanded(false); }
  };
  const handleToggleFavorite = (place: Place) => {
    const newProfile = {...profile};
    if(newProfile.favorites.some(p => p.id === place.id)) newProfile.favorites = newProfile.favorites.filter(p => p.id !== place.id);
    else newProfile.favorites = [place, ...newProfile.favorites];
    saveProfile(newProfile);
  };
  
  if (view === 'navigation' && navigationPlan && selectedPlace) {
      return <NavigationView plan={navigationPlan} destination={selectedPlace} vibe={navigationVibe} currentStepIndex={currentStepIndex} setCurrentStepIndex={setCurrentStepIndex} onEndNavigation={() => { setNavigationPlan(null); setView('placeDetails'); setIsPanelExpanded(true); }} />
  }

  return (
    <>
      <div className="absolute inset-0 transition-all duration-500" style={{ filter: isPanelExpanded ? 'brightness(0.7)' : 'brightness(1)' }}>
        {error && <div className="w-full h-full flex items-center justify-center bg-[#0A0A0C]"><p>{error}</p></div>}
        {!userLocation && !error && <div className="w-full h-full flex items-center justify-center bg-[#0A0A0C]"><p>Locating...</p></div>}
        {userLocation && (
          <Map {...viewState} onMove={evt => setViewState(evt.viewState)} mapboxAccessToken={MAPBOX_TOKEN} style={{ width: '100%', height: '100%' }} mapStyle="mapbox://styles/mapbox/dark-v11" reuseMaps>
            <Marker longitude={userLocation.longitude} latitude={userLocation.latitude}><UserLocationMarkerIcon /></Marker>
            {places.map(place => ( <Marker key={place.id} longitude={place.longitude} latitude={place.latitude} onClick={() => handlePlaceSelect(place)}><PlaceMarkerIcon /></Marker> ))}
          </Map>
        )}
      </div>
      
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <form onSubmit={(e) => { e.preventDefault(); runSearch(query); }}>
          <div className="relative">
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search for a place or address" className="w-full pl-12 pr-4 py-3 bg-[#0A0A0C]/70 backdrop-blur-md border border-white/10 rounded-2xl text-lg text-[#C6CDDA] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#1E7CFF] shadow-[0_0_15px_rgba(30,124,255,0.2)]" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon className="w-6 h-6 text-gray-500"/></div>
          </div>
        </form>
      </header>

      {!isPanelExpanded && <div className="absolute top-28 left-0 right-0 px-4 z-10 flex space-x-2 overflow-x-auto pb-4">
        {categoryButtons.map(cat => ( <button key={cat.label} onClick={() => runSearch(cat.query)} className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-[#0A0A0C]/70 backdrop-blur-md border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors"><cat.icon /> <span>{cat.label}</span></button> ))}
      </div>}
      
      <div className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/95 to-[#0A0A0C]/80 backdrop-blur-xl border-t border-white/10 rounded-t-3xl transition-all duration-500 ease-in-out ${isPanelExpanded ? 'h-[60%]' : 'h-48'}`}>
        <div className="w-full h-full flex flex-col">
          <button className="py-3 flex justify-center" onClick={() => setIsPanelExpanded(!isPanelExpanded)}><div className="w-10 h-1.5 bg-gray-600 rounded-full"></div></button>
          <div className="px-4 pb-2 flex items-center">
            {view !== 'home' && <button onClick={handleBack} className="p-2 -ml-2 mr-2"><BackIcon /></button>}
            <h2 className="text-xl font-bold truncate">{view === 'home' && "Trending Places"} {view === 'searchResults' && `Results for "${searchQuery}"`} {view === 'placeDetails' && selectedPlace?.name}</h2>
          </div>
          <div className="flex-grow overflow-y-auto px-4 pb-4">
            {(view === 'home' || view === 'searchResults') && (
              isLoading ? <p className="text-center pt-8">Searching...</p> : <ul>
                {places.map((place) => ( <li key={place.id}><button onClick={() => handlePlaceSelect(place)} className="w-full text-left p-3 flex items-center rounded-lg hover:bg-white/5 transition-colors"><div className="flex-grow"><p className="font-semibold text-white">{place.name}</p><p className="text-sm text-gray-400">{place.category}</p></div><DirectionsIcon className="text-[#1E7CFF] w-8 h-8"/></button></li> ))}
                {places.length === 0 && !isLoading && <p className="text-center pt-8">No results found.</p>}
              </ul>
            )}
            {view === 'placeDetails' && selectedPlace && (
              <div className="space-y-4">
                {isLoading ? <p className="text-center">Loading details...</p> : <>
                  <div><h3 className="text-sm text-gray-400 mb-1">Vibe</h3><div className="flex flex-wrap gap-2">{selectedPlace.vibeTags?.map(tag => <span key={tag} className="px-3 py-1 bg-gray-800 text-sm rounded-full capitalize">{tag}</span>) || <span className="text-gray-500 text-sm">No vibe tags.</span>}</div></div>
                  <div><h3 className="text-sm text-gray-400 mb-1">About</h3><p>{selectedPlace.description || "No description."}</p></div>
                  <div className="flex space-x-2 pt-4">
                    <button onClick={() => setRouteModalOpen(true)} className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#1E7CFF] text-white font-bold rounded-xl hover:opacity-90 transition-opacity"><DirectionsIcon className="w-5 h-5" /><span>Directions</span></button>
                    <button onClick={() => handleToggleFavorite(selectedPlace)} className={`px-4 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors ${profile.favorites.some(p => p.id === selectedPlace.id) ? 'text-yellow-400' : ''}`}><StarIcon className="w-5 h-5" isFilled={profile.favorites.some(p => p.id === selectedPlace.id)}/></button>
                    <button onClick={() => { setPlaceToAdd(selectedPlace); setAddToListModalOpen(true); }} className="px-4 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"><ListIcon className="w-5 h-5"/></button>
                  </div>
                </>}
              </div>
            )}
          </div>
        </div>
      </div>
      {isAddToListModalOpen && placeToAdd && <AddToListModal place={placeToAdd} profile={profile} saveProfile={saveProfile} onClose={() => setAddToListModalOpen(false)} />}
      {isRouteModalOpen && <RouteSelectionModal onClose={() => setRouteModalOpen(false)} onSelectRoute={startNavigation} isLoading={isLoading} />}
    </>
  );
};

// --- SPEED LIMIT DISPLAY ---
const SpeedLimitDisplay: React.FC<{ speed: number; limit: number }> = ({ speed, limit }) => {
    const isSpeeding = speed > limit && limit > 0;
    return (
        <div className="flex flex-col items-center text-center">
            <p className="text-xs text-gray-400 -mb-1">SPEED</p>
            <div className="relative flex items-center">
                <p className={`text-4xl font-bold transition-colors ${isSpeeding ? 'text-red-400' : 'text-white'}`}>{speed}</p>
                <div className={`ml-2 text-center border-2 ${isSpeeding ? 'border-red-500 shadow-[0_0_10px_theme(colors.red.500)]' : 'border-white'} rounded-full w-8 h-8 transition-all`}>
                    <p className="text-xs font-bold leading-[9px] mt-1">LIMIT</p>
                    <p className="text-sm font-bold leading-3">{limit}</p>
                </div>
            </div>
        </div>
    );
};

// --- NAVIGATION VIEW ---
const NavigationView: React.FC<{
    plan: NavigationPlan; destination: Place; vibe: NavigationVibe; currentStepIndex: number;
    setCurrentStepIndex: (index: number) => void; onEndNavigation: () => void;
}> = ({ plan, destination, vibe, currentStepIndex, setCurrentStepIndex, onEndNavigation }) => {
    const [currentSpeed, setCurrentSpeed] = useState(0);
    const currentStep = useMemo(() => plan.steps?.[currentStepIndex], [plan.steps, currentStepIndex]);

    useEffect(() => {
        if (!currentStep) {
            console.error("Navigation Error: Invalid current step. Ending navigation.");
            onEndNavigation();
        }
    }, [currentStep, onEndNavigation]);

    if (!currentStep) {
        // This guard prevents crashing if currentStep is invalid before the useEffect can run.
        return <div className="absolute inset-0 bg-[#0A0A0C] flex items-center justify-center"><p>Finalizing route...</p></div>;
    }

    const isLastStep = currentStepIndex >= plan.steps.length - 1;

    useEffect(() => {
        if (isLastStep) {
            setCurrentSpeed(0);
            return;
        }

        const stepTimer = setTimeout(() => {
            setCurrentStepIndex(currentStepIndex + 1);
        }, 5000);

        const speedLimit = currentStep.speedLimit || 50;
        setCurrentSpeed(speedLimit > 5 ? speedLimit - 5 : speedLimit);

        const speedInterval = setInterval(() => {
            const fluctuation = Math.floor(Math.random() * 10) - 4;
            const newSpeed = Math.max(0, speedLimit + fluctuation);
            setCurrentSpeed(newSpeed);
        }, 1500);

        return () => {
            clearTimeout(stepTimer);
            clearInterval(speedInterval);
        };
    }, [currentStepIndex, isLastStep, currentStep, setCurrentStepIndex]);

    const vibeStyles = {
        chill: { accent: 'text-[#1E7CFF]', bg: 'bg-[#1E7CFF]' },
        hype: { accent: 'text-emerald-400', bg: 'bg-emerald-400' },
        aesthetic: { accent: 'text-purple-400', bg: 'bg-purple-400' },
        silent: { accent: 'text-gray-400', bg: 'bg-gray-400' },
    };
    const currentVibeStyle = vibeStyles[vibe] || vibeStyles.chill;

    return (
        <div className="absolute inset-0 bg-[#0A0A0C] flex flex-col z-50">
            <div className="absolute inset-0 opacity-20"><Map initialViewState={{latitude: destination.latitude, longitude: destination.longitude, zoom: 15}} mapboxAccessToken={MAPBOX_TOKEN} style={{ width: '100%', height: '100%' }} mapStyle="mapbox://styles/mapbox/dark-v11" reuseMaps/></div>
            <div className={`relative p-4 pt-12 bg-gradient-to-b from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent`}>
                <p className={`text-sm font-bold ${currentVibeStyle.accent}`}>{isLastStep ? `Arriving at ${destination.name}` : `${currentStep.distance} - ${currentStep.duration}`}</p>
                <h1 className="text-3xl font-bold text-white mt-1 h-24 overflow-hidden">{isLastStep ? "You have arrived!" : currentStep.instruction}</h1>
            </div>
            <div className="relative mt-auto p-4 bg-gradient-to-t from-[#0A0A0C] via-[#0A0A0C]/90 to-transparent">
                <div className="bg-[#0A0A0C]/80 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center justify-between text-center">
                    <div><p className="text-xs text-gray-400">ETA</p><p className="text-lg font-bold text-white">{plan.totalDuration}</p></div>
                    <SpeedLimitDisplay speed={currentSpeed} limit={currentStep.speedLimit || 0} />
                    <div><p className="text-xs text-gray-400">DISTANCE</p><p className="text-lg font-bold text-white">{plan.totalDistance}</p></div>
                </div>
                <button onClick={onEndNavigation} className="w-full mt-4 py-3 bg-red-600 text-white font-bold text-lg rounded-xl flex items-center justify-center space-x-2"><EndNavigationIcon className="w-5 h-5"/> <span>End</span></button>
            </div>
        </div>
    );
};


// --- AR VIEW ---
const ARView: React.FC<{ userLocation: Location | null; error: string | null }> = ({ userLocation, error }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [identifiedPlace, setIdentifiedPlace] = useState<{name: string, description: string} | null>(null);

    const handleIdentify = async () => {
        if (!userLocation) return;
        setIsLoading(true); setIdentifiedPlace(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `From this location (latitude: ${userLocation.latitude}, longitude: ${userLocation.longitude}), what is the single most prominent landmark or interesting point of interest someone might be looking at? Return a JSON object with a "name" of the place and a short "description" (max 15 words).`;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash', contents: prompt,
                config: { responseMimeType: 'application/json', responseSchema: {
                        type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING } } } }
            });
            const arData = JSON.parse(response.text.trim());
            if (arData && typeof arData === 'object' && arData.name && arData.description) {
              setIdentifiedPlace(arData);
            } else {
              console.error("AR identification from Gemini was not a valid object:", arData);
              setIdentifiedPlace({name: "Error", description: "Couldn't identify anything nearby."});
            }
        } catch (err) {
            console.error("AR identification failed", err);
            setIdentifiedPlace({name: "Error", description: "Couldn't identify anything nearby."});
        } finally { setIsLoading(false); }
    };
    
    return (
        <div className="w-full h-full relative overflow-hidden">
            <div className="absolute inset-0 filter blur-sm scale-110">
                {userLocation ? <Map initialViewState={{latitude: userLocation.latitude, longitude: userLocation.longitude, zoom: 15}} mapboxAccessToken={MAPBOX_TOKEN} style={{ width: '100%', height: '100%' }} mapStyle="mapbox://styles/mapbox/dark-v11" reuseMaps/> : <div className="w-full h-full bg-[#0A0A0C]"></div>}
            </div>
            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-8 text-center">
                {error && <p className="text-yellow-400">{error}</p>}
                {!userLocation && !error && <p>Finding your location for AR...</p>}
                {userLocation && (<>
                    <div className="absolute top-4 left-4 right-4 text-xs text-white/50 text-left"><p>LAT: {userLocation.latitude.toFixed(4)}</p><p>LON: {userLocation.longitude.toFixed(4)}</p></div>
                    <div className="mb-8 min-h-[80px]">
                         {identifiedPlace && (
                            <div className="bg-[#0A0A0C]/70 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg animate-fade-in">
                                <p className="text-lg font-bold text-white">{identifiedPlace.name}</p>
                                <p className="text-gray-300">{identifiedPlace.description}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={handleIdentify} disabled={isLoading} className="px-6 py-4 bg-[#1E7CFF]/80 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(30,124,255,0.4)] transition-transform active:scale-95 disabled:opacity-50">
                        {isLoading ? "Identifying..." : "Point your camera → Tell me what this is"}
                    </button>
                </>)}
            </div>
        </div>
    );
};

// --- PROFILE VIEW ---
const ProfileView: React.FC<{profile: UserProfile, saveProfile: (p: UserProfile) => void}> = ({ profile, saveProfile }) => {
    const [isCreateListModalOpen, setCreateListModalOpen] = useState(false);
    return (
        <div className="w-full h-full p-4 overflow-y-auto">
            <div className="flex items-center space-x-4 mb-8">
                <img src={profile.avatar} alt="User Avatar" className="w-20 h-20 rounded-full bg-gray-700" />
                <div><h1 className="text-2xl font-bold">{profile.name}</h1><p className="text-gray-400">Explorer Extraordinaire</p></div>
            </div>
            <ProfileSection title="Favorites" items={profile.favorites} />
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2"><h2 className="text-lg font-bold">My Lists</h2><button onClick={() => setCreateListModalOpen(true)} className="flex items-center space-x-1 text-sm text-[#1E7CFF]"><PlusIcon className="w-4 h-4" /><span>New List</span></button></div>
                {profile.lists.length > 0 ? <div className="grid grid-cols-2 gap-3">{profile.lists.map(list => (<div key={list.id} className="bg-gray-800/50 p-3 rounded-lg"><ListIcon className="w-6 h-6 mb-2 text-gray-400" /><h3 className="font-semibold text-white truncate">{list.name}</h3><p className="text-xs text-gray-500">{list.places.length} places</p></div>))}</div> : <p className="text-gray-500 text-sm">Create lists to organize your favorite places.</p>}
            </div>
            <ProfileSection title="Recent Trips" items={profile.recentTrips} />
            {isCreateListModalOpen && <CreateListModal profile={profile} saveProfile={saveProfile} onClose={() => setCreateListModalOpen(false)} />}
        </div>
    );
};
const ProfileSection: React.FC<{title: string, items: Place[]}> = ({ title, items }) => (<div className="mb-6"><h2 className="text-lg font-bold mb-2">{title}</h2>{items.length > 0 ? <div className="flex space-x-3 overflow-x-auto pb-2 -ml-4 px-4">{items.map(place => (<div key={place.id} className="flex-shrink-0 w-40 bg-gray-800/50 p-3 rounded-lg"><div className="w-full h-20 bg-gray-700 rounded mb-2"></div><h3 className="font-semibold text-white text-sm truncate">{place.name}</h3><p className="text-xs text-gray-500">{place.category}</p></div>))}</div> : <p className="text-gray-500 text-sm">No {title.toLowerCase()} yet.</p>}</div>);

// --- MODALS ---
const RouteSelectionModal: React.FC<{ onClose: () => void, onSelectRoute: (type: RouteType, vibe: NavigationVibe) => void, isLoading: boolean }> = ({ onClose, onSelectRoute, isLoading }) => {
    const routeTypes: {type: RouteType, name: string, desc: string}[] = [{ type: 'fastest', name: 'Fastest', desc: 'The quickest route available now.' }, { type: 'scenic', name: 'Scenic', desc: 'A route with better views.' }, { type: 'safest', name: 'Safest', desc: 'Well-lit, lower crime-rate areas.' }, { type: 'quiet', name: 'Quiet', desc: 'Avoids noisy streets and crowds.' }];
    const vibes: {vibe: NavigationVibe, name: string, icon: React.FC<{className?:string}>}[] = [{vibe: 'chill', name: 'Chill', icon: ChillVibeIcon}, {vibe: 'hype', name: 'Hype', icon: HypeVibeIcon}, {vibe: 'aesthetic', name: 'Aesthetic', icon: AestheticVibeIcon}, {vibe: 'silent', name: 'Silent', icon: SilentVibeIcon}];
    const [selectedVibe, setSelectedVibe] = useState<NavigationVibe>('chill');
    return (
         <div className="absolute inset-0 bg-black/50 z-30 flex items-end" onClick={onClose}>
            <div className="bg-[#1c1c1e] p-4 rounded-t-2xl w-full" onClick={e => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-2 text-center">Choose Your Vibe</h2>
                <div className="flex justify-around items-center mb-4">{vibes.map(v => <button key={v.vibe} onClick={() => setSelectedVibe(v.vibe)} className={`p-3 rounded-lg transition-colors ${selectedVibe === v.vibe ? 'bg-[#1E7CFF]' : 'bg-gray-800'}`}><v.icon className="w-7 h-7"/></button>)}</div>
                <h2 className="text-lg font-bold mb-4 text-center">Choose Your Route</h2>
                {isLoading ? <div className="text-center p-8">Building your route...</div> : <ul className="space-y-2">{routeTypes.map(rt => (<li key={rt.type}><button onClick={() => onSelectRoute(rt.type, selectedVibe)} className="w-full text-left p-3 rounded-lg bg-gray-800 hover:bg-gray-700"><h3 className="font-bold text-white">{rt.name}</h3><p className="text-sm text-gray-400">{rt.desc}</p></button></li>))}</ul>}
            </div>
        </div>
    )
}
const CreateListModal: React.FC<{ profile: UserProfile, saveProfile: (p: UserProfile) => void, onClose: () => void }> = ({ profile, saveProfile, onClose }) => {
    const [listName, setListName] = useState('');
    const handleSave = () => { if (!listName.trim()) return; saveProfile({ ...profile, lists: [{ id: Date.now().toString(), name: listName, places: [] }, ...profile.lists] }); onClose(); };
    return (<div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center p-4" onClick={onClose}><div className="bg-[#1c1c1e] p-5 rounded-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}><h2 className="text-lg font-bold mb-4">Create New List</h2><input type="text" value={listName} onChange={e => setListName(e.target.value)} placeholder="List Name" className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#1E7CFF]" autoFocus/><div className="flex justify-end space-x-2"><button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-[#1E7CFF] text-white rounded-lg">Save</button></div></div></div>);
};
const AddToListModal: React.FC<{ place: Place, profile: UserProfile, saveProfile: (p: UserProfile) => void, onClose: () => void }> = ({ place, profile, saveProfile, onClose }) => {
    const handleAddToList = (listId: string) => {
        const newProfile = {...profile};
        const listIndex = newProfile.lists.findIndex(l => l.id === listId);
        if (listIndex > -1 && !newProfile.lists[listIndex].places.some(p => p.id === place.id)) {
            newProfile.lists[listIndex].places.push(place);
            saveProfile(newProfile);
        }
        onClose();
    };
    return (<div className="absolute inset-0 bg-black/50 z-30 flex items-end" onClick={onClose}><div className="bg-[#1c1c1e] p-4 rounded-t-2xl w-full" onClick={e => e.stopPropagation()}><h2 className="text-lg font-bold mb-4">Add to a List</h2><ul className="space-y-2 max-h-60 overflow-y-auto">{profile.lists.map(list => (<li key={list.id}><button onClick={() => handleAddToList(list.id)} className="w-full text-left p-3 flex items-center rounded-lg bg-gray-800 hover:bg-gray-700"><ListIcon className="mr-3" />{list.name}</button></li>))}{profile.lists.length === 0 && <p className="text-gray-500 text-center py-4">No lists created yet.</p>}</ul></div></div>);
};

// --- NAV ---
const BottomNav: React.FC<{ activeTab: AppTab; setActiveTab: (tab: AppTab) => void; }> = ({ activeTab, setActiveTab }) => (
  <div className="flex-shrink-0 h-20 bg-[#0A0A0C]/80 backdrop-blur-lg border-t border-white/10 flex justify-around items-center">
    <button onClick={() => setActiveTab('explore')} className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'explore' ? 'text-[#1E7CFF]' : 'text-gray-500'}`}><HomeIcon className="w-7 h-7" /><span className="text-xs">Explore</span></button>
    <button onClick={() => setActiveTab('ar')} className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'ar' ? 'text-[#1E7CFF]' : 'text-gray-500'}`}><ARIcon className="w-7 h-7" /><span className="text-xs">AR</span></button>
    <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center space-y-1 transition-colors ${activeTab === 'profile' ? 'text-[#1E7CFF]' : 'text-gray-500'}`}><ProfileIcon className="w-7 h-7" /><span className="text-xs">Profile</span></button>
  </div>
);
