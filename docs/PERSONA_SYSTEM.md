# 🎭 Bounce Bolt Persona System

A personality profiling system that analyzes user behavior patterns to classify them into social personas based on their transaction history, event participation, and group interactions.

## Overview

The persona system extracts behavioral features from user data and matches them to predefined personality types, helping understand spending habits, social patterns, and activity preferences.

## Personas

### 🎯 The Mom Friend
Always organized, takes care of everyone
- **Traits**: Organized, Caring, Reliable, Quick to settle bills
- **Pattern**: Medium groups, moderate spending, afternoon activities

### 🎉 The Party Animal
Lives for big nights out
- **Traits**: Social butterfly, Night owl, Loves crowds, Forgets to pay back
- **Pattern**: Large groups, moderate spending, night activities

### 🍜 The Foodie Explorer
Quality over quantity, loves trying new places
- **Traits**: Adventurous eater, Premium tastes, Generous tipper, Small groups
- **Pattern**: Small groups, premium spending, evening activities

### 💸 The Budget Hawk
Watches every penny, splits to the cent
- **Traits**: Cost-conscious, Quick settler, Prefers deals, Small gatherings
- **Pattern**: Small groups, budget spending, afternoon activities

### 👻 The Ghost
Hard to pin down, slow to respond
- **Traits**: Rarely organizes, Slow payer, Prefers intimate settings, Low activity
- **Pattern**: Small groups, moderate spending, evening activities

### 🌟 The Hype Person
Brings the energy, everyone's cheerleader
- **Traits**: Super social, Generous, Quick payer, Always planning
- **Pattern**: Large groups, moderate spending, evening activities

### 📅 The Planner
Has the itinerary ready, organized to a T
- **Traits**: Detail-oriented, Reliable, Balanced spender, Medium groups
- **Pattern**: Medium groups, moderate spending, afternoon activities

### 🎲 The Wild Card
Spontaneous, unpredictable, always fun
- **Traits**: Spontaneous, High energy, Premium spender, Very generous
- **Pattern**: Medium groups, premium spending, afternoon activities

### 🏠 The Hometown Hero
Knows all the local spots, sticks to favorites
- **Traits**: Local expert, Creature of habit, Balanced, Loyal friend
- **Pattern**: Small groups, moderate spending, evening activities

### ☕ The Early Bird
Morning person, likes brunch and coffee dates
- **Traits**: Morning enthusiast, Punctual, Organized, Loves breakfast spots
- **Pattern**: Small groups, moderate spending, morning activities

### 🦉 The Night Owl
Comes alive after dark, late night adventures
- **Traits**: Night person, Spontaneous, Social, Prefers late meetups
- **Pattern**: Medium groups, moderate spending, night activities

### 💰 The Generous Whale
Big spender, loves treating friends
- **Traits**: Very generous, Premium tastes, Quick payer, Loves to host
- **Pattern**: Medium groups, premium spending, evening activities

## Feature Extraction

The system analyzes:

### Social Behavior
- **Group Size**: Preferred group size (small: 2-4, medium: 5-7, large: 8+)
- **Socialness**: Event creation rate (introvert, ambivert, extrovert)

### Financial Patterns
- **Budget Level**: Average spending (budget: <$20, moderate: $20-50, premium: >$50)
- **Generosity**: Frequency of paying for others
- **Payment Speed**: How quickly debts are settled

### Activity Patterns
- **Activity Level**: Events per month (low: <3, medium: 3-8, high: >8)
- **Time Preference**: Most active time of day (morning, afternoon, evening, night)

## Usage

### Basic Profile Analysis

```typescript
import { analyzeUserProfile } from './src/utils/profileAnalyzer'
import { User, Transaction, Event, Group } from './src/types'

// Your data
const userId = 'user-123'
const transactions: Transaction[] = [/* ... */]
const events: Event[] = [/* ... */]
const groups: Group[] = [/* ... */]

// Analyze user
const profile = analyzeUserProfile(userId, transactions, events, groups)

console.log(profile.emoji, profile.description)
console.log('Traits:', profile.traits)
console.log('Stats:', profile.stats)
```

### Manual Feature Extraction

