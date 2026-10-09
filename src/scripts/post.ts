const prose = document.querySelector<HTMLElement>('.prose');

if (prose) {
  prose.querySelectorAll<HTMLElement>('h2[id], h3[id]').forEach((h) => {
    const a = document.createElement('a');
    a.className = 'anchor';
    a.href = `#${h.id}`;
    a.setAttribute('aria-hidden', 'true');
    a.textContent = '#';
    h.prepend(a);
  });

  prose.querySelectorAll<HTMLElement>('pre').forEach((pre) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.querySelector('code')?.innerText ?? pre.innerText);
        btn.textContent = 'Copied';
      } catch {
        btn.textContent = '⌘C';
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1400);
    });
    pre.append(btn);
  });

  const card = document.createElement('div');
  card.className = 'note-card';
  card.setAttribute('role', 'tooltip');
  document.body.append(card);
  prose.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]').forEach((ref) => {
    const note = document.getElementById(decodeURIComponent(ref.hash.slice(1)));
    if (!note) return;
    const html = note.innerHTML.replace(/<a[^>]*data-footnote-backref[^>]*>.*?<\/a>/g, '');
    const show = () => {
      card.innerHTML = html;
      const r = ref.getBoundingClientRect();
      const w = Math.min(300, innerWidth - 32);
      card.style.width = `${w}px`;
      card.style.left = `${Math.max(16, Math.min(r.left + scrollX - w / 2, innerWidth - w - 16))}px`;
      card.style.top = `${r.bottom + scrollY + 8}px`;
      card.classList.add('on');
    };
    const hide = () => card.classList.remove('on');
    ref.addEventListener('mouseenter', show);
    ref.addEventListener('focus', show);
    ref.addEventListener('mouseleave', hide);
    ref.addEventListener('blur', hide);
  });

  const vt = (fn: () => void) => (document.startViewTransition ? document.startViewTransition(fn) : (fn(), null));
  prose.querySelectorAll<HTMLImageElement>('figure img').forEach((img) => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'zoom';
      const big = new Image();
      big.src = img.currentSrc || img.src;
      big.alt = img.alt;
      overlay.append(big);
      img.style.viewTransitionName = 'zoom-img';
      vt(() => {
        img.style.viewTransitionName = '';
        big.style.viewTransitionName = 'zoom-img';
        document.body.append(overlay);
      });
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && dismiss();
      const dismiss = () => {
        removeEventListener('keydown', onKey);
        const t = vt(() => {
          big.style.viewTransitionName = '';
          img.style.viewTransitionName = 'zoom-img';
          overlay.remove();
        });
        const clear = () => (img.style.viewTransitionName = '');
        t ? t.finished.finally(clear) : clear();
      };
      overlay.addEventListener('click', dismiss);
      addEventListener('keydown', onKey);
    });
  });

  const toc = document.querySelector<HTMLElement>('.toc');
  if (toc) {
    const ind = toc.querySelector<HTMLElement>('.ind')!;
    const links = [...toc.querySelectorAll<HTMLAnchorElement>('a')];
    const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
    const spy = () => {
      let idx = 0;
      heads.forEach((h, i) => {
        if (h && h.getBoundingClientRect().top < innerHeight * 0.3) idx = i;
      });
      links.forEach((a, i) => a.classList.toggle('on', i === idx));
      const li = links[idx]?.parentElement;
      if (li) {
        ind.style.transform = `translateY(${li.offsetTop}px)`;
        ind.style.height = `${li.offsetHeight}px`;
      }
    };
    addEventListener('scroll', spy, { passive: true });
    spy();
  }
}
