import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import CreateEvent from './CreateEvent';
import CreateSplit from './CreateSplit';

// Current user identifier (will be replaced with actual auth later)
const CURRENT_USER_ID = 'currentUser';

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

// Sample events
const SAMPLE_EVENTS: Event[] = [
  { 
    id: '1', 
    eventName: 'Friday Basketball Game', 
    amount: '15', 
    creator: 'John', 
    creatorAvatar: 'https://via.placeholder.com/40',
    time: '10:30 AM',
    isOwn: false,
    attendees: 8,
    deadline: 'Feb 10, 6:00 PM',
    type: 'event'
  },
  { 
    id: '2', 
    eventName: 'Weekend Tournament', 
    amount: '25', 
    creator: 'You', 
    creatorAvatar: 'https://via.placeholder.com/40',
    time: '11:15 AM',
    isOwn: true,
    attendees: 12,
    deadline: 'Feb 14, 5:00 PM',
    type: 'event'
  },
  { 
    id: '3', 
    eventName: 'Sunday Practice Session', 
    amount: '10', 
    creator: 'Sarah', 
    creatorAvatar: 'https://via.placeholder.com/40',
    time: '2:20 PM',
    isOwn: false,
    attendees: 5,
    deadline: 'Feb 15, 12:00 PM',
    type: 'event'
  },
];

const SAMPLE_SPLITS: Split[] = [
  {
    id: '4',
    eventName: 'Court Rental',
    totalAmount: '100',
    creator: 'Mike',
    creatorAvatar: 'https://via.placeholder.com/40',
    time: '1:45 PM',
    isOwn: false,
    participants: 4,
    deadline: 'Feb 12, 8:00 PM',
    type: 'split'
  },
];

export default function GroupProfile({ group, onBack, initialActivityId }: GroupProfileProps) {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showCreateSplit, setShowCreateSplit] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([...SAMPLE_EVENTS, ...SAMPLE_SPLITS]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [joinedActivities, setJoinedActivities] = useState<Set<string>>(new Set(['2'])); // '2' is the user's own event
  
  const isGroupCreator = group.createdBy === CURRENT_USER_ID;

  // Auto-open activity modal if initialActivityId is provided
  useEffect(() => {
    if (initialActivityId) {
      const activity = activities.find(a => a.id === initialActivityId);
      if (activity) {
        setSelectedActivity(activity);
      }
    }
  }, [initialActivityId]);

  const handleCreateEvent = (eventName: string, amount: string, deadline: string) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      eventName,
      amount,
      creator: 'You',
      creatorAvatar: 'https://via.placeholder.com/40',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
      attendees: 1,
      deadline,
      type: 'event',
    };
    setActivities([...activities, newEvent]);
    setJoinedActivities(new Set([...joinedActivities, newEvent.id]));
  };

  const handleCreateSplit = (eventName: string, totalAmount: string, deadline: string) => {
    const newSplit: Split = {
      id: Date.now().toString(),
      eventName,
      totalAmount,
      creator: 'You',
      creatorAvatar: 'https://via.placeholder.com/40',
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      isOwn: true,
      participants: 1,
      deadline,
      type: 'split',
    };
    setActivities([...activities, newSplit]);
    setJoinedActivities(new Set([...joinedActivities, newSplit.id]));
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
          <Text style={styles.memberCount}>{group.members} members</Text>
        </View>

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
            <Ionicons name="add-circle" size={20} color="#000" />
            <Text style={styles.splitButtonText}>Create Split</Text>
          </TouchableOpacity>
        </View>

        {/* Activities */}
        <View style={styles.chatSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {[...activities].reverse().map((activity) => {
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
});
