/**
 * @fileoverview Main module exports for Bounce Together.
 * Centralized export point for types, core functions, database operations,
 * data, and reusable components. Provides the public API for the application.
 */

export type {
    Event, EventTransaction, Group, P2PTransaction,
    Persona, ProfileResult, Split, SplitTransaction, Transaction, User, UserFeatures
} from './types'

// Core functions
export { extractUserFeatures } from './types/feature_extractor'
export { analyzeGroupPersona } from './types/groupPersonaAnalyzer'
export { getPersonaDetails, matchPersona } from './types/personaMatcher'
export { analyzeUserProfile } from './utils/profileAnalyzer'

// Database functions
export {
    createEvent, createGroup, createTransaction, createUser, getEvents, getGroupById, getGroupData, getGroups, getTransactions, getUserById, getUsers
} from './services/database'

// Data
export { personas } from './__mocks__/personas'

// Components
export { UserPersonaCard } from './components/features/UserPersonaCard'
export { PersonaBadge, PersonaChip } from './components/ui/PersonaBadge'

