/* StarLearn — site interactions */
(() => {
  'use strict';

  const body = document.body;
  const root = body.dataset.root || './';
  const pageId = body.dataset.pageId || 'index.html';
  const pageTitle = body.dataset.pageTitle || document.title;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const storage = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
    },
    remove(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };

  /* Theme ---------------------------------------------------------------- */
  const themeToggle = $('#themeToggle');
  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#08111c' : '#1d4ed8';
    themeToggle?.setAttribute('aria-label', theme === 'dark' ? '切换浅色模式' : '切换深色模式');
  };
  applyTheme(storage.get('techlearn:theme', matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  themeToggle?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storage.set('techlearn:theme', next);
  });

  /* Mobile drawer -------------------------------------------------------- */
  const drawer = $('#mobileDrawer');
  const menuBtn = $('#mobileMenuBtn');
  const openDrawer = () => {
    if (!drawer) return;
    drawer.hidden = false;
    body.classList.add('drawer-open');
    menuBtn?.setAttribute('aria-expanded', 'true');
  };
  const closeDrawer = () => {
    if (!drawer) return;
    drawer.hidden = true;
    body.classList.remove('drawer-open');
    menuBtn?.setAttribute('aria-expanded', 'false');
  };
  menuBtn?.addEventListener('click', () => (drawer?.hidden ? openDrawer() : closeDrawer()));
  $$('[data-close-drawer]').forEach((el) => el.addEventListener('click', closeDrawer));
  $$('#mobileDrawer a').forEach((a) => a.addEventListener('click', closeDrawer));
  window.addEventListener('resize', () => { if (innerWidth > 1050) closeDrawer(); });

  /* Search --------------------------------------------------------------- */
  const searchModal = $('#searchModal');
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');
  const searchCount = $('#searchCount');
  const index = Array.isArray(window.__SEARCH_INDEX__) ? window.__SEARCH_INDEX__ : [];
  let searchItems = [];
  let searchActive = -1;
  let lastFocused = null;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');

  const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function highlight(text, query) {
    const safe = escapeHtml(text);
    const terms = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
    if (!terms.length) return safe;
    return safe.replace(new RegExp(`(${terms.join('|')})`, 'gi'), '<mark>$1</mark>');
  }

  function bodySnippet(entry, term) {
    const text = String(entry.text || '').replace(/\s+/g, ' ').trim();
    const needle = String(term || '').toLowerCase();
    if (!text || !needle) return '';
    const pos = text.toLowerCase().indexOf(needle);
    if (pos < 0) return '';
    const start = Math.max(0, pos - 46);
    const end = Math.min(text.length, pos + 104);
    return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
  }

  function searchSummary(entry, query) {
    const description = entry.description || '';
    const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const descLower = description.toLowerCase();
    const missing = terms.find((term) => !descLower.includes(term));
    return (missing && bodySnippet(entry, missing)) || description;
  }

  function searchScore(entry, query) {
    const q = query.toLowerCase().trim();
    if (!q) return 0;
    const terms = q.split(/\s+/).filter(Boolean);
    const title = entry.title.toLowerCase();
    const desc = (entry.description || '').toLowerCase();
    const tags = (entry.tags || []).join(' ').toLowerCase();
    const category = (entry.category || '').toLowerCase();
    const text = (entry.text || '').toLowerCase();
    let score = 0;
    for (const term of terms) {
      let termScore = 0;
      if (title.includes(term)) termScore += 40;
      if (title.startsWith(term)) termScore += 20;
      if (desc.includes(term)) termScore += 14;
      if (tags.includes(term)) termScore += 12;
      if (category.includes(term)) termScore += 6;
      if (text.includes(term)) termScore += 2;
      if (!termScore) return 0;
      score += termScore;
    }
    return score;
  }

  function renderSearch(query = '') {
    if (!searchModal || !searchResults) return;
    const q = query.trim();
    let matches;
    if (!q) {
      matches = index.slice(0, 7);
    } else {
      matches = index
        .map((entry) => ({ entry, score: searchScore(entry, q) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 18)
        .map((x) => x.entry);
    }
    searchItems = matches;
    searchActive = matches.length ? 0 : -1;
    if (!matches.length) {
      searchResults.innerHTML = `<div class="search-empty">没有找到“${escapeHtml(q)}”。试试更短的关键词，例如 <strong>llama</strong>、<strong>MVVM</strong> 或 <strong>权限</strong>。</div>`;
      if (searchCount) searchCount.textContent = '0 条结果';
      return;
    }
    searchResults.innerHTML = matches.map((entry, i) => {
      const cat = entry.category || '';
      const external = entry.external || /^https?:/i.test(entry.url || '');
      const href = external ? entry.url : `${root}${entry.url}`;
      return `<a class="search-result${i === searchActive ? ' active' : ''}" href="${href}" ${external ? 'target="_blank" rel="noopener"' : ''} data-search-index="${i}">
        <span class="search-result-icon">${entry.icon ? `<img src="${root}${entry.icon}" alt="" loading="lazy">` : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5A1.5 1.5 0 0 1 18.5 21H6.5A2.5 2.5 0 0 1 4 18.5z"></path><path d="M8 7h8M8 11h6"></path></svg>'}</span>
        <span class="search-result-main"><small>${escapeHtml(cat)}${external ? ' · 详细文档 ↗' : ''}</small><strong>${highlight(entry.title, q)}</strong><p>${highlight(searchSummary(entry, q), q)}</p></span>
      </a>`;
    }).join('');
    if (searchCount) searchCount.textContent = `${matches.length} 条结果`;
    $$('.search-result', searchResults).forEach((a, i) => {
      a.addEventListener('mouseenter', () => setSearchActive(i));
    });
  }

  function setSearchActive(next) {
    const results = $$('.search-result', searchResults);
    if (!results.length) return;
    searchActive = (next + results.length) % results.length;
    results.forEach((el, i) => el.classList.toggle('active', i === searchActive));
    results[searchActive]?.scrollIntoView({ block: 'nearest' });
  }

  function openSearch(prefill = '') {
    if (!searchModal) return;
    lastFocused = document.activeElement;
    searchModal.hidden = false;
    body.classList.add('search-open');
    if (searchInput) {
      searchInput.value = prefill;
      renderSearch(prefill);
      setTimeout(() => searchInput.focus(), 30);
    }
  }

  function closeSearch() {
    if (!searchModal) return;
    searchModal.hidden = true;
    body.classList.remove('search-open');
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  $('#searchTrigger')?.addEventListener('click', () => openSearch());
  $('#heroSearch')?.addEventListener('click', () => openSearch());
  $$('[data-close-search]').forEach((el) => el.addEventListener('click', closeSearch));
  $$('[data-search-term]').forEach((btn) => btn.addEventListener('click', () => {
    if (!searchInput) return;
    searchInput.value = btn.dataset.searchTerm || '';
    renderSearch(searchInput.value);
    searchInput.focus();
  }));
  searchInput?.addEventListener('input', () => renderSearch(searchInput.value));
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setSearchActive(searchActive + 1); }
    if (event.key === 'ArrowUp') { event.preventDefault(); setSearchActive(searchActive - 1); }
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = searchItems[searchActive];
      if (target) {
        const external = target.external || /^https?:/i.test(target.url || '');
        const href = external ? target.url : `${root}${target.url}`;
        if (external) window.open(href, '_blank', 'noopener');
        else location.href = href;
      }
    }
  });
  searchResults?.addEventListener('click', (event) => {
    const link = event.target.closest('.search-result');
    if (link) closeSearch();
  });

  document.addEventListener('keydown', (event) => {
    const tag = (event.target?.tagName || '').toLowerCase();
    const typing = ['input', 'textarea', 'select'].includes(tag) || event.target?.isContentEditable;
    if ((event.key === '/' && !typing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape') {
      if (searchModal && !searchModal.hidden) closeSearch();
      if (drawer && !drawer.hidden) closeDrawer();
    }
  });

  /* Code copy buttons ---------------------------------------------------- */
  $$('.article-body pre, .standalone-page pre').forEach((pre) => {
    if (pre.querySelector('.code-copy')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-copy';
    button.textContent = '复制';
    button.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const text = code ? code.innerText : pre.innerText;
      try {
        await navigator.clipboard.writeText(text);
        button.textContent = '已复制 ✓';
      } catch {
        const range = document.createRange();
        range.selectNodeContents(code || pre);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        button.textContent = '请按 Ctrl+C';
      }
      setTimeout(() => { button.textContent = '复制'; }, 1800);
    });
    pre.appendChild(button);
  });

  /* Copy link / print ---------------------------------------------------- */
  $$('[data-copy-link]').forEach((btn) => btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      const old = btn.innerHTML;
      btn.innerHTML = '<span>✓</span>已复制';
      setTimeout(() => { btn.innerHTML = old; }, 1600);
    } catch { prompt('复制链接：', location.href); }
  }));
  $$('[data-print]').forEach((btn) => btn.addEventListener('click', () => window.print()));

  /* TOC scroll spy ------------------------------------------------------- */
  const tocLinks = $$('.toc-link');
  if (tocLinks.length) {
    const targets = tocLinks.map((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      return { link, el: document.getElementById(id) };
    }).filter((x) => x.el);
    let ticking = false;
    const updateToc = () => {
      let active = null;
      for (const target of targets) {
        if (target.el.getBoundingClientRect().top <= 130) active = target;
      }
      tocLinks.forEach((link) => link.classList.remove('active'));
      active?.link.classList.add('active');
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(updateToc); ticking = true; }
    }, { passive: true });
    updateToc();
  }

  /* Reading progress + back to top --------------------------------------- */
  const progressBar = $('#readingProgress');
  const backToTop = $('#backToTop');
  let rafPending = false;
  const onScroll = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - innerHeight;
      const pct = max > 0 ? Math.min(100, (scrollY / max) * 100) : 0;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (backToTop) backToTop.classList.toggle('show', scrollY > 500);
      rafPending = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backToTop?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* Learning progress ---------------------------------------------------- */
  const PROGRESS_KEY = 'techlearn:progress';
  const getProgress = () => storage.get(PROGRESS_KEY, []);
  const isDone = (key) => getProgress().includes(key);

  function paintProgress() {
    const done = new Set(getProgress());
    $$('[data-progress-key]').forEach((el) => el.classList.toggle('is-done', done.has(el.dataset.progressKey)));
    $$('[data-progress-fill]').forEach((fill) => {
      const cat = fill.dataset.progressFill;
      const keys = [...new Set($$(`[data-progress-key^="${cat}/"]`).map((el) => el.dataset.progressKey))];
      const count = keys.filter((key) => done.has(key)).length;
      fill.style.width = keys.length ? `${(count / keys.length) * 100}%` : '0%';
      const label = document.querySelector(`[data-progress-text="${cat}"]`);
      if (label) label.textContent = `${count} / ${keys.length}`;
    });
  }

  function toggleProgress(key) {
    const list = getProgress();
    const i = list.indexOf(key);
    if (i >= 0) list.splice(i, 1); else list.push(key);
    storage.set(PROGRESS_KEY, list);
    paintProgress();
  }

  $$('.js-mark-read').forEach((btn) => {
    const key = btn.dataset.markKey;
    const sync = () => {
      btn.textContent = isDone(key) ? '取消已学完标记' : '标记为已学完';
      btn.classList.toggle('is-done', isDone(key));
    };
    sync();
    btn.addEventListener('click', () => { toggleProgress(key); sync(); });
  });
  paintProgress();

  /* Notes ---------------------------------------------------------------- */
  const notesInput = $('#articleNotes');
  if (notesInput) {
    const notesKey = `techlearn:notes:${pageId}`;
    const status = $('#notesStatus');
    notesInput.value = storage.get(notesKey, '');
    let timer = null;
    const save = (auto = false) => {
      storage.set(notesKey, notesInput.value);
      if (status) {
        status.textContent = auto ? '已自动保存' : '笔记已保存 ✓';
        setTimeout(() => { if (status.textContent.includes('保存')) status.textContent = ''; }, 2000);
      }
    };
    notesInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => save(true), 700);
    });
    $('[data-notes-save]')?.addEventListener('click', () => save(false));
    $('[data-notes-clear]')?.addEventListener('click', () => {
      if (!notesInput.value || confirm('确定清空本页笔记吗？此操作不可撤销。')) {
        notesInput.value = '';
        storage.remove(notesKey);
        if (status) status.textContent = '已清空';
      }
    });
    $('[data-notes-export]')?.addEventListener('click', () => {
      const content = `# 学习笔记：${pageTitle}\n\n> 来源：StarLearn · ${location.href}\n> 导出时间：${new Date().toLocaleString('zh-CN')}\n\n${notesInput.value || '（暂无笔记）'}\n`;
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `notes-${pageId.replace(/\.html$/, '').replace(/[\\/]/g, '-')}.md`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  }

  /* Quizzes -------------------------------------------------------------- */
  $$('[data-quiz]').forEach((card) => {
    const check = $('[data-quiz-check]', card);
    const reveal = $('[data-quiz-reveal]', card);
    const feedback = $('.quiz-feedback', card);
    const explain = $('.quiz-explain', card);
    const answer = Number(card.dataset.answer);
    const labels = $$('.quiz-option', card);

    const clearMarks = () => {
      labels.forEach((label) => label.classList.remove('is-correct', 'is-wrong'));
      feedback.textContent = '';
      feedback.className = 'quiz-feedback';
    };

    labels.forEach((label) => label.addEventListener('change', clearMarks));

    check?.addEventListener('click', () => {
      const checked = card.querySelector('input[type="radio"]:checked');
      if (!checked) {
        feedback.textContent = '先选择一个答案，再检查。';
        feedback.className = 'quiz-feedback bad';
        return;
      }
      const selected = Number(checked.value);
      labels.forEach((label, i) => {
        label.classList.remove('is-correct', 'is-wrong');
        if (i === answer) label.classList.add('is-correct');
        if (i === selected && selected !== answer) label.classList.add('is-wrong');
      });
      if (selected === answer) {
        feedback.textContent = '回答正确 ✓';
        feedback.className = 'quiz-feedback ok';
      } else {
        feedback.textContent = `再想想。正确答案是 ${String.fromCharCode(65 + answer)}。`;
        feedback.className = 'quiz-feedback bad';
      }
      if (explain) explain.hidden = false;
    });

    reveal?.addEventListener('click', () => {
      if (explain) explain.hidden = !explain.hidden;
      reveal.textContent = explain?.hidden ? '查看解析' : '收起解析';
    });
  });

  /* Catalog filter ------------------------------------------------------- */
  const catalogFilter = $('#catalogFilter');
  if (catalogFilter) {
    const items = $$('[data-catalog-item]');
    const groups = $$('[data-filter-group]');
    const empty = $('#catalogEmpty');
    const filter = () => {
      const q = catalogFilter.value.trim().toLowerCase();
      let visible = 0;
      items.forEach((item) => {
        const hay = (item.dataset.search || item.textContent || '').toLowerCase();
        const show = !q || hay.includes(q);
        item.hidden = !show;
        if (show) visible += 1;
      });
      groups.forEach((group) => {
        const has = $$('[data-catalog-item]', group).some((el) => !el.hidden);
        group.hidden = !has;
      });
      if (empty) empty.hidden = visible !== 0;
    };
    catalogFilter.addEventListener('input', filter);
  }

  /* AI open buttons ------------------------------------------------------ */
  $$('.js-open-ai').forEach((btn) => btn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('techlearn:ai-open'));
  }));

  /* Close overlay with backdrop click ----------------------------------- */
  searchModal?.addEventListener('click', (event) => {
    if (event.target === searchModal) closeSearch();
  });
})();
