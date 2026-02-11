import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import CreateEvent from './CreateEvent';
import CreateSplit from './CreateSplit';
import { analyzeGroupPersona } from '@/src/types/groupPersonaAnalyzer';
import { getGroupData, createEvent, createTransaction } from '@/lib/database';

// Current user identifier (will be replaced with actual auth later)
const CURRENT_USER_ID = 'current-user';

interface GroupProfileProps {
  group: {
    id: string;
    name: string;
    members: number;
    image: string;
    banner?: string;
    createdBy: string;
  };
  onBack: () => void;
  initialActivityId?: string;
}

interface Event {
  id: string;
  eventName: string;
  amount: string;
  creator: string;
  creatorAvatar: string;
  time: string;
  isOwn: boolean;
  attendees: number;
  deadline: string;
  type: 'event';
}

interface Split {
  id: string;
  eventName: string;
  totalAmount: string;
  creator: string;
  creatorAvatar: string;
  time: string;
  isOwn: boolean;
  participants: number;
  deadline: string;
  type: 'split';
}

type Activity = Event | Split;

interface Member {
  id: string;
  name: string;
  avatar: string;
  role: 'host' | 'member';
}

// Sample members
const SAMPLE_MEMBERS: Member[] = [
  { id: 'current-user', name: 'You', avatar: 'https://via.placeholder.com/50', role: 'host' },
  { id: 'user-2', name: 'Alex Chen', avatar: 'https://via.placeholder.com/50', role: 'member' },
  { id: 'user-3', name: 'Maya Patel', avatar: 'https://via.placeholder.com/50', role: 'member' },
  { id: 'user-4', name: 'Jordan Lee', avatar: 'https://via.placeholder.com/50', role: 'member' },
  { id: 'user-5', name: 'Taylor Swift', avatar: 'https://via.placeholder.com/50', role: 'member' },
  { id: 'user-6', name: 'Sam Rodriguez', avatar: 'https://via.placeholder.com/50', role: 'member' },
];

// Function to convert real events and transactions to activities format
const convertEventsToActivities = (events: any[], transactions: any[]): Activity[] => {
  const activities: Array<Activity & { dateObj: Date }> = [];
  
  // Convert events to activities
  events.forEach(event => {
    const eventTransactions = transactions.filter(t => t.eventId === event.id);
    const isOwn = event.createdBy === 'current-user';
    const amount = eventTransactions.length > 0 ? eventTransactions[0].totalAmount?.toString() || '0' : '0';
    const creatorName = event.createdBy === 'current-user' ? 'You' : SAMPLE_MEMBERS.find(m => m.id === event.createdBy)?.name || 'Unknown';
    const eventDate = new Date(event.date);
    
    activities.push({
      id: event.id,
      eventName: event.name,
      amount: amount,
      creator: creatorName,
      creatorAvatar: 'https://via.placeholder.com/40',
      time: eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: isOwn,
      attendees: event.participants.length,
      deadline: eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      type: 'event',
      dateObj: eventDate,
    });
  });
  
  // Convert split transactions to split activities
  transactions.filter(t => t.type === 'split' && !events.find(e => e.id === t.eventId)).forEach(transaction => {
    const isOwn = transaction.from === 'current-user';
    const creatorName = transaction.from === 'current-user' ? 'You' : SAMPLE_MEMBERS.find(m => m.id === transaction.from)?.name || 'Unknown';
    const splitDate = new Date(transaction.createdAt);
    
    activities.push({
      id: transaction.id,
      eventName: transaction.note || 'Split Payment',
      totalAmount: transaction.totalAmount.toString(),
      creator: creatorName,
      creatorAvatar: 'https://via.placeholder.com/40',
      time: splitDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: isOwn,
      participants: transaction.participants?.length || 0,
      deadline: splitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      type: 'split',
      dateObj: splitDate,
    });
  });
  
  // Sort by actual date (most recent first) and remove dateObj
  return activities
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime())
    .map(({ dateObj, ...activity }) => activity as Activity);
};

