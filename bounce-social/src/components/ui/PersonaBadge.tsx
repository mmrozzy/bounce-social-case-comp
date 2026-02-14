import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { extractUserFeatures } from '../src/types/feature_extractor'
import { matchPersona, getPersonaDetails } from '../src/types/personaMatcher'
import { Transaction, Event, Group } from '../src/types'

interface PersonaBadgeProps {
  userId: string
  transactions: Transaction[]
  events: Event[]
  groups: Group[]
  size?: 'small' | 'medium' | 'large'
  showLabel?: boolean
  onPress?: () => void
}

export function PersonaBadge({
  userId,
  transactions,
  events,
  groups,
  size = 'medium',
  showLabel = true,
  onPress
}: PersonaBadgeProps) {
  const personaInfo = useMemo(() => {
    const persona = extractUserFeatures(userId, transactions, events, groups)
    const match = matchPersona(persona)
    const details = getPersonaDetails(match.personaKey)
    return {
      ...details,
      confidence: Math.round(match.similarity * 100)
    }
  }, [userId, transactions, events, groups])

  const sizeStyles = {
    small: { emoji: styles.emojiSmall, label: styles.labelSmall },
    medium: { emoji: styles.emojiMedium, label: styles.labelMedium },
    large: { emoji: styles.emojiLarge, label: styles.labelLarge }
  }

  const Container = onPress ? TouchableOpacity : View

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.badge}>
        <Text style={[styles.emoji, sizeStyles[size].emoji]}>
          {personaInfo.emoji}
        </Text>
        {showLabel && (
          <View style={styles.labelContainer}>
            <Text style={[styles.label, sizeStyles[size].label]} numberOfLines={1}>
              {personaInfo.type.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
            <Text style={styles.confidence}>{personaInfo.confidence}% match</Text>
          </View>
        )}
      </View>
    </Container>
  )
}

interface PersonaChipProps {
  personaKey: string
  size?: 'small' | 'medium'
}

export function PersonaChip({ personaKey, size = 'small' }: PersonaChipProps) {
  const details = getPersonaDetails(personaKey)
  
  const chipSize = size === 'small' ? styles.chipSmall : styles.chipMedium
  const textSize = size === 'small' ? styles.chipTextSmall : styles.chipTextMedium

  return (
    <View style={[styles.chip, chipSize]}>
      <Text style={[styles.chipText, textSize]}>
        {details.emoji} {details.type.replace(/([A-Z])/g, ' $1').trim()}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  badge: {
    alignItems: 'center',
    padding: 8
  },
  emoji: {
    textAlign: 'center'
  },
  emojiSmall: {
    fontSize: 24
  },
  emojiMedium: {
    fontSize: 40
  },
  emojiLarge: {
    fontSize: 64
  },
  labelContainer: {
    marginTop: 4,
    alignItems: 'center'
  },
  label: {
    fontWeight: '600',
    color: '#2d3748',
    textAlign: 'center'
  },
  labelSmall: {
    fontSize: 10
  },
  labelMedium: {
    fontSize: 12
  },
  labelLarge: {
    fontSize: 16
  },
  confidence: {
    fontSize: 10,
    color: '#718096',
    marginTop: 2
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6
  },
  chipSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  chipMedium: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  chipText: {
    color: '#2d3748',
    fontWeight: '600'
  },
  chipTextSmall: {
    fontSize: 11
  },
  chipTextMedium: {
    fontSize: 13
  }
})
