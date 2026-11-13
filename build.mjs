import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.umask(0o022);
const ROOT = __dirname;
const CONTENT = path.join(ROOT, 'content');
const DIST = path.join(ROOT, 'dist');
const STATIC = path.join(ROOT, 'static');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');

const config = yaml.load(fs.readFileSync(path.join(ROOT, 'config.yml'), 'utf8'));
const catalogData = yaml.load(fs.readFileSync(path.join(ROOT, 'data', 'catalog.yml'), 'utf8'));
const site = config.site;
const categories = config.categories.sort((a, b) => a.order - b.order);
const categoryMap = new Map(categories.map((c) => [c.slug, c]));
const catalogCount = catalogData.catalog.reduce((sum, g) => sum + g.items.length, 0);

marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
}));
marked.use({ gfm: true, breaks: false });

function readYaml(file) {
  return yaml.load(fs.readFileSync(file, 'utf8'));
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : [p];
  });
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-z#0-9]+;/gi, '-')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '') || 'section';
}

function relLink(fromPath, toPath) {
  const rel = path.posix.relative(path.posix.dirname(fromPath), toPath);
  return rel === '' ? path.posix.basename(toPath) : rel;
}

function rootPrefix(currentPath) {
  const dir = path.posix.dirname(currentPath);
  const rel = path.posix.relative(dir, '.');
  return rel ? `${rel}/` : './';
}

function iconTag(src, fromPath, className = '', alt = '') {
  if (!src) return '';
  return `<img${className ? ` class="${className}"` : ''} src="${relLink(fromPath, src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
}

function catBadge(category, fromPath, extra = '') {
  return `<span class="cat-badge${extra ? ` ${extra}` : ''}" style="--cat-color:${category.color};--cat-gradient:${category.gradient}">${iconTag(category.icon, fromPath, 'cat-badge-icon', '')}</span>`;
}

function htmlToText(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseFrontMatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, body: source };
  return { data: yaml.load(match[1]) || {}, body: source.slice(match[0].length) };
}

function countChars(text) {
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = text.replace(/[\u3400-\u9fff]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return cjk + words;
}

function readingMinutes(text) {
  const cjk = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = text.replace(/[\u3400-\u9fff]/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(cjk / 360 + words / 220));
}

function inlineMd(text = '') {
  return marked.parseInline(String(text).trim());
}

function parseAnswer(answer) {
  if (typeof answer === 'number') {
    return answer >= 1 && answer <= 8 ? answer - 1 : 0;
  }
  const value = String(answer).trim().toUpperCase();
  if (/^[A-H]$/.test(value)) return value.charCodeAt(0) - 65;
  const n = Number(value);
  return Number.isFinite(n) ? Math.max(0, n - 1) : 0;
}

function renderQuizCard(quiz, index, prefix = 'quiz') {
  const options = Array.isArray(quiz.options) ? quiz.options : [];
  const id = `${prefix}-${index + 1}`;
  const answer = parseAnswer(quiz.answer);
  const opts = options.map((opt, i) => `
    <label class="quiz-option" data-option="${i}">
      <input type="radio" name="${id}" value="${i}">
      <span class="quiz-letter">${String.fromCharCode(65 + i)}</span>
      <span class="quiz-option-text">${inlineMd(opt)}</span>
    </label>`).join('');
  return `<div class="quiz-card" data-quiz data-answer="${answer}">
  <div class="quiz-top"><span class="quiz-badge">随堂练习</span><span class="quiz-index">Q${index + 1}</span></div>
  <div class="quiz-question">${inlineMd(quiz.question)}</div>
  <div class="quiz-options" role="radiogroup" aria-label="选项">${opts}</div>
  <div class="quiz-actions">
    <button type="button" class="btn btn-primary btn-sm" data-quiz-check>检查答案</button>
    <button type="button" class="btn btn-ghost btn-sm" data-quiz-reveal>查看解析</button>
  </div>
  <div class="quiz-feedback" aria-live="polite"></div>
  <div class="quiz-explain" hidden><strong>解析：</strong>${inlineMd(quiz.explain || '回到正文中对应章节复习一下。')}</div>
</div>`;
}

function renderMarkdown(body, article) {
  // 页面模板已经渲染文章标题，正文首个 H1 只用于 Markdown 下载，避免重复 h1。
  let source = body.replace(/^\s*#\s+[^\n]+\n+/, '');
  let quizCount = 0;

  source = source.replace(/^:::quiz[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm, (_, raw) => {
    let quiz;
    try {
      quiz = yaml.load(raw);
    } catch (error) {
      return `<div class="callout callout-danger"><div class="callout-title">练习题配置错误</div><p>${escapeHtml(error.message)}</p></div>`;
    }
    quizCount += 1;
    return `\n\n${renderQuizCard(quiz, quizCount - 1, article.slug)}${quizCount > 1 ? '<!--QUIZ-SEP-->' : ''}\n\n`;
  });

  const calloutTitles = { tip: '提示', note: '说明', warn: '注意', danger: '警告', info: '补充' };
  const alertMap = { TIP: 'tip', NOTE: 'note', WARNING: 'warn', IMPORTANT: 'info', CAUTION: 'danger' };
  source = source.replace(/^> \[!(TIP|NOTE|WARNING|IMPORTANT|CAUTION)\][ \t]*\n((?:>[ \t]?.*(?:\n|$))*)/gm, (_, type, rest) => {
    const inner = rest.replace(/^>[ \t]?/gm, '').trim();
    const kind = alertMap[type] || 'note';
    return `\n\n<div class="callout callout-${kind}"><div class="callout-title">${calloutTitles[kind]}</div>${marked.parse(inner)}</div>\n\n`;
  });
  source = source.replace(/^:::(tip|note|warn|danger|info)(?:[ \t]+([^\n]+))?[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm, (_, type, title, inner) => {
    const innerHtml = marked.parse(inner.trim());
    return `<div class="callout callout-${type}"><div class="callout-title">${escapeHtml(title || calloutTitles[type])}</div>${innerHtml}</div>`;
  });

  let html = marked.parse(source);

  // Heading ids + TOC
  const headings = [];
  const usedIds = new Set();
  html = html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const text = htmlToText(inner);
    let id = slugify(text);
    let suffix = 2;
    while (usedIds.has(id)) id = `${slugify(text)}-${suffix++}`;
    usedIds.add(id);
    if (Number(level) <= 3) headings.push({ level: Number(level), text, id });
    return `<h${level} id="${id}">${inner}<a class="heading-anchor" href="#${id}" aria-label="复制锚点">#</a></h${level}>`;
  });

  // Code block language label
  html = html.replace(/<pre><code class="hljs language-([^"]+)">/g, '<pre class="code-block" data-lang="$1"><code class="hljs language-$1">');
  html = html.replace(/<pre><code>/g, '<pre class="code-block" data-lang="text"><code>');

  // Lazy images
  html = html.replace(/<img /g, '<img loading="lazy" decoding="async" ');

  // Responsive tables
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrap"><table>$1</table></div>');

  // Rewrite internal links and assets to work under any sub-path.
  html = html.replace(/(href|src)="([^"]+)"/g, (match, attr, rawUrl) => {
    if (!rawUrl || rawUrl.startsWith('#') || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(rawUrl)) return match;
    const hashIndex = rawUrl.indexOf('#');
    const hash = hashIndex >= 0 ? rawUrl.slice(hashIndex) : '';
    const withoutHash = hashIndex >= 0 ? rawUrl.slice(0, hashIndex) : rawUrl;
    const queryIndex = withoutHash.indexOf('?');
    const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : '';
    let pathname = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;
    if (!pathname) return match;
    let target;
    if (pathname.startsWith('/')) {
      target = pathname.slice(1);
    } else {
      target = path.posix.normalize(path.posix.join(path.posix.dirname(article.path), pathname));
    }
    if (target.endsWith('.md') && !target.startsWith('md/')) {
      target = `${target.slice(0, -3)}.html`;
    }
    const rel = relLink(article.path, target);
    return `${attr}="${rel}${query}${hash}"`;
  });

  return { html, headings, quizCount };
}

