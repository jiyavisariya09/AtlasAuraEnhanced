import type { Country, MemoryPin, Question, HiddenGem, User, Badge } from '@/types';

export const countries: Country[] = [
  {
    id: '1',
    name: 'Japan',
    region: 'Asia',
    image: '/country-japan.jpg',
    description: 'Where ancient traditions meet futuristic innovation in perfect harmony.',
    culture: 'Deeply rooted in respect, craftsmanship, and seasonal appreciation.',
    vibe: 'Serene yet vibrant',
    costLevel: 'moderate',
    hiddenGems: ['Shirakawa-go villages', 'Tottori sand dunes', 'Koyasan temple stay'],
    purposes: ['solo', 'culture', 'calm'],
    rating: 4.9
  },
  {
    id: '2',
    name: 'Morocco',
    region: 'Africa',
    image: '/country-morocco.jpg',
    description: 'A sensory journey through colorful souks, ancient medinas, and Sahara dunes.',
    culture: 'Rich Berber-Arab heritage with warm hospitality.',
    vibe: 'Vibrant and mystical',
    costLevel: 'budget',
    hiddenGems: ['Chefchaouen blue city', 'Erg Chigaga dunes', 'Fes tanneries'],
    purposes: ['culture', 'adventure', 'solo'],
    rating: 4.7
  },
  {
    id: '3',
    name: 'Norway',
    region: 'Europe',
    image: '/country-norway.jpg',
    description: 'Dramatic fjords, northern lights, and the essence of Nordic tranquility.',
    culture: 'Friluftsliv - the philosophy of outdoor life.',
    vibe: 'Majestic and peaceful',
    costLevel: 'luxury',
    hiddenGems: ['Lofoten Islands', 'Trolltunga cliff', 'Svalbard wilderness'],
    purposes: ['adventure', 'calm', 'honeymoon'],
    rating: 4.8
  },
  {
    id: '4',
    name: 'Indonesia',
    region: 'Asia',
    image: '/country-indonesia.jpg',
    description: 'Thousands of islands offering spiritual awakening and natural wonders.',
    culture: 'Ancient Hindu-Buddhist temples mixed with Islamic traditions.',
    vibe: 'Spiritual and tropical',
    costLevel: 'budget',
    hiddenGems: ['Raja Ampat islands', 'Bromo volcano', 'Toraja highlands'],
    purposes: ['culture', 'adventure', 'solo'],
    rating: 4.6
  },
  {
    id: '5',
    name: 'Greece',
    region: 'Europe',
    image: '/country-greece.jpg',
    description: 'Birthplace of democracy, home to idyllic islands and Mediterranean charm.',
    culture: 'Philoxenia - the love of strangers, ancient mythology.',
    vibe: 'Romantic and historic',
    costLevel: 'moderate',
    hiddenGems: ['Meteora monasteries', 'Zagori villages', 'Milos island'],
    purposes: ['honeymoon', 'culture', 'calm'],
    rating: 4.8
  }
];

export const memoryPins: MemoryPin[] = [
  {
    id: '1',
    lat: 35.6762,
    lng: 139.6503,
    country: 'Japan',
    note: 'First cherry blossom season - cried under a tree in Ueno Park',
    emoji: '🌸',
    image: '/memories/japan.jpg',
    mood: 'culture',
    author: 'Sarah Chen',
    date: '2024-04-15',
    isPublic: true
  },
  {
    id: '2',
    lat: 31.6295,
    lng: -7.9811,
    country: 'Morocco',
    note: 'Lost in the medina for 3 hours, found the best mint tea of my life',
    emoji: '🍵',
    image: '/memories/morocco.jpg',
    mood: 'adventure',
    author: 'Marco Rossi',
    date: '2024-03-20',
    isPublic: true
  },
  {
    id: '3',
    lat: 62.1015,
    lng: 9.0781,
    country: 'Norway',
    note: 'Saw the northern lights dance for the first time. Pure magic.',
    emoji: '✨',
    image: '/memories/norway.jpg',
    mood: 'calm',
    author: 'Emma Wilson',
    date: '2024-02-10',
    isPublic: true
  },
  {
    id: '4',
    lat: -8.4095,
    lng: 115.1889,
    country: 'Indonesia',
    note: 'Sunrise at Borobudur - a spiritual awakening I will never forget',
    emoji: '🙏',
    image: '/memories/indonesia.jpg',
    mood: 'culture',
    author: 'David Park',
    date: '2024-01-25',
    isPublic: true
  },
  {
    id: '5',
    lat: 36.3932,
    lng: 25.4615,
    country: 'Greece',
    note: 'Proposed to my love in Santorini. She said yes!',
    emoji: '💍',
    image: '/memories/greece.jpg',
    mood: 'honeymoon',
    author: 'Alex Thompson',
    date: '2024-05-01',
    isPublic: true
  },
  {
    id: '6',
    lat: 64.1466,
    lng: -21.9426,
    country: 'Iceland',
    note: 'Solo road trip around the ring road. Found myself in the silence.',
    emoji: '🚗',
    image: '/memories/iceland.jpg',
    mood: 'solo',
    author: 'Lisa Anderson',
    date: '2024-06-12',
    isPublic: true
  }
];

