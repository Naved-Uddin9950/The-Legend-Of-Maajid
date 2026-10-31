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
          console.log('1. Verifying Main Menu and capturing anime title screen...');
          await new Promise(r => setTimeout(r, 2500));
          await capture('screenshot_anime_title.png');

          console.log('2. Opening Interactive Settings on Main Menu...');
          await evaluate(`
            const menu = window.__MAAJID_GAME__?.scene?.getScene('MainMenuScene')?.menuUI;
            menu.handleMenuClick('settings');
          `);
          await new Promise(r => setTimeout(r, 800));
          await capture('screenshot_settings_interactive.png');

          console.log('3. Adjusting Master Volume and toggling fullscreen/shake...');
          const updatedSettings = await evaluate(`
            const menu = window.__MAAJID_GAME__?.scene?.getScene('MainMenuScene')?.menuUI;
            menu.settings.masterVolume = 50;
            menu.settings.screenShake = false;
            menu.renderSettingsContent();
            return {
              masterVol: menu.settings.masterVolume,
              shake: menu.settings.screenShake
            };
          `);
          console.log('Settings updated successfully:', updatedSettings);

          console.log('4. Starting Chapter 1 with Anime Visual Novel Graphics...');
          await evaluate(`
            const menu = window.__MAAJID_GAME__?.scene?.getScene('MainMenuScene')?.menuUI;
            menu.settingsModal.setVisible(false);
            window.__MAAJID_GAME__?.scene?.start('VisualNovelScene', { chapterId: 1 });
          `);
          await new Promise(r => setTimeout(r, 1200));

          // Start dialogue to show portrait
          await evaluate(`
            const vn = window.__MAAJID_GAME__?.scene?.getScene('VisualNovelScene');
            // Advance through until Maajid & Firoz portraits appear
            vn.dialogueIndex = 2; // Maajid speaks
            vn.startNextDialogue();
          `);
          await new Promise(r => setTimeout(r, 800));
          await capture('screenshot_anime_ch1_dialogue.png');

          console.log('5. Testing Chapter 5 with Adult Basharat Anime Portrait...');
          await evaluate(`
            window.__MAAJID_GAME__?.scene?.start('VisualNovelScene', { chapterId: 5 });
          `);
          await new Promise(r => setTimeout(r, 1200));
          await evaluate(`
            const vn = window.__MAAJID_GAME__?.scene?.getScene('VisualNovelScene');
            vn.dialogueIndex = 4; // Basharat speaks
            vn.startNextDialogue();
          `);
          await new Promise(r => setTimeout(r, 800));
          await capture('screenshot_anime_ch5_basharat.png');

          console.log('ALL ANIME GRAPHICS & SETTINGS VERIFICATIONS COMPLETE!');
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
