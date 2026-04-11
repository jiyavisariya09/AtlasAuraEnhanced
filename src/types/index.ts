export interface Country {
  id: string;
  name: string;
  region: string;
  image: string;
  description: string;
  culture: string;
  vibe: string;
  costLevel: 'budget' | 'moderate' | 'luxury';
  hiddenGems: string[];
  purposes: string[];
  rating: number;
}

export interface MemoryPin {
  id: string;
  lat: number;
  lng: number;
  country: string;
  note: string;
  emoji: string;
  mood: 'solo' | 'calm' | 'adventure' | 'honeymoon' | 'culture';
  author: string;
  date: string;
  isPublic: boolean;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  country?: string;
  tags: string[];
  answers: Answer[];
  likes: number;
  date: string;
}

export interface Answer {
  id: string;
  content: string;
  author: string;
  likes: number;
  isHelpful: boolean;
  date: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  type: 'nature' | 'culture' | 'adventure';
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  countriesExplored: number;
  memoryPins: number;
  questionsAnswered: number;
  contributionScore: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  earnedDate?: string;
}

export type TravelMood = 'solo' | 'calm' | 'adventure' | 'honeymoon' | 'culture' | 'all';
