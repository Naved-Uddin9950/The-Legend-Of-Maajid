/**
 * SettingsScreen.js
 * In-game pause menu settings panel.
 * Supports:
 * - Master, Music, SFX, Dialogue volume sliders with [-] and [+] step buttons
 * - Screen Shake Effects & Cinematic VFX toggles
 * - Fullscreen toggle
 * - Language selector: [ English ] / [ Hinglish ]
 * - Dialogue Speed selector: [ Slow ] / [ Normal ] / [ Fast ] / [ Instant ]
 * - Keyboard controls quick reference
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
      AudioManager.getInstance().applySettings(this.settings);
      UIManager.getInstance().closeCurrentModal();
    });
    this.container.add(closeBtn);

    // Settings Content Container
    this.content = this.scene.add.container(200, 130);
    this.container.add(this.content);
  }

  show() {
    this.settings = SaveManager.getInstance().loadSettings();
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
    const audioHeader = this.scene.add.text(0, 5, 'AUDIO LEVELS', {
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

    let aY = 35;
    audioSliders.forEach(slider => {
      const currentVal = this.settings[slider.key] ?? 80;

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
        const newVal = Math.max(0, (this.settings[slider.key] ?? 80) - 5);
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
      const trackWorldStartX = 200 + trackX; // 244
      const hit = this.scene.add.zone(trackX + trackW / 2, aY + 31, trackW, 28).setInteractive({ useHandCursor: true });

      const updateFromPointer = (pointer) => {
        const ratio = Math.max(0, Math.min(1, (pointer.x - trackWorldStartX) / trackW));
        const val = Math.round(ratio * 100);
        this.settings[slider.key] = val;
        audio.setVolume(slider.channel, val / 100);
        SaveManager.getInstance().saveSettings(this.settings);
        this.refresh();
      };

      hit.on('pointerdown', (pointer) => {
        audio.playSFX('click');
        updateFromPointer(pointer);
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
        const newVal = Math.min(100, (this.settings[slider.key] ?? 80) + 5);
        this.settings[slider.key] = newVal;
        audio.setVolume(slider.channel, newVal / 100);
        audio.playSFX('click');
        SaveManager.getInstance().saveSettings(this.settings);
        this.refresh();
      });
      this.content.add(plusBtn);

      aY += 56;
    });

    // ==========================================
    // GAMEPLAY & DISPLAY (Right side: 460..880)
    // ==========================================
    const gameHeader = this.scene.add.text(460, 5, 'GAMEPLAY & DISPLAY', {
      fontFamily: "'Cinzel', serif",
      fontSize: '15px',
      color: '#38bdf8',
      fontStyle: 'bold'
    });
    this.content.add(gameHeader);

    // 1. Screen Shake Toggle
    const shakeBtn = this.createToggle(460, 38, 'Screen Shake Effects', this.settings.screenShake, (val) => {
      this.settings.screenShake = val;
      SaveManager.getInstance().saveSettings(this.settings);
      this.refresh();
    });
    this.content.add(shakeBtn);

    // 2. Visual Effects Toggle
    const vfxBtn = this.createToggle(460, 86, 'Cinematic Lighting & VFX', this.settings.visualEffects, (val) => {
      this.settings.visualEffects = val;
      SaveManager.getInstance().saveSettings(this.settings);
      this.refresh();
    });
    this.content.add(vfxBtn);

    // 3. Fullscreen Toggle
    const isFs = !!(document.fullscreenElement || this.scene.scale.isFullscreen);
    const fsBtn = this.createToggle(460, 134, 'Fullscreen Mode', isFs, async (val) => {
      try {
        if (val) {
          if (this.scene.scale.startFullscreen) {
            this.scene.scale.startFullscreen();
          } else if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } else {
          if (this.scene.scale.stopFullscreen) {
            this.scene.scale.stopFullscreen();
          } else if (document.exitFullscreen) {
            await document.exitFullscreen();
          }
        }
      } catch (err) {
        console.warn('Fullscreen toggle request:', err);
      }
      this.settings.fullscreen = val;
      SaveManager.getInstance().saveSettings(this.settings);
      setTimeout(() => {
        if (this.container.visible) this.refresh();
      }, 100);
    });
    this.content.add(fsBtn);

    // 4. Language Selector (English / Hinglish)
    const langSelector = this.createLanguageSelector(460, 182);
    this.content.add(langSelector);

    // 5. Dialogue Speed Selector (Slow / Normal / Fast / Instant)
    const speedSelector = this.createTextSpeedSelector(460, 230);
    this.content.add(speedSelector);

    // ==========================================
    // KEYBINDINGS OVERVIEW (Bottom: y: 290..400)
    // ==========================================
    const keysHeader = this.scene.add.text(0, 290, 'KEYBOARD CONTROLS', {
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
      const bText = this.scene.add.text(col * 460, 320 + row * 24, `•  ${bind}`, {
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
    bg.fillRoundedRect(-36, -14, 72, 28, 6);
    bg.lineStyle(1.5, currentValue ? 0x22c55e : 0x475569, 0.9);
    bg.strokeRoundedRect(-36, -14, 72, 28, 6);
    btn.add(bg);

    const txt = this.scene.add.text(0, 0, currentValue ? 'ON' : 'OFF', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    btn.add(txt);

    btn.setSize(72, 28);
    btn.setInteractive({ useHandCursor: true });
    btn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      onToggle(!currentValue);
    });

    group.add(btn);
    return group;
  }

  createLanguageSelector(x, y) {
    const group = this.scene.add.container(x, y);

    const lbl = this.scene.add.text(0, 6, 'Language / Bhasha', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#f8fafc'
    });
    group.add(lbl);

    const curLang = this.settings.language || 'en';

    // English button
    const enBtn = this.scene.add.container(260, 16);
    const enActive = (curLang === 'en');
    const enBg = this.scene.add.graphics();
    enBg.fillStyle(enActive ? 0x15803d : 0x1e293b, 1);
    enBg.fillRoundedRect(-44, -14, 88, 28, 6);
    enBg.lineStyle(1.5, enActive ? 0x4ade80 : 0x475569, 0.9);
    enBg.strokeRoundedRect(-44, -14, 88, 28, 6);
    enBtn.add(enBg);

    const enTxt = this.scene.add.text(0, 0, enActive ? '✓ English' : 'English', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: enActive ? '#ffffff' : '#94a3b8',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    enBtn.add(enTxt);

    enBtn.setSize(88, 28);
    enBtn.setInteractive({ useHandCursor: true });
    enBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.settings.language = 'en';
      SaveManager.getInstance().saveSettings(this.settings);
      this.refresh();
    });
    group.add(enBtn);

    // Hinglish button
    const hiBtn = this.scene.add.container(360, 16);
    const hiActive = (curLang === 'hinglish');
    const hiBg = this.scene.add.graphics();
    hiBg.fillStyle(hiActive ? 0xb45309 : 0x1e293b, 1);
    hiBg.fillRoundedRect(-44, -14, 88, 28, 6);
    hiBg.lineStyle(1.5, hiActive ? 0xf59e0b : 0x475569, 0.9);
    hiBg.strokeRoundedRect(-44, -14, 88, 28, 6);
    hiBtn.add(hiBg);

    const hiTxt = this.scene.add.text(0, 0, hiActive ? '✓ Hinglish' : 'Hinglish', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '11px',
      color: hiActive ? '#ffffff' : '#94a3b8',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    hiBtn.add(hiTxt);

    hiBtn.setSize(88, 28);
    hiBtn.setInteractive({ useHandCursor: true });
    hiBtn.on('pointerdown', () => {
      AudioManager.getInstance().playSFX('click');
      this.settings.language = 'hinglish';
      SaveManager.getInstance().saveSettings(this.settings);
      this.refresh();
    });
    group.add(hiBtn);

    return group;
  }

  createTextSpeedSelector(x, y) {
    const group = this.scene.add.container(x, y);

    const lbl = this.scene.add.text(0, 6, 'Dialogue Speed', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '13px',
      color: '#f8fafc'
    });
    group.add(lbl);

    const curSpeed = this.settings.textSpeed || 'medium';
    const speeds = [
      { key: 'slow', label: 'Slow' },
      { key: 'medium', label: 'Normal' },
      { key: 'fast', label: 'Fast' },
      { key: 'instant', label: 'Instant' }
    ];

    speeds.forEach((spd, idx) => {
      const btnX = 180 + idx * 58;
      const btn = this.scene.add.container(btnX, 16);
      const isActive = (curSpeed === spd.key);

      const bg = this.scene.add.graphics();
      bg.fillStyle(isActive ? 0x0284c7 : 0x1e293b, 1);
      bg.fillRoundedRect(-26, -14, 52, 28, 4);
      bg.lineStyle(1.5, isActive ? 0x38bdf8 : 0x475569, 0.9);
      bg.strokeRoundedRect(-26, -14, 52, 28, 4);
      btn.add(bg);

      const txt = this.scene.add.text(0, 0, spd.label, {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: '10px',
        color: isActive ? '#ffffff' : '#94a3b8',
        fontStyle: 'bold'
      }).setOrigin(0.5);
      btn.add(txt);

      btn.setSize(52, 28);
      btn.setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        AudioManager.getInstance().playSFX('click');
        this.settings.textSpeed = spd.key;
        SaveManager.getInstance().saveSettings(this.settings);
        this.refresh();
      });
      group.add(btn);
    });

    return group;
  }
}
