import { Modal } from 'react-native';
import { useState } from 'react';
import ViralBentoPersona from './GroupPersonaAppView';
import ShareableStoryView from './ShareablePersona';

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
  const [selectedTheme, setSelectedTheme] = useState({
    primary: '#C3F73A',
    secondary: '#FF006E',
    tertiary: '#8338EC',
    quaternary: '#3A86FF',
    gradient: ['#C3F73A', '#FF006E'],
  });

  return (
    <>
      <ViralBentoPersona
        groupPersona={groupPersona}
        groupName={groupName}
        onClose={onClose}
        onShare={() => setShowShareView(true)}
      />

      {showShareView && (
        <Modal
          visible={true}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <ShareableStoryView
            groupPersona={groupPersona}
            groupName={groupName}
            theme={selectedTheme}
            onClose={() => setShowShareView(false)}
          />
        </Modal>
      )}
    </>
  );
}