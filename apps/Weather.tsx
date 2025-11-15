
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { SearchIcon, DirectionsIcon } from '../assets/icons';

interface Location {
  latitude: number;
  longitude: number;
}

interface CurrentWeather {
  city: string;
  temperature: number;
  condition: string;
  icon: string;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  icon: string;
}

interface DailyForecast {
  day: string;
  high: number;
  low: number;
  icon: string;
}

interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  location: Location;
}

export const WeatherApp: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWeather = async (query: string | Location) => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = typeof query === 'string'
        ? `What is the detailed weather forecast for ${query}? Also provide the exact latitude and longitude for the city center. Provide the current weather, an hourly forecast for the next 8 hours, and a daily forecast for the next 5 days. The hourly forecast should include temperature and a condition summary, and the time should be in "H AM/PM" format (e.g., "3 PM"). The daily forecast should include the high and low temperatures and a condition summary. Use Celsius. For conditions, provide a simple emoji icon for each. The first hourly forecast should be for the current hour, labelled "Now".`
        : `What is the detailed weather forecast for latitude ${query.latitude}, longitude ${query.longitude}? Also provide the exact latitude and longitude. Provide the current weather, an hourly forecast for the next 8 hours, and a daily forecast for the next 5 days. The hourly forecast should include temperature and a condition summary, and the time should be in "H AM/PM" format (e.g., "3 PM"). The daily forecast should include the high and low temperatures and a condition summary. Use Celsius. For conditions, provide a simple emoji icon for each. The first hourly forecast should be for the current hour, labelled "Now".`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              location: { type: Type.OBJECT, properties: { latitude: { type: Type.NUMBER }, longitude: { type: Type.NUMBER }}},
              current: {
                type: Type.OBJECT,
                properties: {
                  city: { type: Type.STRING },
                  temperature: { type: Type.NUMBER },
                  condition: { type: Type.STRING },
                  icon: { type: Type.STRING },
                },
              },
              hourly: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    temperature: { type: Type.NUMBER },
                    icon: { type: Type.STRING },
                  },
                },
              },
              daily: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    high: { type: Type.NUMBER },
                    low: { type: Type.NUMBER },
                    icon: { type: Type.STRING },
                  },
                },
              },
            },
          },
        },
      });

      const data = JSON.parse(response.text.trim());
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather data from Gemini", err);
      setError('Could not fetch weather data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
          setUserLocation(location);
          fetchWeather(location);
        },
        (err) => {
          console.error("Geolocation error", err);
          setError('Please enable location services.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setIsLoading(false);
    }
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
    }
  }

  const handleGetDirections = () => {
    if (userLocation && weather?.location) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${weather.location.latitude},${weather.location.longitude}`;
      window.open(url, '_blank');
    }
  };

  const renderCurrentWeather = (data: CurrentWeather) => (
    <div className="text-center text-white pt-4">
      <h1 className="text-3xl font-bold">{data.city}</h1>
      <p className="text-6xl font-light">{Math.round(data.temperature)}°</p>
      <p className="text-xl">{data.condition}</p>
      <div className="text-6xl my-2">{data.icon}</div>
      <button onClick={handleGetDirections} className="flex items-center justify-center space-x-2 mx-auto mt-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold hover:bg-white/30 transition-colors">
        <DirectionsIcon className="w-5 h-5" />
        <span>Get Directions</span>
      </button>
    </div>
  );

  const renderHourlyForecast = (data: HourlyForecast[]) => (
    <div className="mt-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
        <h2 className="text-white/80 text-sm uppercase mb-2 px-1">Hourly Forecast</h2>
        <div className="flex overflow-x-auto space-x-4 pb-2">
          {data.map((hour, index) => (
            <div key={index} className="flex flex-col items-center flex-shrink-0 w-16">
              <span className="text-white font-semibold text-sm">{hour.time}</span>
              <span className="text-3xl my-1">{hour.icon}</span>
              <span className="text-white font-bold text-lg">{Math.round(hour.temperature)}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderDailyForecast = (data: DailyForecast[]) => (
    <div className="mt-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
        <h2 className="text-white/80 text-sm uppercase mb-1 px-1">5-Day Forecast</h2>
        <ul className="divide-y divide-white/20">
          {data.map((day, index) => (
            <li key={index} className="flex items-center justify-between py-2 text-white">
              <span className="font-semibold w-1/3">{day.day}</span>
              <span className="text-2xl">{day.icon}</span>
              <div className="flex justify-end w-1/3 space-x-2">
                <span className="font-bold">{Math.round(day.high)}°</span>
                <span className="opacity-70">{Math.round(day.low)}°</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading && !weather) { // Only show initial loading screen
      return <div className="text-center"><p className="text-white text-2xl">Fetching detailed forecast...</p></div>;
    }
    if (error) {
      return <div className="text-center"><p className="text-yellow-300 text-2xl px-4">{error}</p></div>;
    }
    if (weather) {
      return (
        <div className="w-full h-full p-4 overflow-y-auto">
          {renderCurrentWeather(weather.current)}
          {renderHourlyForecast(weather.hourly)}
          {renderDailyForecast(weather.daily)}
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-500 to-indigo-700 relative">
       <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for a city..."
            className="w-full pl-10 pr-4 py-2 bg-black/20 text-white placeholder:text-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white">
            <SearchIcon className="w-5 h-5"/>
          </div>
        </form>
      </div>
      <div className={`flex-grow flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        {renderContent()}
      </div>
    </div>
  );
};