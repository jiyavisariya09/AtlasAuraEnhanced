export interface RoadmapDay {
  day: number;
  title: string;
  subtitle: string;
  description: string;
  morning: string;
  afternoon: string;
  evening: string;
  transitMode: string;
  stayRecommendation: string;
  mealHighlight: string;
}

export interface DestinationFAQItem {
  question: string;
  answer: string;
  category: 'logistics' | 'safety' | 'budget' | 'packing' | 'best-time';
}

export interface DestinationHotelItem {
  id: string;
  name: string;
  tier: 'Luxury Sanctuary' | 'Boutique Heritage' | 'Eco-Lodge' | 'Authentic Guesthouse';
  priceUSD: number;
  rating: number;
  location: string;
  features: string[];
  bestFor: string;
  bookingTip: string;
}

export interface DestinationSeasonMonth {
  month: string;
  status: 'Peak' | 'Good' | 'Fair' | 'Monsoon / Off-Season';
  tempC: string;
  rainfall: string;
  crowdLevel: 'High' | 'Moderate' | 'Low' | 'Solitude';
  highlights: string;
}

export interface DestinationEnrichedData {
  roadmap: RoadmapDay[];
  faq: DestinationFAQItem[];
  prosAndCons: {
    pros: string[];
    cons: string[];
    verdict: string;
  };
  seasonality: {
    peakSeason: { months: string; weather: string; crowds: string; tip: string };
    shoulderSeason: { months: string; weather: string; crowds: string; tip: string };
    offSeason: { months: string; weather: string; crowds: string; tip: string };
    monthlyMatrix: DestinationSeasonMonth[];
  };
  hotels: DestinationHotelItem[];
  culinary: {
    signatureDishes: Array<{ name: string; localName?: string; description: string; type: string }>;
    streetFoodAdvice: string;
    avgDailyFoodUSD: number;
    iconicDrink: string;
  };
  packingList: {
    clothing: string[];
    gear: string[];
    healthAndDocs: string[];
    insiderPackingTip: string;
  };
  culturalEtiquette: {
    customs: string[];
    tippingNorms: string;
    keyPhrases: Array<{ phrase: string; translation: string; pronunciation: string }>;
  };
}

