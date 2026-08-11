import { PrismaClient, TravelMood, CrowdLevel, GemType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding AtlasAura database...\n')

  // ─── Clean existing data ────────────────────────────────────────
  console.log('🧹 Clearing existing data...')
  await prisma.userBadge.deleteMany()
  await prisma.userPreference.deleteMany()
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.review.deleteMany()
  await prisma.tripPlan.deleteMany()
  await prisma.journal.deleteMany()
  await prisma.memoryPin.deleteMany()
  await prisma.culturalInsight.deleteMany()
  await prisma.hiddenGem.deleteMany()
  await prisma.destination.deleteMany()
  await prisma.user.deleteMany()

  // ─── Seed Users ─────────────────────────────────────────────────
  console.log('👤 Creating users...')
  const passwordHash = await bcrypt.hash('password123', 12)

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Sarah Chen',
        email: 'sarah@atlasaura.com',
        passwordHash,
        avatar: '/avatars/avatar-sarah.jpg',
        bio: 'Cultural explorer & cherry blossom chaser 🌸',
        travelStyle: ['culture', 'calm'],
        countriesExplored: 8,
        contributionScore: 2100,
        streakDays: 45,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Marco Rossi',
        email: 'marco@atlasaura.com',
        passwordHash,
        avatar: '/avatars/avatar-marco.jpg',
        bio: 'Adventure seeker. Lost in medinas, found in mountains.',
        travelStyle: ['adventure', 'solo'],
        countriesExplored: 15,
        contributionScore: 3200,
        streakDays: 120,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Lisa Anderson',
        email: 'lisa@atlasaura.com',
        passwordHash,
        avatar: '/avatars/avatar-lisa.jpg',
        bio: 'Solo road tripper & northern lights hunter ✨',
        travelStyle: ['solo', 'adventure'],
        countriesExplored: 22,
        contributionScore: 4500,
        streakDays: 200,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alex Wanderer',
        email: 'alex@atlasaura.com',
        passwordHash,
        avatar: '/avatars/avatar-default.jpg',
        bio: 'Exploring one country at a time 🌍',
        travelStyle: ['culture', 'honeymoon'],
        countriesExplored: 12,
        contributionScore: 1560,
        streakDays: 30,
      },
    }),
  ])

  const [sarah, marco, lisa, alex] = users
  console.log(`  ✅ Created ${users.length} users`)

  // ─── Seed Destinations ──────────────────────────────────────────
  console.log('📍 Creating destinations...')
  const destinations = await Promise.all([
    prisma.destination.create({
      data: {
        name: 'Japan',
        country: 'Japan',
        region: 'Asia',
        description: 'Where ancient traditions meet futuristic innovation in perfect harmony.',
        image: '/country-japan.jpg',
        images: ['/country-japan.jpg'],
        latitude: 36.2048,
        longitude: 138.2529,
        bestTimeToVisit: 'March–May (cherry blossoms) or October–November (autumn foliage)',
        budgetUSD: 120.0,
        crowdLevel: CrowdLevel.moderate,
        rating: 4.9,
        purposes: [TravelMood.solo, TravelMood.culture, TravelMood.calm],
        safetyScore: 4.9,
        etiquette: [
          'Bow when greeting people',
          'Remove shoes before entering homes and temples',
          'Do not tip at restaurants',
          'Avoid eating while walking',
        ],
        mustVisit: ['Fushimi Inari Shrine', 'Shibuya Crossing', 'Mount Fuji', 'Arashiyama Bamboo Grove'],
        foodTips: ['Try authentic ramen at local shops', 'Visit Tsukiji Outer Market for fresh sushi', 'Matcha everything in Kyoto'],
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Morocco',
        country: 'Morocco',
        region: 'Africa',
        description: 'A sensory journey through colorful souks, ancient medinas, and Sahara dunes.',
        image: '/country-morocco.jpg',
        images: ['/country-morocco.jpg'],
        latitude: 31.7917,
        longitude: -7.0926,
        bestTimeToVisit: 'March–May or September–November',
        budgetUSD: 50.0,
        crowdLevel: CrowdLevel.moderate,
        rating: 4.7,
        purposes: [TravelMood.culture, TravelMood.adventure, TravelMood.solo],
        safetyScore: 4.2,
        etiquette: [
          'Dress modestly, especially in rural areas',
          'Use your right hand for eating and greetings',
          'Haggle respectfully in souks',
          'Ask before photographing people',
        ],
        mustVisit: ['Marrakech Medina', 'Chefchaouen Blue City', 'Sahara Desert', 'Fes Tanneries'],
        foodTips: ['Tagine is a must-try', 'Mint tea is a sign of hospitality', 'Street food in Jemaa el-Fnaa'],
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Norway',
        country: 'Norway',
        region: 'Europe',
        description: 'Dramatic fjords, northern lights, and the essence of Nordic tranquility.',
        image: '/country-norway.jpg',
        images: ['/country-norway.jpg'],
        latitude: 60.472,
        longitude: 8.4689,
        bestTimeToVisit: 'June–August (midnight sun) or September–March (northern lights)',
        budgetUSD: 200.0,
        crowdLevel: CrowdLevel.low,
        rating: 4.8,
        purposes: [TravelMood.adventure, TravelMood.calm, TravelMood.honeymoon],
        safetyScore: 4.9,
        etiquette: [
          'Respect personal space — Norwegians value privacy',
          'Remove shoes when entering homes',
          'Tipping is not expected but appreciated',
        ],
        mustVisit: ['Lofoten Islands', 'Trolltunga', 'Geirangerfjord', 'Tromsø Northern Lights'],
        foodTips: ['Try fresh salmon and brown cheese', 'Visit a traditional fisherman village', 'Cloudberries in summer'],
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Indonesia',
        country: 'Indonesia',
        region: 'Asia',
        description: 'Thousands of islands offering spiritual awakening and natural wonders.',
        image: '/country-indonesia.jpg',
        images: ['/country-indonesia.jpg'],
        latitude: -0.7893,
        longitude: 113.9213,
        bestTimeToVisit: 'April–October (dry season)',
        budgetUSD: 40.0,
        crowdLevel: CrowdLevel.moderate,
        rating: 4.6,
        purposes: [TravelMood.culture, TravelMood.adventure, TravelMood.solo],
        safetyScore: 4.3,
        etiquette: [
          'Use your right hand for giving and receiving',
          'Dress modestly at temples',
          'Remove shoes before entering sacred places',
        ],
        mustVisit: ['Borobudur Temple', 'Raja Ampat Islands', 'Mount Bromo', 'Ubud Rice Terraces'],
        foodTips: ['Nasi goreng is the national dish', 'Try satay at street stalls', 'Fresh tropical fruits everywhere'],
      },
    }),
    prisma.destination.create({
      data: {
        name: 'Greece',
        country: 'Greece',
        region: 'Europe',
        description: 'Birthplace of democracy, home to idyllic islands and Mediterranean charm.',
        image: '/country-greece.jpg',
        images: ['/country-greece.jpg'],
        latitude: 39.0742,
        longitude: 21.8243,
        bestTimeToVisit: 'April–June or September–October',
        budgetUSD: 90.0,
        crowdLevel: CrowdLevel.busy,
        rating: 4.8,
        purposes: [TravelMood.honeymoon, TravelMood.culture, TravelMood.calm],
        safetyScore: 4.6,
        etiquette: [
          'Greeks are warm — a handshake is standard',
          'Tipping 5-10% is customary',
          'Dress modestly when visiting churches',
        ],
        mustVisit: ['Santorini', 'Athens Acropolis', 'Meteora Monasteries', 'Crete'],
        foodTips: ['Fresh Greek salad is a staple', 'Try moussaka and souvlaki', 'Ouzo with meze is a tradition'],
      },
    }),
  ])

  console.log(`  ✅ Created ${destinations.length} destinations`)

  // ─── Seed Cultural Insights ─────────────────────────────────────
  console.log('🎭 Creating cultural insights...')
  await Promise.all([
    prisma.culturalInsight.create({
      data: {
        destinationId: destinations[0].id, // Japan
        traditions: ['Tea ceremony (chanoyu)', 'Cherry blossom viewing (hanami)', 'New Year shrine visits'],
        festivals: ['Sakura Matsuri (April)', 'Gion Matsuri (July)', 'Obon (August)'],
        languages: ['Japanese — "Konnichiwa" (Hello)', '"Arigatou" (Thank you)', '"Sumimasen" (Excuse me)'],
        dos: ['Bow when greeting', 'Try local food', 'Be punctual'],
        donts: ['Do not tip', 'Avoid loud phone calls on trains', 'Do not stick chopsticks upright in rice'],
        facts: ['Japan has over 6,800 islands', 'Vending machines sell everything from soup to ties', 'Trains are famously on time'],
      },
    }),
    prisma.culturalInsight.create({
      data: {
        destinationId: destinations[1].id, // Morocco
        traditions: ['Mint tea ceremony', 'Hammam bathing ritual', 'Storytelling in Jemaa el-Fnaa'],
        festivals: ['Ramadan', 'Eid al-Fitr', 'Rose Festival (May)', 'Gnaoua Music Festival'],
        languages: ['Arabic — "Salaam" (Hello)', 'Berber languages', 'French widely spoken'],
        dos: ['Haggle respectfully', 'Accept tea invitations', 'Dress modestly'],
        donts: ['Do not photograph people without asking', 'Avoid public displays of affection', 'Do not drink alcohol in public'],
        facts: ['Morocco is the world\'s largest exporter of sardines', 'Fes has the oldest university in the world', 'The Sahara covers much of southern Morocco'],
      },
    }),
    prisma.culturalInsight.create({
      data: {
        destinationId: destinations[4].id, // Greece
        traditions: ['Name day celebrations', 'Easter festivities', 'Plate smashing at celebrations'],
        festivals: ['Greek Easter (spring)', 'Athens Epidaurus Festival (summer)', 'Carnival in Patras'],
        languages: ['Greek — "Yassou" (Hello)', '"Efharisto" (Thank you)', '"Parakalo" (Please)'],
        dos: ['Make eye contact when toasting', 'Try local specialties', 'Embrace the slow pace of island life'],
        donts: ['Do not rush meals', 'Avoid showing the palm of your hand (mountza gesture)', 'Do not skip the meze'],
        facts: ['Greece has more archaeological museums than any other country', 'Over 200 inhabited islands', 'The first Olympic Games were held in 776 BC'],
      },
    }),
  ])
  console.log('  ✅ Created cultural insights')

  // ─── Seed Hidden Gems ───────────────────────────────────────────
  console.log('💎 Creating hidden gems...')
  await Promise.all([
    prisma.hiddenGem.create({
      data: {
        name: 'Rio Celeste Waterfall',
        country: 'Costa Rica',
        region: 'Central America',
        description: 'A magical turquoise waterfall hidden deep in the Tenorio Volcano National Park.',
        fullDescription:
          'Rio Celeste is one of Costa Rica\'s most breathtaking natural wonders. The river gets its striking sky-blue color from a chemical reaction between volcanic minerals and the water.',
        image: '/hidden-gem-1.jpg',
        images: ['/hidden-gem-1.jpg'],
        type: GemType.nature,
        purposes: [TravelMood.adventure, TravelMood.solo],
        crowdLevel: CrowdLevel.low,
        cleanlinessScore: 5.0,
        costUSD: 12.0,
        bestTime: 'December – April (dry season)',
        tips: [
          'Start hiking early to avoid crowds',
          'Bring waterproof shoes — the trail gets muddy',
          'Swimming is not allowed in the pool',
        ],
        rating: 4.9,
        latitude: 10.7,
        longitude: -85.0,
        keywords: ['waterfall', 'nature', 'costa rica', 'volcano', 'turquoise'],
        authorId: lisa.id,
      },
    }),
    prisma.hiddenGem.create({
      data: {
        name: 'Vardzia Cave City',
        country: 'Georgia',
        region: 'Eastern Europe',
        description: 'An ancient cave monastery carved into a cliffside, with over 6000 chambers.',
        fullDescription:
          'Vardzia is a cave monastery site in southern Georgia, excavated from the slopes of the Erusheti Mountain. Built in the 12th century under Queen Tamar.',
        image: '/hidden-gem-2.jpg',
        images: ['/hidden-gem-2.jpg'],
        type: GemType.culture,
        purposes: [TravelMood.culture, TravelMood.adventure],
        crowdLevel: CrowdLevel.low,
        cleanlinessScore: 4.5,
        costUSD: 8.0,
        bestTime: 'May – October',
        tips: [
          'Wear comfortable walking shoes for the steep paths',
          'Visit on weekdays to avoid tour groups',
          'The frescoes inside the main church are remarkably preserved',
        ],
        rating: 4.7,
        latitude: 41.4,
        longitude: 43.3,
        keywords: ['cave', 'monastery', 'georgia', 'ancient', 'history'],
        authorId: marco.id,
      },
    }),
    prisma.hiddenGem.create({
      data: {
        name: 'Mosquito Bay',
        country: 'Puerto Rico',
        region: 'Caribbean',
        description: "The world's brightest bioluminescent bay — paddle through glowing waters.",
        fullDescription:
          'Mosquito Bay on Vieques Island holds the Guinness World Record for the brightest bioluminescent bay on Earth. Millions of microscopic dinoflagellates light up the water.',
        image: '/hidden-gem-3.jpg',
        images: ['/hidden-gem-3.jpg'],
        type: GemType.adventure,
        purposes: [TravelMood.adventure, TravelMood.honeymoon],
        crowdLevel: CrowdLevel.low,
        cleanlinessScore: 4.8,
        costUSD: 45.0,
        bestTime: 'Year-round (best on moonless nights)',
        tips: [
          'Book a guided kayak tour — no motorboats allowed',
          'Go on a new moon night for maximum glow',
          "Don't use sunscreen before entering",
        ],
        rating: 4.8,
        latitude: 18.1,
        longitude: -65.4,
        keywords: ['bioluminescent', 'kayak', 'night', 'glow', 'ocean'],
        authorId: sarah.id,
      },
    }),
  ])
  console.log('  ✅ Created hidden gems')

  // ─── Seed Memory Pins ───────────────────────────────────────────
  console.log('📌 Creating memory pins...')
  await Promise.all([
    prisma.memoryPin.create({
      data: {
        lat: 35.6762,
        lng: 139.6503,
        country: 'Japan',
        note: 'First cherry blossom season - cried under a tree in Ueno Park',
        emoji: '🌸',
        image: '/memories/japan.jpg',
        mood: TravelMood.culture,
        author: 'Sarah Chen',
        date: '2024-04-15',
        userId: sarah.id,
      },
    }),
    prisma.memoryPin.create({
      data: {
        lat: 31.6295,
        lng: -7.9811,
        country: 'Morocco',
        note: 'Lost in the medina for 3 hours, found the best mint tea of my life',
        emoji: '🍵',
        image: '/memories/morocco.jpg',
        mood: TravelMood.adventure,
        author: 'Marco Rossi',
        date: '2024-03-20',
        userId: marco.id,
      },
    }),
    prisma.memoryPin.create({
      data: {
        lat: 62.1015,
        lng: 9.0781,
        country: 'Norway',
        note: 'Saw the northern lights dance for the first time. Pure magic.',
        emoji: '✨',
        image: '/memories/norway.jpg',
        mood: TravelMood.calm,
        author: 'Emma Wilson',
        date: '2024-02-10',
        userId: lisa.id,
      },
    }),
    prisma.memoryPin.create({
      data: {
        lat: -8.4095,
        lng: 115.1889,
        country: 'Indonesia',
        note: 'Sunrise at Borobudur - a spiritual awakening I will never forget',
        emoji: '🙏',
        image: '/memories/indonesia.jpg',
        mood: TravelMood.culture,
        author: 'David Park',
        date: '2024-01-25',
        userId: alex.id,
      },
    }),
    prisma.memoryPin.create({
      data: {
        lat: 36.3932,
        lng: 25.4615,
        country: 'Greece',
        note: 'Proposed to my love in Santorini. She said yes!',
        emoji: '💍',
        image: '/memories/greece.jpg',
        mood: TravelMood.honeymoon,
        author: 'Alex Thompson',
        date: '2024-05-01',
        userId: alex.id,
      },
    }),
    prisma.memoryPin.create({
      data: {
        lat: 64.1466,
        lng: -21.9426,
        country: 'Iceland',
        note: 'Solo road trip around the ring road. Found myself in the silence.',
        emoji: '🚗',
        image: '/memories/iceland.jpg',
        mood: TravelMood.solo,
        author: 'Lisa Anderson',
        date: '2024-06-12',
        userId: lisa.id,
      },
    }),
  ])
  console.log('  ✅ Created memory pins')

  // ─── Seed Questions & Answers ───────────────────────────────────
  console.log('❓ Creating questions & answers...')
  const q1 = await prisma.question.create({
    data: {
      title: 'Best time to see cherry blossoms in Japan?',
      content: 'Planning a trip to Japan specifically for sakura season. When is the best time to visit Tokyo and Kyoto?',
      country: 'Japan',
      tags: ['season', 'culture', 'timing'],
      likes: 128,
      userId: alex.id,
    },
  })
  await prisma.answer.createMany({
    data: [
      {
        content:
          'Late March to early April is peak season for Tokyo and Kyoto. Book accommodations early as it gets very crowded!',
        likes: 45,
        isHelpful: true,
        questionId: q1.id,
        userId: sarah.id,
      },
      {
        content:
          "I recommend visiting in late March. The blossoms in Ueno Park and along the Philosopher's Path in Kyoto are breathtaking.",
        likes: 32,
        isHelpful: false,
        questionId: q1.id,
        userId: marco.id,
      },
    ],
  })

  const q2 = await prisma.question.create({
    data: {
      title: 'Is Morocco safe for solo female travelers?',
      content: "I'm planning a solo trip to Morocco and would love to hear from women who have traveled there alone.",
      country: 'Morocco',
      tags: ['safety', 'solo', 'female-travel'],
      likes: 89,
      userId: lisa.id,
    },
  })
  await prisma.answer.create({
    data: {
      content:
        'I traveled solo for 2 weeks and felt safe overall. Dress modestly, stay in riads in the medina, and trust your instincts.',
      likes: 67,
      isHelpful: true,
      questionId: q2.id,
      userId: sarah.id,
    },
  })

  const q3 = await prisma.question.create({
    data: {
      title: "Hidden gems in Norway that aren't touristy?",
      content: 'Want to experience the real Norway away from the crowds. Any local secrets?',
      country: 'Norway',
      tags: ['hidden-gems', 'local', 'off-beat'],
      likes: 76,
      userId: marco.id,
    },
  })
  await prisma.answer.create({
    data: {
      content:
        'Try the Helgeland coast instead of Lofoten. Equally stunning but barely any tourists. Also, the island of Senja is incredible.',
      likes: 54,
      isHelpful: true,
      questionId: q3.id,
      userId: lisa.id,
    },
  })
  console.log('  ✅ Created questions & answers')

  // ─── Seed Badges ────────────────────────────────────────────────
  console.log('🏆 Creating badges...')
  await prisma.userBadge.createMany({
    data: [
      { badgeKey: 'globe_trotter', name: 'Globe Trotter', icon: '🌍', description: 'Visited 5+ countries', userId: alex.id },
      { badgeKey: 'memory_keeper', name: 'Memory Keeper', icon: '📸', description: 'Created 10+ memory pins', userId: alex.id },
      { badgeKey: 'culture_explorer', name: 'Culture Explorer', icon: '🏛️', description: 'Visited 3+ cultural sites', userId: alex.id },
      { badgeKey: 'solo_adventurer', name: 'Solo Adventurer', icon: '🎒', description: 'Completed a solo trip', userId: alex.id },
      { badgeKey: 'globe_trotter', name: 'Globe Trotter', icon: '🌍', description: 'Visited 5+ countries', userId: lisa.id },
      { badgeKey: 'gem_finder', name: 'Hidden Gem Hunter', icon: '💎', description: 'Discovered 3+ hidden gems', userId: lisa.id },
      { badgeKey: 'solo_adventurer', name: 'Solo Adventurer', icon: '🎒', description: 'Completed a solo trip', userId: lisa.id },
      { badgeKey: 'community_guide', name: 'Community Guide', icon: '📚', description: 'Answered 10+ questions', userId: marco.id },
      { badgeKey: 'globe_trotter', name: 'Globe Trotter', icon: '🌍', description: 'Visited 5+ countries', userId: marco.id },
    ],
  })
  console.log('  ✅ Created badges')

  // ─── Seed User Preferences ─────────────────────────────────────
  console.log('⚙️ Creating user preferences...')
  await Promise.all(
    users.map((u) =>
      prisma.userPreference.create({
        data: {
          userId: u.id,
          preferredCurrency: 'USD',
          savedDestinations: [],
          wishlist: [],
          recentSearches: [],
        },
      })
    )
  )
  console.log('  ✅ Created user preferences')

  // ─── Summary ────────────────────────────────────────────────────
  const counts = {
    users: await prisma.user.count(),
    destinations: await prisma.destination.count(),
    culturalInsights: await prisma.culturalInsight.count(),
    hiddenGems: await prisma.hiddenGem.count(),
    memoryPins: await prisma.memoryPin.count(),
    questions: await prisma.question.count(),
    answers: await prisma.answer.count(),
    badges: await prisma.userBadge.count(),
    preferences: await prisma.userPreference.count(),
  }

  console.log('\n🎉 Seeding complete! Database summary:')
  console.log('─'.repeat(40))
  Object.entries(counts).forEach(([key, count]) => {
    console.log(`  ${key.padEnd(20)} ${count}`)
  })
  console.log('─'.repeat(40))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
