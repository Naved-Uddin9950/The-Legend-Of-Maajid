/**
 * MainMenuUI.js
 * Cinematic Main Menu UI with New Game, Continue, Save Slots, Chapters, Settings, and Credits.
 */

import { SaveManager } from '../systems/SaveManager.js';
import { StoryManager } from '../systems/StoryManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class MainMenuUI {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(100);

    this.activeModal = null;
    this.createElements();
  }

  createElements() {
    // Title & Subtitle
    this.titleText = this.scene.add.text(640, 150, 'THE LEGEND OF MAAJID', {
      fontFamily: "'Cinzel', serif",
      fontSize: '46px',
      color: '#f59e0b',
      fontStyle: '900',
      stroke: '#000000',
      strokeThickness: 6,
      letterSpacing: 4
    }).setOrigin(0.5);
    this.container.add(this.titleText);

    this.subText = this.scene.add.text(640, 195, 'A VISUAL NOVEL & 2.5D RPG EXPERIENCE', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#cbd5e1',
      stroke: '#000000',
      strokeThickness: 3,
      letterSpacing: 3
    }).setOrigin(0.5);
    this.container.add(this.subText);

    // Subtle floating animation on title
    this.scene.tweens.add({
      targets: [this.titleText, this.subText],
      y: '+=6',
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Menu Buttons Container (Center-bottom)
    this.menuButtonsContainer = this.scene.add.container(640, 260);
    this.container.add(this.menuButtonsContainer);

    this.renderMenuButtons();
    this.createModals();
  }

  renderMenuButtons() {
    this.menuButtonsContainer.removeAll(true);
    const saveMgr = SaveManager.getInstance();
    const hasSave = saveMgr.hasAnySave();

    const menuItems = [
      { id: 'new', label: 'New Game', enabled: true },
      { id: 'continue', label: 'Continue', enabled: hasSave },
      { id: 'load', label: 'Load Game', enabled: true },
      { id: 'chapters', label: 'Chapters', enabled: true },
      { id: 'settings', label: 'Settings', enabled: true },
      { id: 'credits', label: 'Credits', enabled: true }
    ];

    let bY = 0;
    menuItems.forEach(item => {
      const btn = this.scene.add.container(0, bY);

      const bBg = this.scene.add.graphics();
      bBg.fillStyle(0x0f172a, item.enabled ? 0.92 : 0.4);
      bBg.fillRoundedRect(-140, -18, 280, 42, 8);
      bBg.lineStyle(1.5, item.enabled ? 0xd97706 : 0x475569, item.enabled ? 0.9 : 0.4);
      bBg.strokeRoundedRect(-140, -18, 280, 42, 8);
      btn.add(bBg);

      const bText = this.scene.add.text(0, 3, item.label.toUpperCase(), {
        fontFamily: "'Cinzel', serif",
        fontSize: '15px',
        color: item.enabled ? '#ffffff' : '#64748b',
        fontStyle: 'bold',
        letterSpacing: 2
      }).setOrigin(0.5);
      btn.add(bText);

      if (item.enabled) {
        btn.setSize(280, 42);
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerover', () => {
          AudioManager.getInstance().playSFX('hover');
          bBg.clear();
          bBg.fillStyle(0x92400e, 1);
          bBg.fillRoundedRect(-140, -18, 280, 42, 8);
          bBg.lineStyle(2, 0xf59e0b, 1);
          bBg.strokeRoundedRect(-140, -18, 280, 42, 8);
          bText.setColor('#fef08a');
        });
        btn.on('pointerout', () => {
          bBg.clear();
          bBg.fillStyle(0x0f172a, 0.92);
          bBg.fillRoundedRect(-140, -18, 280, 42, 8);
          bBg.lineStyle(1.5, 0xd97706, 0.9);
          bBg.strokeRoundedRect(-140, -18, 280, 42, 8);
          bText.setColor('#ffffff');
        });
        btn.on('pointerdown', () => {
          AudioManager.getInstance().playSFX('click');
          this.handleMenuClick(item.id);
        });
      }

      this.menuButtonsContainer.add(btn);
      bY += 56;
    });
  }

  handleMenuClick(action) {
    const saveMgr = SaveManager.getInstance();

    switch (action) {
      case 'new':
        if (saveMgr.hasAnySave()) {
          this.showConfirmNewGameModal();
        } else {
          this.startNewGame();
        }
        break;

      case 'continue': {
        const slot = saveMgr.getLatestSaveSlot();
        if (slot) {
          saveMgr.loadFromSlot(slot);
          const chId = StoryManager.getInstance().currentChapterId;
          if (chId >= 5) {
            this.scene.scene.start('NeighborhoodScene');
          } else {
            this.scene.scene.start('VisualNovelScene', { chapterId: chId });
          }
        }
        break;
      }

      case 'load':
        this.showLoadSlotsModal();
        break;

      case 'chapters':
        this.showChaptersModal();
        break;

      case 'settings':
        this.showSettingsModal();
        break;

      case 'credits':
        this.creditsModal.setVisible(true);
        break;

      default:
        break;
    }
  }

  startNewGame() {
    StoryManager.getInstance().reset();
    this.scene.cameras.main.fade(800, 0, 0, 0, false, (cam, progress) => {
      if (progress === 1) {
        this.scene.scene.start('VisualNovelScene', { chapterId: 1 });
      }
    });
  }

  // ==========================================
  // MODALS
  // ==========================================
  createModals() {
    this.createConfirmModal();
    this.createSlotsModal();
    this.createChaptersModal();
    this.createSettingsModal();
    this.createCreditsModal();
  }

  createConfirmModal() {
    this.confirmModal = this.scene.add.container(0, 0);
    this.confirmModal.setDepth(1000);
    this.confirmModal.setVisible(false);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.85);
    bg.fillRect(0, 0, 1280, 720);
    this.confirmModal.add(bg);

    const box = this.scene.add.graphics();
    box.fillStyle(0x0f172a, 0.98);
    box.fillRoundedRect(420, 240, 440, 220, 12);
    box.lineStyle(2, 0xd97706, 1);
    box.strokeRoundedRect(420, 240, 440, 220, 12);
    this.confirmModal.add(box);

    const title = this.scene.add.text(640, 280, 'START NEW GAME?', {
      fontFamily: "'Cinzel', serif",
      fontSize: '20px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.confirmModal.add(title);

    const warn = this.scene.add.text(640, 320, 'Existing progress will be reset if you proceed.', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    this.confirmModal.add(warn);

    // Confirm Button
    const yesBtn = this.createButton(540, 390, 'START', 0x991b1b, () => {
      this.confirmModal.setVisible(false);
      this.startNewGame();
    });
    this.confirmModal.add(yesBtn);

    // Cancel Button
    const noBtn = this.createButton(740, 390, 'CANCEL', 0x334155, () => {
      this.confirmModal.setVisible(false);
    });
    this.confirmModal.add(noBtn);

    this.container.add(this.confirmModal);
  }

  showConfirmNewGameModal() {
    this.confirmModal.setVisible(true);
  }

  createSlotsModal() {
    this.slotsModal = this.scene.add.container(0, 0);
    this.slotsModal.setDepth(1000);
    this.slotsModal.setVisible(false);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.9);
    bg.fillRect(0, 0, 1280, 720);
    this.slotsModal.add(bg);

    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(240, 80, 800, 560, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(240, 80, 800, 560, 16);
    this.slotsModal.add(panel);

    const title = this.scene.add.text(280, 115, 'SELECT SAVE SLOT', {
      fontFamily: "'Cinzel', serif",
      fontSize: '22px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.slotsModal.add(title);

    const closeBtn = this.scene.add.text(1000, 110, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.slotsModal.setVisible(false));
    this.slotsModal.add(closeBtn);

    this.slotsContainer = this.scene.add.container(280, 170);
    this.slotsModal.add(this.slotsContainer);

    this.container.add(this.slotsModal);
  }

  showLoadSlotsModal() {
    this.slotsModal.setVisible(true);
    this.slotsContainer.removeAll(true);
    const saveMgr = SaveManager.getInstance();
    const slots = saveMgr.getAllSlots();

    let sY = 0;
    slots.forEach(slot => {
      const card = this.scene.add.container(0, sY);

      const cBg = this.scene.add.graphics();
      cBg.fillStyle(0x111827, 0.9);
      cBg.fillRoundedRect(0, 0, 720, 115, 10);
      cBg.lineStyle(1.5, slot.exists ? 0xd97706 : 0x374151, 0.8);
      cBg.strokeRoundedRect(0, 0, 720, 115, 10);
      card.add(cBg);

      // Thumbnail
      const thumbKey = slot.exists && slot.thumbnail && this.scene.textures.exists(slot.thumbnail)
        ? slot.thumbnail : 'portrait_maajid_age_8';
      const thumb = this.scene.add.image(60, 57, thumbKey);
      thumb.setDisplaySize(75, 95);
      card.add(thumb);

      // Slot Title
      const sTitle = this.scene.add.text(120, 18, `SLOT ${slot.slotId} — ${slot.exists ? slot.chapterTitle : 'EMPTY SLOT'}`, {
        fontFamily: "'Cinzel', serif",
        fontSize: '15px',
        color: slot.exists ? '#f59e0b' : '#64748b',
        fontStyle: 'bold'
      });
      card.add(sTitle);

      if (slot.exists) {
        const info = this.scene.add.text(120, 44, `Age: ${slot.playerAge}  •  ${slot.location}  •  Completion: ${slot.completionPercentage}%`, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '12px',
          color: '#cbd5e1'
        });
        card.add(info);

        const time = this.scene.add.text(120, 70, `Saved: ${slot.savedDateFormatted} ${slot.savedTimeFormatted}`, {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '11px',
          color: '#94a3b8'
        });
        card.add(time);

        // Load Button
        const loadBtn = this.createButton(560, 57, 'LOAD', 0x0284c7, () => {
          saveMgr.loadFromSlot(slot.slotId);
          this.slotsModal.setVisible(false);
          const chId = StoryManager.getInstance().currentChapterId;
          if (chId >= 5) {
            this.scene.scene.start('NeighborhoodScene');
          } else {
            this.scene.scene.start('VisualNovelScene', { chapterId: chId });
          }
        }, 90, 34);
        card.add(loadBtn);

        // Delete Button
        const delBtn = this.createButton(660, 57, 'DELETE', 0x991b1b, () => {
          saveMgr.deleteSlot(slot.slotId);
          this.showLoadSlotsModal();
          this.renderMenuButtons();
        }, 90, 34);
        card.add(delBtn);
      } else {
        const emptyText = this.scene.add.text(120, 50, 'No save data present in this slot.', {
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: '13px',
          color: '#64748b'
        });
        card.add(emptyText);
      }

      this.slotsContainer.add(card);
      sY += 135;
    });
  }

  createChaptersModal() {
    this.chaptersModal = this.scene.add.container(0, 0);
    this.chaptersModal.setDepth(1000);
    this.chaptersModal.setVisible(false);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.9);
    bg.fillRect(0, 0, 1280, 720);
    this.chaptersModal.add(bg);

    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(160, 60, 960, 600, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(160, 60, 960, 600, 16);
    this.chaptersModal.add(panel);

    const title = this.scene.add.text(200, 90, 'CHAPTER SELECTION', {
      fontFamily: "'Cinzel', serif",
      fontSize: '22px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.chaptersModal.add(title);

    const closeBtn = this.scene.add.text(1080, 85, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => this.chaptersModal.setVisible(false));
    this.chaptersModal.add(closeBtn);

    this.chaptersListContainer = this.scene.add.container(200, 140);
    this.chaptersModal.add(this.chaptersListContainer);

    this.container.add(this.chaptersModal);
  }

  showChaptersModal() {
    this.chaptersModal.setVisible(true);
    this.chaptersListContainer.removeAll(true);
    const story = StoryManager.getInstance();
    const allChs = story.getAllChapters();

    let cY = 0;
    allChs.forEach(ch => {
      const isUnlocked = story.isChapterUnlocked(ch.id);
      const isCompleted = story.isChapterCompleted(ch.id);

      const card = this.scene.add.container(0, cY);

      const cBg = this.scene.add.graphics();
      cBg.fillStyle(0x111827, isUnlocked ? 0.9 : 0.4);
      cBg.fillRoundedRect(0, 0, 880, 85, 8);
      cBg.lineStyle(1.5, isUnlocked ? 0xd97706 : 0x334155, 0.8);
      cBg.strokeRoundedRect(0, 0, 880, 85, 8);
      card.add(cBg);

      const mark = isCompleted ? '✓' : (isUnlocked ? '▶' : '🔒');
      const markColor = isCompleted ? '#10b981' : (isUnlocked ? '#f59e0b' : '#64748b');
      const icon = this.scene.add.text(20, 26, mark, {
        fontFamily: "'Cinzel', serif",
        fontSize: '22px',
        color: markColor,
        fontStyle: 'bold'
      });
      card.add(icon);

      const chTitle = this.scene.add.text(60, 14, `${ch.title} — ${ch.subtitle}`, {
        fontFamily: "'Cinzel', serif",
        fontSize: '15px',
        color: isUnlocked ? '#ffffff' : '#64748b',
        fontStyle: 'bold'
      });
      card.add(chTitle);

      const desc = this.scene.add.text(60, 42, isUnlocked ? ch.description : 'Chapter locked. Complete previous chapters to unlock.', {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '12px',
        color: isUnlocked ? '#cbd5e1' : '#475569',
        wordWrap: { width: 660 }
      });
      card.add(desc);

      if (isUnlocked) {
        const playBtn = this.createButton(800, 42, 'PLAY', 0x92400e, () => {
          this.chaptersModal.setVisible(false);
          story.setChapter(ch.id);
          if (ch.id >= 5) {
            this.scene.scene.start('NeighborhoodScene');
          } else {
            this.scene.scene.start('VisualNovelScene', { chapterId: ch.id });
          }
        }, 80, 34);
        card.add(playBtn);
      }

      this.chaptersListContainer.add(card);
      cY += 95;
    });
  }

  createSettingsModal() {
    this.settings = SaveManager.getInstance().loadSettings();
    this.settingsModal = this.scene.add.container(0, 0);
    this.settingsModal.setDepth(1000);
    this.settingsModal.setVisible(false);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.9);
    bg.fillRect(0, 0, 1280, 720);
    this.settingsModal.add(bg);

    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(160, 60, 960, 600, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(160, 60, 960, 600, 16);
    this.settingsModal.add(panel);

    const title = this.scene.add.text(200, 85, 'AUDIO & GAME SETTINGS', {
      fontFamily: "'Cinzel', serif",
      fontSize: '22px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.settingsModal.add(title);

    const closeBtn = this.scene.add.text(1085, 80, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      SaveManager.getInstance().saveSettings(this.settings);
      AudioManager.getInstance().applySettings(this.settings);
      this.settingsModal.setVisible(false);
    });
    this.settingsModal.add(closeBtn);

    this.settingsContent = this.scene.add.container(200, 130);
    this.settingsModal.add(this.settingsContent);

    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', () => {
        if (this.settingsModal && this.settingsModal.visible) {
          this.renderSettingsContent();
        }
      });
    }

    this.container.add(this.settingsModal);
  }

  showSettingsModal() {
    this.settings = SaveManager.getInstance().loadSettings();
    this.settingsModal.setVisible(true);
    this.renderSettingsContent();
  }

  renderSettingsContent() {
    this.settingsContent.removeAll(true);
    const audio = AudioManager.getInstance();

    // Left Column: Audio Controls
    const audioHeader = this.scene.add.text(0, 5, 'AUDIO LEVELS', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.settingsContent.add(audioHeader);

    const audioSliders = [
      { key: 'masterVolume', label: 'Master Volume', channel: 'master' },
      { key: 'musicVolume', label: 'Music Volume', channel: 'music' },
      { key: 'sfxVolume', label: 'Sound Effects (SFX)', channel: 'sfx' },
      { key: 'dialogueVolume', label: 'Dialogue Volume', channel: 'dialogue' }
    ];

    let aY = 35;
    audioSliders.forEach(slider => {
      const currentVal = this.settings[slider.key] ?? 80;

      const lbl = this.scene.add.text(0, aY, slider.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: '#f8fafc'
      });
      this.settingsContent.add(lbl);

      const valTxt = this.scene.add.text(390, aY, `${currentVal}%`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: '#f59e0b',
        fontStyle: 'bold'
      }).setOrigin(1, 0);
      this.settingsContent.add(valTxt);

      // --- MINUS BUTTON [-] ---
      const minusBtn = this.scene.add.container(0, aY + 18);
      const mBg = this.scene.add.graphics();
      mBg.fillStyle(0x1e293b, 1);
      mBg.fillRoundedRect(0, 0, 32, 26, 4);
      mBg.lineStyle(1.5, 0x475569, 0.8);
      mBg.strokeRoundedRect(0, 0, 32, 26, 4);
      minusBtn.add(mBg);

      const mTxt = this.scene.add.text(16, 13, '−', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      minusBtn.add(mTxt);

      minusBtn.setSize(32, 26);
      minusBtn.setInteractive({ useHandCursor: true });
      minusBtn.on('pointerdown', () => {
        const newVal = Math.max(0, (this.settings[slider.key] ?? 80) - 5);
        this.settings[slider.key] = newVal;
        audio.setVolume(slider.channel, newVal / 100);
        audio.playSFX('click');
        SaveManager.getInstance().saveSettings(this.settings);
        this.renderSettingsContent();
      });
      this.settingsContent.add(minusBtn);

      // --- SLIDER TRACK (Width 290 px, x: 44 to 334) ---
      const trackX = 44;
      const trackW = 290;
      const barBg = this.scene.add.graphics();
      barBg.fillStyle(0x1e293b, 1);
      barBg.fillRoundedRect(trackX, aY + 24, trackW, 14, 7);
      this.settingsContent.add(barBg);

      const barFill = this.scene.add.graphics();
      barFill.fillStyle(0xd97706, 1);
      const fillW = Math.max(0, Math.min(trackW, trackW * (currentVal / 100)));
      barFill.fillRoundedRect(trackX, aY + 24, fillW, 14, 7);
      this.settingsContent.add(barFill);

      // Draggable thumb indicator
      const thumb = this.scene.add.graphics();
      thumb.fillStyle(0xfef08a, 1);
      thumb.fillCircle(trackX + fillW, aY + 31, 8);
      thumb.lineStyle(2, 0xd97706, 1);
      thumb.strokeCircle(trackX + fillW, aY + 31, 8);
      this.settingsContent.add(thumb);

      // Slider Hit & Drag Area
      const trackWorldStartX = 200 + trackX; // 244
      const hit = this.scene.add.zone(trackX + trackW / 2, aY + 31, trackW, 28).setInteractive({ useHandCursor: true });
      
      const updateFromPointer = (pointer) => {
        const ratio = Math.max(0, Math.min(1, (pointer.x - trackWorldStartX) / trackW));
        const val = Math.round(ratio * 100);
        this.settings[slider.key] = val;
        audio.setVolume(slider.channel, val / 100);
        SaveManager.getInstance().saveSettings(this.settings);
        this.renderSettingsContent();
      };

      hit.on('pointerdown', (pointer) => {
        audio.playSFX('click');
        updateFromPointer(pointer);
      });
      this.settingsContent.add(hit);

      // --- PLUS BUTTON [+] ---
      const plusBtn = this.scene.add.container(trackX + trackW + 12, aY + 18);
      const pBg = this.scene.add.graphics();
      pBg.fillStyle(0x1e293b, 1);
      pBg.fillRoundedRect(0, 0, 32, 26, 4);
      pBg.lineStyle(1.5, 0x475569, 0.8);
      pBg.strokeRoundedRect(0, 0, 32, 26, 4);
      plusBtn.add(pBg);

      const pTxt = this.scene.add.text(16, 13, '+', {
        fontFamily: 'sans-serif',
        fontSize: '18px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      plusBtn.add(pTxt);

      plusBtn.setSize(32, 26);
      plusBtn.setInteractive({ useHandCursor: true });
      plusBtn.on('pointerdown', () => {
        const newVal = Math.min(100, (this.settings[slider.key] ?? 80) + 5);
        this.settings[slider.key] = newVal;
        audio.setVolume(slider.channel, newVal / 100);
        audio.playSFX('click');
        SaveManager.getInstance().saveSettings(this.settings);
        this.renderSettingsContent();
      });
      this.settingsContent.add(plusBtn);

      aY += 56;
    });

    // Right Column: Gameplay & Display Controls
    const gameHeader = this.scene.add.text(460, 5, 'GAMEPLAY & DISPLAY', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.settingsContent.add(gameHeader);

    // 1. Screen Shake Toggle
    const shakeBtn = this.createToggle(460, 38, 'Screen Shake Effects', this.settings.screenShake, (val) => {
      this.settings.screenShake = val;
      SaveManager.getInstance().saveSettings(this.settings);
      this.renderSettingsContent();
    });
    this.settingsContent.add(shakeBtn);

    // 2. Visual Effects Toggle
    const vfxBtn = this.createToggle(460, 86, 'Cinematic Lighting & VFX', this.settings.visualEffects, (val) => {
      this.settings.visualEffects = val;
      SaveManager.getInstance().saveSettings(this.settings);
      this.renderSettingsContent();
    });
    this.settingsContent.add(vfxBtn);

    // 3. Fullscreen Toggle
    const isFs = !!(document.fullscreenElement || this.scene.scale.isFullscreen);
    const fsBtn = this.createToggle(460, 134, 'Fullscreen Mode', isFs, async (val) => {
      try {
        if (val) {
          if (this.scene.scale.startFullscreen) {
            this.scene.scale.startFullscreen();
          } else if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } else {
          if (this.scene.scale.stopFullscreen) {
            this.scene.scale.stopFullscreen();
          } else if (document.exitFullscreen) {
            await document.exitFullscreen();
          }
        }
      } catch (err) {
        console.warn('Fullscreen toggle request:', err);
      }
      this.settings.fullscreen = val;
      SaveManager.getInstance().saveSettings(this.settings);
      setTimeout(() => {
        if (this.settingsModal && this.settingsModal.visible) this.renderSettingsContent();
      }, 100);
    });
    this.settingsContent.add(fsBtn);

    // 4. Language Selector (English / Hinglish)
    const langSelector = this.createLanguageSelector(460, 182);
    this.settingsContent.add(langSelector);

    // 5. Dialogue Speed Selector (Slow / Normal / Fast / Instant)
    const speedSelector = this.createTextSpeedSelector(460, 230);
    this.settingsContent.add(speedSelector);

    // Keybindings Overview (Bottom)
    const keysHeader = this.scene.add.text(0, 290, 'KEYBOARD CONTROLS', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.settingsContent.add(keysHeader);

    const binds = [
      'WASD / Arrows: 2.5D Movement',
      'E: Context Interact / Talk',
      'SPACE / ENTER: Advance Dialogue',
      'C: Character Profile',
      'I: Inventory & Artifacts',
      'J: Quest Journal',
      'M: Mohalla Map',
      'ESC: Pause / Close Window'
    ];

    binds.forEach((bind, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bText = this.scene.add.text(col * 460, 320 + row * 24, `•  ${bind}`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '12px',
        color: '#cbd5e1'
      });
      this.settingsContent.add(bText);
    });
  }

  createToggle(x, y, label, currentValue, onToggle) {
    const group = this.scene.add.container(x, y);

    const lbl = this.scene.add.text(0, 6, label, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#f8fafc'
    });
    group.add(lbl);

    const btn = this.scene.add.container(360, 16);

    const bg = this.scene.add.graphics();
    bg.fillStyle(currentValue ? 0x15803d : 0x334155, 1);
    bg.fillRoundedRect(-36, -14, 72, 28, 6);
    bg.lineStyle(1.5, currentValue ? 0x22c55e : 0x475569, 0.9);
    bg.strokeRoundedRect(-36, -14, 72, 28, 6);
    btn.add(bg);

    const txt = this.scene.add.text(0, 0, currentValue ? 'ON' : 'OFF', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.add(txt);

    btn.setSize(72, 28);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      onToggle(!currentValue);
    });

    group.add(btn);
    return group;
  }

  createLanguageSelector(x, y) {
    const group = this.scene.add.container(x, y);

    const lbl = this.scene.add.text(0, 6, 'Language / Bhasha', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#f8fafc'
    });
    group.add(lbl);

    const curLang = this.settings.language || 'en';

    // English button
    const enBtn = this.scene.add.container(260, 16);
    const enActive = (curLang === 'en');
    const enBg = this.scene.add.graphics();
    enBg.fillStyle(enActive ? 0x15803d : 0x1e293b, 1);
    enBg.fillRoundedRect(-44, -14, 88, 28, 6);
    enBg.lineStyle(1.5, enActive ? 0x4ade80 : 0x475569, 0.9);
    enBg.strokeRoundedRect(-44, -14, 88, 28, 6);
    enBtn.add(enBg);

    const enTxt = this.scene.add.text(0, 0, enActive ? '✓ English' : 'English', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: enActive ? '#ffffff' : '#94a3b8',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    enBtn.add(enTxt);

    enBtn.setSize(88, 28);
    enBtn.setInteractive({ useHandCursor: true });
    enBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.settings.language = 'en';
      SaveManager.getInstance().saveSettings(this.settings);
      this.renderSettingsContent();
    });
    group.add(enBtn);

    // Hinglish button
    const hiBtn = this.scene.add.container(360, 16);
    const hiActive = (curLang === 'hinglish');
    const hiBg = this.scene.add.graphics();
    hiBg.fillStyle(hiActive ? 0xb45309 : 0x1e293b, 1);
    hiBg.fillRoundedRect(-44, -14, 88, 28, 6);
    hiBg.lineStyle(1.5, hiActive ? 0xf59e0b : 0x475569, 0.9);
    hiBg.strokeRoundedRect(-44, -14, 88, 28, 6);
    hiBtn.add(hiBg);

    const hiTxt = this.scene.add.text(0, 0, hiActive ? '✓ Hinglish' : 'Hinglish', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: hiActive ? '#ffffff' : '#94a3b8',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    hiBtn.add(hiTxt);

    hiBtn.setSize(88, 28);
    hiBtn.setInteractive({ useHandCursor: true });
    hiBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.settings.language = 'hinglish';
      SaveManager.getInstance().saveSettings(this.settings);
      this.renderSettingsContent();
    });
    group.add(hiBtn);

    return group;
  }

  createTextSpeedSelector(x, y) {
    const group = this.scene.add.container(x, y);

    const lbl = this.scene.add.text(0, 6, 'Dialogue Speed', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#f8fafc'
    });
    group.add(lbl);

    const curSpeed = this.settings.textSpeed || 'medium';
    const speeds = [
      { key: 'slow', label: 'Slow' },
      { key: 'medium', label: 'Normal' },
      { key: 'fast', label: 'Fast' },
      { key: 'instant', label: 'Instant' }
    ];

    speeds.forEach((spd, idx) => {
      const btnX = 180 + idx * 58;
      const btn = this.scene.add.container(btnX, 16);
      const isActive = (curSpeed === spd.key);

      const bg = this.scene.add.graphics();
      bg.fillStyle(isActive ? 0x0284c7 : 0x1e293b, 1);
      bg.fillRoundedRect(-26, -14, 52, 28, 4);
      bg.lineStyle(1.5, isActive ? 0x38bdf8 : 0x475569, 0.9);
      bg.strokeRoundedRect(-26, -14, 52, 28, 4);
      btn.add(bg);

      const txt = this.scene.add.text(0, 0, spd.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '10px',
        color: isActive ? '#ffffff' : '#94a3b8',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.add(txt);

      btn.setSize(52, 28);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.settings.textSpeed = spd.key;
        SaveManager.getInstance().saveSettings(this.settings);
        this.renderSettingsContent();
      });
      group.add(btn);
    });

    return group;
  }

  createCreditsModal() {
    this.creditsModal = this.scene.add.container(0, 0);
    this.creditsModal.setDepth(1000);
    this.creditsModal.setVisible(false);

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.9);
    bg.fillRect(0, 0, 1280, 720);
    this.creditsModal.add(bg);

    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(300, 120, 680, 480, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(300, 120, 680, 480, 16);
    this.creditsModal.add(panel);

    const title = this.scene.add.text(640, 170, 'THE LEGEND OF MAAJID', {
      fontFamily: "'Cinzel', serif",
      fontSize: '24px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.creditsModal.add(title);

    const body = this.scene.add.text(640, 310,
      'Created & Designed with Phaser 3/4 & Vite\n\n' +
      'Story & Concept:\n' +
      'Machhli Walo Ka Mohalla Chronicles\n\n' +
      'Primary Adult Basharat Reference:\n' +
      'public/assets/references/basharat-adult-reference.png\n\n' +
      'Audio & Music:\n' +
      'Procedural Web Audio Synthesis Engine\n\n' +
      'Thank you for playing!',
      {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        color: '#cbd5e1',
        align: 'center',
        lineSpacing: 6
      }
    ).setOrigin(0.5);
    this.creditsModal.add(body);

    const closeBtn = this.createButton(640, 520, 'CLOSE', 0x334155, () => {
      this.creditsModal.setVisible(false);
    }, 140, 38);
    this.creditsModal.add(closeBtn);

    this.container.add(this.creditsModal);
  }

  createButton(x, y, label, color, onClick, w = 120, h = 36) {
    const btn = this.scene.add.container(x, y);

    const bg = this.scene.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 6);
    btn.add(bg);

    const txt = this.scene.add.text(0, 0, label, {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.add(txt);

    btn.setSize(w, h);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      onClick();
    });

    return btn;
  }
}
