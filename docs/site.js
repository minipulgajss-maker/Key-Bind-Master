import { startAuth } from './auth.js';
import { startLanguage } from './i18n.js';

const calm = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

let versionLine = '';
const paintVersion = () => versionLine && $$('[data-version]').forEach((element) => (element.textContent = versionLine));

async function showVersion() {
  try {
    const response = await fetch('version.json', { cache: 'no-store' });
    if (!response.ok) return;
    const { size } = await response.json();
    versionLine = `Alpha${size ? ` · ${(size / 1048576).toFixed(1)} MB` : ''} · Windows 10 / 11 · 64-bit`;
    paintVersion();
  } catch {}
}

startLanguage();
startAuth();
showVersion();
document.addEventListener('kbm-language', paintVersion);

function reveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) return items.forEach((item) => item.classList.add('in'));
  const seen = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.children].filter((child) => child.classList.contains('reveal'));
        entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target), 5) * 70}ms`;
        entry.target.classList.add('in');
        seen.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  items.forEach((item) => seen.observe(item));
}

function counters() {
  const items = $$('[data-count]');
  if (!items.length || calm.matches || !('IntersectionObserver' in window)) return;
  const counting = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counting.unobserve(entry.target);
        const goal = Number(entry.target.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1100);
          entry.target.textContent = String(Math.round(goal * (1 - (1 - t) ** 3)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.6 }
  );
  items.forEach((item) => counting.observe(item));
}

function slidingPill(container, pill, selector) {
  let shown = false;
  const place = () => {
    const current = container.querySelector(selector);
    if (!current) {
      pill.style.opacity = '0';
      shown = false;
      return;
    }
    pill.classList.toggle('is-instant', !shown);
    shown = true;
    pill.style.opacity = '1';
    pill.style.width = `${current.offsetWidth}px`;
    pill.style.transform = `translateX(${current.offsetLeft}px)`;
  };
  new MutationObserver(place).observe(container, { attributes: true, subtree: true, attributeFilter: ['aria-current', 'aria-selected'] });
  document.addEventListener('kbm-language', () => requestAnimationFrame(place));
  window.addEventListener('resize', place);
  requestAnimationFrame(place);
}

const TABS = ['shortcuts', 'boost', 'pro'];

function tour() {
  const list = document.querySelector('.segmented');
  if (!list) return () => {};
  const tabs = $$('[role="tab"]', list);
  const select = (id, focus) => {
    tabs.forEach((tab) => {
      const on = tab.dataset.tab === id;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !on;
      if (on && focus) tab.focus();
    });
  };
  tabs.forEach((tab) => tab.addEventListener('click', () => select(tab.dataset.tab)));
  list.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const index = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    select(next.dataset.tab, true);
  });
  slidingPill(list, list.querySelector('.segment-pill'), '[aria-selected="true"]');
  return select;
}

function navigation(selectTab) {
  const links = $$('.nav a[href^="#"], .mobile-nav a[href^="#"]');
  const desktop = $$('.nav a[href^="#"]');
  const mark = (id) => desktop.forEach((link) => link.toggleAttribute('aria-current', link.hash === `#${id}`));
  const go = (id) => {
    if (TABS.includes(id)) selectTab(id);
    const target = document.getElementById(TABS.includes(id) && id !== 'shortcuts' ? 'tour' : id);
    target?.scrollIntoView({ behavior: calm.matches ? 'auto' : 'smooth' });
    mark(id);
  };
  links.forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.hash.slice(1);
      history.pushState(null, '', `#${id}`);
      closeMenu();
      go(id);
    })
  );
  const nav = document.querySelector('.nav');
  if (nav) {
    const pill = Object.assign(document.createElement('span'), { className: 'nav-pill' });
    pill.setAttribute('aria-hidden', 'true');
    nav.prepend(pill);
    slidingPill(nav, pill, 'a[aria-current]');
  }
  const initial = location.hash.slice(1);
  if (initial) requestAnimationFrame(() => go(initial));
  if (!('IntersectionObserver' in window)) return;
  const watch = [['features', 'features'], ['tour', null], ['faq', 'faq']];
  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const pair = watch.find(([id]) => id === entry.target.id);
        if (!pair) return;
        const tab = document.querySelector('.segmented [aria-selected="true"]')?.dataset.tab;
        mark(pair[1] ?? (tab === 'shortcuts' ? 'features' : tab));
      }),
    { rootMargin: '-45% 0px -50% 0px' }
  );
  watch.forEach(([id]) => document.getElementById(id) && spy.observe(document.getElementById(id)));
}

