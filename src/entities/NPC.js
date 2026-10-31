import Phaser from 'phaser';

/**
 * NPC.js
 * Interactive NPC entity with proximity detection and conversation triggers.
 */

export class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, textureKey, name, promptLabel, interactionCallback) {
    super(scene, x, y, textureKey);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    this.npcName = name;
    this.promptLabel = promptLabel || `Talk to ${name}`;
    this.interactionCallback = interactionCallback;
    this.interactionRadius = 75;

    // Hitbox for depth
    this.body.setSize(30, 20);
    this.body.setOffset(9, 44);
    this.setDepth(this.y);

    // Subtle gentle breathing/idle animation
    scene.tweens.add({
      targets: this,
      scaleY: 1.03,
      duration: 1200 + Math.random() * 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  isPlayerNear(playerX, playerY) {
    const dist = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
    return dist <= this.interactionRadius;
  }

  interact() {
    if (this.interactionCallback) {
      this.interactionCallback();
    }
  }
}
