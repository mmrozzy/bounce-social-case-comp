import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

interface ShareableGroupPersonaProps {
  groupPersona: any;
  groupName: string;
  onClose: () => void;
}

const COLOR_THEMES = [
  {
    id: 'neon',
    name: 'Neon Nights',
    primary: '#C3F73A',
    secondary: '#FF006E',
    tertiary: '#8338EC',
    background: '#000000',
    cardBg: '#1a1a1a',
    text: '#ffffff',
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    primary: '#FF6B35',
    secondary: '#F7931E',
    tertiary: '#FBB040',
    background: '#1a0f1f',
    cardBg: '#2a1f2f',
    text: '#ffffff',
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    primary: '#4FC3F7',
    secondary: '#29B6F6',
    tertiary: '#03A9F4',
    background: '#0a1929',
    cardBg: '#1a2939',
    text: '#ffffff',
  },
  {
    id: 'forest',
    name: 'Forest Glow',
    primary: '#66BB6A',
    secondary: '#4CAF50',
    tertiary: '#81C784',
    background: '#0f1f0f',
    cardBg: '#1f2f1f',
    text: '#ffffff',
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    primary: '#FF4081',
    secondary: '#FF80AB',
    tertiary: '#F48FB1',
    background: '#1f0a1a',
    cardBg: '#2f1a2a',
    text: '#ffffff',
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    primary: '#ffffff',
    secondary: '#e0e0e0',
    tertiary: '#bdbdbd',
    background: '#121212',
    cardBg: '#1e1e1e',
    text: '#ffffff',
  },
];

