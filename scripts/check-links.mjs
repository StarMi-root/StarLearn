#!/usr/bin/env node
/* 构建后检查：内部链接、图片、Markdown 下载、搜索索引与关键产物。 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, 'dist');
const issues = [];
const stats = { html: 0, refs: 0, markdown: 0, searchEntries: 0 };

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function rel(file) {
  return path.relative(DIST, file).split(path.sep).join('/');
}

if (!fs.existsSync(DIST)) {
  console.error('dist/ 不存在，请先运行 npm run build');
  process.exit(1);
}

for (const required of [
  'index.html',
  'all-tutorials.html',
  'exercises.html',
  'about.html',
  '404.html',
  'md/all.md',
  'md/README.md',
  'static/search-index.js',
  'static/css/style.css',
  'static/js/app.js',
  'static/js/ai.js',
]) {
  if (!fs.existsSync(path.join(DIST, required))) issues.push(`缺少关键文件：${required}`);
}

const files = walk(DIST);
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const markdownFiles = files.filter((file) => file.endsWith('.md'));
stats.html = htmlFiles.length;
stats.markdown = markdownFiles.length;

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const page = rel(file);

  const ids = new Map();
  for (const match of source.matchAll(/\sid="([^"]+)"/g)) {
    const id = match[1];
    ids.set(id, (ids.get(id) || 0) + 1);
  }
  for (const [id, count] of ids) {
    if (count > 1) issues.push(`${page} 存在重复 id="${id}"（${count} 次）`);
  }

  for (const match of source.matchAll(/(?:href|src)="([^"]*)"/g)) {
    const raw = match[1];
    if (!raw || raw.startsWith('#') || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
    if (raw.startsWith('//')) continue;
    if (raw.startsWith('/')) {
      issues.push(`${page} 使用绝对站内路径（会破坏 GitHub Pages 子路径）：${raw}`);
      continue;
    }

    stats.refs += 1;
    const clean = raw.split('#')[0].split('?')[0];
    if (!clean) continue;
    let decoded;
    try {
      decoded = decodeURIComponent(clean);
    } catch {
      issues.push(`${page} 链接编码无效：${raw}`);
      continue;
    }
    const target = path.resolve(path.dirname(file), decoded);
    if (!fs.existsSync(target)) {
      issues.push(`${page} 链接目标不存在：${raw}`);
    }
  }

  if (/(?:href|src)="\/(?!\/)/.test(source)) {
    // 上面的逐链接检查已经报告；这里只保留显式提示，避免重复输出。
  }
}

const searchFile = path.join(DIST, 'static/search-index.js');
if (fs.existsSync(searchFile)) {
  const source = fs.readFileSync(searchFile, 'utf8');
  const match = source.match(/window\.__SEARCH_INDEX__\s*=\s*(\[[\s\S]*\]);?\s*$/);
  if (!match) {
    issues.push('搜索索引格式不正确');
  } else {
    try {
      const index = JSON.parse(match[1]);
      stats.searchEntries = index.length;
      for (const entry of index) {
        if (!entry.url) {
          issues.push(`搜索索引条目缺少 url：${entry.title || '(无标题)'}`);
          continue;
        }
        if (/^https?:/i.test(entry.url)) {
          if (!entry.external) issues.push(`外部条目未标记 external：${entry.url}`);
          continue;
        }
        const htmlTarget = path.join(DIST, entry.url);
        if (!fs.existsSync(htmlTarget)) {
          issues.push(`搜索索引指向不存在的页面：${entry.url}`);
        }
        if (entry.type === 'article') {
          const parts = entry.url.split('/');
          const mdTarget = path.join(DIST, 'md', ...parts.slice(0, -1), parts.at(-1).replace(/\.html$/, '.md'));
          if (!fs.existsSync(mdTarget)) {
            issues.push(`文章缺少 Markdown 下载：${entry.url} -> ${rel(mdTarget)}`);
          }
        }
      }
    } catch (error) {
      issues.push(`搜索索引不是合法 JSON：${error.message}`);
    }
  }
}

const robotsFile = path.join(DIST, 'robots.txt');
if (fs.existsSync(robotsFile)) {
  const robots = fs.readFileSync(robotsFile, 'utf8');
  if (/Sitemap:/i.test(robots) && !fs.existsSync(path.join(DIST, 'sitemap.xml'))) {
    issues.push('robots.txt 声明了 sitemap.xml，但文件不存在');
  }
}

if (issues.length) {
  console.error(`✗ 检查失败：${issues.length} 个问题`);
  for (const issue of issues.slice(0, 80)) console.error(`  - ${issue}`);
  if (issues.length > 80) console.error(`  ... 还有 ${issues.length - 80} 个问题`);
  process.exit(1);
}

console.log(`✓ 检查通过：${stats.html} 个 HTML，${stats.refs} 个内部链接，${stats.markdown} 个 Markdown，${stats.searchEntries} 条搜索索引。`);
