# AtlasAura Complete Feature & System Architecture Plan (2026-2036)

> **Architectural Vision**: Transform AtlasAura into an all-in-one, AI-powered, high-scale personalized travel discovery and community platform powered by **Prisma ORM with MongoDB**, dynamic database APIs, multi-currency conversion, interactive geospatial maps, and community-driven travel intelligence.
> 
> **Primary Engineering Focus (P0)**: Core Feature Development & Real Database Architecture (Prisma + MongoDB)  
> **Secondary Focus (P1)**: UI/UX Refinement & Micro-Interactions  
> **Post-Feature Phase (P2)**: AWS S3 + CloudFront Infrastructure for Live Media Uploads

---

## 🏗️ Core System Architecture

```
                               ┌──────────────────────────────────────────┐
                               │          Next.js 15 App Router           │
                               └────────────────────┬─────────────────────┘
                                                    │
        ┌───────────────────────────────────────────┼───────────────────────────────────────────┐
        ▼                                           ▼                                           ▼
┌──────────────────┐                      ┌──────────────────┐                        ┌────────────────┐
│ Prisma ORM       │                      │ AI Assistant &   │                        │ Multi-Currency │
│ MongoDB Provider │                      │ Mood Engine      │                        │ FX Rate Engine │
└───────┬──────────┘                      └────────┬─────────┘                        └───────┬────────┘
        │                                          │                                          │
        └──────────────────────────────────────────┼──────────────────────────────────────────┘
                                                   ▼
                               ┌──────────────────────────────────────────┐
                               │    User Dashboard & Community Engine     │
                               └──────────────────────────────────────────┘
```

---

## 🚀 Complete Feature Matrix Specification

### 🔎 1. Destination Discovery & Smart Search
- **Multi-Parametric Search**: Query destinations by country, city, region, budget, travel season, trip duration, and user interests.
- **Trending & Hidden Gems**: Dedicated algorithm highlighting uncrowded, pristine, off-the-beaten-path locations.
- **Custom Filters**: Max budget slider (dynamic currency), crowd density (`Low`, `Moderate`, `Busy`), cleanliness rating, and activity filters.

### 😊 2. Mood-Based Travel Engine
- **Vibe-Driven Matchmaking**: Select your current state of mind:
  - 🧘 *"I want a peaceful trip"* (Serene retreats, quiet mountain towns)
  - 🏔️ *"Adventure weekend"* (Hiking, rafting, volcano treks)
  - 🌿 *"Nature escape"* (National parks, coastal cliffs, waterfalls)
  - 💖 *"Romantic getaway"* (Scenic sunsets, boutique stays, cozy villages)
- **AI Recommendation Model**: Maps user mood state to curated destination profiles based on sensory tags and vibe vectors.

### 🧠 3. AI Travel Assistant
- **Personalized Recommendations**: Context-aware suggestions based on user history, saved spots, and budget bounds.
- **Smart Itinerary & Trip Idea Generator**: Instant custom trip plans generated based on user prompts.
- **Local Tips & Safety Insights**: AI-synthesized safety ratings, cultural rules, and travel hacks.

### 🗺️ 4. Interactive Travel Map & Heatmap
- **Visual World Map**: Interactive map displaying explored destinations, saved pins, and user wishlist spots.
- **Travel History Tracker**: Mark visited places with dates, photos, and personal memories.
- **Travel Heatmap**: Density map showing global travel coverage and visited regions.

### 📍 5. Comprehensive Destination Detail Pages
Each destination features an interactive detail hub:
- **Overview & Fast Facts**: Geography, language, currency, climate.
- **Best Time to Visit**: Seasonal weather breakdown and peak vs. low season guide.
- **Budget Estimate**: Stored in base USD, auto-converted to user's local currency.
- **Local Transportation**: Transit options, taxi tips, train passes.
- **Safety & Etiquette**: Scams to avoid, emergency numbers, cultural dress codes.
- **Attractions & Food Guide**: Must-see landmarks and local culinary dishes.

### 🎭 6. Cultural Insights Hub
- **Traditions & Heritage**: Cultural history, architectural notes, and local customs.
- **Festivals & Events**: Calendar of annual celebrations.
- **Languages Spoken**: Key phrases, audio pronunciation guides, and basic vocabulary.
- **Do's and Don me'ts**: Essential cultural etiquette rules.

