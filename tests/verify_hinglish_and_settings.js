import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--window-size=1280,720',
  'http://localhost:4173/'
]);

let msgId = 1;
function sendCommand(ws, method, params = {}) {
  return new Promise((resolve) => {
    const id = msgId++;
    const handler = (ev) => {
      const res = JSON.parse(ev.data);
      if (res.id === id) {
        ws.removeEventListener('message', handler);
        resolve(res.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

function evaluate(ws, expr) {
  return sendCommand(ws, 'Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function waitForChromePort(maxAttempts = 15) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const data = await new Promise((resolve, reject) => {
        const req = http.get('http://127.0.0.1:9222/json', (res) => {
          let str = '';
          res.on('data', c => str += c);
          res.on('end', () => resolve(str));
        });
        req.on('error', reject);
      });
      const pages = JSON.parse(data);
      const page = pages.find(t => t.type === 'page');
      if (page) return page;
    } catch (e) {
      await sleep(500);
    }
  }
  throw new Error('Chrome did not open port 9222 in time');
}

async function run() {
  try {
    const page = await waitForChromePort();
    const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
    
    ws.onopen = async () => {
      console.log('Connected to Chrome DevTools Protocol');
      await sleep(2800);

      // Start Chapter 1 directly with Hinglish and Instant text speed
      await evaluate(ws, `
        (() => {
          const game = window.__MAAJID_GAME__;
          const settings = {
            masterVolume: 80,
            musicVolume: 70,
            sfxVolume: 80,
            dialogueVolume: 90,
            fullscreen: false,
            textSpeed: 'instant',
            autoDialogue: false,
            fontSize: 18,
            language: 'hinglish',
            screenShake: true,
            visualEffects: true
          };
          localStorage.setItem('the_legend_of_maajid_settings_v1', JSON.stringify(settings));
          const menuScene = game.scene.getScene('MainMenuScene');
          menuScene.scene.start('VisualNovelScene', { chapterId: 1 });
          return true;
        })()
      `);
      await sleep(1500);

      // Dismiss intro card
      await evaluate(ws, `
        (() => {
          const game = window.__MAAJID_GAME__;
          const vnScene = game.scene.getScene('VisualNovelScene');
          vnScene.input.emit('pointerdown');
          return true;
        })()
      `);
      await sleep(800);

      // Capture Chapter 1 full Hinglish narration
      const shot1 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/India/.gemini/antigravity/brain/4f6ff12d-87c9-49bc-9270-0865e2cc703c/screenshot_chapter1_hinglish_full_narration.png', Buffer.from(shot1.data, 'base64'));
      console.log('Captured screenshot_chapter1_hinglish_full_narration.png');

      // Advance to dialogue 2 (Maajid's introduction)
      await evaluate(ws, `
        (() => {
          const game = window.__MAAJID_GAME__;
          const vnScene = game.scene.getScene('VisualNovelScene');
          vnScene.dialogueBox.advance();
          return true;
        })()
      `);
      await sleep(400);

      // Advance to dialogue 3 (Maajid speaking: "Mere raaste se hat jaao.")
      await evaluate(ws, `
        (() => {
          const game = window.__MAAJID_GAME__;
          const vnScene = game.scene.getScene('VisualNovelScene');
          vnScene.dialogueBox.advance();
          return true;
        })()
      `);
      await sleep(800);

      // Capture Maajid speaking in Hinglish with portrait and nameplate
      const shot2 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/India/.gemini/antigravity/brain/4f6ff12d-87c9-49bc-9270-0865e2cc703c/screenshot_chapter1_maajid_hinglish_full.png', Buffer.from(shot2.data, 'base64'));
      console.log('Captured screenshot_chapter1_maajid_hinglish_full.png');

      // Advance to dialogue 4 (Firoz blocking alleyway)
      await evaluate(ws, `
        (() => {
          const game = window.__MAAJID_GAME__;
          const vnScene = game.scene.getScene('VisualNovelScene');
          vnScene.dialogueBox.advance();
          return true;
        })()
      `);
      await sleep(400);

      // Advance to dialogue 5 (Firoz speaking: "Dekho is chote chuhe ko...")
      await evaluate(ws, `
        (() => {
          const game = window.__MAAJID_GAME__;
          const vnScene = game.scene.getScene('VisualNovelScene');
          vnScene.dialogueBox.advance();
          return true;
        })()
      `);
      await sleep(800);

      // Capture Firoz speaking in Hinglish with portrait and nameplate
      const shot3 = await sendCommand(ws, 'Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync('C:/Users/India/.gemini/antigravity/brain/4f6ff12d-87c9-49bc-9270-0865e2cc703c/screenshot_chapter1_firoz_hinglish_full.png', Buffer.from(shot3.data, 'base64'));
      console.log('Captured screenshot_chapter1_firoz_hinglish_full.png');

      console.log('All full text screenshots captured!');
      chrome.kill();
      process.exit(0);
    };
  } catch (err) {
    console.error('Run failed:', err);
    chrome.kill();
    process.exit(1);
  }
}

run();
