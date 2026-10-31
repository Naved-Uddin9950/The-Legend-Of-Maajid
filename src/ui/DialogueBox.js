/**
 * DialogueBox.js
 * Cinematic Visual Novel dialogue presentation.
 * Supports:
 * - English & Authentic Hinglish language switching
 * - Adjustable Typewriter Text Speed (slow, medium, fast, instant)
 * - Respects Screen Shake & Visual Effects settings
 * - Glassmorphism UI panel and vector choice buttons
 * - Speaker nameplate, character portraits, and advancement
 */

import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager.js';
import { SaveManager } from '../systems/SaveManager.js';

export class DialogueBox {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(2000);
    this.container.setScrollFactor(0);

    this.onCompleteCallback = null;
    this.isTyping = false;
    this.fullText = '';
    this.typeIndex = 0;
    this.typeTimer = null;
    this.currentDialogue = null;
    this.waitingForChoice = false;

    this.createElements();
    this.bindInputs();
    this.hide();
  }

  createElements() {
    // Backdrop shadow/dimmer for cinematic focus
    this.backdrop = this.scene.add.graphics();
    this.backdrop.fillStyle(0x000000, 0.45);
    this.backdrop.fillRect(0, 460, 1280, 260);
    this.container.add(this.backdrop);

    // Left Character Portrait Container (Bust portrait)
    this.leftPortrait = this.scene.add.image(210, 520, 'portrait_maajid_age_8');
    this.leftPortrait.setOrigin(0.5, 1);
    this.leftPortrait.setDisplaySize(280, 360);
    this.container.add(this.leftPortrait);

    // Right Character Portrait Container (for conversation partner)
    this.rightPortrait = this.scene.add.image(1070, 520, 'portrait_firoz_age_20');
    this.rightPortrait.setOrigin(0.5, 1);
    this.rightPortrait.setDisplaySize(280, 360);
    this.container.add(this.rightPortrait);

    // Main Dialogue Box Panel (1060 x 180)
    this.boxGraphic = this.scene.add.graphics();
    // Glassmorphism deep midnight slate fill
    this.boxGraphic.fillStyle(0x080c18, 0.94);
    this.boxGraphic.fillRoundedRect(110, 505, 1060, 180, 12);
    // Warm golden amber border
    this.boxGraphic.lineStyle(2, 0xd97706, 0.95);
    this.boxGraphic.strokeRoundedRect(110, 505, 1060, 180, 12);
    // Delicate inner border line
    this.boxGraphic.lineStyle(1, 0xf59e0b, 0.25);
    this.boxGraphic.strokeRoundedRect(114, 509, 1052, 172, 8);
    this.container.add(this.boxGraphic);

    // Interactive Hit Area for Click-to-Advance
    this.boxHitZone = this.scene.add.zone(640, 595, 1060, 180).setInteractive({ useHandCursor: true });
    this.boxHitZone.on('pointerdown', () => this.advance());
    this.container.add(this.boxHitZone);

    // Speaker Nameplate Container
    this.nameplateContainer = this.scene.add.container(140, 468);
    this.nameplateBg = this.scene.add.graphics();
    this.nameplateBg.fillStyle(0x0f172a, 0.97);
    this.nameplateBg.fillRoundedRect(0, 0, 220, 36, 6);
    this.nameplateBg.lineStyle(1.5, 0xf59e0b, 0.95);
    this.nameplateBg.strokeRoundedRect(0, 0, 220, 36, 6);
    this.nameplateContainer.add(this.nameplateBg);

    this.speakerText = this.scene.add.text(110, 18, 'Maajid', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 1.5
    }).setOrigin(0.5);
    this.nameplateContainer.add(this.speakerText);
    this.container.add(this.nameplateContainer);

    // Main Dialogue Text with typewriter
    this.dialogueText = this.scene.add.text(150, 532, '', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '18px',
      color: '#f8fafc',
      wordWrap: { width: 970, useAdvancedWrap: true },
      lineSpacing: 8
    });
    this.container.add(this.dialogueText);

    // Subtle pulsating Continue Indicator arrow
    this.continueIndicator = this.scene.add.text(1130, 655, '▼ [SPACE]', {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.container.add(this.continueIndicator);

    this.scene.tweens.add({
      targets: this.continueIndicator,
      y: 660,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Choices Container
    this.choicesContainer = this.scene.add.container(640, 420);
    this.container.add(this.choicesContainer);
  }

  bindInputs() {
    this.spaceKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.enterKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.spaceKey.on('down', () => this.advance());
    this.enterKey.on('down', () => this.advance());
  }

  showDialogue(dialogue, onComplete) {
    this.currentDialogue = dialogue;
    this.onCompleteCallback = onComplete;
    this.waitingForChoice = false;
    this.container.setVisible(true);

    const settings = SaveManager.getInstance().loadSettings();
    const isHinglish = (settings.language === 'hinglish');

    // Determine speaker name based on language
    let speaker = dialogue.speaker || '';
    if (isHinglish && dialogue.speaker_hinglish !== undefined) {
      speaker = dialogue.speaker_hinglish;
    }

    this.speakerText.setText(speaker);
    this.nameplateContainer.setVisible(speaker !== '' && speaker !== 'Narrator');

    // Update portraits
    if (dialogue.portrait && this.scene.textures.exists(dialogue.portrait)) {
      if (speaker === 'Maajid') {
        this.leftPortrait.setTexture(dialogue.portrait);
        this.leftPortrait.setDisplaySize(280, 360);
        this.leftPortrait.setVisible(true);
        this.leftPortrait.setTint(0xffffff);
        this.rightPortrait.setTint(0x71717a);
      } else {
        this.rightPortrait.setTexture(dialogue.portrait);
        this.rightPortrait.setDisplaySize(280, 360);
        this.rightPortrait.setVisible(true);
        this.rightPortrait.setTint(0xffffff);
        this.leftPortrait.setTint(0x71717a);
      }
    } else {
      if (!dialogue.portrait || speaker === 'Narrator' || speaker === '') {
        this.leftPortrait.setVisible(false);
        this.rightPortrait.setVisible(false);
      }
    }

    // SFX
    if (dialogue.sfx) {
      AudioManager.getInstance().playSFX(dialogue.sfx);
    }

    // Screen shake (respects settings)
    if (dialogue.shake && settings.screenShake !== false) {
      this.scene.cameras.main.shake(300, 0.015);
    }

    // Visual effects / flash (respects settings)
    if (dialogue.action === 'screen_flash' && settings.visualEffects !== false) {
      this.scene.cameras.main.flash(200, 255, 255, 255);
    }

    // Dialogue text based on language
    this.fullText = (isHinglish && dialogue.text_hinglish) ? dialogue.text_hinglish : (dialogue.text || '');
    this.dialogueText.setText('');
    this.typeIndex = 0;
    this.isTyping = true;
    this.continueIndicator.setVisible(false);
    this.clearChoices();

    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }

    // Calculate typewriter speed from settings
    let charInterval = 18; // Default medium
    if (settings.textSpeed === 'slow') charInterval = 38;
    else if (settings.textSpeed === 'fast') charInterval = 7;
    else if (settings.textSpeed === 'instant') charInterval = 0;

    if (charInterval === 0) {
      // Instant display
      this.finishTyping();
    } else {
      this.typeTimer = setInterval(() => {
        if (this.typeIndex < this.fullText.length) {
          this.dialogueText.setText(this.fullText.substring(0, this.typeIndex + 1));
          if (this.typeIndex % 3 === 0) {
            AudioManager.getInstance().playSFX('typewriter');
          }
          this.typeIndex++;
        } else {
          this.finishTyping();
        }
      }, charInterval);
    }
  }

  finishTyping() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
    this.dialogueText.setText(this.fullText);
    this.isTyping = false;

    // Check if dialogue has choices
    if (this.currentDialogue && this.currentDialogue.choices && this.currentDialogue.choices.length > 0) {
      this.renderChoices(this.currentDialogue.choices);
    } else {
      this.continueIndicator.setVisible(true);
    }
  }

  advance() {
    if (!this.container.visible || this.waitingForChoice) return;

    if (this.isTyping) {
      this.finishTyping();
    } else {
      AudioManager.getInstance().playSFX('click');
      if (this.onCompleteCallback) {
        const cb = this.onCompleteCallback;
        this.onCompleteCallback = null;
        cb();
      }
    }
  }

  renderChoices(choices) {
    this.waitingForChoice = true;
    this.clearChoices();
    this.continueIndicator.setVisible(false);

    const settings = SaveManager.getInstance().loadSettings();
    const isHinglish = (settings.language === 'hinglish');

    choices.forEach((choice, idx) => {
      const choiceBtn = this.scene.add.container(0, idx * 54);

      // Sleek vector glassmorphism background
      const btnBg = this.scene.add.graphics();
      btnBg.fillStyle(0x0f172a, 0.95);
      btnBg.fillRoundedRect(-270, -22, 540, 44, 8);
      btnBg.lineStyle(1.5, 0xd97706, 0.9);
      btnBg.strokeRoundedRect(-270, -22, 540, 44, 8);
      choiceBtn.add(btnBg);

      const choiceLabel = (isHinglish && choice.text_hinglish) ? choice.text_hinglish : choice.text;
      const btnTxt = this.scene.add.text(0, 0, choiceLabel, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '15px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      choiceBtn.add(btnTxt);

      const hitZone = this.scene.add.zone(0, 0, 540, 44).setInteractive({ useHandCursor: true });
      hitZone.on('pointerover', () => {
        AudioManager.getInstance().playSFX('hover');
        btnBg.clear();
        btnBg.fillStyle(0x92400e, 0.95);
        btnBg.fillRoundedRect(-270, -22, 540, 44, 8);
        btnBg.lineStyle(2, 0xf59e0b, 1);
        btnBg.strokeRoundedRect(-270, -22, 540, 44, 8);
        btnTxt.setColor('#ffffff');
      });
      hitZone.on('pointerout', () => {
        btnBg.clear();
        btnBg.fillStyle(0x0f172a, 0.95);
        btnBg.fillRoundedRect(-270, -22, 540, 44, 8);
        btnBg.lineStyle(1.5, 0xd97706, 0.9);
        btnBg.strokeRoundedRect(-270, -22, 540, 44, 8);
        btnTxt.setColor('#f8fafc');
      });
      hitZone.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.waitingForChoice = false;
        this.clearChoices();
        if (choice.callback) choice.callback();
        this.advance();
      });
      choiceBtn.add(hitZone);

      this.choicesContainer.add(choiceBtn);
    });
  }

  clearChoices() {
    this.choicesContainer.removeAll(true);
  }

  hide() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
    this.container.setVisible(false);
  }
}
