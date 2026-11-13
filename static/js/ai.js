/* StarLearn — AI learning assistant */
(() => {
  'use strict';
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const root = document.body.dataset.root || './';
  const pageTitle = document.body.dataset.pageTitle || document.title;
  const pageId = document.body.dataset.pageId || 'index.html';

  const widget = $('#aiWidget');
  if (!widget) return;
  const launcher = $('#aiLauncher');
  const panel = $('#aiPanel');
  const closeBtn = $('#aiCloseBtn');
  const settingsBtn = $('#aiSettingsBtn');
  const settingsPanel = $('#aiSettings');
  const settingsClose = $('#aiSettingsClose');
  const modeSelect = $('#aiMode');
  const apiFields = $('#aiApiFields');
  const endpointInput = $('#aiEndpoint');
  const keyInput = $('#aiKey');
  const modelInput = $('#aiModel');
  const saveBtn = $('#aiSaveSettings');
  const clearBtn = $('#aiClearSettings');
  const saveStatus = $('#aiSaveStatus');
  const statusText = $('#aiStatus');
  const pageTitleEl = $('#aiPageTitle');
  const messagesEl = $('#aiMessages');
  const form = $('#aiForm');
  const input = $('#aiInput');
  const sendBtn = $('#aiSend');
  const quick = $('#aiQuick');

  const SETTINGS_KEY = 'techlearn:ai-settings';
  const defaultSettings = { mode: 'knowledge', endpoint: '', key: '', model: '' };
  let settings = loadSettings();
  let history = [];
  let busy = false;
  let isOpen = false;

  function loadSettings() {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
    } catch { return { ...defaultSettings }; }
  }
  function persist() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
  }
  function escapeHtml(value = '') {
    return String(value)
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }
  function pageContext() {
    const scope = $('.article-body') || $('main');
    const text = (scope?.innerText || '').replace(/\s+/g, ' ').trim();
    return { title: pageTitle, url: location.href, path: pageId, text };
  }
  function syncStatus() {
    if (settings.mode === 'api' && settings.endpoint) {
      statusText.textContent = `${settings.model || '自定义模型'} · API`;
    } else {
      statusText.textContent = '站内知识库 · 免配置';
    }
    if (pageTitleEl) pageTitleEl.textContent = pageTitle;
  }

  function openPanel() {
    panel.hidden = false;
    widget.classList.add('open');
    isOpen = true;
    syncStatus();
    setTimeout(() => input.focus(), 80);
    scrollMessages();
  }
  function closePanel() {
    panel.hidden = true;
    widget.classList.remove('open');
    isOpen = false;
  }
  launcher?.addEventListener('click', openPanel);
  closeBtn?.addEventListener('click', closePanel);
  document.addEventListener('techlearn:ai-open', openPanel);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      if (settingsPanel && !settingsPanel.hidden) closeSettings();
      else if (isOpen) closePanel();
    }
  });

  /* Settings ------------------------------------------------------------- */
  function fillSettings() {
    modeSelect.value = settings.mode;
    endpointInput.value = settings.endpoint;
    keyInput.value = settings.key;
    modelInput.value = settings.model;
    apiFields.hidden = settings.mode !== 'api';
  }
  function openSettings() {
    fillSettings();
    settingsPanel.hidden = false;
    saveStatus.textContent = '';
  }
  function closeSettings() { settingsPanel.hidden = true; }
  settingsBtn?.addEventListener('click', openSettings);
  settingsClose?.addEventListener('click', closeSettings);
  modeSelect?.addEventListener('change', () => {
    apiFields.hidden = modeSelect.value !== 'api';
  });
  $$('[data-preset]').forEach((btn) => btn.addEventListener('click', () => {
    const preset = btn.dataset.preset;
    if (preset === 'deepseek') {
      endpointInput.value = 'https://api.deepseek.com/v1/chat/completions';
      modelInput.value = 'deepseek-chat';
    } else if (preset === 'openai') {
      endpointInput.value = 'https://api.openai.com/v1/chat/completions';
      modelInput.value = 'gpt-4o-mini';
    } else if (preset === 'ollama') {
      endpointInput.value = 'http://localhost:11434/v1/chat/completions';
      modelInput.value = 'llama3.1';
    } else if (preset === 'local') {
      endpointInput.value = '/api/chat';
      modelInput.value = 'server-default';
      keyInput.value = '';
    }
    modeSelect.value = 'api';
    apiFields.hidden = false;
  }));
  saveBtn?.addEventListener('click', () => {
    const mode = modeSelect.value;
    if (mode === 'api' && !endpointInput.value.trim()) {
      saveStatus.textContent = '请先填写接口地址，或选择“站内知识库”模式。';
      saveStatus.style.color = 'var(--danger)';
      return;
    }
    settings = {
      mode,
      endpoint: endpointInput.value.trim(),
      key: keyInput.value.trim(),
      model: modelInput.value.trim(),
    };
    persist();
    syncStatus();
    saveStatus.style.color = 'var(--brand)';
    saveStatus.textContent = '设置已保存 ✓';
    setTimeout(closeSettings, 650);
  });
  clearBtn?.addEventListener('click', () => {
    settings.key = '';
    keyInput.value = '';
    persist();
    saveStatus.textContent = '已清除浏览器中保存的 API Key。';
  });

  /* Messages ------------------------------------------------------------- */
  function scrollMessages() {
    requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
  }
  function format(text) {
    let safe = escapeHtml(text);
    safe = safe.replace(/```([\s\S]*?)```/g, (_, code) => `<pre>${code.trim()}</pre>`);
    safe = safe.replace(/`([^`]+)`/g, '<code>$1</code>');
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    safe = safe.replace(/^#{1,4} (.+)$/gm, '<strong>$1</strong>');
    safe = safe.replace(/^\s*[-*] (.+)$/gm, '• $1');
    safe = safe.replace(/\n/g, '<br>');
    return safe;
  }
  function addMessage(role, content, { html = null, loading = false } = {}) {
    const wrap = document.createElement('div');
    wrap.className = `ai-msg ${role}${loading ? ' loading' : ''}`;
    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    if (html) bubble.innerHTML = html;
    else bubble.innerHTML = role === 'bot' ? format(content) : escapeHtml(content).replace(/\n/g, '<br>');
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollMessages();
    return wrap;
  }
  function setBusy(value) {
    busy = value;
    sendBtn.disabled = value;
    input.disabled = value;
  }

  /* Knowledge retrieval -------------------------------------------------- */
  const STOP = new Set('的 了 是 在 我 你 他 她 它 怎么 如何 什么 为什么 请 一下 这个 那个 可以 需要 以及 和 与 或 吗 呢 啊 这 那 里 页 文章 教程 学习 有 用 做 到 从 把 被 让 给 对 会 能 要 就 也 都 还 但 而 及 其 中 上 下 个 些 一 二 三 哪些 哪个 多少 介绍 解释 告诉 帮 帮我 想 想要 应该 比较 区别 之间'.split(/\s+/));
  function queryTerms(query) {
    const terms = new Set();
    const cleaned = query.toLowerCase().replace(/[，。！？、；：“”‘’（）【】《》…—,.!?;:'"()\[\]{}<>]/g, ' ');
    for (const token of cleaned.split(/\s+/)) {
      if (!token || STOP.has(token)) continue;
      if (/^[a-z0-9+#.\-_/]+$/.test(token) && token.length >= 2) terms.add(token);
    }
    const cjkRuns = cleaned.match(/[\u3400-\u9fff]+/g) || [];
    for (const run of cjkRuns) {
      if (run.length <= 4 && !STOP.has(run)) terms.add(run);
      for (let size = 2; size <= 4; size += 1) {
        for (let i = 0; i + size <= run.length; i += 1) {
          const part = run.slice(i, i + size);
          if (!STOP.has(part)) terms.add(part);
        }
      }
    }
    return [...terms].slice(0, 24);
  }
  function retrieve(query, limit = 4) {
    const index = Array.isArray(window.__SEARCH_INDEX__) ? window.__SEARCH_INDEX__ : [];
    if (!index.length) return [];
    const terms = queryTerms(query);
    if (!terms.length) return [];
    return index.map((entry) => {
      const title = entry.title.toLowerCase();
      const desc = (entry.description || '').toLowerCase();
      const tags = (entry.tags || []).join(' ').toLowerCase();
      const text = (entry.text || '').toLowerCase();
      let score = 0;
      let strong = 0;
      for (const term of terms) {
        if (title.includes(term)) { score += 12; strong += 2; }
        if (tags.includes(term)) { score += 6; strong += 1; }
        if (desc.includes(term)) { score += 4; strong += 1; }
        if (text.includes(term)) { score += 3; strong += 1; }
      }
      return { entry, score, strong };
    }).filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.entry);
  }
  function knowledgeAnswer(question) {
    const results = retrieve(question, 4);
    if (!results.length) {
      return `<p>我在站内暂时没有找到与“<strong>${escapeHtml(question.slice(0, 80))}</strong>”直接相关的内容。</p><p class="ai-muted">可以试试更具体的关键词，例如 “Avalonia 数据绑定”、“llama.cpp 量化”、“Nginx 反向代理” 或 “SSH 密钥”。也可以先在设置中接入大模型 API，获得生成式回答。</p>`;
    }
    const terms = queryTerms(question);
    const findSnippet = (entry) => {
      const source = entry.text || '';
      const lower = source.toLowerCase();
      let pos = -1;
      for (const term of terms) {
        const hit = lower.indexOf(term);
        if (hit >= 0 && (pos < 0 || hit < pos)) pos = hit;
      }
      if (pos < 0) return (entry.description || '').slice(0, 180);
      const start = Math.max(0, pos - 70);
      const end = Math.min(source.length, pos + 190);
      return `${start > 0 ? '…' : ''}${source.slice(start, end).replace(/\s+/g, ' ')}${end < source.length ? '…' : ''}`;
    };
    const links = results.map((entry, i) => {
      const external = entry.external || /^https?:/i.test(entry.url || '');
      const href = external ? entry.url : `${root}${entry.url}`;
      return `<p><strong>${i + 1}. ${escapeHtml(entry.title)}</strong><br><span class="ai-muted">${escapeHtml(entry.description || '')}</span><br><span class="ai-snippet">${escapeHtml(findSnippet(entry))}</span><br><a href="${href}" ${external ? 'target="_blank" rel="noopener"' : ''}>阅读对应章节 →</a></p>`;
    }).join('');
    return `<p>我根据站内全文索引找到了这些相关内容：</p>${links}<p class="ai-muted">这是离线知识库检索，会搜索教程正文、代码与目录。配置大模型后，我可以结合这些内容做更完整的解释、对比和出题。</p>`;
  }

  /* API ------------------------------------------------------------------ */
  function normalizeEndpoint(endpoint) {
    const url = endpoint.trim();
    if (!url) return '';
    if (url.endsWith('/api/chat')) return url;
    if (/\/chat\/completions\/?$/.test(url)) return url;
    if (/\/v1\/?$/.test(url)) return `${url.replace(/\/$/, '')}/chat/completions`;
    return `${url.replace(/\/$/, '')}/chat/completions`;
  }
  function systemPrompt(context, retrieved) {
    const refs = retrieved.map((r) => `- ${r.title}：${r.description}\n  节选：${(r.text || '').slice(0, 1200)}\n  地址：${r.url}`).join('\n');
    return `你是“StarLearn”的中文 AI 学习助手，面向正在学习编程、AI、Linux 与服务器部署的学生。请用清晰、准确、可执行的中文回答，必要时给出代码示例和步骤。不要编造不存在的 API；不确定时明确说明。\n\n当前页面：${context.title}\n页面地址：${context.url}\n页面内容摘要：${context.text}\n\n站内相关章节：\n${refs || '（无）'}\n\n回答时优先结合当前页面与上述站内资料，并在合适时建议下一步学习内容。`
  }
  async function askApi(question) {
    const endpoint = normalizeEndpoint(settings.endpoint);
    const context = pageContext();
    const retrieved = retrieve(question, 5);
    const isSiteProxy = endpoint.endsWith('/api/chat');
    const system = systemPrompt(context, retrieved);
    const messages = [
      { role: 'system', content: system },
      ...history.slice(-8),
      { role: 'user', content: question },
    ];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90000);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (settings.key) headers.Authorization = `Bearer ${settings.key}`;
      const payload = isSiteProxy
        ? { messages, page: { title: context.title, url: context.url }, mode: 'tutor' }
        : { model: settings.model || 'gpt-4o-mini', messages, temperature: 0.4, max_tokens: 1400 };
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = data?.error?.message || data?.error || data?.message || `HTTP ${response.status}`;
        throw new Error(msg);
      }
      const reply = data.reply || data.choices?.[0]?.message?.content || data.message?.content || data.response;
      if (!reply) throw new Error('接口返回了空内容。');
      history.push({ role: 'user', content: question }, { role: 'assistant', content: reply });
      return reply;
    } finally {
      clearTimeout(timer);
    }
  }

  async function answer(question) {
    if (busy) return;
    const q = question.trim();
    if (!q) return;
    addMessage('user', q);
    input.value = '';
    input.style.height = 'auto';
    setBusy(true);
    const thinking = addMessage('bot', '', { loading: true });
    try {
      let reply;
      if (settings.mode === 'api' && settings.endpoint) {
        reply = await askApi(q);
        thinking.remove();
        addMessage('bot', reply);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 240));
        thinking.remove();
        addMessage('bot', '', { html: knowledgeAnswer(q) });
      }
    } catch (error) {
      thinking.remove();
      let message = error?.name === 'AbortError'
        ? '请求超时。请检查网络、接口地址，或稍后重试。'
        : error?.message || '请求失败。';
      if (String(message).includes('Failed to fetch')) {
        message = '浏览器无法访问该接口。常见原因是 CORS 跨域限制或接口地址不可达。GitHub Pages 静态站点建议使用支持 CORS 的服务，或部署 server/ai_proxy.py 作为同源代理。';
      }
      addMessage('bot', '', {
        html: `<p><strong>请求没有完成。</strong></p><p>${escapeHtml(message)}</p><p class="ai-muted">可以切换到“站内知识库”模式继续检索教程，或检查 AI 设置。</p>`,
      });
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  /* UI events ------------------------------------------------------------ */
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    answer(input.value);
  });
  input?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.requestSubmit();
    }
  });
  input?.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 110)}px`;
  });
  $$('#aiQuick button').forEach((btn) => btn.addEventListener('click', () => {
    answer(btn.dataset.aiPrompt || btn.textContent);
  }));

  syncStatus();
  fillSettings();
})();
