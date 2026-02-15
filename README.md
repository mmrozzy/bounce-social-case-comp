# Bounce Together

**Created with [m-kln](https://github.com/m-kln)** for the **BoltX[Bounce](https://bouncepay.ca/) Business Tech Case Competition**  

Selected from 150 applicants to compete among 40 participants • Finished 2nd Place Overall

---

## Project Overview

Bounce Together is a **cross-platform mobile social expense tracking and group event management app** featuring an automated behavioral analysis system. The app uses feature extraction algorithms to classify users into 12 distinct personality personas based on their spending habits, social patterns, and group dynamics.

It is intended as a social extension of the [Bounce Pay](https://bouncepay.ca/) application.

Built with React Native and Expo, the app integrates real-time database synchronization via Supabase and offers shareable persona cards with social media integration, allowing users to showcase their spending personality profiles.

## Features

### User Persona System

Automatically analyze user behavior patterns to classify them into 12 distinct social personas based on:

- **Social Behavior**: Group size preferences, social activity patterns
- **Financial Patterns**: Spending habits, generosity, payment speed
- **Activity Patterns**: Event frequency, preferred times of day

### Group Persona System

Analyze group dynamics based on collective member behavior:

- **Dominant Persona**: Most common personality type in the group
- **Persona Distribution**: Breakdown of all member personas
- **Group Traits**: Collective behavioral characteristics
- **Group Stats**: Aggregated metrics (total spent, event frequency, generosity)

**[→ Learn how the persona system works](docs/HOW_PERSONAS_WORK.md)**

#### Available Personas

- **The Mom Friend** - Organized, caring, quick to settle
- **The Party Animal** - Social butterfly, loves big groups
- **The Foodie Explorer** - Premium tastes, adventurous eater
- **The Budget Hawk** - Cost-conscious, watches every penny
- **The Ghost** - Hard to pin down, low activity
- **The Hype Person** - High energy, generous, social
- **The Planner** - Detail-oriented, organized, reliable
- **The Wild Card** - Spontaneous, unpredictable, fun
- **The Hometown Hero** - Local expert, creature of habit
- **The Early Bird** - Morning person, punctual
- **The Night Owl** - Night person, spontaneous
- **The Generous Whale** - Big spender, loves treating friends


### Group Management

Create and manage groups with friends.

### Event Planning

Organize events and track attendance.

### Expense Splitting

Smart expense tracking with:
- Split bills evenly or custom amounts
- P2P payments
- Event-based transactions

Note: Working payments are handled by the Bounce Pay application and hence not implemented in this extension. This project focuses on using data from these payments.

## Project Structure

```
bounce-bolt/
├── app/                    # Expo Router app directory (pages)
│   └── tabs/              # Tab navigation screens
│       ├── _layout.tsx    # Tab layout configuration
│       ├── groups.tsx     # Group management screen
│       └── profile.tsx    # User profile & persona screen
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable UI components
│   │   │   ├── Logo.tsx
│   │   │   ├── Notification.tsx
│   │   │   └── PersonaBadge.tsx
│   │   └── features/      # Feature-specific components
│   │       ├── CreateEvent.tsx
│   │       ├── CreateGroup.tsx
│   │       ├── CreateSplit.tsx
│   │       ├── GroupPersona.tsx
│   │       ├── GroupPersonaAppView.tsx
│   │       ├── GroupProfile.tsx
│   │       ├── ShareablePersona.tsx
│   │       ├── UserPersonaCard.tsx
│   │       └── UserShareablePersona.tsx
│   ├── config/            # Configuration files
│   │   └── supabase.ts    # Supabase client setup
│   ├── services/          # API and database services
│   │   ├── database.ts    # Database queries & mutations
│   │   └── navigationState.ts
│   ├── contexts/          # React contexts
│   │   └── ImageCacheContext.tsx
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   │   └── profileAnalyzer.ts  # Persona analysis algorithms
│   ├── types/             # TypeScript type definitions & core logic
│   │   ├── index.ts       # Main type exports
│   │   ├── feature_extractor.ts     # Behavioral feature extraction
│   │   ├── personaMatcher.ts        # Persona matching algorithm
│   │   └── groupPersonaAnalyzer.ts  # Group dynamics analysis
│   └── __mocks__/         # Mock data for development & testing
│       ├── mockUserData.ts
│       ├── groupMockData.ts
│       ├── personas.ts
│       └── sampleData.ts
├── assets/                # Images, fonts, logos
│   ├── images/
│   │   └── profile/
│   └── logos/
├── docs/                  # Documentation
│   ├── HOW_PERSONAS_WORK.md
│   ├── supabase_setup.md          # Database setup guide
│   └── SETUP.md                   # Project setup instructions
└── scripts/               # Utility scripts
    └── analyzeProfiles.ts # CLI tool for testing persona analysis
```

### Key Architecture Components

#### Behavioral Analysis Engine
- **Feature Extraction** ([src/types/feature_extractor.ts](src/types/feature_extractor.ts)): Analyzes transaction history, event attendance, and group interactions to extract quantifiable behavioral metrics
- **Persona Matcher** ([src/types/personaMatcher.ts](src/types/personaMatcher.ts)): Multi-dimensional matching algorithm that classifies users into one of 12 distinct personas
- **Profile Analyzer** ([src/utils/profileAnalyzer.ts](src/utils/profileAnalyzer.ts)): Coordinates the analysis pipeline and generates comprehensive user profiles

#### Real-Time Database Layer
- **Supabase Integration** ([src/config/supabase.ts](src/config/supabase.ts)): PostgreSQL database with real-time subscriptions
- **Database Service** ([src/services/database.ts](src/services/database.ts)): Type-safe queries and mutations for users, groups, events, and transactions

#### Social Features
- **Shareable Persona Cards**: Generate exportable persona profiles for social media
- **Group Dynamics**: Analyze collective behavioral patterns across groups
- **Event Management**: Track attendance and participation patterns

## Quick Start

For detailed setup instructions, see [SETUP.md](docs/SETUP.md) and [Supabase Setup Guide](docs/supabase_setup.md).

### Installation

```bash
npm install
```

### Running the App

```bash
npx expo start
```


## Documentation

- [How Personas Work](docs/HOW_PERSONAS_WORK.md) - Simple guide to the behavioral analysis system
- [Setup Guide](docs/SETUP.md) - Project installation and configuration
- [Supabase Setup](docs/supabase_setup.md) - Database setup and configuration



## Tech Stack

- **Framework**: React Native + Expo (Cross-platform mobile development)
- **Language**: TypeScript (Type-safe codebase)
- **Backend**: Supabase (PostgreSQL with real-time subscriptions)
- **State Management**: React Hooks + Context API
- **Navigation**: Expo Router (File-based routing)
- **Database**: PostgreSQL with real-time listeners

## Core Technologies & Algorithms

### Behavioral Classification System
The app employs a multi-dimensional analysis system:

1. **Feature Extraction**: Processes user activity data across seven dimensions:
   - Group size preferences (small/medium/large)
   - Social behavior patterns (introvert/ambivert/extrovert)
   - Budget consciousness (budget/moderate/premium)
   - Generosity levels (low/medium/high)
   - Payment speed (fast/medium/slow)
   - Activity levels (low/medium/high)
   - Time preferences (morning/afternoon/evening/night)

2. **Persona Matching**: Uses weighted scoring across behavioral dimensions to classify users into 12 distinct personas

3. **Group Analytics**: Aggregates member personas to analyze collective group dynamics and identify dominant behavioral patterns

### Real-Time Synchronization
- Supabase real-time subscriptions for live updates
- Image caching for improved performance
