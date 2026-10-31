/**
 * RelationshipManager.js
 * Tracks relationship values, standings, status titles, and shared memories.
 */

import { StoryManager } from './StoryManager.js';

export class RelationshipManager {
  static instance = null;

  static getInstance() {
    if (!RelationshipManager.instance) {
      RelationshipManager.instance = new RelationshipManager();
    }
    return RelationshipManager.instance;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.relationships = {
      basharat: {
        id: 'basharat',
        name: 'Basharat Hussain (Basharat Bhai)',
        portrait: 'portrait_basharat_age_24',
        value: 95,
        status: 'Cherished Mentor & Brother',
        description: 'Maajid’s lifelong teacher, elder brother figure, and closest confidant. Basharat gave Maajid the moral compass and knowledge to rise above violence.',
        events: [
          'Became Maajid’s English & Math tutor at age 15.',
          'Instilled values of patience, discipline, and humility.',
          'Supported Maajid into his adult years as his dearest brotherly friend.'
        ]
      },
      firoz: {
        id: 'firoz',
        name: 'Firoz Ali',
        portrait: 'portrait_firoz_age_20',
        value: 20,
        status: 'Bitter Rivalry / Unspoken Truce',
        description: 'A local bully who carries a permanent knife scar across his back from their childhood dispute, and brutally beat Maajid during Muharram.',
        events: [
          'Violent knife altercation in the mohalla alley (Age 8).',
          'Carried the blade scar on his back for life.',
          'Ambushed Maajid during the Muharram Chhayyam procession.'
        ]
      },
      firoz_brother: {
        id: 'firoz_brother',
        name: 'Tariq Ali (Firoz’s Brother)',
        portrait: 'portrait_firoz_brother_age_18',
        value: 35,
        status: 'Cautious Neutrality',
        description: 'Dragged into Firoz’s vendetta during childhood. Got his ear struck by accident during the Muharram brawl.',
        events: [
          'Assisted Firoz during the childhood ambush.',
          'Accidentally struck on the ear during the melee.'
        ]
      },
      chacha_iqbal: {
        id: 'chacha_iqbal',
        name: 'Chacha Iqbal',
        portrait: 'portrait_chacha_iqbal',
        value: 88,
        status: 'Beloved Mohalla Elder',
        description: 'Venerable patriarch of Machhli Walo Ka Mohalla who has watched over Maajid with gentle wisdom.',
        events: [
          'Praised Maajid’s reformation and dedication to his studies.',
          'Serves as the voice of peace and unity in the locality.'
        ]
      }
    };
  }

  getRelationship(charKey) {
    return this.relationships[charKey] || null;
  }

  getAllRelationships() {
    // Dynamic portrait check based on age
    const age = StoryManager.getInstance().getCurrentAge();
    if (age <= 12) {
      this.relationships.basharat.portrait = 'portrait_basharat_age_15';
    } else {
      this.relationships.basharat.portrait = 'portrait_basharat_age_24';
    }
    return Object.values(this.relationships);
  }

  modifyValue(charKey, delta) {
    if (this.relationships[charKey]) {
      this.relationships[charKey].value = Math.max(0, Math.min(100, this.relationships[charKey].value + delta));
    }
  }

  addEvent(charKey, eventText) {
    if (this.relationships[charKey] && !this.relationships[charKey].events.includes(eventText)) {
      this.relationships[charKey].events.push(eventText);
    }
  }

  exportData() {
    return JSON.parse(JSON.stringify(this.relationships));
  }

  importData(data) {
    if (!data) return;
    this.relationships = JSON.parse(JSON.stringify(data));
  }
}
