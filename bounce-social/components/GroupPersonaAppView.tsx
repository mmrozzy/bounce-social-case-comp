import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface PersonaProps {
  groupPersona: any;
  groupName: string;
  onClose: () => void;
  onShare: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

// Trendy color palettes
const THEMES = [
  {
    id: 'hype',
    name: '🔥 Hype',
    colors: ['#C3F73A', '#FF006E', '#8338EC', '#3A86FF'],
    gradient: ['#C3F73A', '#FF006E'],
    bg: '#000000',
  },
  {
    id: 'sunset',
    name: '🌅 Sunset',
    colors: ['#FF6B35', '#F7931E', '#FBB040', '#FFDD00'],
    gradient: ['#FF6B35', '#FFDD00'],
    bg: '#0a0302',
  },
  {
    id: 'ocean',
    name: '🌊 Ocean',
    colors: ['#00F5FF', '#0096FF', '#6A00FF', '#C400FF'],
    gradient: ['#00F5FF', '#6A00FF'],
    bg: '#000510',
  },
  {
    id: 'candy',
    name: '🍬 Candy',
    colors: ['#FF69B4', '#FF1493', '#BA55D3', '#9370DB'],
    gradient: ['#FF69B4', '#9370DB'],
    bg: '#0a0008',
  },
  {
    id: 'forest',
    name: '🌲 Forest',
    colors: ['#00FF87', '#60EFFF', '#7AFDD6', '#B6FFF5'],
    gradient: ['#00FF87', '#7AFDD6'],
    bg: '#000a05',
  },
  {
    id: 'fire',
    name: '🔥 Fire',
    colors: ['#FF0000', '#FF4500', '#FF6347', '#FFD700'],
    gradient: ['#FF0000', '#FFD700'],
    bg: '#0a0000',
  },
];

export default function GroupPersonaAppView({ 
  groupPersona, 
  groupName, 
  onClose,
  onShare 
}: PersonaProps) {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [pressedCard, setPressedCard] = useState<string | null>(null);
  const [showThemes, setShowThemes] = useState(false);

  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef({
    hero: new Animated.Value(0.9),
    spending: new Animated.Value(0.9),
    vibes: new Animated.Value(0.9),
    activity: new Animated.Value(0.9),
    members: new Animated.Value(0.9),
  }).current;

  const theme = selectedTheme;

  useEffect(() => {
    // Staggered entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      ...Object.values(scaleAnims).map((anim, index) =>
        Animated.spring(anim, {
          toValue: 1,
          delay: index * 80,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const handleCardPress = (cardId: string) => {
    setPressedCard(cardId);
    setTimeout(() => setPressedCard(null), 150);
  };

  // Parallax effect
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Floating Header */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity 
          onPress={onClose}
          style={[styles.headerBtn, { backgroundColor: '#ffffff15' }]}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setShowThemes(!showThemes)}
          style={[styles.themeBtn, { backgroundColor: '#ffffff15' }]}
        >
          <Text style={styles.themeBtnEmoji}>{theme.name.split(' ')[0]}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={onShare}
          style={styles.shareBtn}
        >
          <LinearGradient
            colors={theme.gradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shareBtnGradient}
          >
            <Ionicons name="share-social" size={20} color="#000" />
            <Text style={styles.shareBtnText}>Share</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Theme Selector */}
      {showThemes && (
        <View style={styles.themeSelector}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.themesScroll}
          >
            {THEMES.map((t, idx) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => {
                  setSelectedTheme(t);
                  setShowThemes(false);
                }}
                style={[
                  styles.themeCard,
                  selectedTheme.id === t.id && styles.themeCardActive
                ]}
              >
                <LinearGradient
                  colors={t.gradient as [string, string, ...string[]]}
                  style={styles.themeGradient}
                />
                <Text style={styles.themeName}>{t.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View 
          style={[
            styles.content,
            { opacity: fadeAnim }
          ]}
        >
          {/* Hero Section */}
          <Animated.View
            style={[
              styles.heroSection,
              { transform: [{ scale: scaleAnims.hero }] }
            ]}
          >
            <LinearGradient
              colors={[...theme.gradient, 'transparent'] as unknown as [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            
            <View style={styles.heroContent}>
              <View style={styles.heroTop}>
                <View>
                  <Text style={styles.groupLabel}>YOUR GROUP</Text>
                  <Text style={styles.groupName}>{groupName}</Text>
                </View>
                <Text style={styles.heroEmoji}>{groupPersona.dominantPersona.emoji}</Text>
              </View>
              
              <View style={styles.heroBottom}>
                <Text style={[styles.personaType, { color: theme.colors[0] }]}>
                  {groupPersona.dominantPersona.type.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={styles.personaDesc}>
                  {groupPersona.dominantPersona.description}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Bento Grid */}
          <View style={styles.bentoGrid}>
            {/* Row 1: Spending Stats */}
            <Animated.View 
              style={[
                styles.bentoRow,
                { transform: [{ scale: scaleAnims.spending }] }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleCardPress('events')}
                style={[styles.bentoCardLarge, { backgroundColor: '#ffffff08' }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Spending Power</Text>
                  <View style={[styles.badge, { backgroundColor: theme.colors[0] }]}>
                    <Text style={styles.badgeText}>💰</Text>
                  </View>
                </View>
                
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statBig, { color: theme.colors[0] }]}>
                      {groupPersona.groupStats.totalEvents}
                    </Text>
                    <Text style={styles.statLabel}>Events</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={[styles.statBig, { color: theme.colors[1] }]}>
                      ${Math.round(groupPersona.groupStats.totalSpent)}
                    </Text>
                    <Text style={styles.statLabel}>Total Spent</Text>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={[theme.colors[0], theme.colors[1]]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[
                        styles.progressFill,
                        { width: `${Math.min((groupPersona.groupStats.totalSpent / 3000) * 100, 100)}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressLabel}>
                    ${Math.round(groupPersona.groupStats.avgEventCost)} avg per event
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleCardPress('generosity')}
                style={[styles.bentoCardSmall, { backgroundColor: '#ffffff08' }]}
              >
                <Text style={styles.cardIconLarge}>❤️</Text>
                <Text style={[styles.cardValueHuge, { color: theme.colors[2] }]}>
                  {Math.round(groupPersona.groupStats.groupGenerosity * 100)}%
                </Text>
                <Text style={styles.cardLabelBold}>Generosity</Text>
                <Text style={styles.cardSubtext}>Squad goals 💯</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Row 2: Vibes */}
            <Animated.View 
              style={[
                styles.bentoRow,
                { transform: [{ scale: scaleAnims.vibes }] }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleCardPress('vibes')}
                style={[styles.bentoCardMedium, { backgroundColor: '#ffffff08' }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Group Vibes</Text>
                  <Text style={styles.cardEmoji}>✨</Text>
                </View>
                
                <View style={styles.vibesContainer}>
                  {groupPersona.groupTraits.slice(0, 4).map((trait: string, idx: number) => (
                    <View 
                      key={idx}
                      style={[
                        styles.vibePill,
                        { 
                          backgroundColor: `${theme.colors[idx % theme.colors.length]}20`,
                          borderColor: theme.colors[idx % theme.colors.length]
                        }
                      ]}
                    >
                      <Text style={[styles.vibeText, { color: theme.colors[idx % theme.colors.length] }]}>
                        {trait}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleCardPress('time')}
                style={[styles.bentoCardSmall, { backgroundColor: '#ffffff08' }]}
              >
                <Text style={styles.cardIconLarge}>⏰</Text>
                <Text style={[styles.cardValueHuge, { color: theme.colors[3] }]}>
                  {groupPersona.groupStats.mostActiveTime}:00
                </Text>
                <Text style={styles.cardLabelBold}>Peak Time</Text>
                <Text style={styles.cardSubtext}>Prime hours</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Row 3: Activity Metrics */}
            <Animated.View 
              style={[
                styles.bentoRow,
                { transform: [{ scale: scaleAnims.activity }] }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.bentoCardTiny, { backgroundColor: '#ffffff08' }]}
              >
                <Text style={styles.tinyEmoji}>🎉</Text>
                <Text style={[styles.tinyValue, { color: theme.colors[0] }]}>
                  {Math.round(groupPersona.groupStats.totalEvents / 3)}
                </Text>
                <Text style={styles.tinyLabel}>per month</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.bentoCardTiny, { backgroundColor: '#ffffff08' }]}
              >
                <Text style={styles.tinyEmoji}>📊</Text>
                <Text style={[styles.tinyValue, { color: theme.colors[1] }]}>
                  ${Math.round(groupPersona.groupStats.avgEventCost)}
                </Text>
                <Text style={styles.tinyLabel}>avg cost</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.bentoCardTiny, { backgroundColor: '#ffffff08' }]}
              >
                <Text style={styles.tinyEmoji}>👥</Text>
                <Text style={[styles.tinyValue, { color: theme.colors[2] }]}>
                  {groupPersona.personaDistribution.reduce((sum: number, d: any) => sum + d.count, 0)}
                </Text>
                <Text style={styles.tinyLabel}>members</Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Row 4: Member Types */}
            <Animated.View 
              style={[
                styles.bentoRow,
                { transform: [{ scale: scaleAnims.members }] }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.bentoCardFull, { backgroundColor: '#ffffff08' }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>Member Breakdown</Text>
                  <Text style={styles.cardEmoji}>👥</Text>
                </View>

                <View style={styles.membersGrid}>
                  {groupPersona.personaDistribution.map((dist: any, idx: number) => {
                    const color = theme.colors[idx % theme.colors.length];
                    return (
                      <View 
                        key={idx}
                        style={[styles.memberCard, { borderColor: color }]}
                      >
                        <Text style={styles.memberEmoji}>{dist.emoji}</Text>
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>
                            {dist.personaKey.replace(/([A-Z])/g, ' $1').trim()}
                          </Text>
                          <View style={styles.memberStats}>
                            <Text style={[styles.memberCount, { color }]}>
                              {dist.count}
                            </Text>
                            <View style={[styles.percentBadge, { backgroundColor: color }]}>
                              <Text style={styles.percentText}>{dist.percentage}%</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Extra Traits if more than 4 */}
            {groupPersona.groupTraits.length > 4 && (
              <View style={styles.extraTraitsContainer}>
                <Text style={styles.extraTraitsTitle}>More vibes...</Text>
                <View style={styles.extraTraitsGrid}>
                  {groupPersona.groupTraits.slice(4).map((trait: string, idx: number) => (
                    <View 
                      key={idx}
                      style={[
                        styles.extraTraitPill,
                        { borderColor: theme.colors[(idx + 4) % theme.colors.length] }
                      ]}
                    >
                      <Text style={[
                        styles.extraTraitText,
                        { color: theme.colors[(idx + 4) % theme.colors.length] }
                      ]}>
                        {trait}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Bottom Spacer */}
          <View style={{ height: 60 }} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Action Hint */}
      <View style={styles.floatingHint}>
        <Text style={styles.hintText}>
          Tap cards to explore • Swipe for more
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    zIndex: 100,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(20px)',
  },
  themeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeBtnEmoji: {
    fontSize: 24,
  },
  shareBtn: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  shareBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  shareBtnText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  themeSelector: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    zIndex: 99,
    paddingBottom: 15,
  },
  themesScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  themeCard: {
    width: 100,
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeCardActive: {
    borderColor: '#fff',
  },
  themeGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  themeName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  heroSection: {
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  heroContent: {
    padding: 24,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  groupLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 6,
  },
  groupName: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  heroEmoji: {
    fontSize: 72,
  },
  heroBottom: {
    gap: 8,
  },
  personaType: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  personaDesc: {
    fontSize: 14,
    color: '#ccc',
    lineHeight: 20,
  },
  bentoGrid: {
    gap: 12,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bentoCardLarge: {
    flex: 2,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  bentoCardMedium: {
    flex: 2,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  bentoCardSmall: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  bentoCardTiny: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  bentoCardFull: {
    flex: 1,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffffff15',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardEmoji: {
    fontSize: 20,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80, 
  },
  statBig: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#ffffff20',
    marginHorizontal: 16,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ffffff10',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
  },
  cardIconLarge: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardValueHuge: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  cardLabelBold: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 11,
    color: '#999',
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  vibePill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  vibeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  tinyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  tinyValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tinyLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },
  membersGrid: {
    gap: 12,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    backgroundColor: '#ffffff05',
    borderRadius: 16,
    borderWidth: 2,
  },
  memberEmoji: {
    fontSize: 40,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  memberStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  memberCount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  percentBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  percentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  extraTraitsContainer: {
    marginTop: 8,
    padding: 20,
    backgroundColor: '#ffffff05',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ffffff10',
  },
  extraTraitsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 12,
  },
  extraTraitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  extraTraitPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    backgroundColor: '#ffffff05',
  },
  extraTraitText: {
    fontSize: 11,
    fontWeight: '600',
  },
  floatingHint: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hintText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    backgroundColor: '#00000088',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
});