import { User, Group, Event, Transaction } from '../src/types'

// All users in the system
export const allUsers: User[] = [
  { id: 'current-user', name: 'Ari', joinedGroups: ['group-1'] },
  { id: 'user-2', name: 'Alex Chen', joinedGroups: ['group-1'] },
  { id: 'user-3', name: 'Maya Patel', joinedGroups: ['group-1'] },
  { id: 'user-4', name: 'Jordan Lee', joinedGroups: ['group-1'] },
  { id: 'user-5', name: 'Taylor Swift', joinedGroups: ['group-1'] },
  { id: 'user-6', name: 'Sam Rodriguez', joinedGroups: ['group-1'] },
]

// All groups
export const allGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Basketball Crew',
    members: ['current-user', 'user-2', 'user-3', 'user-4', 'user-5', 'user-6'],
    createdAt: '2025-11-15T00:00:00Z'
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
