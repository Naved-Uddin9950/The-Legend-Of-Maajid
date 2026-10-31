import http from 'node:http';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--disable-gpu',
  '--no-sandbox',
  'http://localhost:4173/'
]);

async function check() {
  await new Promise(r => setTimeout(r, 2000));

  http.get('http://127.0.0.1:9222/json', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', async () => {
      try {
        const list = JSON.parse(data);
        console.log('Found Chrome targets:', list.length);
        const page = list.find(t => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          console.log('Page target found:', page.title, page.url);
          const wsUrl = page.webSocketDebuggerUrl;
          const { WebSocket } = await import('vite'); // or use native WebSocket in Node 22+
          const ws = new globalThis.WebSocket(wsUrl);

          const logs = [];
          ws.onopen = () => {
            console.log('WS Connected to Chrome CDP');
            ws.send(JSON.stringify({ id: 1, method: 'Console.enable' }));
            ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
            ws.send(JSON.stringify({ id: 3, method: 'Page.enable' }));
          };

          ws.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            if (msg.method === 'Console.messageAdded') {
              console.log('CONSOLE:', msg.params.message.text);
              logs.push(msg.params.message.text);
            }
            if (msg.method === 'Runtime.exceptionThrown') {
              console.error('EXCEPTION:', msg.params.exceptionDetails);
            }
          };

          setTimeout(() => {
            // Take screenshot
            ws.send(JSON.stringify({ id: 10, method: 'Page.captureScreenshot' }));
          }, 2500);

          setTimeout(() => {
            chrome.kill();
            process.exit(0);
          }, 4000);
        }
      } catch (err) {
        console.error('Error connecting to CDP:', err);
        chrome.kill();
        process.exit(1);
      }
    });
  }).on('error', (err) => {
    console.error('HTTP get error:', err);
    chrome.kill();
    process.exit(1);
  });
}

check();
