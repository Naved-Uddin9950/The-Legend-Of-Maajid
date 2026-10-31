/**
 * VisualNovelScene.js
 * Cinematic Visual Novel scene rendering narrative chapters, character dialogues,
 * camera transitions, sound cues, and chapter milestones.
 */

import Phaser from 'phaser';
import { StoryManager } from '../systems/StoryManager.js';
import { StatisticsManager } from '../systems/StatisticsManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { DialogueBox } from '../ui/DialogueBox.js';
import { HUD } from '../ui/HUD.js';
import { NotificationSystem } from '../ui/NotificationSystem.js';

export class VisualNovelScene extends Phaser.Scene {
  constructor() {
    super('VisualNovelScene');
  }

  init(data) {
    this.chapterId = data.chapterId || 1;
    this.dialogueIndex = 0;
  }

  create() {
    const { width, height } = this.scale;
    const story = StoryManager.getInstance();
    story.setChapter(this.chapterId);

    this.chapterData = story.getCurrentChapter();
    StatisticsManager.getInstance().syncWithAge(this.chapterData.age);

    // 1. Fullscreen Chapter Background
    this.bg = this.add.image(width / 2, height / 2, this.chapterData.bg);
    this.bg.setDisplaySize(width, height);

    // Camera pan animation for cinematic effect
    this.tweens.add({
      targets: this.bg,
      scaleX: this.bg.scaleX * 1.04,
      scaleY: this.bg.scaleY * 1.04,
      duration: 15000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 2. Chapter Title Splash Card
    this.showChapterIntroCard();

    // 3. Dialogue Box
    this.dialogueBox = new DialogueBox(this);

    // 4. Notifications & HUD in VN mode
    this.notifications = new NotificationSystem(this);
    this.hud = new HUD(this);
    this.hud.setMode('vn');

    // 5. Start Background Music
    if (this.chapterData.music) {
      AudioManager.getInstance().playMusic(this.chapterData.music);
    }

    // 6. Camera Fade In
    this.cameras.main.fadeIn(700, 0, 0, 0);

    // ESC to return to main menu or pause
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.start('MainMenuScene');
    });
  }

  showChapterIntroCard() {
    const card = this.add.container(640, 360);
    card.setDepth(500);

    const bg = this.add.graphics();
    bg.fillStyle(0x020617, 0.92);
    bg.fillRoundedRect(-320, -100, 640, 200, 16);
    bg.lineStyle(2, 0xd97706, 0.9);
    bg.strokeRoundedRect(-320, -100, 640, 200, 16);
    card.add(bg);

    const title = this.add.text(0, -35, this.chapterData.title.toUpperCase(), {
      fontFamily: "'Cinzel', serif",
      fontSize: '26px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);
    card.add(title);

    const sub = this.add.text(0, 10, this.chapterData.subtitle, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    card.add(sub);

    const prompt = this.add.text(0, 55, 'Click or Press Space to Begin', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      color: '#94a3b8'
    }).setOrigin(0.5);
    card.add(prompt);

    // Click to start dialogues
    const startStory = () => {
      this.tweens.add({
        targets: card,
        alpha: 0,
        duration: 400,
        onComplete: () => {
          card.destroy();
          this.startNextDialogue();
        }
      });
    };

    this.input.once('pointerdown', startStory);
    this.input.keyboard.once('keydown-SPACE', startStory);
    this.input.keyboard.once('keydown-ENTER', startStory);
  }

  startNextDialogue() {
    const dialogues = this.chapterData.dialogues;
    if (this.dialogueIndex < dialogues.length) {
      const d = dialogues[this.dialogueIndex];
      this.dialogueIndex++;
      this.dialogueBox.showDialogue(d, () => {
        this.startNextDialogue();
      });
    } else {
      this.onChapterCompleted();
    }
  }

  onChapterCompleted() {
    this.dialogueBox.hide();
    const story = StoryManager.getInstance();
    story.completeChapter(this.chapterId);

    // Chapter completion card
    const compCard = this.add.container(640, 360);
    compCard.setDepth(2500);

    const bg = this.add.graphics();
    bg.fillStyle(0x0a0f1d, 0.95);
    bg.fillRoundedRect(-300, -110, 600, 220, 16);
    bg.lineStyle(2.5, 0x10b981, 1);
    bg.strokeRoundedRect(-300, -110, 600, 220, 16);
    compCard.add(bg);

    const icon = this.add.text(0, -55, '★ CHAPTER COMPLETE ★', {
      fontFamily: "'Cinzel', serif",
      fontSize: '16px',
      color: '#10b981',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);
    compCard.add(icon);

    const title = this.add.text(0, -15, this.chapterData.title, {
      fontFamily: "'Cinzel', serif",
      fontSize: '22px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    compCard.add(title);

    const btn = this.add.container(0, 50);
    const bBg = this.add.graphics();
    bBg.fillStyle(0x15803d, 1);
    bBg.fillRoundedRect(-110, -18, 220, 36, 6);
    btn.add(bBg);

    const nextLabel = this.chapterId >= 5 ? 'ENTER RPG EXPLORATION' : 'NEXT CHAPTER ▶';
    const bTxt = this.add.text(0, 0, nextLabel, {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.add(bTxt);

    btn.setSize(220, 36);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.cameras.main.fade(600, 0, 0, 0, false, (cam, progress) => {
        if (progress === 1) {
          if (this.chapterId >= 5) {
            this.scene.start('NeighborhoodScene');
          } else {
            this.scene.start('VisualNovelScene', { chapterId: this.chapterId + 1 });
          }
        }
      });
    });

    compCard.add(btn);
  }
}
