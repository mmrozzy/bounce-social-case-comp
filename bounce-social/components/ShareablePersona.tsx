import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';

interface ShareableStoryViewProps {
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

export default function ShareableStoryView({ 
  groupPersona, 
  groupName,
  theme,
  onClose 
}: ShareableStoryViewProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareFormat, setShareFormat] = useState<'story' | 'post' | 'square'>('story');
  const shareableRef = useRef<View>(null);

  const formats = {
    story: { width: 360, height: 640, name: 'Story (9:16)' },
    post: { width: 360, height: 450, name: 'Post (4:5)' },
    square: { width: 360, height: 360, name: 'Square (1:1)' },
  };

  const currentFormat = formats[shareFormat];

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!shareableRef.current) {
        throw new Error('Reference not found');
      }

      const uri = await captureRef(shareableRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: `${groupName} Group Persona`,
          UTI: 'public.png',
        });
      } else {
        Alert.alert('Sharing not available', 'Please save the image manually');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Failed to share. Please try again.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={onClose} style={styles.controlBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {/* Format Selector */}
        <View style={styles.formatSelector}>
          {(Object.keys(formats) as Array<keyof typeof formats>).map((format) => (
            <TouchableOpacity
              key={format}
              onPress={() => setShareFormat(format)}
              style={[
                styles.formatBtn,
                shareFormat === format && { backgroundColor: theme.primary }
              ]}
            >
              <Text style={[
                styles.formatBtnText,
                shareFormat === format && { color: '#000' }
              ]}>
                {formats[format].name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          onPress={handleShare}
          style={[styles.shareButton, { backgroundColor: theme.primary }]}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Ionicons name="share-social" size={24} color="#000" />
          )}
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <View style={styles.previewContainer}>
        <View 
          ref={shareableRef}
          style={[
            styles.canvas,
            {
              width: currentFormat.width,
              height: currentFormat.height,
              backgroundColor: '#000',
            }
          ]}
          collapsable={false}
        >
          {/* Background Gradient */}
          <LinearGradient
            colors={[`${theme.gradient[0]}15`, `${theme.gradient[1]}05`]}
            style={styles.bgGradient}
          />

          {/* Decorative Elements */}
          <View style={[styles.topDecor, { backgroundColor: theme.primary }]} />
          <View style={[styles.bottomDecor, { backgroundColor: theme.secondary }]} />

          {/* Content */}
          <View style={styles.storyContent}>
            {/* Header */}
            <View style={styles.storyHeader}>
              <View style={styles.headerTop}>
                <Text style={styles.groupName}>{groupName}</Text>
                <View style={styles.brandBadge}>
                  <Text style={styles.brandText}>✨ Persona</Text>
                </View>
              </View>
              
              <View style={styles.mainPersona}>
                <Text style={styles.mainEmoji}>{groupPersona.dominantPersona.emoji}</Text>
                <Text style={[styles.mainType, { color: theme.primary }]}>
                  {groupPersona.dominantPersona.type.replace(/([A-Z])/g, ' $1').trim()}
                </Text>
              </View>
            </View>

            {/* Key Stats - Compact Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statRow}>
                <View style={[styles.statBox, { borderColor: theme.primary }]}>
                  <Text style={styles.statEmoji}>🎉</Text>
                  <Text style={[styles.statValue, { color: theme.primary }]}>
                    {groupPersona.groupStats.totalEvents}
                  </Text>
                  <Text style={styles.statLabel}>Events</Text>
                </View>
                
                <View style={[styles.statBox, { borderColor: theme.secondary }]}>
                  <Text style={styles.statEmoji}>💰</Text>
                  <Text style={[styles.statValue, { color: theme.secondary }]}>
                    ${Math.round(groupPersona.groupStats.totalSpent)}
                  </Text>
                  <Text style={styles.statLabel}>Spent</Text>
                </View>
              </View>

              <View style={styles.statRow}>
                <View style={[styles.statBox, { borderColor: theme.tertiary }]}>
                  <Text style={styles.statEmoji}>📊</Text>
                  <Text style={[styles.statValue, { color: theme.tertiary }]}>
                    ${Math.round(groupPersona.groupStats.avgEventCost)}
                  </Text>
                  <Text style={styles.statLabel}>Avg Cost</Text>
                </View>
                
                <View style={[styles.statBox, { borderColor: theme.quaternary }]}>
                  <Text style={styles.statEmoji}>❤️</Text>
                  <Text style={[styles.statValue, { color: theme.quaternary }]}>
                    {Math.round(groupPersona.groupStats.groupGenerosity * 100)}%
                  </Text>
                  <Text style={styles.statLabel}>Generous</Text>
                </View>
              </View>
            </View>

            {/* Top 3 Traits */}
            <View style={styles.traitsSection}>
              <Text style={styles.traitsTitle}>Top Vibes</Text>
              <View style={styles.traitsContainer}>
                {groupPersona.groupTraits.slice(0, 3).map((trait: string, idx: number) => (
                  <View 
                    key={idx}
                    style={[styles.traitPill, { 
                      backgroundColor: `${theme.primary}20`,
                      borderColor: theme.primary 
                    }]}
                  >
                    <Text style={[styles.traitText, { color: theme.primary }]}>
                      {trait}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Member Distribution - Compact */}
            {shareFormat === 'story' && (
              <View style={styles.membersSection}>
                <Text style={styles.membersTitle}>Member Breakdown</Text>
                <View style={styles.membersRow}>
                  {groupPersona.personaDistribution.slice(0, 3).map((dist: any, idx: number) => {
                    const colors = [theme.primary, theme.secondary, theme.tertiary];
                    const color = colors[idx];
                    
                    return (
                      <View key={idx} style={styles.memberItem}>
                        <Text style={styles.memberEmoji}>{dist.emoji}</Text>
                        <Text style={[styles.memberPercent, { color }]}>
                          {dist.percentage}%
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Footer Quote */}
            <View style={styles.footer}>
              <View style={[styles.divider, { backgroundColor: theme.primary }]} />
              <Text style={styles.quote}>
                "{groupPersona.dominantPersona.description}"
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.hint}>
        👆 Pick format above • Tap share when ready
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    gap: 12,
  },
  controlBtn: {
    padding: 10,
  },
  formatSelector: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
  },
  formatBtnText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  shareButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  canvas: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#C3F73A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 30,
    elevation: 15,
  },
  bgGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topDecor: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 120,
    height: 120,
    borderBottomLeftRadius: 60,
    opacity: 0.1,
  },
  bottomDecor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 100,
    height: 100,
    borderTopRightRadius: 50,
    opacity: 0.1,
  },
  storyContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  storyHeader: {
    gap: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  brandBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff10',
  },
  brandText: {
    fontSize: 10,
    color: '#999',
  },
  mainPersona: {
    alignItems: 'center',
    gap: 10,
  },
  mainEmoji: {
    fontSize: 64,
  },
  mainType: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsGrid: {
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff05',
    borderWidth: 2,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 9,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  traitsSection: {
    gap: 12,
  },
  traitsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  traitsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  traitPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  traitText: {
    fontSize: 11,
    fontWeight: '600',
  },
  membersSection: {
    gap: 10,
  },
  membersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  memberItem: {
    alignItems: 'center',
    gap: 6,
  },
  memberEmoji: {
    fontSize: 32,
  },
  memberPercent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    gap: 12,
    alignItems: 'center',
  },
  divider: {
    width: 50,
    height: 3,
    borderRadius: 2,
  },
  quote: {
    fontSize: 12,
    color: '#ccc',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  hint: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    paddingVertical: 20,
  },
});