const menuButton = document.querySelector('[data-menu]');
const mobileNav = document.getElementById('mobile-nav');
function closeMenu() {
  if (!mobileNav) return;
  mobileNav.hidden = true;
  menuButton?.setAttribute('aria-expanded', 'false');
}
menuButton?.addEventListener('click', () => {
  const open = mobileNav.hidden;
  mobileNav.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
});
document.addEventListener('keydown', (event) => event.key === 'Escape' && closeMenu());
$$('.mobile-nav a:not([href^="#"])').forEach((link) => link.addEventListener('click', closeMenu));

function stage() {
  const element = document.querySelector('[data-stage]');
  if (!element || calm.matches) return;
  let pending = false;
  const update = () => {
    pending = false;
    const box = element.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (innerHeight - box.top) / (box.height * 0.8 + innerHeight * 0.2)));
    element.style.setProperty('--p', progress.toFixed(3));
  };
  window.addEventListener('scroll', () => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

const MAX_TILT = 9;
function setTilt(shot, x, y, strength) {
  shot.classList.add('is-tilting');
  shot.style.setProperty('--ry', `${(x * MAX_TILT * 2 * strength).toFixed(2)}deg`);
  shot.style.setProperty('--rx', `${(-y * MAX_TILT * 2 * strength).toFixed(2)}deg`);
  shot.style.setProperty('--rz', `${(x * y * -8).toFixed(2)}deg`);
  shot.style.setProperty('--gx', `${(50 + x * 100).toFixed(1)}%`);
  shot.style.setProperty('--gy', `${(50 + y * 100).toFixed(1)}%`);
  shot.style.setProperty('--lift', '1');
  shot.style.setProperty('--tz', `${((0.5 - Math.hypot(x, y)) * 50).toFixed(1)}px`);
  shot.style.setProperty('--ty', `${(y * -10).toFixed(1)}px`);
}
function resetTilt(shot) {
  shot.classList.remove('is-tilting');
  ['--rx', '--ry', '--rz'].forEach((name) => shot.style.setProperty(name, '0deg'));
  ['--tz', '--ty'].forEach((name) => shot.style.setProperty(name, '0px'));
  shot.style.setProperty('--lift', '0');
}

function tilts() {
  const shots = $$('.shot.tilt');
  shots.forEach((shot) => {
    shot.addEventListener('pointermove', (event) => {
      if (!finePointer.matches || calm.matches) return;
      const box = shot.getBoundingClientRect();
      setTilt(shot, (event.clientX - box.left) / box.width - 0.5, (event.clientY - box.top) / box.height - 0.5, 1);
    });
    shot.addEventListener('pointerleave', () => resetTilt(shot));
    shot.addEventListener('click', () => {
      if (calm.matches || shot.getAnimations().length) return;
      shot.animate(
        [{ transform: 'rotateY(0deg) scale(1)' }, { transform: 'rotateY(180deg) scale(0.92)', offset: 0.5 }, { transform: 'rotateY(360deg) scale(1)' }],
        { duration: 1100, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
      );
    });
  });
  if (finePointer.matches || calm.matches || !('DeviceOrientationEvent' in window)) return;
  let frame = 0;
  const clamp = (value) => Math.max(-0.5, Math.min(0.5, value / 36));
  const onTilt = (event) => {
    if (event.beta == null) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => shots.filter((shot) => shot.offsetParent).forEach((shot) => setTilt(shot, clamp(event.gamma ?? 0), clamp((event.beta ?? 45) - 45), 1.3)));
  };
  const start = () => window.addEventListener('deviceorientation', onTilt, { passive: true });
  if (typeof DeviceOrientationEvent.requestPermission !== 'function') return start();
  const ask = async () => {
    try {
      if ((await DeviceOrientationEvent.requestPermission()) === 'granted') start();
    } catch {}
    document.removeEventListener('touchend', ask);
  };
  document.addEventListener('touchend', ask, { once: true });
}

function spotlights() {
  $$('.tile').forEach((tile) =>
    tile.addEventListener('pointermove', (event) => {
      const box = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${event.clientX - box.left}px`);
      tile.style.setProperty('--my', `${event.clientY - box.top}px`);
    })
  );
}

reveal();
counters();
navigation(tour());
stage();
tilts();
spotlights();
