/**
 * CharacterScreen.js
 * Comprehensive RPG character sheet showing dynamic age-appropriate portrait,
 * attributes, vital statistics, skills, traits, and background lore.
 */

import { CharacterManager } from '../systems/CharacterManager.js';
import { StatisticsManager } from '../systems/StatisticsManager.js';
import { StoryManager } from '../systems/StoryManager.js';
import { UIManager } from '../systems/UIManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class CharacterScreen {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.activeTab = 'attributes'; // 'attributes' | 'skills' | 'traits'
    this.createElements();
    this.hide();
  }

  createElements() {
    // Backdrop
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.88);
    bg.fillRect(0, 0, 1280, 720);
    this.container.add(bg);

    // Main Modal Box (1040 x 600)
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(120, 60, 1040, 600, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(120, 60, 1040, 600, 16);
    this.container.add(panel);

    // Close button
    const closeBtn = this.scene.add.text(1125, 80, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => UIManager.getInstance().closeCurrentModal());
    this.container.add(closeBtn);

    // Left Column: Profile Card (x: 150..430)
    this.portraitImg = this.scene.add.image(280, 210, 'portrait_maajid_age_21');
    this.portraitImg.setDisplaySize(180, 230);
    this.container.add(this.portraitImg);

    // Frame around portrait
    const pFrame = this.scene.add.graphics();
    pFrame.lineStyle(2, 0xd97706, 0.8);
    pFrame.strokeRect(190, 95, 180, 230);
    this.container.add(pFrame);

    this.nameText = this.scene.add.text(280, 345, 'Maajid Khan', {
      fontFamily: "'Cinzel', serif",
      fontSize: '20px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.container.add(this.nameText);

    this.bioSubText = this.scene.add.text(280, 375, 'Age 21  •  Machhli Walo Ka Mohalla', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    this.container.add(this.bioSubText);

    // Left Column Vitals (Level, XP, HP, Stamina)
    this.vitalsText = this.scene.add.text(170, 410, '', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#f8fafc',
      lineSpacing: 8
    });
    this.container.add(this.vitalsText);

    // Bio description
    this.descText = this.scene.add.text(170, 520, '', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      color: '#94a3b8',
      wordWrap: { width: 240 },
      lineSpacing: 4
    });
    this.container.add(this.descText);

    // Right Column Tabs Header
    const tabs = [
      { id: 'attributes', label: 'Core Attributes' },
      { id: 'skills', label: 'Skills' },
      { id: 'traits', label: 'Character Traits' }
    ];

    let tabX = 460;
    this.tabButtons = [];
    tabs.forEach(tab => {
      const btn = this.scene.add.container(tabX, 90);

      const tBg = this.scene.add.graphics();
      tBg.fillStyle(0x1e293b, 1);
      tBg.fillRoundedRect(0, 0, 160, 36, 6);
      tBg.lineStyle(1.5, 0x475569, 0.8);
      tBg.strokeRoundedRect(0, 0, 160, 36, 6);
      btn.add(tBg);

      const tText = this.scene.add.text(80, 18, tab.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.add(tText);

      btn.setSize(160, 36);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.activeTab = tab.id;
        this.renderRightTab();
      });

      this.container.add(btn);
      this.tabButtons.push({ id: tab.id, container: btn, bg: tBg, text: tText });
      tabX += 175;
    });

    // Right Content Container
    this.tabContent = this.scene.add.container(460, 145);
    this.container.add(this.tabContent);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    const char = CharacterManager.getInstance().getPlayerProfile();
    const stats = StatisticsManager.getInstance();
    const story = StoryManager.getInstance();

    if (char && char.portrait && this.scene.textures.exists(char.portrait)) {
      this.portraitImg.setTexture(char.portrait);
    }
    this.nameText.setText(char ? char.fullName : 'Maajid Khan');
    this.bioSubText.setText(`Age ${story.getCurrentAge()}  •  Machhli Walo Ka Mohalla`);

    this.vitalsText.setText(
      `Level: ${stats.level}\n` +
      `Experience: ${stats.xp} / ${stats.nextLevelXP} XP\n` +
      `Health: ${stats.hp} / ${stats.maxHp} HP\n` +
      `Stamina: ${stats.stamina} / ${stats.maxStamina}`
    );

    this.descText.setText(char ? char.description : '');
    this.renderRightTab();
  }

  renderRightTab() {
    this.tabContent.removeAll(true);
    const stats = StatisticsManager.getInstance();

    // Highlight active tab
    this.tabButtons.forEach(b => {
      b.bg.clear();
      if (b.id === this.activeTab) {
        b.bg.fillStyle(0x92400e, 1);
        b.bg.fillRoundedRect(0, 0, 160, 36, 6);
        b.bg.lineStyle(1.5, 0xf59e0b, 1);
        b.bg.strokeRoundedRect(0, 0, 160, 36, 6);
        b.text.setColor('#fef08a');
      } else {
        b.bg.fillStyle(0x1e293b, 0.9);
        b.bg.fillRoundedRect(0, 0, 160, 36, 6);
        b.bg.lineStyle(1.5, 0x475569, 0.8);
        b.bg.strokeRoundedRect(0, 0, 160, 36, 6);
        b.text.setColor('#cbd5e1');
      }
    });

    if (this.activeTab === 'attributes') {
      const attrs = stats.getAttributesList();
      let rowY = 0;
      attrs.forEach(attr => {
        const row = this.scene.add.container(0, rowY);

        const rBg = this.scene.add.graphics();
        rBg.fillStyle(0x111827, 0.8);
        rBg.fillRoundedRect(0, 0, 660, 64, 8);
        rBg.lineStyle(1, 0x374151, 0.6);
        rBg.strokeRoundedRect(0, 0, 660, 64, 8);
        row.add(rBg);

        const iconTitle = this.scene.add.text(16, 12, `${attr.icon}  ${attr.name.toUpperCase()}`, {
          fontFamily: "'Cinzel', serif",
          fontSize: '14px',
          color: '#f59e0b',
          fontStyle: 'bold'
        });
        row.add(iconTitle);

        const valText = this.scene.add.text(600, 12, `${attr.current} / ${attr.max}`, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(1, 0);
        row.add(valText);

        // Progress bar
        const barBg = this.scene.add.graphics();
        barBg.fillStyle(0x1f2937, 1);
        barBg.fillRoundedRect(16, 36, 300, 8, 4);
        row.add(barBg);

        const barFill = this.scene.add.graphics();
        barFill.fillStyle(0x38bdf8, 1);
        barFill.fillRoundedRect(16, 36, 300 * (attr.current / attr.max), 8, 4);
        row.add(barFill);

        const desc = this.scene.add.text(16, 48, attr.description, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '11px',
          color: '#94a3b8'
        });
        row.add(desc);

        this.tabContent.add(row);
        rowY += 74;
      });
    } else if (this.activeTab === 'skills') {
      const skills = stats.getSkillsList();
      let rowY = 0;
      skills.forEach(skill => {
        const row = this.scene.add.container(0, rowY);

        const rBg = this.scene.add.graphics();
        rBg.fillStyle(0x111827, 0.8);
        rBg.fillRoundedRect(0, 0, 660, 72, 8);
        rBg.lineStyle(1, 0x374151, 0.6);
        rBg.strokeRoundedRect(0, 0, 660, 72, 8);
        row.add(rBg);

        const title = this.scene.add.text(16, 12, `${skill.icon}  ${skill.name}`, {
          fontFamily: "'Cinzel', serif",
          fontSize: '15px',
          color: '#38bdf8',
          fontStyle: 'bold'
        });
        row.add(title);

        const levelBadge = this.scene.add.text(600, 12, `Rank ${skill.level} / ${skill.maxLevel}`, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '14px',
          color: '#f59e0b',
          fontStyle: 'bold'
        }).setOrigin(1, 0);
        row.add(levelBadge);

        const desc = this.scene.add.text(16, 40, skill.description, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '12px',
          color: '#94a3b8',
          wordWrap: { width: 620 }
        });
        row.add(desc);

        this.tabContent.add(row);
        rowY += 84;
      });
    } else if (this.activeTab === 'traits') {
      const traits = stats.getTraitsList();
      let rowY = 0;
      traits.forEach(trait => {
        const row = this.scene.add.container(0, rowY);

        const rBg = this.scene.add.graphics();
        rBg.fillStyle(0x111827, 0.8);
        rBg.fillRoundedRect(0, 0, 660, 72, 8);
        rBg.lineStyle(1, 0x374151, 0.6);
        rBg.strokeRoundedRect(0, 0, 660, 72, 8);
        row.add(rBg);

        const title = this.scene.add.text(16, 12, `✦  ${trait.name}`, {
          fontFamily: "'Cinzel', serif",
          fontSize: '15px',
          color: '#a855f7',
          fontStyle: 'bold'
        });
        row.add(title);

        const valText = this.scene.add.text(600, 12, `Strength: ${trait.current} / 10`, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          color: '#ffffff'
        }).setOrigin(1, 0);
        row.add(valText);

        const desc = this.scene.add.text(16, 40, trait.description, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '12px',
          color: '#94a3b8',
          wordWrap: { width: 620 }
        });
        row.add(desc);

        this.tabContent.add(row);
        rowY += 84;
      });
    }
  }
}