export default function GroupProfile({ group, onBack, initialActivityId }: GroupProfileProps) {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateSplit, setShowCreateSplit] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [members] = useState<Member[]>(SAMPLE_MEMBERS);
  const [showPersonaDetails, setShowPersonaDetails] = useState(false);
  
  const isGroupCreator = group.createdBy === CURRENT_USER_ID;

  // State for group data
  const [groupData, setGroupData] = useState<any>(null);
  const [groupPersona, setGroupPersona] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [joinedActivities, setJoinedActivities] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch group data from Supabase
  useEffect(() => {
    async function loadGroupData() {
      setLoading(true);
      try {
        const data = await getGroupData(group.id);
        if (data) {
          setGroupData(data);
          const persona = analyzeGroupPersona(
            group.id,
            data.members,
            data.transactions,
            data.events,
            [data.group]
          );
          setGroupPersona(persona);
          
          const acts = convertEventsToActivities(data.events, data.transactions);
          setActivities(acts);
          setJoinedActivities(new Set(acts.filter(a => a.isOwn).map(a => a.id)));
        }
      } catch (error) {
        console.error('Error loading group data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadGroupData();
  }, [group.id]);
  
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-open activity modal if initialActivityId is provided
  useEffect(() => {
    if (initialActivityId) {
      const activity = activities.find(a => a.id === initialActivityId);
      if (activity) {
        setSelectedActivity(activity);
      }
    }
  }, [initialActivityId]);

  const handleCreateEvent = async (eventName: string, amount: string, deadline: string) => {
    try {
      // For now, use current time + 1 day as event date (TODO: implement proper date picker)
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + 1);
      
      // Save to database
      await createEvent(
        group.id,
        eventName,
        eventDate.toISOString(), // Use ISO format for database
        CURRENT_USER_ID,
        [CURRENT_USER_ID] // Creator is the first participant
      );

      // Create transaction for the event
      await createTransaction({
        eventId: null, // Will be set after event is created
        groupId: group.id,
        type: 'event',
        from: CURRENT_USER_ID,
        totalAmount: parseFloat(amount),
        participants: [CURRENT_USER_ID],
      } as any);

      // Reload group data to show the new event
      const data = await getGroupData(group.id);
      if (data) {
        const acts = convertEventsToActivities(data.events, data.transactions);
        setActivities(acts);
        setJoinedActivities(new Set(acts.filter(a => a.isOwn).map(a => a.id)));
      }
      setShowCreateEvent(false);
    } catch (error) {
      console.error('Error creating event:', error);
      // TODO: Show error message to user
    }
  };

  const handleCreateSplit = async (eventName: string, totalAmount: string, deadline: string) => {
    try {
      // Save split as a transaction to database
      await createTransaction({
        eventId: null,
        groupId: group.id,
        type: 'split',
        from: CURRENT_USER_ID,
        totalAmount: parseFloat(totalAmount),
        note: eventName, // Save the split name in the note field
        participants: [CURRENT_USER_ID],
        splits: [{
          userId: CURRENT_USER_ID,
          paid: parseFloat(totalAmount),
          owes: 0,
          net: parseFloat(totalAmount)
        }],
      } as any);

      // Reload group data to show the new split
      const data = await getGroupData(group.id);
      if (data) {
        const acts = convertEventsToActivities(data.events, data.transactions);
        setActivities(acts);
        setJoinedActivities(new Set(acts.filter(a => a.isOwn).map(a => a.id)));
      }
      setShowCreateSplit(false);
    } catch (error) {
      console.error('Error creating split:', error);
      // TODO: Show error message to user
    }
  };

  const handleToggleJoinActivity = (activityId: string) => {
    if (joinedActivities.has(activityId)) {
      // Leave the activity
      setActivities(activities.map(activity => {
        if (activity.id === activityId) {
          if (activity.type === 'event') {
            return { ...activity, attendees: activity.attendees - 1 };
          } else {
            return { ...activity, participants: activity.participants - 1 };
          }
        }
        return activity;
      }));
      const newJoined = new Set(joinedActivities);
      newJoined.delete(activityId);
      setJoinedActivities(newJoined);
    } else {
      // Join the activity
      setActivities(activities.map(activity => {
        if (activity.id === activityId) {
          if (activity.type === 'event') {
            return { ...activity, attendees: activity.attendees + 1 };
          } else {
            return { ...activity, participants: activity.participants + 1 };
          }
        }
        return activity;
      }));
      setJoinedActivities(new Set([...joinedActivities, activityId]));
    }
  };

  if (showCreateEvent) {
    return (
      <CreateEvent 
        onBack={() => setShowCreateEvent(false)} 
        onCreateEvent={handleCreateEvent}
      />
    );
  }

  if (showCreateSplit) {
    return (
      <CreateSplit 
        onBack={() => setShowCreateSplit(false)} 
        onCreateSplit={handleCreateSplit}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading group data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header with Back Button and Bell */}
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={onBack}
          >
            <Ionicons name="arrow-back" size={24} color="#C3F73A" />
            <Text style={styles.backText}>Groups</Text>
          </TouchableOpacity>
          
          {isGroupCreator && (
            <TouchableOpacity 
              style={styles.bellButton}
              onPress={() => setShowNotificationModal(true)}
            >
              <Ionicons name="notifications" size={24} color="#C3F73A" />
            </TouchableOpacity>
          )}
        </View>

        {/* Banner */}
        {group.banner ? (
          <Image source={{ uri: group.banner }} style={styles.banner} />
        ) : (
          <View style={styles.banner} />
        )}
        
        {/* Group Picture */}
        <View style={styles.profilePicContainer}>
          <View style={styles.profilePic}>
            <Image 
              source={{ uri: group.image }}
              style={styles.profileImage}
            />
          </View>
        </View>
        
        {/* Group Title & Members */}
        <View style={styles.headerInfo}>
          <Text style={styles.groupTitle}>{group.name}</Text>
          <TouchableOpacity onPress={() => setShowMembersModal(true)}>
            <Text style={styles.memberCount}>{group.members} members</Text>
          </TouchableOpacity>
        </View>

        {/* Group Persona Section */}
        {groupPersona && groupPersona.groupStats.totalEvents > 0 ? (
          <TouchableOpacity 
            style={styles.groupPersonaSection}
            onPress={() => setShowPersonaDetails(!showPersonaDetails)}
            activeOpacity={0.8}
          >
            <View style={styles.personaHeader}>
              <Text style={styles.personaBadgeEmoji}>{groupPersona.dominantPersona.emoji}</Text>
              <View style={styles.personaInfo}>
                <Text style={styles.personaType}>
                  {groupPersona.dominantPersona.type.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={styles.personaDescription}>
                  {groupPersona.dominantPersona.description}
                </Text>
              </View>
              <Ionicons 
                name={showPersonaDetails ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#C3F73A" 
              />
            </View>

            {showPersonaDetails && (
              <View style={styles.personaDetails}>
                {/* Group Traits */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>✨ Group Vibe</Text>
                  {groupPersona.groupTraits.map((trait: string, index: number) => (
                    <Text key={index} style={styles.traitText}>• {trait}</Text>
                  ))}
                </View>

                {/* Persona Distribution */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>👥 Member Personas</Text>
                  {groupPersona.personaDistribution.map((dist: any, index: number) => (
                    <View key={index} style={styles.statRow}>
                      <Text style={styles.statLabel}>
                        {dist.emoji} {dist.personaKey.replace(/([A-Z])/g, ' $1').trim()}
                      </Text>
                      <Text style={styles.statValue}>
                        {dist.count} ({dist.percentage}%)
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Group Stats */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>📊 Group Stats</Text>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Events</Text>
                    <Text style={styles.statValue}>{groupPersona.groupStats.totalEvents}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Total Spent</Text>
                    <Text style={styles.statValue}>${groupPersona.groupStats.totalSpent.toFixed(2)}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Avg Event Cost</Text>
                    <Text style={styles.statValue}>${groupPersona.groupStats.avgEventCost.toFixed(2)}</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Group Generosity</Text>
                    <Text style={styles.statValue}>{(groupPersona.groupStats.groupGenerosity * 100).toFixed(0)}%</Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Most Active Time</Text>
                    <Text style={styles.statValue}>{groupPersona.groupStats.mostActiveTime}:00</Text>
                  </View>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.groupPersonaSectionEmpty}
            onPress={() => setShowPersonaDetails(!showPersonaDetails)}
            activeOpacity={0.8}
          >
            <View style={styles.personaHeader}>
              <Text style={styles.personaBadgeEmoji}>🚀</Text>
              <View style={styles.personaInfo}>
                <Text style={styles.personaTypeEmpty}>
                  Get ready to start your spending adventure!
                </Text>
                <Text style={styles.personaDescriptionEmpty}>
                  Tap to learn about group personas
                </Text>
              </View>
              <Ionicons 
                name={showPersonaDetails ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#666" 
              />
            </View>

            {showPersonaDetails && (
              <View style={styles.personaDetails}>
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>🎭 What are Group Personas?</Text>
                  <Text style={styles.emptyExplanationText}>
                    As your group creates events and splits expenses, we'll analyze your collective behavior to discover your group's unique personality!
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>📊 What We Track</Text>
                  <Text style={styles.traitText}>• Event frequency and timing</Text>
                  <Text style={styles.traitText}>• Spending patterns and budget preferences</Text>
                  <Text style={styles.traitText}>• Group size preferences</Text>
                  <Text style={styles.traitText}>• Payment speed and generosity</Text>
                  <Text style={styles.traitText}>• Activity level and social dynamics</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>✨ Example Personas</Text>
                  <Text style={styles.traitText}>🌟 The Party Crew - High energy, frequent events</Text>
                  <Text style={styles.traitText}>📅 The Organized Squad - Well-planned meetups</Text>
                  <Text style={styles.traitText}>🍜 The Culinary Club - Premium dining experiences</Text>
                  <Text style={styles.traitText}>💸 The Budget Conscious - Smart spenders</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>🚀 Get Started</Text>
                  <Text style={styles.emptyExplanationText}>
                    Create your first event or split to start building your group's personality profile. The more activities you do together, the more accurate your persona becomes!
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Create Event Button Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={styles.createEventButton}
            onPress={() => setShowCreateEvent(true)}
          >
            <Ionicons name="add-circle" size={20} color="#000" />
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.createSplitButton}
            onPress={() => setShowCreateSplit(true)}
          >
            <Ionicons name="pie-chart-outline" size={20} color="#000" />
            <Text style={styles.splitButtonText}>Create Split</Text>
          </TouchableOpacity>
        </View>

        {/* Activities */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.map((activity) => {
            const isEvent = activity.type === 'event';
            const isSplit = activity.type === 'split';
            const countText = isEvent 
              ? `${activity.attendees}/${group.members}` 
              : `${activity.participants}`;
            const percentagePerPerson = isSplit ? (100 / activity.participants).toFixed(1) : null;
            
            return (
              <TouchableOpacity
                key={activity.id}
                onPress={() => setSelectedActivity(activity)}
                style={[
                  styles.eventBubbleContainer,
                  activity.isOwn && styles.eventBubbleContainerOwn
                ]}
              >
                {!activity.isOwn && (
                  <Image source={{ uri: activity.creatorAvatar }} style={styles.eventAvatar} />
                )}
                {activity.isOwn && (
                  <View style={[
                    styles.attendeeCircle,
                    isSplit && styles.attendeeCircleSplit
                  ]}>
                    <Text style={[
                      styles.attendeeCircleText,
                      isSplit && styles.attendeeCircleTextSplit
                    ]}>{countText}</Text>
                  </View>
                )}
                <View style={[
                  styles.eventBubble,
                  activity.isOwn && (isEvent ? styles.eventBubbleOwn : styles.splitBubbleOwn)
                ]}>
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventCreator, activity.isOwn && styles.eventCreatorOwn]}>
                      {activity.creator}
                    </Text>
                    <Text style={styles.eventTime}>{activity.time}</Text>
                  </View>
                  <Text style={styles.eventName}>{activity.eventName}</Text>
                  <View style={styles.eventAmountContainer}>
                    <Ionicons 
                      name="cash-outline" 
                      size={16} 
                      color={isEvent ? "#C3F73A" : "#4FC3F7"} 
                    />
                    <Text style={styles.eventAmount}>
                      {isEvent 
                        ? `$${activity.amount} per person` 
                        : `$${activity.totalAmount} total • ${percentagePerPerson}% each`
                      }
                    </Text>
                  </View>
                  <View style={styles.eventInfoRow}>
                    <View style={styles.eventAttendees}>
                      <Ionicons name="people-outline" size={14} color="#888" />
                      <Text style={styles.eventAttendeesText}>{countText}</Text>
                    </View>
                    <View style={styles.eventDeadline}>
                      <Ionicons name="time-outline" size={14} color="#888" />
                      <Text style={styles.eventDeadlineText}>{activity.deadline}</Text>
                    </View>
                  </View>
                </View>
                {!activity.isOwn && (
                  <View style={[
                    styles.attendeeCircle,
                    isSplit && styles.attendeeCircleSplit
                  ]}>
                    <Text style={[
                      styles.attendeeCircleText,
                      isSplit && styles.attendeeCircleTextSplit
                    ]}>{countText}</Text>
                  </View>
                )}
                {activity.isOwn && (
                  <Image source={{ uri: activity.creatorAvatar }} style={styles.eventAvatar} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Modal
          visible={true}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setSelectedActivity(null)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setSelectedActivity(null)}
          >
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedActivity.eventName}</Text>
                <TouchableOpacity onPress={() => setSelectedActivity(null)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <View style={styles.modalCreatorInfo}>
                  <Image source={{ uri: selectedActivity.creatorAvatar }} style={styles.modalAvatar} />
                  <Text style={styles.modalCreator}>{selectedActivity.creator}</Text>
                  <Text style={styles.modalTime}>{selectedActivity.time}</Text>
                </View>

                {selectedActivity.type === 'event' ? (
                  <>
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="cash" size={24} color="#C3F73A" />
                      <Text style={styles.modalInfoText}>${selectedActivity.amount} per person</Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="people" size={24} color="#C3F73A" />
                      <Text style={styles.modalInfoText}>
                        {selectedActivity.attendees}/{group.members} going
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="time" size={24} color="#C3F73A" />
                      <View style={styles.modalDeadlineInfo}>
                        <Text style={styles.modalInfoText}>{selectedActivity.deadline}</Text>
                        <Text style={styles.modalDeadlineNote}>Payment deadline</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.modalInfoRow}>
                      <Ionicons name="cash" size={24} color="#4FC3F7" />
                      <Text style={styles.modalInfoText}>${selectedActivity.totalAmount} total</Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="calculator" size={24} color="#4FC3F7" />
                      <Text style={styles.modalInfoText}>{(100 / selectedActivity.participants).toFixed(1)}% per person</Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="people" size={24} color="#4FC3F7" />
                      <Text style={styles.modalInfoText}>
                        {selectedActivity.participants} participating
                      </Text>
                    </View>

                    <View style={styles.modalInfoRow}>
                      <Ionicons name="time" size={24} color="#4FC3F7" />
                      <View style={styles.modalDeadlineInfo}>
                        <Text style={styles.modalInfoText}>{selectedActivity.deadline}</Text>
                        <Text style={styles.modalDeadlineNote}>Split deadline</Text>
                      </View>
                    </View>
                  </>
                )}

                {!selectedActivity.isOwn && !joinedActivities.has(selectedActivity.id) && (
                  <TouchableOpacity 
                    style={selectedActivity.type === 'event' ? styles.payJoinButton : styles.joinSplitButton}
                    onPress={() => handleToggleJoinActivity(selectedActivity.id)}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="#000" />
                    <Text style={selectedActivity.type === 'event' ? styles.payJoinButtonText : styles.joinSplitButtonText}>
                      {selectedActivity.type === 'event' ? 'Pay & Join' : 'Join Split'}
                    </Text>
                  </TouchableOpacity>
                )}

                {!selectedActivity.isOwn && joinedActivities.has(selectedActivity.id) && (
                  <TouchableOpacity 
                    style={styles.leaveButton}
                    onPress={() => handleToggleJoinActivity(selectedActivity.id)}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                    <Text style={styles.leaveButtonText}>
                      {selectedActivity.type === 'event' ? 'Leave Event' : 'Leave Split'}
                    </Text>
                  </TouchableOpacity>
                )}

                {selectedActivity.isOwn && (
                  <View style={styles.yourEventBadge}>
                    <Text style={styles.yourEventText}>
                      {selectedActivity.type === 'event' ? 'Your Event' : 'Your Split'}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowNotificationModal(false)}
        >
          <View style={styles.notificationModalOverlay}>
            <View style={styles.notificationModalContent}>
              <View style={styles.notificationModalHeader}>
                <Text style={styles.notificationModalTitle}>Send Notification</Text>
                <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.notificationModalSubtitle}>Select an event to notify members about:</Text>
              
              <FlatList
                data={activities.filter(a => a.type === 'event') as Event[]}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.notificationEventItem}
                    onPress={() => {
                      // TODO: Backend integration - send notification to all group members
                      setShowNotificationModal(false);
                      // For now, just close the modal
                    }}
                  >
                    <View style={styles.notificationEventInfo}>
                      <Text style={styles.notificationEventName}>{item.eventName}</Text>
                      <Text style={styles.notificationEventDetails}>
                        ${item.amount} • {item.deadline}
                      </Text>
                    </View>
                    <Ionicons name="send" size={24} color="#C3F73A" />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.notificationEmptyText}>No events to notify about</Text>
                }
                style={styles.notificationEventList}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Members Modal */}
      {showMembersModal && (
        <Modal
          visible={true}
          transparent={true}
          animationType="slide"
          onRequestClose={() => {
            setShowMembersModal(false);
            setSearchQuery('');
          }}
        >
          <View style={styles.membersModalOverlay}>
            <View style={styles.membersModalContent}>
              <View style={styles.membersModalHeader}>
                <Text style={styles.membersModalTitle}>Group Members</Text>
                <TouchableOpacity onPress={() => {
                  setShowMembersModal(false);
                  setSearchQuery('');
                }}>
                  <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search members..."
                  placeholderTextColor="#666"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              
              {/* Members List */}
              <FlatList
                data={filteredMembers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.memberItem}>
                    <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <View style={[
                        styles.memberRoleBadge,
                        item.role === 'host' && styles.memberRoleBadgeHost
                      ]}>
                        <Text style={[
                          styles.memberRoleText,
                          item.role === 'host' && styles.memberRoleTextHost
                        ]}>
                          {item.role === 'host' ? 'Host' : 'Member'}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={styles.membersEmptyText}>No members found</Text>
                }
                style={styles.membersList}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    gap: 10,
  },
  bellButton: {
    padding: 10,
  },
  backText: {
    color: '#C3F73A',
    fontSize: 16,
  },
  banner: {
    width: '100%',
    height: 90,
    backgroundColor: '#333',
  },
  profilePicContainer: {
    alignItems: 'center',
    marginTop: -40,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#000',
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 15,
  },
  groupTitle: {
    color: '#C3F73A',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  memberCount: {
    color: '#666',
    fontSize: 14,
  },
  groupPersonaSection: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C3F73A',
  },
  groupPersonaSectionEmpty: {
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personaBadgeEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  personaInfo: {
    flex: 1,
  },
  personaType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#C3F73A',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  personaTypeEmpty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  personaDescription: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  personaDescriptionEmpty: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  personaDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  traitText: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 6,
    lineHeight: 18,
  },
  emptyExplanationText: {
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C3F73A',
  },
  actionSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    flexDirection: 'row',
    gap: 10,
  },
  createEventButton: {
    flexDirection: 'row',
    backgroundColor: '#C3F73A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  createSplitButton: {
    flexDirection: 'row',
    backgroundColor: '#4FC3F7',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  splitButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  eventBubbleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  eventBubbleContainerOwn: {
    justifyContent: 'flex-end',
  },
  eventAvatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginHorizontal: 8,
  },
  attendeeCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#C3F73A',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  attendeeCircleSplit: {
    borderColor: '#4FC3F7',
    backgroundColor: '#1a2a3a',
  },
  attendeeCircleText: {
    color: '#C3F73A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  attendeeCircleTextSplit: {
    color: '#4FC3F7',
  },
  eventBubble: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 12,
    maxWidth: '70%',
    borderWidth: 1,
    borderColor: '#333',
  },
  eventBubbleOwn: {
    backgroundColor: '#1a3a1a',
    borderColor: '#C3F73A',
  },
  splitBubbleOwn: {
    backgroundColor: '#1a2a3a',
    borderColor: '#4FC3F7',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventCreator: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  eventCreatorOwn: {
    color: '#C3F73A',
  },
  eventTime: {
    color: '#666',
    fontSize: 11,
    marginLeft: 10,
  },
  eventName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  eventAmount: {
    color: '#C3F73A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  eventAttendeesText: {
    color: '#888',
    fontSize: 12,
  },
  eventDeadline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  eventDeadlineText: {
    color: '#888',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: '#C3F73A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    color: '#C3F73A',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  modalBody: {
    padding: 20,
  },
  modalCreatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  modalAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  modalCreator: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  modalTime: {
    color: '#666',
    fontSize: 13,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  modalInfoText: {
    color: '#fff',
    fontSize: 16,
  },
  modalDeadlineInfo: {
    flex: 1,
  },
  modalDeadlineNote: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  payJoinButton: {
    flexDirection: 'row',
    backgroundColor: '#C3F73A',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  payJoinButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  joinSplitButton: {
    flexDirection: 'row',
    backgroundColor: '#4FC3F7',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
  },
  joinSplitButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaveButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: '#666',
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 20,
    gap: 10,
  },
  joinedText: {
    color: '#C3F73A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  yourEventBadge: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 20,
    backgroundColor: '#1a3a1a',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#C3F73A',
  },
  yourEventText: {
    color: '#C3F73A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  notificationModalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  notificationModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  notificationModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationModalSubtitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  notificationEventList: {
    paddingHorizontal: 20,
  },
  notificationEventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  notificationEventInfo: {
    flex: 1,
  },
  notificationEventName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationEventDetails: {
    color: '#999',
    fontSize: 14,
  },
  notificationEmptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
  membersModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  membersModalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  membersModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  membersModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
  },
  membersList: {
    paddingHorizontal: 20,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 15,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  memberRoleBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  memberRoleBadgeHost: {
    backgroundColor: '#C3F73A',
  },
  memberRoleText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
  },
  memberRoleTextHost: {
    color: '#000',
  },
  membersEmptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#C3F73A',
    fontSize: 16,
  },
});
