/**
 * @fileoverview Group persona modal wrapper component.
 * Coordinates between the in-app group persona view and shareable export view.
 * Manages theme selection and navigation flow.
 */

import { useState } from 'react';
import { Modal } from 'react-native';
import GroupWrappedAppView from './GroupPersonaAppView';
import ShareableWrapped from './ShareablePersona';

// ThemeType must match what's in both component files
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

interface PersonaWrapperProps {
  groupPersona: any;
  groupName: string;
  onClose: () => void;
}

export default function PersonaWrapper({ 
  groupPersona, 
  groupName, 
  onClose 
}: PersonaWrapperProps) {
  const [showShareView, setShowShareView] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeType | null>(null);

  return (
    <>
      <GroupWrappedAppView
        groupPersona={groupPersona}
        groupName={groupName}
        onClose={onClose}
        onShare={(theme) => {
          setSelectedTheme(theme);
          setShowShareView(true);
        }}
      />

      {showShareView && selectedTheme && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <ShareableWrapped
            groupPersona={groupPersona}
            groupName={groupName}
            selectedTheme={selectedTheme}
            onBack={() => setShowShareView(false)}
          />
        </Modal>
      )}
    </>
  );
}