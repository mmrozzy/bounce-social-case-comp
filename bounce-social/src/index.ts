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

// Data
export { personas } from '../data/personas'

// Components
export { UserPersonaCard } from '../components/UserPersonaCard'
export { PersonaBadge, PersonaChip } from '../components/PersonaBadge'