### 📸 7. Travel Memories & Journals
- **Travel Journals**: Rich-text trip diaries linked to specific destinations.
- **Photo Uploads**: Photo galleries per trip (local `/public` assets initially, AWS S3 post-features).
- **Personal Timeline**: Chronological travel timeline with memories, notes, and photos.

### 👥 8. Community & Social Platform
- **User Profiles**: Custom public profiles featuring badges, visited countries, and travel bio.
- **Social Feed**: Share stories, posts, and photo updates.
- **Follow System**: Follow fellow travelers and view their activity feed.
- **Interactions**: Like, comment, bookmark, and share posts.

### ⭐ 9. Review & Rating System
- **Community Ratings**: Rate destinations, hidden gems, and specific attractions (1-5 stars).
- **Detailed Reviews**: Written feedback on crowd levels, costs, and cleanliness.
- **Helpful Review Voting**: Upvote helpful community reviews.

### ❤️ 10. Personalized User Dashboard
- **My Trip Center**: Saved destinations, wishlist, recent searches, and personalized suggestions.
- **Travel Statistics**: Visited country counter, explorer progress bar, contribution points.

### 🏆 11. Gamification & Achievements
- **Badges**: Unlock badges (*"Off-Grid Explorer"*, *"Cultural Nomad"*, *"Gem Finder"*).
- **Country Milestones**: Progress levels based on global exploration percentage.
- **Contribution Points**: Earn points by sharing hidden gems, writing reviews, and answering community questions.

### 📅 12. Trip Planning & Packing Checklist
- **Itinerary Planner**: Day-wise and hour-wise trip breakdown.
- **Budget Tracker**: Track planned vs. actual expenses.
- **Packing Checklist**: Smart packing lists tailored to destination weather and activity type.

### 🔐 13. Authentication & Security
- Email/Password login and signup.
- Google OAuth integration.
- JWT Session Authentication with secure HTTP-only cookies.
- Account profile management.

### 📊 14. Travel Analytics
- Countries visited analytics.
- Travel streaks & monthly activity charts.
- Favorite destination type distribution pie charts.

---

## 💾 Prisma ORM Database Models (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TravelMood {
  solo
  calm
  adventure
  honeymoon
  culture
}

enum CrowdLevel {
  low
  moderate
  busy
}

enum GemType {
  nature
  culture
  adventure
  viewpoint
  stay
  food
}

model User {
  id                String          @id @default(auto()) @map("_id") @db.ObjectId
  email             String          @unique
  passwordHash      String
  name              String
  avatar            String          @default("/avatars/default.jpg")
  bio               String?
  countriesExplored Int             @default(0)
  contributionScore Int             @default(0)
  streakDays        Int             @default(1)
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt

  pins              MemoryPin[]
  gems              HiddenGem[]
  questions         Question[]
  answers           Answer[]
  journals          Journal[]
  posts             Post[]
  comments          Comment[]
  reviews           Review[]
  tripPlans         TripPlan[]
  preference        UserPreference?
  badges            UserBadge[]
}

model Destination {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  country          String
  city             String?
  region           String
  description      String
  image            String
  images           String[]
  latitude         Float
  longitude        Float
  bestTimeToVisit  String
  budgetUSD        Float        // Base USD
  crowdLevel       CrowdLevel   @default(moderate)
  rating           Float        @default(4.8)
  purposes         TravelMood[]
  safetyScore      Float        @default(4.5)
  etiquette        String[]
  mustVisit        String[]
  foodTips         String[]
  createdAt        DateTime     @default(now())

  reviews          Review[]
  culturalInfo     CulturalInsight?
}

model HiddenGem {
  id               String       @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  country          String
  region           String
  description      String
  fullDescription  String?
  image            String
  images           String[]
  type             GemType
  purposes         TravelMood[]
  crowdLevel       CrowdLevel   @default(low)
  cleanlinessScore Float        @default(5.0)
  costUSD          Float        @default(0.0)
  bestTime         String?
  tips             String[]
  rating           Float        @default(4.8)
  latitude         Float
  longitude        Float
  keywords         String[]
  createdAt        DateTime     @default(now())

  authorId         String       @db.ObjectId
  author           User         @relation(fields: [authorId], references: [id])
}

model CulturalInsight {
  id            String      @id @default(auto()) @map("_id") @db.ObjectId
  destinationId String      @unique @db.ObjectId
  destination   Destination @relation(fields: [destinationId], references: [id])
  traditions    String[]
  festivals     String[]
  languages     String[]
  dos           String[]
  donts         String[]
  facts         String[]
}

