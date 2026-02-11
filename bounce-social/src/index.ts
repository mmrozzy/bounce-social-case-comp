// Types
export type {
  User,
  Group,
  Event,
  Transaction,
  Split,
  EventTransaction,
  SplitTransaction,
  P2PTransaction,
  Persona,
  UserFeatures,
  ProfileResult
} from './types'

// Core functions
export { extractUserFeatures } from './types/feature_extractor'
export { matchPersona, getPersonaDetails } from './types/personaMatcher'
export { analyzeUserProfile } from './utils/profileAnalyzer'
export { analyzeGroupPersona } from './types/groupPersonaAnalyzer'

// Data
export { personas } from '../data/personas'
export { getGroupData } from '../data/groupMockData'

// Components
export { UserPersonaCard } from '../components/UserPersonaCard'
export { PersonaBadge, PersonaChip } from '../components/PersonaBadge'
