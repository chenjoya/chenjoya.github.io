const list = document.getElementById('pubs');

if (list) {
  const items = [...list.querySelectorAll<HTMLLIElement>(':scope > .pub')];
  const seg = document.querySelector<HTMLElement>('#research .seg')!;
  const ind = seg.querySelector<HTMLElement>('.seg-ind')!;
  const input = document.getElementById('q') as HTMLInputElement;
  const empty = document.querySelector<HTMLElement>('#research .empty')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mode: 'selected' | 'all' = 'selected';
  let query = '';

  const moveIndicator = () => {
    const b = seg.querySelector<HTMLElement>('[aria-selected="true"]')!;
    ind.style.width = `${b.offsetWidth}px`;
    ind.style.transform = `translateX(${b.offsetLeft}px)`;
  };

  const visible = (el: HTMLLIElement) => {
    if (query) return el.dataset.all === 'true' && query.split(/\s+/).every((w) => el.dataset.search!.includes(w));
    return mode === 'selected' ? el.dataset.sel === 'true' : el.dataset.all === 'true';
  };

  // FLIP: animate rows from their old position instead of jumping.
  const apply = () => {
    const before = new Map(items.map((el) => [el, el.hidden ? null : el.getBoundingClientRect().top]));
    items.forEach((el) => (el.hidden = !visible(el)));
    empty.hidden = items.some((el) => !el.hidden);
    list.querySelector<HTMLElement>('.glide')?.style.setProperty('opacity', '0');
    if (reduce) return;
    items.forEach((el) => {
      if (el.hidden) return;
      const a = before.get(el);
      const b = el.getBoundingClientRect().top;
      if (a == null) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, delay: 60, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' });
      else if (Math.abs(a - b) > 0.5) el.animate([{ transform: `translateY(${a - b}px)` }, { transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' });
    });
  };

  seg.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('button');
    if (!b || b.getAttribute('aria-selected') === 'true') return;
    seg.querySelectorAll('button').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    mode = b.dataset.f as typeof mode;
    moveIndicator();
    apply();
  });

  input.addEventListener('input', () => {
    query = input.value.trim().toLowerCase();
    apply();
  });
  input.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    input.value = '';
    query = '';
    apply();
    input.blur();
  });

  list.addEventListener('click', (e) => {
    const row = (e.target as Element).closest<HTMLButtonElement>('.pub-row');
    if (!row) return;
    const open = row.closest('.pub')!.classList.toggle('open');
    row.setAttribute('aria-expanded', String(open));
  });

  moveIndicator();
  document.fonts.ready.then(moveIndicator);
}
