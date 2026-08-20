// Question renderers. Each factory returns a controller:
//   { el, getResponse(), reveal(correctAnswer, response), lock() }
// plus a tiny markdown renderer for stems and explanations.

// ── minimal markdown → HTML (bold, inline code, fenced blocks, pipe tables) ──
export function md(src) {
  if (!src) return '';
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const parts = String(src).split(/```/);
  let html = '';
  parts.forEach((seg, i) => {
    if (i % 2 === 1) { // fenced code block
      html += `<pre class="md-pre">${esc(seg.replace(/^\n/, ''))}</pre>`;
      return;
    }
    const lines = seg.split('\n');
    let out = '', tbl = [];
    const flushTable = () => {
      if (!tbl.length) return;
      const rows = tbl.filter((r) => !/^\s*\|?[\s:|-]+\|?\s*$/.test(r)); // drop --- separators
      let t = '<table class="md-table">';
      rows.forEach((r, ri) => {
        const cells = r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const tag = ri === 0 ? 'th' : 'td';
        t += '<tr>' + cells.map((c) => `<${tag}>${inline(esc(c))}</${tag}>`).join('') + '</tr>';
      });
      t += '</table>'; out += t; tbl = [];
    };
    for (const ln of lines) {
      if (/^\s*\|.*\|\s*$/.test(ln)) { tbl.push(ln); continue; }
      flushTable();
      if (ln.trim() === '') { out += ''; continue; }
      out += `<p>${inline(esc(ln))}</p>`;
    }
    flushTable();
    html += out;
  });
  return html;
  function inline(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+?)`/g, '<code>$1</code>');
  }
}

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

// ── the dispatcher ───────────────────────────────────────────────────────────
export function renderWidget(q, onInteract = () => {}) {
  switch (q.type) {
    case 'numeric': return numericW(q, onInteract);
    case 'text': return textW(q, onInteract);
    case 'mcq': return choiceW(q, onInteract, false);
    case 'multiselect': return choiceW(q, onInteract, true);
    case 'dropdowns': return dropdownsW(q, onInteract);
    case 'matching': return matchingW(q, onInteract);
    case 'ordering': return orderingW(q, onInteract);
    default: return { el: el('div', 'widget', 'Unsupported question type.'), getResponse: () => null, reveal() {}, lock() {} };
  }
}

// ── numeric / text ───────────────────────────────────────────────────────────
function numericW(q, onInteract) {
  const wrap = el('div', 'widget widget-numeric');
  const input = el('input', 'neon-input');
  input.type = 'text'; input.inputMode = 'decimal';
  // NEVER echo the stored example (it's the answer). Hint the format only.
  const dp = q.payload?.decimals;
  input.placeholder = dp > 0 ? `your answer (${dp} d.p.)` : 'your answer';
  input.autocomplete = 'off';
  input.addEventListener('input', onInteract);
  wrap.append(input);
  return {
    el: wrap,
    getResponse: () => (input.value.trim() === '' ? null : parseFloat(input.value.replace(/,/g, ''))),
    randomFill() { const v = Math.floor(Math.random() * 21); input.value = String(v); return v; },
    reveal(correct) { wrap.append(el('div', 'reveal-note', `Correct answer: <b>${correct}</b>`)); },
    lock() { input.disabled = true; },
    focus() { input.focus(); },
  };
}
function textW(q, onInteract) {
  const wrap = el('div', 'widget widget-numeric');
  const input = el('input', 'neon-input');
  // generic prompt only — never surface a stored example that could be the answer
  input.type = 'text'; input.placeholder = 'type the exact output';
  input.autocomplete = 'off';
  input.addEventListener('input', onInteract);
  wrap.append(input);
  return {
    el: wrap,
    getResponse: () => (input.value.trim() === '' ? null : input.value),
    randomFill() { const pool = ['0', '1', 'true', 'false', 'DataFrame', 'Eng', '(4, 4)']; const v = pool[Math.floor(Math.random() * pool.length)]; input.value = v; return v; },
    reveal(correct) { wrap.append(el('div', 'reveal-note', `Accepted answer: <b>${correct}</b>`)); },
    lock() { input.disabled = true; },
    focus() { input.focus(); },
  };
}

