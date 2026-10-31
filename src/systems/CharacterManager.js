/**
 * CharacterManager.js
 * Manages character profiles, age variants, and continuity.
 */

import { CHARACTERS } from '../data/characters.js';
import { StoryManager } from './StoryManager.js';

export class CharacterManager {
  static instance = null;

  static getInstance() {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager();
    }
    return CharacterManager.instance;
  }

  getCharacter(characterId) {
    return CHARACTERS[characterId] || null;
  }

  getPlayerProfile() {
    const age = StoryManager.getInstance().getCurrentAge();
    if (age === 8) {
      const storyFlags = StoryManager.getInstance().storyFlags;
      if (storyFlags.muharramFinished && !storyFlags.vowedChange) {
        return CHARACTERS.maajid_age_8_injured;
      }
      return CHARACTERS.maajid_age_8;
    } else if (age === 12) {
      return CHARACTERS.maajid_age_12;
    } else {
      return CHARACTERS.maajid_age_21;
    }
  }

  getBasharatProfile() {
    const age = StoryManager.getInstance().getCurrentAge();
    if (age <= 12) {
      return CHARACTERS.basharat_age_15;
    }
    return CHARACTERS.basharat_age_24;
  }

  getFirozProfile() {
    return CHARACTERS.firoz_age_20;
  }
}