// Bespoke detailed data repository for iconic destinations
const BESPOKE_DATA: Record<string, Partial<DestinationEnrichedData>> = {
  'salar-de-uyuni': {
    roadmap: [
      {
        day: 1,
        title: 'Arrival in Uyuni & The Great Train Cemetery',
        subtitle: 'Acclimatization, Rusting Steampunks, and Salt Mining Lineage',
        description: 'Arrive at Joya Andina Airport or overland from La Paz. Meet your expedition 4x4 crew and begin with the haunting 19th-century railway graveyard.',
        morning: 'Acclimatize in Uyuni town, drink hot coca tea, and verify 4x4 expedition gear and sat-phone comms.',
        afternoon: 'Wander the ghostly steam locomotive cemetery where British rail engines rust beneath the stark Andean sky.',
        evening: 'Drive to Colchani salt mining village; witness ancestral salt crystallization and check into an authentic salt block lodge.',
        transitMode: 'Custom high-clearance 4WD Land Cruiser',
        stayRecommendation: 'Palacio de Sal (Salt Block Architecture)',
        mealHighlight: 'Slow-braised Andean llama medallion with native quinoa risotto',
      },
      {
        day: 2,
        title: 'Crossing the Infinite White Sea & Incahuasi Island',
        subtitle: 'Optical Illusions, Hexagons, and 900-Year-Old Giant Cacti',
        description: 'Venture 80 kilometers into the heart of the salt desert. Climb Incahuasi Island—an ancient coral reef now home to towering candelabra cacti.',
        morning: 'Cross the glistening salt hexagons; stage forced-perspective optical illusion photography in the stark white void.',
        afternoon: 'Hike to the summit of Isla Incahuasi for an extraordinary 360° panorama of the endless crystalline horizon.',
        evening: 'Sunset photoshoot as the salt flat turns crimson, lavender, and electric indigo.',
        transitMode: '4WD overland salt navigation',
        stayRecommendation: 'Hotel de Sal Luna Salada',
        mealHighlight: 'Charquekan (sun-dried spiced beef with native corn and cheese)',
      },
      {
        day: 3,
        title: 'High-Altitude Lagoons & The Eduardo Avaroa Reserve',
        subtitle: 'Volcanic Geysers, Red Waters, and Andean Flamingo Flocks',
        description: 'Ascend into the rugged Altiplano where mineral-rich volcanic lagoons glow blood-red and emerald green beneath snow-capped volcanic cones.',
        morning: 'Explore Laguna Hedionda and Laguna Cañapa where thousands of James and Chilean flamingos feed on algae.',
        afternoon: 'Traverse the Siloli Desert and witness the wind-sculpted Árbol de Piedra (Stone Tree).',
        evening: 'Arrive at Laguna Colorada (The Red Lagoon) and soak in natural Termas de Polques hot springs under the Milky Way.',
        transitMode: '4WD Altiplano off-road',
        stayRecommendation: 'Mallku Cueva Eco-Lodge or Desert Glamping Domes',
        mealHighlight: 'Freshly prepared Andean vegetable soup & roasted trout',
      },
      {
        day: 4,
        title: 'Sol de Mañana Geysers & Laguna Verde Border Crossing',
        subtitle: 'Steaming Fumaroles, Borax Flats, and Descent to San Pedro',
        description: 'A pre-dawn departure to witness the roaring geothermal fumaroles of Sol de Mañana at 4,850m elevation before descending towards Chile or returning to Uyuni.',
        morning: 'Witness bubbling mud pots and geyser steam columns rising against the freezing morning dawn.',
        afternoon: 'Marvel at Laguna Verde reflecting the conical volcano Licancabur.',
        evening: 'Complete border transfer to San Pedro de Atacama or return celebratory dinner in Uyuni town.',
        transitMode: '4WD overland descent',
        stayRecommendation: 'Tierra Atacama (or Uyuni base hotel)',
        mealHighlight: 'Bolivian Salteñas & Api Morado spiced purple corn drink',
      },
    ],
    faq: [
      {
        question: 'When is the water mirror effect visible vs the dry hexagons?',
        answer: 'The legendary "Mirror Effect" occurs during the wet season from January to April when rainwater floods the flats by 2-5 cm. The dry season from May to November reveals pristine white geometric hexagonal salt crusts and allows full 4x4 access across the entire expanse.',
        category: 'best-time',
      },
      {
        question: 'How severe is altitude sickness and how should I prepare?',
        answer: 'The salt flats sit at 3,656m (11,995 ft) and mountain passes reach over 4,800m. Spend 48 hours acclimatizing in La Paz or Sucre beforehand, drink 3-4 liters of water daily, avoid heavy alcohol on arrival, and consult your doctor for Diamox (acetazolamide).',
        category: 'safety',
      },
      {
        question: 'What type of vehicles and safety standards are necessary?',
        answer: 'Only travel with licensed operators using certified high-clearance 4WD vehicles equipped with spare tires, satellite emergency radios, and oxygen tanks. Never attempt self-driving across flooded salt without an experienced indigenous guide.',
        category: 'logistics',
      },
      {
        question: 'What are the visa requirements for Bolivia?',
        answer: 'Many European, UK, and South American citizens enter visa-free for 90 days. US citizens require an entry visa ($160 USD) which can be obtained upon arrival with hotel reservations, return ticket, and yellow fever certificate.',
        category: 'logistics',
      },
      {
        question: 'Is it freezing at night on the salt flat?',
        answer: 'Yes. Night temperatures regularly drop below -10°C (14°F) in winter (June-August). Bring thermal base layers, a windproof down jacket, fleece-lined gloves, and a beanie even in summer.',
        category: 'packing',
      },
    ],
    prosAndCons: {
      pros: [
        'Unquestionably the most surreal, visually otherworldly landscape on planet Earth',
        'Incredible stargazing with zero light pollution and perfect celestial reflections',
        'Unique salt-block luxury hotels with heated floors and panoramic spas',
        'High value for money on multi-day guided expeditions',
      ],
      cons: [
        'Extreme high altitude requires mandatory acclimatization',
        'Basic infrastructure and rough dirt roads on remote Altiplano legs',
        'Freezing sub-zero night temperatures year-round',
      ],
      verdict: 'An absolute bucket-list pilgrimage that rewards adventurous travelers with memories that feel straight out of a celestial dream.',
    },
    seasonality: {
      peakSeason: {
        months: 'Jan – Mar (Mirror) & Jul – Sep (Dry)',
        weather: 'Wet season (warm days, rain) vs Dry winter (clear blue skies, freezing nights)',
        crowds: 'High demand for 4x4 photo tours and salt hotel bookings',
        tip: 'Book salt hotels at least 4 months in advance during mirror season.',
      },
      shoulderSeason: {
        months: 'April – May & October – November',
        weather: 'Mild temperatures, golden sunset light, pleasant daytime hiking',
        crowds: 'Moderate; best balance of solitude and great driving conditions',
        tip: 'November offers the best chance to see newly arrived flamingo colonies with low wind.',
      },
      offSeason: {
        months: 'June (Deep Winter Freezes)',
        weather: 'Extremely cold nights (-15°C), but exceptionally crisp blue skies',
        crowds: 'Lowest crowd density of the year',
        tip: 'Pack alpine-grade thermal down wear.',
      },
      monthlyMatrix: [
        { month: 'Jan', status: 'Peak', tempC: '15° / 3°', rainfall: '78mm', crowdLevel: 'High', highlights: 'Mirror effect begins; celestial reflections' },
        { month: 'Feb', status: 'Peak', tempC: '14° / 3°', rainfall: '85mm', crowdLevel: 'High', highlights: 'Deepest water mirror; prime photography' },
        { month: 'Mar', status: 'Peak', tempC: '15° / 2°', rainfall: '45mm', crowdLevel: 'High', highlights: 'Mirror transitions to drying crust' },
        { month: 'Apr', status: 'Good', tempC: '14° / -2°', rainfall: '12mm', crowdLevel: 'Moderate', highlights: 'Mild days, crisp dry air, island access opens' },
        { month: 'May', status: 'Good', tempC: '12° / -6°', rainfall: '2mm', crowdLevel: 'Low', highlights: 'Dry hexagonal salt crusts form fully' },
        { month: 'Jun', status: 'Fair', tempC: '10° / -11°', rainfall: '1mm', crowdLevel: 'Low', highlights: 'Sub-zero nights, crystalline stargazing' },
        { month: 'Jul', status: 'Peak', tempC: '10° / -12°', rainfall: '1mm', crowdLevel: 'High', highlights: 'Peak dry winter season; full overland crossing' },
        { month: 'Aug', status: 'Peak', tempC: '12° / -9°', rainfall: '2mm', crowdLevel: 'High', highlights: 'Crisp clear skies; Milky Way alignment' },
        { month: 'Sep', status: 'Good', tempC: '14° / -5°', rainfall: '4mm', crowdLevel: 'Moderate', highlights: 'Warming weather; optimal hiking on Incahuasi' },
        { month: 'Oct', status: 'Good', tempC: '17° / -1°', rainfall: '7mm', crowdLevel: 'Moderate', highlights: 'Spring warmth; low wind; flamingo migrations' },
        { month: 'Nov', status: 'Good', tempC: '18° / 1°', rainfall: '15mm', crowdLevel: 'Moderate', highlights: 'Flamingo nesting in red lagoons' },
        { month: 'Dec', status: 'Good', tempC: '17° / 3°', rainfall: '48mm', crowdLevel: 'High', highlights: 'Early rains begin; festive expeditions' },
      ],
    },
    hotels: [
      {
        id: 'h-uyuni-1',
        name: 'Palacio de Sal',
        tier: 'Luxury Sanctuary',
        priceUSD: 240,
        rating: 4.9,
        location: 'Edge of Salar de Uyuni, Colchani',
        features: ['100% Solid Salt Block Construction', 'Heated Indoor Hydro-Spa', 'Gourmet Andean Dining', 'Private Celestial Deck'],
        bestFor: 'Luxury seekers & Romantic couples',
        bookingTip: 'Request a master suite with panoramic salt flat sunset windows.',
      },
      {
        id: 'h-uyuni-2',
        name: 'Hotel de Sal Luna Salada',
        tier: 'Boutique Heritage',
        priceUSD: 180,
        rating: 4.8,
        location: 'Colchani Scenic Hillside',
        features: ['Handcrafted Salt Furniture', 'Cozy Stoves & Fireplaces', 'Spa with Volcanic Stone Massage', 'Astronomy Guided Tours'],
        bestFor: 'Photographers & Cultural travelers',
        bookingTip: 'Book early for the wet season (Jan-March) as rooms sell out 6 months ahead.',
      },
      {
        id: 'h-uyuni-3',
        name: 'Kachi Lodge (Luxury Geodesic Domes)',
        tier: 'Luxury Sanctuary',
        priceUSD: 850,
        rating: 5.0,
        location: 'Directly on the Salt Flat at the base of Tunupa Volcano',
        features: ['Transparent Stargazing Domes', 'Pellet Stoves & En-suite Bathrooms', 'Gustu Award-Winning Cuisine', 'Private Telescope Stargazing'],
        bestFor: 'Ultimate once-in-a-lifetime luxury expeditions',
        bookingTip: 'All-inclusive package with dedicated guide and private 4x4.',
      },
      {
        id: 'h-uyuni-4',
        name: 'Tambores de Sal Guesthouse',
        tier: 'Authentic Guesthouse',
        priceUSD: 45,
        rating: 4.6,
        location: 'Uyuni Central Town',
        features: ['Hot Showers & Electric Blankets', 'Hearty Buffet Breakfast', 'Expedition Gear Rental', 'Luggage Storage'],
        bestFor: 'Solo adventurers & Budget explorers',
        bookingTip: 'Great base for night before early morning 4x4 departure.',
      },
    ],
    culinary: {
      signatureDishes: [
        { name: 'Llama Tenderloin with Quinoa Risotto', localName: 'Lomo de Llama', description: 'Lean, delicate high-altitude llama steak seared over volcanic stones with organic royal quinoa.', type: 'Main' },
        { name: 'Sopa de Maní', localName: 'Peanut Soup', description: 'Creamy peanut broth with braised beef, peas, potatoes, and crispy shoestring fries.', type: 'Soup' },
        { name: 'Bolivian Salteñas', localName: 'Salteña', description: 'Savory sweet-baked pastry pockets filled with spiced meat broth, hard-boiled eggs, and olives.', type: 'Street Food' },
      ],
      streetFoodAdvice: 'Try morning Salteñas from local bakeries in Uyuni market before 11 AM; eat them carefully by nibbling the top corner to sip the rich broth first.',
      avgDailyFoodUSD: 28,
      iconicDrink: 'Singani 63 & Chuflay (Bolivian Muscat grape spirit with ginger ale & fresh lime)',
    },
    packingList: {
      clothing: ['Thermal Merino base layers (top & bottom)', 'Windproof 800-fill down jacket', 'Fleece-lined trekking pants', 'Polarized UV400 sunglasses (essential against blinding salt glare)'],
      gear: ['High-ankle waterproof hiking boots', 'Portable battery power bank (cold drains phone batteries fast)', 'DSLR / Mirrorless camera with wide-angle & tripod for night astrophotography'],
      healthAndDocs: ['High-SPF 50+ broad spectrum sunscreen & zinc lip balm', 'Electrolyte powder sachets & altitude medication', 'Passport valid for 6 months & printed visa/booking vouchers'],
      insiderPackingTip: 'The white salt reflects up to 90% of solar radiation—never step outside without wrap-around polarized sunglasses and SPF lip balm.',
    },
    culturalEtiquette: {
      customs: [
        'Always ask permission before taking photos of local Aymara or Quechua weavers and miners.',
        'Offer a small tribute (Challa) of coca leaves or a sip of beverage to Pachamama (Mother Earth) when beginning your journey.',
        'Never litter or leave any trace on the salt flat; the ecosystem is extremely fragile.',
      ],
      tippingNorms: '10% in sit-down restaurants. $10–15 USD per day is customary for your 4x4 driver-guide.',
      keyPhrases: [
        { phrase: 'Kamisaraki', translation: 'How are you? (Aymara)', pronunciation: 'kah-mee-sah-rah-kee' },
        { phrase: 'Waliki', translation: 'I am good / Everything is fine (Aymara)', pronunciation: 'wah-lee-kee' },
        { phrase: 'Muchas gracias por guiarnos', translation: 'Thank you very much for guiding us', pronunciation: 'moo-chas grah-syas por gee-ar-nos' },
      ],
    },
  },

  'rio-celeste': {
    roadmap: [
      {
        day: 1,
        title: 'Journey into Tenorio Volcano Rainforest',
        subtitle: 'Lush Cloudforests, Sloths, and Thermal Springs',
        description: 'Travel from San José or Liberia to the misty foothills of Tenorio Volcano National Park. Immerse yourself in virgin primary rainforest.',
        morning: 'Drive through Guanacaste pastures into the emerald rainforest canopy of Bijagua.',
        afternoon: 'Guided sloth-spotting walk along private reserve forest trails.',
        evening: 'Relax in natural volcanic mineral hot springs under the canopy.',
        transitMode: 'Private AWD Eco-shuttle',
        stayRecommendation: 'Rio Celeste Hideaway Resort',
        mealHighlight: 'Casado with fresh tilapia, sweet plantains, and black beans',
      },
      {
        day: 2,
        title: 'The Turquoise Miracle Hike & Los Teñideros',
        subtitle: 'The 30-Meter Cascade and Chemical Reaction Point',
        description: 'Enter Tenorio Volcano National Park early. Hike through primary jungle to the awe-inspiring Rio Celeste Waterfall and the exact confluence where two clear rivers meet to turn sky blue.',
        morning: 'Descend the 250 wooden stairs to the roar of the brilliant turquoise waterfall.',
        afternoon: 'Hike upstream past the bubbling thermal fumaroles (Borbollones) to Los Teñideros.',
        evening: 'Taste organic Costa Rican cacao and fresh tropical fruit juices in Bijagua town.',
        transitMode: 'National Park Trail Hike',
        stayRecommendation: 'Hideaway Forest Casitas',
        mealHighlight: 'Chifrijo (crispy pork belly with fresh beans, pico de gallo & tortilla chips)',
      },
      {
        day: 3,
        title: 'Tubing Adventure & Tapir Sanctuary',
        subtitle: 'Floating Down Turquoise Rapids and Night Wildlife Safari',
        description: 'An exhilarating morning floating down the Rio Celeste rapids followed by an evening wildlife expedition seeking Baird’s tapirs and red-eyed tree frogs.',
        morning: 'River tubing through scenic forest canyons and crystal-blue pools.',
        afternoon: 'Visit a traditional organic farm to make fresh cheese and cane juice.',
        evening: 'Night flashlight expedition to observe nocturnal frogs, owls, and elusive tapirs.',
        transitMode: 'Inflatable river tube & guided night hike',
        stayRecommendation: 'Celeste Mountain Lodge',
        mealHighlight: 'Olla de Carne (traditional slow-simmered beef and root vegetable stew)',
      },
    ],
    faq: [
      {
        question: 'Why is the river so intensely blue?',
        answer: 'The color is an optical illusion called Mie scattering. Two transparent rivers with different pH levels meet at Los Teñideros, causing aluminosilicate mineral particles to clump and scatter sunbeams in brilliant sky-blue wavelengths.',
        category: 'logistics',
      },
      {
        question: 'Can you swim in the Rio Celeste waterfall pool?',
        answer: 'Swimming is strictly prohibited inside the National Park to protect the delicate aquatic mineral chemistry. However, there are free public swimming spots just outside the park boundaries near the main bridge.',
        category: 'safety',
      },
      {
        question: 'What is the best time to avoid muddy rains?',
        answer: 'December to April is the dry season with the highest water clarity. If it rains heavily, the river can temporarily turn cloudy brown for a few hours before settling blue again.',
        category: 'best-time',
      },
    ],
    prosAndCons: {
      pros: [
        'One of the world’s most mesmerizing natural color phenomena',
        'Rich biodiversity: sloths, toucans, tapirs, and poison dart frogs',
        'Far fewer crowds than Manuel Antonio or Arenal',
      ],
      cons: [
        'Rain can temporarily diminish the blue water intensity',
        'Trails can be muddy requiring sturdy waterproof boots',
      ],
      verdict: 'A magical rainforest adventure perfect for eco-travelers and photographers wanting pristine natural wonder.',
    },
    seasonality: {
      peakSeason: {
        months: 'Jan – Apr',
        weather: 'Sunny days, lowest rainfall, sparkling blue waters',
        crowds: 'Moderate; arrive by 8:00 AM at the park entrance',
        tip: 'Reserve your SINAC park entrance ticket online in advance.',
      },
      shoulderSeason: {
        months: 'May & Nov – Dec',
        weather: 'Occasional afternoon showers, lush greenery, great wildlife spotting',
        crowds: 'Low crowds, serene trails',
        tip: 'Morning hikes offer the clearest skies.',
      },
      offSeason: {
        months: 'Sep – Oct (Peak Green Season)',
        weather: 'Daily heavy rains, river can turn murky after storms',
        crowds: 'Very low',
        tip: 'Check with local rangers regarding morning water clarity before setting out.',
      },
      monthlyMatrix: [
        { month: 'Jan', status: 'Peak', tempC: '26° / 18°', rainfall: '60mm', crowdLevel: 'High', highlights: 'Brilliant blue water clarity' },
        { month: 'Feb', status: 'Peak', tempC: '27° / 18°', rainfall: '40mm', crowdLevel: 'High', highlights: 'Driest month; prime hiking' },
        { month: 'Mar', status: 'Peak', tempC: '28° / 19°', rainfall: '35mm', crowdLevel: 'High', highlights: 'Crystal clear waters & sunshine' },
        { month: 'Apr', status: 'Peak', tempC: '29° / 20°', rainfall: '50mm', crowdLevel: 'Moderate', highlights: 'Warm days; excellent birdwatching' },
        { month: 'May', status: 'Good', tempC: '28° / 21°', rainfall: '140mm', crowdLevel: 'Moderate', highlights: 'Rainforest blooms; vibrant foliage' },
        { month: 'Jun', status: 'Good', tempC: '27° / 21°', rainfall: '180mm', crowdLevel: 'Low', highlights: 'Great wildlife activity' },
        { month: 'Jul', status: 'Good', tempC: '27° / 20°', rainfall: '160mm', crowdLevel: 'Moderate', highlights: 'Little dry season break (Veranillo)' },
        { month: 'Aug', status: 'Good', tempC: '27° / 20°', rainfall: '190mm', crowdLevel: 'Low', highlights: 'Fewer tourists; lush trails' },
        { month: 'Sep', status: 'Fair', tempC: '26° / 20°', rainfall: '280mm', crowdLevel: 'Low', highlights: 'Heavy afternoon rain; budget deals' },
        { month: 'Oct', status: 'Fair', tempC: '26° / 20°', rainfall: '310mm', crowdLevel: 'Low', highlights: 'Wettest month; peaceful lodges' },
        { month: 'Nov', status: 'Good', tempC: '26° / 19°', rainfall: '160mm', crowdLevel: 'Low', highlights: 'Rains taper off; rivers run bright blue' },
        { month: 'Dec', status: 'Good', tempC: '25° / 18°', rainfall: '90mm', crowdLevel: 'High', highlights: 'Holiday season begins; pleasant weather' },
      ],
    },
    hotels: [
      {
        id: 'h-rc-1',
        name: 'Rio Celeste Hideaway Hotel',
        tier: 'Luxury Sanctuary',
        priceUSD: 290,
        rating: 4.9,
        location: 'Adjacent to Tenorio National Park',
        features: ['Secluded Jungle Casitas', 'Private Outdoor Rainforest Showers', 'Hot Tubs in the Forest', 'Direct River Trail'],
        bestFor: 'Honeymooners & Nature lovers',
        bookingTip: 'Book the forest view casita with private hot tub.',
      },
      {
        id: 'h-rc-2',
        name: 'Celeste Mountain Lodge',
        tier: 'Eco-Lodge',
        priceUSD: 160,
        rating: 4.8,
        location: 'Bijagua Highlands',
        features: ['Innovative Bio-climatic Architecture', 'Gourmet French-Tico Fusion Meals', 'Volcano Viewpoint', 'Private Nature Trail'],
        bestFor: 'Eco-conscious travelers & Hikers',
        bookingTip: 'Includes 3 delicious daily farm-to-table meals.',
      },
      {
        id: 'h-rc-3',
        name: 'Posada Rural Rio Celeste',
        tier: 'Authentic Guesthouse',
        priceUSD: 45,
        rating: 4.7,
        location: '1 km from National Park Entrance',
        features: ['Friendly Local Family Host', 'Homecooked Costa Rican Breakfast', 'Lush Tropical Garden', 'Rubber Boot Rental'],
        bestFor: 'Budget travelers & Solo backpackers',
        bookingTip: 'Rent rubber boots here if hiking during rainy season.',
      },
    ],
    culinary: {
      signatureDishes: [
        { name: 'Traditional Casado', localName: 'Casado con Pescado', description: 'Fresh pan-seared sea bass with seasoned rice, black beans, fried sweet plantains, and cabbage slaw.', type: 'Main' },
        { name: 'Gallo Pinto', localName: 'Gallo Pinto', description: 'The national breakfast of seasoned rice and beans tossed with cilantro, onions, and Lizano sauce.', type: 'Breakfast' },
      ],
      streetFoodAdvice: 'Stop by local sodas (family diners) in Bijagua for fresh empanadas and freshly squeezed maracuyá (passionfruit) juice.',
      avgDailyFoodUSD: 24,
      iconicDrink: 'Fresh Guanábana / Passionfruit batido and Costa Rican Tarrazú pour-over coffee',
    },
    packingList: {
      clothing: ['Quick-dry moisture-wicking shirts', 'Waterproof rain shell jacket', 'Lightweight hiking trousers', 'Breathable athletic socks'],
      gear: ['Waterproof hiking shoes with aggressive tread', 'Dry bag for camera and phone', 'Compact binoculars for birdwatching'],
      healthAndDocs: ['DEET / Eco insect repellent', 'Waterproof phone pouch', 'Refillable insulated water bottle'],
      insiderPackingTip: 'Rent knee-high rubber boots at the park gate for $3 if rain fell the night before—it saves your hiking shoes from deep mud.',
    },
    culturalEtiquette: {
      customs: [
        'Embrace "Pura Vida" (pure life)—a friendly greeting, farewell, and philosophy of gratitude.',
        'Costa Rica is fiercely protective of wildlife: never touch, feed, or play recorded sounds to attract animals.',
      ],
      tippingNorms: '10% service tax is often included in restaurant bills; additional 5-10% is appreciated for exceptional service.',
      keyPhrases: [
        { phrase: 'Pura Vida', translation: 'Pure life / All is good', pronunciation: 'poo-rah vee-dah' },
        { phrase: 'Con mucho gusto', translation: 'With pleasure / You are welcome', pronunciation: 'kohn moo-choh goos-toh' },
      ],
    },
  },
};

