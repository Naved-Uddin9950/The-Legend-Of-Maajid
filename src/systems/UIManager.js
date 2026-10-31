/**
 * UIManager.js
 * Centralized state controller for opening, closing, and toggling RPG modal menus.
 * Prevents overlapping windows and coordinates game pause state.
 */

export class UIManager {
  static instance = null;

  static getInstance() {
    if (!UIManager.instance) {
      UIManager.instance = new UIManager();
    }
    return UIManager.instance;
  }

  constructor() {
    this.currentModal = null;
    this.modalRegistry = {};
    this.hud = null;
    this.notifications = null;
    this.interactionPrompt = null;
    this.dialogueBox = null;
    this.activeScene = null;
  }

  registerScene(scene) {
    this.activeScene = scene;
  }

  registerModal(name, component) {
    this.modalRegistry[name] = component;
  }

  registerHUD(hud) {
    this.hud = hud;
  }

  registerNotifications(notifications) {
    this.notifications = notifications;
  }

  registerInteractionPrompt(prompt) {
    this.interactionPrompt = prompt;
  }

  registerDialogueBox(box) {
    this.dialogueBox = box;
  }

  isModalOpen() {
    return this.currentModal !== null;
  }

  getCurrentModal() {
    return this.currentModal;
  }

  openModal(name, data = null) {
    if (this.currentModal === name) return;

    // Close existing modal if open
    if (this.currentModal && this.modalRegistry[this.currentModal]) {
      this.modalRegistry[this.currentModal].hide();
    }

    if (this.modalRegistry[name]) {
      this.currentModal = name;
      this.modalRegistry[name].show(data);

      if (this.hud) {
        this.hud.setInteractable(false);
      }
    }
  }

  closeCurrentModal() {
    if (this.currentModal && this.modalRegistry[this.currentModal]) {
      this.modalRegistry[this.currentModal].hide();
      this.currentModal = null;

      if (this.hud) {
        this.hud.setInteractable(true);
      }
    }
  }

  toggleModal(name) {
    if (this.currentModal === name) {
      this.closeCurrentModal();
    } else {
      this.openModal(name);
    }
  }
}
