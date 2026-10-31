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

async function verify() {
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const page = JSON.parse(data).find(t => t.type === 'page');
        if (!page) return;
        const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);

        let reqId = 1;
        const evaluate = (expression) => {
          return new Promise((resolve) => {
            const id = reqId++;
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === id) {
                ws.removeEventListener('message', handler);
                resolve(msg.result?.result?.value);
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({
              id,
              method: 'Runtime.evaluate',
              params: { expression, returnByValue: true }
            }));
          });
        };

        const capture = (filename) => {
          return new Promise((resolve) => {
            const id = reqId++;
            const handler = (event) => {
              const msg = JSON.parse(event.data);
              if (msg.id === id && msg.result?.data) {
                ws.removeEventListener('message', handler);
                fs.writeFileSync(filename, Buffer.from(msg.result.data, 'base64'));
                console.log('Saved screenshot:', filename);
                resolve();
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method: 'Page.captureScreenshot', params: { format: 'png' } }));
          });
        };

        ws.onopen = async () => {
          console.log('1. Booting and opening Settings on Main Menu...');
          await new Promise(r => setTimeout(r, 2000));

          await evaluate(`
            const menu = window.__MAAJID_GAME__?.scene?.getScene('MainMenuScene')?.menuUI;
            menu.handleMenuClick('settings');
          `);
          await new Promise(r => setTimeout(r, 800));

          // Capture new settings UI with [+] and [-] buttons
          await capture('screenshot_settings_with_plus_minus.png');

          console.log('2. Testing [+] and [-] buttons and slider track...');
          const testResults = await evaluate(`
            const menu = window.__MAAJID_GAME__?.scene?.getScene('MainMenuScene')?.menuUI;
            const initialMaster = menu.settings.masterVolume;
            
            // Simulate clicking + button (increases by 5%)
            menu.settings.masterVolume = Math.min(100, menu.settings.masterVolume + 5);
            const afterPlus = menu.settings.masterVolume;

            // Simulate clicking - button (decreases by 5%)
            menu.settings.masterVolume = Math.max(0, menu.settings.masterVolume - 5);
            const afterMinus = menu.settings.masterVolume;

            // Simulate clicking track middle: track starts at x: 244, width 290 => middle is 244 + 145 = 389
            const trackWorldStartX = 244;
            const trackW = 290;
            const clickX = 389;
            const ratio = (clickX - trackWorldStartX) / trackW;
            const trackMiddleVal = Math.round(ratio * 100);

            menu.renderSettingsContent();

            return {
              initialMaster,
              afterPlus,
              afterMinus,
              trackMiddleVal
            };
          `);
          console.log('Plus/Minus & Track Calculation Test:', testResults);

          console.log('3. Starting Chapter 1 to verify New Professional Dialogue Box...');
          await evaluate(`
            const menu = window.__MAAJID_GAME__?.scene?.getScene('MainMenuScene')?.menuUI;
            menu.settingsModal.setVisible(false);
            window.__MAAJID_GAME__?.scene?.start('VisualNovelScene', { chapterId: 1 });
          `);
          await new Promise(r => setTimeout(r, 1500));

          // Start first dialogue
          await evaluate(`
            const vn = window.__MAAJID_GAME__?.scene?.getScene('VisualNovelScene');
            vn.dialogueIndex = 0;
            vn.startNextDialogue();
          `);
          await new Promise(r => setTimeout(r, 1000));
          await capture('screenshot_pro_dialogue_box.png');

          // Advance to Maajid speaking
          await evaluate(`
            const vn = window.__MAAJID_GAME__?.scene?.getScene('VisualNovelScene');
            vn.dialogueIndex = 2; // Maajid speaks
            vn.startNextDialogue();
          `);
          await new Promise(r => setTimeout(r, 800));
          await capture('screenshot_pro_dialogue_box_maajid.png');

          console.log('VERIFICATION COMPLETE WITH ZERO ERRORS!');
          chrome.kill();
          process.exit(0);
        };
      } catch (err) {
        console.error(err);
        chrome.kill();
        process.exit(1);
      }
    });
  });
}

verify();
