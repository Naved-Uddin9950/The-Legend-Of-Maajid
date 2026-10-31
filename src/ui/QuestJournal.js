/**
 * QuestJournal.js
 * Comprehensive quest log displaying Main, Side, and Completed quests with objective checklists and rewards.
 */

import { QuestManager } from '../systems/QuestManager.js';
import { UIManager } from '../systems/UIManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class QuestJournal {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.activeCategory = 'main'; // 'main' | 'side' | 'completed'
    this.selectedQuestId = null;

    this.createElements();
    this.hide();
  }

  createElements() {
    // Dim backdrop
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.88);
    bg.fillRect(0, 0, 1280, 720);
    this.container.add(bg);

    // Modal frame (1040 x 600)
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(120, 60, 1040, 600, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(120, 60, 1040, 600, 16);
    this.container.add(panel);

    // Header Title
    const title = this.scene.add.text(160, 85, 'QUEST JOURNAL', {
      fontFamily: "'Cinzel', serif",
      fontSize: '22px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 2
    });
    this.container.add(title);

    // Close button
    const closeBtn = this.scene.add.text(1125, 80, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => UIManager.getInstance().closeCurrentModal());
    this.container.add(closeBtn);

    // Category Tabs: Main Quests, Side Quests, Completed Quests
    const categories = [
      { id: 'main', label: 'Main Quests' },
      { id: 'side', label: 'Side Quests' },
      { id: 'completed', label: 'Completed' }
    ];

    let catX = 160;
    this.catButtons = [];
    categories.forEach(cat => {
      const btn = this.scene.add.container(catX, 130);

      const bBg = this.scene.add.graphics();
      bBg.fillStyle(0x1e293b, 1);
      bBg.fillRoundedRect(0, 0, 140, 34, 6);
      bBg.lineStyle(1.5, 0x475569, 0.8);
      bBg.strokeRoundedRect(0, 0, 140, 34, 6);
      btn.add(bBg);

      const bText = this.scene.add.text(70, 17, cat.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.add(bText);

      btn.setSize(140, 34);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.activeCategory = cat.id;
        this.refresh();
      });

      this.container.add(btn);
      this.catButtons.push({ id: cat.id, bg: bBg, text: bText });
      catX += 155;
    });

    // Left List Container (Quests list)
    this.listContainer = this.scene.add.container(160, 180);
    this.container.add(this.listContainer);

    // Right Details Container (Selected Quest Details)
    this.detailsContainer = this.scene.add.container(600, 180);
    this.container.add(this.detailsContainer);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    const quests = QuestManager.getInstance();

    // Tab highlight
    this.catButtons.forEach(b => {
      b.bg.clear();
      if (b.id === this.activeCategory) {
        b.bg.fillStyle(0x92400e, 1);
        b.bg.fillRoundedRect(0, 0, 140, 34, 6);
        b.bg.lineStyle(1.5, 0xf59e0b, 1);
        b.bg.strokeRoundedRect(0, 0, 140, 34, 6);
        b.text.setColor('#fef08a');
      } else {
        b.bg.fillStyle(0x1e293b, 0.9);
        b.bg.fillRoundedRect(0, 0, 140, 34, 6);
        b.bg.lineStyle(1.5, 0x475569, 0.8);
        b.bg.strokeRoundedRect(0, 0, 140, 34, 6);
        b.text.setColor('#cbd5e1');
      }
    });

    // Populate quest list
    this.listContainer.removeAll(true);
    let questItems = [];
    if (this.activeCategory === 'main') {
      questItems = quests.getMainQuests().filter(q => q.status === 'active');
    } else if (this.activeCategory === 'side') {
      questItems = quests.getSideQuests();
    } else {
      questItems = quests.getCompletedQuests();
    }

    if (questItems.length === 0) {
      const emptyText = this.scene.add.text(0, 30, 'No quests in this category.', {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        color: '#64748b'
      });
      this.listContainer.add(emptyText);
      this.detailsContainer.removeAll(true);
      return;
    }

    if (!this.selectedQuestId || !questItems.some(q => q.id === this.selectedQuestId)) {
      this.selectedQuestId = questItems[0].id;
    }

    let itemY = 0;
    questItems.forEach(q => {
      const item = this.scene.add.container(0, itemY);
      const isSelected = q.id === this.selectedQuestId;

      const iBg = this.scene.add.graphics();
      iBg.fillStyle(isSelected ? 0x1e293b : 0x0f172a, 0.9);
      iBg.fillRoundedRect(0, 0, 400, 56, 8);
      iBg.lineStyle(1.5, isSelected ? 0xf59e0b : 0x334155, 0.8);
      iBg.strokeRoundedRect(0, 0, 400, 56, 8);
      item.add(iBg);

      const title = this.scene.add.text(16, 12, q.title, {
        fontFamily: "'Cinzel', serif",
        fontSize: '14px',
        color: isSelected ? '#f59e0b' : '#f8fafc',
        fontStyle: 'bold'
      });
      item.add(title);

      const statusTag = this.scene.add.text(16, 32, `Status: ${q.status.toUpperCase()}`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        color: q.status === 'completed' ? '#10b981' : '#38bdf8'
      });
      item.add(statusTag);

      item.setSize(400, 56);
      item.setInteractive({ useHandCursor: true });
      item.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.selectedQuestId = q.id;
        this.refresh();
      });

      this.listContainer.add(item);
      itemY += 66;
    });

    this.renderDetails();
  }

  renderDetails() {
    this.detailsContainer.removeAll(true);
    const quests = QuestManager.getInstance().quests;
    const q = quests[this.selectedQuestId];
    if (!q) return;

    // Details box background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.8);
    bg.fillRoundedRect(0, 0, 520, 440, 10);
    bg.lineStyle(1, 0x334155, 0.6);
    bg.strokeRoundedRect(0, 0, 520, 440, 10);
    this.detailsContainer.add(bg);

    // Title
    const title = this.scene.add.text(24, 20, q.title, {
      fontFamily: "'Cinzel', serif",
      fontSize: '18px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.detailsContainer.add(title);

    // Description
    const desc = this.scene.add.text(24, 55, q.description, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#cbd5e1',
      wordWrap: { width: 470 },
      lineSpacing: 5
    });
    this.detailsContainer.add(desc);

    // Objectives Header
    const objHeader = this.scene.add.text(24, 130, 'OBJECTIVES', {
      fontFamily: "'Cinzel', serif",
      fontSize: '13px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.detailsContainer.add(objHeader);

    // Checklist
    let checkY = 160;
    q.objectives.forEach(obj => {
      const mark = obj.completed ? '☑' : '☐';
      const col = obj.completed ? '#10b981' : '#f8fafc';
      const text = this.scene.add.text(24, checkY, `${mark}  ${obj.text}`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: col,
        wordWrap: { width: 470 }
      });
      this.detailsContainer.add(text);
      checkY += 34;
    });

    // Rewards Header
    const rewHeader = this.scene.add.text(24, 340, 'REWARDS', {
      fontFamily: "'Cinzel', serif",
      fontSize: '13px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.detailsContainer.add(rewHeader);

    const rewardsText = Object.entries(q.rewards || {})
      .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
      .join('   •   ') || 'Story Milestones';

    const rew = this.scene.add.text(24, 370, `🎁  ${rewardsText}`, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#fef08a'
    });
    this.detailsContainer.add(rew);
  }
}
