# 🎭 Group Persona System

Analyzes group dynamics based on collective member behavior to identify group personality types.

## Overview

The group persona system aggregates individual member personas and transaction patterns to classify groups into collective personality types, helping understand group spending habits, social patterns, and activity preferences.

## Features

### 📊 Group Analysis

- **Dominant Persona**: The most common personality type in the group
- **Persona Distribution**: Breakdown of all member personas (e.g., 40% Hype Person, 30% Planner, 30% Foodie)
- **Group Traits**: Collective behavioral characteristics
- **Group Stats**: Aggregated metrics across all group activities

### 📈 Metrics Tracked

- Total events held
- Total amount spent
- Average event cost
- Group generosity score
- Most active time of day
- Average group size per event

## Group Personas

### 🌟 The Party Crew (Hype Person)
High energy group with frequent events, generous members, and quick payments.

### 📅 The Organized Squad (Planner)
Well-organized with reliable members, balanced spending, and regular meetups.

### 🎉 The Social Circle (Party Animal)
Large gatherings, night owl activities, occasional payment delays.

### 🍜 The Culinary Club (Foodie Explorer)
Premium dining experiences, small intimate groups, generous tippers.

### 💸 The Budget Conscious Crew (Budget Hawk)
Cost-effective events, quick settlers, smaller gatherings.

### 🦉 The Late Night Gang (Night Owl)
Evening activities, spontaneous plans, medium-sized groups.

### ☕ The Morning Club (Early Bird)
Morning activities, punctual members, breakfast focused.

### 🎲 The Adventure Squad (Wild Card)
Spontaneous adventures, high energy, premium experiences.

### 🎯 The Care Crew (Mom Friend)
Supportive group, caring members, reliable friends.

### 🏠 The Local Legends (Hometown Hero)
Creature of habit, local favorites, loyal friends.

### 💰 The VIP Circle (Generous Whale)
Premium experiences, very generous, quick payers.

### 👻 The Low-Key Collective (Ghost)
Low activity, intimate settings, casual vibes.

## Usage

### In GroupProfile Component

```typescript
import { analyzeGroupPersona } from '@/src/types/groupPersonaAnalyzer'
import { getGroupData } from '@/src/__mocks__/groupMockData'

// Get group data
const groupData = getGroupData(group.id)

// Analyze group persona
const groupPersona = groupData 
  ? analyzeGroupPersona(
      group.id,
      groupData.members,
      groupData.transactions,
      groupData.events,
      [groupData.group]
    )
  : null

// Display results
console.log(groupPersona.dominantPersona.emoji) // 🌟
console.log(groupPersona.dominantPersona.description) // The Party Crew
console.log(groupPersona.personaDistribution) // [{ personaKey: 'hypePerson', count: 3, percentage: 50 }, ...]
```

### Display Group Persona

The system automatically displays in the GroupProfile component:

- **Collapsed view**: Shows emoji, persona name, and description
- **Expanded view** (tap to expand): Shows:
  - Group traits
  - Member persona distribution
  - Detailed group statistics

## Mock Data

Three groups are set up with realistic data:

### Basketball Crew (group-1)
- 6 members
- 6 events
- Mix of splits and event payments
- Active organizers: Guillaume, Maya, Jordan

### Friday Night Football (group-2)
- 5 members
- 4 events
- Higher spending per event
- Social activities focus

### Brunch Squad (group-3)
- 3 members
- 2 events
- Premium dining
- Small intimate gatherings

## How It Works

1. **Member Analysis**: Analyzes each group member's individual persona
2. **Dominant Detection**: Finds the most common persona type
3. **Distribution Calculation**: Counts and percentages of each persona type
4. **Aggregate Stats**: Calculates group-wide statistics
5. **Trait Assignment**: Assigns group-specific behavioral traits

## Calculation Details

```typescript
// Persona distribution
personaDistribution: [
  { personaKey: 'hypePerson', emoji: '🌟', count: 3, percentage: 50 },
  { personaKey: 'planner', emoji: '📅', count: 2, percentage: 33 },
  { personaKey: 'foodieExplorer', emoji: '🍜', count: 1, percentage: 17 }
]

// Group stats
groupStats: {
  totalMembers: 6,
  totalEvents: 6,
  totalSpent: 770.00,
  avgEventCost: 128.33,
  avgGroupSize: 4.8,
  mostActiveTime: 17,  // 5:00 PM
  groupGenerosity: 0.82  // 82% of transactions involve paying for others
}
```

## Files

- **[src/types/groupPersonaAnalyzer.ts](src/types/groupPersonaAnalyzer.ts)** - Core analysis logic
- **[data/groupMockData.ts](data/groupMockData.ts)** - Mock data for all groups and members
- **[components/GroupProfile.tsx](components/GroupProfile.tsx)** - Display component

## Integration

The group persona system is integrated into the GroupProfile component and works seamlessly with the existing group display. It uses the same mock data system as individual personas for consistency.

To see it in action:
1. Navigate to the Groups tab
2. Select any of the first three groups (Basketball Crew, Friday Night Football, or Brunch Squad)
3. View the group persona section below the member count
4. Tap to expand for detailed breakdown

## Future Enhancements

- Real-time persona updates as group dynamics change
- Historical persona tracking
- Group compatibility scoring
- Persona-based event recommendations
- Cross-group comparisons