export const questions: Question[] = [
  {
    id: '1',
    title: 'Best time to see cherry blossoms in Japan?',
    content: 'Planning a trip to Japan specifically for sakura season. When is the best time to visit Tokyo and Kyoto?',
    author: 'TravelNewbie',
    country: 'Japan',
    tags: ['season', 'culture', 'timing'],
    answers: [
      {
        id: 'a1',
        content: 'Late March to early April is peak season for Tokyo and Kyoto. Book accommodations early as it gets very crowded!',
        author: 'SakuraExpert',
        likes: 45,
        isHelpful: true,
        date: '2024-01-15'
      },
      {
        id: 'a2',
        content: 'I recommend visiting in late March. The blossoms in Ueno Park and along the Philosopher\'s Path in Kyoto are breathtaking.',
        author: 'JapanLover',
        likes: 32,
        isHelpful: false,
        date: '2024-01-16'
      }
    ],
    likes: 128,
    date: '2024-01-14'
  },
  {
    id: '2',
    title: 'Is Morocco safe for solo female travelers?',
    content: 'I\'m planning a solo trip to Morocco and would love to hear from women who have traveled there alone.',
    author: 'SoloWanderer',
    country: 'Morocco',
    tags: ['safety', 'solo', 'female-travel'],
    answers: [
      {
        id: 'a3',
        content: 'I traveled solo for 2 weeks and felt safe overall. Dress modestly, stay in riads in the medina, and trust your instincts.',
        author: 'AdventureAnna',
        likes: 67,
        isHelpful: true,
        date: '2024-02-01'
      }
    ],
    likes: 89,
    date: '2024-01-30'
  },
  {
    id: '3',
    title: 'Hidden gems in Norway that aren\'t touristy?',
    content: 'Want to experience the real Norway away from the crowds. Any local secrets?',
    author: 'OffPathTraveler',
    country: 'Norway',
    tags: ['hidden-gems', 'local', 'off-beat'],
    answers: [
      {
        id: 'a4',
        content: 'Try the Helgeland coast instead of Lofoten. Equally stunning but barely any tourists. Also, the island of Senja is incredible.',
        author: 'NordicNomad',
        likes: 54,
        isHelpful: true,
        date: '2024-03-05'
      }
    ],
    likes: 76,
    date: '2024-03-01'
  }
];

