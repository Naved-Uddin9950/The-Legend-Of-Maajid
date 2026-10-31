/**
 * HUD.js
 * Comprehensive RPG HUD supporting Exploration and Visual Novel modes.
 * Displays player portrait, age, vitals, active quest, location, and key hints.
 */

import { CharacterManager } from '../systems/CharacterManager.js';
import { StatisticsManager } from '../systems/StatisticsManager.js';
import { QuestManager } from '../systems/QuestManager.js';
import { StoryManager } from '../systems/StoryManager.js';
import { UIManager } from '../systems/UIManager.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(1000);
    this.container.setScrollFactor(0);

    this.mode = 'exploration'; // 'exploration' | 'vn'
    this.createElements();
    this.refresh();
  }

  createElements() {
    // ==========================================
    // TOP-LEFT: CHARACTER PROFILE WIDGET
    // ==========================================
    this.profileBox = this.scene.add.container(24, 20);

    // Profile card background
    const profBg = this.scene.add.graphics();
    profBg.fillStyle(0x0f172a, 0.92);
    profBg.fillRoundedRect(0, 0, 240, 68, 10);
    profBg.lineStyle(2, 0xd97706, 0.9);
    profBg.strokeRoundedRect(0, 0, 240, 68, 10);
    this.profileBox.add(profBg);

    // Portrait frame & image
    this.portraitImg = this.scene.add.image(34, 34, 'portrait_maajid_age_21');
    this.portraitImg.setDisplaySize(52, 52);
    this.profileBox.add(this.portraitImg);

    // Name text
    this.nameText = this.scene.add.text(68, 12, 'Maajid Khan', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#f8fafc',
      fontStyle: 'bold'
    });
    this.profileBox.add(this.nameText);

    // Age & Level badge
    this.ageLevelText = this.scene.add.text(68, 36, 'Age 21  •  Level 5', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      color: '#cbd5e1'
    });
    this.profileBox.add(this.ageLevelText);

    this.container.add(this.profileBox);

    // ==========================================
    // BOTTOM-LEFT: VITALS BARS (HP & STAMINA)
    // ==========================================
    this.vitalsBox = this.scene.add.container(24, 620);

    const vitBg = this.scene.add.graphics();
    vitBg.fillStyle(0x0a0f1d, 0.9);
    vitBg.fillRoundedRect(0, 0, 220, 76, 8);
    vitBg.lineStyle(1.5, 0x334155, 0.8);
    vitBg.strokeRoundedRect(0, 0, 220, 76, 8);
    this.vitalsBox.add(vitBg);

    // HP Bar
    this.hpBarBg = this.scene.add.graphics();
    this.hpBarBg.fillStyle(0x371b1b, 1);
    this.hpBarBg.fillRoundedRect(16, 14, 188, 16, 4);
    this.vitalsBox.add(this.hpBarBg);

    this.hpBarFill = this.scene.add.graphics();
    this.vitalsBox.add(this.hpBarFill);

    this.hpText = this.scene.add.text(22, 14, 'HP  120 / 120', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.vitalsBox.add(this.hpText);

    // Stamina Bar
    this.staminaBarBg = this.scene.add.graphics();
    this.staminaBarBg.fillStyle(0x2d240d, 1);
    this.staminaBarBg.fillRoundedRect(16, 42, 188, 16, 4);
    this.vitalsBox.add(this.staminaBarBg);

    this.staminaBarFill = this.scene.add.graphics();
    this.vitalsBox.add(this.staminaBarFill);

    this.staminaText = this.scene.add.text(22, 42, 'STA  100 / 100', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.vitalsBox.add(this.staminaText);

    this.container.add(this.vitalsBox);

    // ==========================================
    // TOP-RIGHT: ACTIVE QUEST TRACKER
    // ==========================================
    this.questBox = this.scene.add.container(930, 20);

    const questBg = this.scene.add.graphics();
    questBg.fillStyle(0x090d16, 0.92);
    questBg.fillRoundedRect(0, 0, 326, 76, 10);
    questBg.lineStyle(1.5, 0xd97706, 0.85);
    questBg.strokeRoundedRect(0, 0, 326, 76, 10);
    this.questBox.add(questBg);

    const qIcon = this.scene.add.text(14, 12, '📜', { fontSize: '16px' });
    this.questBox.add(qIcon);

    this.questTitle = this.scene.add.text(38, 12, 'MAIN QUEST', {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.questBox.add(this.questTitle);

    this.questName = this.scene.add.text(14, 32, 'Reunion at Machhli Mohalla', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#ffffff',
      fontStyle: 'bold'
    });
    this.questBox.add(this.questName);

    this.questObjective = this.scene.add.text(14, 52, '• Talk to Basharat Bhai outside Basharat Manzil', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#94a3b8'
    });
    this.questBox.add(this.questObjective);

    this.container.add(this.questBox);

    // ==========================================
    // BOTTOM-RIGHT: LOCATION & SHORTCUTS BAR
    // ==========================================
    this.bottomBar = this.scene.add.container(720, 660);

    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x030712, 0.9);
    barBg.fillRoundedRect(0, 0, 536, 42, 8);
    barBg.lineStyle(1, 0x475569, 0.6);
    barBg.strokeRoundedRect(0, 0, 536, 42, 8);
    this.bottomBar.add(barBg);

    // Location tag
    this.locationText = this.scene.add.text(16, 12, '📍 MACHHLI WALO KA MOHALLA', {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.bottomBar.add(this.locationText);

    // Quick action buttons
    const actions = [
      { key: 'C', label: 'Stats', modal: 'character' },
      { key: 'I', label: 'Items', modal: 'inventory' },
      { key: 'J', label: 'Journal', modal: 'journal' },
      { key: 'M', label: 'Map', modal: 'map' },
      { key: 'ESC', label: 'Menu', modal: 'pause' }
    ];

    let btnX = 260;
    actions.forEach(act => {
      const btn = this.scene.add.container(btnX, 8);

      const bBg = this.scene.add.graphics();
      bBg.fillStyle(0x1e293b, 0.9);
      bBg.fillRoundedRect(0, 0, 50, 26, 4);
      bBg.lineStyle(1, 0x64748b, 0.7);
      bBg.strokeRoundedRect(0, 0, 50, 26, 4);
      btn.add(bBg);

      const bText = this.scene.add.text(25, 13, `[${act.key}]`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        color: '#f59e0b',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.add(bText);

      btn.setSize(50, 26);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        UIManager.getInstance().toggleModal(act.modal);
      });
      btn.on('pointerover', () => {
        bBg.clear();
        bBg.fillStyle(0x334155, 1);
        bBg.fillRoundedRect(0, 0, 50, 26, 4);
        bBg.lineStyle(1, 0xf59e0b, 1);
        bBg.strokeRoundedRect(0, 0, 50, 26, 4);
      });
      btn.on('pointerout', () => {
        bBg.clear();
        bBg.fillStyle(0x1e293b, 0.9);
        bBg.fillRoundedRect(0, 0, 50, 26, 4);
        bBg.lineStyle(1, 0x64748b, 0.7);
        bBg.strokeRoundedRect(0, 0, 50, 26, 4);
      });

      this.bottomBar.add(btn);
      btnX += 54;
    });

    this.container.add(this.bottomBar);
  }

  setMode(mode) {
    this.mode = mode;
    const isExploration = mode === 'exploration';
    this.profileBox.setVisible(isExploration);
    this.vitalsBox.setVisible(isExploration);
    this.questBox.setVisible(isExploration);
    this.bottomBar.setVisible(isExploration);
  }

  setInteractable(active) {
    this.bottomBar.setAlpha(active ? 1 : 0.4);
  }

  refresh() {
    const stats = StatisticsManager.getInstance();
    const story = StoryManager.getInstance();
    const quests = QuestManager.getInstance();
    const char = CharacterManager.getInstance().getPlayerProfile();

    // Portrait & stats
    if (char && char.portrait && this.scene.textures.exists(char.portrait)) {
      this.portraitImg.setTexture(char.portrait);
    }
    this.nameText.setText(char ? char.name : 'Maajid');
    this.ageLevelText.setText(`Age ${story.getCurrentAge()}  •  Lv. ${stats.level}`);

    // HP Bar
    const hpPct = Math.max(0, Math.min(1, stats.hp / stats.maxHp));
    this.hpBarFill.clear();
    this.hpBarFill.fillStyle(0xef4444, 1);
    this.hpBarFill.fillRoundedRect(16, 14, 188 * hpPct, 16, 4);
    this.hpText.setText(`HP  ${stats.hp} / ${stats.maxHp}`);

    // Stamina Bar
    const staPct = Math.max(0, Math.min(1, stats.stamina / stats.maxStamina));
    this.staminaBarFill.clear();
    this.staminaBarFill.fillStyle(0xeab308, 1);
    this.staminaBarFill.fillRoundedRect(16, 42, 188 * staPct, 16, 4);
    this.staminaText.setText(`STA  ${stats.stamina} / ${stats.maxStamina}`);

    // Quest Tracker
    const activeQuest = quests.getActiveMainQuest();
    if (activeQuest) {
      this.questBox.setVisible(this.mode === 'exploration');
      this.questName.setText(activeQuest.title);
      const activeObj = activeQuest.objectives.find(o => !o.completed) || activeQuest.objectives[0];
      this.questObjective.setText(`• ${activeObj ? activeObj.text : 'All objectives complete'}`);
    } else {
      this.questBox.setVisible(false);
    }
  }

  setLocation(locName) {
    this.locationText.setText(`📍 ${locName.toUpperCase()}`);
  }
}
