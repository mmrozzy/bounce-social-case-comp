/**
 * @fileoverview Database service layer for Supabase interactions.
 * Provides type-safe CRUD operations for users, groups, events, and transactions.
 * Includes image upload functionality to Supabase Storage.
 * 
 * All functions handle error logging and return typed results.
 */

import { supabase } from '../config/supabase';
import { Event, Group, Transaction, User } from '../types';

/**
 * Uploads an image file to Supabase Storage.
 * 
 * @param file - Image file object with uri, type, and name properties
 * @param folder - Target folder: 'profiles', 'banners', or 'groups'
 * @returns Public URL of the uploaded image
 * @throws Error if upload fails
 */
export async function uploadImage(file: { uri: string; type: string; name: string }, folder: 'profiles' | 'banners' | 'groups') {
  try {
    console.log('Starting image upload...', { uri: file.uri, folder });
    
    // Convert URI to ArrayBuffer for React Native compatibility
    const response = await fetch(file.uri);
    console.log('Fetched file, status:', response.status);
    
    const arrayBuffer = await response.arrayBuffer();
    console.log('Converted to ArrayBuffer, size:', arrayBuffer.byteLength);
    
    // Generate unique filename
    const fileExt = file.uri.split('.').pop() || 'jpg';
    const fileName = `${folder}/${Date.now()}.${fileExt}`;
    console.log('Upload filename:', fileName);
    
    // Upload to Supabase Storage using ArrayBuffer
    const { data, error } = await supabase.storage
      .from('images')
      .upload(fileName, arrayBuffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false
      });
    
    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }
    
    console.log('Upload successful:', data);
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);
    
    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

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
    profileImage: data.profile_image,
    bannerImage: data.banner_image,
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

export async function updateUserImages(userId: string, profileImage?: string, bannerImage?: string) {
  const updates: any = {}
  if (profileImage !== undefined) updates.profile_image = profileImage
  if (bannerImage !== undefined) updates.banner_image = bannerImage
  
  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
  
  if (error) throw error
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
    profileImage: group.profile_image,
    bannerImage: group.banner_image,
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
    profileImage: data.profile_image,
    bannerImage: data.banner_image,
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

export async function updateGroupImages(groupId: string, profileImage?: string, bannerImage?: string) {
  const updates: any = {}
  if (profileImage !== undefined) updates.profile_image = profileImage
  if (bannerImage !== undefined) updates.banner_image = bannerImage
  
  const { error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', groupId)
  
  if (error) throw error
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

export async function deleteEvent(eventId: string) {
  // Delete event participants first
  await supabase
    .from('event_participants')
    .delete()
    .eq('event_id', eventId)
  
  // Delete transactions associated with this event
  await supabase
    .from('transactions')
    .delete()
    .eq('event_id', eventId)
  
  // Delete the event itself
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)
  
  if (error) throw error
}

export async function deleteTransaction(transactionId: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
  
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
    deadline: tx.deadline, // Add deadline mapping
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
      note: (transaction as any).note || null, // Save note for all types (splits and p2p)
      deadline: (transaction as any).deadline || null, // Save deadline for splits
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

// Activity Reactions Types
export interface ActivityReaction {
  id: string;
  user_id: string;
  activity_id: string;
  activity_type: 'event' | 'split';
  emoji: string;
  created_at: string;
}

export interface GroupedReaction {
  emoji: string;
  users: string[];
  count: number;
}

/**
 * Get all reactions for display on profile
 */
export async function getActivityReactions(
  userId: string
): Promise<Record<string, GroupedReaction[]>> {
  try {    
    const { data: reactions, error } = await supabase
      .from('activity_reactions')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching reactions:', error);
      throw error;
    }
    
    // Group reactions by activity and emoji
    const grouped: Record<string, GroupedReaction[]> = {};
    
    reactions?.forEach((reaction: ActivityReaction) => {
      if (!grouped[reaction.activity_id]) {
        grouped[reaction.activity_id] = [];
      }
      
      const existing = grouped[reaction.activity_id].find(
        r => r.emoji === reaction.emoji
      );
      
      if (existing) {
        existing.users.push(reaction.user_id);
        existing.count++;
      } else {
        grouped[reaction.activity_id].push({
          emoji: reaction.emoji,
          users: [reaction.user_id],
          count: 1,
        });
      }
    });
    return grouped;
  } catch (error) {
    console.error('Error fetching activity reactions:', error);
    return {};
  }
}

/**
 * Add or remove a reaction to an activity
 * If user already reacted with this emoji, it removes it
 * Otherwise, it adds the reaction
 */
export async function toggleActivityReaction(
  userId: string,
  activityId: string,
  activityType: 'event' | 'split',
  emoji: string
): Promise<boolean> {
  try {
    // Check if reaction already exists
    const { data: existing } = await supabase
      .from('activity_reactions')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .eq('emoji', emoji)
      .single();
    
    if (existing) {
      // Remove reaction
      const { error } = await supabase
        .from('activity_reactions')
        .delete()
        .eq('id', existing.id);
      
      if (error) throw error;
      return false; // Reaction removed
    } else {
      // Add reaction
      const { error } = await supabase
        .from('activity_reactions')
        .insert({
          user_id: userId,
          activity_id: activityId,
          activity_type: activityType,
          emoji: emoji,
          created_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      return true; // Reaction added
    }
  } catch (error) {
    console.error('Error toggling activity reaction:', error);
    throw error;
  }
}

/**
 * Get reaction counts for a specific activity
 */
export async function getActivityReactionCounts(
  activityId: string
): Promise<GroupedReaction[]> {
  try {
    const { data: reactions, error } = await supabase
      .from('activity_reactions')
      .select('*')
      .eq('activity_id', activityId);
    
    if (error) throw error;
    
    // Group by emoji
    const grouped: Record<string, GroupedReaction> = {};
    
    reactions?.forEach((reaction: ActivityReaction) => {
      if (!grouped[reaction.emoji]) {
        grouped[reaction.emoji] = {
          emoji: reaction.emoji,
          users: [],
          count: 0,
        };
      }
      
      grouped[reaction.emoji].users.push(reaction.user_id);
      grouped[reaction.emoji].count++;
    });
    
    return Object.values(grouped);
  } catch (error) {
    console.error('Error fetching reaction counts:', error);
    return [];
  }
}

/**
 * Get users who reacted with a specific emoji
 */
export async function getReactionUsers(
  activityId: string,
  emoji: string
): Promise<any[]> {
  try {
    const { data: reactions, error } = await supabase
      .from('activity_reactions')
      .select(`
        user_id,
        users:user_id (
          id,
          name,
          profile_image
        )
      `)
      .eq('activity_id', activityId)
      .eq('emoji', emoji);
    
    if (error) throw error;
    
    return reactions?.map((r: any) => r.users) || [];
  } catch (error) {
    console.error('Error fetching reaction users:', error);
    return [];
  }
}

/**
 * Remove all reactions for an activity 
 */
export async function deleteActivityReactions(
  activityId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('activity_reactions')
      .delete()
      .eq('activity_id', activityId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting activity reactions:', error);
    throw error;
  }
}