// ── mcq / multiselect ────────────────────────────────────────────────────────
function choiceW(q, onInteract, multi) {
  const wrap = el('div', 'widget widget-choice');
  const opts = q.payload?.options || [];
  const state = new Set();
  const rows = new Map();
  opts.forEach((o) => {
    const row = el('button', 'choice');
    row.type = 'button';
    row.innerHTML = `<span class="choice-key">${o.key}</span><span class="choice-text">${md(o.text).replace(/^<p>|<\/p>$/g, '')}</span>`;
    row.addEventListener('click', () => {
      if (row.classList.contains('locked')) return;
      if (multi) {
        state.has(o.key) ? state.delete(o.key) : state.add(o.key);
        row.classList.toggle('sel', state.has(o.key));
      } else {
        state.clear(); state.add(o.key);
        rows.forEach((r) => r.classList.remove('sel'));
        row.classList.add('sel');
      }
      onInteract();
    });
    rows.set(o.key, row);
    wrap.append(row);
  });
  if (multi) wrap.append(el('div', 'hint', '⚠ Multi-select: −50% of the question per wrong pick. Choose only what you\'re sure of.'));
  return {
    el: wrap,
    getResponse: () => (multi ? [...state] : ([...state][0] ?? null)),
    randomFill() {
      state.clear(); rows.forEach((r) => r.classList.remove('sel'));
      if (multi) {
        rows.forEach((row, key) => { if (Math.random() < 0.5) { state.add(key); row.classList.add('sel'); } });
        return [...state];
      }
      const keys = [...rows.keys()]; const k = keys[Math.floor(Math.random() * keys.length)];
      state.add(k); rows.get(k).classList.add('sel');
      return k;
    },
    reveal(correct) {
      const cset = new Set(Array.isArray(correct) ? correct : [correct]);
      rows.forEach((row, key) => {
        if (cset.has(key)) row.classList.add('right');
        else if (row.classList.contains('sel')) row.classList.add('wrong');
      });
    },
    lock() { rows.forEach((r) => r.classList.add('locked')); },
  };
}

// ── dropdowns (fill in the blanks) ───────────────────────────────────────────
function dropdownsW(q, onInteract) {
  const wrap = el('div', 'widget widget-dropdowns');
  const blanks = q.payload?.blanks || [];
  const selects = new Map();
  const mkSelect = (b) => {
    const s = el('select', 'neon-select');
    s.append(el('option', null, '—'));
    s.firstChild.value = '';
    b.options.forEach((opt) => { const o = el('option', null, opt); o.value = opt; s.append(o); });
    s.addEventListener('change', onInteract);
    selects.set(b.id, s);
    return s;
  };

  if (q.code && /⟨/.test(q.code)) {
    // inline the selects into the code where ⟨bX⟩ markers appear
    const pre = el('pre', 'md-pre code-fill');
    const tokens = q.code.split(/(⟨[a-z0-9]+⟩)/i);
    tokens.forEach((tok) => {
      const m = tok.match(/^⟨([a-z0-9]+)⟩$/i);
      if (m) {
        const b = blanks.find((x) => x.id === m[1]);
        if (b) pre.append(mkSelect(b));
        else pre.append(document.createTextNode(tok));
      } else {
        pre.append(document.createTextNode(tok));
      }
    });
    wrap.append(pre);
  } else {
    // labeled list of selects
    blanks.forEach((b) => {
      const row = el('div', 'blank-row');
      row.append(el('label', 'blank-label', b.label || b.id));
      row.append(mkSelect(b));
      wrap.append(row);
    });
  }
  return {
    el: wrap,
    getResponse: () => { const r = {}; selects.forEach((s, id) => (r[id] = s.value)); return r; },
    randomFill() {
      const r = {};
      selects.forEach((s, id) => { const b = blanks.find((x) => x.id === id); const opt = b.options[Math.floor(Math.random() * b.options.length)]; s.value = opt; r[id] = opt; });
      return r;
    },
    reveal(correct) {
      selects.forEach((s, id) => {
        s.classList.add(s.value === String(correct[id]) ? 'right' : 'wrong');
        if (s.value !== String(correct[id])) {
          const note = el('span', 'inline-correct', `→ ${correct[id]}`);
          s.after(note);
        }
      });
    },
    lock() { selects.forEach((s) => (s.disabled = true)); },
  };
}

