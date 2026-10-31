/**
 * StoryManager.js
 * Central state coordinator for story progression, chapters, and milestones.
 */

import { STORY_CHAPTERS } from '../data/story/chapters.js';

export class StoryManager {
  static instance = null;

  static getInstance() {
    if (!StoryManager.instance) {
      StoryManager.instance = new StoryManager();
    }
    return StoryManager.instance;
  }

  constructor() {
    this.currentChapterId = 1;
    this.completedChapters = [];
    this.unlockedChapters = [1];
    this.storyFlags = {
      firozScarred: false,
      muharramFinished: false,
      vowedChange: false,
      attendedTuition: false,
      becameAdult: false
    };
  }

  getCurrentChapter() {
    return STORY_CHAPTERS.find(c => c.id === this.currentChapterId) || STORY_CHAPTERS[0];
  }

  getChapterById(id) {
    return STORY_CHAPTERS.find(c => c.id === id);
  }

  getAllChapters() {
    return STORY_CHAPTERS;
  }

  getCurrentAge() {
    const ch = this.getCurrentChapter();
    return ch ? ch.age : 21;
  }

  isChapterUnlocked(chapterId) {
    return this.unlockedChapters.includes(chapterId);
  }

  isChapterCompleted(chapterId) {
    return this.completedChapters.includes(chapterId);
  }

  completeChapter(chapterId) {
    if (!this.completedChapters.includes(chapterId)) {
      this.completedChapters.push(chapterId);
    }
    const nextChapter = chapterId + 1;
    if (nextChapter <= STORY_CHAPTERS.length && !this.unlockedChapters.includes(nextChapter)) {
      this.unlockedChapters.push(nextChapter);
    }

    if (chapterId === 1) this.storyFlags.firozScarred = true;
    if (chapterId === 2) this.storyFlags.muharramFinished = true;
    if (chapterId === 3) this.storyFlags.vowedChange = true;
    if (chapterId === 4) this.storyFlags.attendedTuition = true;
    if (chapterId === 5) this.storyFlags.becameAdult = true;
  }

  setChapter(chapterId) {
    this.currentChapterId = chapterId;
  }

  getStoryCompletionPercentage() {
    const total = STORY_CHAPTERS.length;
    const completed = this.completedChapters.length;
    return Math.round((completed / total) * 100);
  }

  exportData() {
    return {
      currentChapterId: this.currentChapterId,
      completedChapters: [...this.completedChapters],
      unlockedChapters: [...this.unlockedChapters],
      storyFlags: { ...this.storyFlags }
    };
  }

  importData(data) {
    if (!data) return;
    this.currentChapterId = data.currentChapterId || 1;
    this.completedChapters = Array.isArray(data.completedChapters) ? data.completedChapters : [];
    this.unlockedChapters = Array.isArray(data.unlockedChapters) ? data.unlockedChapters : [1];
    this.storyFlags = { ...this.storyFlags, ...(data.storyFlags || {}) };
  }

  reset() {
    this.currentChapterId = 1;
    this.completedChapters = [];
    this.unlockedChapters = [1];
    this.storyFlags = {
      firozScarred: false,
      muharramFinished: false,
      vowedChange: false,
      attendedTuition: false,
      becameAdult: false
    };
  }
}
