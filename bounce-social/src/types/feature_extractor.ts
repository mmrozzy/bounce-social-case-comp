import { Transaction, Event, Group, Persona } from './index'

export function extractUserFeatures(
  userId: string,
  transactions: Transaction[],
  events: Event[],
  groups: Group[]
): Persona {
  // Get user's transactions (only as payer)
  const userTransactions = transactions.filter(t => 
    t.from === userId || 
    (t.type === 'split' && t.splits?.some(s => s.userId === userId && (s.paid ?? 0) > 0))
  )

  const userEvents = events.filter(e => 
    e.participants.includes(userId)
  )

  // Calculate average group size
  const avgGroupSize = userEvents.length > 0
    ? userEvents.reduce((sum, e) => sum + e.participants.length, 0) / userEvents.length
    : 2

  const groupSize = 
    avgGroupSize <= 3 ? 'small' : 
    avgGroupSize <= 6 ? 'medium' : 'large'

  // Calculate socialness (events created / events attended)
  const createdEvents = events.filter(e => e.createdBy === userId).length
  const createRate = userEvents.length > 0 ? createdEvents / userEvents.length : 0
  
  const socialness = 
    createRate > 0.6 ? 'extrovert' : 
    createRate > 0.3 ? 'ambivert' : 'introvert'

  // Calculate budget level (average spending per transaction)
  const totalSpent = userTransactions.reduce((sum, t) => {
    if (t.from === userId) return sum + t.totalAmount
    if (t.type === 'split' && t.splits) {
      const userSplit = t.splits.find(s => s.userId === userId)
      return sum + (userSplit?.paid ?? 0)
    }
    return sum
  }, 0)

  const avgSpend = userTransactions.length > 0 ? totalSpent / userTransactions.length : 0
  
  const budgetLevel = 
    avgSpend < 20 ? 'budget' : 
    avgSpend < 50 ? 'moderate' : 'premium'

  // Calculate generosity (paying for others)
  const paidForOthers = transactions.filter(t => 
    t.from === userId && 
    (t.type === 'split' || t.type === 'event')
  ).length
  
  const generosityRate = userTransactions.length > 0 
    ? paidForOthers / userTransactions.length 
    : 0

  const generosity = 
    generosityRate > 0.5 ? 'high' : 
    generosityRate > 0.25 ? 'medium' : 'low'

  // Calculate payment speed (simplified - you'd need settlement timestamps)
  // For now, use p2p frequency as proxy for being good with money
  const p2pCount = transactions.filter(t => 
    t.type === 'p2p' && t.from === userId
  ).length
  
  const settleRate = userTransactions.length > 0 ? p2pCount / userTransactions.length : 0
  
  const paymentSpeed = 
    settleRate > 0.4 ? 'fast' : 
    settleRate > 0.2 ? 'medium' : 'slow'

  // Calculate activity level (events per month)
  const eventDates = userEvents.map(e => new Date(e.date).getTime()).filter(d => !isNaN(d))
  const monthsOfData = eventDates.length > 0
    ? (Math.max(...eventDates) - Math.min(...eventDates)) / (1000 * 60 * 60 * 24 * 30)
    : 1
  const eventsPerMonth = monthsOfData > 0 ? userEvents.length / Math.max(monthsOfData, 1) : 0
  
  const activityLevel = 
    eventsPerMonth > 8 ? 'high' : 
    eventsPerMonth > 3 ? 'medium' : 'low'

  // Calculate time preference (most active time of day)
  const eventHours = userEvents
    .map(e => new Date(e.date))
    .filter(d => !isNaN(d.getTime()))
    .map(d => d.getHours())
  const avgHour = eventHours.length > 0
    ? eventHours.reduce((a, b) => a + b, 0) / eventHours.length
    : 18

  const timePreference = 
    avgHour < 11 ? 'morning' : 
    avgHour < 16 ? 'afternoon' : 
    avgHour < 21 ? 'evening' : 'night'

  return {
    groupSize,
    socialness,
    budgetLevel,
    generosity,
    paymentSpeed,
    activityLevel,
    timePreference
  }
}
