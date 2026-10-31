/**
 * Player.js
 * 2.5D RPG Player controller for Adult Maajid.
 * Features 4-directional movement, dynamic depth sorting by Y-coordinate, and footstep audio.
 */

import Phaser from 'phaser';
import { AudioManager } from '../systems/AudioManager.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_sprite_sheet', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = 180;
    this.direction = 'down';
    this.isMoving = false;
    this.stepTimer = 0;

    // Hitbox for 2.5D feet collision
    this.body.setSize(26, 18);
    this.body.setOffset(11, 46);
    this.setCollideWorldBounds(true);

    this.createAnimations();
  }

  createAnimations() {
    // Row 0: Down (frames 0..2)
    if (!this.scene.anims.exists('player_walk_down')) {
      this.scene.anims.create({
        key: 'player_walk_down',
        frames: this.scene.anims.generateFrameNumbers('player_sprite_sheet', { start: 0, end: 2 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // Row 1: Left (frames 3..5)
    if (!this.scene.anims.exists('player_walk_left')) {
      this.scene.anims.create({
        key: 'player_walk_left',
        frames: this.scene.anims.generateFrameNumbers('player_sprite_sheet', { start: 3, end: 5 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // Row 2: Right (frames 6..8)
    if (!this.scene.anims.exists('player_walk_right')) {
      this.scene.anims.create({
        key: 'player_walk_right',
        frames: this.scene.anims.generateFrameNumbers('player_sprite_sheet', { start: 6, end: 8 }),
        frameRate: 8,
        repeat: -1
      });
    }

    // Row 3: Up (frames 9..11)
    if (!this.scene.anims.exists('player_walk_up')) {
      this.scene.anims.create({
        key: 'player_walk_up',
        frames: this.scene.anims.generateFrameNumbers('player_sprite_sheet', { start: 9, end: 11 }),
        frameRate: 8,
        repeat: -1
      });
    }
  }

  update(cursors, wasdKeys, delta) {
    // 2.5D Depth Sorting: deeper objects in front
    this.setDepth(this.y);

    let vx = 0;
    let vy = 0;

    const left = cursors.left.isDown || (wasdKeys && wasdKeys.A.isDown);
    const right = cursors.right.isDown || (wasdKeys && wasdKeys.D.isDown);
    const up = cursors.up.isDown || (wasdKeys && wasdKeys.W.isDown);
    const down = cursors.down.isDown || (wasdKeys && wasdKeys.S.isDown);

    if (left) {
      vx = -this.speed;
      this.direction = 'left';
    } else if (right) {
      vx = this.speed;
      this.direction = 'right';
    }

    if (up) {
      vy = -this.speed;
      this.direction = 'up';
    } else if (down) {
      vy = this.speed;
      this.direction = 'down';
    }

    // Diagonal normalization
    if (vx !== 0 && vy !== 0) {
      vx *= 0.7071;
      vy *= 0.7071;
    }

    this.setVelocity(vx, vy);

    this.isMoving = vx !== 0 || vy !== 0;

    if (this.isMoving) {
      this.anims.play(`player_walk_${this.direction}`, true);

      // Footstep sound timing
      this.stepTimer += delta;
      if (this.stepTimer > 320) {
        this.stepTimer = 0;
        AudioManager.getInstance().playSFX('footstep');
      }
    } else {
      this.anims.stop();
      // Stand on default frame for direction
      const idleFrames = { down: 0, left: 3, right: 6, up: 9 };
      this.setFrame(idleFrames[this.direction]);
    }
  }
}
