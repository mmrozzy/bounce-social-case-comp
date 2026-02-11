import { User, Group, Event, Transaction } from '../src/types'

// All users in the system
export const allUsers: User[] = [
  { id: 'current-user', name: 'Guillaume', joinedGroups: ['group-1', 'group-2', 'group-3'] },
  { id: 'user-2', name: 'Alex Chen', joinedGroups: ['group-1', 'group-2'] },
  { id: 'user-3', name: 'Maya Patel', joinedGroups: ['group-1', 'group-3'] },
  { id: 'user-4', name: 'Jordan Lee', joinedGroups: ['group-1'] },
  { id: 'user-5', name: 'Taylor Swift', joinedGroups: ['group-1'] },
  { id: 'user-6', name: 'Sam Rodriguez', joinedGroups: ['group-1'] },
  { id: 'user-7', name: 'Casey Morgan', joinedGroups: ['group-2'] },
  { id: 'user-8', name: 'Riley Johnson', joinedGroups: ['group-2'] },
  { id: 'user-9', name: 'Jamie Park', joinedGroups: ['group-2'] },
  { id: 'user-10', name: 'Drew Martinez', joinedGroups: ['group-3'] },
]

// All groups
export const allGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Basketball Crew',
    members: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    createdAt: '2025-11-15T00:00:00Z'
  },
  {
    id: 'group-2',
    name: 'Friday Night Football',
    members: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9'],
    createdAt: '2025-12-01T00:00:00Z'
  },
  {
    id: 'group-3',
    name: 'Brunch Squad',
    members: ['current-user', 'user-3', 'user-10'],
    createdAt: '2026-01-10T00:00:00Z'
  }
]

// All events across all groups
export const allEvents: Event[] = [
  // Basketball Crew events
  {
    id: 'event-1',
    groupId: 'group-1',
    name: 'Friday Basketball Game',
    date: '2026-01-12T19:00:00Z',
    createdBy: 'user-2',
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6']
  },
  {
    id: 'event-2',
    groupId: 'group-1',
    name: 'Weekend Tournament',
    date: '2026-01-20T10:00:00Z',
    createdBy: 'current-user',
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5']
  },
  {
    id: 'event-4',
    groupId: 'group-1',
    name: 'Practice Session',
    date: '2026-01-26T18:30:00Z',
    createdBy: 'current-user',
    participants: ['current-user', 'user-2', 'user-3', 'user-4']
  },
  {
    id: 'event-7',
    groupId: 'group-1',
    name: 'Championship Game',
    date: '2026-02-09T15:00:00Z',
    createdBy: 'current-user',
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6']
  },
  {
    id: 'event-11',
    groupId: 'group-1',
    name: 'Team Dinner',
    date: '2026-01-18T20:00:00Z',
    createdBy: 'user-3',
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6']
  },
  {
    id: 'event-12',
    groupId: 'group-1',
    name: 'Morning Shootaround',
    date: '2026-01-15T09:00:00Z',
    createdBy: 'user-4',
    participants: ['user-2', 'user-4', 'user-5', 'user-6']
  },
  
  // Friday Night Football events
  {
    id: 'event-3',
    groupId: 'group-2',
    name: 'Sunday Football',
    date: '2026-01-21T14:00:00Z',
    createdBy: 'user-7',
    participants: ['current-user', 'user-2', 'user-7', 'user-8']
  },
  {
    id: 'event-6',
    groupId: 'group-2',
    name: 'Game Night',
    date: '2026-02-07T20:00:00Z',
    createdBy: 'current-user',
    participants: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9']
  },
  {
    id: 'event-8',
    groupId: 'group-2',
    name: 'Super Bowl Watch Party',
    date: '2026-02-01T18:00:00Z',
    createdBy: 'user-8',
    participants: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9']
  },
  {
    id: 'event-9',
    groupId: 'group-2',
    name: 'Flag Football Tournament',
    date: '2026-01-28T15:00:00Z',
    createdBy: 'user-7',
    participants: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9']
  },
  
  // Brunch Squad events
  {
    id: 'event-5',
    groupId: 'group-3',
    name: 'Sunday Brunch',
    date: '2026-02-04T11:00:00Z',
    createdBy: 'user-3',
    participants: ['current-user', 'user-3', 'user-10']
  },
  {
    id: 'event-10',
    groupId: 'group-3',
    name: 'Breakfast Club',
    date: '2026-01-25T10:00:00Z',
    createdBy: 'user-10',
    participants: ['current-user', 'user-3', 'user-10']
  },
]

