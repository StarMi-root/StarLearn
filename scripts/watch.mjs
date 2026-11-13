#!/usr/bin/env node
/* 本地开发：监听内容、配置与静态资源变化，串行重建 dist/。 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const TARGETS = ['content', 'data', 'static', 'config.yml', 'build.mjs', 'scripts/watch.mjs'];
let timer = null;
let running = false;
let queued = false;
const watchers = [];

function rebuild() {
  if (running) {
    queued = true;
    return;
  }
  running = true;
  const child = spawn(process.execPath, [path.join(ROOT, 'build.mjs')], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  child.on('exit', (code) => {
    running = false;
    if (code !== 0) console.error(`[watch] build exited with code ${code}`);
    if (queued) {
      queued = false;
      rebuild();
    }
  });
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 180);
}

function onError(error) {
  console.error(`[watch] ${error.message}`);
}

console.log('[watch] 监听 content/、data/、static/、config.yml 与 build.mjs，保存后自动重建。');
rebuild();
for (const target of TARGETS) {
  const full = path.join(ROOT, target);
  if (!fs.existsSync(full)) continue;
  try {
    // 必须保留 watcher 引用，否则对象可能在垃圾回收时被关闭。
    const watcher = fs.watch(full, { recursive: fs.statSync(full).isDirectory() }, schedule);
    watcher.on('error', onError);
    watchers.push(watcher);
  } catch (error) {
    onError(error);
  }
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    clearTimeout(timer);
    process.exit(0);
  });
}
