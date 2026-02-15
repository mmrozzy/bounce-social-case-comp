# How the Persona System Works

## Overview

Bounce Together automatically analyzes your spending and social behavior to assign you a personality type. This helps you understand your social spending patterns and see how you fit within your friend groups.

---

## User Personas: How It Works

### Step 1: Data Collection
The system analyzes your activity across three key areas:
- **Transactions**: Your spending history, payment patterns, and generosity
- **Events**: The gatherings you attend and create
- **Groups**: The friend groups you're part of

### Step 2: Feature Extraction
Your behavior is measured across **7 dimensions**:

1. **Group Size** → Do you prefer small hangouts, medium gatherings, or large parties?
2. **Socialness** → Are you an introvert, ambivert, or extrovert based on event creation rate?
3. **Budget Level** → Do you spend budget-conscious, moderately, or premium amounts?
4. **Generosity** → How often do you pay more than your share?
5. **Payment Speed** → Do you settle up quickly, on time, or slowly?
6. **Activity Level** → How frequently do you participate in events?
7. **Time Preference** → Are you a morning, afternoon, evening, or night person?

### Step 3: Persona Matching
Your behavioral profile is compared against 12 predefined personas using weighted scoring:
- Features like **socialness** and **generosity** have higher weights
- The system finds your closest persona match
- Each persona has unique traits, emojis, and descriptions

### Step 4: Display
Your persona is shown with:
- **Emoji**: Visual identifier (e.g., 🍜 for The Foodie Explorer)
- **Description**: One-line summary of your social style
- **Traits**: Key behavioral characteristics
- **Stats**: Numbers backing up your classification

---

## Group Personas: How It Works

Groups also get personas based on their collective behavior.

### Step 1: Aggregate Member Data
- Analyze all member personas in the group
- Calculate group-wide spending, event frequency, and patterns

### Step 2: Determine Dominant Persona
- Find the most common persona type among members
- This becomes the group's identity

### Step 3: Group Analysis
The system generates:
- **Dominant Persona**: The most common member type
- **Persona Distribution**: Breakdown of all member personas (e.g., 3x Party Animals, 2x Planners)
- **Group Traits**: Collective behavioral characteristics
- **Group Stats**: Total spent, event frequency, average generosity

---

## The 12 Personas

1. **🎯 The Mom Friend** - Organized, caring, quick to settle
2. **🎉 The Party Animal** - Social butterfly, loves big groups
3. **🍜 The Foodie Explorer** - Premium tastes, adventurous eater
4. **💸 The Budget Hawk** - Cost-conscious, watches every penny
5. **👻 The Ghost** - Hard to pin down, low activity
6. **🌟 The Hype Person** - High energy, generous, social
7. **📅 The Planner** - Detail-oriented, organized, reliable
8. **🎲 The Wild Card** - Spontaneous, unpredictable, fun
9. **🏠 The Hometown Hero** - Local expert, creature of habit
10. **☕ The Early Bird** - Morning person, punctual
11. **🦉 The Night Owl** - Night person, spontaneous
12. **💰 The Generous Whale** - Big spender, loves treating friends

---

## Example

**Sarah's Activity:**
- Attends 20 events with 8-12 people each
- Creates 14 of those events herself
- Spends $45 avg per event
- Often pays more than her share
- Settles up within 24 hours
- Most active 7pm-11pm

**Feature Extraction:**
- Group Size: Large (avg 10 people)
- Socialness: Extrovert (70% creation rate)
- Budget Level: Moderate ($45 avg)
- Generosity: High
- Payment Speed: Fast
- Activity Level: High
- Time Preference: Evening

**Result:** 🌟 **The Hype Person**

---

## Technical Implementation

- **Feature Extraction**: [src/types/feature_extractor.ts](../src/types/feature_extractor.ts)
- **Persona Matching Algorithm**: [src/types/personaMatcher.ts](../src/types/personaMatcher.ts)
- **Group Analysis**: [src/types/groupPersonaAnalyzer.ts](../src/types/groupPersonaAnalyzer.ts)
- **Profile Analyzer**: [src/utils/profileAnalyzer.ts](../src/utils/profileAnalyzer.ts)
