import { Persona, ProfileResult } from './index'
import { extractUserFeatures } from './feature_extractor'
import { matchPersona, getPersonaDetails } from './personaMatcher'
import { Transaction, Event, Group, User } from './index'

interface GroupPersonaResult {
  dominantPersona: ProfileResult
  personaDistribution: Array<{
    personaKey: string
    emoji: string
    count: number
    percentage: number
  }>
  groupTraits: string[]
  groupStats: {
    totalMembers: number
    totalEvents: number
    totalSpent: number
    avgEventCost: number
    avgGroupSize: number
    mostActiveTime: number
    groupGenerosity: number
  }
}

// Define group-specific personas based on collective behavior
const groupPersonaTraits: Record<string, { description: string; traits: string[] }> = {
  hypePerson: {
    description: 'The Party Crew - Always planning the next big event',
    traits: ['High energy group', 'Frequent events', 'Generous with each other', 'Quick to settle up']
  },
  planner: {
    description: 'The Organized Squad - Everything runs like clockwork',
    traits: ['Well-organized', 'Reliable members', 'Balanced spending', 'Regular meetups']
  },
  partyAnimal: {
    description: 'The Social Circle - Living for the weekend',
    traits: ['Loves big gatherings', 'Night owls', 'Occasional payment delays', 'High activity']
  },
  foodieExplorer: {
    description: 'The Culinary Club - Quality dining experiences',
    traits: ['Premium tastes', 'Small intimate groups', 'Food-focused events', 'Generous tippers']
  },
  budgetHawk: {
    description: 'The Budget Conscious Crew - Smart spenders',
    traits: ['Cost-effective events', 'Quick settlers', 'Prefers deals', 'Smaller gatherings']
  },
  nightOwl: {
    description: 'The Late Night Gang - Best after dark',
    traits: ['Prefer evening activities', 'Spontaneous plans', 'Social and active', 'Medium sized groups']
  },
  earlyBird: {
    description: 'The Morning Club - Rise and shine together',
    traits: ['Morning activities', 'Punctual members', 'Organized', 'Breakfast lovers']
  },
  wildCard: {
    description: 'The Adventure Squad - Always trying something new',
    traits: ['Spontaneous adventures', 'High energy', 'Premium experiences', 'Very generous']
  },
  momFriend: {
    description: 'The Care Crew - Looking out for each other',
    traits: ['Supportive group', 'Caring members', 'Reliable', 'Quick to help out']
  },
  hometownHero: {
    description: 'The Local Legends - Know all the best spots',
    traits: ['Creature of habit', 'Local favorites', 'Loyal friends', 'Balanced lifestyle']
  },
  generousWhale: {
    description: 'The VIP Circle - No expense spared',
    traits: ['Premium experiences', 'Very generous', 'Quick payers', 'Love to host']
  },
  ghost: {
    description: 'The Low-Key Collective - Relaxed and casual',
    traits: ['Low activity', 'Intimate settings', 'Slow to organize', 'Casual vibes']
  }
}

export function analyzeGroupPersona(
  groupId: string,
  members: User[],
  transactions: Transaction[],
  events: Event[],
  groups: Group[]
): GroupPersonaResult {
  // Analyze each member's persona
  const memberPersonas = members.map(member => {
    const persona = extractUserFeatures(member.id, transactions, events, groups)
    const match = matchPersona(persona)
    return {
      userId: member.id,
      userName: member.name,
      personaKey: match.personaKey,
      persona,
      similarity: match.similarity
    }
  })

  // Count persona distribution
  const personaCounts = memberPersonas.reduce((acc, mp) => {
    acc[mp.personaKey] = (acc[mp.personaKey] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Find dominant persona
  const dominantPersonaKey = Object.entries(personaCounts)
    .sort((a, b) => b[1] - a[1])[0][0]

  // Calculate persona distribution for display
  const personaDistribution = Object.entries(personaCounts)
    .map(([key, count]) => {
      const details = getPersonaDetails(key)
      return {
        personaKey: key,
        emoji: details.emoji,
        count,
        percentage: Math.round((count / members.length) * 100)
      }
    })
    .sort((a, b) => b.count - a.count)

  // Calculate group-wide stats
  const groupEvents = events.filter(e => e.groupId === groupId)
  const groupTransactions = transactions.filter(t => t.groupId === groupId)

  const totalSpent = groupTransactions.reduce((sum, t) => {
    if (t.type === 'split' || t.type === 'event') {
      return sum + t.totalAmount
    }
    return sum
  }, 0)

  const avgEventCost = groupEvents.length > 0 ? totalSpent / groupEvents.length : 0

  const avgGroupSize = groupEvents.length > 0
    ? groupEvents.reduce((sum, e) => sum + e.participants.length, 0) / groupEvents.length
    : 0

  // Calculate group's most active time
  const eventHours = groupEvents
    .map(e => new Date(e.date))
    .filter(d => !isNaN(d.getTime()))
    .map(d => d.getHours())
  const mostActiveTime = eventHours.length > 0
    ? Math.round(eventHours.reduce((a, b) => a + b, 0) / eventHours.length)
    : 18

  // Calculate group generosity (how often members pay for others)
  const paidForOthers = groupTransactions.filter(t => 
    t.type === 'split' || t.type === 'event'
  ).length
  const groupGenerosity = groupTransactions.length > 0
    ? paidForOthers / groupTransactions.length
    : 0

  // Calculate total events across time for activity level
  const eventDates = groupEvents
    .map(e => new Date(e.date).getTime())
    .filter(d => !isNaN(d))
  const monthsOfData = eventDates.length > 0
    ? (Math.max(...eventDates) - Math.min(...eventDates)) / (1000 * 60 * 60 * 24 * 30)
    : 1

  // Get traits for dominant persona
  const dominantDetails = getPersonaDetails(dominantPersonaKey)
  const groupTraitInfo = groupPersonaTraits[dominantPersonaKey] || {
    description: dominantDetails.description,
    traits: dominantDetails.traits
  }

  return {
    dominantPersona: {
      type: dominantPersonaKey,
      emoji: dominantDetails.emoji,
      description: groupTraitInfo.description,
      traits: groupTraitInfo.traits,
      stats: {
        eventsAttended: groupEvents.length,
        totalSpent: Math.round(totalSpent * 100) / 100,
        avgEventCost: Math.round(avgEventCost * 100) / 100,
        features: {
          avgGroupSize: Math.round(avgGroupSize * 10) / 10,
          eventsPerMonth: monthsOfData > 0 ? Math.round((groupEvents.length / Math.max(monthsOfData, 1)) * 10) / 10 : 0,
          avgTransactionAmount: groupTransactions.length > 0 
            ? Math.round((totalSpent / groupTransactions.length) * 100) / 100 
            : 0,
          avgSettlementHours: 48, // Placeholder - would need settlement timestamps
          mostActiveHour: mostActiveTime,
          generosityScore: Math.round(groupGenerosity * 100) / 100
        }
      }
    },
    personaDistribution,
    groupTraits: groupTraitInfo.traits,
    groupStats: {
      totalMembers: members.length,
      totalEvents: groupEvents.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      avgEventCost: Math.round(avgEventCost * 100) / 100,
      avgGroupSize: Math.round(avgGroupSize * 10) / 10,
      mostActiveTime,
      groupGenerosity: Math.round(groupGenerosity * 100) / 100
    }
  }
}