export const hiddenGems: HiddenGem[] = [
  {
    id: '1',
    name: 'Rio Celeste Waterfall',
    country: 'Costa Rica',
    image: '/hidden-gem-1.jpg',
    description: 'A magical turquoise waterfall hidden deep in the Tenorio Volcano National Park.',
    type: 'nature',
    fullDescription: 'Rio Celeste is one of Costa Rica\'s most breathtaking natural wonders. The river gets its striking sky-blue color from a chemical reaction between volcanic minerals and the water. Deep inside Tenorio Volcano National Park, the trail winds through lush rainforest before revealing the stunning 30-meter waterfall plunging into a turquoise pool.',
    images: ['/hidden-gem-1.jpg', '/mood-adventure.jpg', '/mood-solo.jpg'],
    bestTime: 'December – April (dry season)',
    tips: ['Start hiking early to avoid crowds', 'Bring waterproof shoes — the trail gets muddy', 'Swimming is not allowed in the pool to protect the ecosystem', 'Hire a local guide for the best experience'],
    rating: 4.9,
    visitors: '12K/year',
    coordinates: '10.7°N, 85.0°W'
  },
  {
    id: '2',
    name: 'Vardzia Cave City',
    country: 'Georgia',
    image: '/hidden-gem-2.jpg',
    description: 'An ancient cave monastery carved into a cliffside, with over 6000 chambers.',
    type: 'culture',
    fullDescription: 'Vardzia is a cave monastery site in southern Georgia, excavated from the slopes of the Erusheti Mountain on the left bank of the Kura River. The site was built in the 12th century under Queen Tamar and contains over 6,000 rooms spread across 13 levels, including churches, chapels, a throne room, and a pharmacy.',
    images: ['/hidden-gem-2.jpg', '/mood-honeymoon.jpg', '/mood-adventure.jpg'],
    bestTime: 'May – October',
    tips: ['Wear comfortable walking shoes for the steep paths', 'Visit on weekdays to avoid tour groups', 'The frescoes inside the main church are remarkably preserved', 'Combine with a visit to nearby Khertvisi Fortress'],
    rating: 4.7,
    visitors: '8K/year',
    coordinates: '41.4°N, 43.3°E'
  },
  {
    id: '3',
    name: 'Mosquito Bay',
    country: 'Puerto Rico',
    image: '/hidden-gem-3.jpg',
    description: 'The world\'s brightest bioluminescent bay — paddle through glowing waters.',
    type: 'adventure',
    fullDescription: 'Mosquito Bay on Vieques Island holds the Guinness World Record for the brightest bioluminescent bay on Earth. Millions of microscopic dinoflagellates light up the water with an electric blue glow when disturbed. Kayaking through the bay at night feels like paddling through liquid stars — an experience unlike anything else on the planet.',
    images: ['/hidden-gem-3.jpg', '/mood-solo.jpg', '/mood-honeymoon.jpg'],
    bestTime: 'Year-round (best on moonless nights)',
    tips: ['Book a guided kayak tour — no motorboats allowed', 'Go on a new moon night for maximum glow', 'Don\'t use sunscreen before entering — it harms the organisms', 'Arrive after 8 PM for the best bioluminescence'],
    rating: 4.8,
    visitors: '20K/year',
    coordinates: '18.1°N, 65.4°W'
  }
];

export const badges: Badge[] = [
  {
    id: '1',
    name: 'Globe Trotter',
    icon: '🌍',
    description: 'Visited 5+ countries',
    earned: true,
    earnedDate: '2024-03-15'
  },
  {
    id: '2',
    name: 'Memory Keeper',
    icon: '📸',
    description: 'Created 10+ memory pins',
    earned: true,
    earnedDate: '2024-04-20'
  },
  {
    id: '3',
    name: 'Hidden Gem Hunter',
    icon: '💎',
    description: 'Discovered 3+ hidden gems',
    earned: false
  },
  {
    id: '4',
    name: 'Culture Explorer',
    icon: '🏛️',
    description: 'Visited 3+ cultural sites',
    earned: true,
    earnedDate: '2024-05-01'
  },
  {
    id: '5',
    name: 'Solo Adventurer',
    icon: '🎒',
    description: 'Completed a solo trip',
    earned: true,
    earnedDate: '2024-02-10'
  },
  {
    id: '6',
    name: 'Community Guide',
    icon: '📚',
    description: 'Answered 10+ questions',
    earned: false
  }
];

export const currentUser: User = {
  id: '1',
  name: 'Alex Wanderer',
  avatar: '/avatars/avatar-default.jpg',
  countriesExplored: 12,
  memoryPins: 24,
  questionsAnswered: 8,
  contributionScore: 1560,
  badges: badges.filter(b => b.earned)
};

/* `color` is a Tailwind class pair, so these strings are compiled as if they were
   written in a component — they must stay inside the Aurora Ink palette even
   while no component reads the field. Teal leads; violet marks the solitary
   moods and rose the romantic one, matching the mood chips on the world map. */
export const moodOptions = [
  { id: 'solo', label: 'Solo Journey', icon: '🎒', description: 'Find yourself', color: 'bg-orchid/15 text-orchid' },
  { id: 'honeymoon', label: 'Romance', icon: '💕', description: 'Love & connection', color: 'bg-blush/15 text-blush' },
  { id: 'adventure', label: 'Adventure', icon: '⛰️', description: 'Thrill & explore', color: 'bg-aurora/15 text-aurora' },
  { id: 'culture', label: 'Culture', icon: '🏛️', description: 'Learn & immerse', color: 'bg-aurora/15 text-aurora' },
  { id: 'calm', label: 'Peace', icon: '🧘', description: 'Rest & recharge', color: 'bg-aurora/15 text-aurora' }
];
