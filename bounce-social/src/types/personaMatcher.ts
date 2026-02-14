import { Persona } from './index'
import { personas } from '../__mocks__/personas'

// Weights for each feature in similarity calculation
const FEATURE_WEIGHTS = {
  groupSize: 1.5,
  socialness: 2.0,
  budgetLevel: 1.2,
  generosity: 1.8,
  paymentSpeed: 1.0,
  activityLevel: 1.5,
  timePreference: 0.8
}

// Calculate similarity between two categorical values
function categoricalSimilarity(value1: string, value2: string, orderedValues: string[]): number {
  if (value1 === value2) return 1.0
  
  const idx1 = orderedValues.indexOf(value1)
  const idx2 = orderedValues.indexOf(value2)
  
  if (idx1 === -1 || idx2 === -1) return 0
  
  // Closer values have higher similarity
  const distance = Math.abs(idx1 - idx2)
  const maxDistance = orderedValues.length - 1
  return 1 - (distance / maxDistance)
}

// Calculate overall similarity score between two personas
function calculateSimilarity(persona1: Persona, persona2: Persona): number {
  let totalScore = 0
  let totalWeight = 0
  
  // Group size similarity
  const groupSizeScore = categoricalSimilarity(
    persona1.groupSize, 
    persona2.groupSize, 
    ['small', 'medium', 'large']
  )
  totalScore += groupSizeScore * FEATURE_WEIGHTS.groupSize
  totalWeight += FEATURE_WEIGHTS.groupSize
  
  // Socialness similarity
  const socialnessScore = categoricalSimilarity(
    persona1.socialness,
    persona2.socialness,
    ['introvert', 'ambivert', 'extrovert']
  )
  totalScore += socialnessScore * FEATURE_WEIGHTS.socialness
  totalWeight += FEATURE_WEIGHTS.socialness
  
  // Budget level similarity
  const budgetScore = categoricalSimilarity(
    persona1.budgetLevel,
    persona2.budgetLevel,
    ['budget', 'moderate', 'premium']
  )
  totalScore += budgetScore * FEATURE_WEIGHTS.budgetLevel
  totalWeight += FEATURE_WEIGHTS.budgetLevel
  
  // Generosity similarity
  const generosityScore = categoricalSimilarity(
    persona1.generosity,
    persona2.generosity,
    ['low', 'medium', 'high']
  )
  totalScore += generosityScore * FEATURE_WEIGHTS.generosity
  totalWeight += FEATURE_WEIGHTS.generosity
  
  // Payment speed similarity
  const paymentSpeedScore = categoricalSimilarity(
    persona1.paymentSpeed,
    persona2.paymentSpeed,
    ['slow', 'medium', 'fast']
  )
  totalScore += paymentSpeedScore * FEATURE_WEIGHTS.paymentSpeed
  totalWeight += FEATURE_WEIGHTS.paymentSpeed
  
  // Activity level similarity
  const activityScore = categoricalSimilarity(
    persona1.activityLevel,
    persona2.activityLevel,
    ['low', 'medium', 'high']
  )
  totalScore += activityScore * FEATURE_WEIGHTS.activityLevel
  totalWeight += FEATURE_WEIGHTS.activityLevel
  
  // Time preference similarity
  const timeScore = categoricalSimilarity(
    persona1.timePreference,
    persona2.timePreference,
    ['morning', 'afternoon', 'evening', 'night']
  )
  totalScore += timeScore * FEATURE_WEIGHTS.timePreference
  totalWeight += FEATURE_WEIGHTS.timePreference
  
  return totalScore / totalWeight
}

// Match a user's persona to the closest predefined persona
export function matchPersona(userPersona: Persona): {
  personaKey: string
  similarity: number
  matches: Array<{ key: string; similarity: number }>
} {
  const matches = Object.entries(personas).map(([key, persona]) => ({
    key,
    similarity: calculateSimilarity(userPersona, persona)
  }))
  
  // Sort by similarity (descending)
  matches.sort((a, b) => b.similarity - a.similarity)
  
  return {
    personaKey: matches[0].key,
    similarity: matches[0].similarity,
    matches: matches.slice(0, 3) // Return top 3 matches
  }
}

// Get persona description and emoji
export function getPersonaDetails(personaKey: string): {
  type: string
  emoji: string
  description: string
  traits: string[]
} {
  const personaInfo: Record<string, { emoji: string; description: string; traits: string[] }> = {
    momFriend: {
      emoji: '🎯',
      description: 'The Mom Friend - Always organized, takes care of everyone',
      traits: ['Organized', 'Caring', 'Reliable', 'Quick to settle bills']
    },
    partyAnimal: {
      emoji: '🎉',
      description: 'The Party Animal - Lives for big nights out',
      traits: ['Social butterfly', 'Night owl', 'Loves crowds', 'Forgets to pay back']
    },
    foodieExplorer: {
      emoji: '🍜',
      description: 'The Foodie Explorer - Quality over quantity, loves trying new places',
      traits: ['Adventurous eater', 'Premium tastes', 'Generous tipper', 'Small groups']
    },
    budgetHawk: {
      emoji: '💸',
      description: 'The Budget Hawk - Watches every penny, splits to the cent',
      traits: ['Cost-conscious', 'Quick settler', 'Prefers deals', 'Small gatherings']
    },
    ghost: {
      emoji: '👻',
      description: 'The Ghost - Hard to pin down, slow to respond',
      traits: ['Rarely organizes', 'Slow payer', 'Prefers intimate settings', 'Low activity']
    },
    hypePerson: {
      emoji: '🌟',
      description: 'The Hype Person - Brings the energy, everyone\'s cheerleader',
      traits: ['Super social', 'Generous', 'Quick payer', 'Always planning']
    },
    planner: {
      emoji: '📅',
      description: 'The Planner - Has the itinerary ready, organized to a T',
      traits: ['Detail-oriented', 'Reliable', 'Balanced spender', 'Medium groups']
    },
    wildCard: {
      emoji: '🎲',
      description: 'The Wild Card - Spontaneous, unpredictable, always fun',
      traits: ['Spontaneous', 'High energy', 'Premium spender', 'Very generous']
    },
    hometownHero: {
      emoji: '🏠',
      description: 'The Hometown Hero - Knows all the local spots, sticks to favorites',
      traits: ['Local expert', 'Creature of habit', 'Balanced', 'Loyal friend']
    },
    earlyBird: {
      emoji: '☕',
      description: 'The Early Bird - Morning person, likes brunch and coffee dates',
      traits: ['Morning enthusiast', 'Punctual', 'Organized', 'Loves breakfast spots']
    },
    nightOwl: {
      emoji: '🦉',
      description: 'The Night Owl - Comes alive after dark, late night adventures',
      traits: ['Night person', 'Spontaneous', 'Social', 'Prefers late meetups']
    },
    generousWhale: {
      emoji: '💰',
      description: 'The Generous Whale - Big spender, loves treating friends',
      traits: ['Very generous', 'Premium tastes', 'Quick payer', 'Loves to host']
    }
  }
  
  const details = personaInfo[personaKey] || {
    emoji: '❓',
    description: 'Unknown persona type',
    traits: []
  }
  
  return {
    type: personaKey,
    ...details
  }
}
