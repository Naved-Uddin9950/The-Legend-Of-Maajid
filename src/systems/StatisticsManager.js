/**
 * StatisticsManager.js
 * Tracks core attributes, vital stats, skills, traits, and progression calculations.
 * Data-driven without hardcoded values in Phaser scenes.
 */

import { ATTRIBUTES } from '../data/attributes.js';
import { SKILLS, TRAITS } from '../data/skills.js';
import { StoryManager } from './StoryManager.js';

export class StatisticsManager {
  static instance = null;

  static getInstance() {
    if (!StatisticsManager.instance) {
      StatisticsManager.instance = new StatisticsManager();
    }
    return StatisticsManager.instance;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.level = 1;
    this.xp = 0;
    this.nextLevelXP = 100;
    this.hp = 100;
    this.maxHp = 100;
    this.stamina = 100;
    this.maxStamina = 100;

    // Attributes
    this.attributes = {
      strength: 3,
      agility: 6,
      intelligence: 4,
      perception: 5,
      charisma: 2,
      luck: 4
    };

    // Skills
    this.skills = {};
    Object.keys(SKILLS).forEach(k => {
      this.skills[k] = { level: SKILLS[k].baseLevel, progress: 0 };
    });

    // Traits
    this.traits = {};
    Object.keys(TRAITS).forEach(k => {
      this.traits[k] = TRAITS[k].value;
    });

    this.syncWithAge(StoryManager.getInstance().getCurrentAge());
  }

  syncWithAge(age) {
    if (age <= 8) {
      this.level = 1;
      this.maxHp = 60;
      this.hp = 60;
      this.maxStamina = 60;
      this.stamina = 60;
      this.attributes.strength = ATTRIBUTES.strength.baseAge8;
      this.attributes.agility = ATTRIBUTES.agility.baseAge8;
      this.attributes.intelligence = ATTRIBUTES.intelligence.baseAge8;
      this.attributes.perception = ATTRIBUTES.perception.baseAge8;
      this.attributes.charisma = ATTRIBUTES.charisma.baseAge8;
      this.attributes.luck = ATTRIBUTES.luck.baseAge8;
    } else if (age <= 12) {
      this.level = 3;
      this.maxHp = 90;
      this.hp = 90;
      this.maxStamina = 85;
      this.stamina = 85;
      this.attributes.strength = ATTRIBUTES.strength.baseAge12;
      this.attributes.agility = ATTRIBUTES.agility.baseAge12;
      this.attributes.intelligence = ATTRIBUTES.intelligence.baseAge12;
      this.attributes.perception = ATTRIBUTES.perception.baseAge12;
      this.attributes.charisma = ATTRIBUTES.charisma.baseAge12;
      this.attributes.luck = ATTRIBUTES.luck.baseAge12;

      this.skills.learning.level = 4;
      this.skills.problemSolving.level = 3;
      this.traits.patience = 6;
      this.traits.discipline = 7;
    } else {
      // Adult Age 21
      this.level = 5;
      this.xp = 180;
      this.nextLevelXP = 300;
      this.maxHp = 120;
      this.hp = 120;
      this.maxStamina = 100;
      this.stamina = 100;
      this.attributes.strength = ATTRIBUTES.strength.baseAge21;
      this.attributes.agility = ATTRIBUTES.agility.baseAge21;
      this.attributes.intelligence = ATTRIBUTES.intelligence.baseAge21;
      this.attributes.perception = ATTRIBUTES.perception.baseAge21;
      this.attributes.charisma = ATTRIBUTES.charisma.baseAge21;
      this.attributes.luck = ATTRIBUTES.luck.baseAge21;

      this.skills.communication.level = 5;
      this.skills.observation.level = 6;
      this.skills.learning.level = 7;
      this.skills.problemSolving.level = 6;
      this.skills.physicalFitness.level = 5;

      this.traits.kindness = 8;
      this.traits.confidence = 7;
      this.traits.discipline = 9;
      this.traits.patience = 8;
      this.traits.integrity = 10;
    }
  }

  addXP(amount) {
    this.xp += amount;
    while (this.xp >= this.nextLevelXP) {
      this.xp -= this.nextLevelXP;
      this.level++;
      this.nextLevelXP = Math.round(this.nextLevelXP * 1.5);
      this.maxHp += 15;
      this.hp = this.maxHp;
      this.maxStamina += 10;
      this.stamina = this.maxStamina;
    }
  }

  modifyHP(amount) {
    this.hp = Math.max(0, Math.min(this.maxHp, this.hp + amount));
  }

  modifyStamina(amount) {
    this.stamina = Math.max(0, Math.min(this.maxStamina, this.stamina + amount));
  }

  improveSkill(skillId, progressAmount = 25) {
    if (this.skills[skillId]) {
      this.skills[skillId].progress += progressAmount;
      if (this.skills[skillId].progress >= 100 && this.skills[skillId].level < SKILLS[skillId].maxLevel) {
        this.skills[skillId].progress -= 100;
        this.skills[skillId].level++;
      }
    }
  }

  getAttribute(attrId) {
    return this.attributes[attrId] || 0;
  }

  getAttributesList() {
    return Object.keys(ATTRIBUTES).map(id => ({
      ...ATTRIBUTES[id],
      current: this.attributes[id] || 0
    }));
  }

  getSkillsList() {
    return Object.keys(SKILLS).map(id => ({
      ...SKILLS[id],
      level: this.skills[id]?.level || 1,
      progress: this.skills[id]?.progress || 0
    }));
  }

  getTraitsList() {
    return Object.keys(TRAITS).map(id => ({
      ...TRAITS[id],
      current: this.traits[id] || 5
    }));
  }

  exportData() {
    return {
      level: this.level,
      xp: this.xp,
      nextLevelXP: this.nextLevelXP,
      hp: this.hp,
      maxHp: this.maxHp,
      stamina: this.stamina,
      maxStamina: this.maxStamina,
      attributes: { ...this.attributes },
      skills: JSON.parse(JSON.stringify(this.skills)),
      traits: { ...this.traits }
    };
  }

  importData(data) {
    if (!data) return;
    this.level = data.level || 1;
    this.xp = data.xp || 0;
    this.nextLevelXP = data.nextLevelXP || 100;
    this.hp = data.hp || 100;
    this.maxHp = data.maxHp || 100;
    this.stamina = data.stamina || 100;
    this.maxStamina = data.maxStamina || 100;
    if (data.attributes) this.attributes = { ...data.attributes };
    if (data.skills) this.skills = JSON.parse(JSON.stringify(data.skills));
    if (data.traits) this.traits = { ...data.traits };
  }
}
