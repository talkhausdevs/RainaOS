
import { AppDefinition } from '../types';
import { GeminiIcon, NotesIcon, CalculatorIcon, WeatherIcon, PhotosIcon, ExploreV2Icon } from '../assets/icons';
import { GeminiChat } from './GeminiChat';
import { NotesApp } from './Notes';
import { CalculatorApp } from './Calculator';
import { WeatherApp } from './Weather';
import { PhotosApp } from './Photos';
import { MapsApp } from './Maps';

export const apps: AppDefinition[] = [
  {
    id: 'gemini-chat',
    name: 'Gemini',
    icon: GeminiIcon,
    component: GeminiChat,
    isDocked: true,
  },
  {
    id: 'notes',
    name: 'Notes',
    icon: NotesIcon,
    component: NotesApp,
    isDocked: false,
  },
  {
    id: 'calculator',
    name: 'Calculator',
    icon: CalculatorIcon,
    component: CalculatorApp,
    isDocked: false,
  },
  {
    id: 'weather',
    name: 'Weather',
    icon: WeatherIcon,
    component: WeatherApp,
    isDocked: false,
  },
  {
    id: 'photos',
    name: 'Photos',
    icon: PhotosIcon,
    component: PhotosApp,
    isDocked: true,
  },
  {
    id: 'explorer',
    name: 'Explorer',
    icon: ExploreV2Icon,
    component: MapsApp,
    isDocked: true,
  },
];
