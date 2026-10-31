/**
 * SettingsScreen.js
 * Comprehensive settings menu supporting Audio sliders, Text speed, Fullscreen,
 * Keybinds overview, Screen Shake, and local persistence.
 */

import { SaveManager } from '../systems/SaveManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { UIManager } from '../systems/UIManager.js';

export class SettingsScreen {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(0, 0);
    this.container.setDepth(3000);
    this.container.setScrollFactor(0);

    this.settings = SaveManager.getInstance().loadSettings();
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
    panel.fillRoundedRect(160, 60, 960, 600, 16);
    panel.lineStyle(2.5, 0xd97706, 0.9);
    panel.strokeRoundedRect(160, 60, 960, 600, 16);
    this.container.add(panel);

    // Header Title
    const title = this.scene.add.text(200, 85, 'SETTINGS & CONFIGURATION', {
      fontFamily: "'Cinzel', serif",
      fontSize: '22px',
      color: '#f59e0b',
      fontStyle: 'bold',
      letterSpacing: 2
    });
    this.container.add(title);

    // Close button
    const closeBtn = this.scene.add.text(1085, 80, '✕', {
      fontFamily: 'sans-serif',
      fontSize: '22px',
      color: '#94a3b8'
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    closeBtn.on('pointerdown', () => {
      SaveManager.getInstance().saveSettings(this.settings);
      UIManager.getInstance().closeCurrentModal();
    });
    this.container.add(closeBtn);

    // Settings Content Container
    this.content = this.scene.add.container(200, 135);
    this.container.add(this.content);
  }

  show() {
    this.container.setVisible(true);
    this.refresh();
  }

  hide() {
    this.container.setVisible(false);
  }

  refresh() {
    this.content.removeAll(true);
    const audio = AudioManager.getInstance();

    // ==========================================
    // AUDIO CONTROLS (Left side: 0..420)
    // ==========================================
    const audioHeader = this.scene.add.text(0, 10, 'AUDIO LEVELS', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.content.add(audioHeader);

    const audioSliders = [
      { key: 'masterVolume', label: 'Master Volume', channel: 'master' },
      { key: 'musicVolume', label: 'Music Volume', channel: 'music' },
      { key: 'sfxVolume', label: 'Sound Effects (SFX)', channel: 'sfx' },
      { key: 'dialogueVolume', label: 'Dialogue Volume', channel: 'dialogue' }
    ];

    let aY = 45;
    audioSliders.forEach(slider => {
      const currentVal = this.settings[slider.key];

      const lbl = this.scene.add.text(0, aY, slider.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: '#f8fafc'
      });
      this.content.add(lbl);

      const valTxt = this.scene.add.text(390, aY, `${currentVal}%`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '13px',
        color: '#f59e0b',
        fontStyle: 'bold'
      }).setOrigin(1, 0);
      this.content.add(valTxt);

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
        const newVal = Math.max(0, this.settings[slider.key] - 5);
        this.settings[slider.key] = newVal;
        audio.setVolume(slider.channel, newVal / 100);
        audio.playSFX('click');
        SaveManager.getInstance().saveSettings(this.settings);
        this.refresh();
      });
      this.content.add(minusBtn);

      // --- SLIDER TRACK (Width 290 px, x: 44 to 334) ---
      const trackX = 44;
      const trackW = 290;
      const barBg = this.scene.add.graphics();
      barBg.fillStyle(0x1e293b, 1);
      barBg.fillRoundedRect(trackX, aY + 24, trackW, 14, 7);
      this.content.add(barBg);

      const barFill = this.scene.add.graphics();
      barFill.fillStyle(0xd97706, 1);
      const fillW = Math.max(0, Math.min(trackW, trackW * (currentVal / 100)));
      barFill.fillRoundedRect(trackX, aY + 24, fillW, 14, 7);
      this.content.add(barFill);

      // Draggable thumb indicator
      const thumb = this.scene.add.graphics();
      thumb.fillStyle(0xfef08a, 1);
      thumb.fillCircle(trackX + fillW, aY + 31, 8);
      thumb.lineStyle(2, 0xd97706, 1);
      thumb.strokeCircle(trackX + fillW, aY + 31, 8);
      this.content.add(thumb);

      // Slider Hit & Drag Area
      const trackWorldStartX = 200 + trackX; // 200 container offset + 44 track start = 244
      const hit = this.scene.add.zone(trackX + trackW / 2, aY + 31, trackW, 28).setInteractive({ useHandCursor: true });
      hit.on('pointerdown', (pointer) => {
        const ratio = Math.max(0, Math.min(1, (pointer.x - trackWorldStartX) / trackW));
        const val = Math.round(ratio * 100);
        this.settings[slider.key] = val;
        audio.setVolume(slider.channel, val / 100);
        audio.playSFX('click');
        SaveManager.getInstance().saveSettings(this.settings);
        this.refresh();
      });
      this.content.add(hit);

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
        const newVal = Math.min(100, this.settings[slider.key] + 5);
        this.settings[slider.key] = newVal;
        audio.setVolume(slider.channel, newVal / 100);
        audio.playSFX('click');
        SaveManager.getInstance().saveSettings(this.settings);
        this.refresh();
      });
      this.content.add(plusBtn);

      aY += 58;
    });

    // ==========================================
    // GAMEPLAY & DISPLAY (Right side: 460..880)
    // ==========================================
    const gameHeader = this.scene.add.text(460, 10, 'GAMEPLAY & DISPLAY', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.content.add(gameHeader);

    // Screen Shake Toggle
    const shakeBtn = this.createToggle(460, 50, 'Screen Shake Effects', this.settings.screenShake, (val) => {
      this.settings.screenShake = val;
      SaveManager.getInstance().saveSettings(this.settings);
      this.refresh();
    });
    this.content.add(shakeBtn);

    // Visual Effects Toggle
    const vfxBtn = this.createToggle(460, 110, 'Cinematic Lighting & VFX', this.settings.visualEffects, (val) => {
      this.settings.visualEffects = val;
      SaveManager.getInstance().saveSettings(this.settings);
      this.refresh();
    });
    this.content.add(vfxBtn);

    // Fullscreen Toggle
    const isFs = !!(document.fullscreenElement || this.scene.scale.isFullscreen);
    const fsBtn = this.createToggle(460, 170, 'Fullscreen Mode', isFs, async () => {
      try {
        if (!document.fullscreenElement && !this.scene.scale.isFullscreen) {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (this.scene.scale.startFullscreen) {
            this.scene.scale.startFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen();
          } else if (this.scene.scale.stopFullscreen) {
            this.scene.scale.stopFullscreen();
          }
        }
      } catch (err) {
        console.warn('Fullscreen request:', err);
      }
      setTimeout(() => {
        if (this.container.visible) this.refresh();
      }, 150);
    });
    this.content.add(fsBtn);

    // Language Toggle (English / Hinglish-Ready)
    const langBtn = this.createToggle(460, 230, `Language: ${this.settings.language === 'en' ? 'English' : 'Hinglish'}`, true, () => {
      this.settings.language = this.settings.language === 'en' ? 'hinglish' : 'en';
      this.refresh();
    });
    this.content.add(langBtn);

    // ==========================================
    // KEYBINDINGS OVERVIEW (Bottom: y: 320..460)
    // ==========================================
    const keysHeader = this.scene.add.text(0, 310, 'KEYBOARD CONTROLS', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.content.add(keysHeader);

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
      const bText = this.scene.add.text(col * 460, 345 + row * 26, `•  ${bind}`, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '12px',
        color: '#cbd5e1'
      });
      this.content.add(bText);
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
    bg.fillRoundedRect(-40, -14, 80, 28, 14);
    btn.add(bg);

    const txt = this.scene.add.text(0, 0, currentValue ? 'ON' : 'OFF', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.add(txt);

    btn.setSize(80, 28);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      onToggle(!currentValue);
    });

    group.add(btn);
    return group;
  }
}
