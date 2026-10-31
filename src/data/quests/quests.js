/**
 * quests.js
 * Data-driven quest definitions for story chapters and RPG exploration.
 */

export const QUESTS = {
  // Main Quests
  quest_ch1_confrontation: {
    id: 'quest_ch1_confrontation',
    category: 'main',
    title: 'The Little Maajid',
    chapter: 1,
    description: 'Face the growing tension in Machhli Walo Ka Mohalla as Firoz threatens you.',
    status: 'completed', // Completed as prologue advances
    objectives: [
      { text: 'Survive the dispute with Firoz in the mohalla alley', completed: true },
      { text: 'Defend yourself during the violent struggle', completed: true }
    ],
    rewards: { trait: 'Toughness +1', item: 'pocket_knife' }
  },
  quest_ch2_muharram: {
    id: 'quest_ch2_muharram',
    category: 'main',
    title: 'Echoes of Elathalam',
    chapter: 2,
    description: 'Participate in the Muharram observance with your Chhayyam (Elathalam).',
    status: 'completed',
    objectives: [
      { text: 'Play the Chhayyam during the procession', completed: true },
      { text: 'Confront Firoz and his brother when cornered', completed: true },
      { text: 'Endure the harsh consequences of combat', completed: true }
    ],
    rewards: { item: 'chhayyam_elathalam', insight: 'The pain of revenge' }
  },
  quest_ch3_change: {
    id: 'quest_ch3_change',
    category: 'main',
    title: 'A Change of Heart',
    chapter: 3,
    description: 'Reflect upon the rooftop terrace under the stars.',
    status: 'completed',
    objectives: [
      { text: 'Contemplate your path and choices', completed: true },
      { text: 'Choose to abandon violence forever', completed: true }
    ],
    rewards: { trait: 'Patience +2, Integrity +2' }
  },
  quest_ch4_tuition: {
    id: 'quest_ch4_tuition',
    category: 'main',
    title: 'Basharat Bhai',
    chapter: 4,
    description: 'Cross the street to attend tuition with 15-year-old Basharat.',
    status: 'completed',
    objectives: [
      { text: 'Attend English & Math tuition with Basharat Bhai', completed: true },
      { text: 'Solve algebra problems on the study board', completed: true },
      { text: 'Build a lifelong bond of mutual respect', completed: true }
    ],
    rewards: { skill: 'Learning +3, Problem Solving +2', item: 'tuition_notebook' }
  },
  quest_ch5_adult_beginnings: {
    id: 'quest_ch5_adult_beginnings',
    category: 'main',
    title: 'Reunion at Machhli Mohalla',
    chapter: 5,
    description: 'Maajid is now 21. Reconnect with Basharat Bhai outside his house and check in on the neighbourhood.',
    status: 'active',
    objectives: [
      { id: 'talk_basharat', text: 'Talk to Basharat Bhai outside Basharat Manzil', completed: false },
      { id: 'greet_chacha', text: 'Seek the blessings of Chacha Iqbal near the Community Hall', completed: false },
      { id: 'check_market', text: 'Inspect the Machhli Bazaar entrance for fresh morning catch', completed: false }
    ],
    rewards: { xp: 150, trait: 'Charisma +1' }
  },

  // Side Quests
  quest_side_glasses: {
    id: 'quest_side_glasses',
    category: 'side',
    title: 'Clarity of Sight',
    chapter: 5,
    description: 'Ensure Maajid’s prescription lenses are fitted properly and inspect the mohalla landmarks.',
    status: 'active',
    objectives: [
      { id: 'view_landmarks', text: 'Examine the Mohalla Community Noticeboard', completed: false }
    ],
    rewards: { xp: 50, item: 'prescription_glasses' }
  }
};
