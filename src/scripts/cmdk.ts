import { toggleTheme } from './theme';

interface Item {
  group: string;
  title: string;
  sub?: string;
  icon?: string;
  thumb?: string;
  url?: string;
  external?: boolean;
  lead?: boolean;
  keys?: string[];
  keywords?: string;
  action?: 'theme' | 'lang' | 'copy';
}

const data = JSON.parse(document.getElementById('cmdk-data')!.textContent!) as {
  items: Item[];
  strings: { groups: Record<string, string>; placeholder: string; empty: string; copied: string; copyFailed: string };
  icons: Record<string, string>;
};
const { items, strings, icons } = data;
const GROUPS = ['nav', 'writing', 'papers', 'links', 'actions'];

const root = document.querySelector<HTMLElement>('.cmdk')!;
const input = root.querySelector<HTMLInputElement>('#cmdk-q')!;
const list = root.querySelector<HTMLElement>('#cmdk-list')!;
const toast = document.querySelector<HTMLElement>('.toast')!;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function say(msg: string) {
  toast.textContent = msg;
  toast.classList.add('on');
  clearTimeout((say as any).t);
  (say as any).t = setTimeout(() => toast.classList.remove('on'), 1600);
}

function fuzzy(q: string, text: string) {
  const t = text.toLowerCase();
  const at = t.indexOf(q);
  if (at >= 0) {
    const boundary = at === 0 || /[\s\-_:/.(·,]/.test(t[at - 1]);
    return { score: 100 + q.length * 3 + (boundary ? 20 : 0) - at * 0.05, hits: [...q].map((_, i) => at + i) };
  }
  let from = 0;
  let prev = -2;
  let score = 0;
  const hits: number[] = [];
  for (const ch of q) {
    if (ch === ' ') continue;
    const i = t.indexOf(ch, from);
    if (i < 0) return null;
    score += 1 + (i === prev + 1 ? 2.5 : 0) + (i === 0 || /[\s\-_:/.(·,]/.test(t[i - 1]) ? 1.5 : 0);
    hits.push(i);
    prev = i;
    from = i + 1;
  }
  if (hits.length > 1 && hits[hits.length - 1] - hits[0] > hits.length * 3) return null;
  return { score, hits };
}

const mark = (text: string, hits: number[]) => {
  const set = new Set(hits);
  return [...text].map((c, i) => (set.has(i) ? `<mark>${esc(c)}</mark>` : esc(c))).join('');
};

let results: { it: Item; hits: number[] }[] = [];
let active = 0;

function search(raw: string) {
  const q = raw.trim().toLowerCase();
  if (!q) return items.filter((it) => it.group !== 'papers' || it.lead).map((it) => ({ it, hits: [] as number[] }));
  const scored: { it: Item; hits: number[]; score: number }[] = [];
  for (const it of items) {
    const inTitle = fuzzy(q, it.title);
    const inRest = inTitle ? null : fuzzy(q, `${it.sub ?? ''} ${it.keywords ?? ''}`);
    const m = inTitle ?? (inRest && { score: inRest.score * 0.6, hits: [] });
    if (m) scored.push({ it, hits: m.hits, score: m.score });
  }
  scored.sort((a, b) => GROUPS.indexOf(a.it.group) - GROUPS.indexOf(b.it.group) || b.score - a.score);
  const per: Record<string, number> = {};
  return scored.filter((r) => (per[r.it.group] = (per[r.it.group] ?? 0) + 1) <= (r.it.group === 'papers' ? 8 : 5));
}

function render() {
  results = search(input.value);
  active = Math.min(active, Math.max(0, results.length - 1));
  if (!results.length) {
    list.innerHTML = `<li class="cmdk-empty">${esc(strings.empty)} “${esc(input.value)}”</li>`;
    return;
  }
  let html = '';
  let group = '';
  results.forEach(({ it, hits }, i) => {
    if (it.group !== group) {
      group = it.group;
      html += `<li class="cmdk-group" role="presentation">${esc(strings.groups[group])}</li>`;
    }
    const ic = it.thumb ? `<img src="${it.thumb}" alt="" loading="lazy">` : icons[it.icon ?? ''] ?? '';
    const hint = it.keys ? it.keys.map((k) => `<kbd>${k}</kbd>`).join('') : it.external ? icons.arrow : '';
    html += `<li class="cmdk-item" role="option" id="cmdk-${i}" data-i="${i}" aria-selected="${i === active}"><span class="ic">${ic}</span><span class="tx"><span class="tl">${mark(it.title, hits)}</span>${it.sub ? `<span class="sb">${esc(it.sub)}</span>` : ''}</span><span class="hint">${hint}</span></li>`;
  });
  list.innerHTML = html;
  input.setAttribute('aria-activedescendant', `cmdk-${active}`);
}

function select(i: number, scroll = true) {
  if (!results.length) return;
  active = (i + results.length) % results.length;
  list.querySelectorAll<HTMLElement>('.cmdk-item').forEach((el) => el.setAttribute('aria-selected', String(Number(el.dataset.i) === active)));
  input.setAttribute('aria-activedescendant', `cmdk-${active}`);
  if (scroll) document.getElementById(`cmdk-${active}`)?.scrollIntoView({ block: 'nearest' });
}

function switchLanguage() {
  const a = document.querySelector<HTMLAnchorElement>('[data-lang-switch]');
  if (a) a.click();
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(location.href);
    say(strings.copied);
  } catch {
    say(strings.copyFailed);
  }
}

function run(i: number) {
  const r = results[i];
  if (!r) return;
  close();
  const { it } = r;
  if (it.action === 'theme') return setTimeout(() => toggleTheme(document.querySelector('[data-theme-toggle]')), 60);
  if (it.action === 'lang') return switchLanguage();
  if (it.action === 'copy') return copyLink();
  if (!it.url) return;
  if (it.external) window.open(it.url, '_blank', 'noopener');
  else location.href = it.url;
}

let lastFocus: Element | null = null;
const isOpen = () => !root.hidden;

function open() {
  if (isOpen()) return;
  lastFocus = document.activeElement;
  root.hidden = false;
  input.value = '';
  active = 0;
  render();
  requestAnimationFrame(() => root.classList.add('on'));
  input.focus();
}

function close() {
  if (!isOpen()) return;
  root.classList.remove('on');
  setTimeout(() => (root.hidden = true), 180);
  (lastFocus as HTMLElement | null)?.focus?.();
}

input.addEventListener('input', () => {
  active = 0;
  render();
});
list.addEventListener('pointermove', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('.cmdk-item');
  if (el && Number(el.dataset.i) !== active) select(Number(el.dataset.i), false);
});
list.addEventListener('click', (e) => {
  const el = (e.target as Element).closest<HTMLElement>('.cmdk-item');
  if (el) run(Number(el.dataset.i));
});
root.querySelector('.cmdk-backdrop')!.addEventListener('click', close);
document.querySelectorAll('[data-cmdk]').forEach((b) => b.addEventListener('click', open));

let gAt = 0;
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    return isOpen() ? close() : open();
  }
  if (isOpen()) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'n')) select(active + 1);
    else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'p')) select(active - 1);
    else if (e.key === 'Enter') run(active);
    else return;
    e.preventDefault();
    return;
  }
  const el = document.activeElement as HTMLElement | null;
  if (e.metaKey || e.ctrlKey || e.altKey || (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable))) return;
  const k = e.key.toLowerCase();
  if (Date.now() - gAt < 900 && 'rwet'.includes(k)) {
    gAt = 0;
    const id = { r: 'research', w: 'writing', e: 'experience', t: 'talks' }[k]!;
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    else location.href = `${document.documentElement.lang === 'zh-CN' ? '/zh/' : '/'}#${id}`;
  } else if (k === 'g') gAt = Date.now();
  else if (k === 'd') toggleTheme(document.querySelector('[data-theme-toggle]'));
  else if (k === 'l') switchLanguage();
  else if (e.key === '/') {
    e.preventDefault();
    const q = document.getElementById('q') as HTMLInputElement | null;
    q ? q.focus() : open();
  }
});
