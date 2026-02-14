export interface User {
  id: string
  name: string
  joinedGroups: string[]
  profileImage?: string
  bannerImage?: string
}

export interface Group {
  id: string
  name: string
  members: string[]
  createdAt: string
  profileImage?: string
  bannerImage?: string
}

export interface Event {
  id: string
  groupId: string
  name: string
  date: string
  createdBy: string
  participants: string[]
}

export interface Split {
  userId: string
  owes: number
  paid: number
  net: number
}

export interface EventTransaction {
  id: string
  eventId: string | null
  groupId: string
  type: 'event'
  from: string
  amount: number
  totalAmount: number
  participants: string[]
  createdAt: string
}

export interface SplitTransaction {
  id: string
  eventId: string | null
  groupId: string
  type: 'split'
  from: string
  totalAmount: number
  participants: string[]
  splits: Split[]
  createdAt: string
}

export interface P2PTransaction {
  id: string
  eventId: string | null
  groupId: string
  type: 'p2p'
  from: string
  to: string
  totalAmount: number
  note: string
  createdAt: string
}

export type Transaction = SplitTransaction | P2PTransaction | EventTransaction

export interface Persona {
  // Social Behavior
  groupSize: 'small' | 'medium' | 'large'  // preferred group size (2-4, 5-7, 8+)
  socialness: 'introvert' | 'ambivert' | 'extrovert'  // event frequency & openness
  
  // Financial
  budgetLevel: 'budget' | 'moderate' | 'premium'  // spending tier
  generosity: 'low' | 'medium' | 'high'  // tips, covering others
  paymentSpeed: 'fast' | 'medium' | 'slow'  // settlement speed
  
  // Activity Patterns
  activityLevel: 'low' | 'medium' | 'high'  // how often they go out
  timePreference: 'morning' | 'afternoon' | 'evening' | 'night'  // preferred hours
}

export interface UserFeatures {
  avgGroupSize: number
  eventsPerMonth: number
  avgTransactionAmount: number
  avgSettlementHours: number
  mostActiveHour: number
  generosityScore: number  // based on tips, covering others
}

export interface ProfileResult {
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