// ---------------------------------------------------------------------------
// Load content
// ---------------------------------------------------------------------------
const sourceFiles = walk(CONTENT).filter((file) => file.endsWith('.md'));
const articles = [];
const standalonePages = [];

for (const file of sourceFiles) {
  const rel = path.relative(CONTENT, file).split(path.sep).join('/');
  const raw = fs.readFileSync(file, 'utf8');
  const { data, body } = parseFrontMatter(raw);
  const slug = path.basename(file, '.md');
  const categorySlug = data.category || rel.split('/')[0];
  const category = categoryMap.get(categorySlug);
  if (!category && categorySlug !== 'page') {
    console.warn(`[warn] unknown category "${categorySlug}" for ${rel}`);
    continue;
  }
  const isStandalone = categorySlug === 'page' || Boolean(data.url);
  const pagePath = isStandalone
    ? (data.url || `${slug}.html`)
    : `${categorySlug}/${slug}.html`;
  const rendered = renderMarkdown(body, { slug, path: pagePath });
  const plain = htmlToText(rendered.html);
  const article = {
    ...data,
    slug,
    category: categorySlug,
    categoryName: category?.name || '页面',
    categoryColor: category?.color || '#1d4ed8',
    title: data.title || slug,
    description: data.description || plain.slice(0, 120),
    tags: data.tags || [],
    order: Number(data.order ?? 999),
    path: pagePath,
    sourcePath: rel,
    raw,
    body,
    html: rendered.html,
    headings: rendered.headings,
    quizCount: rendered.quizCount,
    plain,
    chars: countChars(plain),
    minutes: readingMinutes(plain),
    isStandalone,
  };
  if (isStandalone) standalonePages.push(article);
  else articles.push(article);
}

articles.sort((a, b) => {
  const ca = categoryMap.get(a.category)?.order ?? 999;
  const cb = categoryMap.get(b.category)?.order ?? 999;
  return ca - cb || a.order - b.order || a.title.localeCompare(b.title, 'zh');
});

for (const category of categories) {
  category.articles = articles
    .filter((a) => a.category === category.slug)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, 'zh'));
  category.minutes = category.articles.reduce((sum, a) => sum + a.minutes, 0);
  category.quizCount = category.articles.reduce((sum, a) => sum + a.quizCount, 0);
}

const articleByPath = new Map(articles.map((a) => [a.path, a]));
const pageByPath = new Map([...articles, ...standalonePages].map((a) => [a.path, a]));

function getArticle(target) {
  return articleByPath.get(target) || pageByPath.get(target);
}

