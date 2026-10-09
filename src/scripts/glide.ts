// One highlight per list that slides to the hovered row.
document.querySelectorAll<HTMLElement>('.list').forEach((list) => {
  const g = document.createElement('li');
  g.className = 'glide';
  g.setAttribute('aria-hidden', 'true');
  list.prepend(g);

  list.addEventListener('pointerover', (e) => {
    const li = (e.target as Element).closest('li');
    if (!li || li === g || li.parentElement !== list || li.hidden) return;
    const row = li.querySelector<HTMLElement>(':scope > .row, :scope > .pub-row') ?? li;
    const y = li.offsetTop + row.offsetTop;
    if (g.style.opacity !== '1') {
      g.style.transition = 'none';
      g.style.transform = `translateY(${y}px)`;
      g.style.height = `${row.offsetHeight}px`;
      void g.offsetWidth;
      g.style.transition = '';
    }
    g.style.transform = `translateY(${y}px)`;
    g.style.height = `${row.offsetHeight}px`;
    g.style.opacity = '1';
  });
  list.addEventListener('pointerleave', () => (g.style.opacity = '0'));
});
