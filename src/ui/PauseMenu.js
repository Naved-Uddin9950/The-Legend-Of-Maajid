/**
 * PauseMenu.js
 * In-game pause menu providing navigation to Character, Inventory, Journal, Map, Save, Settings, and Main Menu.
 */

import { UIManager } from '../systems/UIManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class PauseMenu {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.createElements();
    this.hide();
  }

  createElements() {
    // Dim background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.88);
    bg.fillRect(0, 0, 1280, 720);
    this.container.add(bg);

    // Modal frame (440 x 580)
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0f172a, 0.98);
    panel.fillRoundedRect(420, 70, 440, 580, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(420, 70, 440, 580, 16);
    this.container.add(panel);

    // Header Title
    const title = this.scene.add.text(640, 115, 'PAUSED', {
      fontFamily: "'Cinzel', serif",
      fontSize: '26px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 3
    }).setOrigin(0.5);
    this.container.add(title);

    const sub = this.scene.add.text(640, 145, 'THE LEGEND OF MAAJID', {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#94a3b8',
      letterSpacing: 2
    }).setOrigin(0.5);
    this.container.add(sub);

    // Menu options list
    const options = [
      { label: 'Resume Game', action: () => UIManager.getInstance().closeCurrentModal() },
      { label: 'Character Profile [C]', action: () => UIManager.getInstance().openModal('character') },
      { label: 'Inventory [I]', action: () => UIManager.getInstance().openModal('inventory') },
      { label: 'Quest Journal [J]', action: () => UIManager.getInstance().openModal('journal') },
      { label: 'Mohalla Map [M]', action: () => UIManager.getInstance().openModal('map') },
      { label: 'Story Timeline', action: () => UIManager.getInstance().openModal('timeline') },
      { label: 'Save Game', action: () => UIManager.getInstance().openModal('save') },
      { label: 'Settings', action: () => UIManager.getInstance().openModal('settings') },
      { label: 'Main Menu', action: () => this.confirmMainMenu() }
    ];

    let startY = 190;
    options.forEach(opt => {
      const btn = this.scene.add.container(640, startY);

      const bBg = this.scene.add.graphics();
      bBg.fillStyle(0x1e293b, 0.9);
      bBg.fillRoundedRect(-170, -18, 340, 38, 6);
      bBg.lineStyle(1.5, 0x475569, 0.7);
      bBg.strokeRoundedRect(-170, -18, 340, 38, 6);
      btn.add(bBg);

      const bText = this.scene.add.text(0, 0, opt.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        color: '#f8fafc',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.add(bText);

      btn.setSize(340, 38);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerover', () => {
        AudioManager.getInstance().playSFX('hover');
        bBg.clear();
        bBg.fillStyle(0x92400e, 1);
        bBg.fillRoundedRect(-170, -18, 340, 38, 6);
        bBg.lineStyle(1.5, 0xf59e0b, 1);
        bBg.strokeRoundedRect(-170, -18, 340, 38, 6);
        bText.setColor('#fef08a');
      });
      btn.on('pointerout', () => {
        bBg.clear();
        bBg.fillStyle(0x1e293b, 0.9);
        bBg.fillRoundedRect(-170, -18, 340, 38, 6);
        bBg.lineStyle(1.5, 0x475569, 0.7);
        bBg.strokeRoundedRect(-170, -18, 340, 38, 6);
        bText.setColor('#f8fafc');
      });
      btn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        opt.action();
      });

      this.container.add(btn);
      startY += 48;
    });

    // Close button in top-right
    const closeBtn = this.scene.add.text(830, 85, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => UIManager.getInstance().closeCurrentModal());
    this.container.add(closeBtn);
  }

  confirmMainMenu() {
    UIManager.getInstance().closeCurrentModal();
    this.scene.scene.start('MainMenuScene');
  }

  show() {
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }
}