export default function GroupPersona({ 
  groupPersona, 
  groupName, 
  onClose 
}: ShareableGroupPersonaProps) {
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [isSharing, setIsSharing] = useState(false);
  const viewRef = useRef<View>(null);

  const theme = selectedTheme;

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      // Capture the view as an image
      if (viewRef.current) {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1,
        });

        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: `Share ${groupName} Group Persona`,
          });
        } else {
          // Fallback to basic share
          await Share.share({
            message: `Check out our ${groupName} group persona! 🎉`,
            url: uri,
          });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  const renderStatBar = (label: string, value: number, maxValue: number, icon: string) => {
    const percentage = Math.min((value / maxValue) * 100, 100);
    
    return (
      <View style={styles.statBarContainer}>
        <View style={styles.statBarHeader}>
          <View style={styles.statBarLabelContainer}>
            <Text style={styles.statBarIcon}>{icon}</Text>
            <Text style={[styles.statBarLabel, { color: theme.text }]}>{label}</Text>
          </View>
          <Text style={[styles.statBarValue, { color: theme.primary }]}>
            {typeof value === 'number' ? value.toFixed(0) : value}
          </Text>
        </View>
        <View style={[styles.statBarTrack, { backgroundColor: theme.cardBg }]}>
          <View 
            style={[
              styles.statBarFill, 
              { 
                width: `${percentage}%`,
                backgroundColor: theme.primary,
              }
            ]} 
          />
        </View>
      </View>
    );
  };

  const renderCircularStat = (label: string, value: string, icon: string, color: string) => {
    return (
      <View style={styles.circularStatContainer}>
        <View style={[styles.circularStatCircle, { borderColor: color }]}>
          <Text style={styles.circularStatIcon}>{icon}</Text>
          <Text style={[styles.circularStatValue, { color }]}>{value}</Text>
        </View>
        <Text style={[styles.circularStatLabel, { color: theme.text }]}>{label}</Text>
      </View>
    );
  };

  const renderPersonaDistribution = () => {
    return (
      <View style={styles.personaDistSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>👥 Member Vibes</Text>
        <View style={styles.personaGrid}>
          {groupPersona.personaDistribution.slice(0, 4).map((dist: any, index: number) => (
            <View 
              key={index} 
              style={[
                styles.personaCard,
                { backgroundColor: theme.cardBg, borderColor: theme.primary }
              ]}
            >
              <Text style={styles.personaCardEmoji}>{dist.emoji}</Text>
              <Text style={[styles.personaCardName, { color: theme.text }]}>
                {dist.personaKey.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
              <Text style={[styles.personaCardCount, { color: theme.primary }]}>
                {dist.count} {dist.count === 1 ? 'member' : 'members'}
              </Text>
              <View style={[styles.personaCardPercentage, { backgroundColor: theme.primary }]}>
                <Text style={styles.personaCardPercentageText}>{dist.percentage}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Group Persona</Text>
        <TouchableOpacity 
          onPress={handleShare} 
          style={[styles.shareButton, { backgroundColor: theme.primary }]}
          disabled={isSharing}
        >
          <Ionicons name="share-social" size={20} color={theme.background} />
        </TouchableOpacity>
      </View>

      {/* Theme Selector */}
      <View style={styles.themeSelector}>
        <Text style={[styles.themeSelectorTitle, { color: theme.text }]}>Pick Your Vibe</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.themeScroller}
        >
          {COLOR_THEMES.map((colorTheme) => (
            <TouchableOpacity
              key={colorTheme.id}
              onPress={() => setSelectedTheme(colorTheme)}
              style={[
                styles.themeChip,
                selectedTheme.id === colorTheme.id && styles.themeChipSelected,
                { 
                  backgroundColor: colorTheme.cardBg,
                  borderColor: selectedTheme.id === colorTheme.id ? colorTheme.primary : 'transparent'
                }
              ]}
            >
              <View style={styles.themePreview}>
                <View style={[styles.themePreviewDot, { backgroundColor: colorTheme.primary }]} />
                <View style={[styles.themePreviewDot, { backgroundColor: colorTheme.secondary }]} />
                <View style={[styles.themePreviewDot, { backgroundColor: colorTheme.tertiary }]} />
              </View>
              <Text style={[styles.themeChipText, { color: colorTheme.text }]}>
                {colorTheme.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Shareable Content */}
        <View ref={viewRef} style={[styles.shareableContent, { backgroundColor: theme.background }]}>
          {/* Main Persona Card */}
          <View style={[styles.mainPersonaCard, { backgroundColor: theme.cardBg }]}>
            <View style={styles.mainPersonaHeader}>
              <Text style={styles.mainPersonaEmoji}>{groupPersona.dominantPersona.emoji}</Text>
              <View style={styles.mainPersonaInfo}>
                <Text style={[styles.groupNameText, { color: theme.text }]}>{groupName}</Text>
                <Text style={[styles.mainPersonaType, { color: theme.primary }]}>
                  {groupPersona.dominantPersona.type.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
                <Text style={[styles.mainPersonaDescription, { color: theme.secondary }]}>
                  {groupPersona.dominantPersona.description}
                </Text>
              </View>
            </View>
          </View>

          {/* Group Traits */}
          <View style={[styles.traitsSection, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>✨ Group Vibe Check</Text>
            <View style={styles.traitsGrid}>
              {groupPersona.groupTraits.map((trait: string, index: number) => (
                <View 
                  key={index} 
                  style={[styles.traitBubble, { backgroundColor: theme.background, borderColor: theme.primary }]}
                >
                  <Text style={[styles.traitText, { color: theme.text }]}>{trait}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Circular Stats */}
          <View style={styles.circularStatsSection}>
            <View style={styles.circularStatsRow}>
              {renderCircularStat(
                'Total Events',
                groupPersona.groupStats.totalEvents.toString(),
                '🎉',
                theme.primary
              )}
              {renderCircularStat(
                'Total Spent',
                `$${groupPersona.groupStats.totalSpent.toFixed(0)}`,
                '💰',
                theme.secondary
              )}
              {renderCircularStat(
                'Avg Cost',
                `$${groupPersona.groupStats.avgEventCost.toFixed(0)}`,
                '📊',
                theme.tertiary
              )}
            </View>
          </View>

          {/* Stat Bars */}
          <View style={[styles.statBarsSection, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>📈 Group Metrics</Text>
            {renderStatBar(
              'Group Generosity',
              groupPersona.groupStats.groupGenerosity * 100,
              100,
              '❤️'
            )}
            {renderStatBar(
              'Most Active Hour',
              groupPersona.groupStats.mostActiveTime,
              24,
              '⏰'
            )}
            {renderStatBar(
              'Events This Month',
              Math.min(groupPersona.groupStats.totalEvents, 20),
              20,
              '📅'
            )}
          </View>

          {/* Persona Distribution */}
          {renderPersonaDistribution()}

          {/* Footer Branding */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              Created with ✨
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 12,
    borderRadius: 20,
  },
  themeSelector: {
    paddingBottom: 15,
  },
  themeSelectorTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  themeScroller: {
    paddingLeft: 20,
  },
  themeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
  },
  themeChipSelected: {
    borderWidth: 2,
  },
  themePreview: {
    flexDirection: 'row',
    gap: 3,
    marginRight: 8,
  },
  themePreviewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  themeChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  shareableContent: {
    padding: 20,
    gap: 20,
  },
  mainPersonaCard: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainPersonaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  mainPersonaEmoji: {
    fontSize: 64,
  },
  mainPersonaInfo: {
    flex: 1,
  },
  groupNameText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    opacity: 0.8,
  },
  mainPersonaType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  mainPersonaDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  traitsSection: {
    borderRadius: 24,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  traitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  traitBubble: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  traitText: {
    fontSize: 13,
    fontWeight: '500',
  },
  circularStatsSection: {
    paddingVertical: 10,
  },
  circularStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  circularStatContainer: {
    alignItems: 'center',
    flex: 1,
  },
  circularStatCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  circularStatIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  circularStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  circularStatLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  statBarsSection: {
    borderRadius: 24,
    padding: 20,
  },
  statBarContainer: {
    marginBottom: 20,
  },
  statBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statBarLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statBarIcon: {
    fontSize: 16,
  },
  statBarLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statBarValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statBarTrack: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  statBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  personaDistSection: {
    paddingVertical: 10,
  },
  personaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  personaCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
  },
  personaCardEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  personaCardName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
    height: 32,
  },
  personaCardCount: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
  },
  personaCardPercentage: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  personaCardPercentageText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
  },
});