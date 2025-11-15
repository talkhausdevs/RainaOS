// Fix: Import React to resolve "Cannot find namespace 'React'" error for React.FC.
import React from 'react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.FC<{ className?: string }>;
  component: React.FC;
  isDocked: boolean;
}

export interface Note {
  id: string;
  content: string;
  timestamp: number;
}

export interface Place {
  id:string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  description?: string;
  vibeTags?: string[];
}

export interface UserList {
  id: string;
  name: string;
  places: Place[];
}

export interface UserProfile {
  name: string;
  avatar: string; // URL or identifier
  favorites: Place[];
  lists: UserList[];
  recentTrips: Place[];
}

export type RouteType = 'fastest' | 'scenic' | 'safest' | 'quiet';

export type NavigationVibe = 'chill' | 'hype' | 'aesthetic' | 'silent';

export interface RouteStep {
  instruction: string;
  distance: string;
  duration: string;
  speedLimit?: number;
}

export interface NavigationPlan {
  totalDistance: string;
  totalDuration: string;
  steps: RouteStep[];
}