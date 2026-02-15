/**
 * @fileoverview Split bill creation form component.
 * Modal form for creating bill splits with name, total amount, and deadline.
 */

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateSplitProps {
  onBack: () => void;
  onCreateSplit: (eventName: string, totalAmount: string, deadline: Date) => void;
}

export default function CreateSplit({ onBack, onCreateSplit }: CreateSplitProps) {
  const [eventName, setEventName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const handleCreate = () => {
    if (eventName.trim() && totalAmount.trim() && deadline) {
      onCreateSplit(eventName, totalAmount, deadline);
      onBack();
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios'); // iOS keeps picker open
    if (selectedDate) setDeadline(selectedDate);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#4FC3F7" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Split</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form - wrapped in ScrollView for scrollability */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Split Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Uber to Downtown"
              placeholderTextColor="#666"
              value={eventName}
              onChangeText={setEventName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Amount</Text>
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#666"
                value={totalAmount}
                onChangeText={setTotalAmount}
                keyboardType="decimal-pad"
              />
            </View>
            <Text style={styles.helperText}>Split percentage will be calculated based on participants</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Deadline</Text>
            <TouchableOpacity
              style={[styles.input, { justifyContent: 'center' }]}
              onPress={() => setShowPicker(true)}
            >
              <Text style={{ color: deadline ? '#fff' : '#666', fontSize: 16 }}>
                {deadline ? deadline.toLocaleString() : 'Select date & time'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.helperText}>You'll be charged on this date if participating</Text>
          </View>

          {showPicker && (
            <DateTimePicker
              value={deadline || new Date()}
              mode="datetime"
              display="default"
              onChange={onChange}
              minimumDate={new Date()}
            />
          )}

          <TouchableOpacity 
            style={[
              styles.createButton, 
              (!eventName.trim() || !totalAmount.trim() || !deadline) && styles.createButtonDisabled
            ]}
            onPress={handleCreate}
            disabled={!eventName.trim() || !totalAmount.trim() || !deadline}
          >
            <Text style={styles.createButtonText}>Create Split</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#4FC3F7',
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 38,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  helperText: {
    color: '#888',
    fontSize: 13,
    marginTop: 6,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  currencySymbol: {
    color: '#4FC3F7',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 5,
  },
  amountInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 15,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#4FC3F7',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 30,
  },
  createButtonDisabled: {
    backgroundColor: '#555',
  },
  createButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});