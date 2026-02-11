import { User, Group, Event, Transaction } from '../src/types'

// Sample users
export const sampleUsers: User[] = [
  { id: 'user-1', name: 'Alice', joinedGroups: ['group-1', 'group-2'] },
  { id: 'user-2', name: 'Bob', joinedGroups: ['group-1'] },
  { id: 'user-3', name: 'Charlie', joinedGroups: ['group-1', 'group-2'] },
  { id: 'user-4', name: 'Diana', joinedGroups: ['group-2'] },
  { id: 'user-5', name: 'Eve', joinedGroups: ['group-1', 'group-2'] }
]

// Sample groups
export const sampleGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Weekend Warriors',
    members: ['user-1', 'user-2', 'user-3', 'user-5'],
    createdAt: '2025-12-01T00:00:00Z'
  },
  {
    id: 'group-2',
    name: 'Foodie Friends',
    members: ['user-1', 'user-3', 'user-4', 'user-5'],
    createdAt: '2025-12-15T00:00:00Z'
  }
]

// Sample events
export const sampleEvents: Event[] = [
  {
    id: 'event-1',
    groupId: 'group-1',
    name: 'Karaoke Night',
    date: '2026-01-05T21:00:00Z',
    createdBy: 'user-1',
    participants: ['user-1', 'user-2', 'user-3', 'user-5']
  },
  {
    id: 'event-2',
    groupId: 'group-2',
    name: 'Sushi Dinner',
    date: '2026-01-10T19:00:00Z',
    createdBy: 'user-3',
    participants: ['user-1', 'user-3', 'user-4']
  },
  {
    id: 'event-3',
    groupId: 'group-1',
    name: 'Movie Night',
    date: '2026-01-15T20:00:00Z',
    createdBy: 'user-1',
    participants: ['user-1', 'user-2', 'user-5']
  },
  {
    id: 'event-4',
    groupId: 'group-2',
    name: 'Wine Tasting',
    date: '2026-01-20T18:00:00Z',
    createdBy: 'user-4',
    participants: ['user-1', 'user-3', 'user-4', 'user-5']
  },
  {
    id: 'event-5',
    groupId: 'group-1',
    name: 'Bowling',
    date: '2026-01-25T19:30:00Z',
    createdBy: 'user-1',
    participants: ['user-1', 'user-2', 'user-3']
  },
  {
    id: 'event-6',
    groupId: 'group-2',
    name: 'Brunch',
    date: '2026-02-01T11:00:00Z',
    createdBy: 'user-3',
    participants: ['user-1', 'user-3']
  },
  {
    id: 'event-7',
    groupId: 'group-1',
    name: 'Concert',
    date: '2026-02-05T22:00:00Z',
    createdBy: 'user-2',
    participants: ['user-1', 'user-2', 'user-3', 'user-5']
  }
]

