import { supabase } from './supabase'
import { User, Group, Event, Transaction } from '../src/types'

// Users
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*, group_members(group_id)')
  
  if (error) throw error
  if (!data) return []
  
  return data.map(user => ({
    id: user.id,
    name: user.name,
    joinedGroups: user.group_members?.map((gm: any) => gm.group_id) || []
  })) as User[]
}

export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*, group_members(group_id)')
    .eq('id', userId)
    .single()
  
  if (error) {
    // If user doesn't exist, create them
    if (error.code === 'PGRST116') {
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ id: userId, name: 'User' })
        .select('*, group_members(group_id)')
        .single()
      
      if (createError) throw createError
      if (!newUser) throw new Error('Failed to create user')
      
      return {
        id: newUser.id,
        name: newUser.name,
        joinedGroups: []
      } as User
    }
    throw error
  }
  if (!data) throw new Error('User not found')
  
  return {
    id: data.id,
    name: data.name,
    joinedGroups: data.group_members?.map((gm: any) => gm.group_id) || []
  } as User
}

export async function createUser(name: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({ name })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Groups
export async function getGroups() {
  const { data, error } = await supabase
    .from('groups')
    .select('*, group_members(user_id)')
  
  if (error) throw error
  if (!data) return []
  
  return data.map(group => ({
    id: group.id,
    name: group.name,
    members: group.group_members?.map((gm: any) => gm.user_id) || [],
    createdAt: group.created_at
  })) as Group[]
}

export async function getGroupById(groupId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*, group_members(user_id)')
    .eq('id', groupId)
    .single()
  
  if (error) throw error
  if (!data) throw new Error('Group not found')
  
  return {
    id: data.id,
    name: data.name,
    members: data.group_members?.map((gm: any) => gm.user_id) || [],
    createdAt: data.created_at
  } as Group
}

export async function createGroup(name: string, memberIds: string[]) {
  // Generate a unique ID
  const groupId = `group-${Date.now()}`
  
  const { data: group, error: groupError } = await supabase
    .from('groups')
    .insert({ id: groupId, name })
    .select()
    .single()
  
  if (groupError) throw groupError
  
  // Add members
  const { error: membersError } = await supabase
    .from('group_members')
    .insert(memberIds.map(userId => ({ group_id: group.id, user_id: userId })))
  
  if (membersError) throw membersError
  
  return group
}

export async function deleteGroup(groupId: string) {
  // Delete in reverse order of foreign key dependencies
  // 1. Delete event participants for events in this group
  const { data: groupEvents } = await supabase
    .from('events')
    .select('id')
    .eq('group_id', groupId)
  
  if (groupEvents && groupEvents.length > 0) {
    const eventIds = groupEvents.map(e => e.id)
    await supabase
      .from('event_participants')
      .delete()
      .in('event_id', eventIds)
  }
  
  // 2. Delete transactions
  await supabase
    .from('transactions')
    .delete()
    .eq('group_id', groupId)
  
  // 3. Delete events
  await supabase
    .from('events')
    .delete()
    .eq('group_id', groupId)
  
  // 4. Delete group members
  await supabase
    .from('group_members')
    .delete()
    .eq('group_id', groupId)
  
  // 5. Delete the group itself
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId)
  
  if (error) throw error
}

// Events
export async function getEvents(groupId?: string) {
  let query = supabase
    .from('events')
    .select('*, event_participants(user_id)')
  
  if (groupId) {
    query = query.eq('group_id', groupId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  if (!data) return []
  
  return data.map(event => ({
    id: event.id,
    groupId: event.group_id,
    name: event.name,
    date: event.date,
    createdBy: event.created_by,
    participants: event.event_participants?.map((ep: any) => ep.user_id) || []
  })) as Event[]
}

export async function createEvent(
  groupId: string,
  name: string,
  date: string,
  createdBy: string,
  participantIds: string[]
) {
  // Generate a unique ID
  const eventId = `event-${Date.now()}`
  
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({ id: eventId, group_id: groupId, name, date, created_by: createdBy })
    .select()
    .single()
  
  if (eventError) throw eventError
  
  // Add participants
  const { error: participantsError } = await supabase
    .from('event_participants')
    .insert(participantIds.map(userId => ({ event_id: event.id, user_id: userId })))
  
  if (participantsError) throw participantsError
  
  return event
}

// Transactions
export async function getTransactions(groupId?: string, eventId?: string) {
  let query = supabase.from('transactions').select('*')
  
  if (groupId) {
    query = query.eq('group_id', groupId)
  }
  if (eventId) {
    query = query.eq('event_id', eventId)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  if (!data) return []
  
  // Map database columns to TypeScript interface
  return data.map(tx => ({
    id: tx.id,
    eventId: tx.event_id,
    groupId: tx.group_id,
    type: tx.type,
    from: tx.from_user,
    to: tx.to_user,
    amount: tx.amount,
    totalAmount: tx.total_amount,
    note: tx.note,
    splits: tx.splits,
    participants: tx.participants,
    createdAt: tx.created_at
  })) as any[]
}

export async function createTransaction(transaction: Partial<Transaction>) {
  // Generate a unique ID
  const txId = `tx-${Date.now()}`
  
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      id: txId,
      event_id: transaction.eventId,
      group_id: transaction.groupId,
      type: transaction.type,
      from_user: transaction.from,
      to_user: transaction.type === 'p2p' ? (transaction as any).to : null,
      amount: transaction.type === 'event' ? (transaction as any).amount : null,
      total_amount: transaction.totalAmount,
      note: transaction.type === 'p2p' ? (transaction as any).note : null,
      splits: transaction.type === 'split' ? (transaction as any).splits : null,
      participants: (transaction as any).participants || []
    })
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Helper function to get group-specific data (like getGroupData from mockData)
export async function getGroupData(groupId: string) {
  try {
    const group = await getGroupById(groupId)
    const events = await getEvents(groupId)
    const transactions = await getTransactions(groupId)
    const members = await Promise.all(
      group.members.map(userId => getUserById(userId))
    )

    return {
      group,
      events,
      transactions,
      members
    }
  } catch (error) {
    console.error('Error fetching group data:', error)
    return null
  }
}
