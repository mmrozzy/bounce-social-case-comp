import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, Modal, Alert, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as Notifications from 'expo-notifications';

interface Activity {
  id: string;
  eventName: string;
  amount?: string;
  totalAmount?: string;
  deadline: string;
  type: 'event' | 'split';
  attendees?: number;
  participants?: number;
  isOwn: boolean;
}

interface SendNotificationProps {
  visible: boolean;
  onClose: () => void;
  activities: Activity[];
  totalMembers: number;
  groupName: string;
}

const SendNotification = ({ 
  visible, 
  onClose, 
  activities, 
  totalMembers,
  groupName 
}: SendNotificationProps) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  // Filter to only show user's own events/splits
  const userActivities = activities.filter(a => a.isOwn);

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowMessageInput(true);
  };

  const handleSendNotification = async () => {
    if (!selectedActivity || !customMessage.trim()) return;

    try {
      // Send local notification (for demo)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${selectedActivity.eventName}`,
          body: customMessage.trim(),
          sound: true,
          data: {
            activityId: selectedActivity.id,
            activityName: selectedActivity.eventName,
            groupName: groupName,
            type: selectedActivity.type,
          },
        },
        trigger: null, // Send immediately
      });

      // Show success message
      Alert.alert(
        'Reminder Sent! 📨',
        `"${customMessage.trim()}" notification sent!\n`,
        [
          { 
            text: 'OK',
            onPress: handleClose
          }
        ]
      );
      
    } catch (error) {
      console.error('Notification error:', error);
      Alert.alert('Error', 'Failed to send notification. Make sure you granted notification permissions.');
    }
  };

  const handleClose = () => {
    setShowMessageInput(false);
    setSelectedActivity(null);
    setCustomMessage('');
    onClose();
  };

  const handleBackToEventList = () => {
    Keyboard.dismiss();
    setShowMessageInput(false);
    setSelectedActivity(null);
    setCustomMessage('');
  };

  const suggestionChips = [
    'NEED THE MONEY HONEYYY 💸',
    'Pay up buttercup! 🌼',
    'Time to settle up! ⏰',
    'Show me the money! 💵',
    'Don\'t ghost us! Pay your share 👻',
    'Cha-ching! Time to pay 🤑'
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      {!showMessageInput ? (
        // Step 1: Select Event/Split
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Payment Reminder</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Select an event to remind members about:
            </Text>
            
            <FlatList
              data={userActivities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const isEvent = item.type === 'event';
                const unpaidCount = isEvent 
                  ? totalMembers - (item.attendees || 0)
                  : totalMembers - (item.participants || 0);
                
                return (
                  <TouchableOpacity
                    style={styles.activityItem}
                    onPress={() => handleSelectActivity(item)}
                  >
                    <View style={styles.activityInfo}>
                      <View style={styles.activityHeader}>
                        <Text style={styles.activityName}>{item.eventName}</Text>
                        <View style={[
                          styles.typeBadge,
                          item.type === 'split' && styles.splitBadge
                        ]}>
                          <Text style={styles.typeText}>
                            {item.type === 'event' ? 'Event' : 'Split'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.activityDetails}>
                        ${item.type === 'event' ? item.amount : item.totalAmount} • {item.deadline}
                      </Text>
                      {unpaidCount > 0 && (
                        <Text style={styles.unpaidCount}>
                          {unpaidCount} unpaid member{unpaidCount > 1 ? 's' : ''}
                        </Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#C3F73A" />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Ionicons name="calendar-outline" size={48} color="#666" />
                  <Text style={styles.emptyText}>
                    You haven't created any events or splits yet
                  </Text>
                  <Text style={styles.emptySubtext}>
                    Create one to send payment reminders
                  </Text>
                </View>
              }
              style={styles.activityList}
            />
          </View>
        </View>
      ) : (
        // Step 2: Write Message
        <View style={styles.messageModalOverlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                <View style={styles.messageModalContent}>
                  <View style={styles.messageHeader}>
                    <TouchableOpacity onPress={handleBackToEventList}>
                      <Ionicons name="arrow-back" size={24} color="#C3F73A" />
                    </TouchableOpacity>
                    <Text style={styles.messageTitle}>Custom Message</Text>
                    <View style={{ width: 24 }} />
                  </View>

                  <ScrollView 
                    style={styles.messageScrollView}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                  >
                    <View style={styles.eventInfoBanner}>
                      <Text style={styles.eventInfoLabel}>Sending reminder for:</Text>
                      <Text style={styles.eventInfoName}>{selectedActivity?.eventName}</Text>
                      <Text style={styles.eventInfoGroup}>in {groupName}</Text>
                    </View>

                    <Text style={styles.messageLabel}>Write your reminder message:</Text>
                    
                    <View style={styles.suggestionChips}>
                      {suggestionChips.map((suggestion, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.suggestionChip}
                          onPress={() => {
                            setCustomMessage(suggestion);
                            Keyboard.dismiss();
                          }}
                        >
                          <Text style={styles.suggestionChipText}>{suggestion}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TextInput
                      style={styles.messageInput}
                      placeholder="e.g., Hey! Don't forget to pay for Friday's game 🏀"
                      placeholderTextColor="#666"
                      value={customMessage}
                      onChangeText={setCustomMessage}
                      multiline
                      maxLength={150}
                      returnKeyType="done"
                      blurOnSubmit={true}
                    />
                    
                    <Text style={styles.charCount}>{customMessage.length}/150</Text>

                    <TouchableOpacity
                      style={[
                        styles.sendButton,
                        !customMessage.trim() && styles.sendButtonDisabled
                      ]}
                      onPress={() => {
                        Keyboard.dismiss();
                        if (customMessage.trim()) {
                          handleSendNotification();
                        }
                      }}
                      disabled={!customMessage.trim()}
                    >
                      <Ionicons name="send" size={20} color="#000" />
                      <Text style={styles.sendButtonText}>Send Reminder</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Event Selection Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#999',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
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
  activityInfo: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  typeBadge: {
    backgroundColor: 'rgba(195, 247, 58, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  splitBadge: {
    backgroundColor: 'rgba(79, 195, 247, 0.2)',
  },
  typeText: {
    color: '#C3F73A',
    fontSize: 11,
    fontWeight: '600',
  },
  activityDetails: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  unpaidCount: {
    color: '#FF6B6B',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 40,
    marginTop: 10,
  },
  emptySubtext: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },

  // Message Input Modal Styles
  messageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
  },
  messageModalContent: {
    backgroundColor: '#111',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  messageScrollView: {
    maxHeight: 500,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  eventInfoBanner: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C3F73A',
  },
  eventInfoLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  eventInfoName: {
    color: '#C3F73A',
    fontSize: 16,
    fontWeight: '600',
  },
  eventInfoGroup: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
  messageLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  suggestionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  suggestionChipText: {
    color: '#C3F73A',
    fontSize: 13,
  },
  messageInput: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginHorizontal: 20,
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
    marginHorizontal: 20,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: '#C3F73A',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#C3F73A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#333',
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SendNotification;