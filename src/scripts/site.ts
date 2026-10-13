type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initThemeToggle(): void {
  const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!button) return;

  const sync = () => button.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  sync();

  button.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    window.__theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage unavailable: the choice still holds for this session.
    }
    sync();
  });
}

function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  targets.forEach((el) => observer.observe(el));
}

/** On the home page, mark the nav link of the section being read. */
function initSectionHighlight(): void {
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('nav a[data-section]').forEach((link) => {
    const section = link.dataset.section;
    if (section && document.getElementById(section)) links.set(section, link);
  });
  // The projects link is a real page elsewhere; only treat it as a section when home has one.
  if (links.size < 2 || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => link.removeAttribute('aria-current'));
        // The hero has no nav link, so reaching it just clears the highlight.
        links.get(entry.target.id)?.setAttribute('aria-current', 'true');
      }
    },
    { rootMargin: '-35% 0px -60% 0px' },
  );
  links.forEach((_, id) => observer.observe(document.getElementById(id)!));
  const hero = document.querySelector('.hero');
  if (hero) observer.observe(hero);
}

function initTagFilter(): void {
  const filter = document.querySelector<HTMLElement>('[data-tag-filter]');
  const list = document.querySelector<HTMLElement>('[data-project-list]');
  if (!filter || !list) return;

  const buttons = [...filter.querySelectorAll<HTMLButtonElement>('button[data-tag]')];
  const items = [...list.querySelectorAll<HTMLElement>('li[data-tags]')];
  const status = document.querySelector<HTMLElement>('[data-filter-status]');
  filter.hidden = false;

  filter.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-tag]');
    if (!button) return;
    const tag = button.dataset.tag ?? '';

    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
    let shown = 0;
    for (const item of items) {
      const tags: string[] = JSON.parse(item.dataset.tags ?? '[]');
      const match = tag === '' || tags.includes(tag);
      item.hidden = !match;
      if (match) shown++;
    }
    if (status) status.textContent = `${shown} ${shown === 1 ? 'project' : 'projects'} shown`;
  });
}

// Fires on first load and after every view transition.
document.addEventListener('astro:page-load', () => {
  initThemeToggle();
  initReveal();
  initSectionHighlight();
  initTagFilter();
});
