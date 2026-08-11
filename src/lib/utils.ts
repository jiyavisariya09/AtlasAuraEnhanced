import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const AVATAR_MAP: Record<string, string> = {
  'TravelNewbie': '/avatars/avatar-1.jpg',
  'SoloWanderer': '/avatars/avatar-2.jpg',
  'OffPathTraveler': '/avatars/avatar-3.jpg',
  'SakuraExpert': '/avatars/avatar-4.jpg',
  'JapanLover': '/avatars/avatar-5.jpg',
  'AdventureAnna': '/avatars/avatar-6.jpg',
  'NordicNomad': '/avatars/avatar-7.jpg',
  'Sarah Chen': '/avatars/avatar-sarah.jpg',
  'Marco Rossi': '/avatars/avatar-marco.jpg',
  'Emma Wilson': '/avatars/avatar-1.jpg',
  'David Park': '/avatars/avatar-3.jpg',
  'Alex Thompson': '/avatars/avatar-7.jpg',
  'Lisa Anderson': '/avatars/avatar-lisa.jpg',
  'You': '/avatars/avatar-default.jpg',
}

export function getAuthorAvatar(author?: string, customAvatar?: string): string {
  if (customAvatar) return customAvatar;
  if (author && AVATAR_MAP[author]) return AVATAR_MAP[author];
  return '/avatars/avatar-default.jpg';
}

const COUNTRY_IMAGE_MAP: Record<string, string> = {
  'Japan': '/memories/japan.jpg',
  'Morocco': '/memories/morocco.jpg',
  'Norway': '/memories/norway.jpg',
  'Indonesia': '/memories/indonesia.jpg',
  'Greece': '/memories/greece.jpg',
  'Iceland': '/memories/iceland.jpg',
  'Peru': '/memories/peru.jpg',
  'Switzerland': '/memories/switzerland.jpg',
};

export function getPinImage(pin: { image?: string; country?: string }): string {
  if (pin.image) return pin.image;
  if (pin.country && COUNTRY_IMAGE_MAP[pin.country]) return COUNTRY_IMAGE_MAP[pin.country];
  return '/memories/default.jpg';
}
