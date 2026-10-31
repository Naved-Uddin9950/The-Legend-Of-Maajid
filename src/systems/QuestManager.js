/**
 * QuestManager.js
 * Tracks active, completed, and side quests, objectives, and notifications.
 */

import { QUESTS } from '../data/quests/quests.js';

export class QuestManager {
  static instance = null;

  static getInstance() {
    if (!QuestManager.instance) {
      QuestManager.instance = new QuestManager();
    }
    return QuestManager.instance;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.quests = JSON.parse(JSON.stringify(QUESTS));
    this.listeners = [];
  }

  onQuestEvent(callback) {
    this.listeners.push(callback);
  }

  notify(event, quest, extra = '') {
    this.listeners.forEach(fn => fn(event, quest, extra));
  }

  getActiveMainQuest() {
    return Object.values(this.quests).find(q => q.category === 'main' && q.status === 'active') || null;
  }

  getMainQuests() {
    return Object.values(this.quests).filter(q => q.category === 'main');
  }

  getSideQuests() {
    return Object.values(this.quests).filter(q => q.category === 'side');
  }

  getCompletedQuests() {
    return Object.values(this.quests).filter(q => q.status === 'completed');
  }

  completeObjective(questId, objectiveId) {
    const quest = this.quests[questId];
    if (!quest) return;
    const obj = quest.objectives.find(o => o.id === objectiveId || o.text === objectiveId);
    if (obj && !obj.completed) {
      obj.completed = true;
      this.notify('objective_completed', quest, obj.text);

      // Check if all objectives in quest are done
      const allDone = quest.objectives.every(o => o.completed);
      if (allDone) {
        quest.status = 'completed';
        this.notify('quest_completed', quest);
      }
    }
  }

  startQuest(questId) {
    const quest = this.quests[questId];
    if (quest && quest.status !== 'completed') {
      quest.status = 'active';
      this.notify('quest_started', quest);
    }
  }

  exportData() {
    return JSON.parse(JSON.stringify(this.quests));
  }

  importData(data) {
    if (!data) return;
    this.quests = JSON.parse(JSON.stringify(data));
  }
}
