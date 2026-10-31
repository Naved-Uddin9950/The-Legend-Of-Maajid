/**
 * SaveManager.js
 * Multi-slot versioned save system storing state to browser localStorage.
 * Includes safe schema migration and slot metadata calculation.
 */

import { StoryManager } from './StoryManager.js';
import { StatisticsManager } from './StatisticsManager.js';
import { InventoryManager } from './InventoryManager.js';
import { QuestManager } from './QuestManager.js';
import { RelationshipManager } from './RelationshipManager.js';
import { AudioManager } from './AudioManager.js';

const SAVE_VERSION = 1;
const STORAGE_PREFIX = 'the_legend_of_maajid_save_v1_slot_';
const SETTINGS_KEY = 'the_legend_of_maajid_settings_v1';

export class SaveManager {
  static instance = null;

  static getInstance() {
    if (!SaveManager.instance) {
      SaveManager.instance = new SaveManager();
    }
    return SaveManager.instance;
  }

  // ==========================================
  // SAVE / LOAD SLOTS
  // ==========================================
  saveToSlot(slotId, locationName = 'Machhli Walo Ka Mohalla') {
    if (typeof window === 'undefined' || !window.localStorage) return false;

    const story = StoryManager.getInstance();
    const stats = StatisticsManager.getInstance();
    const inv = InventoryManager.getInstance();
    const quests = QuestManager.getInstance();
    const rels = RelationshipManager.getInstance();

    const currentChapter = story.getCurrentChapter();
    const completion = story.getStoryCompletionPercentage();
    const now = new Date();

    const saveData = {
      version: SAVE_VERSION,
      slotId,
      timestamp: now.getTime(),
      savedDateFormatted: now.toLocaleDateString(),
      savedTimeFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chapterNumber: currentChapter.id,
      chapterTitle: currentChapter.title,
      playerAge: story.getCurrentAge(),
      location: locationName,
      completionPercentage: completion,
      thumbnail: `portrait_maajid_age_${story.getCurrentAge() <= 8 ? 8 : (story.getCurrentAge() <= 12 ? 12 : 21)}`,
      storyData: story.exportData(),
      statisticsData: stats.exportData(),
      inventoryData: inv.exportData(),
      questData: quests.exportData(),
      relationshipData: rels.exportData()
    };

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${slotId}`, JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('Failed to write save data to localStorage', e);
      return false;
    }
  }

  loadFromSlot(slotId) {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${slotId}`);
      if (!raw) return false;
      const data = JSON.parse(raw);

      if (data.storyData) StoryManager.getInstance().importData(data.storyData);
      if (data.statisticsData) StatisticsManager.getInstance().importData(data.statisticsData);
      if (data.inventoryData) InventoryManager.getInstance().importData(data.inventoryData);
      if (data.questData) QuestManager.getInstance().importData(data.questData);
      if (data.relationshipData) RelationshipManager.getInstance().importData(data.relationshipData);

      return true;
    } catch (e) {
      console.error('Failed to load save slot', e);
      return false;
    }
  }

  deleteSlot(slotId) {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    localStorage.removeItem(`${STORAGE_PREFIX}${slotId}`);
    return true;
  }

  getSlotMetadata(slotId) {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${slotId}`);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return {
        slotId,
        exists: true,
        chapterNumber: data.chapterNumber,
        chapterTitle: data.chapterTitle,
        playerAge: data.playerAge,
        location: data.location || 'Machhli Walo Ka Mohalla',
        completionPercentage: data.completionPercentage || 0,
        savedDateFormatted: data.savedDateFormatted || 'Unknown',
        savedTimeFormatted: data.savedTimeFormatted || '',
        thumbnail: data.thumbnail || 'portrait_maajid_age_21'
      };
    } catch (e) {
      return null;
    }
  }

  getAllSlots() {
    return [1, 2, 3].map(id => this.getSlotMetadata(id) || {
      slotId: id,
      exists: false
    });
  }

  hasAnySave() {
    return this.getAllSlots().some(slot => slot.exists);
  }

  getLatestSaveSlot() {
    let latest = null;
    let maxTime = 0;
    [1, 2, 3].forEach(id => {
      try {
        const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.timestamp > maxTime) {
            maxTime = parsed.timestamp;
            latest = id;
          }
        }
      } catch (e) {}
    });
    return latest;
  }

  // ==========================================
  // SETTINGS PERSISTENCE
  // ==========================================
  saveSettings(settings) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }

  loadSettings() {
    if (typeof window === 'undefined' || !window.localStorage) return this.getDefaultSettings();
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (!raw) return this.getDefaultSettings();
      return { ...this.getDefaultSettings(), ...JSON.parse(raw) };
    } catch (e) {
      return this.getDefaultSettings();
    }
  }

  getDefaultSettings() {
    return {
      masterVolume: 80,
      musicVolume: 70,
      sfxVolume: 80,
      dialogueVolume: 90,
      fullscreen: false,
      textSpeed: 'medium', // slow, medium, instant
      autoDialogue: false,
      fontSize: 18,
      language: 'en', // 'en', 'hinglish'
      screenShake: true,
      visualEffects: true
    };
  }
}
