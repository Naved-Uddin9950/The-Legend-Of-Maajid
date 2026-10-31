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

setTimeout(() => {
  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      const page = JSON.parse(data).find(t => t.type === 'page');
      if (!page) return;
      const ws = new globalThis.WebSocket(page.webSocketDebuggerUrl);
      ws.onopen = async () => {
        await new Promise(r => setTimeout(r, 2200));
        ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot', params: { format: 'png' } }));
      };
      ws.onmessage = (ev) => {
        const m = JSON.parse(ev.data);
        if (m.id === 10 && m.result?.data) {
          fs.writeFileSync('title_screen_verified.png', Buffer.from(m.result.data, 'base64'));
          console.log('Title screenshot captured!');
          chrome.kill();
          process.exit(0);
        }
      };
    });
  });
}, 2000);