// ── matching ─────────────────────────────────────────────────────────────────
function matchingW(q, onInteract) {
  const wrap = el('div', 'widget widget-matching');
  const lefts = q.payload?.left || [];
  const options = q.payload?.options || [];
  const selects = new Map();
  lefts.forEach((l) => {
    const row = el('div', 'match-row');
    row.append(el('div', 'match-left', md(l.text).replace(/^<p>|<\/p>$/g, '')));
    const s = el('select', 'neon-select');
    s.append(el('option', null, '— pick —')); s.firstChild.value = '';
    options.forEach((opt) => { const o = el('option', null, opt); o.value = opt; s.append(o); });
    s.addEventListener('change', onInteract);
    selects.set(l.id, s);
    row.append(s);
    wrap.append(row);
  });
  return {
    el: wrap,
    getResponse: () => { const r = {}; selects.forEach((s, id) => (r[id] = s.value)); return r; },
    randomFill() {
      const r = {};
      selects.forEach((s, id) => { const opt = options[Math.floor(Math.random() * options.length)]; s.value = opt; r[id] = opt; });
      return r;
    },
    reveal(correct) {
      selects.forEach((s, id) => {
        const ok = s.value === String(correct[id]);
        s.classList.add(ok ? 'right' : 'wrong');
        if (!ok) s.after(el('span', 'inline-correct', `→ ${correct[id]}`));
      });
    },
    lock() { selects.forEach((s) => (s.disabled = true)); },
  };
}

// ── ordering (reorder with ▲▼) ───────────────────────────────────────────────
function orderingW(q, onInteract) {
  const wrap = el('div', 'widget widget-ordering');
  wrap.append(el('div', 'hint', 'Use ▲ / ▼ to put these in the correct order (top = first).'));
  const list = el('div', 'order-list');
  let items = shuffle(q.payload?.items || []);
  const render = () => {
    list.innerHTML = '';
    items.forEach((it, idx) => {
      const row = el('div', 'order-row');
      row.dataset.id = it.id;
      row.append(el('span', 'order-num', String(idx + 1)));
      row.append(el('span', 'order-text', md(it.text).replace(/^<p>|<\/p>$/g, '')));
      const ctrl = el('span', 'order-ctrl');
      const up = el('button', 'ord-btn', '▲'); up.type = 'button';
      const dn = el('button', 'ord-btn', '▼'); dn.type = 'button';
      up.disabled = idx === 0; dn.disabled = idx === items.length - 1;
      up.addEventListener('click', () => { [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]]; render(); onInteract(); });
      dn.addEventListener('click', () => { [items[idx + 1], items[idx]] = [items[idx], items[idx + 1]]; render(); onInteract(); });
      ctrl.append(up, dn); row.append(ctrl);
      list.append(row);
    });
  };
  render();
  wrap.append(list);
  return {
    el: wrap,
    getResponse: () => items.map((i) => i.id),
    randomFill() { items = shuffle(items); render(); return items.map((i) => i.id); },
    reveal(correct) {
      [...list.children].forEach((row, idx) => {
        row.classList.add(row.dataset.id === correct[idx] ? 'right' : 'wrong');
      });
      const byId = Object.fromEntries((q.payload?.items || []).map((i) => [i.id, i.text]));
      wrap.append(el('div', 'reveal-note', `Correct order: <b>${correct.map((id) => byId[id] ?? id).join(' → ')}</b>`));
    },
    lock() { list.querySelectorAll('button').forEach((b) => (b.disabled = true)); },
  };
}
