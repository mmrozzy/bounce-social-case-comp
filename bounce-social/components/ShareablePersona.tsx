import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface ShareablePersonaProps {
  groupPersona: any;
  groupName: string;
  theme: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    gradient: string[];
  };
  onClose: () => void;
}

const PRESET_THEMES = [
  {
    name: 'Neon',
    primary: '#C3F73A',
    secondary: '#FF006E',
    tertiary: '#8338EC',
    quaternary: '#3A86FF',
    gradient: ['#C3F73A', '#FF006E'],
  },
  {
    name: 'Sunset',
    primary: '#FF6B6B',
    secondary: '#FFD93D',
    tertiary: '#6BCB77',
    quaternary: '#4D96FF',
    gradient: ['#FF6B6B', '#FFD93D'],
  },
  {
    name: 'Ocean',
    primary: '#00B4D8',
    secondary: '#90E0EF',
    tertiary: '#0077B6',
    quaternary: '#03045E',
    gradient: ['#00B4D8', '#0077B6'],
  },
  {
    name: 'Pastel',
    primary: '#FFB6B9',
    secondary: '#FAE3D9',
    tertiary: '#BBDED6',
    quaternary: '#61C0BF',
    gradient: ['#FFB6B9', '#61C0BF'],
  },
];

export default function ShareablePersona({
  groupPersona,
  groupName,
  theme,
  onClose,
}: ShareablePersonaProps) {
  const cardRef = useRef<View>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const handleShare = async () => {
    try {
      setIsSharing(true);

      if (!cardRef.current) throw new Error('Card ref not found');

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Sharing not available');
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: `${groupName} – Group Persona`,
        UTI: 'public.png',
      });
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to share image');
    } finally {
      setIsSharing(false);
    }
  };

  const stats = [
    {
      label: 'Events',
      value: groupPersona.groupStats.totalEvents,
      color: currentTheme.primary,
    },
    {
      label: 'Total Spent',
      value: `$${Math.round(groupPersona.groupStats.totalSpent)}`,
      color: currentTheme.secondary,
    },
    {
      label: 'Avg Cost',
      value: `$${Math.round(groupPersona.groupStats.avgEventCost)}`,
      color: currentTheme.tertiary,
    },
    {
      label: 'Generosity',
      value: `${Math.round(
        groupPersona.groupStats.groupGenerosity * 100
      )}%`,
      color: currentTheme.quaternary,
    },
  ];

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.actions}>
          {/* Customize */}
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => setShowThemePicker(!showThemePicker)}
          >
            <Ionicons name="color-palette" size={18} color="#FFF" />
            <Text style={styles.actionText}>Customize</Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: currentTheme.primary }]}
            onPress={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator color="#000" />
            ) : (
              <>
                <Ionicons name="share-social" size={18} color="#000" />
                <Text style={[styles.actionText, { color: '#000' }]}>
                  Share
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Theme Picker */}
      {showThemePicker && (
        <View style={styles.themePicker}>
          {PRESET_THEMES.map((t, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.themeCircle, { backgroundColor: t.primary }]}
              onPress={() => setCurrentTheme(t)}
            />
          ))}
        </View>
      )}

      {/* Shareable Card */}
      <View
        ref={cardRef}
        collapsable={false}
        style={[styles.card, { borderColor: currentTheme.primary }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.emoji}>
            {groupPersona.dominantPersona.emoji}
          </Text>
          <Text style={[styles.personaType, { color: currentTheme.primary }]}>
            {groupPersona.dominantPersona.type
              .replace(/([A-Z])/g, ' $1')
              .trim()}
          </Text>
          <Text style={styles.description}>
            “{groupPersona.dominantPersona.description}”
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {stats.map((stat, idx) => (
            <View
              key={idx}
              style={[styles.statCard, { borderColor: stat.color }]}
            >
              <Text style={[styles.statValue, { color: stat.color }]}>
                {stat.value}
              </Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Traits */}
        <View style={styles.traitsSection}>
          <Text style={styles.sectionTitle}>Top Traits</Text>
          <View style={styles.traitsRow}>
            {groupPersona.groupTraits.slice(0, 4).map((trait: string, idx: number) => (
              <View
                key={idx}
                style={[
                  styles.traitPill,
                  {
                    borderColor: currentTheme.primary,
                    backgroundColor: `${currentTheme.primary}15`,
                  },
                ]}
              >
                <Text style={[styles.traitText, { color: currentTheme.primary }]}>
                  {trait}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Branding */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <View style={[styles.logoPlaceholder, { backgroundColor: currentTheme.primary }]} />
            <Text style={styles.brandText}>BouncePay</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },

  topBar: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
  },

  actionText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: '600',
  },

  themePicker: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 12,
  },

  themeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFF',
  },

  card: {
    width: 340,
    backgroundColor: '#0E0E0E',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  groupName: {
    fontSize: 14,
    color: '#999',
    marginBottom: 6,
  },

  emoji: {
    fontSize: 64,
    marginBottom: 8,
  },

  personaType: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  description: {
    fontSize: 13,
    color: '#CCC',
    textAlign: 'center',
    lineHeight: 18,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },

  statCard: {
    width: '47%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 11,
    color: '#AAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  traitsSection: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 10,
  },

  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  traitPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.2,
  },

  traitText: {
    fontSize: 11,
    fontWeight: '600',
  },

  footer: {
    alignItems: 'center',
    marginTop: 10,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  logoPlaceholder: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },

  brandText: {
    fontSize: 12,
    color: '#AAA',
  },
});
