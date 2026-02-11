import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { analyzeUserProfile } from '../src/utils/profileAnalyzer'
import { Transaction, Event, Group } from '../src/types'

interface UserPersonaCardProps {
  userId: string
  userName: string
  transactions: Transaction[]
  events: Event[]
  groups: Group[]
}

export function UserPersonaCard({
  userId,
  userName,
  transactions,
  events,
  groups
}: UserPersonaCardProps) {
  const profile = useMemo(() => {
    return analyzeUserProfile(userId, transactions, events, groups)
  }, [userId, transactions, events, groups])

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{profile.emoji}</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.personaTitle}>{profile.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Personality Traits</Text>
        {profile.traits.map((trait, index) => (
          <Text key={index} style={styles.trait}>
            • {trait}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Activity Stats</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Events Attended</Text>
          <Text style={styles.statValue}>{profile.stats.eventsAttended}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>${profile.stats.totalSpent.toFixed(2)}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Avg per Event</Text>
          <Text style={styles.statValue}>${profile.stats.avgEventCost.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔍 Behavioral Insights</Text>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Group Size</Text>
          <Text style={styles.statValue}>
            {profile.stats.features.avgGroupSize.toFixed(1)} people
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Activity Level</Text>
          <Text style={styles.statValue}>
            {profile.stats.features.eventsPerMonth.toFixed(1)} events/month
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Generosity</Text>
          <Text style={styles.statValue}>
            {(profile.stats.features.generosityScore * 100).toFixed(0)}%
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Most Active</Text>
          <Text style={styles.statValue}>
            {profile.stats.features.mostActiveHour}:00
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa'
  },
  emoji: {
    fontSize: 64,
    marginBottom: 8
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4
  },
  personaTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24
  },
  section: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2d3748',
    marginBottom: 12
  },
  trait: {
    fontSize: 14,
    color: '#4a5568',
    marginBottom: 8,
    lineHeight: 20
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  statLabel: {
    fontSize: 14,
    color: '#718096',
    flex: 1
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2d3748'
  }
})
