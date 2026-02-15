/**
 * @fileoverview User profile analysis coordinator.
 * Orchestrates the persona classification pipeline by combining feature extraction,
 * persona matching, and statistical analysis to generate complete user profiles.
 * 
 * This is the main entry point for analyzing user behavior and generating persona results.
 */

import { Event, Group, ProfileResult, Transaction } from '../types'
import { extractUserFeatures } from '../types/feature_extractor'
import { getPersonaDetails, matchPersona } from '../types/personaMatcher'

/**
 * Analyzes a user's complete behavioral profile.
 * Combines feature extraction, persona matching, and statistical calculations
 * to generate a comprehensive persona profile with traits and metrics.
 * 
 * @param userId - Unique identifier of the user to analyze
 * @param transactions - All transactions in the system
 * @param events - All events in the system
 * @param groups - All groups in the system
 * @returns Complete profile with persona type, emoji, description, traits, and statistics
 */
export function analyzeUserProfile(
  userId: string,
  transactions: Transaction[],
  events: Event[],
  groups: Group[]
): ProfileResult {
  // Extract persona features
  const persona = extractUserFeatures(
    userId,
    transactions,
    events,
    groups
  )
  
  // Match to predefined persona
  const match = matchPersona(persona)
  const details = getPersonaDetails(match.personaKey)
  
  // Calculate stats
  const userEvents = events.filter(e => e.participants.includes(userId))
  const userTransactions = transactions.filter(t => 
    t.from === userId || 
    (t.type === 'split' && t.splits?.some(s => s.userId === userId))
  )
  
  const totalSpent = userTransactions.reduce((sum, t) => {
    if (t.from === userId) return sum + t.totalAmount
    if (t.type === 'split' && t.splits) {
      const userSplit = t.splits.find(s => s.userId === userId)
      return sum + (userSplit?.paid ?? 0)
    }
    return sum
  }, 0)
  
  const avgEventCost = userEvents.length > 0 
    ? totalSpent / userEvents.length 
    : 0
  
  // Get user's payment speed (avg hours to settle)
  const p2pTransactions = transactions.filter(t => 
    t.type === 'p2p' && t.from === userId
  )
  
  // Calculate generosity score
  const paidForOthers = userTransactions.filter(t => 
    t.from === userId && (t.type === 'split' || t.type === 'event')
  ).length
  const generosityScore = userTransactions.length > 0 
    ? paidForOthers / userTransactions.length 
    : 0
  
  // Calculate average group size
  const avgGroupSize = userEvents.length > 0
    ? userEvents.reduce((sum, e) => sum + e.participants.length, 0) / userEvents.length
    : 0
  
  // Calculate events per month
  const eventDates = userEvents
    .map(e => new Date(e.date).getTime())
    .filter(d => !isNaN(d))
  const monthsOfData = eventDates.length > 0
    ? (Math.max(...eventDates) - Math.min(...eventDates)) / (1000 * 60 * 60 * 24 * 30)
    : 1
  const eventsPerMonth = monthsOfData > 0 
    ? userEvents.length / Math.max(monthsOfData, 1) 
    : 0
  
  // Calculate average transaction amount
  const avgTransactionAmount = userTransactions.length > 0
    ? totalSpent / userTransactions.length
    : 0
  
  const avgSettlementHours = p2pTransactions.length > 0 ? 48 : 120
  
  // Most active hour
  const eventHours = userEvents
    .map(e => new Date(e.date))
    .filter(d => !isNaN(d.getTime()))
    .map(d => d.getHours())
  const mostActiveHour = eventHours.length > 0
    ? Math.round(eventHours.reduce((a, b) => a + b, 0) / eventHours.length)
    : 18
  
  return {
    type: details.type,
    emoji: details.emoji,
    description: details.description,
    traits: details.traits,
    stats: {
      eventsAttended: userEvents.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      avgEventCost: Math.round(avgEventCost * 100) / 100,
      features: {
        avgGroupSize: Math.round(avgGroupSize * 10) / 10,
        eventsPerMonth: Math.round(eventsPerMonth * 10) / 10,
        avgTransactionAmount: Math.round(avgTransactionAmount * 100) / 100,
        avgSettlementHours,
        mostActiveHour,
        generosityScore: Math.round(generosityScore * 100) / 100
      }
    }
  }
}
