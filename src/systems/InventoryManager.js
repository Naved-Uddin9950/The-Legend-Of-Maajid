/**
 * InventoryManager.js
 * Tracks items, quantities, categories, and inspections.
 */

import { INVENTORY_ITEMS } from '../data/items/inventoryItems.js';

export class InventoryManager {
  static instance = null;

  static getInstance() {
    if (!InventoryManager.instance) {
      InventoryManager.instance = new InventoryManager();
    }
    return InventoryManager.instance;
  }

  constructor() {
    this.reset();
  }

  reset() {
    this.items = {};
    // Initial story inventory items based on progression
    this.addItem('chhayyam_elathalam', 1);
    this.addItem('pocket_knife', 1);
    this.addItem('tuition_notebook', 1);
    this.addItem('prescription_glasses', 1);
    this.addItem('mohalla_map', 1);
  }

  addItem(itemId, qty = 1) {
    if (!INVENTORY_ITEMS[itemId]) return;
    if (!this.items[itemId]) {
      this.items[itemId] = {
        ...INVENTORY_ITEMS[itemId],
        quantity: 0
      };
    }
    this.items[itemId].quantity += qty;
  }

  removeItem(itemId, qty = 1) {
    if (this.items[itemId]) {
      this.items[itemId].quantity -= qty;
      if (this.items[itemId].quantity <= 0) {
        delete this.items[itemId];
      }
    }
  }

  hasItem(itemId) {
    return !!(this.items[itemId] && this.items[itemId].quantity > 0);
  }

  getItem(itemId) {
    return this.items[itemId] || null;
  }

  getAllItems() {
    return Object.values(this.items);
  }

  exportData() {
    return JSON.parse(JSON.stringify(this.items));
  }

  importData(data) {
    if (!data) return;
    this.items = JSON.parse(JSON.stringify(data));
  }
}
