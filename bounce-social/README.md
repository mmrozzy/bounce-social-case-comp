# 🎳 Bounce Bolt Social

A social expense tracking and group management app that analyzes user behavior to create personality profiles.

## Features

### 🎭 User Persona System

Automatically analyze user behavior patterns to classify them into 12 distinct social personas based on:

- **Social Behavior**: Group size preferences, social activity patterns
- **Financial Patterns**: Spending habits, generosity, payment speed
- **Activity Patterns**: Event frequency, preferred times of day

### 👥 Group Persona System

Analyze group dynamics based on collective member behavior:

- **Dominant Persona**: Most common personality type in the group
- **Persona Distribution**: Breakdown of all member personas
- **Group Traits**: Collective behavioral characteristics
- **Group Stats**: Aggregated metrics (total spent, event frequency, generosity)

[Full Group Persona Documentation →](GROUP_PERSONA_SYSTEM.md)

#### Available Personas

- 🎯 **The Mom Friend** - Organized, caring, quick to settle
- 🎉 **The Party Animal** - Social butterfly, loves big groups
- 🍜 **The Foodie Explorer** - Premium tastes, adventurous eater
- 💸 **The Budget Hawk** - Cost-conscious, watches every penny
- 👻 **The Ghost** - Hard to pin down, low activity
- 🌟 **The Hype Person** - High energy, generous, social
- 📅 **The Planner** - Detail-oriented, organized, reliable
- 🎲 **The Wild Card** - Spontaneous, unpredictable, fun
- 🏠 **The Hometown Hero** - Local expert, creature of habit
- ☕ **The Early Bird** - Morning person, punctual
- 🦉 **The Night Owl** - Night person, spontaneous
- 💰 **The Generous Whale** - Big spender, loves treating friends

[Full Persona Documentation →](PERSONA_SYSTEM.md)

### 👥 Group Management

Create and manage groups with friends.

### 📅 Event Planning

Organize events and track attendance.

### 💰 Expense Splitting

Smart expense tracking with:
- Split bills evenly or custom amounts
- P2P payments
- Event-based transactions

## Project Structure

```
bounce-social/
├── app/                    # Main application screens
│   └── tabs/              # Tab navigation screens
├── assets/                # Images and static resources
├── components/            # Reusable React components
│   ├── UserPersonaCard.tsx    # Full persona profile display
│   └── PersonaBadge.tsx       # Compact persona badge
├── data/                  # Static data and configurations
│   ├── personas.ts            # Predefined persona archetypes
│   └── sampleData.ts          # Sample data for testing
├── lib/                   # Utility libraries
├── src/                   # Core application logic
│   ├── types/                 # TypeScript type definitions
│   │   ├── index.ts              # Core types
│   │   ├── feature_extractor.ts  # Persona feature extraction
│   │   └── personaMatcher.ts     # Persona matching algorithm
│   ├── utils/                 # Helper functions
│   │   └── profileAnalyzer.ts    # User profile analysis
│   └── index.ts               # Main exports
└── scripts/               # Utility scripts
    └── analyzeProfiles.ts     # Demo persona analysis
```

## Quick Start

### Installation

```bash
cd bounce-social
npm install
```

### Running the App

```bash
npm start
```

### Testing Persona System

```bash
npx ts-node scripts/analyzeProfiles.ts
```

## Usage Examples

### Analyzing a User Profile

```typescript
import { analyzeUserProfile } from './src'

const profile = analyzeUserProfile(
  userId,
  transactions,
  events,
  groups
)

console.log(profile.emoji, profile.description)
// 🍜 The Foodie Explorer - Quality over quantity, loves trying new places
```

### Using in React Components

```typescript
import { UserPersonaCard } from './components/UserPersonaCard'

function ProfileScreen({ user, data }) {
  return (
    <UserPersonaCard
      userId={user.id}
      userName={user.name}
      transactions={data.transactions}
      events={data.events}
      groups={data.groups}
    />
  )
}
```

### Displaying Persona Badges

```typescript
import { PersonaBadge } from './components/PersonaBadge'

function UserListItem({ user, data }) {
  return (
    <View>
      <Text>{user.name}</Text>
      <PersonaBadge
        userId={user.id}
        transactions={data.transactions}
        events={data.events}
        groups={data.groups}
        size="small"
        showLabel={false}
      />
    </View>
  )
}
```

## API Reference

### Core Functions

#### `analyzeUserProfile(userId, transactions, events, groups)`
Returns a complete user profile including persona type, traits, and statistics.

#### `extractUserFeatures(userId, transactions, events, groups)`
Extracts raw behavioral features from user data.

#### `matchPersona(userPersona)`
Matches a user's persona features to predefined persona types.

#### `getPersonaDetails(personaKey)`
Returns display information (emoji, description, traits) for a persona type.

### Components

#### `<UserPersonaCard />`
Full-page persona profile display with detailed stats and traits.

#### `<PersonaBadge />`
Compact persona indicator for lists and smaller UI elements.

#### `<PersonaChip />`
Minimal chip-style persona label.

## Type System

```typescript
interface Persona {
  groupSize: 'small' | 'medium' | 'large'
  socialness: 'introvert' | 'ambivert' | 'extrovert'
  budgetLevel: 'budget' | 'moderate' | 'premium'
  generosity: 'low' | 'medium' | 'high'
  paymentSpeed: 'fast' | 'medium' | 'slow'
  activityLevel: 'low' | 'medium' | 'high'
  timePreference: 'morning' | 'afternoon' | 'evening' | 'night'
}

interface ProfileResult {
  type: string
  emoji: string
  description: string
  traits: string[]
  stats: {
    eventsAttended: number
    totalSpent: number
    avgEventCost: number
    features: UserFeatures
  }
}
```

## Documentation

- [Persona System Documentation](PERSONA_SYSTEM.md) - Complete guide to the persona system
- [Type Definitions](src/types/index.ts) - TypeScript types and interfaces

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **State Management**: React Hooks
- **Backend**: Supabase (configured in lib/supabase.js)

## Contributing

1. Feature extraction tweaks: Edit [src/types/feature_extractor.ts](src/types/feature_extractor.ts)
2. Adding personas: Edit [data/personas.ts](data/personas.ts)
3. Matching algorithm: Edit [src/types/personaMatcher.ts](src/types/personaMatcher.ts)

## License

MIT
