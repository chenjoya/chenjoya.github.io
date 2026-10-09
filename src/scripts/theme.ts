const root = document.documentElement;

export function toggleTheme(origin?: Element | null) {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => {
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();

  const rect = origin?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : innerWidth - 40;
  const y = rect ? rect.top + rect.height / 2 : 40;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.classList.add('theme-transition');
  const t = document.startViewTransition(apply);
  t.ready.then(() =>
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
    ),
  );
  t.finished.finally(() => root.classList.remove('theme-transition'));
}

document.querySelectorAll('[data-theme-toggle]').forEach((b) => b.addEventListener('click', () => toggleTheme(b)));
