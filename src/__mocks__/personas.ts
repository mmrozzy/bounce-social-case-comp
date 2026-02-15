/**
 * @fileoverview Predefined persona definitions for the matching algorithm.
 * Contains the 12 personality personas with their characteristic behavioral patterns.
 * Each persona has a unique combination of group size, socialness, budget level,
 * generosity, payment speed, activity level, and time preferences.
 */

import { Persona } from '../src/types'

export const personas: Record<string, Persona> = {
  // 🎯 THE MOM FRIEND
  momFriend: {
    groupSize: 'medium',
    socialness: 'ambivert',
    budgetLevel: 'moderate',
    generosity: 'high',
    paymentSpeed: 'fast',
    activityLevel: 'medium',
    timePreference: 'afternoon'
  },

  // 🎉 THE PARTY ANIMAL
  partyAnimal: {
    groupSize: 'large',
    socialness: 'extrovert',
    budgetLevel: 'moderate',
    generosity: 'medium',
    paymentSpeed: 'slow',
    activityLevel: 'high',
    timePreference: 'night'
  },

  // 🍜 THE FOODIE EXPLORER
  foodieExplorer: {
    groupSize: 'small',
    socialness: 'ambivert',
    budgetLevel: 'premium',
    generosity: 'high',
    paymentSpeed: 'medium',
    activityLevel: 'medium',
    timePreference: 'evening'
  },

  // 💸 THE BUDGET HAWK
  budgetHawk: {
    groupSize: 'small',
    socialness: 'introvert',
    budgetLevel: 'budget',
    generosity: 'low',
    paymentSpeed: 'fast',
    activityLevel: 'low',
    timePreference: 'afternoon'
  },

  // 👻 THE GHOST
  ghost: {
    groupSize: 'small',
    socialness: 'introvert',
    budgetLevel: 'moderate',
    generosity: 'low',
    paymentSpeed: 'slow',
    activityLevel: 'low',
    timePreference: 'evening'
  },

  // 🌟 THE HYPE PERSON
  hypePerson: {
    groupSize: 'large',
    socialness: 'extrovert',
    budgetLevel: 'moderate',
    generosity: 'high',
    paymentSpeed: 'fast',
    activityLevel: 'high',
    timePreference: 'evening'
  },

  // 📅 THE PLANNER
  planner: {
    groupSize: 'medium',
    socialness: 'ambivert',
    budgetLevel: 'moderate',
    generosity: 'medium',
    paymentSpeed: 'fast',
    activityLevel: 'medium',
    timePreference: 'afternoon'
  },

  // 🎲 THE WILD CARD
  wildCard: {
    groupSize: 'medium',
    socialness: 'extrovert',
    budgetLevel: 'premium',
    generosity: 'high',
    paymentSpeed: 'medium',
    activityLevel: 'high',
    timePreference: 'afternoon'
  },

  // 🏠 THE HOMETOWN HERO
  hometownHero: {
    groupSize: 'small',
    socialness: 'ambivert',
    budgetLevel: 'moderate',
    generosity: 'medium',
    paymentSpeed: 'medium',
    activityLevel: 'low',
    timePreference: 'evening'
  },

  // ☕ THE EARLY BIRD
  earlyBird: {
    groupSize: 'small',
    socialness: 'ambivert',
    budgetLevel: 'moderate',
    generosity: 'medium',
    paymentSpeed: 'fast',
    activityLevel: 'medium',
    timePreference: 'morning'
  },

  // 🦉 THE NIGHT OWL
  nightOwl: {
    groupSize: 'medium',
    socialness: 'extrovert',
    budgetLevel: 'moderate',
    generosity: 'medium',
    paymentSpeed: 'medium',
    activityLevel: 'medium',
    timePreference: 'night'
  },

  // 💰 THE GENEROUS WHALE
  generousWhale: {
    groupSize: 'medium',
    socialness: 'ambivert',
    budgetLevel: 'premium',
    generosity: 'high',
    paymentSpeed: 'fast',
    activityLevel: 'medium',
    timePreference: 'evening'
  }
}
