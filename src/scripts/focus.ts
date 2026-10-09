// Research card: an "agent" streams a bpy script into Blender's text editor while the viewport and timeline follow along.
// The viewport holds the Cycles render of the dance: typed frames preview it, the render call plays it.
import { end as END, lineHTML, lines, MOVE, moves } from '../lib/dance';

const FPS = 24;
const SPAN = 155; // frames visible on the timeline (see Focus.astro)

const root = document.querySelector<HTMLElement>('.bl');
if (root) start(root);

function start(root: HTMLElement) {
  const $ = <T extends Element>(s: string) => root.querySelector<T>(s)!;
  const $$ = <T extends Element>(s: string) => [...root.querySelectorAll<T>(s)];
  const view = $<HTMLElement>('.bl-view');
  const video = $<HTMLVideoElement>('.bl-video');
  const editor = $<HTMLElement>('.bl-editor');
  const rows = $$<HTMLElement>('.bl-code .ln');
  const nums = $$<HTMLElement>('.bl-gutter li');
  const frameOut = $<HTMLElement>('.bl-fn');
  const head = $<HTMLElement>('.bl-ph');
  const headOut = head.querySelector('span')!;
  const keys = $<HTMLElement>('.bl-keys');
  const marks = $$<HTMLElement>('.bl-marks b');
  const post = $<HTMLElement>('.bl-range.post');
  const runBtn = $<HTMLElement>('.bl-run');
  const timeline = $<HTMLElement>('.bl-time');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const S = { frame: 1, playing: false, rendered: false };
  let gen = 0;
  let shown = -1;

  // ---------- viewport + timeline ----------

  const at = (f: number) => `${3 + (f / SPAN) * 94}%`;
  const mode = (m: 'plain' | 'dressed' | 'video') => (root.dataset.mode = m);
  // Cycles redraws the viewport progressively after a change.
  const resample = () => {
    view.classList.remove('rs');
    void view.offsetWidth;
    view.classList.add('rs');
  };

  const move = (f: number) => moves.reduce((cur, m) => (f >= m.frame ? m.frame : cur), moves[0].frame);
  const highlight = (f: number | null) => {
    $$<HTMLElement>('.bl-code .mv').forEach((t) => t.classList.toggle('on', Number(t.dataset.f) === f));
    marks.forEach((m) => m.classList.toggle('sel', Number(m.dataset.f) === f));
  };

  const overlays = () => {
    const f = Math.min(END, Math.max(1, Math.floor(S.frame + 0.02)));
    head.style.left = at(S.frame);
    if (f === shown) return;
    shown = f;
    frameOut.textContent = headOut.textContent = String(f);
    if (S.rendered) highlight(move(f));
  };

  const seek = (f: number) => {
    S.frame = f;
    overlays();
    video.currentTime = (f - 1) / FPS + 0.001;
    if (root.dataset.mode !== 'video')
      video.addEventListener('seeked', () => root.dataset.mode === 'dressed' && mode('video'), { once: true });
  };

  let primed = false;
  const prime = () => {
    if (primed) return;
    primed = true;
    video.preload = 'auto';
    video.load();
  };

  const vfc = 'requestVideoFrameCallback' in video;
  let handle = 0;
  const tick = () => {
    if (!S.playing) return;
    S.frame = Math.min(END, 1 + video.currentTime * FPS);
    overlays();
    handle = vfc ? video.requestVideoFrameCallback(tick) : requestAnimationFrame(tick);
  };
  const resume = () => {
    if (!S.playing || !awake()) return;
    video.play().then(
      () => {
        if (vfc) video.cancelVideoFrameCallback(handle);
        else cancelAnimationFrame(handle);
        tick();
      },
      () => (S.playing = false),
    );
  };
  const play = (from?: number) => {
    S.rendered = true;
    S.playing = true;
    shown = -1;
    if (from) video.currentTime = (from - 1) / FPS;
    mode('video');
    resume();
  };

  // ---------- typing (an LLM streaming tokens) ----------

  let visible = false;
  const waiters: (() => void)[] = [];
  const awake = () => visible && !document.hidden;
  const release = () => awake() && waiters.splice(0).forEach((f) => f());
  const gate = () => (awake() ? Promise.resolve() : new Promise<void>((ok) => waiters.push(ok)));
  const wait = (ms: number) => new Promise<void>((ok) => setTimeout(ok, ms)).then(gate);

  const paint = (i: number, text: string, caret: boolean) => {
    rows[i].innerHTML = lineHTML(text) + (caret ? '<span class="cur"></span>' : '');
  };
  const focusLine = (i: number) => {
    rows.forEach((row, k) => row.classList.toggle('cl', k === i));
    nums.forEach((n, k) => (n.style.visibility = k <= i ? '' : 'hidden'));
    const lh = rows[0].offsetHeight || 13;
    editor.scrollTop = Math.max(0, (i - Math.floor(editor.clientHeight / lh) + 3) * lh);
  };

  const lineOf = (test: (l: string) => boolean) => lines.findIndex(test);
  const cues = new Map<number, () => unknown>([
    [lineOf((l) => l.includes('.action = ')), () => keys.classList.remove('off')],
    [
      lineOf((l) => l.includes('["suspender_trousers"] = 1')),
      () => {
        mode('dressed');
        resample();
      },
    ],
    [
      lineOf((l) => l.includes('markers.new(')),
      async () => {
        for (const m of marks) {
          m.classList.remove('off');
          await wait(110);
        }
      },
    ],
    [lineOf((l) => l.includes('frame_end =')), () => post.classList.remove('off')],
    [
      lineOf((l) => l.startsWith('bpy.ops.render')),
      async () => {
        runBtn.classList.add('on');
        await wait(420);
        runBtn.classList.remove('on');
        play(1);
      },
    ],
  ]);
  const typed = lines.flatMap((l, i) => [...l.matchAll(MOVE)].map((m) => ({ i, end: m.index! + m[0].length, f: Number(m[1]) })));

  async function type(g: number) {
    const fired = new Set<number>();
    await wait(500);
    for (let i = 0; i < lines.length; i++) {
      const text = lines[i];
      const toks = text.match(/\s+|[A-Za-z_]+|\d+(?:\.\d+)?|./gu) ?? [];
      focusLine(i);
      let col = 0;
      for (let k = 0; k < toks.length; ) {
        const n = 1 + Number(Math.random() < 0.55) + Number(Math.random() < 0.2);
        for (let j = 0; j < n && k < toks.length; j++) col += toks[k++].length;
        paint(i, text.slice(0, col), true);
        for (const t of typed)
          if (t.i === i && t.end <= col && !fired.has(t.f)) {
            fired.add(t.f);
            seek(t.f);
            resample();
            await wait(t.f === 1 ? 300 : 560);
          }
        await wait(16 + Math.random() * 22);
        if (g !== gen) return;
      }
      paint(i, text, i === lines.length - 1);
      await cues.get(i)?.();
      await wait(text ? 70 : 40);
      if (g !== gen) return;
    }
  }

  const reset = () => {
    rows.forEach((row) => ((row.innerHTML = ''), row.classList.remove('cl')));
    [keys, post, ...marks].forEach((el) => el.classList.add('off'));
    highlight(null);
    Object.assign(S, { frame: 1, playing: false, rendered: false });
    video.pause();
    mode('plain');
    shown = -1;
    overlays();
    runBtn.classList.remove('on');
    focusLine(0);
    editor.scrollTop = 0;
  };

  const showAll = () => {
    lines.forEach((l, i) => paint(i, l, false));
    rows.forEach((row) => row.classList.remove('cl'));
    nums.forEach((n) => (n.style.visibility = ''));
    [keys, post, ...marks].forEach((el) => el.classList.remove('off'));
    if (root.dataset.mode === 'plain') mode('dressed');
    editor.scrollTop = 0;
  };

  const run = () => {
    const g = ++gen;
    reset();
    type(g);
  };

  // ---------- scrubbing ----------

  let scrub = false;
  const scrubTo = (e: PointerEvent) => {
    const box = timeline.getBoundingClientRect();
    const f = Math.round(((((e.clientX - box.left) / box.width) * 100 - 3) / 94) * SPAN);
    seek(Math.min(END, Math.max(1, f)));
  };
  timeline.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    if (!S.rendered) {
      gen++;
      showAll();
      S.rendered = true;
    }
    prime();
    timeline.setPointerCapture(e.pointerId);
    scrub = true;
    S.playing = false;
    video.pause();
    scrubTo(e);
  });
  timeline.addEventListener('pointermove', (e) => scrub && scrubTo(e));
  const endScrub = () => {
    if (!scrub) return;
    scrub = false;
    if (!reduce) play();
  };
  timeline.addEventListener('pointerup', endScrub);
  timeline.addEventListener('pointercancel', endScrub);
  runBtn.addEventListener('click', () => {
    if (!reduce) run();
  });

  new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    if (visible) prime();
    release();
    if (visible) resume();
    else video.pause();
  }).observe(view);
  document.addEventListener('visibilitychange', () => {
    release();
    if (document.hidden) video.pause();
    else resume();
  });

  // ---------- go ----------

  if (reduce) {
    showAll();
    S.rendered = true;
    prime();
    seek(59);
  } else run();
  root.dataset.ready = '';
}