// All transactions across all groups
export const allTransactions: Transaction[] = [
  // Basketball Crew transactions
  {
    id: 'tx-1',
    eventId: 'event-1',
    groupId: 'group-1',
    type: 'split',
    from: 'user-2',
    totalAmount: 120.00,
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    splits: [
      { userId: 'current-user', paid: 0, owes: 20, net: -20 },
      { userId: 'user-2', paid: 120, owes: 0, net: 100 },
      { userId: 'user-3', paid: 0, owes: 20, net: -20 },
      { userId: 'user-4', paid: 0, owes: 20, net: -20 },
      { userId: 'user-5', paid: 0, owes: 20, net: -20 },
      { userId: 'user-6', paid: 0, owes: 20, net: -20 }
    ],
    createdAt: '2026-01-12T21:30:00Z'
  },
  {
    id: 'tx-2',
    eventId: 'event-1',
    groupId: 'group-1',
    type: 'p2p',
    from: 'current-user',
    to: 'user-2',
    totalAmount: 20.00,
    note: 'Court rental',
    createdAt: '2026-01-13T09:00:00Z'
  },
  {
    id: 'tx-3',
    eventId: 'event-2',
    groupId: 'group-1',
    type: 'split',
    from: 'current-user',
    totalAmount: 200.00,
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5'],
    splits: [
      { userId: 'current-user', paid: 200, owes: 0, net: 160 },
      { userId: 'user-2', paid: 0, owes: 40, net: -40 },
      { userId: 'user-3', paid: 0, owes: 40, net: -40 },
      { userId: 'user-4', paid: 0, owes: 40, net: -40 },
      { userId: 'user-5', paid: 0, owes: 40, net: -40 }
    ],
    createdAt: '2026-01-20T18:00:00Z'
  },
  {
    id: 'tx-4',
    eventId: 'event-2',
    groupId: 'group-1',
    type: 'p2p',
    from: 'user-2',
    to: 'current-user',
    totalAmount: 40.00,
    note: 'Tournament entry fee',
    createdAt: '2026-01-21T10:00:00Z'
  },
  {
    id: 'tx-5',
    eventId: 'event-2',
    groupId: 'group-1',
    type: 'p2p',
    from: 'user-3',
    to: 'current-user',
    totalAmount: 40.00,
    note: 'Tournament fee',
    createdAt: '2026-01-21T14:30:00Z'
  },
  {
    id: 'tx-7',
    eventId: 'event-4',
    groupId: 'group-1',
    type: 'split',
    from: 'current-user',
    totalAmount: 60.00,
    participants: ['current-user', 'user-2', 'user-3', 'user-4'],
    splits: [
      { userId: 'current-user', paid: 60, owes: 0, net: 45 },
      { userId: 'user-2', paid: 0, owes: 15, net: -15 },
      { userId: 'user-3', paid: 0, owes: 15, net: -15 },
      { userId: 'user-4', paid: 0, owes: 15, net: -15 }
    ],
    createdAt: '2026-01-26T21:00:00Z'
  },
  {
    id: 'tx-8',
    eventId: 'event-4',
    groupId: 'group-1',
    type: 'p2p',
    from: 'user-2',
    to: 'current-user',
    totalAmount: 15.00,
    note: 'Practice fee',
    createdAt: '2026-01-27T12:00:00Z'
  },
  {
    id: 'tx-12',
    eventId: 'event-7',
    groupId: 'group-1',
    type: 'split',
    from: 'current-user',
    totalAmount: 180.00,
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    splits: [
      { userId: 'current-user', paid: 180, owes: 0, net: 150 },
      { userId: 'user-2', paid: 0, owes: 30, net: -30 },
      { userId: 'user-3', paid: 0, owes: 30, net: -30 },
      { userId: 'user-4', paid: 0, owes: 30, net: -30 },
      { userId: 'user-5', paid: 0, owes: 30, net: -30 },
      { userId: 'user-6', paid: 0, owes: 30, net: -30 }
    ],
    createdAt: '2026-02-09T19:00:00Z'
  },
  {
    id: 'tx-14',
    eventId: 'event-11',
    groupId: 'group-1',
    type: 'split',
    from: 'user-3',
    totalAmount: 340.00,
    participants: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    splits: [
      { userId: 'current-user', paid: 0, owes: 56.67, net: -56.67 },
      { userId: 'user-2', paid: 0, owes: 56.67, net: -56.67 },
      { userId: 'user-3', paid: 340, owes: 0, net: 283.33 },
      { userId: 'user-4', paid: 0, owes: 56.67, net: -56.67 },
      { userId: 'user-5', paid: 0, owes: 56.67, net: -56.67 },
      { userId: 'user-6', paid: 0, owes: 56.67, net: -56.67 }
    ],
    createdAt: '2026-01-18T23:00:00Z'
  },
  {
    id: 'tx-15',
    eventId: 'event-11',
    groupId: 'group-1',
    type: 'p2p',
    from: 'current-user',
    to: 'user-3',
    totalAmount: 56.67,
    note: 'Team dinner',
    createdAt: '2026-01-19T10:00:00Z'
  },
  {
    id: 'tx-16',
    eventId: 'event-12',
    groupId: 'group-1',
    type: 'event',
    from: 'user-4',
    amount: 40.00,
    totalAmount: 40.00,
    participants: ['user-2', 'user-4', 'user-5', 'user-6'],
    createdAt: '2026-01-15T12:00:00Z'
  },

  // Friday Night Football transactions
  {
    id: 'tx-6',
    eventId: 'event-3',
    groupId: 'group-2',
    type: 'event',
    from: 'user-7',
    amount: 80.00,
    totalAmount: 80.00,
    participants: ['current-user', 'user-2', 'user-7', 'user-8'],
    createdAt: '2026-01-21T17:00:00Z'
  },
  {
    id: 'tx-11',
    eventId: 'event-6',
    groupId: 'group-2',
    type: 'split',
    from: 'current-user',
    totalAmount: 150.00,
    participants: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9'],
    splits: [
      { userId: 'current-user', paid: 150, owes: 0, net: 120 },
      { userId: 'user-2', paid: 0, owes: 30, net: -30 },
      { userId: 'user-7', paid: 0, owes: 30, net: -30 },
      { userId: 'user-8', paid: 0, owes: 30, net: -30 },
      { userId: 'user-9', paid: 0, owes: 30, net: -30 }
    ],
    createdAt: '2026-02-07T23:00:00Z'
  },
  {
    id: 'tx-17',
    eventId: 'event-8',
    groupId: 'group-2',
    type: 'split',
    from: 'user-8',
    totalAmount: 250.00,
    participants: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9'],
    splits: [
      { userId: 'current-user', paid: 0, owes: 50, net: -50 },
      { userId: 'user-2', paid: 0, owes: 50, net: -50 },
      { userId: 'user-7', paid: 0, owes: 50, net: -50 },
      { userId: 'user-8', paid: 250, owes: 0, net: 200 },
      { userId: 'user-9', paid: 0, owes: 50, net: -50 }
    ],
    createdAt: '2026-02-01T22:00:00Z'
  },
  {
    id: 'tx-18',
    eventId: 'event-8',
    groupId: 'group-2',
    type: 'p2p',
    from: 'user-7',
    to: 'user-8',
    totalAmount: 50.00,
    note: 'Super Bowl party',
    createdAt: '2026-02-02T09:00:00Z'
  },
  {
    id: 'tx-19',
    eventId: 'event-9',
    groupId: 'group-2',
    type: 'split',
    from: 'user-7',
    totalAmount: 125.00,
    participants: ['current-user', 'user-2', 'user-7', 'user-8', 'user-9'],
    splits: [
      { userId: 'current-user', paid: 0, owes: 25, net: -25 },
      { userId: 'user-2', paid: 0, owes: 25, net: -25 },
      { userId: 'user-7', paid: 125, owes: 0, net: 100 },
      { userId: 'user-8', paid: 0, owes: 25, net: -25 },
      { userId: 'user-9', paid: 0, owes: 25, net: -25 }
    ],
    createdAt: '2026-01-28T19:00:00Z'
  },

  // Brunch Squad transactions
  {
    id: 'tx-9',
    eventId: 'event-5',
    groupId: 'group-3',
    type: 'split',
    from: 'user-3',
    totalAmount: 75.00,
    participants: ['current-user', 'user-3', 'user-10'],
    splits: [
      { userId: 'current-user', paid: 0, owes: 25, net: -25 },
      { userId: 'user-3', paid: 75, owes: 0, net: 50 },
      { userId: 'user-10', paid: 0, owes: 25, net: -25 }
    ],
    createdAt: '2026-02-04T13:30:00Z'
  },
  {
    id: 'tx-10',
    eventId: 'event-5',
    groupId: 'group-3',
    type: 'p2p',
    from: 'current-user',
    to: 'user-3',
    totalAmount: 25.00,
    note: 'Brunch split',
    createdAt: '2026-02-04T15:00:00Z'
  },
  {
    id: 'tx-20',
    eventId: 'event-10',
    groupId: 'group-3',
    type: 'split',
    from: 'user-10',
    totalAmount: 90.00,
    participants: ['current-user', 'user-3', 'user-10'],
    splits: [
      { userId: 'current-user', paid: 0, owes: 30, net: -30 },
      { userId: 'user-3', paid: 0, owes: 30, net: -30 },
      { userId: 'user-10', paid: 90, owes: 0, net: 60 }
    ],
    createdAt: '2026-01-25T13:00:00Z'
  },
  {
    id: 'tx-21',
    eventId: 'event-10',
    groupId: 'group-3',
    type: 'p2p',
    from: 'user-3',
    to: 'user-10',
    totalAmount: 30.00,
    note: 'Breakfast',
    createdAt: '2026-01-25T14:00:00Z'
  },

  // Random P2P transactions
  {
    id: 'tx-13',
    eventId: null,
    groupId: 'group-1',
    type: 'p2p',
    from: 'current-user',
    to: 'user-4',
    totalAmount: 15.00,
    note: 'Gas money',
    createdAt: '2026-02-08T16:00:00Z'
  },
]

// Helper function to get group-specific data
export function getGroupData(groupId: string) {
  const group = allGroups.find(g => g.id === groupId)
  if (!group) return null

  const groupEvents = allEvents.filter(e => e.groupId === groupId)
  const groupTransactions = allTransactions.filter(t => t.groupId === groupId)
  const groupMembers = allUsers.filter(u => group.members.includes(u.id))

  return {
    group,
    events: groupEvents,
    transactions: groupTransactions,
    members: groupMembers
  }
}