model MemoryPin {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  lat       Float
  lng       Float
  country   String
  note      String
  emoji     String     @default("📍")
  image     String?
  mood      TravelMood
  author    String
  date      String
  isPublic  Boolean    @default(true)
  createdAt DateTime   @default(now())

  userId    String     @db.ObjectId
  user      User       @relation(fields: [userId], references: [id])
}

model Journal {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  country   String
  images    String[]
  createdAt DateTime @default(now())

  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
}

model Post {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  image     String?
  likes     Int       @default(0)
  createdAt DateTime  @default(now())

  userId    String    @db.ObjectId
  user      User      @relation(fields: [userId], references: [id])
  comments  Comment[]
}

model Comment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  content   String
  createdAt DateTime @default(now())

  postId    String   @db.ObjectId
  post      Post     @relation(fields: [postId], references: [id])
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
}

model Review {
  id            String       @id @default(auto()) @map("_id") @db.ObjectId
  rating        Float
  content       String
  helpfulVotes  Int          @default(0)
  createdAt     DateTime     @default(now())

  destinationId String       @db.ObjectId
  destination   Destination  @relation(fields: [destinationId], references: [id])
  userId        String       @db.ObjectId
  user          User         @relation(fields: [userId], references: [id])
}

model TripPlan {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  title         String
  destination   String
  startDate     String?
  endDate       String?
  budgetUSD     Float
  itineraryDays Json     // Day-wise activity array
  checklist     Json     // Packing items
  createdAt     DateTime @default(now())

  userId        String   @db.ObjectId
  user          User     @relation(fields: [userId], references: [id])
}

model Question {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  title     String
  content   String
  country   String?
  tags      String[]
  likes     Int      @default(0)
  createdAt DateTime @default(now())

  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  answers   Answer[]
}

model Answer {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  content   String
  likes     Int      @default(0)
  isHelpful Boolean  @default(false)
  createdAt DateTime @default(now())

  questionId String   @db.ObjectId
  question   Question @relation(fields: [questionId], references: [id])
  userId     String   @db.ObjectId
  user       User     @relation(fields: [userId], references: [id])
}

model UserPreference {
  id                String   @id @default(auto()) @map("_id") @db.ObjectId
  userId            String   @unique @db.ObjectId
  user              User     @relation(fields: [userId], references: [id])
  preferredCurrency String   @default("USD")
  savedDestinations String[]
  wishlist          String[]
  recentSearches    String[]
  updatedAt         DateTime @updatedAt
}

model UserBadge {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  badgeKey    String   // "off_grid_explorer", "gem_finder", etc.
  name        String
  icon        String
  description String
  earnedAt    DateTime @default(now())

  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## 💱 Real-Time Multi-Currency Engine (`/api/currency/rates`)

- Base storage: All database prices are stored in **USD float**.
- Live FX Rate API (`https://open.er-api.com/v6/latest/USD`) with 1-hour Next.js cache revalidation.
- **Current Reference Exchange Rates**:
  - `1 USD = 95.19 INR` (e.g. `$1.05 USD = ₹100 INR`, `$26.26 USD = ₹2,500 INR`)
  - `1 USD = 0.87 EUR`
  - `1 USD = 0.74 GBP`
  - `1 USD = 158.56 JPY`
  - `1 USD = 1.40 CAD`
  - `1 USD = 1.42 AUD`

---

## 🚀 Step-by-Step Implementation Roadmap

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            IMPLEMENTATION ROADMAP                            │
├───────────────────────┬──────────────────────────────────────────────────────┤
│ Phase 1: Database     │ Setup Prisma ORM models & MongoDB seed script        │
│ Phase 2: Auth & Hub   │ Build JWT + Google Auth & User Dashboard             │
│ Phase 3: Discovery    │ Build Smart Search, Mood Engine & AI Assistant       │
│ Phase 4: Maps & Pages │ Interactive World Map & Destination Detail Hub       │
│ Phase 5: Culture/Plan │ Cultural Insights Hub & Trip Planner with Checklist  │
│ Phase 6: Social       │ Community Feed, Journals, Reviews & Gamification     │
│ Phase 7: Currency     │ Real-time multi-currency FX API & UI switches        │
│ Phase 8: AWS (Post)   │ Connect AWS S3 + CloudFront for live photo uploads   │
└───────────────────────┴──────────────────────────────────────────────────────┘
```

---

*Document Author: Senior Principal Software Architect*  
*Last Updated: August 2026*  
*Project: AtlasAura Enhanced Platform*
