import type Lenis from 'lenis';
import Snap from 'lenis/snap';

/** Proximity snap near section edges, plus the right-rail nav. Mid-section scroll stays free. Off on mobile. */
export function startJoySnap(lenis: Lenis) {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-joy-section]')];
  if (sections.length === 0) return;

  const nav = document.querySelector<HTMLElement>('.joy-snap-nav');
  const links = [...(nav?.querySelectorAll<HTMLAnchorElement>('[data-joy-snap]') ?? [])];
  const desktop = window.matchMedia('(min-width: 64.01rem)');
  let current = -1;

  const setActive = (index: number) => {
    const i = Math.max(0, Math.min(index, sections.length - 1));
    if (i === current) return;
    current = i;
    nav?.setAttribute('data-on', sections[i]?.dataset.joyTone ?? 'light');
    links.forEach((link, li) => {
      const on = li === i;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const snap = new Snap(lenis, {
    type: 'proximity',
    distanceThreshold: '14%',
    duration: 0.7,
    debounce: 280,
    onSnapStart: (item) => {
      if (typeof item.index === 'number') setActive(item.index);
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && focused.hasAttribute('data-joy-snap')) focused.blur();
    },
  });

  snap.addElements(sections, { align: 'start' });
  setActive(0);

  const applyMode = () => {
    if (desktop.matches) snap.start();
    else snap.stop();
  };
  applyMode();
  desktop.addEventListener('change', applyMode);

  const syncActive = () => {
    const y = lenis.scroll + 8;
    let i = 0;
    for (let idx = 0; idx < sections.length; idx++) {
      if (sections[idx].offsetTop <= y) i = idx;
    }
    setActive(i);
  };

  lenis.on('scroll', syncActive);

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = sections[i];
      if (!target) return;
      if (desktop.matches) snap.goTo(i);
      else lenis.scrollTo(target);
    });
  });

  window.addEventListener('keydown', (event) => {
    if (!desktop.matches) return;
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      snap.goTo(current + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      snap.goTo(current - 1);
    }
  });
}
