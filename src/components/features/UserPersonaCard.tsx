/**
 * @fileoverview User persona card display component.
 * Full-page persona profile view with animated charts, traits, statistics,
 * and weekly activity breakdown. Supports theme customization.
 */

import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Helper function to get current week's date range
function getWeekDateRange(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const formatDate = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };
  
  return `${formatDate(monday)} - ${formatDate(sunday)}`;
}

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

interface UserWrappedProps {
  userProfile: any;
  userName: string;
  onClose: () => void;
  onShare: (theme: ThemeType) => void;
}

const THEMES: ThemeType[] = [
  {
    id: 'bounce',
    name: '⚡ Bounce',
    colors: ['#C3F73A', '#FFD93D', '#FF6B9D', '#00F5FF', '#A8DC28'],
    bg: '#1A1A1A',
    cardBg: '#2D2D2Dcc',
    textPrimary: '#FFFFFF',
    textSecondary: '#A0A0A0',
    bgPattern: 'triangles',
  },
  {
    id: 'bubble',
    name: '🫧 Bubble',
    colors: ['#FF6B9D', '#FFB5E8', '#B4E7FF', '#AFF8DB', '#FFDFD3'],
    bg: '#1E0A2E',
    cardBg: '#2D1B3Ddd',
    textPrimary: '#FFFFFF',
    textSecondary: '#D1B3E0',
    bgPattern: 'bubbles',
  },
  {
    id: 'stars',
    name: '⭐ Stars',
    colors: ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#9370DB'],
    bg: '#0A0A1E',
    cardBg: '#1A1A2Edd',
    textPrimary: '#FFFFFF',
    textSecondary: '#B8B8D4',
    bgPattern: 'stars',
  },
  {
    id: 'neon',
    name: '🌃 Neon',
    colors: ['#00FFF0', '#FF00E5', '#7B2FFF', '#00FF87', '#FFD93D'],
    bg: '#0A0014',
    cardBg: '#1A0A28dd',
    textPrimary: '#FFFFFF',
    textSecondary: '#B794F6',
    bgPattern: 'neon',
  },
  {
    id: 'retro',
    name: '🕹️ Retro',
    colors: ['#FF6B35', '#F7931E', '#FBB040', '#4ECDC4', '#C7F0DB'],
    bg: '#1A0A00',
    cardBg: '#2D1500dd',
    textPrimary: '#FFFFFF',
    textSecondary: '#FFCBA4',
    bgPattern: 'retro',
  },
  {
    id: 'aurora',
    name: '🌌 Aurora',
    colors: ['#00D4FF', '#B537F2', '#FF2E97', '#00F5A0', '#FFE045'],
    bg: '#0A0520',
    cardBg: '#1A0F30dd',
    textPrimary: '#FFFFFF',
    textSecondary: '#B8A4E8',
    bgPattern: 'aurora',
  },
];

// Background animations (simplified)
function BounceTriangles({ theme }: { theme: ThemeType }) {
  const fadeAnim = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0.25, duration: 3000, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0.15, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.bgContainer}>
      <Animated.View style={[styles.shapeContainer, { opacity: fadeAnim }]}>
        <Svg width={SCREEN_WIDTH * 1.5} height={SCREEN_HEIGHT} viewBox="0 0 400 800">
          <Path d="M 200 100 L 300 250 L 100 250 Z" fill={theme.colors[0]} />
        </Svg>
      </Animated.View>
    </View>
  );
}

