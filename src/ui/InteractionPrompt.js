/**
 * InteractionPrompt.js
 * Context-sensitive interaction pill displayed at bottom-centre when near interactive entities.
 */

export class InteractionPrompt {
  constructor(scene) {
    this.scene = scene;
    this.container = scene.add.container(640, 570);
    this.container.setDepth(1500);
    this.container.setScrollFactor(0);

    this.createElements();
    this.hide();
  }

  createElements() {
    this.bg = this.scene.add.graphics();
    this.container.add(this.bg);

    this.text = this.scene.add.text(0, 0, '[E] Interact', {
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontSize: '14px',
      color: '#f8fafc',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.container.add(this.text);

    // Subtle breathing animation
    this.scene.tweens.add({
      targets: this.container,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  showPrompt(actionText) {
    this.text.setText(actionText);
    const w = this.text.width + 44;

    this.bg.clear();
    this.bg.fillStyle(0x0f172a, 0.95);
    this.bg.fillRoundedRect(-w / 2, -18, w, 36, 18);
    this.bg.lineStyle(1.5, 0xf59e0b, 0.9);
    this.bg.strokeRoundedRect(-w / 2, -18, w, 36, 18);

    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }
}
