import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface CreateSplitProps {
  onBack: () => void;
  onCreateSplit: (eventName: string, totalAmount: string, deadline: string) => void;
}

export default function CreateSplit({ onBack, onCreateSplit }: CreateSplitProps) {
  const [eventName, setEventName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleCreate = () => {
    if (eventName.trim() && totalAmount.trim() && deadline.trim()) {
      onCreateSplit(eventName, totalAmount, deadline);
      onBack();
    }
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

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Split Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Court Rental费用"
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
          <TextInput
            style={styles.input}
            placeholder="e.g. Feb 10, 6:00 PM"
            placeholderTextColor="#666"
            value={deadline}
            onChangeText={setDeadline}
          />
          <Text style={styles.helperText}>You'll be charged on this date if participating</Text>
        </View>

        <TouchableOpacity 
          style={[styles.createButton, (!eventName.trim() || !totalAmount.trim() || !deadline.trim()) && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!eventName.trim() || !totalAmount.trim() || !deadline.trim()}
        >
          <Text style={styles.createButtonText}>Create Split</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
  percentageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  percentageInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 15,
    fontSize: 16,
  },
  percentageSymbol: {
    color: '#4FC3F7',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 5,
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