function formatDate(value) {
  if (!value) return BUILD_DATE;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

// ---------------------------------------------------------------------------
// Shared layout
// ---------------------------------------------------------------------------
const navItems = [
  { label: '首页', target: 'index.html', match: (p) => p === 'index.html' },
  { label: '全部教程', target: 'all-tutorials.html', match: (p) => p === 'all-tutorials.html' },
  { label: '编程基础', target: 'foundations/index.html', match: (p) => p.startsWith('foundations/') },
  { label: '学习路线', target: 'index.html#paths', match: () => false },
  { label: '练习', target: 'exercises.html', match: (p) => p === 'exercises.html' },
  { label: 'AI 学习', target: 'ai/index.html', match: (p) => p.startsWith('ai/') },
  { label: '关于', target: 'about.html', match: (p) => p === 'about.html' },
];

function headerHtml(currentPath) {
  const nav = navItems.map((item) => {
    let href = item.target;
    if (href.includes('#')) {
      const [p, hash] = href.split('#');
      href = `${relLink(currentPath, p)}#${hash}`;
    } else {
      href = relLink(currentPath, item.target);
    }
    return `<a class="nav-link${item.match(currentPath) ? ' active' : ''}" href="${href}">${item.label}</a>`;
  }).join('');

  const categoryLinks = categories.map((c) =>
    `<a class="mobile-cat-link" href="${relLink(currentPath, `${c.slug}/index.html`)}"><span class="mobile-cat-icon">${iconTag(c.icon, currentPath, 'mobile-cat-icon-img', '')}</span>${c.name}</a>`
  ).join('');

  return `<a class="skip-link" href="#main">跳到主要内容</a>
<div class="top-strip">
  <div class="container top-strip-inner">
    <span class="top-strip-left"><span class="live-dot"></span> 全站教程支持 Markdown 下载 · 内置 AI 学习助手</span>
    <span class="top-strip-right"><a href="${relLink(currentPath, 'md/all.md')}" download>下载全站 .md</a><span class="top-sep">/</span><a href="${relLink(currentPath, 'all-tutorials.html')}">教程目录</a></span>
  </div>
</div>
<header class="site-header" id="siteHeader">
  <div class="container header-inner">
    <button class="icon-btn mobile-menu-btn" id="mobileMenuBtn" aria-label="打开菜单" aria-expanded="false"><span></span><span></span><span></span></button>
    <a class="brand" href="${relLink(currentPath, 'index.html')}" aria-label="${site.name}首页">
      <span class="brand-mark" aria-hidden="true">${iconTag(site.icon, currentPath, 'brand-icon', '')}</span>
      <span class="brand-text"><strong>${site.name}</strong><small>${site.latin} · LEARN BY BUILDING</small></span>
    </a>
    <nav class="main-nav" aria-label="主导航">${nav}</nav>
    <div class="header-actions">
      <button class="search-trigger" id="searchTrigger" aria-label="搜索教程">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
        <span>搜索教程</span><kbd>/</kbd>
      </button>
      <button class="icon-btn theme-toggle" id="themeToggle" aria-label="切换深色模式" title="切换深色模式">
        <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path></svg>
        <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"></path></svg>
      </button>
      <a class="header-cta" href="${relLink(currentPath, 'csharp/intro.html')}">开始学习</a>
    </div>
  </div>
</header>
<div class="mobile-drawer" id="mobileDrawer" hidden>
  <div class="mobile-drawer-backdrop" data-close-drawer></div>
  <div class="mobile-drawer-panel">
    <div class="mobile-drawer-head"><span>教程导航</span><button class="icon-btn" data-close-drawer aria-label="关闭菜单">×</button></div>
    <div class="mobile-drawer-nav">${nav}</div>
    <div class="mobile-drawer-title">全部分类</div>
    <div class="mobile-cat-grid">${categoryLinks}</div>
  </div>
</div>`;
}

function footerHtml(currentPath) {
  const categoryLinks = categories.slice(0, 6).map((c) =>
    `<a href="${relLink(currentPath, `${c.slug}/index.html`)}">${c.name}</a>`
  ).join('');
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a class="brand" href="${relLink(currentPath, 'index.html')}"><span class="brand-mark">${iconTag(site.icon, currentPath, 'brand-icon', '')}</span><span class="brand-text"><strong>${site.name}</strong><small>${site.latin}</small></span></a>
      <p>${site.tagline}。面向实战的中文技术学习站，所有文章均可下载为 Markdown。</p>
      <div class="footer-credit"><span>开发：<strong>${site.developer}</strong></span><a href="mailto:${site.email}">${site.email}</a><a href="${site.bilibili_url}" target="_blank" rel="noopener">B站：${site.bilibili}</a></div>
    </div>
    <div class="footer-col"><h3>课程分类</h3>${categoryLinks}</div>
    <div class="footer-col"><h3>学习资源</h3>
      <a href="${relLink(currentPath, 'all-tutorials.html')}">全部教程目录</a>
      <a href="${relLink(currentPath, 'exercises.html')}">练习与测验</a>
      <a href="${relLink(currentPath, 'ai/assistant.html')}">AI 学习助手</a>
      <a href="${relLink(currentPath, 'md/all.md')}" download>全站 Markdown 下载</a>
    </div>
    <div class="footer-col"><h3>站点</h3>
      <a href="${relLink(currentPath, 'about.html')}">关于本站</a>
      <a href="${relLink(currentPath, 'about.html#credits')}">素材与许可</a>
      <a href="mailto:${site.email}">联系开发者</a>
      <a href="${relLink(currentPath, 'server/github-pages.html')}">部署到 GitHub Pages</a>
    </div>
  </div>
  <div class="container footer-bottom">
    <p>© ${new Date().getFullYear()} ${site.name} · 开发 ${site.developer} · ${site.license}</p>
    <p>用 <span class="mono">HTML + CSS + JavaScript</span> 构建 · 可部署于 GitHub Pages 或 Linux · <a href="mailto:${site.email}">${site.email}</a></p>
  </div>
</footer>
<button class="back-to-top" id="backToTop" aria-label="回到顶部">↑</button>`;
}

function searchModalHtml() {
  return `<div class="search-modal" id="searchModal" hidden role="dialog" aria-modal="true" aria-label="搜索教程">
  <div class="search-backdrop" data-close-search></div>
  <div class="search-panel">
    <div class="search-input-wrap">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>
      <input id="searchInput" type="search" placeholder="搜索正文任意字词：C#、Avalonia、llama.cpp、Linux…" autocomplete="off" spellcheck="false">
      <kbd>ESC</kbd>
    </div>
    <div class="search-hints"><button data-search-term="llama.cpp">llama.cpp</button><button data-search-term="Avalonia MVVM">Avalonia MVVM</button><button data-search-term="SSH 密钥">SSH 密钥</button><button data-search-term="Nginx 部署">Nginx 部署</button></div>
    <div class="search-results" id="searchResults"><div class="search-empty">输入关键词开始搜索，覆盖每篇教程正文、代码、目录、分类与 AI 工具。</div></div>
    <div class="search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> 选择</span><span><kbd>Enter</kbd> 打开</span><span class="search-count" id="searchCount"></span></div>
  </div>
</div>`;
}

function aiWidgetHtml(currentPath) {
  return `<div class="ai-widget" id="aiWidget">
  <button class="ai-launcher" id="aiLauncher" aria-label="打开 AI 学习助手">
    <span class="ai-orb">AI</span><span class="ai-launcher-text">学习助手</span>
  </button>
  <section class="ai-panel" id="aiPanel" hidden aria-label="AI 学习助手">
    <header class="ai-head">
      <div class="ai-head-title"><span class="ai-orb small">AI</span><div><strong>学习助手</strong><small id="aiStatus">站内知识库 · 免配置</small></div></div>
      <div class="ai-head-actions"><button class="icon-btn" id="aiSettingsBtn" title="设置" aria-label="AI 设置">⚙</button><button class="icon-btn" id="aiCloseBtn" title="关闭" aria-label="关闭">×</button></div>
    </header>
    <div class="ai-context">正在阅读：<strong id="aiPageTitle">本页</strong></div>
    <div class="ai-messages" id="aiMessages">
      <div class="ai-msg bot"><div class="ai-bubble">你好，我是 StarLearn 学习助手。你可以问我当前页面的概念、代码报错、学习顺序，或让我出练习题。<br><br><span class="ai-muted">默认使用站内知识库检索；在设置中可接入 OpenAI / DeepSeek / Ollama 兼容接口。</span></div></div>
    </div>
    <div class="ai-quick" id="aiQuick">
      <button data-ai-prompt="用通俗的话解释这一页的核心概念">解释核心概念</button>
      <button data-ai-prompt="根据这一页内容给我出 2 道练习题">出练习题</button>
      <button data-ai-prompt="这一页学完后应该接着学什么？">下一步学什么</button>
      <button data-ai-prompt="给我一个可以动手做的小项目">练手项目</button>
    </div>
    <form class="ai-form" id="aiForm">
      <textarea id="aiInput" rows="1" placeholder="问一个关于本页的问题…" maxlength="4000"></textarea>
      <button type="submit" class="ai-send" id="aiSend" aria-label="发送">↑</button>
    </form>
    <div class="ai-foot">AI 可能会出错，请结合正文与官方文档验证。API Key 仅保存在你的浏览器。</div>
    <div class="ai-settings" id="aiSettings" hidden>
      <div class="ai-settings-head"><strong>AI 助手设置</strong><button class="icon-btn" id="aiSettingsClose" aria-label="关闭设置">×</button></div>
      <label class="field"><span>回答模式</span>
        <select id="aiMode"><option value="knowledge">站内知识库（离线）</option><option value="api">接入大模型 API</option></select>
      </label>
      <div class="ai-api-fields" id="aiApiFields" hidden>
        <label class="field"><span>接口地址</span><input id="aiEndpoint" placeholder="https://api.deepseek.com/v1/chat/completions" autocomplete="off"></label>
        <label class="field"><span>API Key</span><input id="aiKey" type="password" placeholder="sk-…（本站代理可留空）" autocomplete="off"></label>
        <label class="field"><span>模型</span><input id="aiModel" placeholder="deepseek-chat" autocomplete="off"></label>
        <div class="ai-presets">
          <button type="button" data-preset="deepseek">DeepSeek</button>
          <button type="button" data-preset="openai">OpenAI</button>
          <button type="button" data-preset="ollama">Ollama</button>
          <button type="button" data-preset="local">本站代理</button>
        </div>
        <p class="ai-hint">GitHub Pages 等纯静态环境请使用支持 CORS 的接口；生产环境建议用本站 <code>server/ai_proxy.py</code> 隐藏密钥。</p>
      </div>
      <div class="ai-settings-actions"><button type="button" class="btn btn-primary btn-sm" id="aiSaveSettings">保存设置</button><button type="button" class="btn btn-ghost btn-sm" id="aiClearSettings">清除密钥</button></div>
      <p class="ai-save-status" id="aiSaveStatus"></p>
    </div>
  </section>
</div>`;
}

function layout({ title, description, currentPath, content, bodyClass = '', extraHead = '', article = null }) {
  const root = rootPrefix(currentPath);
  const pageTitle = title ? `${title} | ${site.name}` : `${site.name} · ${site.tagline}`;
  const desc = description || site.description;
  const jsonLd = article ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: article.title,
    description: article.description,
    dateModified: formatDate(article.updated),
    author: { '@type': 'Organization', name: site.author },
    publisher: { '@type': 'Organization', name: site.name },
    inLanguage: 'zh-CN',
  })}</script>` : '';
  return `<!doctype html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(pageTitle)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<meta name="keywords" content="${escapeHtml(site.keywords)}">
<meta name="author" content="${escapeHtml(site.author)}">
<meta name="theme-color" content="#1d4ed8">
<meta property="og:title" content="${escapeHtml(pageTitle)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escapeHtml(site.name)}">
<link rel="icon" type="image/png" sizes="32x32" href="${relLink(currentPath, 'static/img/brand/favicon-32.png')}">
<link rel="icon" type="image/x-icon" href="${relLink(currentPath, site.favicon)}">
<link rel="apple-touch-icon" sizes="180x180" href="${relLink(currentPath, site.touch_icon)}">
<link rel="manifest" href="${relLink(currentPath, 'manifest.webmanifest')}">
<link rel="stylesheet" href="${relLink(currentPath, 'static/css/style.css')}">
<script>try{var _tv=localStorage.getItem('techlearn:theme');var _t=_tv?JSON.parse(_tv):null;if(_t==='dark'||(!_t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.dataset.theme='dark';}catch(e){}</script>
${extraHead}
${jsonLd}
</head>
<body class="${bodyClass}" data-root="${root}" data-page-id="${escapeHtml(currentPath)}" data-page-title="${escapeHtml(article?.title || title || site.name)}">
${headerHtml(currentPath)}
<main id="main">${content}</main>
${footerHtml(currentPath)}
${searchModalHtml()}
${aiWidgetHtml(currentPath)}
<script src="${relLink(currentPath, 'static/search-index.js')}" defer></script>
<script src="${relLink(currentPath, 'static/js/app.js')}" defer></script>
<script src="${relLink(currentPath, 'static/js/ai.js')}" defer></script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Article page
// ---------------------------------------------------------------------------
function sidebarHtml(currentPath, category, activeArticle) {
  const lessons = category.articles.map((a, i) => `
    <a class="sidebar-lesson${a.path === activeArticle.path ? ' active' : ''}" href="${relLink(currentPath, a.path)}" data-progress-key="${a.path}">
      <span class="lesson-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="lesson-name">${escapeHtml(a.title)}</span>
      <span class="lesson-check" aria-hidden="true">✓</span>
    </a>`).join('');
  return `<aside class="sidebar" aria-label="课程目录">
    <div class="sidebar-category">
      <div class="sidebar-cat-head">${catBadge(category, currentPath)}<div><strong>${category.name}</strong><small>${category.articles.length} 篇文章 · ${category.minutes} 分钟</small></div></div>
      <div class="progress-line"><span class="progress-fill" data-progress-fill="${category.slug}"></span></div>
      <div class="progress-label"><span>学习进度</span><span data-progress-text="${category.slug}">0 / ${category.articles.length}</span></div>
    </div>
    <nav class="sidebar-list">${lessons}</nav>
    <div class="sidebar-cta">
      <a class="side-download" href="${relLink(currentPath, `md/${category.slug}.md`)}" download>↓ 下载本分类 Markdown</a>
      <a class="side-all" href="${relLink(currentPath, 'all-tutorials.html')}">浏览全部教程 →</a>
    </div>
  </aside>`;
}

function tocHtml(currentPath, article) {
  const items = article.headings.filter((h) => h.level === 2 || h.level === 3).map((h) =>
    `<a class="toc-link level-${h.level}" href="#${h.id}">${escapeHtml(h.text)}</a>`
  ).join('');
  return `<aside class="toc" aria-label="本页目录">
    <div class="toc-inner">
      <div class="toc-title">本页目录</div>
      <nav class="toc-list">${items || '<span class="toc-empty">本页暂无小标题</span>'}</nav>
      <div class="toc-actions">
        <a href="${relLink(currentPath, `md/${article.category}/${article.slug}.md`)}" download class="toc-action"><span>↓</span>下载 .md</a>
        <button class="toc-action js-open-ai" type="button"><span>✦</span>问 AI 这一页</button>
        <button class="toc-action" type="button" data-copy-link><span>⧉</span>复制链接</button>
        <button class="toc-action" type="button" data-print><span>⌘</span>打印页面</button>
      </div>
      <div class="toc-meta">约 ${article.minutes} 分钟 · ${article.chars} 字</div>
    </div>
  </aside>`;
}

function articlePage(article) {
  const category = categoryMap.get(article.category);
  const index = category.articles.findIndex((a) => a.path === article.path);
  const prev = category.articles[index - 1];
  const next = category.articles[index + 1];
  const practice = category.articles.find((a) => a.practice);
  const prevNext = `<nav class="page-nav" aria-label="上一篇下一篇">
    ${prev ? `<a class="page-nav-item prev" href="${relLink(article.path, prev.path)}"><span>← 上一篇</span><strong>${escapeHtml(prev.title)}</strong></a>` : '<span></span>'}
    ${next ? `<a class="page-nav-item next" href="${relLink(article.path, next.path)}"><span>下一篇 →</span><strong>${escapeHtml(next.title)}</strong></a>` : `<a class="page-nav-item next" href="${relLink(article.path, 'all-tutorials.html')}"><span>继续探索 →</span><strong>浏览全部教程</strong></a>`}
  </nav>`;
  const practiceBox = practice && practice.path !== article.path ? `<div class="inline-cta"><div><strong>学完了？做几道练习巩固一下</strong><p>${escapeHtml(practice.description)}</p></div><a class="btn btn-primary btn-sm" href="${relLink(article.path, practice.path)}">去做练习 →</a></div>` : '';
  const content = `<div class="reading-progress" id="readingProgress"></div>
<div class="container page-shell">
  ${sidebarHtml(article.path, category, article)}
  <div class="content-column">
    <nav class="breadcrumb" aria-label="面包屑"><a href="${relLink(article.path, 'index.html')}">首页</a><span>/</span><a href="${relLink(article.path, `${category.slug}/index.html`)}">${category.name}</a><span>/</span><span>${escapeHtml(article.title)}</span></nav>
    <article class="article-card">
      <header class="article-header" style="--accent:${category.color}">
        <div class="article-eyebrow"><a class="badge-link" href="${relLink(article.path, `${category.slug}/index.html`)}">${category.name}</a>${article.practice ? '<span class="badge badge-green">练习课</span>' : ''}</div>
        <h1>${escapeHtml(article.title)}</h1>
        <p class="article-lead">${escapeHtml(article.description)}</p>
        <div class="article-meta">
          <span>更新于 ${formatDate(article.updated)}</span><span class="dot"></span><span>约 ${article.minutes} 分钟</span><span class="dot"></span><span>${article.chars} 字</span><span class="dot"></span><span class="md-badge">Markdown 可下载</span>
        </div>
      </header>
      <div class="article-body" data-article-body>${article.html}</div>
      ${practiceBox}
      <footer class="article-footer">
        <div class="article-tags">${article.tags.map((t) => `<span class="tag"># ${escapeHtml(t)}</span>`).join('')}</div>
        <div class="article-actions">
          <button class="btn btn-primary btn-sm js-mark-read" type="button" data-mark-key="${article.path}">标记为已学完</button>
          <a class="btn btn-ghost btn-sm" href="${relLink(article.path, `md/${article.category}/${article.slug}.md`)}" download>下载本章 .md</a>
        </div>
      </footer>
    </article>
    <section class="notes-card" aria-label="学习笔记">
      <div class="notes-head"><div><span class="notes-icon">✎</span><div><strong>我的学习笔记</strong><small>笔记保存在本机浏览器，不会上传。</small></div></div><div class="notes-actions"><button class="btn btn-ghost btn-sm" type="button" data-notes-export>导出 .md</button><button class="btn btn-ghost btn-sm" type="button" data-notes-clear>清空</button></div></div>
      <textarea id="articleNotes" class="notes-input" rows="5" placeholder="记录这一页的重点、疑问或代码片段…"></textarea>
      <div class="notes-foot"><span class="notes-status" id="notesStatus"></span><button class="btn btn-primary btn-sm" type="button" data-notes-save>保存笔记</button></div>
    </section>
    ${prevNext}
  </div>
  ${tocHtml(article.path, article)}
</div>`;
  return layout({
    title: article.title,
    description: article.description,
    currentPath: article.path,
    content,
    bodyClass: 'page-article',
    article,
  });
}

// ---------------------------------------------------------------------------
// Category page
// ---------------------------------------------------------------------------
function categoryPage(category) {
  const pagePath = `${category.slug}/index.html`;
  const lessons = category.articles.map((a, i) => `
    <a class="lesson-row${a.practice ? ' is-practice' : ''}" href="${relLink(pagePath, a.path)}" data-progress-key="${a.path}">
      <span class="lesson-row-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="lesson-row-main"><strong>${escapeHtml(a.title)}</strong><small>${escapeHtml(a.description)}</small><span class="lesson-row-meta">${a.minutes} 分钟${a.quizCount ? ` · ${a.quizCount} 道练习` : ''}${a.practice ? ' · 练习课' : ''}</span></span>
      <span class="lesson-row-check" aria-hidden="true">✓</span>
      <span class="lesson-row-arrow">→</span>
    </a>`).join('');
  const tags = category.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('');
  const project = category.project ? getArticle(category.project) : null;
  const heroIcon = category.icon ? iconTag(category.icon, pagePath, 'category-hero-icon', '') : '';
  const content = `<div class="container category-page">
    <nav class="breadcrumb" aria-label="面包屑"><a href="${relLink(pagePath, 'index.html')}">首页</a><span>/</span><span>${category.name}</span></nav>
    <section class="category-hero" style="--accent:${category.color};--accent-gradient:${category.gradient}">
      <div class="category-hero-copy">
        <div class="category-kicker">${catBadge(category, pagePath, 'lg')}<span>LEARNING TRACK</span></div>
        <h1>${category.name}</h1>
        <p>${escapeHtml(category.intro)}</p>
        <div class="hero-meta"><span><strong>${category.articles.length}</strong> 篇教程</span><span><strong>${category.minutes}</strong> 分钟</span><span><strong>${category.quizCount}</strong> 道练习</span></div>
        <div class="hero-actions"><a class="btn btn-primary" href="${relLink(pagePath, category.articles[0]?.path || 'all-tutorials.html')}">开始学习 →</a><a class="btn btn-ghost" href="${relLink(pagePath, `md/${category.slug}.md`)}" download>下载整门课 .md</a></div>
        <div class="category-tags">${tags}</div>
      </div>
      <div class="category-hero-art">${heroIcon}<div class="hero-art-glow"></div>${catBadge(category, pagePath, 'hero')}</div>
    </section>
    <div class="category-layout">
      <section class="category-main">
        <div class="section-heading"><div><span class="section-kicker">COURSE MAP</span><h2>课程目录</h2></div><span class="section-note">按顺序学习效果更好</span></div>
        <div class="lesson-list">${lessons}</div>
        ${category.quizCount ? `<div class="inline-cta"><div><strong>边学边练，记得更牢</strong><p>本课程包含 ${category.quizCount} 道随堂练习，全部在页面内完成并即时查看解析。</p></div><a class="btn btn-primary btn-sm" href="${relLink(pagePath, category.articles.find((a) => a.practice)?.path || category.articles[0].path)}">进入练习 →</a></div>` : ''}
      </section>
      <aside class="category-aside">
        <div class="aside-card"><h3>学习建议</h3><p>先快速浏览目录，按顺序完成每篇文章的示例代码；遇到不懂的概念，随时打开右下角 AI 学习助手。</p><ul class="check-list"><li>每篇至少动手敲一遍代码</li><li>完成页面内的随堂练习</li><li>用 Markdown 下载做离线笔记</li></ul></div>
        ${project ? `<div class="aside-card"><span class="section-kicker">PROJECT</span><h3>配套实战项目</h3><p>${escapeHtml(project.description)}</p><a class="text-link" href="${relLink(pagePath, project.path)}">查看项目 →</a></div>` : ''}
        <div class="aside-card aside-download-card"><span class="download-icon">↓</span><h3>离线学习包</h3><p>下载本课程全部文章为 Markdown，可导入 Obsidian、Notion 或任意笔记工具。</p><a class="btn btn-primary btn-sm" href="${relLink(pagePath, `md/${category.slug}.md`)}" download>下载 .md 合集</a></div>
      </aside>
    </div>
  </div>`;
  return layout({
    title: category.name,
    description: category.description,
    currentPath: pagePath,
    content,
    bodyClass: 'page-category',
  });
}

// ---------------------------------------------------------------------------
// Home page
// ---------------------------------------------------------------------------
function homePage() {
  const currentPath = 'index.html';
  const featuredSlugs = [
    'foundations/variables.html', 'csharp/intro.html', 'avalonia/intro.html', 'python/intro.html',
    'ai/llama-cpp.html', 'linux/commands.html', 'frontend/javascript.html',
    'server/docker.html', 'ssh/keys.html',
  ];
  const featured = featuredSlugs.map(getArticle).filter(Boolean);
  const tracks = categories.map((c) => {
    const thumb = c.icon ? iconTag(c.icon, currentPath, 'track-thumb-img', '') : '';
    return `<a class="track-card" href="${relLink(currentPath, `${c.slug}/index.html`)}" style="--accent:${c.color};--accent-gradient:${c.gradient}">
      <div class="track-card-top">${catBadge(c, currentPath)}${thumb ? `<span class="track-thumb">${thumb}</span>` : '<span class="track-arrow">↗</span>'}</div>
      <h3>${c.name}</h3><p>${escapeHtml(c.description)}</p>
      <div class="track-meta"><span>${c.articles.length} 篇教程</span><span>${c.minutes} 分钟</span></div>
    </a>`;
  }).join('');
  const featureList = featured.map((a, i) => {
    const cat = categoryMap.get(a.category);
    return `<a class="featured-row" href="${relLink(currentPath, a.path)}"><span class="featured-num">${String(i + 1).padStart(2, '0')}</span><span class="featured-main"><span class="featured-cat" style="color:${cat.color}">${cat.name}</span><strong>${escapeHtml(a.title)}</strong><small>${escapeHtml(a.description)}</small></span><span class="featured-arrow">→</span></a>`;
  }).join('');
  const paths = config.paths.map((p) => {
    const steps = p.steps.map((step, i) => {
      const article = getArticle(step);
      if (!article) return '';
      return `<a class="path-step" href="${relLink(currentPath, article.path)}"><span>${i + 1}</span>${escapeHtml(article.title)}</a>`;
    }).join('');
    return `<div class="path-card" style="--path-color:${p.color}"><div class="path-icon">${p.icon}</div><span class="path-duration">${p.duration}</span><h3>${p.title}</h3><p>${p.desc}</p><div class="path-steps">${steps}</div></div>`;
  }).join('');
  const stats = {
    articles: articles.length,
    categories: categories.length,
    quizzes: articles.reduce((sum, a) => sum + a.quizCount, 0),
    catalog: catalogCount,
  };
  const localCatalog = catalogData.catalog.flatMap((g) => g.items.filter((i) => i.local)).slice(0, 10);
  const content = `<section class="hero">
    <div class="hero-grid-bg"></div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <div class="hero-pill"><span class="pulse-dot"></span> 2026 实战版 · 从入门到部署</div>
        <h1>从第一行代码，<br>到<span class="grad-text">独立部署上线</span></h1>
        <p class="hero-sub">Python 与数据科学、AI Agent、前端、后端、数据库、移动开发、DevOps、计算机基础与 Linux 部署。150 个教程主题、100 篇原创精讲，每篇文章都能下载为 Markdown，遇到问题随时问 AI 学习助手。</p>
        <div class="hero-search"><button class="hero-search-box" id="heroSearch"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><span>搜索教程、命令或概念，例如 “FastAPI”、“Agent” 或 “SQL”</span><kbd>/</kbd></button></div>
        <div class="hero-actions"><a class="btn btn-primary btn-lg" href="${relLink(currentPath, 'python/intro.html')}">开始学习 Python →</a><a class="btn btn-ghost btn-lg" href="${relLink(currentPath, 'all-tutorials.html')}">浏览 150 个主题</a></div>
        <div class="hero-stats"><div><strong>${stats.articles}+</strong><span>精讲文章</span></div><div><strong>${stats.quizzes}+</strong><span>随堂练习</span></div><div><strong>${catalogCount}+</strong><span>教程目录</span></div><div><strong>100%</strong><span>Markdown 可下载</span></div></div>
      </div>
      <div class="hero-visual" aria-label="StarLearn 技术图标">
        <div class="visual-main"><div class="visual-main-bar"><span></span><span></span><span></span><em>Program.cs</em></div><pre><code><span class="c-key">using</span> System;
<span class="c-key">var</span> skills = <span class="c-key">new</span>[] { <span class="c-str">"C#"</span>, <span class="c-str">"Avalonia"</span>, <span class="c-str">"AI"</span> };
<span class="c-key">foreach</span> (<span class="c-key">var</span> s <span class="c-key">in</span> skills)
    Console.WriteLine(<span class="c-str">$"Learn {s} by building."</span>);</code></pre><div class="visual-output">Learn C# by building.<br>Learn Avalonia by building.<br>Learn AI by building.</div></div>
        <div class="visual-card card-python"><img src="${relLink(currentPath, 'static/img/icons/si-python.svg')}" alt="Python 图标"><span>Python</span></div>
        <div class="visual-card card-docker"><img src="${relLink(currentPath, 'static/img/icons/si-docker.svg')}" alt="Docker 图标"><span>Docker</span></div>
        <div class="visual-card card-linux"><img src="${relLink(currentPath, 'static/img/icons/si-linux.svg')}" alt="Linux 图标"><span>Linux</span></div>
        <div class="visual-card card-data"><img src="${relLink(currentPath, 'static/img/icons/si-thealgorithms.svg')}" alt="算法图标"><span>CS 基础</span></div>
        <span class="visual-credit">图标：Simple Icons CC0 · Lucide ISC</span>
      </div>
    </div>
    <div class="container hero-marquee"><span>热门路径</span><a href="${relLink(currentPath, 'ai/llama-cpp.html')}">llama.cpp 本地推理</a><a href="${relLink(currentPath, 'avalonia/mvvm.html')}">Avalonia MVVM</a><a href="${relLink(currentPath, 'server/nginx.html')}">Nginx 反向代理</a><a href="${relLink(currentPath, 'ssh/keys.html')}">SSH 密钥登录</a><a href="${relLink(currentPath, 'ai/deepseek-harness.html')}">DeepSeek Harness</a><a href="${relLink(currentPath, 'hardware/architecture.html')}">计算机组成</a><a href="${relLink(currentPath, 'python/curriculum.html')}">Python 数据科学</a><a href="${relLink(currentPath, 'ai/curriculum.html')}">AI Agent</a><a href="${relLink(currentPath, 'database/overview.html')}">数据库选型</a><a href="${relLink(currentPath, 'foundations/variables.html')}">编程基础</a></div>
  </section>

  <section class="container section" id="tracks">
    <div class="section-heading"><div><span class="section-kicker">LEARNING TRACKS</span><h2>选择你的学习方向</h2></div><a class="section-link" href="${relLink(currentPath, 'all-tutorials.html')}">查看全部 ${catalogCount}+ 个主题 →</a></div>
    <div class="track-grid">${tracks}</div>
  </section>

  <section class="container section" id="paths">
    <div class="section-heading"><div><span class="section-kicker">ROADMAPS</span><h2>${paths.length} 条可执行的学习路线</h2></div><span class="section-note">不用再纠结先学什么</span></div>
    <div class="path-grid">${paths}</div>
  </section>

  <section class="container section featured-section">
    <div class="section-heading"><div><span class="section-kicker">POPULAR NOW</span><h2>热门教程</h2></div><a class="section-link" href="${relLink(currentPath, 'all-tutorials.html')}">全部教程 →</a></div>
    <div class="featured-grid"><div class="featured-list">${featureList}</div><aside class="featured-aside"><div class="mini-terminal"><div class="mini-terminal-head"><span></span><span></span><span></span></div><pre><code><span class="term-green">$</span> dotnet run
Hello, StarLearn!

<span class="term-green">$</span> llama-cli -m model.gguf
<span class="term-dim">loaded 7B model, Q4_K_M</span>
<span class="term-green">$</span> ssh deploy@server
<span class="term-dim">✓ connected · deploy ready</span></code></pre></div><h3>边学边做，马上看到结果</h3><p>每篇教程都有可运行示例、练习和下一步指引。学完一个模块，就把它部署到自己的服务器。</p><a class="text-link" href="${relLink(currentPath, 'projects/local-ai-chat.html')}">看实战项目 →</a></aside></div>
  </section>

  <section class="container section ai-section">
    <div class="ai-band">
      <div class="ai-band-copy"><span class="section-kicker green">AI LEARNING</span><h2>不只学 AI，<br>把 AI 变成你的学习搭档</h2><p>理解 llama.cpp 的推理流程、GGUF 量化与 DeepSeek Harness 的 Agent 工作流；再用站内 AI 助手解释概念、出题和规划路线。</p><div class="hero-actions"><a class="btn btn-primary" href="${relLink(currentPath, 'ai/intro.html')}">进入 AI 学习路线 →</a><button class="btn btn-ghost js-open-ai" type="button">打开 AI 助手</button></div><div class="ai-chips"><span>llama.cpp</span><span>GGUF / Q4_K_M</span><span>DeepSeek Harness</span><span>RAG</span><span>本地推理</span></div></div>
      <div class="ai-band-visual"><div class="ai-chat-mock"><div class="mock-msg user">llama.cpp 和 Ollama 有什么区别？</div><div class="mock-msg bot"><strong>学习助手</strong><p>llama.cpp 是底层推理引擎，Ollama 更像开箱即用的模型运行与管理层。想理解量化与参数，从 llama.cpp 入手；想快速跑模型，可以先用 Ollama。</p><span class="mock-link">→ 查看《llama.cpp 入门与编译》</span></div><div class="mock-input">继续提问… <span>↑</span></div></div></div>
    </div>
  </section>

  <section class="container section">
    <div class="section-heading"><div><span class="section-kicker">WHY STARLEARN</span><h2>为“真正学会”设计的站点</h2></div></div>
    <div class="features-grid">
      <div class="feature"><span class="feature-icon">↓</span><h3>全站 Markdown</h3><p>每篇文章、每个分类和全站合集都能下载为 .md，方便离线阅读与笔记归档。</p></div>
      <div class="feature"><span class="feature-icon">✦</span><h3>AI 学习助手</h3><p>站内知识库免配置可用；也支持接入 DeepSeek、OpenAI、Ollama 或自建代理。</p></div>
      <div class="feature"><span class="feature-icon">✓</span><h3>练习即时反馈</h3><p>随堂练习直接嵌在文章里，选完立刻判分并查看解析，不是只看不练。</p></div>
      <div class="feature"><span class="feature-icon">◔</span><h3>进度与笔记</h3><p>本地记录已学章节、分类进度和个人笔记，导出后就是自己的知识库。</p></div>
      <div class="feature"><span class="feature-icon">⌕</span><h3>全文搜索</h3><p>标题、简介、标签和正文都可搜索，按 / 即可打开，键盘操作流畅。</p></div>
      <div class="feature"><span class="feature-icon">▣</span><h3>可直接部署</h3><p>纯静态输出，支持 GitHub Pages；同时提供 Nginx、Docker 与 AI 代理的 Linux 部署方案。</p></div>
    </div>
  </section>

  <section class="container section catalog-preview">
    <div class="section-heading"><div><span class="section-kicker">FULL CATALOG</span><h2>完整技术课程目录</h2></div><a class="section-link" href="${relLink(currentPath, 'all-tutorials.html')}">打开完整目录 →</a></div>
    <div class="catalog-preview-inner"><div><p>12 个技术方向、150 个主题：Python/数据科学、AI/智能开发、前端、后端、数据库、移动开发、DevOps、编程语言、计算机基础、XML/Web Service、.NET 与网站建设。核心路线本地精讲，长尾主题提供官方入口。</p><div class="catalog-tags">${localCatalog.map((i) => `<a href="${relLink(currentPath, i.local)}">${i.name}</a>`).join('')}<a href="${relLink(currentPath, 'all-tutorials.html')}">更多 →</a></div></div><div class="catalog-numbers"><strong>${catalogCount}+</strong><span>个教程主题</span><strong>${categories.length}</strong><span>个教程分类</span><strong>${stats.articles}</strong><span>篇可下载文章</span></div></div>
  </section>

  <section class="container section final-cta"><div><span class="section-kicker">START TODAY</span><h2>现在就开始，把知识变成作品</h2><p>从一篇教程、一段代码、一次部署开始。所有内容永久免费，支持离线下载。</p></div><div class="hero-actions"><a class="btn btn-primary btn-lg" href="${relLink(currentPath, 'python/intro.html')}">从 Python 开始</a><a class="btn btn-ghost btn-lg" href="${relLink(currentPath, 'exercises.html')}">先做几道练习</a></div></section>`;
  return layout({ title: '', description: site.description, currentPath, content, bodyClass: 'page-home' });
}

// ---------------------------------------------------------------------------
// All tutorials
// ---------------------------------------------------------------------------
function allTutorialsPage() {
  const currentPath = 'all-tutorials.html';
  const localSections = categories.map((c) => `
    <section class="catalog-category" data-filter-group>
      <div class="catalog-category-head">${catBadge(c, currentPath)}<div><h2><a href="${relLink(currentPath, `${c.slug}/index.html`)}">${c.name}</a></h2><p>${escapeHtml(c.description)}</p></div><span class="catalog-count">${c.articles.length} 篇</span></div>
      <div class="catalog-article-grid">${c.articles.map((a) => `<a class="catalog-article" href="${relLink(currentPath, a.path)}" data-catalog-item data-search="${escapeHtml(`${a.title} ${a.description} ${a.tags.join(' ')}`)}"><span>${escapeHtml(a.title)}</span><small>${a.minutes} 分钟${a.quizCount ? ` · ${a.quizCount} 练习` : ''}</small></a>`).join('')}</div>
    </section>`).join('');
  const catalogGroups = catalogData.catalog.map((group) => `
    <section class="catalog-group" data-filter-group>
      <div class="catalog-group-head"><span class="catalog-group-icon">${iconTag(group.icon, currentPath, 'catalog-group-icon-img', '')}</span><h2>${group.group}</h2><span>${group.items.length} 个主题</span></div>
      <div class="catalog-grid">${group.items.map((item) => {
        const href = item.local ? relLink(currentPath, item.local) : item.url;
        const external = !item.local;
        return `<a class="catalog-item${item.local ? ' is-local' : ''}" href="${href}" ${external ? 'target="_blank" rel="noopener"' : ''} data-catalog-item data-search="${escapeHtml(`${item.name} ${item.desc}`)}"><div class="catalog-item-top"><span class="catalog-item-name">${iconTag(item.icon, currentPath, 'catalog-item-icon', '')}<strong>${escapeHtml(item.name)}</strong></span><span class="source-badge ${item.local ? 'local' : 'external'}">${item.local ? '本站精讲' : '详细文档 ↗'}</span></div><p>${escapeHtml(item.desc)}</p></a>`;
      }).join('')}</div>
    </section>`).join('');
  const content = `<div class="container directory-page">
    <header class="directory-hero"><span class="section-kicker">ALL TUTORIALS</span><h1>全部教程</h1><p>${categories.length} 个教程分类、${articles.length} 篇可下载文章、${catalogCount} 个课程主题。按 Python、AI、前端、后端、数据库、移动、DevOps、计算机基础等方向浏览，也可以用搜索和筛选快速定位。</p>
      <div class="directory-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg><input id="catalogFilter" placeholder="筛选教程主题，例如 Avalonia、Docker、SQL…" autocomplete="off"></div>
      <div class="directory-actions"><a class="btn btn-primary btn-sm" href="${relLink(currentPath, 'md/all.md')}" download>↓ 下载全站 Markdown</a><a class="btn btn-ghost btn-sm" href="${relLink(currentPath, 'exercises.html')}">去练习 →</a></div>
    </header>
    <div class="catalog-section-head"><div><span class="section-kicker">STARLEARN TRACKS</span><h2>本站精讲课程</h2></div><span class="section-note">完整正文、代码示例、练习与 .md 下载</span></div>
    <div class="local-catalog">${localSections}</div>
    <div class="catalog-section-head catalog-heading"><div><span class="section-kicker">STARLEARN CURRICULUM</span><h2>完整技术课程目录</h2></div><span class="section-note">150 个主题 · 12 个方向 · 核心路线本地精讲</span></div>
    <div class="callout callout-note"><div class="callout-title">关于目录</div><p>本目录按 Python/数据科学、AI/智能开发、前端、后端、数据库、移动开发、DevOps、编程语言、计算机基础、XML/Web Service、.NET 与网站建设 12 个方向整理，共 150 个主题。标记“本站精讲”的主题拥有原创中文教程、练习和 Markdown 下载；标记“详细文档”的主题会打开对应技术的官方文档，便于继续查阅完整语法与 API。</p></div>
    <div class="catalog-groups">${catalogGroups}</div>
    <div class="directory-empty" id="catalogEmpty" hidden>没有匹配的教程，换个关键词试试。</div>
  </div>`;
  return layout({ title: '全部教程', description: 'StarLearn 全部教程目录，覆盖 Python/数据科学、AI、前端、后端、数据库、移动开发、DevOps、编程语言、计算机基础、XML、.NET 与网站建设共 150 个主题。', currentPath, content, bodyClass: 'page-directory' });
}

// ---------------------------------------------------------------------------
// Exercises
// ---------------------------------------------------------------------------
function exercisesPage() {
  const currentPath = 'exercises.html';
  const practiceArticles = articles.filter((a) => a.practice);
  const globalQuizzes = readYaml(path.join(ROOT, 'data', 'global-quiz.yml')).quizzes;
  const quizHtml = globalQuizzes.map((q, i) => renderQuizCard(q, i, 'global')).join('');
  const practiceList = practiceArticles.map((a) => {
    const cat = categoryMap.get(a.category);
    return `<a class="practice-row" href="${relLink(currentPath, a.path)}" data-progress-key="${a.path}">${catBadge(cat, currentPath)}<span><strong>${escapeHtml(a.title)}</strong><small>${escapeHtml(a.description)}</small></span><span class="practice-count">${a.quizCount} 题</span><span class="lesson-row-check">✓</span><span class="lesson-row-arrow">→</span></a>`;
  }).join('');
  const content = `<div class="container exercises-page">
    <header class="directory-hero"><span class="section-kicker">PRACTICE LAB</span><h1>练习与测验</h1><p>学习不是看懂，而是能独立写出来。先做一轮综合测验，再进入各路线练习课。所有题目都在浏览器内即时判分。</p><div class="hero-stats"><div><strong>${articles.reduce((s, a) => s + a.quizCount, 0)}</strong><span>随堂练习</span></div><div><strong>${practiceArticles.length}</strong><span>练习课</span></div><div><strong>${globalQuizzes.length}</strong><span>综合题</span></div></div></header>
    <section class="exercise-section"><div class="section-heading"><div><span class="section-kicker">WARM UP</span><h2>综合热身测验</h2></div><span class="section-note">覆盖编程基础、C#、Python、Linux、AI、前端与部署</span></div><div class="quiz-stack">${quizHtml}</div></section>
    <section class="exercise-section"><div class="section-heading"><div><span class="section-kicker">TRACK PRACTICE</span><h2>各路线练习课</h2></div><span class="section-note">建议学完对应模块后完成</span></div><div class="practice-list">${practiceList}</div></section>
    <div class="inline-cta"><div><strong>想要更多练习？</strong><p>每篇文章末尾都有随堂练习；也可以用 AI 助手根据当前页面即时出题。</p></div><button class="btn btn-primary btn-sm js-open-ai" type="button">让 AI 出题 →</button></div>
  </div>`;
  return layout({ title: '练习与测验', description: 'StarLearn练习中心：交互式综合测验与各技术路线练习课，即时判分并查看解析。', currentPath, content, bodyClass: 'page-exercises' });
}

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------
function notFoundPage() {
  const currentPath = '404.html';
  const content = `<div class="container not-found"><span class="not-found-code">404</span><h1>这个页面不在教程里</h1><p>可能是链接写错了，或者内容已经移动。试试搜索，或者从全部教程重新开始。</p><div class="hero-actions"><a class="btn btn-primary" href="${relLink(currentPath, 'index.html')}">回到首页</a><a class="btn btn-ghost" href="${relLink(currentPath, 'all-tutorials.html')}">浏览全部教程</a></div></div>`;
  return layout({ title: '页面未找到', description: '404 页面', currentPath, content, bodyClass: 'page-404' });
}

// ---------------------------------------------------------------------------
// Markdown downloads
// ---------------------------------------------------------------------------
function articleMarkdown(a) {
  return a.raw.trim() + '\n';
}

function collectionMarkdown(category) {
  const header = `# ${category.name} · 完整课程 Markdown\n\n> ${category.description}\n>\n> 来源：${site.name}（${site.latin}）· 导出日期：${BUILD_DATE}\n> 共 ${category.articles.length} 篇文章，约 ${category.minutes} 分钟。\n\n## 目录\n\n${category.articles.map((a, i) => `${i + 1}. ${a.title}`).join('\n')}\n\n---\n\n`;
  const body = category.articles.map((a) => `<!-- ${a.title} -->\n\n${a.body.trim()}`).join('\n\n---\n\n');
  return `${header}${body}\n`;
}

function allMarkdown() {
  const header = `# ${site.name} 全站教程 Markdown\n\n> ${site.tagline}\n>\n> ${site.description}\n>\n> 导出日期：${BUILD_DATE} · 共 ${articles.length} 篇文章 · ${categories.length} 条学习路线\n\n## 全站目录\n\n${categories.map((c) => `### ${c.name}\n\n${c.articles.map((a) => `- ${a.title}`).join('\n')}`).join('\n\n')}\n\n---\n\n`;
  const body = categories.map((c) => `# ${c.name}\n\n${c.articles.map((a) => `> ${a.description}\n\n${a.body.trim()}`).join('\n\n---\n\n')}`).join('\n\n---\n\n');
  return `${header}${body}\n`;
}

// ---------------------------------------------------------------------------
// Search index
// ---------------------------------------------------------------------------
function searchIndex() {
  const entries = [];
  for (const a of articles) {
    entries.push({
      title: a.title,
      description: a.description,
      url: a.path,
      category: a.categoryName,
      tags: a.tags,
      text: a.plain,
      icon: categoryMap.get(a.category)?.icon || site.icon,
      type: 'article',
    });
  }
  for (const c of categories) {
    entries.push({
      title: c.name,
      description: c.description,
      url: `${c.slug}/index.html`,
      category: '课程',
      tags: c.tags,
      text: `${c.intro} ${c.description}`,
      icon: c.icon,
      type: 'category',
    });
  }
  for (const p of standalonePages) {
    entries.push({
      title: p.title,
      description: p.description,
      url: p.path,
      category: '页面',
      tags: p.tags || [],
      text: p.plain,
      icon: site.icon,
      type: 'page',
    });
  }
  for (const group of catalogData.catalog) {
    for (const item of group.items) {
      const isLocal = Boolean(item.local);
      entries.push({
        title: item.name,
        description: item.desc,
        url: isLocal ? item.local : item.url,
        category: group.group,
        tags: [group.group, isLocal ? '本站精讲' : '详细文档'],
        text: `${group.group} ${item.name} ${item.desc}`,
        icon: item.icon,
        type: 'catalog',
        external: !isLocal,
      });
    }
  }
  return `window.__SEARCH_INDEX__ = ${JSON.stringify(entries)};\n`;
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writePage(relPath, html) {
  const full = path.join(DIST, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, html);
}

function writeFile(relPath, content) {
  const full = path.join(DIST, relPath);
  ensureDir(path.dirname(full));
  fs.writeFileSync(full, content);
}

function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  ensureDir(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);
  ensureDir(path.join(DIST, 'md'));

  // Pages
  writePage('index.html', homePage());
  writePage('all-tutorials.html', allTutorialsPage());
  writePage('exercises.html', exercisesPage());
  writePage('404.html', notFoundPage());

  for (const category of categories) {
    writePage(`${category.slug}/index.html`, categoryPage(category));
    for (const article of category.articles) {
      writePage(article.path, articlePage(article));
    }
  }
  for (const page of standalonePages) {
    writePage(page.path, layout({
      title: page.title,
      description: page.description,
      currentPath: page.path,
      content: `<div class="container standalone-page"><nav class="breadcrumb"><a href="${relLink(page.path, 'index.html')}">首页</a><span>/</span><span>${escapeHtml(page.title)}</span></nav><article class="article-card"><header class="article-header"><div class="article-eyebrow"><span class="badge badge-green">${escapeHtml(page.layout === 'about' ? '关于本站' : '页面')}</span></div><h1>${escapeHtml(page.title)}</h1><p class="article-lead">${escapeHtml(page.description)}</p><div class="article-meta"><span>更新于 ${formatDate(page.updated)}</span><span class="dot"></span><span>约 ${page.minutes} 分钟</span></div></header><div class="article-body">${page.html}</div><footer class="article-footer"><div class="article-tags">${(page.tags || []).map((t) => `<span class="tag"># ${escapeHtml(t)}</span>`).join('')}</div><div class="article-actions"><a class="btn btn-ghost btn-sm" href="${relLink(page.path, `md/pages/${page.slug}.md`)}" download>下载本页 .md</a></div></footer></article></div>`,
      bodyClass: 'page-standalone',
      article: page,
    }));
  }

  // Markdown downloads
  for (const article of articles) {
    writeFile(`md/${article.category}/${article.slug}.md`, articleMarkdown(article));
  }
  for (const page of standalonePages) {
    writeFile(`md/pages/${page.slug}.md`, articleMarkdown(page));
  }
  for (const category of categories) {
    writeFile(`md/${category.slug}.md`, collectionMarkdown(category));
  }
  writeFile('md/all.md', allMarkdown());
  writeFile('md/README.md', `# ${site.name} Markdown 下载\n\n- \`all.md\`：全站文章合集\n- \`<分类>.md\`：单个课程合集\n- \`<分类>/<文章>.md\`：单篇文章\n\n导出日期：${BUILD_DATE}\n`);

  // Static assets & meta
  copyDir(STATIC, path.join(DIST, 'static'));
  fs.copyFileSync(path.join(STATIC, 'img/brand/favicon.ico'), path.join(DIST, 'favicon.ico'));
  writeFile('static/search-index.js', searchIndex());
  writeFile('robots.txt', `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}/sitemap.xml\n` : ''}`);
  writeFile('.nojekyll', '');
  writeFile('manifest.webmanifest', JSON.stringify({
    name: site.name,
    short_name: site.name,
    description: site.description,
    start_url: './',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#1d4ed8',
    icons: [
      { src: 'static/img/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { src: 'static/img/brand/starlearn-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'static/img/brand/starlearn-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2));

  const urls = ['index.html', 'all-tutorials.html', 'exercises.html', 'about.html', ...categories.map((c) => `${c.slug}/index.html`), ...articles.map((a) => a.path)];
  if (SITE_URL) {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].map((u) => `  <url><loc>${SITE_URL}/${u}</loc><lastmod>${BUILD_DATE}</lastmod></url>`).join('\n')}\n</urlset>\n`;
    writeFile('sitemap.xml', sitemap);
  }

  // 构建产物需要能被 Nginx/静态服务器读取（避免 umask 导致 600 权限）。
  chmodTree(DIST);

  // Report
  const totalQuizzes = articles.reduce((s, a) => s + a.quizCount, 0);
  const totalChars = articles.reduce((s, a) => s + a.chars, 0);
  console.log(`✓ Build complete: ${articles.length} articles, ${categories.length} tracks, ${standalonePages.length} pages, ${totalQuizzes} quizzes, ${totalChars.toLocaleString()} chars.`);
  console.log(`  Output: ${DIST}`);
  const iconTotal = fs.readdirSync(path.join(DIST, 'static/img/icons')).length;
  console.log(`  Icons: ${iconTotal} local open-license SVGs (Simple Icons CC0, Lucide ISC)`);
}

function chmodTree(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      fs.chmodSync(full, 0o755);
      chmodTree(full);
    } else if (entry.isFile()) {
      fs.chmodSync(full, 0o644);
    }
  }
}

build();
