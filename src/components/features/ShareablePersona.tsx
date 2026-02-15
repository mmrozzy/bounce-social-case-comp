/**
 * @fileoverview Shareable group persona card component.
 * Generates social media-ready group persona cards with themed layouts.
 * Optimized for Instagram posts and stories with brand-consistent design.
 */

import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    type TextStyle,
    type ViewStyle,
} from 'react-native';
import { captureRef } from 'react-native-view-shot';

const { width } = Dimensions.get('window');

type Mode = 'post' | 'story';

type ThemeType = {
  id: string;
  name: string;
  colors: string[];
  bg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  bgPattern: string;
};

interface Props {
  groupPersona: any;
  groupName: string;
  selectedTheme: ThemeType;
  onBack: () => void;
}

export default function ShareablePersona({
  groupPersona,
  groupName,
  selectedTheme,
  onBack,
}: Props) {
  const [mode, setMode] = useState<Mode>('post');
  const [isSharing, setIsSharing] = useState(false);
  const cardRef = useRef<View>(null);

  const theme = selectedTheme;

  const CARD_WIDTH = width - 40;
  const CARD_HEIGHT = mode === 'post' ? CARD_WIDTH * 1.25 : CARD_WIDTH * 1.77;

  const stats = [
    {
      label: 'Events',
      value: groupPersona.groupStats.totalEvents,
    },
    {
      label: 'Spent',
      value: `$${Math.round(groupPersona.groupStats.totalSpent)}`,
    },
    {
      label: 'Members',
      value: groupPersona.groupStats.totalMembers ?? 0,
    },
    {
      label: 'Generosity',
      value: `${Math.round(groupPersona.groupStats.groupGenerosity * 100)}%`,
    },
  ];

  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
    };

    return `${start.toLocaleDateString(undefined, options)} – ${end.toLocaleDateString(
      undefined,
      options
    )}`;
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      await new Promise((res) => setTimeout(res, 300));

      if (!cardRef.current) return;

      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
      });

      await Sharing.shareAsync(uri);
    } catch {
      Alert.alert('Error', 'Failed to share image');
    } finally {
      setIsSharing(false);
    }
  };

  // Custom chain logo made of two interconnected triangles pointing left and right,
  // overlapping bottoms, flat sides connecting in center
  const ChainLogo = () => {
    const size = 80;
    const color1 = theme.colors[0];
    const color2 = theme.colors[1];

    // Styles for left triangle pointing left
    const leftTriangle = {
      width: 0,
      height: 0,
      borderTopWidth: size / 2,
      borderBottomWidth: size / 2,
      borderRightWidth: size * 0.9,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: color1,
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      borderRadius: 6,
      // flat side right at the middle, no rotation needed
    };

    // Styles for right triangle pointing right
    const rightTriangle = {
      width: 0,
      height: 0,
      borderTopWidth: size / 2,
      borderBottomWidth: size / 2,
      borderLeftWidth: size * 0.9,
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
      borderLeftColor: color2,
      position: 'absolute' as const,
      bottom: 0,
      left: size * 0.5, // overlap half with left triangle's bottom part
      borderRadius: 6,
    };

    return (
      <View
        style={{
          position: 'absolute',
          width: size * 1.5,
          height: size,
          bottom: 40,
          left: (CARD_WIDTH - size * 1.5) / 2,
          opacity: 0.07,
        }}
      >
        <View style={leftTriangle} />
        <View style={rightTriangle} />
      </View>
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.bg }]}>
      {/* Back */}
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Ionicons name="arrow-back" size={26} color={theme.textPrimary} />
      </TouchableOpacity>

      {/* Toggle */}
      <View style={styles.toggle}>
        {['post', 'story'].map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMode(m as Mode)}
            style={[
              styles.toggleBtn,
              mode === m && {
                backgroundColor: theme.colors[0],
              },
            ]}
          >
            <Text
              style={{
                color: mode === m ? '#000' : theme.textPrimary,
                fontWeight: '600',
              }}
            >
              {m.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Share Card */}
      <View
        ref={cardRef}
        collapsable={false}
        style={[
          styles.card,
          {
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backgroundColor: theme.cardBg,
          },
        ]}
      >
        {/* Decorative Shapes */}
        <View
          style={[styles.circleTop, { backgroundColor: `${theme.colors[0]}20` }]}
        />
        <View
          style={[styles.circleBottom, { backgroundColor: `${theme.colors[1]}20` }]}
        />

        {/* Custom chain logo */}
        <ChainLogo />

        {/* Content */}
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text numberOfLines={1} style={[styles.weeklyLabel, { color: theme.textPrimary }]}>
              Weekly Round-Up
            </Text>
            <Text style={[styles.date, { color: theme.textSecondary }]}>{getDateRange()}</Text>
          </View>
          
          <View style={styles.header}>
            <Text numberOfLines={1} style={[styles.groupName, { color: theme.textPrimary }]}>
              {groupName} Group
            </Text>
          </View>

          {/* Persona */}
          <View style={styles.hero}>
            <Text style={[styles.emoji, mode === 'story' && { fontSize: 120 }]}>
              {groupPersona.dominantPersona.emoji}
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.personaType, { color: theme.colors[0] }]}
            >
              {groupPersona.dominantPersona.type.replace(/([A-Z])/g, ' $1').trim()}
            </Text>
          </View>

          {/* Stats */}
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => (
              <View key={i} style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.colors[i % theme.colors.length] }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Footer */}
          <Text style={[styles.footer, { color: theme.textSecondary }]}>Powered by Bounce Pay</Text>
        </View>
      </View>

      {/* Share */}
      <TouchableOpacity
        style={[styles.shareBtn, { backgroundColor: theme.colors[0] }]}
        onPress={handleShare}
        disabled={isSharing}
      >
        {isSharing ? (
          <ActivityIndicator color="#000" />
        ) : (
          <>
            <Ionicons name="share-social" size={18} color="#000" />
            <Text style={styles.shareText}>Share</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- Styles ---------------- */

type Styles = {
  screen: ViewStyle;
  backBtn: ViewStyle;
  toggle: ViewStyle;
  toggleBtn: ViewStyle;
  card: ViewStyle;
  content: ViewStyle;
  header: ViewStyle;
  groupName: TextStyle;
  date: TextStyle;
  hero: ViewStyle;
  emoji: TextStyle;
  personaType: TextStyle;
  statsGrid: ViewStyle;
  statBox: ViewStyle;
  statValue: TextStyle;
  statLabel: TextStyle;
  footer: TextStyle;
  shareBtn: ViewStyle;
  shareText: TextStyle;
  circleTop: ViewStyle;
  circleBottom: ViewStyle;
  weeklyLabel: TextStyle;
};

const styles = StyleSheet.create<Styles>({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },

  toggle: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 6,
  },

  card: {
    borderRadius: 36,
    overflow: 'hidden',
  },

  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
  },

  groupName: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  date: {
    fontSize: 12,
    marginTop: 4,
  },

  hero: {
    alignItems: 'center',
  },

  emoji: {
    fontSize: 90,
  },

  personaType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },

  statsGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statBox: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },

  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },

  footer: {
    fontSize: 11,
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    marginTop: 24,
  },

  shareText: {
    marginLeft: 8,
    fontWeight: 'bold',
    color: '#000',
  },

  circleTop: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -40,
    right: -40,
  },

  circleBottom: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    bottom: -60,
    left: -60,
  },

  weeklyLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#C3F73A',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
});
    