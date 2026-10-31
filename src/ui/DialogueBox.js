/**
 * DialogueBox.js
 * Cinematic Visual Novel dialogue presentation.
 * Features typewriter text, speaker nameplate, character portraits, choices, and keyboard/mouse advancement.
 */

import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager.js';

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

    // Main Dialogue Box Panel (1060 x 175)
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
    this.nameplateBg.fillRoundedRect(0, 0, 200, 36, 6);
    this.nameplateBg.lineStyle(1.5, 0xf59e0b, 0.95);
    this.nameplateBg.strokeRoundedRect(0, 0, 200, 36, 6);
    this.nameplateContainer.add(this.nameplateBg);

    this.speakerText = this.scene.add.text(100, 18, 'Maajid', {
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

    // Speaker & portraits
    const speaker = dialogue.speaker || '';
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
      if (speaker === 'Narrator') {
        this.leftPortrait.setVisible(false);
        this.rightPortrait.setVisible(false);
      }
    }

    // SFX & screen effects
    if (dialogue.sfx) {
      AudioManager.getInstance().playSFX(dialogue.sfx);
    }
    if (dialogue.shake) {
      this.scene.cameras.main.shake(300, 0.015);
    }
    if (dialogue.action === 'screen_flash') {
      this.scene.cameras.main.flash(200, 255, 255, 255);
    }

    // Typewriter
    this.fullText = dialogue.text;
    this.dialogueText.setText('');
    this.typeIndex = 0;
    this.isTyping = true;
    this.continueIndicator.setVisible(false);
    this.clearChoices();

    if (this.typeTimer) clearInterval(this.typeTimer);
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
    }, 20);
  }

  finishTyping() {
    if (this.typeTimer) {
      clearInterval(this.typeTimer);
      this.typeTimer = null;
    }
    this.dialogueText.setText(this.fullText);
    this.isTyping = false;

    // Check if dialogue has choices
    if (this.currentDialogue.choices && this.currentDialogue.choices.length > 0) {
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

    choices.forEach((choice, idx) => {
      const choiceBtn = this.scene.add.container(0, idx * 56);

      const btnBg = this.scene.add.image(0, 0, 'ui_choice_btn');
      btnBg.setDisplaySize(540, 46);
      choiceBtn.add(btnBg);

      const btnTxt = this.scene.add.text(0, 0, choice.text, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '15px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      choiceBtn.add(btnTxt);

      btnBg.setInteractive({ useHandCursor: true });
      btnBg.on('pointerover', () => {
        AudioManager.getInstance().playSFX('hover');
        btnTxt.setColor('#f59e0b');
      });
      btnBg.on('pointerout', () => {
        btnTxt.setColor('#f8fafc');
      });
      btnBg.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.waitingForChoice = false;
        this.clearChoices();
        if (choice.callback) choice.callback();
        this.advance();
      });

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