function FloatingBubbles({ theme }: { theme: ThemeType }) {
  const bubbles = useRef(
    [...Array(6)].map(() => ({
      y: new Animated.Value(SCREEN_HEIGHT),
      x: Math.random() * SCREEN_WIDTH,
      size: 60 + Math.random() * 60,
    }))
  ).current;

  useEffect(() => {
    bubbles.forEach((bubble) => {
      Animated.loop(
        Animated.timing(bubble.y, { toValue: -200, duration: 8000, useNativeDriver: true })
      ).start();
    });
  }, []);

  return (
    <View style={styles.bgContainer}>
      {bubbles.map((bubble, i) => (
        <Animated.View key={i} style={[styles.bubble, { left: bubble.x, transform: [{ translateY: bubble.y }] }]}>
          <Svg width={bubble.size} height={bubble.size}>
            <Circle cx={bubble.size / 2} cy={bubble.size / 2} r={bubble.size / 2} fill={theme.colors[i % theme.colors.length]} opacity={0.2} />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}

function TwinklingStars({ theme }: { theme: ThemeType }) {
  const stars = useRef(
    [...Array(30)].map(() => ({
      opacity: new Animated.Value(Math.random()),
      x: Math.random() * SCREEN_WIDTH,
      y: Math.random() * SCREEN_HEIGHT,
      size: 2 + Math.random() * 3,
    }))
  ).current;

  useEffect(() => {
    stars.forEach((star) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(star.opacity, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(star.opacity, { toValue: 0.1, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.bgContainer}>
      {stars.map((star, i) => (
        <Animated.View key={i} style={[styles.star, { left: star.x, top: star.y, opacity: star.opacity }]}>
          <View style={{ width: star.size * 2, height: star.size * 2, backgroundColor: theme.colors[i % theme.colors.length], borderRadius: star.size }} />
        </Animated.View>
      ))}
    </View>
  );
}

export default function UserWrappedAppView({ 
  userProfile, 
  userName, 
  onClose,
  onShare 
}: UserWrappedProps) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [showCustomization, setShowCustomization] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(400)).current;
  const scaleAnims = useRef({
    hero: new Animated.Value(0.9),
    spending: new Animated.Value(0.9),
    vibes: new Animated.Value(0.9),
    activity: new Animated.Value(0.9),
  }).current;

  const theme = selectedTheme;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ...Object.values(scaleAnims).map((anim, index) =>
        Animated.spring(anim, { toValue: 1, delay: index * 80, tension: 50, friction: 7, useNativeDriver: true })
      ),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(modalSlide, {
      toValue: showCustomization ? 0 : 400,
      tension: 50,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [showCustomization]);

  const renderBackground = () => {
    switch (theme.bgPattern) {
      case 'triangles': return <BounceTriangles theme={theme} />;
      case 'bubbles': return <FloatingBubbles theme={theme} />;
      case 'stars': return <TwinklingStars theme={theme} />;
      default: return <BounceTriangles theme={theme} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {renderBackground()}

      <View style={styles.floatingHeader}>
        <TouchableOpacity onPress={onClose} style={[styles.headerBtn, { backgroundColor: theme.cardBg }]}>
          <Ionicons name="close" size={24} color={theme.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setShowCustomization(true)} 
          style={[styles.customizeBtn, { backgroundColor: theme.cardBg, borderColor: theme.colors[0] }]}
        >
          <Ionicons name="color-palette" size={20} color={theme.colors[0]} />
          <Text style={[styles.customizeBtnText, { color: theme.textPrimary }]}>Change Colors</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onShare(selectedTheme)} 
          style={[styles.shareBtn, { backgroundColor: theme.colors[0] }]}
        >
          <Ionicons name="share-social" size={20} color="#000" />
          <Text style={styles.shareBtnText}>Share</Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Animated.View style={[styles.heroSection, { backgroundColor: theme.cardBg, transform: [{ scale: scaleAnims.hero }] }]}>
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View>
                  <Text style={[styles.weeklyLabel, { color: theme.colors[0] }]}>WEEKLY ROUND-UP</Text>
                  <Text style={[styles.dateRange, { color: theme.textSecondary }]}>
                    {getWeekDateRange()}
                  </Text>
                  <Text style={[styles.userName, { color: theme.textPrimary }]}>{userName}</Text>
                </View>
                <Text style={styles.heroEmoji}>{userProfile.emoji}</Text>
              </View>
              <View style={styles.heroBottom}>
                <Text style={[styles.personaType, { color: theme.colors[0] }]}>
                  {userProfile.type.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={[styles.personaDesc, { color: theme.textSecondary }]}>
                  {userProfile.description.split(' - ')[1] || userProfile.description}
                </Text>
              </View>
            </View>
          </Animated.View>

          <View style={styles.bentoGrid}>
            <Animated.View style={[styles.bentoRow, { transform: [{ scale: scaleAnims.spending }] }]}>
              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardLarge, { backgroundColor: theme.cardBg }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Your Activity</Text>
                  <View style={[styles.badge, { backgroundColor: theme.colors[0] }]}>
                    <Text style={styles.badgeText}>🎉</Text>
                  </View>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statBig, { color: theme.colors[0] }]}>{userProfile.stats.eventsAttended}</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Events</Text>
                  </View>
                  <View style={[styles.statDivider, { backgroundColor: theme.colors[0], opacity: 0.2 }]} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statBig, { color: theme.colors[1] }]} numberOfLines={1} adjustsFontSizeToFit>
                      ${Math.round(userProfile.stats.totalSpent)}
                    </Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Spent</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardSmall, { backgroundColor: theme.cardBg }]}>
                <Text style={styles.cardIconLarge}>❤️</Text>
                <Text style={[styles.cardValueHuge, { color: theme.colors[2] }]} numberOfLines={1}>
                  {Math.round(userProfile.stats.features.generosityScore * 100)}%
                </Text>
                <Text style={[styles.cardLabelBold, { color: theme.textPrimary }]}>Generosity</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.bentoRow, { transform: [{ scale: scaleAnims.vibes }] }]}>
              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardMedium, { backgroundColor: theme.cardBg }]}>
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Your Vibes</Text>
                  <Text style={styles.cardEmoji}>✨</Text>
                </View>
                <View style={styles.vibesContainer}>
                  {userProfile.traits.slice(0, 4).map((trait: string, idx: number) => (
                    <View key={idx} style={[styles.vibePill, { backgroundColor: theme.colors[idx % theme.colors.length] }]}>
                      <Text style={styles.vibeText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardSmall, { backgroundColor: theme.cardBg }]}>
                <Text style={styles.cardIconLarge}>⏰</Text>
                <Text style={[styles.cardValueHuge, { color: theme.colors[3] }]} numberOfLines={1} adjustsFontSizeToFit>
                  {String(userProfile.stats.features.mostActiveHour).padStart(2, '0')}:00
                </Text>
                <Text style={[styles.cardLabelBold, { color: theme.textPrimary }]}>Peak Time</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={[styles.bentoRow, { transform: [{ scale: scaleAnims.activity }] }]}>
              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardTiny, { backgroundColor: theme.cardBg }]}>
                <Text style={styles.tinyEmoji}>📅</Text>
                <Text style={[styles.tinyValue, { color: theme.colors[0] }]}>
                  {userProfile.stats.features.eventsPerMonth.toFixed(1)}
                </Text>
                <Text style={[styles.tinyLabel, { color: theme.textSecondary }]}>Events/Month</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardTiny, { backgroundColor: theme.cardBg }]}>
                <Text style={styles.tinyEmoji}>📊</Text>
                <Text style={[styles.tinyValue, { color: theme.colors[1] }]} numberOfLines={1} adjustsFontSizeToFit>
                  ${Math.round(userProfile.stats.avgEventCost)}
                </Text>
                <Text style={[styles.tinyLabel, { color: theme.textSecondary }]}>avg cost</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} style={[styles.bentoCardTiny, { backgroundColor: theme.cardBg }]}>
                <Text style={styles.tinyEmoji}>👥</Text>
                <Text style={[styles.tinyValue, { color: theme.colors[2] }]}>
                  {userProfile.stats.features.avgGroupSize.toFixed(1)}
                </Text>
                <Text style={[styles.tinyLabel, { color: theme.textSecondary }]}>avg group</Text>
              </TouchableOpacity>
            </Animated.View>

            {userProfile.traits.length > 4 && (
              <View style={[styles.extraTraitsContainer, { backgroundColor: theme.cardBg }]}>
                <Text style={[styles.extraTraitsTitle, { color: theme.textSecondary }]}>More about you...</Text>
                <View style={styles.extraTraitsGrid}>
                  {userProfile.traits.slice(4).map((trait: string, idx: number) => (
                    <View key={idx} style={[styles.extraTraitPill, { backgroundColor: theme.colors[(idx + 4) % theme.colors.length] }]}>
                      <Text style={styles.extraTraitText}>{trait}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={{ height: 60 }} />
        </Animated.View>
      </Animated.ScrollView>

      <Modal visible={showCustomization} transparent animationType="none" onRequestClose={() => setShowCustomization(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCustomization(false)}>
          <Animated.View style={[styles.customizationSheet, { transform: [{ translateY: modalSlide }] }]} onStartShouldSetResponder={() => true}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Pick Your Vibe</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.themesScroll}>
              {THEMES.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => {
                    setSelectedTheme(t);
                    setTimeout(() => setShowCustomization(false), 300);
                  }}
                  style={[styles.themeCard, { backgroundColor: t.cardBg }, selectedTheme.id === t.id && { borderColor: t.colors[0], borderWidth: 3 }]}
                >
                  <View style={styles.themeColors}>
                    {t.colors.slice(0, 4).map((color, idx) => (
                      <View key={idx} style={[styles.colorDot, { backgroundColor: color }]} />
                    ))}
                  </View>
                  <Text style={[styles.themeName, { color: t.textPrimary }]}>{t.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' },
  shapeContainer: { position: 'absolute', top: -100, left: -100 },
  bubble: { position: 'absolute' },
  star: { position: 'absolute' },
  floatingHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 15, zIndex: 100 },
  headerBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  customizeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1.5 },
  customizeBtnText: { fontSize: 13, fontWeight: '600' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 24 },
  shareBtnText: { color: '#000', fontSize: 15, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  content: { paddingTop: 120, paddingHorizontal: 20 },
  heroSection: { borderRadius: 28, overflow: 'hidden', marginBottom: 16 },
  heroContent: { padding: 24 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  weeklyLabel: { fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 4 },
  dateRange: { fontSize: 11, fontWeight: '600', marginBottom: 8 },
  userName: { fontSize: 24, fontWeight: 'bold' },
  heroEmoji: { fontSize: 72 },
  heroBottom: { gap: 8 },
  personaType: { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.5 },
  personaDesc: { fontSize: 14, lineHeight: 20 },
  bentoGrid: { gap: 12 },
  bentoRow: { flexDirection: 'row', gap: 12 },
  bentoCardLarge: { flex: 2, padding: 20, borderRadius: 24 },
  bentoCardMedium: { flex: 2, padding: 20, borderRadius: 24 },
  bentoCardSmall: { flex: 1, padding: 20, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  bentoCardTiny: { flex: 1, padding: 16, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold' },
  cardEmoji: { fontSize: 20 },
  badge: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontSize: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  statBig: { fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: '600' },
  statDivider: { width: 1, height: 40, marginHorizontal: 12 },
  cardIconLarge: { fontSize: 48, marginBottom: 12 },
  cardValueHuge: { fontSize: 32, fontWeight: 'bold', marginBottom: 6 },
  cardLabelBold: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  vibesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  vibePill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 16 },
  vibeText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  tinyEmoji: { fontSize: 32, marginBottom: 8 },
  tinyValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
  tinyLabel: { fontSize: 10, fontWeight: '600', textAlign: 'center' },
  extraTraitsContainer: { marginTop: 8, padding: 20, borderRadius: 24 },
  extraTraitsTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  extraTraitsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  extraTraitPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  extraTraitText: { fontSize: 11, fontWeight: '600', color: '#000' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  customizationSheet: { backgroundColor: '#1a1a1a', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 40, paddingTop: 20 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#666', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', paddingHorizontal: 20, marginBottom: 20 },
  themesScroll: { paddingHorizontal: 20, gap: 12 },
  themeCard: { width: 110, padding: 12, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  themeColors: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  colorDot: { width: 18, height: 18, borderRadius: 9 },
  themeName: { fontSize: 13, fontWeight: 'bold' },
});