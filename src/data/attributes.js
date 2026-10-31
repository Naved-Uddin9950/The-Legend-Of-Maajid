/**
 * attributes.js
 * Core RPG Attributes for Maajid across his growth stages.
 */

export const ATTRIBUTES = {
  strength: {
    id: 'strength',
    name: 'Strength',
    icon: '💪',
    description: 'Physical prowess, lifting capacity, and force in physical interactions.',
    baseAge8: 3,
    baseAge12: 5,
    baseAge21: 12,
    max: 20
  },
  agility: {
    id: 'agility',
    name: 'Agility',
    icon: '⚡',
    description: 'Reflexes, quick footwork, dodging ability, and hand-eye coordination.',
    baseAge8: 6,
    baseAge12: 8,
    baseAge21: 14,
    max: 20
  },
  intelligence: {
    id: 'intelligence',
    name: 'Intelligence',
    icon: '🧠',
    description: 'Analytical capacity, English & Mathematics comprehension, and memory.',
    baseAge8: 4,
    baseAge12: 9,
    baseAge21: 16,
    max: 20
  },
  perception: {
    id: 'perception',
    name: 'Perception',
    icon: '👁️',
    description: 'Awareness of surroundings, reading human intentions, and attention to detail. Enhanced by prescription glasses.',
    baseAge8: 5,
    baseAge12: 7,
    baseAge21: 15,
    max: 20
  },
  charisma: {
    id: 'charisma',
    name: 'Charisma',
    icon: '✨',
    description: 'Eloquence, respect commanded among mohalla folk, and persuasive speech.',
    baseAge8: 2,
    baseAge12: 6,
    baseAge21: 14,
    max: 20
  },
  luck: {
    id: 'luck',
    name: 'Luck',
    icon: '🎲',
    description: 'Fortunate turns of fate, unexpected discoveries, and serendipity.',
    baseAge8: 4,
    baseAge12: 6,
    baseAge21: 10,
    max: 20
  }
};