```typescript
import { extractUserFeatures } from './src/types/feature_extractor'
import { matchPersona, getPersonaDetails } from './src/types/personaMatcher'

// Extract features
const persona = extractUserFeatures(userId, transactions, events, groups)

// Match to persona
const match = matchPersona(persona)
const details = getPersonaDetails(match.personaKey)

console.log(`Match: ${details.emoji} ${details.description}`)
console.log(`Confidence: ${Math.round(match.similarity * 100)}%`)
```

### Integration in Components

```typescript
import { View, Text } from 'react-native'
import { analyzeUserProfile } from '../utils/profileAnalyzer'

function UserProfile({ userId, data }) {
  const profile = analyzeUserProfile(
    userId,
    data.transactions,
    data.events,
    data.groups
  )

  return (
    <View>
      <Text style={styles.emoji}>{profile.emoji}</Text>
      <Text style={styles.title}>{profile.description}</Text>
      
      <View>
        {profile.traits.map(trait => (
          <Text key={trait}>• {trait}</Text>
        ))}
      </View>
      
      <View>
        <Text>Events: {profile.stats.eventsAttended}</Text>
        <Text>Spent: ${profile.stats.totalSpent}</Text>
        <Text>Avg per event: ${profile.stats.avgEventCost}</Text>
      </View>
    </View>
  )
}
```

## Data Structure

### Required Data Types

```typescript
// Transactions must include: from, type, totalAmount, splits (for split type)
const transaction: Transaction = {
  id: 'tx-1',
  eventId: 'event-1',
  groupId: 'group-1',
  type: 'split',
  from: 'user-1',
  totalAmount: 50.00,
  participants: ['user-1', 'user-2'],
  splits: [
    { userId: 'user-1', paid: 50, owes: 0, net: 25 },
    { userId: 'user-2', paid: 0, owes: 25, net: -25 }
  ],
  createdAt: '2026-02-10T18:00:00Z'
}

// Events must include: participants, createdBy, date
const event: Event = {
  id: 'event-1',
  groupId: 'group-1',
  name: 'Dinner at Luigi\'s',
  date: '2026-02-10T18:30:00Z',
  createdBy: 'user-1',
  participants: ['user-1', 'user-2', 'user-3']
}
```

## Similarity Matching

The system uses weighted feature comparison:

```typescript
const FEATURE_WEIGHTS = {
  groupSize: 1.5,
  socialness: 2.0,      // Most important
  budgetLevel: 1.2,
  generosity: 1.8,      // Very important
  paymentSpeed: 1.0,
  activityLevel: 1.5,
  timePreference: 0.8   // Least important
}
```

## Output

```typescript
{
  type: 'foodieExplorer',
  emoji: '🍜',
  description: 'The Foodie Explorer - Quality over quantity, loves trying new places',
  traits: ['Adventurous eater', 'Premium tastes', 'Generous tipper', 'Small groups'],
  stats: {
    eventsAttended: 12,
    totalSpent: 840.50,
    avgEventCost: 70.04,
    features: {
      avgGroupSize: 3.2,
      eventsPerMonth: 4.5,
      avgTransactionAmount: 65.20,
      avgSettlementHours: 48,
      mostActiveHour: 19,
      generosityScore: 0.75
    }
  }
}
```

## Extension

### Adding New Personas

Edit [data/personas.ts](data/personas.ts):

```typescript
export const personas: Record<string, Persona> = {
  // ... existing personas
  
  myNewPersona: {
    groupSize: 'medium',
    socialness: 'extrovert',
    budgetLevel: 'premium',
    generosity: 'high',
    paymentSpeed: 'fast',
    activityLevel: 'high',
    timePreference: 'evening'
  }
}
```

Update [src/types/personaMatcher.ts](src/types/personaMatcher.ts) with persona details:

```typescript
myNewPersona: {
  emoji: '✨',
  description: 'My New Persona - Description here',
  traits: ['Trait 1', 'Trait 2', 'Trait 3']
}
```

### Customizing Feature Weights

Adjust weights in [src/types/personaMatcher.ts](src/types/personaMatcher.ts):

```typescript
const FEATURE_WEIGHTS = {
  groupSize: 2.0,        // Increase importance
  socialness: 1.5,       // Decrease importance
  // ... other weights
}
```

## License

MIT
