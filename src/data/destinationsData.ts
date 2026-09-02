export interface DestinationReview {
  id: string;
  author: string;
  avatar?: string;
  country?: string;
  rating: number;
  date: string;
  headline?: string;
  comment: string;
  travelerType?: string;
}

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
  reviews?: DestinationReview[];
}

export const DESTINATIONS: DestinationItem[] = [
  {
    "id": "salar-de-uyuni",
    "name": "Salar de Uyuni",
    "country": "Bolivia",
    "region": "Americas",
    "image": "/images/destinations/salar-de-uyuni-mirror.jpg",
    "gallery": [
      "/images/destinations/salar-de-uyuni-mirror.jpg",
      "/images/destinations/salar-de-uyuni-clouds.jpg",
      "/images/destinations/salar-de-uyuni-sunset.jpg",
      "/images/destinations/salar-de-uyuni-hexagons.jpg"
    ],
    "description": "The world’s largest salt flat transforms into a colossal natural mirror during rainfall, completely erasing the horizon between Earth and cosmos.",
    "culture": "Aymara and Quechua traditions honoring Pachamama (Mother Earth), ancestral salt miners, and ancient Andean stargazers.",
    "vibe": "Surreal, Infinite, Celestial Reflection",
    "rating": 4.95,
    "reviewCount": 384,
    "coordinates": {
      "lat": -20.1338,
      "lng": -67.4891
    },
    "elevation": "3,656 m (11,995 ft)",
    "bestSeason": "Jan – Apr (Water Mirror Effect) or May – Nov (Dry Hexagonal Crust)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 850,
    "budgetTier": "explorer",
    "highlights": [
      "Incahuasi Giant Cactus Island",
      "Milky Way Midnight Stargazing",
      "Historic Train Cemetery",
      "Red & Green Flamingo Lagoons"
    ],
    "localDelicacy": "Llama tenderloin steak & Quinoa soup",
    "flightBenchmarkUSD": {
      "mumbai": 1350,
      "delhi": 1390,
      "newyork": 780,
      "london": 920,
      "dubai": 1250,
      "tokyo": 1480,
      "sydney": 1650,
      "paris": 950,
      "singapore": 1550,
      "toronto": 840,
      "default": 1100
    },
    "reviews": [
      {
        "id": "rev-uyuni-1",
        "author": "Dr. Mateo Silva",
        "rating": 5,
        "date": "2026-02-18",
        "travelerType": "Photographer",
        "comment": "Driving across the flooded flats under a sky of stars felt like floating in deep space. There is literally nothing on earth that compares to this mirror."
      },
      {
        "id": "rev-uyuni-2",
        "author": "Clara Dupont",
        "rating": 5,
        "date": "2026-01-12",
        "travelerType": "Adventure Seeker",
        "comment": "The altitude is real, so acclimatize in La Paz first. But once you stand on Incahuasi Island looking over an endless white sea, it leaves you speechless."
      },
      {
        "id": "rev-uyuni-3",
        "author": "Rohan Mehra",
        "rating": 5,
        "date": "2025-11-20",
        "travelerType": "Solo Explorer",
        "comment": "The 3-day 4x4 expedition from Uyuni down through the Eduardo Avaroa reserve was the greatest overland journey of my life."
      }
    ]
  },
  {
    "id": "raja-ampat",
    "name": "Raja Ampat Archipelago",
    "country": "Indonesia",
    "region": "Asia",
    "image": "/images/destinations/raja-ampat-pianemo.jpg",
    "gallery": [
      "/images/destinations/raja-ampat-pianemo.jpg"
    ],
    "description": "An untouched maritime sanctuary known as the Amazon of the Oceans, sheltering over 75% of all known coral species on Earth.",
    "culture": "Papuan seafaring lineages, custom bird-of-paradise forest conservation rites, and traditional overwater stilt villages.",
    "vibe": "Pristine, Wild, Emerald Coral Lagoons",
    "rating": 4.98,
    "reviewCount": 210,
    "coordinates": {
      "lat": -0.5639,
      "lng": 130.2706
    },
    "elevation": "15 m (Sea Level)",
    "bestSeason": "Oct – Apr (Calm Waters & Best Visibility)",
    "category": "coastal",
    "purposes": [
      "adventure",
      "romantic",
      "wildlife",
      "nature"
    ],
    "budgetUSD": 1450,
    "budgetTier": "luxury",
    "highlights": [
      "Pianemo Limestone Peak Viewpoint",
      "Manta Sandy Coral Cleaning Station",
      "Red Bird of Paradise Forest Trail",
      "Misool Blue Lagoon Caves"
    ],
    "localDelicacy": "Papeda with Yellow Fish Broth & Sambal",
    "flightBenchmarkUSD": {
      "mumbai": 720,
      "delhi": 750,
      "newyork": 1400,
      "london": 1150,
      "dubai": 880,
      "tokyo": 650,
      "sydney": 790,
      "paris": 1180,
      "singapore": 420,
      "toronto": 1450,
      "default": 850
    },
    "reviews": [
      {
        "id": "rev-raja-1",
        "author": "Aria Thorne",
        "rating": 5,
        "date": "2026-02-04",
        "travelerType": "Marine Biologist",
        "comment": "I have logged over 800 dives across the globe, and Raja Ampat is the crown jewel. Swimming with oceanic mantas in crystal water is life-changing."
      },
      {
        "id": "rev-raja-2",
        "author": "Dewi Lestari",
        "rating": 5,
        "date": "2025-12-19",
        "travelerType": "Couple",
        "comment": "The view from Pianemo peak looking out at the turquoise mushroom karst islands took our breath away."
      }
    ]
  },
  {
    "id": "lofoten-islands",
    "name": "Lofoten Islands",
    "country": "Norway",
    "region": "Europe",
    "image": "/images/destinations/lofoten-hamnoy.jpg",
    "gallery": [
      "/images/destinations/lofoten-hamnoy.jpg"
    ],
    "description": "Dramatic jagged granite peaks rising straight out of Arctic fjords, dotted with crimson rorbu fishermen cabins under the glowing Aurora.",
    "culture": "Nordic Viking lineage, 1,000-year-old Arctic cod drying traditions, and the open-air lifestyle of Friluftsliv.",
    "vibe": "Majestic, Arctic Twilight, Nordic Solitude",
    "rating": 4.92,
    "reviewCount": 428,
    "coordinates": {
      "lat": 67.9317,
      "lng": 13.0877
    },
    "elevation": "448 m (Reinebringen)",
    "bestSeason": "Sep – Apr (Northern Lights) or Jun – Aug (Midnight Sun)",
    "category": "polar",
    "purposes": [
      "adventure",
      "calm",
      "romantic",
      "photography"
    ],
    "budgetUSD": 1650,
    "budgetTier": "luxury",
    "highlights": [
      "Reinebringen Mountain Ridge Stairway",
      "Henningsvær Iconic Ocean Football Pitch",
      "Traditional Crimson Rorbu Stay",
      "Kvalvika Secluded Arctic Beach"
    ],
    "localDelicacy": "Arctic Cod (Skrei) & Cloudberry Cream Tart",
    "flightBenchmarkUSD": {
      "mumbai": 890,
      "delhi": 920,
      "newyork": 680,
      "london": 280,
      "dubai": 750,
      "tokyo": 1150,
      "sydney": 1550,
      "paris": 320,
      "singapore": 980,
      "toronto": 740,
      "default": 650
    },
    "reviews": [
      {
        "id": "rev-lofoten-1",
        "author": "Lars Nygård",
        "rating": 5,
        "date": "2026-01-25",
        "travelerType": "Aurora Chaser",
        "comment": "Watching emerald curtains of Northern Lights ripple above the Reine fjord from our rorbu porch was pure magic."
      },
      {
        "id": "rev-lofoten-2",
        "author": "Siddharth V.",
        "rating": 5,
        "date": "2025-10-14",
        "travelerType": "Hiker",
        "comment": "The Reinebringen Sherpa stone staircase is steep, but the panoramic fjord summit view is worth every single step."
      }
    ]
  },
  {
    "id": "cappadocia",
    "name": "Cappadocia Valley",
    "country": "Turkey",
    "region": "Middle East",
    "image": "/images/destinations/cappadocia-balloons.jpg",
    "gallery": [
      "/images/destinations/cappadocia-balloons.jpg"
    ],
    "description": "A magical geological landscape of volcanic fairy chimneys, multi-level underground cities, and hundreds of hot air balloons at sunrise.",
    "culture": "Anatolian silk road crossroads, early Christian subterranean cave churches and terracotta pottery craft in Avanos.",
    "vibe": "Enchanting, Mystical, Golden Sunrise",
    "rating": 4.91,
    "reviewCount": 512,
    "coordinates": {
      "lat": 38.6431,
      "lng": 34.8289
    },
    "elevation": "1,050 m (3,445 ft)",
    "bestSeason": "Apr – Jun & Sep – Nov",
    "category": "cultural",
    "purposes": [
      "romantic",
      "culture",
      "photography",
      "adventure"
    ],
    "budgetUSD": 720,
    "budgetTier": "explorer",
    "highlights": [
      "Sunrise Hot Air Balloon Flight",
      "Derinkuyu Underground Subterranean City",
      "Love Valley Sunset Hike",
      "Göreme Cave Monastery"
    ],
    "localDelicacy": "Testi Kebab (Pottery beef slow-cooked in clay jar)",
    "flightBenchmarkUSD": {
      "mumbai": 480,
      "delhi": 510,
      "newyork": 720,
      "london": 260,
      "dubai": 340,
      "tokyo": 850,
      "sydney": 1250,
      "paris": 240,
      "singapore": 650,
      "toronto": 780,
      "default": 480
    },
    "reviews": [
      {
        "id": "rev-cap-1",
        "author": "Fatima Al-Sayed",
        "rating": 5,
        "date": "2026-02-10",
        "travelerType": "Couple",
        "comment": "Floating at 3,000 feet as the sun crested the rose valleys with 100 balloons around us felt straight out of a dream."
      },
      {
        "id": "rev-cap-2",
        "author": "Julian Vance",
        "rating": 5,
        "date": "2025-09-28",
        "travelerType": "History Buff",
        "comment": "Derinkuyu underground city is unbelievable engineering. 8 levels deep carved into soft volcanic tufa."
      }
    ]
  },
  {
    "id": "banff-national-park",
    "name": "Banff & Lake Moraine",
    "country": "Canada",
    "region": "Americas",
    "image": "/images/destinations/banff-moraine-lake.jpg",
    "gallery": [
      "/images/destinations/banff-moraine-lake.jpg"
    ],
    "description": "Vivid turquoise glacial waters surrounded by the rugged Canadian Rocky Mountain peaks, cascading glaciers, and vast pine forests.",
    "culture": "Stoney Nakoda First Nations heritage, alpine mountaineering legacy, and legendary Canadian national park conservation.",
    "vibe": "Crisp, Alpine, Epic Wilderness",
    "rating": 4.96,
    "reviewCount": 680,
    "coordinates": {
      "lat": 51.3217,
      "lng": -116.186
    },
    "elevation": "1,885 m (6,184 ft)",
    "bestSeason": "Jun – Sep (Canoeing & Hiking) or Dec – Mar (Winter Skiing)",
    "category": "mountain",
    "purposes": [
      "adventure",
      "nature",
      "solo",
      "photography"
    ],
    "budgetUSD": 1350,
    "budgetTier": "luxury",
    "highlights": [
      "Sunrise Canoe on Lake Moraine",
      "Icefields Parkway Glacier Drive",
      "Banff Upper Mineral Hot Springs",
      "Plain of Six Glaciers Alpine Teahouse"
    ],
    "localDelicacy": "Alberta Bison Tenderloin & Maple Bannock",
    "flightBenchmarkUSD": {
      "mumbai": 1100,
      "delhi": 1150,
      "newyork": 340,
      "london": 620,
      "dubai": 980,
      "tokyo": 890,
      "sydney": 1200,
      "paris": 650,
      "singapore": 1180,
      "toronto": 240,
      "default": 680
    },
    "reviews": [
      {
        "id": "rev-banff-1",
        "author": "Liam Fraser",
        "rating": 5,
        "date": "2025-08-15",
        "travelerType": "Photographer",
        "comment": "The electric blue color of Moraine Lake at 6 AM with the Ten Peaks reflected in stillness is unmatched anywhere in North America."
      },
      {
        "id": "rev-banff-2",
        "author": "Kavita Rao",
        "rating": 5,
        "date": "2025-07-22",
        "travelerType": "Family Explorer",
        "comment": "Driving along the Icefields Parkway was stunning. We spotted grizzly bears, elk, and walked onto Athabasca Glacier."
      }
    ]
  },
  {
    "id": "machu-picchu",
    "name": "Machu Picchu & Sacred Valley",
    "country": "Peru",
    "region": "Americas",
    "image": "/images/destinations/machu-picchu-citadel.jpg",
    "gallery": [
      "/images/destinations/machu-picchu-citadel.jpg"
    ],
    "description": "The lost citadel of the Incas perched mysteriously among misty cloud-forest peaks high above the roaring Urubamba River.",
    "culture": "Ancient Quechua masonry, Inti sun worship, textile weaving traditions, and Sacred Valley agricultural terracing.",
    "vibe": "Mystical, Colossal, Cloud-Forest Wonder",
    "rating": 4.97,
    "reviewCount": 920,
    "coordinates": {
      "lat": -13.1631,
      "lng": -72.545
    },
    "elevation": "2,430 m (7,972 ft)",
    "bestSeason": "May – Oct (Dry Winter Season with Clear Skies)",
    "category": "cultural",
    "purposes": [
      "adventure",
      "culture",
      "history",
      "photography"
    ],
    "budgetUSD": 1100,
    "budgetTier": "explorer",
    "highlights": [
      "Classic Sun Gate (Inti Punku) Sunrise",
      "Huayna Picchu Summit Climb",
      "Ollantaytambo Incan Terraces",
      "Moray Concentric Agricultural Rings"
    ],
    "localDelicacy": "Lomo Saltado & Purple Corn Chicha Morada",
    "flightBenchmarkUSD": {
      "mumbai": 1300,
      "delhi": 1350,
      "newyork": 680,
      "london": 880,
      "dubai": 1200,
      "tokyo": 1450,
      "sydney": 1550,
      "paris": 920,
      "singapore": 1480,
      "toronto": 750,
      "default": 980
    },
    "reviews": [
      {
        "id": "rev-mp-1",
        "author": "Gabriel Fernandez",
        "rating": 5,
        "date": "2026-01-05",
        "travelerType": "Trekker",
        "comment": "Reaching the Sun Gate after 4 days on the Inca Trail and watching the morning mist clear over the ancient stone ruins brought tears to my eyes."
      },
      {
        "id": "rev-mp-2",
        "author": "Ananya Sen",
        "rating": 5,
        "date": "2025-09-14",
        "travelerType": "Cultural Enthusiast",
        "comment": "The precision of the mortarless Incan stonework is mind-boggling. Be sure to book the Huayna Picchu climb in advance!"
      }
    ]
  },
  {
    "id": "kyoto-shirakawago",
    "name": "Shirakawa-gō & Kyoto",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/shirakawago-village.jpg",
    "gallery": [
      "/images/destinations/shirakawago-village.jpg"
    ],
    "description": "Thatch-roofed Gassho-style farmhouses tucked inside misty snow peaks, blending seamlessly into the thousand-year bamboo temples of Kyoto.",
    "culture": "Wabi-sabi aesthetics, Zen Buddhist meditation, and multi-century timber carpentry crafted without nails.",
    "vibe": "Timeless, Peaceful, Zen Harmony",
    "rating": 4.94,
    "reviewCount": 780,
    "coordinates": {
      "lat": 36.2562,
      "lng": 136.9066
    },
    "elevation": "510 m (Mountain Basin)",
    "bestSeason": "Mar – May (Cherry Blossom) or Dec – Feb (Winter Illumination)",
    "category": "cultural",
    "purposes": [
      "culture",
      "calm",
      "solo",
      "romantic"
    ],
    "budgetUSD": 1100,
    "budgetTier": "explorer",
    "highlights": [
      "Ogimachi Historic Village Walk",
      "Arashiyama Bamboo Grove Walkway",
      "Fushimi Inari 10,000 Torii Shrines",
      "Koyasan Temple Stay with Monks"
    ],
    "localDelicacy": "Hida Beef grilled over Magnolia leaf (Hoba Miso)",
    "flightBenchmarkUSD": {
      "mumbai": 580,
      "delhi": 600,
      "newyork": 980,
      "london": 820,
      "dubai": 650,
      "tokyo": 80,
      "sydney": 720,
      "paris": 850,
      "singapore": 360,
      "toronto": 1050,
      "default": 650
    },
    "reviews": [
      {
        "id": "rev-skw-1",
        "author": "Kenji Takahashi",
        "rating": 5,
        "date": "2026-02-02",
        "travelerType": "Solo Seeker",
        "comment": "Staying overnight in a 300-year-old thatched minshuku while heavy snow fell silently outside was the most peaceful night of my life."
      },
      {
        "id": "rev-skw-2",
        "author": "Sophie Laurent",
        "rating": 5,
        "date": "2025-11-18",
        "travelerType": "Couple",
        "comment": "The contrast between Kyoto’s autumn maple gardens and Shirakawa-go’s alpine valley is breathtaking."
      }
    ]
  },
  {
    "id": "patagonia-torres",
    "name": "Torres del Paine",
    "country": "Chile",
    "region": "Americas",
    "image": "/images/destinations/torres-del-paine.jpg",
    "gallery": [
      "/images/destinations/torres-del-paine.jpg"
    ],
    "description": "Monumental granite horns piercing the southern sky above roaring glacier waterfalls, turquoise lakes, and untamed Patagonian steppes.",
    "culture": "Gaucho cowboy horse traditions, indigenous Tehuelche heritage, and extreme southern wilderness resilience.",
    "vibe": "Epic, Raw, Wind-swept Majesty",
    "rating": 4.96,
    "reviewCount": 460,
    "coordinates": {
      "lat": -51.2532,
      "lng": -72.8814
    },
    "elevation": "2,884 m (Cuernos Peaks)",
    "bestSeason": "Nov – Mar (Austral Summer with 17 Hours of Daylight)",
    "category": "mountain",
    "purposes": [
      "adventure",
      "nature",
      "solo",
      "photography"
    ],
    "budgetUSD": 1400,
    "budgetTier": "luxury",
    "highlights": [
      "The Iconic W-Trek Circuit",
      "Grey Glacier Ice Trekking",
      "French Valley Panoramic Lookout",
      "Lake Pehoe Sunset Reflection"
    ],
    "localDelicacy": "Cordero al Palo (Patagonian spit-roasted lamb) & Calafate Sour",
    "flightBenchmarkUSD": {
      "mumbai": 1450,
      "delhi": 1480,
      "newyork": 920,
      "london": 980,
      "dubai": 1350,
      "tokyo": 1600,
      "sydney": 1400,
      "paris": 1020,
      "singapore": 1650,
      "toronto": 980,
      "default": 1200
    },
    "reviews": [
      {
        "id": "rev-tdp-1",
        "author": "Lucas Meyer",
        "rating": 5,
        "date": "2026-01-30",
        "travelerType": "Backpacker",
        "comment": "Completing the W-Trek under Patagonia’s fierce winds and waking up to the granite towers glowing fiery red at dawn is unbeatable."
      },
      {
        "id": "rev-tdp-2",
        "author": "Camila Torres",
        "rating": 5,
        "date": "2025-12-08",
        "travelerType": "Photographer",
        "comment": "The French Valley amphitheater gave me chills. You hear ice calve like thunder while surrounded by hanging glaciers."
      }
    ]
  },
  {
    "id": "santorini-oia",
    "name": "Santorini & Oia Caldera",
    "country": "Greece",
    "region": "Europe",
    "image": "/images/destinations/santorini-oia-domes.jpg",
    "gallery": [
      "/images/destinations/santorini-oia-domes.jpg"
    ],
    "description": "Whitewashed cliffside cubist villages and cobalt-blue domes perched 300 meters above a submerged Aegean volcanic caldera.",
    "culture": "Minoan bronze-age Akrotiri civilization, volcanic Assyrtiko viticulture, and cycladic maritime architecture.",
    "vibe": "Sun-drenched, Romantic, Aegean Blue",
    "rating": 4.93,
    "reviewCount": 1120,
    "coordinates": {
      "lat": 36.4618,
      "lng": 25.3753
    },
    "elevation": "300 m (Caldera Rim)",
    "bestSeason": "Apr – Jun & Sep – Oct (Pleasant Sun, Fewer Crowds)",
    "category": "romantic",
    "purposes": [
      "romantic",
      "coastal",
      "photography",
      "food"
    ],
    "budgetUSD": 1480,
    "budgetTier": "luxury",
    "highlights": [
      "Oia Castle Legendary Sunset",
      "Fira to Oia Cliffside Hike",
      "Akrotiri Prehistoric Ruins",
      "Volcanic Red & Black Sand Beaches"
    ],
    "localDelicacy": "Tomatokeftedes (Crispy tomato fritters) & Assyrtiko White Wine",
    "flightBenchmarkUSD": {
      "mumbai": 540,
      "delhi": 570,
      "newyork": 650,
      "london": 160,
      "dubai": 380,
      "tokyo": 850,
      "sydney": 1180,
      "paris": 140,
      "singapore": 680,
      "toronto": 710,
      "default": 420
    },
    "reviews": [
      {
        "id": "rev-san-1",
        "author": "Helena Papas",
        "rating": 5,
        "date": "2025-10-03",
        "travelerType": "Romantic Couple",
        "comment": "The cliffside hike from Fira to Oia overlooking the caldera at golden hour is the most romantic walk in Europe."
      },
      {
        "id": "rev-san-2",
        "author": "Markus Weber",
        "rating": 5,
        "date": "2025-06-12",
        "travelerType": "Food & Wine Lover",
        "comment": "Assyrtiko wine tasted directly at a cliffside cellar with fresh seafood and sunset views is perfection."
      }
    ]
  },
  {
    "id": "ladakh-pangong",
    "name": "Leh & Pangong Tso",
    "country": "India",
    "region": "Asia",
    "image": "/images/destinations/ladakh-pangong-tso.jpg",
    "gallery": [
      "/images/destinations/ladakh-pangong-tso.jpg"
    ],
    "description": "High-altitude cold desert plateau featuring color-changing azure salt lakes, ancient Buddhist gompas, and moonland mountain passes.",
    "culture": "Tibetan-Ladakhi Buddhist monastic traditions, prayer-flag spiritual passes, and warm Ladakhi mountain hospitality.",
    "vibe": "High-Altitude Nirvana, Rugged, Serene",
    "rating": 4.93,
    "reviewCount": 640,
    "coordinates": {
      "lat": 33.7595,
      "lng": 78.6674
    },
    "elevation": "4,250 m (13,940 ft)",
    "bestSeason": "May – Sep (Warm High Passes & Blue Lakes)",
    "category": "mountain",
    "purposes": [
      "adventure",
      "spiritual",
      "solo",
      "culture"
    ],
    "budgetUSD": 520,
    "budgetTier": "backpacker",
    "highlights": [
      "Khardung La & Chang La High Passes",
      "Thiksey & Hemis Monasteries",
      "Nubra Valley Hunder Sand Dunes",
      "Milky Way Stargazing at Pangong Tso"
    ],
    "localDelicacy": "Steaming Tibetan Momos, Thukpa & Warm Butter Tea",
    "flightBenchmarkUSD": {
      "mumbai": 110,
      "delhi": 80,
      "newyork": 890,
      "london": 650,
      "dubai": 320,
      "tokyo": 740,
      "sydney": 980,
      "paris": 680,
      "singapore": 410,
      "toronto": 920,
      "default": 250
    },
    "reviews": [
      {
        "id": "rev-lad-1",
        "author": "Vikram Singhania",
        "rating": 5,
        "date": "2025-08-29",
        "travelerType": "Motorcycle Nomad",
        "comment": "Riding over Khardung La pass at 17,500 feet into the raw blue expanse of Pangong Tso is an adventure every traveler must do once."
      },
      {
        "id": "rev-lad-2",
        "author": "Tenzin Norbu",
        "rating": 5,
        "date": "2025-07-14",
        "travelerType": "Spiritual Seeker",
        "comment": "Attending morning chanting at Thiksey Monastery as the horns echoed across the Indus valley was deeply moving."
      }
    ]
  },
  {
    "id": "petra-wadi-rum",
    "name": "Petra & Wadi Rum",
    "country": "Jordan",
    "region": "Middle East",
    "image": "/images/destinations/petra-treasury.jpg",
    "gallery": [
      "/images/destinations/petra-treasury.jpg"
    ],
    "description": "Rose-red Nabataean canyon temples carved into sheer sandstone cliffs, opening onto the vast crimson Martian deserts of Wadi Rum.",
    "culture": "Bedouin campfire storytelling, nomadic tea traditions, and ancient Incense and Spice trading route heritage.",
    "vibe": "Mysterious, Golden Desert, Ancient Wonder",
    "rating": 4.96,
    "reviewCount": 580,
    "coordinates": {
      "lat": 30.3222,
      "lng": 35.4517
    },
    "elevation": "810 m (Siq Canyons)",
    "bestSeason": "Mar – May & Sep – Nov",
    "category": "cultural",
    "purposes": [
      "culture",
      "adventure",
      "photography"
    ],
    "budgetUSD": 820,
    "budgetTier": "explorer",
    "highlights": [
      "Al-Khazneh Treasury Narrow Siq Walk",
      "Bedouin Stargazing Bubble Camp",
      "The Monastery (Ad Deir) Mountain Hike",
      "Burdah Rock Bridge Desert 4x4 Tour"
    ],
    "localDelicacy": "Mansaf (Tender lamb cooked in dried yogurt sauce with pine nuts)",
    "flightBenchmarkUSD": {
      "mumbai": 410,
      "delhi": 430,
      "newyork": 780,
      "london": 340,
      "dubai": 220,
      "tokyo": 890,
      "sydney": 1350,
      "paris": 380,
      "singapore": 620,
      "toronto": 820,
      "default": 450
    },
    "reviews": [
      {
        "id": "rev-petra-1",
        "author": "Tariq Mansoor",
        "rating": 5,
        "date": "2026-02-14",
        "travelerType": "Explorer",
        "comment": "Emerging from the dark shadows of the Siq gorge to see the radiant rose facade of Al-Khazneh lit by morning sun is unforgettable."
      },
      {
        "id": "rev-petra-2",
        "author": "Emma Watson-Lee",
        "rating": 5,
        "date": "2025-11-09",
        "travelerType": "Desert Camper",
        "comment": "Sleeping in a geodesic bubble dome under the billion stars of Wadi Rum with Bedouin tea around the fire is transcendent."
      }
    ]
  },
  {
    "id": "hallstatt-austria",
    "name": "Hallstatt & Dachstein",
    "country": "Austria",
    "region": "Europe",
    "image": "/images/destinations/hallstatt-village.jpg",
    "gallery": [
      "/images/destinations/hallstatt-village.jpg"
    ],
    "description": "A fairytale lakeside alpine village mirrored on crystal waters, framed by 7,000-year-old historic salt mines and towering Dachstein glaciers.",
    "culture": "Salzkammergut salt harvesting heritage, baroque Austrian church bells, and alpine woodcraft.",
    "vibe": "Romantic, Storybook, Pure Reflection",
    "rating": 4.91,
    "reviewCount": 490,
    "coordinates": {
      "lat": 47.5622,
      "lng": 13.6493
    },
    "elevation": "511 m (Lakeside)",
    "bestSeason": "May – Oct (Lakeside Wandering) or Dec – Feb (Snow Globe)",
    "category": "romantic",
    "purposes": [
      "romantic",
      "calm",
      "photography",
      "culture"
    ],
    "budgetUSD": 1150,
    "budgetTier": "luxury",
    "highlights": [
      "Classic Postcard Viewpoint",
      "Dachstein Giant Ice Caves",
      "Skywalk World Heritage View",
      "Lake Hallstatt Morning Rowboat"
    ],
    "localDelicacy": "Fresh Lake Trout (Reinanke) & Warm Apple Strudel",
    "flightBenchmarkUSD": {
      "mumbai": 610,
      "delhi": 630,
      "newyork": 620,
      "london": 110,
      "dubai": 420,
      "tokyo": 860,
      "sydney": 1220,
      "paris": 90,
      "singapore": 740,
      "toronto": 680,
      "default": 450
    },
    "reviews": [
      {
        "id": "rev-hal-1",
        "author": "Felix Gruber",
        "rating": 5,
        "date": "2025-12-20",
        "travelerType": "Romantic",
        "comment": "Waking up early before the day-trippers arrive, when the mist lingers on the mirror lake and church bells echo, feels like a storybook."
      },
      {
        "id": "rev-hal-2",
        "author": "Mei Lin",
        "rating": 5,
        "date": "2025-05-18",
        "travelerType": "Solo Traveler",
        "comment": "Renting a small electric boat on the lake gave us the best private view of the entire mountain village."
      }
    ]
  },
  {
    "id": "milford-sound",
    "name": "Milford Sound & Fiordland",
    "country": "New Zealand",
    "region": "Oceania",
    "image": "/images/destinations/milford-sound-mitre.jpg",
    "gallery": [
      "/images/destinations/milford-sound-mitre.jpg"
    ],
    "description": "Described by Rudyard Kipling as the Eighth Wonder of the World: vertical glacier cliffs dripping with a thousand waterfalls into dark mirror waters.",
    "culture": "Māori Piopiotahi creation legends, seal colony protection, and pristine conservation ethics.",
    "vibe": "Primeval, Thundering, Monumental",
    "rating": 4.97,
    "reviewCount": 520,
    "coordinates": {
      "lat": -44.6715,
      "lng": 167.9256
    },
    "elevation": "1,692 m (Mitre Peak)",
    "bestSeason": "Nov – Apr (Warm Days & Cascading Falls)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 1400,
    "budgetTier": "luxury",
    "highlights": [
      "Mitre Peak Fjord Cruise",
      "Stirling Falls Glacial Spray",
      "Milford Track Multi-Day Alpine Hike",
      "Te Anau Glowworm Caves"
    ],
    "localDelicacy": "Fiordland Wild Venison & Pavlova with Kiwi fruit",
    "flightBenchmarkUSD": {
      "mumbai": 980,
      "delhi": 1010,
      "newyork": 1200,
      "london": 1100,
      "dubai": 1050,
      "tokyo": 820,
      "sydney": 280,
      "paris": 1150,
      "singapore": 580,
      "toronto": 1250,
      "default": 800
    },
    "reviews": [
      {
        "id": "rev-milford-1",
        "author": "Callum O’Connor",
        "rating": 5,
        "date": "2026-02-11",
        "travelerType": "Adventure Seeker",
        "comment": "Cruising beneath Stirling Falls and feeling glacial mist on your face while dolphins play in the bow wake is pure New Zealand magic."
      },
      {
        "id": "rev-milford-2",
        "author": "Rachel Adams",
        "rating": 5,
        "date": "2025-11-29",
        "travelerType": "Kayaker",
        "comment": "Kayaking in the stillness of the fjord surrounded by 1,000-meter vertical granite walls made me feel delightfully small."
      }
    ]
  },
  {
    "id": "fuji-hakone",
    "name": "Mount Fuji & Five Lakes",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/mount-fuji-pagoda.jpg",
    "gallery": [
      "/images/destinations/mount-fuji-pagoda.jpg"
    ],
    "description": "The sacred symmetrical volcanic cone towering over serene alpine lakes, steaming hot spring onsens, and cedar-lined forest paths.",
    "culture": "Shinto worship of mountain spirits (Kami), Hokusai 36 Views of Fuji woodblock heritage, and traditional ryokan onsen healing.",
    "vibe": "Sacred, Iconic, Majestic Stillness",
    "rating": 4.93,
    "reviewCount": 710,
    "coordinates": {
      "lat": 35.3606,
      "lng": 138.7274
    },
    "elevation": "3,776 m (12,389 ft)",
    "bestSeason": "Jul – Sep (Summit Climb) or Nov – Feb (Crystal Winter Peak Views)",
    "category": "mountain",
    "purposes": [
      "spiritual",
      "nature",
      "culture",
      "photography"
    ],
    "budgetUSD": 950,
    "budgetTier": "explorer",
    "highlights": [
      "Chureito Pagoda Cherry Blossom Frame",
      "Lake Kawaguchiko Onsen Ryokan Stay",
      "Arakurayama Sengen Park",
      "Fuji 5th Station Sunrise"
    ],
    "localDelicacy": "Houtou Noodles (Thick flat noodles simmered in pumpkin miso broth)",
    "flightBenchmarkUSD": {
      "mumbai": 560,
      "delhi": 580,
      "newyork": 960,
      "london": 810,
      "dubai": 620,
      "tokyo": 40,
      "sydney": 690,
      "paris": 830,
      "singapore": 340,
      "toronto": 1020,
      "default": 600
    },
    "reviews": [
      {
        "id": "rev-fuji-1",
        "author": "Daiki Tanaka",
        "rating": 5,
        "date": "2026-01-18",
        "travelerType": "Climber",
        "comment": "Standing atop Fuji at 3,776m watching the Goraiko (sunrise above the cloud sea) is a spiritual pinnacle."
      },
      {
        "id": "rev-fuji-2",
        "author": "Emily Zhang",
        "rating": 5,
        "date": "2025-11-04",
        "travelerType": "Relaxation",
        "comment": "Soaking in an open-air hot spring bath overlooking Lake Kawaguchiko with Fuji’s snow peak reflecting on water is divine."
      }
    ]
  },
  {
    "id": "amalfi-coast",
    "name": "Amalfi & Positano",
    "country": "Italy",
    "region": "Europe",
    "image": "/images/destinations/amalfi-positano.jpg",
    "gallery": [
      "/images/destinations/amalfi-positano.jpg"
    ],
    "description": "Pastel cliffside villas cascading down to the shimmering Tyrrhenian Sea, perfumed by blooming lemon terraces and coastal breezes.",
    "culture": "Southern Italian Dolce Vita, hand-painted Vietri ceramics, and historic maritime republic heritage.",
    "vibe": "Romantic, Sun-kissed, Coastal Elegance",
    "rating": 4.88,
    "reviewCount": 820,
    "coordinates": {
      "lat": 40.6281,
      "lng": 14.485
    },
    "elevation": "80 m (Cliffside Terraces)",
    "bestSeason": "Apr – Jun & Sep – Oct",
    "category": "romantic",
    "purposes": [
      "romantic",
      "culture",
      "coastal",
      "food"
    ],
    "budgetUSD": 1550,
    "budgetTier": "luxury",
    "highlights": [
      "Path of the Gods (Sentiero degli Dei)",
      "Ravello Villa Rufolo Gardens",
      "Private Boat to Capri Blue Grotto",
      "Limoncello Tastings in Cliff Groves"
    ],
    "localDelicacy": "Scialatielli ai Frutti di Mare & Delizia al Limone",
    "flightBenchmarkUSD": {
      "mumbai": 580,
      "delhi": 610,
      "newyork": 620,
      "london": 140,
      "dubai": 410,
      "tokyo": 850,
      "sydney": 1150,
      "paris": 110,
      "singapore": 720,
      "toronto": 690,
      "default": 420
    },
    "reviews": [
      {
        "id": "rev-amalfi-1",
        "author": "Matteo Bianchi",
        "rating": 5,
        "date": "2025-09-19",
        "travelerType": "Couple",
        "comment": "Hiking the Path of the Gods high above the coastline and finishing with lemon granita in Positano is pure Italian perfection."
      },
      {
        "id": "rev-amalfi-2",
        "author": "Hannah Brooks",
        "rating": 5,
        "date": "2025-06-25",
        "travelerType": "Luxury Explorer",
        "comment": "Renting a wooden Riva boat along the dramatic cliffs of Amalfi was the highlight of our European honeymoon."
      }
    ]
  },
  {
    "id": "socotra-island",
    "name": "Socotra Island",
    "country": "Yemen",
    "region": "Middle East",
    "image": "/images/destinations/socotra-dragon-tree.jpg",
    "gallery": [
      "/images/destinations/socotra-dragon-tree.jpg"
    ],
    "description": "An isolated archipelago in the Arabian Sea famous for umbrella-like Dragon Blood Trees, white sand lagoons, and alien landscapes.",
    "culture": "Ancient Soqotri language (an unwritten Semitic tongue) and sustainable pastoralist biodiversity stewardship.",
    "vibe": "Extraterrestrial, Ancient, Raw Botanical Miracle",
    "rating": 4.97,
    "reviewCount": 94,
    "coordinates": {
      "lat": 12.5035,
      "lng": 53.9213
    },
    "elevation": "1,500 m (Hajhir Peaks)",
    "bestSeason": "Oct – Apr (Mild Breeze & Clear Skies)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "photography"
    ],
    "budgetUSD": 1800,
    "budgetTier": "luxury",
    "highlights": [
      "Dixam Dragon Blood Tree Plateau",
      "Detwah Lagoon White Sands",
      "Hoq Cave Stalactite Caverns",
      "Arher Sand Dunes by the Sea"
    ],
    "localDelicacy": "Fresh Red Snapper with Socotri Wild Spices",
    "flightBenchmarkUSD": {
      "mumbai": 650,
      "delhi": 680,
      "newyork": 1300,
      "london": 950,
      "dubai": 450,
      "tokyo": 1200,
      "sydney": 1600,
      "paris": 980,
      "singapore": 880,
      "toronto": 1350,
      "default": 750
    },
    "reviews": [
      {
        "id": "rev-socotra-1",
        "author": "Dr. Arthur Pendelton",
        "rating": 5,
        "date": "2026-01-22",
        "travelerType": "Botanist",
        "comment": "Camping under a canopy of prehistoric Dragon Blood Trees on the Dixam plateau feels like stepping onto a Jurassic alien world."
      },
      {
        "id": "rev-socotra-2",
        "author": "Zainab Al-Husseini",
        "rating": 5,
        "date": "2025-11-15",
        "travelerType": "Wildlife Explorer",
        "comment": "The Detwah lagoon has water so impossibly turquoise and sand so powdery white it almost hurts your eyes. Truly untouched."
      }
    ]
  },
  {
    "id": "antarctica-paradise-bay",
    "name": "Antarctic Peninsula & Paradise Bay",
    "country": "Antarctica",
    "region": "Polar",
    "image": "/images/destinations/antarctica-paradise-bay.jpg",
    "gallery": [
      "/images/destinations/antarctica-paradise-bay.jpg"
    ],
    "description": "The seventh continent’s most breathtaking harbor, featuring cathedral-sized electric-blue icebergs, calving glaciers, and colonies of gentoo penguins.",
    "culture": "Pristine Antarctic Treaty governance, heroic age Shackleton exploration legacy, and vital climate research stations.",
    "vibe": "Primeval Silence, Monumental Ice, Pristine Earth",
    "rating": 4.99,
    "reviewCount": 165,
    "coordinates": {
      "lat": -64.8167,
      "lng": -62.8833
    },
    "elevation": "10 m (Sea Level to Glaciers)",
    "bestSeason": "Nov – Mar (Austral Summer & Whale Migration)",
    "category": "polar",
    "purposes": [
      "adventure",
      "wildlife",
      "nature",
      "photography"
    ],
    "budgetUSD": 5800,
    "budgetTier": "luxury",
    "highlights": [
      "Zodiac Iceberg Safari",
      "Gentoo Penguin Rookery Encounters",
      "Humpback Whale Bubble-net Feeding",
      "Polar Plunge in Glacial Waters"
    ],
    "localDelicacy": "Expedition Ship Chilean Sea Bass & Hot Mulled Wine",
    "flightBenchmarkUSD": {
      "mumbai": 1850,
      "delhi": 1900,
      "newyork": 1100,
      "london": 1200,
      "dubai": 1650,
      "tokyo": 1950,
      "sydney": 1450,
      "paris": 1250,
      "singapore": 1750,
      "toronto": 1150,
      "default": 1400
    },
    "reviews": [
      {
        "id": "rev-ant-1",
        "author": "Capt. Henrik Lindblad",
        "rating": 5,
        "date": "2026-02-08",
        "travelerType": "Polar Explorer",
        "comment": "When your zodiac glides through the mirror stillness of Paradise Bay and a humpback whale surfaces ten meters away, the entire world stands still."
      },
      {
        "id": "rev-ant-2",
        "author": "Seraphina Vance",
        "rating": 5,
        "date": "2025-12-28",
        "travelerType": "Photographer",
        "comment": "The scale of the ice cathedrals is incomprehensible until you are there. Doing the polar plunge was freezing but exhilarating!"
      }
    ]
  },
  {
    "id": "south-georgia",
    "name": "South Georgia & Salisbury Plain",
    "country": "South Georgia",
    "region": "Polar",
    "image": "/images/destinations/south-georgia-penguins.jpg",
    "gallery": [
      "/images/destinations/south-georgia-penguins.jpg"
    ],
    "description": "The Serengeti of the Southern Ocean: a dramatic sub-Antarctic alpine island hosting over 200,000 breeding king penguins and giant elephant seals.",
    "culture": "Ernest Shackleton final resting place at Grytviken, historic whaling station ruins reclaimed by seals, and world-leading wildlife recovery.",
    "vibe": "Wild, Roaring, Colossal Animal Kingdom",
    "rating": 4.98,
    "reviewCount": 88,
    "coordinates": {
      "lat": -54.2811,
      "lng": -36.5092
    },
    "elevation": "2,935 m (Mount Paget)",
    "bestSeason": "Oct – Mar (Peak King Penguin & Fur Seal Breeding)",
    "category": "polar",
    "purposes": [
      "wildlife",
      "adventure",
      "photography"
    ],
    "budgetUSD": 6500,
    "budgetTier": "luxury",
    "highlights": [
      "Salisbury Plain 200,000 King Penguin Colony",
      "Shackleton Memorial Toast at Grytviken",
      "Massive Elephant Seal Beach Jousts",
      "St. Andrews Bay Glacial Backdrop"
    ],
    "localDelicacy": "Sub-Antarctic Maritime Stew & Artisan Single Malt",
    "flightBenchmarkUSD": {
      "mumbai": 1950,
      "delhi": 2000,
      "newyork": 1250,
      "london": 1300,
      "dubai": 1750,
      "tokyo": 2100,
      "sydney": 1600,
      "paris": 1350,
      "singapore": 1850,
      "toronto": 1300,
      "default": 1550
    },
    "reviews": [
      {
        "id": "rev-sg-1",
        "author": "Dr. Alistair MacIntyre",
        "rating": 5,
        "date": "2026-01-19",
        "travelerType": "Wildlife Biologist",
        "comment": "Stepping ashore at Salisbury Plain amid a sea of golden-collared king penguins as far as the eye can see is the greatest wildlife spectacle on Earth."
      },
      {
        "id": "rev-sg-2",
        "author": "Nadia Volkova",
        "rating": 5,
        "date": "2025-11-22",
        "travelerType": "Expedition Traveler",
        "comment": "Toasting “The Boss” Ernest Shackleton at his grave in Grytviken with 4-ton elephant seals barking around you is deeply historic."
      }
    ]
  },
  {
    "id": "falkland-islands",
    "name": "Falkland Islands & Volunteer Point",
    "country": "Falkland Islands",
    "region": "Americas",
    "image": "/images/destinations/falkland-islands-penguins.jpg",
    "gallery": [
      "/images/destinations/falkland-islands-penguins.jpg"
    ],
    "description": "A remote windswept South Atlantic paradise of white sand beaches, turquoise waters, and thriving colonies of five penguin species.",
    "culture": "Falkland Islander maritime heritage, remote sheep farming traditions, and warm British pub hospitality in Stanley.",
    "vibe": "Pristine, Remote, Coastal Wilderness",
    "rating": 4.89,
    "reviewCount": 110,
    "coordinates": {
      "lat": -51.6977,
      "lng": -57.8517
    },
    "elevation": "705 m (Mount Usborne)",
    "bestSeason": "Nov – Mar (Penguin Nesting & Warmest Winds)",
    "category": "coastal",
    "purposes": [
      "wildlife",
      "nature",
      "adventure",
      "photography"
    ],
    "budgetUSD": 2100,
    "budgetTier": "luxury",
    "highlights": [
      "Volunteer Point King Penguin Beach",
      "Bleaker Island Rockhopper Rookeries",
      "Carcass Island Magellanic Tunnels",
      "Historic Stanley Harbor Walk"
    ],
    "localDelicacy": "Falkland Upland Goose Pâté & Fresh Diddle-dee Berry Tart",
    "flightBenchmarkUSD": {
      "mumbai": 1650,
      "delhi": 1700,
      "newyork": 980,
      "london": 850,
      "dubai": 1450,
      "tokyo": 1800,
      "sydney": 1650,
      "paris": 920,
      "singapore": 1700,
      "toronto": 1020,
      "default": 1200
    },
    "reviews": [
      {
        "id": "rev-falk-1",
        "author": "Oliver Campbell",
        "rating": 5,
        "date": "2026-01-14",
        "travelerType": "Birdwatcher",
        "comment": "Volunteer Point is phenomenal. White sand beaches with turquoise waves and king penguins walking casually right past your boots!"
      },
      {
        "id": "rev-falk-2",
        "author": "Chloe Bennett",
        "rating": 5,
        "date": "2025-12-05",
        "travelerType": "Solo Adventurer",
        "comment": "The remoteness and quiet warmth of the islanders in Stanley makes this one of the most unique places on the planet."
      }
    ]
  },
  {
    "id": "svalbard",
    "name": "Svalbard Archipelago & Spitsbergen",
    "country": "Norway",
    "region": "Polar",
    "image": "/images/destinations/svalbard-spitsbergen.jpg",
    "gallery": [
      "/images/destinations/svalbard-spitsbergen.jpg"
    ],
    "description": "The world’s northernmost inhabited frontier: where polar bears outnumber people among glacier fronts, walrus haul-outs, and glowing midnight sun.",
    "culture": "Arctic coal-mining history, Global Seed Vault safeguarding humanity’s crops, and pioneering polar research community.",
    "vibe": "Frozen Realm, Arctic Wild, Northernmost Frontier",
    "rating": 4.95,
    "reviewCount": 290,
    "coordinates": {
      "lat": 78.2232,
      "lng": 15.6267
    },
    "elevation": "1,717 m (Newtontoppen)",
    "bestSeason": "Mar – May (Snowmobile & Northern Lights) or Jun – Aug (Fjord Cruises & 24hr Sun)",
    "category": "polar",
    "purposes": [
      "adventure",
      "polar",
      "wildlife",
      "solo"
    ],
    "budgetUSD": 2400,
    "budgetTier": "luxury",
    "highlights": [
      "Snowmobile Trek to Tempelfjorden",
      "Walrus Haul-outs on Moffen Island",
      "Global Seed Vault Exterior Visit",
      "Midnight Sun Fjord Zodiac Tour"
    ],
    "localDelicacy": "Reindeer Stew with Lingonberries & Arctic Char",
    "flightBenchmarkUSD": {
      "mumbai": 980,
      "delhi": 1020,
      "newyork": 780,
      "london": 340,
      "dubai": 850,
      "tokyo": 1250,
      "sydney": 1650,
      "paris": 380,
      "singapore": 1100,
      "toronto": 820,
      "default": 720
    },
    "reviews": [
      {
        "id": "rev-sval-1",
        "author": "Thorvald Eriksen",
        "rating": 5,
        "date": "2026-02-15",
        "travelerType": "Arctic Guide",
        "comment": "Driving a snowmobile across frozen sea ice beneath purple polar twilight with blue glaciers towering overhead is unforgettable."
      },
      {
        "id": "rev-sval-2",
        "author": "Maya Patel",
        "rating": 5,
        "date": "2025-08-10",
        "travelerType": "Nature Lover",
        "comment": "We saw a mother polar bear and cub on a floating ice floe. Svalbard is the true wild north."
      }
    ]
  },
  {
    "id": "greenland-ilulissat",
    "name": "Ilulissat Icefjord & Disko Bay",
    "country": "Greenland",
    "region": "Polar",
    "image": "/images/destinations/greenland-ilulissat.jpg",
    "gallery": [
      "/images/destinations/greenland-ilulissat.jpg"
    ],
    "description": "A UNESCO World Heritage maritime spectacle where the Sermeq Kujalleq glacier calves towering skyscraper icebergs drifting out into Disko Bay.",
    "culture": "Inuit sled-dog mushing heritage, traditional seal skin tailoring, and Arctic coastal subsistence fishing.",
    "vibe": "Monumental, Glacial Echoes, Pure Ice",
    "rating": 4.96,
    "reviewCount": 140,
    "coordinates": {
      "lat": 69.2198,
      "lng": -51.0986
    },
    "elevation": "50 m (Fjord Edge)",
    "bestSeason": "Jun – Aug (Midnight Sun Sailing) or Feb – Apr (Dog Sledding & Aurora)",
    "category": "polar",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 2800,
    "budgetTier": "luxury",
    "highlights": [
      "Midnight Sun Iceberg Boat Cruise",
      "Sermermiut Historic Boardwalk Hike",
      "Traditional Inuit Dog Sled Expedition",
      "Helicopter Flight over Ice Sheet"
    ],
    "localDelicacy": "Greenlandic Halibut Soup (Suaasat) & Smoked Muskox",
    "flightBenchmarkUSD": {
      "mumbai": 1450,
      "delhi": 1500,
      "newyork": 980,
      "london": 720,
      "dubai": 1350,
      "tokyo": 1650,
      "sydney": 1850,
      "paris": 760,
      "singapore": 1550,
      "toronto": 920,
      "default": 1100
    },
    "reviews": [
      {
        "id": "rev-ilu-1",
        "author": "Freja Lindqvist",
        "rating": 5,
        "date": "2025-07-28",
        "travelerType": "Photographer",
        "comment": "Sailing among 100-meter-tall icebergs illuminated by the golden glow of the midnight sun at 1 AM will stay with me forever."
      },
      {
        "id": "rev-ilu-2",
        "author": "Lucas Meyer",
        "rating": 5,
        "date": "2025-03-12",
        "travelerType": "Adventure Seeker",
        "comment": "Hearing the icefjord pop, crack, and boom in the freezing silence was unlike anything I have ever experienced."
      }
    ]
  },
  {
    "id": "south-goa-cola",
    "name": "South Goa & Cola Secret Lagoon",
    "country": "India",
    "region": "Asia",
    "image": "/images/destinations/south-goa-cola-beach.jpg",
    "gallery": [
      "/images/destinations/south-goa-cola-beach.jpg"
    ],
    "description": "The tranquil, uncrowded side of Goa where lush palm-fringed cliffs hide emerald freshwater lagoons meeting golden Arabian Sea sands.",
    "culture": "Indo-Portuguese coastal heritage, susegad relaxed lifestyle, olive ridley turtle conservation at Galgibaga, and local feni distilleries.",
    "vibe": "Serene, Susegad, Palm-Shaded Bliss",
    "rating": 4.88,
    "reviewCount": 520,
    "coordinates": {
      "lat": 15.056,
      "lng": 73.987
    },
    "elevation": "10 m (Sea Level)",
    "bestSeason": "Nov – Mar (Gentle Breezes & Calm Seas)",
    "category": "coastal",
    "purposes": [
      "romantic",
      "calm",
      "solo",
      "nature"
    ],
    "budgetUSD": 380,
    "budgetTier": "backpacker",
    "highlights": [
      "Cola Beach Freshwater Lagoon Kayak",
      "Boat to Secluded Butterfly Beach",
      "Galgibaga Olive Ridley Turtle Sanctuary",
      "Cabo de Rama Fort Cliff Sunset"
    ],
    "localDelicacy": "Goan Prawn Balchão, Fish Curry Rice & Cashew Feni",
    "flightBenchmarkUSD": {
      "mumbai": 60,
      "delhi": 90,
      "newyork": 820,
      "london": 580,
      "dubai": 240,
      "tokyo": 680,
      "sydney": 920,
      "paris": 620,
      "singapore": 320,
      "toronto": 850,
      "default": 220
    },
    "reviews": [
      {
        "id": "rev-goa-1",
        "author": "Rohan Deshmukh",
        "rating": 5,
        "date": "2026-01-20",
        "travelerType": "Solo Traveler",
        "comment": "Forget the noisy party beaches of North Goa. Cola Beach and Agonda are pure paradise—just sound of waves, coconut palms, and the emerald lagoon."
      },
      {
        "id": "rev-goa-2",
        "author": "Sarah Jenkins",
        "rating": 5,
        "date": "2025-12-14",
        "travelerType": "Couple",
        "comment": "Kayaking in the freshwater lagoon that flows right onto the beach while the sun set into the Arabian Sea was absolute perfection."
      }
    ]
  },
  {
    "id": "spiti-valley",
    "name": "Spiti Valley & Key Monastery",
    "country": "India",
    "region": "Asia",
    "image": "/images/destinations/spiti-key-monastery.jpg",
    "gallery": [
      "/images/destinations/spiti-key-monastery.jpg"
    ],
    "description": "The Middle Land: a breathtaking high-altitude Himalayan desert valley carved with thousand-year-old cliffside monasteries and turquoise rivers.",
    "culture": "Vajrayana Tibetan Buddhist spirituality, century-old mud-brick architecture, and warm mountain homestays.",
    "vibe": "Mystical, Rugged, High-Altitude Solitude",
    "rating": 4.94,
    "reviewCount": 380,
    "coordinates": {
      "lat": 32.2276,
      "lng": 78.0078
    },
    "elevation": "3,800 m (12,467 ft)",
    "bestSeason": "Jun – Sep (Open High Passes) or Jan – Feb (Snow Leopard Winter)",
    "category": "mountain",
    "purposes": [
      "adventure",
      "spiritual",
      "solo",
      "photography"
    ],
    "budgetUSD": 460,
    "budgetTier": "backpacker",
    "highlights": [
      "Key Gompa Cliffside Fortress",
      "Highest Post Office at Hikkim",
      "Fossil Hunting in Langza Village",
      "Chandratal Moon Lake Stargazing"
    ],
    "localDelicacy": "Buckwheat Pancakes, Seabuckthorn Tea & Butter Tea",
    "flightBenchmarkUSD": {
      "mumbai": 120,
      "delhi": 90,
      "newyork": 850,
      "london": 620,
      "dubai": 290,
      "tokyo": 710,
      "sydney": 950,
      "paris": 650,
      "singapore": 380,
      "toronto": 890,
      "default": 260
    },
    "reviews": [
      {
        "id": "rev-spiti-1",
        "author": "Aditya Kashyap",
        "rating": 5,
        "date": "2025-09-02",
        "travelerType": "Adventure Seeker",
        "comment": "Standing before Key Monastery with snow-dusted peaks rising behind it felt like traveling back 1,000 years in time. The silence is profound."
      },
      {
        "id": "rev-spiti-2",
        "author": "Elena Rostova",
        "rating": 5,
        "date": "2025-07-19",
        "travelerType": "Stargazer",
        "comment": "Camping at Chandratal under the clearest Milky Way I have ever seen. Unbelievable beauty."
      }
    ]
  },
  {
    "id": "ziro-valley",
    "name": "Ziro Valley & Apatani Plateau",
    "country": "India",
    "region": "Asia",
    "image": "/images/destinations/ziro-valley-apatani.jpg",
    "gallery": [
      "/images/destinations/ziro-valley-apatani.jpg"
    ],
    "description": "A pine-clad subtropical plateau famous for its emerald paddy-cum-pisciculture farming, bamboo groves, and ancient indigenous tribal heritage.",
    "culture": "Apatani tribal customs, traditional bamboo architecture, sustainable ecological farming, and the world-renowned Ziro Music Festival.",
    "vibe": "Verdant, Peaceful, Indigenous Harmony",
    "rating": 4.91,
    "reviewCount": 220,
    "coordinates": {
      "lat": 27.5949,
      "lng": 93.8385
    },
    "elevation": "1,572 m (5,157 ft)",
    "bestSeason": "Mar – May & Sep – Nov (Golden Harvest & Music Fest)",
    "category": "cultural",
    "purposes": [
      "culture",
      "nature",
      "calm",
      "solo"
    ],
    "budgetUSD": 410,
    "budgetTier": "backpacker",
    "highlights": [
      "Hong & Hari Apatani Village Walks",
      "Pine-Clad Talley Valley Wildlife Sanctuary",
      "Paddy-Fish Co-farming Trails",
      "Ziro Festival of Music Experience"
    ],
    "localDelicacy": "Bamboo Shoot Pork, Pika Pila & Rice Beer (Apong)",
    "flightBenchmarkUSD": {
      "mumbai": 150,
      "delhi": 130,
      "newyork": 920,
      "london": 680,
      "dubai": 340,
      "tokyo": 750,
      "sydney": 1020,
      "paris": 710,
      "singapore": 420,
      "toronto": 950,
      "default": 310
    },
    "reviews": [
      {
        "id": "rev-ziro-1",
        "author": "Taba Yater",
        "rating": 5,
        "date": "2025-10-12",
        "travelerType": "Cultural Explorer",
        "comment": "The harmony with which the Apatani community manages their pine forests and rice fields is inspirational. Deeply peaceful valley."
      },
      {
        "id": "rev-ziro-2",
        "author": "Karan Mehra",
        "rating": 5,
        "date": "2025-09-29",
        "travelerType": "Music Lover",
        "comment": "Ziro Festival of Music nestled in the green paddy fields is the greatest independent music vibe in all of Asia."
      }
    ]
  },
  {
    "id": "munnar-kolukkumalai",
    "name": "Munnar & Kolukkumalai Cloud Peak",
    "country": "India",
    "region": "Asia",
    "image": "/images/destinations/munnar-kolukkumalai.jpg",
    "gallery": [
      "/images/destinations/munnar-kolukkumalai.jpg"
    ],
    "description": "Rolling emerald tea carpets ascending to the highest organic tea estate on Earth, floating above an infinite sea of morning clouds.",
    "culture": "Western Ghats plantation heritage, Muthuvan tribal knowledge, and rare Neelakurinji flower blooming traditions.",
    "vibe": "Misty, Ethereal, Sea of Clouds",
    "rating": 4.92,
    "reviewCount": 470,
    "coordinates": {
      "lat": 10.0889,
      "lng": 77.0595
    },
    "elevation": "2,170 m (7,120 ft)",
    "bestSeason": "Sep – Mar (Crisp Mornings & Rolling Mist)",
    "category": "mountain",
    "purposes": [
      "romantic",
      "nature",
      "calm",
      "photography"
    ],
    "budgetUSD": 390,
    "budgetTier": "backpacker",
    "highlights": [
      "Kolukkumalai Sunrise 4x4 Cloud Safari",
      "Eravikulam Nilgiri Tahr Sanctuary",
      "Mattupetty Lake Speedboating",
      "Orthodox Tea Factory Tasting"
    ],
    "localDelicacy": "Kerala Appam with Vegetable Stew & Fresh Spiced Tea",
    "flightBenchmarkUSD": {
      "mumbai": 70,
      "delhi": 110,
      "newyork": 840,
      "london": 590,
      "dubai": 260,
      "tokyo": 690,
      "sydney": 940,
      "paris": 630,
      "singapore": 310,
      "toronto": 870,
      "default": 230
    },
    "reviews": [
      {
        "id": "rev-mun-1",
        "author": "Deepa Nair",
        "rating": 5,
        "date": "2026-01-08",
        "travelerType": "Nature Lover",
        "comment": "Taking the 4 AM jeep up the rugged track to Kolukkumalai and seeing the golden sun break above the cloud sea is pure bliss."
      },
      {
        "id": "rev-mun-2",
        "author": "Alex Thorne",
        "rating": 5,
        "date": "2025-11-20",
        "travelerType": "Hiker",
        "comment": "The aroma of fresh tea leaves mingling with mountain mist made every morning hike rejuvenating."
      }
    ]
  },
  {
    "id": "hampi",
    "name": "Hampi & Tungabhadra Boulders",
    "country": "India",
    "region": "Asia",
    "image": "/images/destinations/hampi-monuments.jpg",
    "gallery": [
      "/images/destinations/hampi-monuments.jpg"
    ],
    "description": "An open-air museum of giant golden granite boulders, surreal banana plantations, and the monumental ruins of the 14th-century Vijayanagara Empire.",
    "culture": "Vijayanagara imperial architecture, Virupaksha temple worship, Coracle river boating, and bohemian bouldering subculture.",
    "vibe": "Surreal, Ancient, Golden Boulder Kingdom",
    "rating": 4.95,
    "reviewCount": 610,
    "coordinates": {
      "lat": 15.335,
      "lng": 76.46
    },
    "elevation": "467 m (1,532 ft)",
    "bestSeason": "Oct – Mar (Cooler Days for Bouldering & Temple Walks)",
    "category": "cultural",
    "purposes": [
      "culture",
      "history",
      "adventure",
      "solo"
    ],
    "budgetUSD": 350,
    "budgetTier": "backpacker",
    "highlights": [
      "Vittala Temple Musical Pillars & Stone Chariot",
      "Sunrise from Matanga Hill",
      "Coracle Boat Ride on Tungabhadra River",
      "Hippie Island Sunset Bouldering"
    ],
    "localDelicacy": "South Indian Banana Leaf Thali & Filter Coffee",
    "flightBenchmarkUSD": {
      "mumbai": 80,
      "delhi": 110,
      "newyork": 840,
      "london": 600,
      "dubai": 270,
      "tokyo": 700,
      "sydney": 960,
      "paris": 640,
      "singapore": 330,
      "toronto": 880,
      "default": 240
    },
    "reviews": [
      {
        "id": "rev-hampi-1",
        "author": "Siddharth Iyer",
        "rating": 5,
        "date": "2026-01-28",
        "travelerType": "History Explorer",
        "comment": "Climbing Matanga Hill at dawn to see the sun illuminate thousands of golden boulders and temple spires was breathtaking."
      },
      {
        "id": "rev-hampi-2",
        "author": "Clara Oswald",
        "rating": 5,
        "date": "2025-12-02",
        "travelerType": "Backpacker",
        "comment": "Renting a bicycle and pedaling through the banana plantations between ancient stone ruins is pure freedom."
      }
    ]
  },
  {
    "id": "yakushima",
    "name": "Yakushima Ancient Cedar Forest",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/yakushima-forest.jpg",
    "gallery": [
      "/images/destinations/yakushima-forest.jpg"
    ],
    "description": "An ancient moss-covered rainforest island harboring 7,000-year-old Jomon Sugi cryptomeria trees that inspired Studio Ghibli’s Princess Mononoke.",
    "culture": "Shinto animist mountain veneration, island logger-conservationist legacy, and pristine hot springs right by the pounding sea.",
    "vibe": "Primeval, Mossy, Ghibli Wonderland",
    "rating": 4.96,
    "reviewCount": 340,
    "coordinates": {
      "lat": 30.3585,
      "lng": 130.5286
    },
    "elevation": "1,936 m (Miyanoura-dake)",
    "bestSeason": "Mar – May & Oct – Nov (Mild Weather & Vibrant Moss)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "spiritual",
      "solo"
    ],
    "budgetUSD": 1250,
    "budgetTier": "luxury",
    "highlights": [
      "Shiratani Unsuikyo Mossy Ravine",
      "Jomon Sugi 7,000-Year-Old Giant Tree Trek",
      "Hirauchi Kaichu Natural Ocean Hot Spring",
      "Senpiro-no-Taki Granite Waterfall"
    ],
    "localDelicacy": "Flying Fish Sashimi (Tobiuo) & Yakushima Shochu",
    "flightBenchmarkUSD": {
      "mumbai": 680,
      "delhi": 710,
      "newyork": 1050,
      "london": 890,
      "dubai": 720,
      "tokyo": 150,
      "sydney": 790,
      "paris": 920,
      "singapore": 420,
      "toronto": 1120,
      "default": 720
    },
    "reviews": [
      {
        "id": "rev-yaku-1",
        "author": "Kenzo Morimoto",
        "rating": 5,
        "date": "2025-11-10",
        "travelerType": "Hiker",
        "comment": "Walking in Shiratani Unsuikyo forest when gentle rain falls and the green moss glows with intense vibrancy is stepping straight into Princess Mononoke."
      },
      {
        "id": "rev-yaku-2",
        "author": "Hannah Schmidt",
        "rating": 5,
        "date": "2025-05-24",
        "travelerType": "Solo Traveler",
        "comment": "Soaking in the coastal tidal onsen while waves crashed against the rocks under starry skies was unforgettable."
      }
    ]
  },
  {
    "id": "naoshima",
    "name": "Naoshima Contemporary Art Island",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/naoshima-pumpkin.jpg",
    "gallery": [
      "/images/destinations/naoshima-pumpkin.jpg"
    ],
    "description": "An idyllic Seto Inland Sea island transformed into a world-capital of avant-garde architecture, subterranean museums, and outdoor sculptures.",
    "culture": "Setouchi Triennale art festival movement, Tadao Ando concrete architecture, and revitalization of traditional fishing hamlets.",
    "vibe": "Minimalist, Creative, Mediterranean-Japanese Fusion",
    "rating": 4.93,
    "reviewCount": 390,
    "coordinates": {
      "lat": 34.4597,
      "lng": 133.9961
    },
    "elevation": "120 m (Coastal Hills)",
    "bestSeason": "Mar – May & Sep – Nov (Pleasant Island Cycling)",
    "category": "cultural",
    "purposes": [
      "culture",
      "calm",
      "solo",
      "romantic"
    ],
    "budgetUSD": 1180,
    "budgetTier": "luxury",
    "highlights": [
      "Chichu Art Museum Underground Natural Light",
      "Yayoi Kusama Iconic Yellow Pumpkin Pier",
      "Benesse House Art Museum Stay",
      "Art House Project in Honmura Village"
    ],
    "localDelicacy": "Seto Inland Sea Sea Bream Rice (Tai-meshi) & Olive Oil Somen",
    "flightBenchmarkUSD": {
      "mumbai": 620,
      "delhi": 650,
      "newyork": 1020,
      "london": 850,
      "dubai": 680,
      "tokyo": 110,
      "sydney": 750,
      "paris": 880,
      "singapore": 390,
      "toronto": 1080,
      "default": 680
    },
    "reviews": [
      {
        "id": "rev-nao-1",
        "author": "Isabella Rossi",
        "rating": 5,
        "date": "2025-10-18",
        "travelerType": "Architect",
        "comment": "Chichu Art Museum is the pinnacle of architectural mastery. Viewing Monet’s Water Lilies in pure natural subterranean light took my breath away."
      },
      {
        "id": "rev-nao-2",
        "author": "Taro Yamada",
        "rating": 5,
        "date": "2025-06-04",
        "travelerType": "Cyclist",
        "comment": "Renting an electric bicycle to ride around the quiet coastline past outdoor sculptures was sheer joy."
      }
    ]
  },
  {
    "id": "kumano-kodo",
    "name": "Kumano Kodo & Nachi Falls",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/kumano-kodo-nachi.jpg",
    "gallery": [
      "/images/destinations/kumano-kodo-nachi.jpg"
    ],
    "description": "A thousand-year-old sacred pilgrimage network traversing mist-shrouded cedar mountains, cascading waterfalls, and ancient Shinto-Buddhist shrines.",
    "culture": "Shinbutsu-shugo syncretism, dual-pilgrim brotherhood with Camino de Santiago, and traditional mountain onsen ryokans.",
    "vibe": "Sacred, Forest Path, Ancient Pilgrimage",
    "rating": 4.95,
    "reviewCount": 310,
    "coordinates": {
      "lat": 33.8406,
      "lng": 135.7738
    },
    "elevation": "800 m (Nakahechi Pass)",
    "bestSeason": "Mar – May & Oct – Nov (Mild Temperatures & Clear Paths)",
    "category": "spiritual",
    "purposes": [
      "spiritual",
      "adventure",
      "culture",
      "solo"
    ],
    "budgetUSD": 980,
    "budgetTier": "explorer",
    "highlights": [
      "Kumano Nachi Taisha & 133m Nachi Waterfall",
      "Hongu Taisha Giant Otorii Gate",
      "Daimon-zaka Ancient Cobblestone Stairway",
      "Yunomine Onsen 1,800-Year-Old Tsuboyu Bath"
    ],
    "localDelicacy": "Mehari-zushi (Rice wrapped in pickled mustard leaves) & Ayu sweetfish",
    "flightBenchmarkUSD": {
      "mumbai": 600,
      "delhi": 630,
      "newyork": 990,
      "london": 830,
      "dubai": 660,
      "tokyo": 90,
      "sydney": 730,
      "paris": 860,
      "singapore": 370,
      "toronto": 1060,
      "default": 660
    },
    "reviews": [
      {
        "id": "rev-kumano-1",
        "author": "Marcus Sterling",
        "rating": 5,
        "date": "2025-11-14",
        "travelerType": "Pilgrim",
        "comment": "Walking through Daimon-zaka under 800-year-old giant cryptomerias to see the red three-story pagoda with Nachi Falls in the backdrop is iconic."
      },
      {
        "id": "rev-kumano-2",
        "author": "Aoi Shimizu",
        "rating": 5,
        "date": "2025-04-20",
        "travelerType": "Solo Hiker",
        "comment": "Soaking in Tsuboyu bath at Yunomine after three days of mountain hiking washed away every ounce of exhaustion."
      }
    ]
  },
  {
    "id": "takayama-hida",
    "name": "Takayama & Hida Alpine Valley",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/takayama-old-town.jpg",
    "gallery": [
      "/images/destinations/takayama-old-town.jpg"
    ],
    "description": "A remarkably preserved Edo-period merchant town framed by the northern Japanese Alps, timber sake breweries, and morning riverside markets.",
    "culture": "Master Hida timber craftsmanship, centuries-old sake brewing dynasties, and the elaborate Takayama Matsuri festival floats.",
    "vibe": "Nostalgic, Historic Edo, Mountain Serenity",
    "rating": 4.92,
    "reviewCount": 450,
    "coordinates": {
      "lat": 36.1461,
      "lng": 137.2522
    },
    "elevation": "573 m (1,880 ft)",
    "bestSeason": "Apr (Spring Festival) or Oct (Autumn Foliage & Festival)",
    "category": "cultural",
    "purposes": [
      "culture",
      "food",
      "calm",
      "romantic"
    ],
    "budgetUSD": 890,
    "budgetTier": "explorer",
    "highlights": [
      "Sanmachi Suji Historic Timber Quarter",
      "Miyagawa Morning Riverside Market",
      "Hida Folk Village Open-Air Museum",
      "Sake Brewery Tasting Crawl"
    ],
    "localDelicacy": "A5 Hida Beef Sushi & Warm Mitarashi Dango",
    "flightBenchmarkUSD": {
      "mumbai": 590,
      "delhi": 610,
      "newyork": 970,
      "london": 820,
      "dubai": 650,
      "tokyo": 70,
      "sydney": 720,
      "paris": 840,
      "singapore": 360,
      "toronto": 1040,
      "default": 650
    },
    "reviews": [
      {
        "id": "rev-taka-1",
        "author": "Nathan Cole",
        "rating": 5,
        "date": "2026-02-12",
        "travelerType": "Foodie",
        "comment": "Tasting melt-in-the-mouth A5 Hida beef sushi on a rice cracker while walking through snowy Edo timber alleyways is an essential Japan memory."
      },
      {
        "id": "rev-taka-2",
        "author": "Yuki Takahashi",
        "rating": 5,
        "date": "2025-10-09",
        "travelerType": "Culture Buff",
        "comment": "The timber craftsmanship and morning market along the river make Takayama feel wonderfully authentic."
      }
    ]
  },
  {
    "id": "miyajima",
    "name": "Miyajima & Floating Torii",
    "country": "Japan",
    "region": "Asia",
    "image": "/images/destinations/miyajima-floating-torii.jpg",
    "gallery": [
      "/images/destinations/miyajima-floating-torii.jpg"
    ],
    "description": "The sacred island where gods and humans coexist, famed for its crimson vermilion torii gate floating on the high tide waters of the Seto Sea.",
    "culture": "Shinto sacred island taboos, tame sacred deer roaming freely, and Mt. Misen eternal flame burning for 1,200 years.",
    "vibe": "Spiritual, Sacred Island, Sunset Glow",
    "rating": 4.94,
    "reviewCount": 680,
    "coordinates": {
      "lat": 34.2958,
      "lng": 132.3197
    },
    "elevation": "535 m (Mount Misen Summit)",
    "bestSeason": "Mar – May (Cherry Blossoms) or Oct – Nov (Red Maples)",
    "category": "spiritual",
    "purposes": [
      "spiritual",
      "culture",
      "romantic",
      "photography"
    ],
    "budgetUSD": 850,
    "budgetTier": "explorer",
    "highlights": [
      "Itsukushima Floating Shrine at High Tide",
      "Mount Misen Ropeway & Summit View",
      "Momijidani Maple Leaf Valley Walk",
      "Tame Shika Deer Encounters"
    ],
    "localDelicacy": "Grilled Miyajima Oysters & Momiji Manju Maple Cakes",
    "flightBenchmarkUSD": {
      "mumbai": 610,
      "delhi": 640,
      "newyork": 990,
      "london": 840,
      "dubai": 670,
      "tokyo": 100,
      "sydney": 740,
      "paris": 870,
      "singapore": 380,
      "toronto": 1070,
      "default": 670
    },
    "reviews": [
      {
        "id": "rev-miya-1",
        "author": "Leila Farrokh",
        "rating": 5,
        "date": "2025-11-25",
        "travelerType": "Romantic",
        "comment": "Watching the floating torii gate silhouette against a golden sunset while the tide rolled in was one of the most sublime sights of my life."
      },
      {
        "id": "rev-miya-2",
        "author": "Hiroshi Sato",
        "rating": 5,
        "date": "2025-05-16",
        "travelerType": "Photographer",
        "comment": "Stay overnight on the island after the day tourists leave. The shrine illuminated at night in complete silence is ethereal."
      }
    ]
  },
  {
    "id": "plitvice-lakes",
    "name": "Plitvice Lakes Cascades",
    "country": "Croatia",
    "region": "Europe",
    "image": "/images/destinations/plitvice-lakes-waterfalls.jpg",
    "gallery": [
      "/images/destinations/plitvice-lakes-waterfalls.jpg"
    ],
    "description": "Sixteen terraced crystal lakes interconnected by ninety thundering waterfalls, tumbling through lush karst limestone canyons.",
    "culture": "Dinaric Alps natural conservation legacy, Croatian wooden boardwalk craftsmanship, and karst travertine science.",
    "vibe": "Fairytale Turquoise, Rushing Waters, Forest Eden",
    "rating": 4.93,
    "reviewCount": 740,
    "coordinates": {
      "lat": 44.8654,
      "lng": 15.608
    },
    "elevation": "636 m (Lake System)",
    "bestSeason": "May – Jun (Full Waterfalls) or Oct (Autumn Colors)",
    "category": "adventure",
    "purposes": [
      "nature",
      "adventure",
      "photography",
      "romantic"
    ],
    "budgetUSD": 690,
    "budgetTier": "explorer",
    "highlights": [
      "Veliki Slap (Great Waterfall) Lookout",
      "Lower Lakes Wooden Boardwalk Trail",
      "Upper Lakes Silent Electric Boat Ride",
      "Canyon Overlook Panoramic Viewpoint"
    ],
    "localDelicacy": "Lika Lamb under the Peka & Fresh River Trout",
    "flightBenchmarkUSD": {
      "mumbai": 590,
      "delhi": 620,
      "newyork": 680,
      "london": 120,
      "dubai": 390,
      "tokyo": 860,
      "sydney": 1250,
      "paris": 140,
      "singapore": 690,
      "toronto": 720,
      "default": 440
    },
    "reviews": [
      {
        "id": "rev-plit-1",
        "author": "Dario Horvat",
        "rating": 5,
        "date": "2025-06-18",
        "travelerType": "Nature Lover",
        "comment": "Walking on wooden boardwalks inches above crystal turquoise water filled with swimming fish while waterfalls roar around you is paradise."
      },
      {
        "id": "rev-plit-2",
        "author": "Anna Kowalska",
        "rating": 5,
        "date": "2025-10-05",
        "travelerType": "Photographer",
        "comment": "In October the beech trees turn flaming gold and contrast against emerald water. Truly mesmerizing."
      }
    ]
  },
  {
    "id": "faroe-gasadalur",
    "name": "Faroe Islands & Gásadalur",
    "country": "Faroe Islands",
    "region": "Europe",
    "image": "/images/destinations/faroe-gasadalur.jpg",
    "gallery": [
      "/images/destinations/faroe-gasadalur.jpg"
    ],
    "description": "An untamed North Atlantic archipelago of sheer basalt cliffs, grass-roofed hamlets, and waterfalls plunging straight into the ocean.",
    "culture": "Nordic Faroese seafaring traditions, grass turf roofing architecture, and remote community chain-dancing.",
    "vibe": "Primeval, Moody, Epic Atlantic Solitude",
    "rating": 4.95,
    "reviewCount": 310,
    "coordinates": {
      "lat": 62.1074,
      "lng": -7.4361
    },
    "elevation": "882 m (Slættaratindur)",
    "bestSeason": "Jun – Aug (Puffins & Lush Green Slopes)",
    "category": "polar",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 1680,
    "budgetTier": "luxury",
    "highlights": [
      "Múlafossur Waterfall at Gásadalur",
      "Kallur Lighthouse Dramatic Cliff Edge",
      "Saksun Tidal Lagoon & Turf Farmhouses",
      "Mykines Island Puffin Colony Trail"
    ],
    "localDelicacy": "Faroese Salmon, Fermented Mutton (Skerpikjøt) & Rhubarb Cake",
    "flightBenchmarkUSD": {
      "mumbai": 890,
      "delhi": 920,
      "newyork": 750,
      "london": 220,
      "dubai": 790,
      "tokyo": 1180,
      "sydney": 1580,
      "paris": 280,
      "singapore": 1020,
      "toronto": 790,
      "default": 620
    },
    "reviews": [
      {
        "id": "rev-faroe-1",
        "author": "Jónas Rasmussen",
        "rating": 5,
        "date": "2025-07-15",
        "travelerType": "Landscape Photographer",
        "comment": "Standing at the edge of Gásadalur watching Múlafossur waterfall plunge into the wild Atlantic while sea spray hits your face is unmatched."
      },
      {
        "id": "rev-faroe-2",
        "author": "Jessica Miller",
        "rating": 5,
        "date": "2025-08-03",
        "travelerType": "Solo Driver",
        "comment": "Driving through the one-lane subsea tunnels and winding between sheer green fjord cliffs is the greatest road trip in Europe."
      }
    ]
  },
  {
    "id": "meteora-greece",
    "name": "Meteora Monastery Pinnacles",
    "country": "Greece",
    "region": "Europe",
    "image": "/images/destinations/meteora-monasteries.jpg",
    "gallery": [
      "/images/destinations/meteora-monasteries.jpg"
    ],
    "description": "Massive monolithic sandstone pillars rising 400 meters above the Thessalian plain, crowned with 14th-century Byzantine monasteries.",
    "culture": "Eastern Orthodox monastic hermitage, Byzantine fresco artistry, and ancient rock-climbing asceticism.",
    "vibe": "Suspended in Air, Sacred, Dramatic Stone",
    "rating": 4.94,
    "reviewCount": 520,
    "coordinates": {
      "lat": 39.7217,
      "lng": 21.6306
    },
    "elevation": "613 m (High Monasteries)",
    "bestSeason": "Apr – Jun & Sep – Nov (Clear Golden Skies)",
    "category": "spiritual",
    "purposes": [
      "spiritual",
      "culture",
      "photography",
      "history"
    ],
    "budgetUSD": 680,
    "budgetTier": "explorer",
    "highlights": [
      "Great Meteoron & Varlaam Monasteries",
      "Sunset from Psaropetra Rock Viewpoint",
      "Holy Trinity James Bond Monastery Hike",
      "Hermit Cave Trail Exploration"
    ],
    "localDelicacy": "Thessalian Lamb Kleftiko, Spanakopita & Tsipouro",
    "flightBenchmarkUSD": {
      "mumbai": 520,
      "delhi": 550,
      "newyork": 640,
      "london": 140,
      "dubai": 360,
      "tokyo": 830,
      "sydney": 1190,
      "paris": 130,
      "singapore": 660,
      "toronto": 690,
      "default": 410
    },
    "reviews": [
      {
        "id": "rev-met-1",
        "author": "Nikos Alexopoulos",
        "rating": 5,
        "date": "2025-09-22",
        "travelerType": "Historian",
        "comment": "Meteora literally means “suspended in air”. Seeing monasteries perched on needle-thin rock spires feels defying of physical laws."
      },
      {
        "id": "rev-met-2",
        "author": "Laura Evans",
        "rating": 5,
        "date": "2025-05-11",
        "travelerType": "Sunset Chaser",
        "comment": "Watching the sunset over the stone giants from Psaropetra with the valley glowing gold was deeply moving."
      }
    ]
  },
  {
    "id": "lauterbrunnen",
    "name": "Lauterbrunnen Valley of 72 Waterfalls",
    "country": "Switzerland",
    "region": "Europe",
    "image": "/images/destinations/lauterbrunnen-valley.jpg",
    "gallery": [
      "/images/destinations/lauterbrunnen-valley.jpg"
    ],
    "description": "A dramatic alpine U-shaped glacial valley flanked by towering 300-meter vertical limestone walls and 72 cascading waterfalls beneath the Jungfrau.",
    "culture": "Swiss alpine farming, Tolkien Rivendell literary inspiration, and precision mountain cogwheel railway engineering.",
    "vibe": "Tolkien Rivendell, Alpine Glory, Thundering Falls",
    "rating": 4.96,
    "reviewCount": 890,
    "coordinates": {
      "lat": 46.5935,
      "lng": 7.9091
    },
    "elevation": "795 m (Valley Floor) to 4,158 m (Jungfrau)",
    "bestSeason": "May – Sep (Lush Falls & Hiking) or Dec – Mar (Winter Ski Paradise)",
    "category": "mountain",
    "purposes": [
      "adventure",
      "romantic",
      "nature",
      "photography"
    ],
    "budgetUSD": 1580,
    "budgetTier": "luxury",
    "highlights": [
      "Staubbach Waterfall Spray Walk",
      "Trümmelbach Underground Glacier Waterfalls",
      "Mürren Cliffside Village Tram",
      "Jungfraujoch Top of Europe Train"
    ],
    "localDelicacy": "Swiss Cheese Fondue, Rösti with Fried Egg & Alpine Chocolate",
    "flightBenchmarkUSD": {
      "mumbai": 620,
      "delhi": 650,
      "newyork": 580,
      "london": 90,
      "dubai": 410,
      "tokyo": 820,
      "sydney": 1210,
      "paris": 80,
      "singapore": 710,
      "toronto": 650,
      "default": 420
    },
    "reviews": [
      {
        "id": "rev-laut-1",
        "author": "Hansueli Steiner",
        "rating": 5,
        "date": "2025-07-09",
        "travelerType": "Alpine Hiker",
        "comment": "Walking down the valley floor with Staubbach Falls misting over Swiss chalets and cowbells chiming in the meadows is real-life Tolkien Rivendell."
      },
      {
        "id": "rev-laut-2",
        "author": "Claire Beaumont",
        "rating": 5,
        "date": "2025-08-25",
        "travelerType": "Couple",
        "comment": "Trümmelbach falls inside the mountain carving through rock at 20,000 liters per second is mind-blowing."
      }
    ]
  },
  {
    "id": "isle-of-skye",
    "name": "Isle of Skye & The Quiraing",
    "country": "Scotland, UK",
    "region": "Europe",
    "image": "/images/destinations/isle-of-skye-quiraing.jpg",
    "gallery": [
      "/images/destinations/isle-of-skye-quiraing.jpg"
    ],
    "description": "An ethereal Scottish island of dramatic landslips, geological needle spires, crystal fairy pools, and misty Atlantic sea lochs.",
    "culture": "Gaelic language preservation, Highland clan battle heritage, and single malt peated whisky distilling traditions.",
    "vibe": "Moody, Cinematic, Mythic Highland Beauty",
    "rating": 4.93,
    "reviewCount": 620,
    "coordinates": {
      "lat": 57.5359,
      "lng": -6.2625
    },
    "elevation": "543 m (Quiraing Ridge)",
    "bestSeason": "May – Sep (Long Daylight & Mild Weather)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 1100,
    "budgetTier": "explorer",
    "highlights": [
      "The Quiraing Geological Ridge Circuit",
      "Old Man of Storr Pinnacles Hike",
      "Fairy Pools Aqua Waterfalls Walk",
      "Neist Point Lighthouse Sunset"
    ],
    "localDelicacy": "Cullen Skink (Smoked Haddock Chowder) & Talisker Single Malt",
    "flightBenchmarkUSD": {
      "mumbai": 680,
      "delhi": 710,
      "newyork": 520,
      "london": 70,
      "dubai": 460,
      "tokyo": 890,
      "sydney": 1280,
      "paris": 90,
      "singapore": 780,
      "toronto": 590,
      "default": 390
    },
    "reviews": [
      {
        "id": "rev-skye-1",
        "author": "Callum MacLeod",
        "rating": 5,
        "date": "2025-06-30",
        "travelerType": "Highland Guide",
        "comment": "The Quiraing landslip is the most dramatic landscape in the British Isles. Walking through the Needle and Prison rock formations at dawn is surreal."
      },
      {
        "id": "rev-skye-2",
        "author": "Emma Watson",
        "rating": 5,
        "date": "2025-08-17",
        "travelerType": "Solo Adventurer",
        "comment": "Swimming in the icy turquoise Fairy Pools under the Black Cuillin mountains was the highlight of my Scotland trip."
      }
    ]
  },
  {
    "id": "cinque-terre",
    "name": "Cinque Terre & Manarola",
    "country": "Italy",
    "region": "Europe",
    "image": "/images/destinations/cinque-terre-manarola.jpg",
    "gallery": [
      "/images/destinations/cinque-terre-manarola.jpg"
    ],
    "description": "Five brightly colored fishing villages clinging to rugged Ligurian cliffs, linked by coastal vineyard trails and cobalt Mediterranean seas.",
    "culture": "Centuries-old dry-stone terrace viticulture (Sciacchetrà wine), pesto Genovese traditions, and Ligurian maritime fishing.",
    "vibe": "Pastel Charm, Sun-Drenched, Mediterranean Joy",
    "rating": 4.91,
    "reviewCount": 950,
    "coordinates": {
      "lat": 44.107,
      "lng": 9.7289
    },
    "elevation": "100 m (Cliffside)",
    "bestSeason": "Apr – Jun & Sep – Oct (Optimal Hiking Weather)",
    "category": "coastal",
    "purposes": [
      "romantic",
      "coastal",
      "food",
      "photography"
    ],
    "budgetUSD": 1250,
    "budgetTier": "luxury",
    "highlights": [
      "Sentiero Azzurro Cliffside Hiking Trail",
      "Manarola Sunset from Nessun Dorma",
      "Vernazza Natural Harbor & Castle",
      "Monterosso Fegina Sandy Beach"
    ],
    "localDelicacy": "Fresh Trofie Pasta with Genovese Pesto & Fried Calamari in Cones",
    "flightBenchmarkUSD": {
      "mumbai": 590,
      "delhi": 620,
      "newyork": 610,
      "london": 110,
      "dubai": 400,
      "tokyo": 840,
      "sydney": 1180,
      "paris": 90,
      "singapore": 720,
      "toronto": 680,
      "default": 420
    },
    "reviews": [
      {
        "id": "rev-cinque-1",
        "author": "Giulia Conti",
        "rating": 5,
        "date": "2025-09-15",
        "travelerType": "Couple",
        "comment": "Sitting at Nessun Dorma in Manarola overlooking the colorful harbor with a glass of local white wine and pesto bruschetta is heaven."
      },
      {
        "id": "rev-cinque-2",
        "author": "Daniel Thorne",
        "rating": 5,
        "date": "2025-05-28",
        "travelerType": "Coastal Hiker",
        "comment": "The coastal walk between Vernazza and Monterosso through the vineyards with ocean views is exhilarating."
      }
    ]
  },
  {
    "id": "huacachina",
    "name": "Huacachina Desert Oasis",
    "country": "Peru",
    "region": "Americas",
    "image": "/images/destinations/huacachina-oasis.jpg",
    "gallery": [
      "/images/destinations/huacachina-oasis.jpg"
    ],
    "description": "A genuine desert oasis surrounded by massive golden sand dunes, palm trees, and emerald waters, nestled in the Peruvian coastal desert.",
    "culture": "Inca coastal legends of the weeping princess mermaid, Pisco brandy distilling in the Ica Valley, and desert sandboarding culture.",
    "vibe": "Exhilarating, Oasis Mirage, Golden Dunes",
    "rating": 4.88,
    "reviewCount": 410,
    "coordinates": {
      "lat": -14.0875,
      "lng": -75.7633
    },
    "elevation": "400 m (1,312 ft)",
    "bestSeason": "Year-round (Warm & Sunny Desert Climate)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "solo",
      "photography"
    ],
    "budgetUSD": 490,
    "budgetTier": "backpacker",
    "highlights": [
      "High-Speed Dune Buggy Rollercoaster Tour",
      "Sandboarding Down 100m Desert Slopes",
      "Oasis Lagoon Paddleboat Sunset",
      "Ica Valley Pisco Vineyard Tastings"
    ],
    "localDelicacy": "Ceviche Mixto with Sweet Potato & Pisco Sour",
    "flightBenchmarkUSD": {
      "mumbai": 1250,
      "delhi": 1290,
      "newyork": 580,
      "london": 780,
      "dubai": 1150,
      "tokyo": 1380,
      "sydney": 1480,
      "paris": 820,
      "singapore": 1420,
      "toronto": 650,
      "default": 890
    },
    "reviews": [
      {
        "id": "rev-huaca-1",
        "author": "Carlos Mendoza",
        "rating": 5,
        "date": "2025-11-19",
        "travelerType": "Thrill Seeker",
        "comment": "The dune buggy tour is like a real-life rollercoaster on sand! Then watching the sun sink into the desert dunes from the top is breathtaking."
      },
      {
        "id": "rev-huaca-2",
        "author": "Maya Lin",
        "rating": 5,
        "date": "2025-08-14",
        "travelerType": "Backpacker",
        "comment": "Sandboarding face-first down gigantic golden dunes was terrifying and incredible. Great desert vibe!"
      }
    ]
  },
  {
    "id": "atacama-desert",
    "name": "Atacama Desert & Valle de la Luna",
    "country": "Chile",
    "region": "Americas",
    "image": "/images/destinations/atacama-moon-valley.jpg",
    "gallery": [
      "/images/destinations/atacama-moon-valley.jpg"
    ],
    "description": "The driest non-polar desert on Earth, showcasing sculpted salt mountain canyons, explosive geyser fields, and the clearest stargazing skies on the planet.",
    "culture": "Atacameño (Lickanantay) indigenous adobe settlements, ALMA observatory astronomical science, and ancient salt caravan trails.",
    "vibe": "Martian, Stargazer Heaven, Silent Salt",
    "rating": 4.96,
    "reviewCount": 540,
    "coordinates": {
      "lat": -22.91,
      "lng": -68.29
    },
    "elevation": "2,408 m (San Pedro) to 4,320 m (El Tatio)",
    "bestSeason": "Year-round (Virtually Zero Rainfall & Crystal Skies)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 1150,
    "budgetTier": "explorer",
    "highlights": [
      "Valle de la Luna Sunset over Salt Amphitheater",
      "El Tatio Geysers Dawn Steam Eruption",
      "Laguna Cejar Float in Saturated Salt Water",
      "ALMA Plateau Astronomical Stargazing Tour"
    ],
    "localDelicacy": "Pastel de Choclo (Corn & beef pie) & Rica-Rica Pisco Sour",
    "flightBenchmarkUSD": {
      "mumbai": 1350,
      "delhi": 1390,
      "newyork": 820,
      "london": 910,
      "dubai": 1250,
      "tokyo": 1520,
      "sydney": 1350,
      "paris": 940,
      "singapore": 1580,
      "toronto": 890,
      "default": 1100
    },
    "reviews": [
      {
        "id": "rev-ata-1",
        "author": "Dr. Sebastian Ortiz",
        "rating": 5,
        "date": "2026-01-07",
        "travelerType": "Astronomer",
        "comment": "There are no words for the night sky in Atacama. Looking through a telescope into the Magellanic Clouds with zero light pollution was transcendent."
      },
      {
        "id": "rev-ata-2",
        "author": "Elena Rostova",
        "rating": 5,
        "date": "2025-10-23",
        "travelerType": "Photographer",
        "comment": "Valle de la Luna looks identical to Mars. Floating effortlessly in Laguna Cejar’s salt water was an amazing experience."
      }
    ]
  },
  {
    "id": "semuc-champey",
    "name": "Semuc Champey Turquoise Pools",
    "country": "Guatemala",
    "region": "Americas",
    "image": "/images/destinations/semuc-champey-pools.jpg",
    "gallery": [
      "/images/destinations/semuc-champey-pools.jpg"
    ],
    "description": "A natural 300-meter limestone bridge tiered with stepped turquoise pools, hidden deep in the lush mountain jungles of Alta Verapaz.",
    "culture": "Qʼeqchiʼ Maya indigenous forest traditions, local organic cacao chocolate making, and cave reverence.",
    "vibe": "Jungle Oasis, Emerald Pools, Wild Exploration",
    "rating": 4.91,
    "reviewCount": 280,
    "coordinates": {
      "lat": 15.5347,
      "lng": -89.9622
    },
    "elevation": "350 m (Jungle Valley)",
    "bestSeason": "Dec – Apr (Dry Season with Clearest Turquoise Water)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "solo"
    ],
    "budgetUSD": 420,
    "budgetTier": "backpacker",
    "highlights": [
      "Swimming in Tiered Turquoise Limestone Pools",
      "El Mirador Jungle Canopy Lookout Hike",
      "Kanba Candlelit Water Cave Tour",
      "Cahabón River Tube Drifting"
    ],
    "localDelicacy": "Kaq'ik (Traditional Mayan spicy turkey soup) & Hand-Ground Mayan Cacao",
    "flightBenchmarkUSD": {
      "mumbai": 1200,
      "delhi": 1250,
      "newyork": 420,
      "london": 720,
      "dubai": 1100,
      "tokyo": 1350,
      "sydney": 1450,
      "paris": 750,
      "singapore": 1380,
      "toronto": 490,
      "default": 780
    },
    "reviews": [
      {
        "id": "rev-semuc-1",
        "author": "Mateo Xol",
        "rating": 5,
        "date": "2025-12-18",
        "travelerType": "Adventurer",
        "comment": "Swimming through the dark Kanba water caves holding a single candle, then jumping into crystal turquoise limestone pools is unforgettable."
      },
      {
        "id": "rev-semuc-2",
        "author": "Sophie Taylor",
        "rating": 5,
        "date": "2025-02-14",
        "travelerType": "Nature Lover",
        "comment": "The steep hike to El Mirador viewpoint gives you the postcard view of the entire stepped pool system nestled in dense jungle."
      }
    ]
  },
  {
    "id": "fernando-noronha",
    "name": "Fernando de Noronha Marine Sanctuary",
    "country": "Brazil",
    "region": "Americas",
    "image": "/images/destinations/fernando-noronha.jpg",
    "gallery": [
      "/images/destinations/fernando-noronha.jpg"
    ],
    "description": "A strictly protected volcanic archipelago 350 km off Brazil’s coast, boasting Baía do Sancho (frequently voted the world’s best beach), spinner dolphins, and sea turtles.",
    "culture": "Strict eco-tourism sustainability quotas, Brazilian Atlantic maritime heritage, and world-class marine biology conservation.",
    "vibe": "Exclusive Paradise, Wild Ocean, Emerald Water",
    "rating": 4.97,
    "reviewCount": 310,
    "coordinates": {
      "lat": -3.8577,
      "lng": -32.4297
    },
    "elevation": "323 m (Morro do Pico)",
    "bestSeason": "Aug – Dec (Calm Seas & 50m Underwater Visibility)",
    "category": "coastal",
    "purposes": [
      "romantic",
      "wildlife",
      "coastal",
      "nature"
    ],
    "budgetUSD": 2450,
    "budgetTier": "luxury",
    "highlights": [
      "Baía do Sancho Cliff Ladder & Beach",
      "Baía dos Golfinhos Spinner Dolphin Dawn Watch",
      "Snorkeling with Sea Turtles at Baía do Sueste",
      "Morro do Pico Sunset Boat Tour"
    ],
    "localDelicacy": "Moqueca de Peixe (Bahian seafood stew with coconut & dendê oil)",
    "flightBenchmarkUSD": {
      "mumbai": 1450,
      "delhi": 1490,
      "newyork": 890,
      "london": 820,
      "dubai": 1300,
      "tokyo": 1650,
      "sydney": 1550,
      "paris": 850,
      "singapore": 1600,
      "toronto": 950,
      "default": 1100
    },
    "reviews": [
      {
        "id": "rev-noronha-1",
        "author": "Rodrigo Silva",
        "rating": 5,
        "date": "2025-11-28",
        "travelerType": "Marine Diver",
        "comment": "Snorkeling at Baía dos Porcos with Morro Dois Irmãos in front of you while rays and sea turtles glide alongside is pure ecstasy."
      },
      {
        "id": "rev-noronha-2",
        "author": "Beatriz Costa",
        "rating": 5,
        "date": "2025-09-12",
        "travelerType": "Couple",
        "comment": "The strict visitor limit means the beaches are virtually empty. Baía do Sancho truly deserves its title as the world’s best beach."
      }
    ]
  },
  {
    "id": "sedona",
    "name": "Sedona Red Rock Vortex Canyons",
    "country": "USA",
    "region": "Americas",
    "image": "/images/destinations/sedona-cathedral-rock.jpg",
    "gallery": [
      "/images/destinations/sedona-cathedral-rock.jpg"
    ],
    "description": "Towering rust-red sandstone buttes and pine canyons renowned for their spiritual energy vortexes, scenic desert trails, and dark sky stargazing.",
    "culture": "Yavapai-Apache ancestral lands, New Age metaphysical vortex meditation, and Southwest artisan art colonies.",
    "vibe": "Spiritual, Red Rock Magic, Desert Zenith",
    "rating": 4.92,
    "reviewCount": 780,
    "coordinates": {
      "lat": 34.8697,
      "lng": -111.761
    },
    "elevation": "1,326 m (4,350 ft)",
    "bestSeason": "Mar – May & Sep – Nov (Pleasant Sun & Blooming Desert)",
    "category": "spiritual",
    "purposes": [
      "spiritual",
      "nature",
      "adventure",
      "romantic"
    ],
    "budgetUSD": 1150,
    "budgetTier": "luxury",
    "highlights": [
      "Cathedral Rock Vortex Scramble",
      "Devil’s Bridge Natural Red Rock Arch Hike",
      "Bell Rock Sunrise Meditation",
      "Oak Creek Canyon Scenic Drive"
    ],
    "localDelicacy": "Prickly Pear Cactus Glazed Salmon & Navajo Fry Bread",
    "flightBenchmarkUSD": {
      "mumbai": 1050,
      "delhi": 1080,
      "newyork": 280,
      "london": 580,
      "dubai": 920,
      "tokyo": 850,
      "sydney": 1150,
      "paris": 610,
      "singapore": 1100,
      "toronto": 320,
      "default": 550
    },
    "reviews": [
      {
        "id": "rev-sed-1",
        "author": "Maya Lin",
        "rating": 5,
        "date": "2025-10-14",
        "travelerType": "Spiritual Seeker",
        "comment": "Climbing Cathedral Rock at sunset and sitting on the ledge looking out over the glowing red canyons was deeply rejuvenating."
      },
      {
        "id": "rev-sed-2",
        "author": "David Miller",
        "rating": 5,
        "date": "2025-04-22",
        "travelerType": "Hiker",
        "comment": "Devil’s Bridge early in the morning before crowds arrive is one of the most stunning photo spots in the American Southwest."
      }
    ]
  },
  {
    "id": "jiuzhaigou",
    "name": "Jiuzhaigou Multi-Tiered Lakes",
    "country": "China",
    "region": "Asia",
    "image": "/images/destinations/jiuzhaigou-lakes.jpg",
    "gallery": [
      "/images/destinations/jiuzhaigou-lakes.jpg"
    ],
    "description": "A legendary high-altitude Tibetan valley containing over 100 multi-tiered turquoise and emerald lakes, multi-level waterfalls, and snow-capped Min mountains.",
    "culture": "Tibetan and Qiang minority villages, prayer wheel shrines, and centuries-old folklore of a shattered celestial goddess mirror.",
    "vibe": "Fairytale Mirrors, Sacred Turquoise, Multi-Color Waters",
    "rating": 4.96,
    "reviewCount": 610,
    "coordinates": {
      "lat": 33.26,
      "lng": 103.9186
    },
    "elevation": "2,400 m to 3,100 m",
    "bestSeason": "Sep – Nov (Peak Autumn Foliage Reflections)",
    "category": "adventure",
    "purposes": [
      "nature",
      "photography",
      "culture",
      "calm"
    ],
    "budgetUSD": 920,
    "budgetTier": "explorer",
    "highlights": [
      "Five Flower Lake (Wuhua Hai) Crystal Floor",
      "Nuorilang Multi-Tiered Waterfall",
      "Long Lake (Chang Hai) Alpine Mirror",
      "Pearl Shoal Waterfall Walkway"
    ],
    "localDelicacy": "Tibetan Yak Butter Tea, Roasted Barley Tsampa & Sichuan Hot Pot",
    "flightBenchmarkUSD": {
      "mumbai": 650,
      "delhi": 680,
      "newyork": 1100,
      "london": 890,
      "dubai": 750,
      "tokyo": 450,
      "sydney": 890,
      "paris": 920,
      "singapore": 390,
      "toronto": 1150,
      "default": 720
    },
    "reviews": [
      {
        "id": "rev-jiu-1",
        "author": "Chen Wei",
        "rating": 5,
        "date": "2025-10-20",
        "travelerType": "Photographer",
        "comment": "Five Flower Lake looks like liquid gemstones. You can see ancient submerged tree trunks perfectly preserved under 10 meters of crystal turquoise water."
      },
      {
        "id": "rev-jiu-2",
        "author": "Katarina Novak",
        "rating": 5,
        "date": "2025-09-15",
        "travelerType": "Nature Lover",
        "comment": "The scale of the waterfalls and the clarity of the water against the alpine mountains makes Jiuzhaigou the most beautiful national park in China."
      }
    ]
  },
  {
    "id": "ha-long-bay",
    "name": "Ha Long Bay & Cat Ba Karsts",
    "country": "Vietnam",
    "region": "Asia",
    "image": "/images/destinations/ha-long-bay-karsts.jpg",
    "gallery": [
      "/images/destinations/ha-long-bay-karsts.jpg"
    ],
    "description": "Thousands of towering limestone karst islands and islets emerging from emerald waters, riddled with mystical caves and floating fishing villages.",
    "culture": "Vietnamese Dragon descent mythology, floating pearl farming hamlets, and traditional wooden junk boat sailing heritage.",
    "vibe": "Ethereal, Mist-Draped Karsts, Emerald Waters",
    "rating": 4.91,
    "reviewCount": 880,
    "coordinates": {
      "lat": 20.9101,
      "lng": 107.1839
    },
    "elevation": "10 m (Sea Level)",
    "bestSeason": "Oct – Dec & Mar – May (Pleasant Sun & Gentle Breezes)",
    "category": "coastal",
    "purposes": [
      "romantic",
      "coastal",
      "adventure",
      "nature"
    ],
    "budgetUSD": 650,
    "budgetTier": "explorer",
    "highlights": [
      "Overnight Wooden Junk Boat Cruise",
      "Kayaking through Luon Cave Sea Arch",
      "Sung Sot (Surprise) Mammoth Cavern",
      "Ti Top Island Panoramic Summit View"
    ],
    "localDelicacy": "Ha Long Squid Patties (Chả Mực), Steamed Crab & Vietnamese Egg Coffee",
    "flightBenchmarkUSD": {
      "mumbai": 380,
      "delhi": 410,
      "newyork": 890,
      "london": 680,
      "dubai": 480,
      "tokyo": 390,
      "sydney": 620,
      "paris": 710,
      "singapore": 180,
      "toronto": 950,
      "default": 480
    },
    "reviews": [
      {
        "id": "rev-halong-1",
        "author": "Nguyen Van Minh",
        "rating": 5,
        "date": "2025-11-12",
        "travelerType": "Couple",
        "comment": "Waking up on a traditional wooden boat to sunrise over hundreds of limestone karsts draped in morning mist is pure poetry."
      },
      {
        "id": "rev-halong-2",
        "author": "Tom Henderson",
        "rating": 5,
        "date": "2025-04-19",
        "travelerType": "Kayaker",
        "comment": "Kayaking through narrow sea tunnels into enclosed emerald lagoons filled with monkeys was the highlight of Vietnam."
      }
    ]
  },
  {
    "id": "sigiriya",
    "name": "Sigiriya Ancient Lion Rock",
    "country": "Sri Lanka",
    "region": "Asia",
    "image": "/images/destinations/sigiriya-rock-fortress.jpg",
    "gallery": [
      "/images/destinations/sigiriya-rock-fortress.jpg"
    ],
    "description": "A 200-meter sheer granite rock column crowning a 5th-century royal palace citadel with landscaped water gardens and ancient painted frescoes.",
    "culture": "King Kashyapa 5th-century imperial dynasty, ancient Sinhala mirror-wall poetry, and early hydraulic water garden engineering.",
    "vibe": "Majestic, Ancient Monolith, Royal Jungle Citadel",
    "rating": 4.94,
    "reviewCount": 650,
    "coordinates": {
      "lat": 7.957,
      "lng": 80.7603
    },
    "elevation": "349 m (Rock Summit)",
    "bestSeason": "Dec – Apr (Dry & Clear Skies)",
    "category": "cultural",
    "purposes": [
      "culture",
      "history",
      "adventure",
      "photography"
    ],
    "budgetUSD": 480,
    "budgetTier": "backpacker",
    "highlights": [
      "Climb through the Giant Lion’s Paws Gateway",
      "5th-Century Celestial Maiden Frescoes",
      "Mirror Wall Ancient Inscriptions",
      "Pidurangala Rock Sunrise View of Sigiriya"
    ],
    "localDelicacy": "Sri Lankan Kottu Roti, Black Pepper Crab & Fresh King Coconut",
    "flightBenchmarkUSD": {
      "mumbai": 140,
      "delhi": 170,
      "newyork": 890,
      "london": 590,
      "dubai": 280,
      "tokyo": 680,
      "sydney": 750,
      "paris": 620,
      "singapore": 220,
      "toronto": 920,
      "default": 290
    },
    "reviews": [
      {
        "id": "rev-sigi-1",
        "author": "Kasun Perera",
        "rating": 5,
        "date": "2026-01-16",
        "travelerType": "Historian",
        "comment": "Climbing Pidurangala rock at 5:30 AM to watch the sun rise directly behind the monumental Sigiriya Lion Rock was spiritual."
      },
      {
        "id": "rev-sigi-2",
        "author": "Anika Sharma",
        "rating": 5,
        "date": "2025-12-04",
        "travelerType": "Cultural Seeker",
        "comment": "The ancient water gardens and the preserved 1,500-year-old frescoes painted on sheer cliffside stone are mind-boggling."
      }
    ]
  },
  {
    "id": "sossusvlei",
    "name": "Sossusvlei & Deadvlei Dune 45",
    "country": "Namibia",
    "region": "Africa",
    "image": "/images/destinations/sossusvlei-deadvlei.jpg",
    "gallery": [
      "/images/destinations/sossusvlei-deadvlei.jpg"
    ],
    "description": "The ancient red sand sea of the Namib Desert: featuring 300-meter crimson dunes surrounding the surreal white clay pan and 900-year-old scorched camelthorn trees.",
    "culture": "San bushmen desert survival heritage, Topnaar Nama traditions, and the world’s oldest living desert conservation.",
    "vibe": "Hyper-Surreal, Crimson Dunes, Timeless Silence",
    "rating": 4.97,
    "reviewCount": 420,
    "coordinates": {
      "lat": -24.7271,
      "lng": 15.3439
    },
    "elevation": "570 m (Dune Basin)",
    "bestSeason": "May – Oct (Cooler Desert Days & Crisp Nights)",
    "category": "adventure",
    "purposes": [
      "adventure",
      "nature",
      "photography",
      "solo"
    ],
    "budgetUSD": 1350,
    "budgetTier": "luxury",
    "highlights": [
      "Deadvlei 900-Year-Old Camelthorn Tree Pan",
      "Sunrise Ridge Climb on Dune 45",
      "Big Daddy 325-Meter Giant Dune Descent",
      "Sesriem Canyon Geological Walk"
    ],
    "localDelicacy": "Oryx Steak with Braaied Corn & Rooibos Tea",
    "flightBenchmarkUSD": {
      "mumbai": 890,
      "delhi": 920,
      "newyork": 1100,
      "london": 780,
      "dubai": 690,
      "tokyo": 1350,
      "sydney": 1450,
      "paris": 820,
      "singapore": 980,
      "toronto": 1150,
      "default": 850
    },
    "reviews": [
      {
        "id": "rev-soss-1",
        "author": "Johannes Van Der Merwe",
        "rating": 5,
        "date": "2025-08-22",
        "travelerType": "Photographer",
        "comment": "Deadvlei at dawn is the most photographic place on Earth. Deep orange dunes, chalk-white clay, cobalt blue sky, and pitch-black 900-year-old trees."
      },
      {
        "id": "rev-soss-2",
        "author": "Elena Rostova",
        "rating": 5,
        "date": "2025-06-14",
        "travelerType": "Adventurer",
        "comment": "Running down the sheer 300-meter face of Big Daddy dune into the white pan was an absolute blast!"
      }
    ]
  },
  {
    "id": "rio-celeste",
    "name": "Rio Celeste Waterfall",
    "country": "Costa Rica",
    "region": "Americas",
    "image": "/hidden-gem-1.jpg",
    "gallery": [
      "/hidden-gem-1.jpg",
      "/mood-adventure.jpg",
      "/mood-solo.jpg"
    ],
    "description": "A magical turquoise waterfall hidden deep in the Tenorio Volcano National Park, formed by an extraordinary optical mineral collision.",
    "culture": "Costa Rican Pura Vida rainforest conservation, indigenous Maleku lore, and volcanic thermal traditions.",
    "vibe": "Magical, Electric Blue, Emerald Jungle",
    "rating": 4.95,
    "reviewCount": 240,
    "coordinates": {
      "lat": 10.7167,
      "lng": -84.9833
    },
    "elevation": "700 m (2,296 ft)",
    "bestSeason": "Dec – Apr (Dry Season & Sparkling Blue Clarity)",
    "category": "adventure",
    "purposes": ["adventure", "nature", "photography", "solo"],
    "budgetUSD": 680,
    "budgetTier": "explorer",
    "highlights": [
      "Rio Celeste 30m Turquoise Plunge Waterfall",
      "Los Teñideros River Confluence Point",
      "Borbollones Bubbling Volcanic Thermal Springs",
      "Tapir & Sloth Rainforest Sanctuary Walks"
    ],
    "localDelicacy": "Casado con Pescado & Fresh Tropical Guanábana Batido",
    "flightBenchmarkUSD": {
      "mumbai": 980,
      "delhi": 1020,
      "newyork": 380,
      "london": 650,
      "dubai": 920,
      "tokyo": 1150,
      "sydney": 1420,
      "paris": 680,
      "singapore": 1250,
      "toronto": 420,
      "default": 650
    },
    "reviews": [
      {
        "id": "rev-rc-1",
        "author": "Mateo Morales",
        "rating": 5,
        "date": "2026-01-18",
        "travelerType": "Nature Explorer",
        "comment": "The blue color of Rio Celeste looks completely fake until you see it with your own eyes in the jungle mist. Absolutely stunning."
      }
    ]
  },
  {
    "id": "vardzia",
    "name": "Vardzia Cave City",
    "country": "Georgia",
    "region": "Europe",
    "image": "/hidden-gem-2.jpg",
    "gallery": [
      "/hidden-gem-2.jpg",
      "/mood-honeymoon.jpg",
      "/mood-adventure.jpg"
    ],
    "description": "An ancient subterranean monastery carved into the sheer Erusheti cliffside, spanning 13 subterranean tiers and over 6,000 stone chambers.",
    "culture": "Golden Age Georgian Orthodox monasticism, Queen Tamar legendary legacy, and ancient 8,000-year-old Qvevri winemaking traditions.",
    "vibe": "Ancient, Mystical, Cliffside Fortress",
    "rating": 4.88,
    "reviewCount": 185,
    "coordinates": {
      "lat": 41.3811,
      "lng": 43.2842
    },
    "elevation": "1,300 m (4,265 ft)",
    "bestSeason": "May – Oct (Warm Alpine Days & Clear Valley Light)",
    "category": "cultural",
    "purposes": ["culture", "adventure", "history", "solo"],
    "budgetUSD": 540,
    "budgetTier": "explorer",
    "highlights": [
      "Church of the Dormition 12th-Century Frescoes",
      "Secret Tunnels & Royal Throne Chamber",
      "Khertvisi Fortress Canyon Overlook",
      "Qvevri Amber Wine Cellar Tasting"
    ],
    "localDelicacy": "Khachapuri & Meskhetian Apokhti Dried Beef",
    "flightBenchmarkUSD": {
      "mumbai": 420,
      "delhi": 450,
      "newyork": 690,
      "london": 260,
      "dubai": 220,
      "tokyo": 880,
      "sydney": 1250,
      "paris": 280,
      "singapore": 680,
      "toronto": 720,
      "default": 450
    },
    "reviews": [
      {
        "id": "rev-var-1",
        "author": "Sophie Lindqvist",
        "rating": 5,
        "date": "2025-09-12",
        "travelerType": "Historian",
        "comment": "Standing inside a cliff-carved monastery 13 floors above the Kura river gorge is an unforgettable journey back to the Middle Ages."
      }
    ]
  },
  {
    "id": "mosquito-bay",
    "name": "Mosquito Bay",
    "country": "Puerto Rico",
    "region": "Americas",
    "image": "/hidden-gem-3.jpg",
    "gallery": [
      "/hidden-gem-3.jpg",
      "/mood-solo.jpg",
      "/mood-honeymoon.jpg"
    ],
    "description": "The world’s brightest bioluminescent bay on Vieques Island—paddle through neon electric blue glowing waters beneath starry Caribbean skies.",
    "culture": "Taino indigenous sea lore, Vieques mangrove maritime sanctuary conservation, and vibrant Caribbean hospitality.",
    "vibe": "Ethereal, Bioluminescent, Caribbean Glow",
    "rating": 4.93,
    "reviewCount": 310,
    "coordinates": {
      "lat": 18.1008,
      "lng": -65.4489
    },
    "elevation": "0 m (Sea Level)",
    "bestSeason": "Year-round (Best on New Moon & Moonless Nights)",
    "category": "adventure",
    "purposes": ["adventure", "romantic", "nature", "photography"],
    "budgetUSD": 920,
    "budgetTier": "explorer",
    "highlights": [
      "Nighttime Clear-Bottom Kayak Starglow Tour",
      "Sun Bay Pristine White Crescent Beach",
      "Vieques Wild Horses & Mangrove Sanctuary",
      "Esperanza Sunset Boardwalk & Rum Tasting"
    ],
    "localDelicacy": "Mofongo Relleno de Mariscos (Garlic plantain with Caribbean seafood)",
    "flightBenchmarkUSD": {
      "mumbai": 950,
      "delhi": 980,
      "newyork": 280,
      "london": 590,
      "dubai": 890,
      "tokyo": 1100,
      "sydney": 1380,
      "paris": 620,
      "singapore": 1150,
      "toronto": 340,
      "default": 550
    },
    "reviews": [
      {
        "id": "rev-mb-1",
        "author": "Carlos Delgado",
        "rating": 5,
        "date": "2026-02-01",
        "travelerType": "Kayaker",
        "comment": "Every stroke of your paddle sends showers of electric neon sparkles into the water. It is pure living starlight."
      }
    ]
  }
];