// Generic rich data generator for all other destinations ensuring complete 100% coverage
export function getEnrichedDestinationData(dest: any): DestinationEnrichedData {
  if (BESPOKE_DATA[dest.id]) {
    const bespoke = BESPOKE_DATA[dest.id];
    const fallback = generateFallbackEnrichment(dest);
    return {
      roadmap: bespoke.roadmap || fallback.roadmap,
      faq: bespoke.faq || fallback.faq,
      prosAndCons: bespoke.prosAndCons || fallback.prosAndCons,
      seasonality: (bespoke.seasonality as any) || fallback.seasonality,
      hotels: bespoke.hotels || fallback.hotels,
      culinary: bespoke.culinary || fallback.culinary,
      packingList: bespoke.packingList || fallback.packingList,
      culturalEtiquette: bespoke.culturalEtiquette || fallback.culturalEtiquette,
    };
  }
  return generateFallbackEnrichment(dest);
}

function generateFallbackEnrichment(dest: any): DestinationEnrichedData {
  const isHighAltitude = dest.elevation && (dest.elevation.includes('m') && parseInt(dest.elevation) > 2000);
  const isPolar = dest.category === 'polar';

  const baseUSD = dest.budgetUSD || 850;

  return {
    roadmap: [
      {
        day: 1,
        title: `Arrival in ${dest.name} & Historic Quarter Immersion`,
        subtitle: `Orientation, Local Atmosphere, and Welcome Gathering`,
        description: `Arrive in ${dest.name}, check into your sanctuary, and get your first breath of the local rhythm.`,
        morning: `Settle in, acclimatize, and enjoy a curated orientation walk around the historic district.`,
        afternoon: `Explore the vibrant local markets and central plazas; discover hidden architectural gems.`,
        evening: `Sunset panorama from the highest local lookout followed by an authentic regional dinner.`,
        transitMode: `Private airport transfer & scenic walking tour`,
        stayRecommendation: `${dest.name} Heritage Boutique Hotel`,
        mealHighlight: `${dest.localDelicacy || 'Iconic Regional Tasting Menu'}`,
      },
      {
        day: 2,
        title: `Deep Exploration: ${dest.highlights?.[0] || 'The Grand Waypoint'}`,
        subtitle: `Pristine Vistas and Signature Expedition`,
        description: `Embark on an early morning excursion to experience the signature highlight before midday crowds arrive.`,
        morning: `Witness sunrise over ${dest.highlights?.[0] || dest.name} with an expert local guide.`,
        afternoon: `Visit ${dest.highlights?.[1] || 'the cultural heritage quarter'} and discover ancient artisan crafts.`,
        evening: `Stargazing or scenic twilight promenade with traditional acoustic music.`,
        transitMode: `Scenic overland 4x4 / electric boat / private coach`,
        stayRecommendation: `${dest.name} Luxury Panoramic Retreat`,
        mealHighlight: `Slow-cooked local specialty with farm-to-table seasonal harvest`,
      },
      {
        day: 3,
        title: `Hidden Paths: ${dest.highlights?.[2] || 'Secret Sanctuaries'}`,
        subtitle: `Immersion into Local Lore and Wilderness Trails`,
        description: `Venture beyond the tourist perimeter to discover untouched scenery and traditional village lifestyles.`,
        morning: `Hike scenic trails around ${dest.highlights?.[2] || 'the nature reserve'} with breathtaking vistas.`,
        afternoon: `Engage with local masters, taste artisanal cheeses or wines, and learn ancestral techniques.`,
        evening: `Celebratory farewell dinner featuring seasonal ingredients and local vintage wines.`,
        transitMode: `Local scenic transit & trail trekking`,
        stayRecommendation: `${dest.name} Eco-Lodge & Spa`,
        mealHighlight: `Handcrafted traditional dessert & regional celebratory feast`,
      },
    ],
    faq: [
      {
        question: `What is the best time of year to visit ${dest.name}?`,
        answer: `The ideal season is ${dest.bestSeason || 'Spring through Autumn'}, when weather conditions are most stable and outdoor visibility is at its clearest.`,
        category: 'best-time',
      },
      {
        question: `How safe is ${dest.name} for solo travelers?`,
        answer: `${dest.name} maintains a strong safety score of ${(dest.safetyScore || 4.9).toFixed(1)}/5.0. Locals are welcoming and standard common-sense travel precautions apply.`,
        category: 'safety',
      },
      {
        question: `What currency should I carry and are cards accepted?`,
        answer: `Major credit cards are widely accepted in hotels and restaurants, but carrying a moderate amount of local cash is recommended for small rural shops, street food, and tips.`,
        category: 'budget',
      },
      {
        question: `How do I arrange transportation around the area?`,
        answer: `Private transfers, scenic train links, or pre-arranged guided drivers are the most seamless ways to navigate between key waypoints without stress.`,
        category: 'logistics',
      },
    ],
    prosAndCons: {
      pros: [
        `Extraordinary visual beauty with unmatched natural and cultural photography opportunities`,
        `Warm and authentic local community with deep-rooted living heritage`,
        `Exceptional culinary scene celebrating regional organic ingredients`,
        `Diverse array of stays from boutique riads to world-class eco-lodges`,
      ],
      cons: [
        `High demand during peak travel seasons requires advance bookings`,
        isHighAltitude ? 'High altitude requires taking the first 24 hours at a relaxed pace' : 'Popular viewpoints can get busy during midday hours',
      ],
      verdict: `A transformative destination offering a rare balance of wonder, hospitality, and unforgettable memories.`,
    },
    seasonality: {
      peakSeason: {
        months: dest.bestSeason?.split('(')[0]?.trim() || 'Jun – Sep',
        weather: 'Optimal sunshine, clearest views, pleasant day temperatures',
        crowds: 'High visitor interest; early reservations recommended',
        tip: 'Book activities and boutique accommodations 3 to 5 months in advance.',
      },
      shoulderSeason: {
        months: 'Apr – May & Oct – Nov',
        weather: 'Crisp air, golden autumn or blooming spring foliage, mild weather',
        crowds: 'Moderate; best balance of tranquility and favorable conditions',
        tip: 'Perfect for photographers seeking dramatic changing light and quiet viewpoints.',
      },
      offSeason: {
        months: 'Dec – Mar',
        weather: isPolar ? 'Arctic winter conditions' : 'Quiet winter months with reduced rates',
        crowds: 'Lowest crowd density',
        tip: 'Enjoy discounted luxury accommodations and authentic local life.',
      },
      monthlyMatrix: [
        { month: 'Jan', status: 'Good', tempC: '14° / 4°', rainfall: '30mm', crowdLevel: 'Moderate', highlights: 'Crisp winter vistas and quiet trails' },
        { month: 'Feb', status: 'Good', tempC: '15° / 5°', rainfall: '25mm', crowdLevel: 'Moderate', highlights: 'Romantic twilight and clear skies' },
        { month: 'Mar', status: 'Good', tempC: '18° / 8°', rainfall: '35mm', crowdLevel: 'Moderate', highlights: 'Spring blossom awakening' },
        { month: 'Apr', status: 'Peak', tempC: '22° / 11°', rainfall: '40mm', crowdLevel: 'High', highlights: 'Mild weather and vibrant landscapes' },
        { month: 'May', status: 'Peak', tempC: '25° / 14°', rainfall: '30mm', crowdLevel: 'High', highlights: 'Peak spring greenery and outdoor expeditions' },
        { month: 'Jun', status: 'Peak', tempC: '28° / 17°', rainfall: '15mm', crowdLevel: 'High', highlights: 'Long sunny days and golden hour light' },
        { month: 'Jul', status: 'Peak', tempC: '30° / 19°', rainfall: '10mm', crowdLevel: 'High', highlights: 'Peak summer festivities and starry nights' },
        { month: 'Aug', status: 'Peak', tempC: '30° / 19°', rainfall: '12mm', crowdLevel: 'High', highlights: 'Warm evenings and outdoor festivals' },
        { month: 'Sep', status: 'Peak', tempC: '26° / 15°', rainfall: '25mm', crowdLevel: 'High', highlights: 'Golden autumn harvest and wine seasons' },
        { month: 'Oct', status: 'Good', tempC: '21° / 11°', rainfall: '45mm', crowdLevel: 'Moderate', highlights: 'Stunning autumn foliage colors' },
        { month: 'Nov', status: 'Good', tempC: '16° / 7°', rainfall: '55mm', crowdLevel: 'Low', highlights: 'Peaceful atmosphere and cozy lodge stays' },
        { month: 'Dec', status: 'Good', tempC: '13° / 4°', rainfall: '40mm', crowdLevel: 'Moderate', highlights: 'Festive lights and holiday charm' },
      ],
    },
    hotels: [
      {
        id: `h-${dest.id}-1`,
        name: `${dest.name} Grand Sanctuary & Spa`,
        tier: 'Luxury Sanctuary',
        priceUSD: Math.round(baseUSD * 0.28),
        rating: 4.9,
        location: `Prime panoramic overlook, ${dest.name}`,
        features: ['Infinity Pool with Mountain/Ocean View', 'Holistic Wellness Spa', 'Michelin-Caliber Dining', 'Private Chauffeur Service'],
        bestFor: 'Luxury seekers & Romantic celebrations',
        bookingTip: 'Book direct for complimentary sunset champagne and room upgrade eligibility.',
      },
      {
        id: `h-${dest.id}-2`,
        name: `${dest.name} Boutique Heritage Villa`,
        tier: 'Boutique Heritage',
        priceUSD: Math.round(baseUSD * 0.16),
        rating: 4.8,
        location: `Historic Old Town Quarter`,
        features: ['Restored Architectural Details', 'Private Courtyard Garden', 'Artisanal Breakfast Included', 'Curated Art Collection'],
        bestFor: 'Design enthusiasts & Cultural travelers',
        bookingTip: 'Request upper floor rooms for authentic balcony views.',
      },
      {
        id: `h-${dest.id}-3`,
        name: `${dest.name} Nature Eco-Lodge`,
        tier: 'Eco-Lodge',
        priceUSD: Math.round(baseUSD * 0.11),
        rating: 4.7,
        location: `Scenic Wilderness Perimeter`,
        features: ['100% Solar Powered', 'Organic Farm-to-Table Kitchen', 'Guided Birdwatching', 'Open-Air Stargazing Lounge'],
        bestFor: 'Nature lovers & Eco-conscious explorers',
        bookingTip: 'Includes daily guided sunrise wildlife and botanical walks.',
      },
      {
        id: `h-${dest.id}-4`,
        name: `${dest.name} Traveler Haven Guesthouse`,
        tier: 'Authentic Guesthouse',
        priceUSD: Math.round(baseUSD * 0.05),
        rating: 4.6,
        location: `Central Village Walkable Street`,
        features: ['Warm Local Host Hospitality', 'High-Speed Fiber Wi-Fi', 'Communal Kitchen & Terrace', 'Local Trail Maps'],
        bestFor: 'Solo travelers & Budget backpackers',
        bookingTip: 'Ask the host for their handwritten list of local food gems.',
      },
    ],
    culinary: {
      signatureDishes: [
        { name: dest.localDelicacy || 'Regional Chef Specialty', description: `Classic culinary dish prepared with native heritage seasonings and local produce.`, type: 'Main' },
        { name: 'Artisanal Local Broth & Savory Pastry', description: 'Comforting, slow-cooked soup infused with garden herbs and served with oven-warm bread.', type: 'Starter' },
        { name: 'Heritage Honey & Cream Confection', description: 'Traditional dessert balancing subtle sweetness, roasted nuts, and dairy cream.', type: 'Dessert' },
      ],
      streetFoodAdvice: `Explore the morning central markets between 8 AM and 11 AM to sample authentic freshly baked pastries and warm regional drinks.`,
      avgDailyFoodUSD: Math.round(baseUSD * 0.04),
      iconicDrink: 'Traditional regional herb-infused tea / local vintage wine',
    },
    packingList: {
      clothing: ['Breathable moisture-wicking layers', 'Lightweight packable rain shell', 'Comfortable trail walking shoes', 'Smart-casual attire for evening dining'],
      gear: ['Universal power adapter & 20,000mAh power bank', 'Polarized sunglasses & UV protection hat', 'Compact daypack for day excursions'],
      healthAndDocs: ['Personal medical kit & blister relief', 'Digital & physical copies of passport and travel insurance', 'Refillable water bottle with filtration'],
      insiderPackingTip: 'Pack lightweight merino wool layers—they regulate temperature in both warm sun and cool mountain/ocean twilight.',
    },
    culturalEtiquette: {
      customs: [
        `Greet shopkeepers and locals politely with a warm smile when entering establishments.`,
        `Dress respectfully when visiting religious, sacred, or heritage sanctuaries.`,
        `Always adhere to "Leave No Trace" principles to protect the natural wonderland.`,
      ],
      tippingNorms: '10% in standard restaurants; tipping small bills for guides and drivers is customary.',
      keyPhrases: [
        { phrase: 'Hello / Greetings', translation: 'Warm local greeting', pronunciation: 'Standard polite greeting' },
        { phrase: 'Thank you very much', translation: 'Expressing gratitude', pronunciation: 'Polite thank you' },
        { phrase: 'Please', translation: 'Polite request', pronunciation: 'Polite please' },
      ],
    },
  };
}
