/**
 * NotificationSystem.js
 * Toast and banner notification overlays for Location discoveries and Quest events.
 */

import { AudioManager } from '../systems/AudioManager.js';

export class NotificationSystem {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(640, -100);
    this.container.setDepth(4000);
    this.container.setScrollFactor(0);

    this.createElements();
  }

  createElements() {
    this.bg = this.scene.add.graphics();
    this.container.add(this.bg);

    this.titleText = this.scene.add.text(0, -12, '', {
      fontFamily: "'Cinzel', serif",
      fontSize: '14px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);
    this.container.add(this.titleText);

    this.subText = this.scene.add.text(0, 10, '', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.container.add(this.subText);
  }

  show(title, message, isLocation = false) {
    this.titleText.setText(title);
    this.subText.setText(message);

    const w = Math.max(380, Math.max(title.length, message.length) * 11 + 60);
    this.bg.clear();
    this.bg.fillStyle(0x0a0f1d, 0.95);
    this.bg.fillRoundedRect(-w / 2, -30, w, 60, 8);
    this.bg.lineStyle(1.5, isLocation ? 0x38bdf8 : 0xd97706, 0.9);
    this.bg.strokeRoundedRect(-w / 2, -30, w, 60, 8);

    AudioManager.getInstance().playSFX(isLocation ? 'hover' : 'quest_complete');

    this.scene.tweens.killTweensOf(this.container);
    this.container.setY(-100);

    // Slide down, linger, slide back up
    this.scene.tweens.add({
      targets: this.container,
      y: 60,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.scene.time.delayedCall(2800, () => {
          this.scene.tweens.add({
            targets: this.container,
            y: -100,
            duration: 350,
            ease: 'Power2.easeIn'
          });
        });
      }
    });
  }

  showLocation(name, description) {
    this.show(name.toUpperCase(), description, true);
  }

  showQuest(title, objective) {
    this.show(`QUEST UPDATED: ${title.toUpperCase()}`, objective, false);
  }
}
