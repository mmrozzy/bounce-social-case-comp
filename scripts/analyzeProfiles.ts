import { analyzeUserProfile } from '../src/utils/profileAnalyzer'
import { extractUserFeatures } from '../src/types/feature_extractor'
import { matchPersona } from '../src/types/personaMatcher'
import { sampleUsers, sampleGroups, sampleEvents, sampleTransactions } from '../src/__mocks__/sampleData'

console.log('🎭 Bounce Bolt Persona Analysis Demo\n')
console.log('='.repeat(70))

sampleUsers.forEach(user => {
  console.log(`\n👤 ${user.name} (${user.id})`)
  console.log('-'.repeat(70))
  
  // Extract features
  const persona = extractUserFeatures(
    user.id,
    sampleTransactions,
    sampleEvents,
    sampleGroups
  )
  
  // Get match
  const match = matchPersona(persona)
  
  // Get full profile
  const profile = analyzeUserProfile(
    user.id,
    sampleTransactions,
    sampleEvents,
    sampleGroups
  )
  
  // Display results
  console.log(`\n${profile.emoji} ${profile.description}`)
  console.log(`Match Confidence: ${Math.round(match.similarity * 100)}%`)
  
  console.log(`\n✨ Personality Traits:`)
  profile.traits.forEach(trait => console.log(`   • ${trait}`))
  
  console.log(`\n📊 Activity Stats:`)
  console.log(`   Events Attended: ${profile.stats.eventsAttended}`)
  console.log(`   Total Spent: $${profile.stats.totalSpent.toFixed(2)}`)
  console.log(`   Average per Event: $${profile.stats.avgEventCost.toFixed(2)}`)
  
  console.log(`\n🔍 Behavioral Features:`)
  console.log(`   Preferred Group Size: ${profile.stats.features.avgGroupSize} people (${persona.groupSize})`)
  console.log(`   Social Style: ${persona.socialness}`)
  console.log(`   Budget Level: ${persona.budgetLevel} ($${profile.stats.features.avgTransactionAmount.toFixed(2)} avg)`)
  console.log(`   Generosity: ${persona.generosity} (${(profile.stats.features.generosityScore * 100).toFixed(0)}% pays for others)`)
  console.log(`   Payment Speed: ${persona.paymentSpeed} (~${profile.stats.features.avgSettlementHours}h to settle)`)
  console.log(`   Activity Level: ${persona.activityLevel} (${profile.stats.features.eventsPerMonth.toFixed(1)} events/month)`)
  console.log(`   Time Preference: ${persona.timePreference} (most active ~${profile.stats.features.mostActiveHour}:00)`)
  
  console.log(`\n📈 Top 3 Persona Matches:`)
  match.matches.forEach((m, idx) => {
    console.log(`   ${idx + 1}. ${m.key}: ${Math.round(m.similarity * 100)}% match`)
  })
})

console.log('\n' + '='.repeat(70))
console.log('\n✅ Analysis Complete!\n')
console.log('💡 Tips:')
console.log('   • Import analyzeUserProfile() to get a user\'s full profile')
console.log('   • Use extractUserFeatures() for raw persona data')
console.log('   • Call matchPersona() to find the best matching persona type')
console.log('   • See PERSONA_SYSTEM.md for full documentation\n')