// Sample transactions
export const sampleTransactions: Transaction[] = [
  // Event 1 - Karaoke Night
  {
    id: 'tx-1',
    eventId: 'event-1',
    groupId: 'group-1',
    type: 'split',
    from: 'user-1',
    totalAmount: 120.00,
    participants: ['user-1', 'user-2', 'user-3', 'user-5'],
    splits: [
      { userId: 'user-1', paid: 120, owes: 0, net: 90 },
      { userId: 'user-2', paid: 0, owes: 30, net: -30 },
      { userId: 'user-3', paid: 0, owes: 30, net: -30 },
      { userId: 'user-5', paid: 0, owes: 30, net: -30 }
    ],
    createdAt: '2026-01-05T23:00:00Z'
  },
  {
    id: 'tx-2',
    eventId: 'event-1',
    groupId: 'group-1',
    type: 'p2p',
    from: 'user-3',
    to: 'user-1',
    totalAmount: 30.00,
    note: 'Karaoke split',
    createdAt: '2026-01-06T10:00:00Z'
  },
  
  // Event 2 - Sushi Dinner
  {
    id: 'tx-3',
    eventId: 'event-2',
    groupId: 'group-2',
    type: 'split',
    from: 'user-3',
    totalAmount: 180.00,
    participants: ['user-1', 'user-3', 'user-4'],
    splits: [
      { userId: 'user-1', paid: 0, owes: 60, net: -60 },
      { userId: 'user-3', paid: 180, owes: 0, net: 120 },
      { userId: 'user-4', paid: 0, owes: 60, net: -60 }
    ],
    createdAt: '2026-01-10T21:00:00Z'
  },
  {
    id: 'tx-4',
    eventId: 'event-2',
    groupId: 'group-2',
    type: 'p2p',
    from: 'user-1',
    to: 'user-3',
    totalAmount: 60.00,
    note: 'Sushi dinner',
    createdAt: '2026-01-11T09:00:00Z'
  },
  
  // Event 3 - Movie Night
  {
    id: 'tx-5',
    eventId: 'event-3',
    groupId: 'group-1',
    type: 'split',
    from: 'user-1',
    totalAmount: 45.00,
    participants: ['user-1', 'user-2', 'user-5'],
    splits: [
      { userId: 'user-1', paid: 45, owes: 0, net: 30 },
      { userId: 'user-2', paid: 0, owes: 15, net: -15 },
      { userId: 'user-5', paid: 0, owes: 15, net: -15 }
    ],
    createdAt: '2026-01-15T22:30:00Z'
  },
  
  // Event 4 - Wine Tasting
  {
    id: 'tx-6',
    eventId: 'event-4',
    groupId: 'group-2',
    type: 'event',
    from: 'user-4',
    amount: 200.00,
    totalAmount: 200.00,
    participants: ['user-1', 'user-3', 'user-4', 'user-5'],
    createdAt: '2026-01-20T20:00:00Z'
  },
  
  // Event 5 - Bowling
  {
    id: 'tx-7',
    eventId: 'event-5',
    groupId: 'group-1',
    type: 'split',
    from: 'user-1',
    totalAmount: 60.00,
    participants: ['user-1', 'user-2', 'user-3'],
    splits: [
      { userId: 'user-1', paid: 60, owes: 0, net: 40 },
      { userId: 'user-2', paid: 0, owes: 20, net: -20 },
      { userId: 'user-3', paid: 0, owes: 20, net: -20 }
    ],
    createdAt: '2026-01-25T22:00:00Z'
  },
  {
    id: 'tx-8',
    eventId: 'event-5',
    groupId: 'group-1',
    type: 'p2p',
    from: 'user-1',
    to: 'user-2',
    totalAmount: 10.00,
    note: 'Gas money',
    createdAt: '2026-01-26T14:00:00Z'
  },
  
  // Event 6 - Brunch
  {
    id: 'tx-9',
    eventId: 'event-6',
    groupId: 'group-2',
    type: 'split',
    from: 'user-3',
    totalAmount: 85.00,
    participants: ['user-1', 'user-3'],
    splits: [
      { userId: 'user-1', paid: 0, owes: 42.5, net: -42.5 },
      { userId: 'user-3', paid: 85, owes: 0, net: 42.5 }
    ],
    createdAt: '2026-02-01T13:00:00Z'
  },
  {
    id: 'tx-10',
    eventId: 'event-6',
    groupId: 'group-2',
    type: 'p2p',
    from: 'user-1',
    to: 'user-3',
    totalAmount: 42.50,
    note: 'Brunch',
    createdAt: '2026-02-01T14:30:00Z'
  },
  
  // Event 7 - Concert
  {
    id: 'tx-11',
    eventId: 'event-7',
    groupId: 'group-1',
    type: 'event',
    from: 'user-2',
    amount: 320.00,
    totalAmount: 320.00,
    participants: ['user-1', 'user-2', 'user-3', 'user-5'],
    createdAt: '2026-02-06T01:00:00Z'
  }
]
