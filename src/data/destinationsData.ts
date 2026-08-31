export interface DestinationItem {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  gallery?: string[];
  description: string;
  culture: string;
  vibe: string;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  elevation: string;
  bestSeason: string;
  category: 'mountain' | 'coastal' | 'spiritual' | 'adventure' | 'romantic' | 'cultural' | 'polar';
  purposes: string[];
  budgetUSD: number; // Base 7-day land cost per person in USD
  budgetTier: 'backpacker' | 'explorer' | 'luxury';
  highlights: string[];
  localDelicacy: string;
  flightBenchmarkUSD: {
    mumbai: number;
    delhi: number;
    newyork: number;
    london: number;
    dubai: number;
    tokyo: number;
    sydney: number;
    paris: number;
    singapore: number;
    toronto: number;
    default: number;
  };
}

export const DESTINATIONS: DestinationItem[] = [
  {
    id: 'salar-de-uyuni',
    name: 'Salar de Uyuni',
    country: 'Bolivia',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The world’s largest salt flat transforms into a colossal natural mirror during rainfall, completely erasing the horizon between Earth and cosmos.',
    culture: 'Indigenous Aymara and Quechua traditions intertwined with ancient Andean cosmology and artisanal salt harvesting.',
    vibe: 'Surreal, Infinite, Dreamlike Mirror',
    rating: 4.95,
    reviewCount: 342,
    coordinates: { lat: -20.1338, lng: -67.4891 }, // Exact Salar de Uyuni Salt Flat, Bolivia
    elevation: '3,656 m (11,995 ft)',
    bestSeason: 'Dec – Apr (Mirror Reflections) or May – Nov (Dry Stargazing)',
    category: 'adventure',
    purposes: ['adventure', 'solo', 'photography', 'nature'],
    budgetUSD: 850,
    budgetTier: 'explorer',
    highlights: ['Incahuasi Giant Cactus Island', 'Milky Way Midnight Stargazing', 'Historic Train Cemetery', 'Red & Green Flamingo Lagoons'],
    localDelicacy: 'Llama tenderloin steak & Quinoa soup',
    flightBenchmarkUSD: {
      mumbai: 1350, delhi: 1390, newyork: 780, london: 920, dubai: 1250, tokyo: 1480, sydney: 1650, paris: 950, singapore: 1550, toronto: 840, default: 1100,
    },
  },
  {
    id: 'raja-ampat',
    name: 'Raja Ampat Archipelago',
    country: 'Indonesia',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'An untouched maritime sanctuary known as the Amazon of the Oceans, sheltering over 75% of all known coral species on Earth.',
    culture: 'Papuan seafaring lineages, custom bird-of-paradise forest conservation rites, and traditional overwater stilt villages.',
    vibe: 'Pristine, Wild, Emerald Coral Lagoons',
    rating: 4.98,
    reviewCount: 210,
    coordinates: { lat: -0.2333, lng: 130.5167 }, // Pianemo & Wayag, Raja Ampat, Papua
    elevation: '15 m (Sea Level)',
    bestSeason: 'Oct – Apr (Calm Waters & Best Visibility)',
    category: 'coastal',
    purposes: ['adventure', 'romantic', 'wildlife', 'nature'],
    budgetUSD: 1450,
    budgetTier: 'luxury',
    highlights: ['Pianemo Limestone Peak Viewpoint', 'Manta Sandy Coral Cleaning Station', 'Red Bird of Paradise Forest Trail', 'Misool Blue Lagoon Caves'],
    localDelicacy: 'Papeda with Yellow Fish Broth & Sambal',
    flightBenchmarkUSD: {
      mumbai: 720, delhi: 750, newyork: 1400, london: 1150, dubai: 880, tokyo: 650, sydney: 790, paris: 1180, singapore: 420, toronto: 1450, default: 850,
    },
  },
  {
    id: 'lofoten-islands',
    name: 'Lofoten Islands',
    country: 'Norway',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Dramatic jagged granite peaks rising straight out of Arctic fjords, dotted with crimson rorbu fishermen cabins under the glowing Aurora.',
    culture: 'Nordic Viking lineage, 1,000-year-old Arctic cod drying traditions, and the open-air lifestyle of Friluftsliv.',
    vibe: 'Majestic, Arctic Twilight, Nordic Solitude',
    rating: 4.92,
    reviewCount: 428,
    coordinates: { lat: 67.9317, lng: 13.0877 }, // Reine & Hamnøy, Lofoten, Norway
    elevation: '448 m (Reinebringen)',
    bestSeason: 'Sep – Apr (Northern Lights) or Jun – Aug (Midnight Sun)',
    category: 'polar',
    purposes: ['adventure', 'calm', 'romantic', 'photography'],
    budgetUSD: 1650,
    budgetTier: 'luxury',
    highlights: ['Reinebringen Mountain Ridge Stairway', 'Henningsvær Iconic Ocean Football Pitch', 'Traditional Crimson Rorbu Stay', 'Kvalvika Secluded Arctic Beach'],
    localDelicacy: 'Arctic Cod (Skrei) & Cloudberry Cream Tart',
    flightBenchmarkUSD: {
      mumbai: 890, delhi: 920, newyork: 680, london: 280, dubai: 750, tokyo: 1150, sydney: 1550, paris: 320, singapore: 980, toronto: 740, default: 650,
    },
  },
  {
    id: 'cappadocia',
    name: 'Cappadocia Valley',
    country: 'Turkey',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A magical geological landscape of volcanic fairy chimneys, multi-level underground cities, and hundreds of hot air balloons at sunrise.',
    culture: 'Anatolian silk road crossroads, early Christian subterranean cave churches and terracotta pottery craft in Avanos.',
    vibe: 'Enchanting, Mystical, Golden Sunrise',
    rating: 4.91,
    reviewCount: 512,
    coordinates: { lat: 38.6431, lng: 34.8289 }, // Göreme & Love Valley, Cappadocia, Turkey
    elevation: '1,050 m (3,445 ft)',
    bestSeason: 'Apr – Jun & Sep – Nov',
    category: 'cultural',
    purposes: ['romantic', 'culture', 'photography', 'adventure'],
    budgetUSD: 720,
    budgetTier: 'explorer',
    highlights: ['Sunrise Hot Air Balloon Flight', 'Derinkuyu Underground Subterranean City', 'Love Valley Sunset Hike', 'Göreme Cave Monastery'],
    localDelicacy: 'Testi Kebab (Pottery beef slow-cooked in clay jar)',
    flightBenchmarkUSD: {
      mumbai: 480, delhi: 510, newyork: 720, london: 260, dubai: 340, tokyo: 850, sydney: 1250, paris: 240, singapore: 650, toronto: 780, default: 480,
    },
  },
  {
    id: 'banff-national-park',
    name: 'Banff & Lake Moraine',
    country: 'Canada',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Vivid turquoise glacial waters surrounded by the rugged Canadian Rocky Mountain peaks, cascading glaciers, and vast pine forests.',
    culture: 'Stoney Nakoda First Nations heritage, alpine mountaineering legacy, and legendary Canadian national park conservation.',
    vibe: 'Crisp, Alpine, Epic Wilderness',
    rating: 4.96,
    reviewCount: 680,
    coordinates: { lat: 51.3217, lng: -116.1860 }, // Lake Moraine & Valley of the Ten Peaks, Alberta, Canada
    elevation: '1,885 m (6,184 ft)',
    bestSeason: 'Jun – Sep (Canoeing & Hiking) or Dec – Mar (Winter Skiing)',
    category: 'mountain',
    purposes: ['adventure', 'nature', 'solo', 'photography'],
    budgetUSD: 1350,
    budgetTier: 'luxury',
    highlights: ['Sunrise Canoe on Lake Moraine', 'Icefields Parkway Glacier Drive', 'Banff Upper Mineral Hot Springs', 'Plain of Six Glaciers Alpine Teahouse'],
    localDelicacy: 'Alberta Bison Tenderloin & Maple Bannock',
    flightBenchmarkUSD: {
      mumbai: 1100, delhi: 1150, newyork: 340, london: 620, dubai: 980, tokyo: 890, sydney: 1200, paris: 650, singapore: 1180, toronto: 240, default: 680,
    },
  },
  {
    id: 'machu-picchu',
    name: 'Machu Picchu & Sacred Valley',
    country: 'Peru',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The lost citadel of the Incas perched mysteriously among misty cloud-forest peaks high above the roaring Urubamba River.',
    culture: 'Ancient Quechua masonry, Inti sun worship, textile weaving traditions, and Sacred Valley agricultural terracing.',
    vibe: 'Mystical, Colossal, Cloud-Forest Wonder',
    rating: 4.97,
    reviewCount: 920,
    coordinates: { lat: -13.1631, lng: -72.5450 }, // Historic Sanctuary of Machu Picchu, Cusco, Peru
    elevation: '2,430 m (7,972 ft)',
    bestSeason: 'May – Oct (Dry Winter Season with Clear Skies)',
    category: 'cultural',
    purposes: ['adventure', 'culture', 'history', 'photography'],
    budgetUSD: 1100,
    budgetTier: 'explorer',
    highlights: ['Classic Sun Gate (Inti Punku) Sunrise', 'Huayna Picchu Summit Climb', 'Ollantaytambo Incan Terraces', 'Moray Concentric Agricultural Rings'],
    localDelicacy: 'Lomo Saltado & Purple Corn Chicha Morada',
    flightBenchmarkUSD: {
      mumbai: 1300, delhi: 1350, newyork: 680, london: 880, dubai: 1200, tokyo: 1450, sydney: 1550, paris: 920, singapore: 1480, toronto: 750, default: 980,
    },
  },
  {
    id: 'kyoto-shirakawago',
    name: 'Shirakawa-gō & Kyoto',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Thatch-roofed Gassho-style farmhouses tucked inside misty snow peaks, blending seamlessly into the thousand-year bamboo temples of Kyoto.',
    culture: 'Wabi-sabi aesthetics, Zen Buddhist meditation, and multi-century timber carpentry crafted without nails.',
    vibe: 'Timeless, Peaceful, Zen Harmony',
    rating: 4.94,
    reviewCount: 780,
    coordinates: { lat: 36.2562, lng: 136.9066 }, // Shirakawa-gō Village, Gifu, Japan
    elevation: '510 m (Mountain Basin)',
    bestSeason: 'Mar – May (Cherry Blossom) or Dec – Feb (Winter Illumination)',
    category: 'cultural',
    purposes: ['culture', 'calm', 'solo', 'romantic'],
    budgetUSD: 1100,
    budgetTier: 'explorer',
    highlights: ['Ogimachi Historic Village Walk', 'Arashiyama Bamboo Grove Walkway', 'Fushimi Inari 10,000 Torii Shrines', 'Koyasan Temple Stay with Monks'],
    localDelicacy: 'Hida Beef grilled over Magnolia leaf (Hoba Miso)',
    flightBenchmarkUSD: {
      mumbai: 580, delhi: 600, newyork: 980, london: 820, dubai: 650, tokyo: 80, sydney: 720, paris: 850, singapore: 360, toronto: 1050, default: 650,
    },
  },
  {
    id: 'patagonia-torres',
    name: 'Torres del Paine',
    country: 'Chile',
    region: 'Americas',
    image: 'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Monumental granite horns piercing the southern sky above roaring glacier waterfalls, turquoise lakes, and untamed Patagonian steppes.',
    culture: 'Gaucho cowboy horse traditions, indigenous Tehuelche heritage, and extreme southern wilderness resilience.',
    vibe: 'Epic, Raw, Wind-swept Majesty',
    rating: 4.96,
    reviewCount: 460,
    coordinates: { lat: -51.2532, lng: -72.8814 }, // Torres del Paine National Park, Magallanes, Chile
    elevation: '2,884 m (Cuernos Peaks)',
    bestSeason: 'Nov – Mar (Austral Summer with 17 Hours of Daylight)',
    category: 'mountain',
    purposes: ['adventure', 'nature', 'solo', 'photography'],
    budgetUSD: 1400,
    budgetTier: 'luxury',
    highlights: ['The Iconic W-Trek Circuit', 'Grey Glacier Ice Trekking', 'French Valley Panoramic Lookout', 'Lake Pehoe Sunset Reflection'],
    localDelicacy: 'Cordero al Palo (Patagonian spit-roasted lamb) & Calafate Sour',
    flightBenchmarkUSD: {
      mumbai: 1450, delhi: 1480, newyork: 920, london: 980, dubai: 1350, tokyo: 1600, sydney: 1400, paris: 1020, singapore: 1650, toronto: 980, default: 1200,
    },
  },
  {
    id: 'santorini-oia',
    name: 'Santorini & Oia Caldera',
    country: 'Greece',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Whitewashed cliffside cubist villages and cobalt-blue domes perched 300 meters above a submerged Aegean volcanic caldera.',
    culture: 'Minoan bronze-age Akrotiri civilization, volcanic Assyrtiko viticulture, and cycladic maritime architecture.',
    vibe: 'Sun-drenched, Romantic, Aegean Blue',
    rating: 4.93,
    reviewCount: 1120,
    coordinates: { lat: 36.4618, lng: 25.3753 }, // Oia Village & Caldera, Santorini, Greece
    elevation: '300 m (Caldera Rim)',
    bestSeason: 'Apr – Jun & Sep – Oct (Pleasant Sun, Fewer Crowds)',
    category: 'romantic',
    purposes: ['romantic', 'coastal', 'photography', 'food'],
    budgetUSD: 1480,
    budgetTier: 'luxury',
    highlights: ['Oia Castle Legendary Sunset', 'Fira to Oia Cliffside Hike', 'Akrotiri Prehistoric Ruins', 'Volcanic Red & Black Sand Beaches'],
    localDelicacy: 'Tomatokeftedes (Crispy tomato fritters) & Assyrtiko White Wine',
    flightBenchmarkUSD: {
      mumbai: 540, delhi: 570, newyork: 650, london: 160, dubai: 380, tokyo: 850, sydney: 1180, paris: 140, singapore: 680, toronto: 710, default: 420,
    },
  },
  {
    id: 'ladakh-pangong',
    name: 'Leh & Pangong Tso',
    country: 'India',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'High-altitude cold desert plateau featuring color-changing azure salt lakes, ancient Buddhist gompas, and moonland mountain passes.',
    culture: 'Tibetan-Ladakhi Buddhist monastic traditions, prayer-flag spiritual passes, and warm Ladakhi mountain hospitality.',
    vibe: 'High-Altitude Nirvana, Rugged, Serene',
    rating: 4.93,
    reviewCount: 640,
    coordinates: { lat: 33.7595, lng: 78.6674 }, // Pangong Tso Salt Lake, Ladakh, India
    elevation: '4,250 m (13,940 ft)',
    bestSeason: 'May – Sep (Warm High Passes & Blue Lakes)',
    category: 'mountain',
    purposes: ['adventure', 'spiritual', 'solo', 'culture'],
    budgetUSD: 520,
    budgetTier: 'backpacker',
    highlights: ['Khardung La & Chang La High Passes', 'Thiksey & Hemis Monasteries', 'Nubra Valley Hunder Sand Dunes', 'Milky Way Stargazing at Pangong Tso'],
    localDelicacy: 'Steaming Tibetan Momos, Thukpa & Warm Butter Tea',
    flightBenchmarkUSD: {
      mumbai: 110, delhi: 80, newyork: 890, london: 650, dubai: 320, tokyo: 740, sydney: 980, paris: 680, singapore: 410, toronto: 920, default: 250,
    },
  },
  {
    id: 'petra-wadi-rum',
    name: 'Petra & Wadi Rum',
    country: 'Jordan',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1579606032834-deffd42a3e0b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1579606032834-deffd42a3e0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Rose-red Nabataean canyon temples carved into sheer sandstone cliffs, opening onto the vast crimson Martian deserts of Wadi Rum.',
    culture: 'Bedouin campfire storytelling, nomadic tea traditions, and ancient Incense and Spice trading route heritage.',
    vibe: 'Mysterious, Golden Desert, Ancient Wonder',
    rating: 4.96,
    reviewCount: 580,
    coordinates: { lat: 30.3222, lng: 35.4517 }, // Al-Khazneh (Treasury), Petra, Jordan
    elevation: '810 m (Siq Canyons)',
    bestSeason: 'Mar – May & Sep – Nov',
    category: 'cultural',
    purposes: ['culture', 'adventure', 'photography'],
    budgetUSD: 820,
    budgetTier: 'explorer',
    highlights: ['Al-Khazneh Treasury Narrow Siq Walk', 'Bedouin Stargazing Bubble Camp', 'The Monastery (Ad Deir) Mountain Hike', 'Burdah Rock Bridge Desert 4x4 Tour'],
    localDelicacy: 'Mansaf (Tender lamb cooked in dried yogurt sauce with pine nuts)',
    flightBenchmarkUSD: {
      mumbai: 410, delhi: 430, newyork: 780, london: 340, dubai: 220, tokyo: 890, sydney: 1350, paris: 380, singapore: 620, toronto: 820, default: 450,
    },
  },
  {
    id: 'hallstatt-austria',
    name: 'Hallstatt & Dachstein',
    country: 'Austria',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'A fairytale lakeside alpine village mirrored on crystal waters, framed by 7,000-year-old historic salt mines and towering Dachstein glaciers.',
    culture: 'Salzkammergut salt harvesting heritage, baroque Austrian church bells, and alpine woodcraft.',
    vibe: 'Romantic, Storybook, Pure Reflection',
    rating: 4.91,
    reviewCount: 490,
    coordinates: { lat: 47.5622, lng: 13.6493 }, // Lake Hallstatt Village, Salzkammergut, Austria
    elevation: '511 m (Lakeside)',
    bestSeason: 'May – Oct (Lakeside Wandering) or Dec – Feb (Snow Globe)',
    category: 'romantic',
    purposes: ['romantic', 'calm', 'photography', 'culture'],
    budgetUSD: 1150,
    budgetTier: 'luxury',
    highlights: ['Classic Postcard Viewpoint', 'Dachstein Giant Ice Caves', 'Skywalk World Heritage View', 'Lake Hallstatt Morning Rowboat'],
    localDelicacy: 'Fresh Lake Trout (Reinanke) & Warm Apple Strudel',
    flightBenchmarkUSD: {
      mumbai: 610, delhi: 630, newyork: 620, london: 110, dubai: 420, tokyo: 860, sydney: 1220, paris: 90, singapore: 740, toronto: 680, default: 450,
    },
  },
  {
    id: 'milford-sound',
    name: 'Milford Sound & Fiordland',
    country: 'New Zealand',
    region: 'Oceania',
    image: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Described by Rudyard Kipling as the Eighth Wonder of the World: vertical glacier cliffs dripping with a thousand waterfalls into dark mirror waters.',
    culture: 'Māori Piopiotahi creation legends, seal colony protection, and pristine conservation ethics.',
    vibe: 'Primeval, Thundering, Monumental',
    rating: 4.97,
    reviewCount: 520,
    coordinates: { lat: -44.6715, lng: 167.9256 }, // Mitre Peak & Fjord, Milford Sound, New Zealand
    elevation: '1,692 m (Mitre Peak)',
    bestSeason: 'Nov – Apr (Warm Days & Cascading Falls)',
    category: 'adventure',
    purposes: ['adventure', 'nature', 'photography', 'solo'],
    budgetUSD: 1400,
    budgetTier: 'luxury',
    highlights: ['Mitre Peak Fjord Cruise', 'Stirling Falls Glacial Spray', 'Milford Track Multi-Day Alpine Hike', 'Te Anau Glowworm Caves'],
    localDelicacy: 'Fiordland Wild Venison & Pavlova with Kiwi fruit',
    flightBenchmarkUSD: {
      mumbai: 980, delhi: 1010, newyork: 1200, london: 1100, dubai: 1050, tokyo: 820, sydney: 280, paris: 1150, singapore: 580, toronto: 1250, default: 800,
    },
  },
  {
    id: 'fuji-hakone',
    name: 'Mount Fuji & Five Lakes',
    country: 'Japan',
    region: 'Asia',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'The sacred symmetrical volcanic cone towering over serene alpine lakes, steaming hot spring onsens, and cedar-lined forest paths.',
    culture: 'Shinto worship of mountain spirits (Kami), Hokusai 36 Views of Fuji woodblock heritage, and traditional ryokan onsen healing.',
    vibe: 'Sacred, Iconic, Majestic Stillness',
    rating: 4.93,
    reviewCount: 710,
    coordinates: { lat: 35.3606, lng: 138.7274 }, // Mount Fuji Summit & Lake Kawaguchiko, Japan
    elevation: '3,776 m (12,389 ft)',
    bestSeason: 'Jul – Sep (Summit Climb) or Nov – Feb (Crystal Winter Peak Views)',
    category: 'mountain',
    purposes: ['spiritual', 'nature', 'culture', 'photography'],
    budgetUSD: 950,
    budgetTier: 'explorer',
    highlights: ['Chureito Pagoda Cherry Blossom Frame', 'Lake Kawaguchiko Onsen Ryokan Stay', 'Arakurayama Sengen Park', 'Fuji 5th Station Sunrise'],
    localDelicacy: 'Houtou Noodles (Thick flat noodles simmered in pumpkin miso broth)',
    flightBenchmarkUSD: {
      mumbai: 560, delhi: 580, newyork: 960, london: 810, dubai: 620, tokyo: 40, sydney: 690, paris: 830, singapore: 340, toronto: 1020, default: 600,
    },
  },
  {
    id: 'amalfi-coast',
    name: 'Amalfi & Positano',
    country: 'Italy',
    region: 'Europe',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'Pastel cliffside villas cascading down to the shimmering Tyrrhenian Sea, perfumed by blooming lemon terraces and coastal breezes.',
    culture: 'Southern Italian Dolce Vita, hand-painted Vietri ceramics, and historic maritime republic heritage.',
    vibe: 'Romantic, Sun-kissed, Coastal Elegance',
    rating: 4.88,
    reviewCount: 820,
    coordinates: { lat: 40.6281, lng: 14.4850 }, // Positano Cliffside Village, Amalfi Coast, Italy
    elevation: '80 m (Cliffside Terraces)',
    bestSeason: 'Apr – Jun & Sep – Oct',
    category: 'romantic',
    purposes: ['romantic', 'culture', 'coastal', 'food'],
    budgetUSD: 1550,
    budgetTier: 'luxury',
    highlights: ['Path of the Gods (Sentiero degli Dei)', 'Ravello Villa Rufolo Gardens', 'Private Boat to Capri Blue Grotto', 'Limoncello Tastings in Cliff Groves'],
    localDelicacy: 'Scialatielli ai Frutti di Mare & Delizia al Limone',
    flightBenchmarkUSD: {
      mumbai: 580, delhi: 610, newyork: 620, london: 140, dubai: 410, tokyo: 850, sydney: 1150, paris: 110, singapore: 720, toronto: 690, default: 420,
    },
  },
  {
    id: 'socotra-island',
    name: 'Socotra Island',
    country: 'Yemen',
    region: 'Middle East',
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    ],
    description: 'An isolated archipelago in the Arabian Sea famous for umbrella-like Dragon Blood Trees, white sand lagoons, and alien landscapes.',
    culture: 'Ancient Soqotri language (an unwritten Semitic tongue) and sustainable pastoralist biodiversity stewardship.',
    vibe: 'Extraterrestrial, Ancient, Raw Botanical Miracle',
    rating: 4.97,
    reviewCount: 94,
    coordinates: { lat: 12.5035, lng: 53.9213 }, // Dixam Dragon Blood Plateau, Socotra Island, Yemen
    elevation: '1,500 m (Hajhir Peaks)',
    bestSeason: 'Oct – Apr (Mild Breeze & Clear Skies)',
    category: 'adventure',
    purposes: ['adventure', 'nature', 'photography'],
    budgetUSD: 1800,
    budgetTier: 'luxury',
    highlights: ['Dixam Dragon Blood Tree Plateau', 'Detwah Lagoon White Sands', 'Hoq Cave Stalactite Caverns', 'Arher Sand Dunes by the Sea'],
    localDelicacy: 'Fresh Red Snapper with Socotri Wild Spices',
    flightBenchmarkUSD: {
      mumbai: 650, delhi: 680, newyork: 1300, london: 950, dubai: 450, tokyo: 1200, sydney: 1600, paris: 980, singapore: 880, toronto: 1350, default: 750,
    },
  },
];
