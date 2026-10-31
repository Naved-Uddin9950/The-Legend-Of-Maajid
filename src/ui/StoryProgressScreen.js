/**
 * StoryProgressScreen.js
 * Visual timeline and story progress dashboard calculating genuine milestone completion.
 */

import { StoryManager } from '../systems/StoryManager.js';
import { UIManager } from '../systems/UIManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class StoryProgressScreen {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.createElements();
    this.hide();
  }

  createElements() {
    // Backdrop
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
    const title = this.scene.add.text(160, 85, 'STORY TIMELINE & PROGRESSION', {
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

    // Top Overview Card (Completion %, Current Chapter, Age)
    this.overviewBox = this.scene.add.container(160, 130);
    this.container.add(this.overviewBox);

    // Timeline Scroll Area
    this.timelineContainer = this.scene.add.container(160, 220);
    this.container.add(this.timelineContainer);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    const story = StoryManager.getInstance();
    const currCh = story.getCurrentChapter();
    const pct = story.getStoryCompletionPercentage();

    // Render Overview Bar
    this.overviewBox.removeAll(true);

    const ovBg = this.scene.add.graphics();
    ovBg.fillStyle(0x111827, 0.9);
    ovBg.fillRoundedRect(0, 0, 960, 65, 8);
    ovBg.lineStyle(1, 0xd97706, 0.6);
    ovBg.strokeRoundedRect(0, 0, 960, 65, 8);
    this.overviewBox.add(ovBg);

    const chText = this.scene.add.text(20, 14, `CURRENT CHAPTER: ${currCh.title.toUpperCase()}`, {
      fontFamily: "'Cinzel', serif",
      fontSize: '13px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.overviewBox.add(chText);

    const ageText = this.scene.add.text(20, 36, `Maajid's Age: ${story.getCurrentAge()} Years  •  Hometown: Machhli Walo Ka Mohalla`, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      color: '#cbd5e1'
    });
    this.overviewBox.add(ageText);

    // Story Completion Gauge
    const compText = this.scene.add.text(940, 14, `COMPLETION: ${pct}%`, {
      fontFamily: "'Cinzel', serif",
      fontSize: '14px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(1, 0);
    this.overviewBox.add(compText);

    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x1f2937, 1);
    barBg.fillRoundedRect(720, 38, 220, 10, 5);
    this.overviewBox.add(barBg);

    const barFill = this.scene.add.graphics();
    barFill.fillStyle(0x10b981, 1);
    barFill.fillRoundedRect(720, 38, 220 * (pct / 100), 10, 5);
    this.overviewBox.add(barFill);

    // Render Timeline Milestones
    this.timelineContainer.removeAll(true);

    const milestones = [
      {
        id: 1,
        title: 'Childhood & Firoz Dispute',
        age: 'Age 8',
        desc: 'Confrontation with 20yo Firoz in the mohalla alley, leaving a permanent scar on his back.',
        isCompleted: story.isChapterCompleted(1),
        isUnlocked: story.isChapterUnlocked(1)
      },
      {
        id: 2,
        title: 'Muharram & The Elathalam Clash',
        age: 'Age 8',
        desc: 'Playing Chhayyam in the procession, dodging strikes, and facing brutal retaliation from Firoz.',
        isCompleted: story.isChapterCompleted(2),
        isUnlocked: story.isChapterUnlocked(2)
      },
      {
        id: 3,
        title: 'A Change of Heart',
        age: 'Age 8',
        desc: 'Terrace reflection beneath the moon; realizing violence only breeds suffering and choosing to reform.',
        isCompleted: story.isChapterCompleted(3),
        isUnlocked: story.isChapterUnlocked(3)
      },
      {
        id: 4,
        title: 'Tuition with Basharat Bhai',
        age: 'Age 12',
        desc: 'Four-year time skip. Studying English & Math opposite his house with 15yo Basharat, building lifelong respect.',
        isCompleted: story.isChapterCompleted(4),
        isUnlocked: story.isChapterUnlocked(4)
      },
      {
        id: 5,
        title: 'The Adult Maajid & 2.5D RPG World',
        age: 'Age 21',
        desc: 'Transition to adult life with prescription glasses. Reconnecting with Basharat Bhai (~24) in the living mohalla.',
        isCompleted: story.isChapterCompleted(5),
        isUnlocked: story.isChapterUnlocked(5)
      }
    ];

    let nodeY = 0;
    milestones.forEach(m => {
      const node = this.scene.add.container(0, nodeY);

      const nBg = this.scene.add.graphics();
      nBg.fillStyle(m.isUnlocked ? 0x0f172a : 0x030712, 0.85);
      nBg.fillRoundedRect(0, 0, 960, 64, 8);
      nBg.lineStyle(1.5, m.isCompleted ? 0x10b981 : (m.isUnlocked ? 0xd97706 : 0x334155), 0.8);
      nBg.strokeRoundedRect(0, 0, 960, 64, 8);
      node.add(nBg);

      // Status icon
      const mark = m.isCompleted ? '✓' : (m.isUnlocked ? '▶' : '🔒');
      const markColor = m.isCompleted ? '#10b981' : (m.isUnlocked ? '#f59e0b' : '#64748b');
      const icon = this.scene.add.text(20, 18, mark, {
        fontFamily: "'Cinzel', serif",
        fontSize: '18px',
        color: markColor,
        fontStyle: 'bold'
      });
      node.add(icon);

      // Title & Age
      const title = this.scene.add.text(55, 12, `${m.title} (${m.age})`, {
        fontFamily: "'Cinzel', serif",
        fontSize: '14px',
        color: m.isUnlocked ? '#ffffff' : '#64748b',
        fontStyle: 'bold'
      });
      node.add(title);

      // Description
      const desc = this.scene.add.text(55, 36, m.isUnlocked ? m.desc : 'Milestone locked. Progress through earlier story chapters to reveal.', {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '12px',
        color: m.isUnlocked ? '#94a3b8' : '#475569'
      });
      node.add(desc);

      this.timelineContainer.add(node);
      nodeY += 76;
    });
  }
}
