import { describe, it, expect, beforeEach } from 'vitest';
import { StoryManager } from '../src/systems/StoryManager.js';
import { StatisticsManager } from '../src/systems/StatisticsManager.js';
import { QuestManager } from '../src/systems/QuestManager.js';
import { InventoryManager } from '../src/systems/InventoryManager.js';
import { SaveManager } from '../src/systems/SaveManager.js';

describe('The Legend Of Maajid — Core Game Systems', () => {
  beforeEach(() => {
    StoryManager.getInstance().reset();
    StatisticsManager.getInstance().reset();
    QuestManager.getInstance().reset();
    InventoryManager.getInstance().reset();
  });

  describe('StoryManager', () => {
    it('initializes at Chapter 1 with 0% completion', () => {
      const story = StoryManager.getInstance();
      expect(story.currentChapterId).toBe(1);
      expect(story.getCurrentAge()).toBe(8);
      expect(story.getStoryCompletionPercentage()).toBe(0);
      expect(story.isChapterUnlocked(1)).toBe(true);
      expect(story.isChapterUnlocked(2)).toBe(false);
    });

    it('unlocks next chapter upon completing a chapter and calculates real percentage', () => {
      const story = StoryManager.getInstance();
      story.completeChapter(1);
      expect(story.isChapterCompleted(1)).toBe(true);
      expect(story.isChapterUnlocked(2)).toBe(true);
      expect(story.getStoryCompletionPercentage()).toBe(20);

      story.completeChapter(2);
      expect(story.getStoryCompletionPercentage()).toBe(40);
    });
  });

  describe('StatisticsManager', () => {
    it('syncs correctly with child age 8 (narrative prologue, no combat grind)', () => {
      const stats = StatisticsManager.getInstance();
      stats.syncWithAge(8);
      expect(stats.level).toBe(1);
      expect(stats.hp).toBe(60);
      expect(stats.attributes.strength).toBe(3);
      expect(stats.attributes.agility).toBe(6);
    });

    it('syncs correctly with age 12 (tuition student)', () => {
      const stats = StatisticsManager.getInstance();
      stats.syncWithAge(12);
      expect(stats.level).toBe(3);
      expect(stats.skills.learning.level).toBe(4);
      expect(stats.attributes.intelligence).toBe(9);
    });

    it('syncs correctly with adult age 21 (RPG exploration)', () => {
      const stats = StatisticsManager.getInstance();
      stats.syncWithAge(21);
      expect(stats.level).toBe(5);
      expect(stats.hp).toBe(120);
      expect(stats.attributes.perception).toBe(15);
      expect(stats.attributes.intelligence).toBe(16);
    });

    it('handles XP addition and leveling up', () => {
      const stats = StatisticsManager.getInstance();
      const initialLevel = stats.level;
      stats.addXP(stats.nextLevelXP);
      expect(stats.level).toBe(initialLevel + 1);
    });
  });

  describe('QuestManager', () => {
    it('manages main quests and tracks active quests', () => {
      const quests = QuestManager.getInstance();
      const active = quests.getActiveMainQuest();
      expect(active).not.toBeNull();
      expect(active.id).toBe('quest_ch5_adult_beginnings');
    });

    it('completes individual quest objectives and checks quest completion', () => {
      const quests = QuestManager.getInstance();
      quests.completeObjective('quest_ch5_adult_beginnings', 'talk_basharat');
      quests.completeObjective('quest_ch5_adult_beginnings', 'greet_chacha');
      quests.completeObjective('quest_ch5_adult_beginnings', 'check_market');

      const quest = quests.quests['quest_ch5_adult_beginnings'];
      expect(quest.status).toBe('completed');
    });
  });

  describe('InventoryManager', () => {
    it('holds key story items initially', () => {
      const inv = InventoryManager.getInstance();
      expect(inv.hasItem('chhayyam_elathalam')).toBe(true);
      expect(inv.hasItem('pocket_knife')).toBe(true);
      expect(inv.hasItem('tuition_notebook')).toBe(true);
      expect(inv.hasItem('prescription_glasses')).toBe(true);
      expect(inv.hasItem('mohalla_map')).toBe(true);
    });

    it('handles adding and removing items with quantity verification', () => {
      const inv = InventoryManager.getInstance();
      inv.addItem('sea_seashell', 2);
      expect(inv.hasItem('sea_seashell')).toBe(false); // only predefined items or valid ones

      inv.addItem('tuition_notebook', 2);
      expect(inv.getItem('tuition_notebook').quantity).toBe(3);

      inv.removeItem('tuition_notebook', 1);
      expect(inv.getItem('tuition_notebook').quantity).toBe(2);
    });
  });

  describe('Settings & Localization System', () => {
    it('persists language and configuration correctly in SaveManager', () => {
      const saveMgr = SaveManager.getInstance();
      const current = saveMgr.loadSettings();

      saveMgr.saveSettings({
        ...current,
        language: 'hinglish',
        textSpeed: 'fast',
        screenShake: false,
        masterVolume: 65
      });

      const updated = saveMgr.loadSettings();
      expect(updated.language).toBe('hinglish');
      expect(updated.textSpeed).toBe('fast');
      expect(updated.screenShake).toBe(false);
      expect(updated.masterVolume).toBe(65);
    });

    it('ensures all story chapters have complete, authentic Hinglish translations', () => {
      const story = StoryManager.getInstance();
      const chapters = story.getAllChapters();
      expect(chapters.length).toBe(5);

      chapters.forEach(ch => {
        expect(ch.title_hinglish).toBeDefined();
        expect(ch.subtitle_hinglish).toBeDefined();
        expect(ch.description_hinglish).toBeDefined();
        expect(ch.dialogues.length).toBeGreaterThan(0);

        ch.dialogues.forEach((d, idx) => {
          expect(d.text_hinglish, `Chapter ${ch.id} dialogue ${idx} missing text_hinglish`).toBeDefined();
          expect(d.text_hinglish.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
