/**
 * InventoryScreen.js
 * Visual inventory menu displaying item cards, categories, quantities, and inspection pane.
 */

import { InventoryManager } from '../systems/InventoryManager.js';
import { UIManager } from '../systems/UIManager.js';
import { AudioManager } from '../systems/AudioManager.js';

export class InventoryScreen {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.selectedItemId = null;
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
    const title = this.scene.add.text(160, 85, 'INVENTORY & ARTIFACTS', {
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

    // Left Grid Container for Items (160..660)
    this.gridContainer = this.scene.add.container(160, 140);
    this.container.add(this.gridContainer);

    // Right Inspection Container (690..1120)
    this.inspectorContainer = this.scene.add.container(700, 140);
    this.container.add(this.inspectorContainer);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    const inv = InventoryManager.getInstance();
    const items = inv.getAllItems();

    this.gridContainer.removeAll(true);

    if (items.length === 0) {
      const empty = this.scene.add.text(0, 30, 'Inventory is empty.', {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '14px',
        color: '#64748b'
      });
      this.gridContainer.add(empty);
      this.inspectorContainer.removeAll(true);
      return;
    }

    if (!this.selectedItemId || !items.some(it => it.id === this.selectedItemId)) {
      this.selectedItemId = items[0].id;
    }

    // Grid layout: 2 columns
    items.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col * 255;
      const y = row * 90;

      const card = this.scene.add.container(x, y);
      const isSelected = item.id === this.selectedItemId;

      const cBg = this.scene.add.graphics();
      cBg.fillStyle(isSelected ? 0x1e293b : 0x0f172a, 0.9);
      cBg.fillRoundedRect(0, 0, 245, 80, 8);
      cBg.lineStyle(1.5, isSelected ? 0xf59e0b : 0x334155, 0.8);
      cBg.strokeRoundedRect(0, 0, 245, 80, 8);
      card.add(cBg);

      // Icon
      if (item.icon && this.scene.textures.exists(item.icon)) {
        const icon = this.scene.add.image(36, 40, item.icon);
        icon.setDisplaySize(48, 48);
        card.add(icon);
      }

      // Title & quantity
      const name = this.scene.add.text(70, 16, item.name, {
        fontFamily: "'Cinzel', serif",
        fontSize: '13px',
        color: isSelected ? '#f59e0b' : '#f8fafc',
        fontStyle: 'bold',
        wordWrap: { width: 165 }
      });
      card.add(name);

      const qty = this.scene.add.text(70, 48, `Qty: ${item.quantity}  •  ${item.category}`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '11px',
        color: '#94a3b8'
      });
      card.add(qty);

      card.setSize(245, 80);
      card.setInteractive({ useHandCursor: true });
      card.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.selectedItemId = item.id;
        this.refresh();
      });

      this.gridContainer.add(card);
    });

    this.renderInspector();
  }

  renderInspector() {
    this.inspectorContainer.removeAll(true);
    const item = InventoryManager.getInstance().getItem(this.selectedItemId);
    if (!item) return;

    // Inspection panel background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0f172a, 0.85);
    bg.fillRoundedRect(0, 0, 420, 480, 10);
    bg.lineStyle(1, 0x334155, 0.6);
    bg.strokeRoundedRect(0, 0, 420, 480, 10);
    this.inspectorContainer.add(bg);

    // Large Icon preview
    if (item.icon && this.scene.textures.exists(item.icon)) {
      const icon = this.scene.add.image(210, 80, item.icon);
      icon.setDisplaySize(96, 96);
      this.inspectorContainer.add(icon);
    }

    // Name
    const name = this.scene.add.text(210, 150, item.name, {
      fontFamily: "'Cinzel', serif",
      fontSize: '18px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.inspectorContainer.add(name);

    // Category badge
    const cat = this.scene.add.text(210, 180, item.category.toUpperCase(), {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '12px',
      color: '#38bdf8',
      fontStyle: 'bold',
      letterSpacing: 1
    }).setOrigin(0.5);
    this.inspectorContainer.add(cat);

    // Separator line
    const sep = this.scene.add.graphics();
    sep.lineStyle(1, 0x334155, 0.7);
    sep.lineBetween(30, 210, 390, 210);
    this.inspectorContainer.add(sep);

    // Description & lore
    const desc = this.scene.add.text(30, 230, item.description, {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#cbd5e1',
      wordWrap: { width: 360 },
      lineSpacing: 6
    });
    this.inspectorContainer.add(desc);
  }
}
