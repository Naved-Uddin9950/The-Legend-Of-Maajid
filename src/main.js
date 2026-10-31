/**
 * main.js
 * Main game entry point.
 */

import Phaser from 'phaser';
import { gameConfig } from './game/config.js';

window.Phaser = Phaser;

window.addEventListener('DOMContentLoaded', () => {
  const game = new Phaser.Game(gameConfig);
  window.__MAAJID_GAME__ = game;
});

