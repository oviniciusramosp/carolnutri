import type Lenis from 'lenis';

/** Section rail + arrow jumps. Wheel/trackpad/touch stay free so overflow sections are not clipped. */
export function startJoySnap(lenis?: Lenis) {
  const sections = [...document.querySelectorAll<HTMLElement>('[data-joy-section]')];
  if (sections.length === 0) return;

  const nav = document.querySelector<HTMLElement>('.joy-snap-nav');
  const links = [...(nav?.querySelectorAll<HTMLAnchorElement>('[data-joy-snap]') ?? [])];
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

  const goTo = (index: number) => {
    const i = Math.max(0, Math.min(index, sections.length - 1));
    const target = sections[i];
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { duration: 0.7 });
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(i);
    const focused = document.activeElement;
    if (focused instanceof HTMLElement && focused.hasAttribute('data-joy-snap')) focused.blur();
  };

  const syncActive = () => {
    const y = (lenis ? lenis.scroll : window.scrollY) + 8;
    let i = 0;
    for (let idx = 0; idx < sections.length; idx++) {
      if (sections[idx].offsetTop <= y) i = idx;
    }
    setActive(i);
  };

  setActive(0);
  if (lenis) lenis.on('scroll', syncActive);
  else window.addEventListener('scroll', syncActive, { passive: true });

  links.forEach((link, i) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      goTo(i);
    });
  });

  window.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current - 1);
    }
  });
}
