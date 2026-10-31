/**
 * RelationshipScreen.js
 * Shows standings, bond levels, and key history milestones with important characters.
 */

import { RelationshipManager } from '../systems/RelationshipManager.js';
import { UIManager } from '../systems/UIManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class RelationshipScreen {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.selectedKey = 'basharat';
    this.createElements();
    this.hide();
  }

  createElements() {
    // Dim background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x020617, 0.88);
    bg.fillRect(0, 0, 1280, 720);
    this.container.add(bg);

    // Modal frame
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x0a0f1d, 0.98);
    panel.fillRoundedRect(120, 60, 1040, 600, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(120, 60, 1040, 600, 16);
    this.container.add(panel);

    // Header Title
    const title = this.scene.add.text(160, 85, 'RELATIONSHIPS & BONDS', {
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

    // Left List Container (160..580)
    this.listContainer = this.scene.add.container(160, 140);
    this.container.add(this.listContainer);

    // Right Details Container (600..1120)
    this.detailsContainer = this.scene.add.container(600, 140);
    this.container.add(this.detailsContainer);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    const rels = RelationshipManager.getInstance().getAllRelationships();
    this.listContainer.removeAll(true);

    let rowY = 0;
    rels.forEach(r => {
      const isSelected = r.id === this.selectedKey;
      const card = this.scene.add.container(0, rowY);

      const cBg = this.scene.add.graphics();
      cBg.fillStyle(isSelected ? 0x1e293b : 0x0f172a, 0.9);
      cBg.fillRoundedRect(0, 0, 410, 80, 8);
      cBg.lineStyle(1.5, isSelected ? 0xf59e0b : 0x334155, 0.8);
      cBg.strokeRoundedRect(0, 0, 410, 80, 8);
      card.add(cBg);

      // Thumbnail
      if (r.portrait && this.scene.textures.exists(r.portrait)) {
        const thumb = this.scene.add.image(42, 40, r.portrait);
        thumb.setDisplaySize(54, 64);
        card.add(thumb);
      }

      // Name & status
      const name = this.scene.add.text(80, 16, r.name, {
        fontFamily: "'Cinzel', serif",
        fontSize: '14px',
        color: isSelected ? '#f59e0b' : '#f8fafc',
        fontStyle: 'bold'
      });
      card.add(name);

      const status = this.scene.add.text(80, 38, r.status, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        color: '#38bdf8'
      });
      card.add(status);

      // Bond bar
      const barBg = this.scene.add.graphics();
      barBg.fillStyle(0x1f2937, 1);
      barBg.fillRoundedRect(80, 58, 200, 6, 3);
      card.add(barBg);

      const barFill = this.scene.add.graphics();
      const col = r.value > 50 ? 0x10b981 : (r.value > 25 ? 0xf59e0b : 0xef4444);
      barFill.fillStyle(col, 1);
      barFill.fillRoundedRect(80, 58, 200 * (r.value / 100), 6, 3);
      card.add(barFill);

      const val = this.scene.add.text(290, 54, `${r.value}%`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        color: '#cbd5e1'
      });
      card.add(val);

      card.setSize(410, 80);
      card.setInteractive({ useHandCursor: true });
      card.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.selectedKey = r.id;
        this.refresh();
      });

      this.listContainer.add(card);
      rowY += 92;
    });

    this.renderDetails();
  }

  renderDetails() {
    this.detailsContainer.removeAll(true);
    const r = RelationshipManager.getInstance().getRelationship(this.selectedKey);
    if (!r) return;

    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.85);
    bg.fillRoundedRect(0, 0, 520, 480, 10);
    bg.lineStyle(1, 0x334155, 0.6);
    bg.strokeRoundedRect(0, 0, 520, 480, 10);
    this.detailsContainer.add(bg);

    // Large Portrait
    if (r.portrait && this.scene.textures.exists(r.portrait)) {
      const port = this.scene.add.image(100, 110, r.portrait);
      port.setDisplaySize(140, 175);
      this.detailsContainer.add(port);

      const frame = this.scene.add.graphics();
      frame.lineStyle(1.5, 0xd97706, 0.8);
      frame.strokeRect(30, 22, 140, 175);
      this.detailsContainer.add(frame);
    }

    // Name & Title
    const name = this.scene.add.text(190, 30, r.name, {
      fontFamily: "'Cinzel', serif",
      fontSize: '18px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.detailsContainer.add(name);

    const status = this.scene.add.text(190, 60, `Affinity: ${r.status}`, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.detailsContainer.add(status);

    const desc = this.scene.add.text(190, 90, r.description, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      color: '#cbd5e1',
      wordWrap: { width: 310 },
      lineSpacing: 4
    });
    this.detailsContainer.add(desc);

    // Timeline Events
    const evTitle = this.scene.add.text(30, 220, 'KEY RELATIONSHIP MEMORIES', {
      fontFamily: "'Cinzel', serif",
      fontSize: '13px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.detailsContainer.add(evTitle);

    let evY = 250;
    (r.events || []).forEach(ev => {
      const item = this.scene.add.text(30, evY, `•  ${ev}`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '12px',
        color: '#e2e8f0',
        wordWrap: { width: 460 },
        lineSpacing: 4
      });
      this.detailsContainer.add(item);
      evY += 36;
    });
  }
}
