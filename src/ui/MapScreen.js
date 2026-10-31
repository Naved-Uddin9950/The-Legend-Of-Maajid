/**
 * MapScreen.js
 * Visual stylized neighbourhood map of Machhli Walo Ka Mohalla.
 * Displays player position marker, quest objectives, and key locations.
 */

import { UIManager } from '../systems/UIManager.js';
import { QuestManager } from '../systems/QuestManager.js';

export class MapScreen {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.createElements();
    this.hide();
  }

  createElements() {
    // Backdrop
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
    const title = this.scene.add.text(160, 85, 'MAP: MACHHLI WALO KA MOHALLA', {
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

    // Map Canvas Graphic Area (160..1120, y: 130..620 => 960 x 490)
    this.mapGraphic = this.scene.add.graphics();
    this.container.add(this.mapGraphic);

    this.mapContent = this.scene.add.container(160, 130);
    this.container.add(this.mapContent);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    this.mapGraphic.clear();
    this.mapContent.removeAll(true);

    const mx = 160;
    const my = 130;
    const mw = 960;
    const mh = 490;

    // Map background: Parchment coastal blueprint style
    this.mapGraphic.fillStyle(0x0f172a, 1);
    this.mapGraphic.fillRoundedRect(mx, my, mw, mh, 12);
    this.mapGraphic.lineStyle(1.5, 0x38bdf8, 0.5);
    this.mapGraphic.strokeRoundedRect(mx, my, mw, mh, 12);

    // Grid lines
    this.mapGraphic.lineStyle(1, 0x1e293b, 0.5);
    for (let x = mx; x < mx + mw; x += 60) {
      this.mapGraphic.lineBetween(x, my, x, my + mh);
    }
    for (let y = my; y < my + mh; y += 60) {
      this.mapGraphic.lineBetween(mx, y, mx + mw, y);
    }

    // Coastal Water on East/Top
    this.mapGraphic.fillStyle(0x0369a1, 0.35);
    this.mapGraphic.fillRect(mx + mw - 140, my, 140, mh);

    const seaLabel = this.scene.add.text(mw - 70, mh / 2, 'ARABIAN SEA / COAST', {
      fontFamily: "'Cinzel', serif",
      fontSize: '12px',
      color: '#38bdf8',
      fontStyle: 'bold'
    }).setOrigin(0.5).setRotation(-Math.PI / 2);
    this.mapContent.add(seaLabel);

    // Main Mohalla Paved Street (horizontal central artery)
    this.mapGraphic.fillStyle(0x334155, 0.8);
    this.mapGraphic.fillRect(mx + 60, my + 210, mw - 220, 70);

    const streetLabel = this.scene.add.text(mw / 2 - 50, 245, 'MAIN MOHALLA STREET (BAZAAR ROAD)', {
      fontFamily: "'Cinzel', serif",
      fontSize: '13px',
      color: '#94a3b8',
      fontStyle: 'bold',
      letterSpacing: 2
    }).setOrigin(0.5);
    this.mapContent.add(streetLabel);

    // Locations Definitions
    const locations = [
      {
        id: 'maajid_home',
        name: "Maajid's House",
        x: 180,
        y: 110,
        w: 160,
        h: 80,
        color: 0xd97706,
        type: 'home',
        desc: 'Home of Maajid Khan where his childhood began.'
      },
      {
        id: 'basharat_house',
        name: 'Basharat Manzil',
        x: 180,
        y: 300,
        w: 160,
        h: 80,
        color: 0x0284c7,
        type: 'tuition',
        desc: "Tuition center & home of Basharat Bhai (Age 24)."
      },
      {
        id: 'mohalla_hall',
        name: 'Mohalla Community Hall',
        x: 480,
        y: 90,
        w: 180,
        h: 100,
        color: 0x059669,
        type: 'hall',
        desc: 'Assembly grounds where Chacha Iqbal and mohalla elders meet.'
      },
      {
        id: 'fish_market',
        name: 'Machhli Bazaar (Fish Market)',
        x: 480,
        y: 300,
        w: 180,
        h: 90,
        color: 0xe11d48,
        type: 'market',
        desc: 'The vibrant local fish market providing fresh daily catch.'
      }
    ];

    locations.forEach(loc => {
      // Building block
      this.mapGraphic.fillStyle(loc.color, 0.75);
      this.mapGraphic.fillRoundedRect(mx + loc.x, my + loc.y, loc.w, loc.h, 8);
      this.mapGraphic.lineStyle(2, 0xffffff, 0.8);
      this.mapGraphic.strokeRoundedRect(mx + loc.x, my + loc.y, loc.w, loc.h, 8);

      const name = this.scene.add.text(loc.x + loc.w / 2, loc.y + loc.h / 2, loc.name, {
        fontFamily: "'Cinzel', serif",
        fontSize: '12px',
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: loc.w - 10 }
      }).setOrigin(0.5);
      this.mapContent.add(name);
    });

    // Player position marker (Maajid at 21 on the main street)
    const px = 260;
    const py = 245;

    this.mapGraphic.fillStyle(0xf59e0b, 1);
    this.mapGraphic.fillCircle(mx + px, my + py, 10);
    this.mapGraphic.lineStyle(3, 0xffffff, 1);
    this.mapGraphic.strokeCircle(mx + px, my + py, 10);

    const pLabel = this.scene.add.text(px, py - 20, 'YOU (MAAJID)', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#f59e0b',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.mapContent.add(pLabel);

    // Quest objective marker outside Basharat's house
    const qx = 260;
    const qy = 340;
    const qMarker = this.scene.add.text(qx, qy - 45, '★ QUEST OBJECTIVE', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#ef4444',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.mapContent.add(qMarker);

    // Compass in top-right
    const compass = this.scene.add.text(mw - 190, 30, '🧭 N ⇧', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#f59e0b',
      fontStyle: 'bold'
    });
    this.mapContent.add(compass);
  }
}
