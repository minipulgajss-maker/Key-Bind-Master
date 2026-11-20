import { startAuth } from './auth.js';
import { startLanguage } from './i18n.js';

let versionLine = '';

function paintVersion() {
  if (!versionLine) return;
  document.querySelectorAll('[data-version]').forEach((element) => (element.textContent = versionLine));
}

async function showVersion() {
  try {
    const response = await fetch('version.json', { cache: 'no-store' });
    if (!response.ok) return;
    const { version, size } = await response.json();
    const megabytes = size ? ` · ${(size / 1048576).toFixed(1)} MB` : '';
    versionLine = `v${version}${megabytes} · Windows 10 / 11 · 64-bit`;
    paintVersion();
  } catch {
    return;
  }
}

startLanguage();
startAuth();
document.addEventListener('kbm-language', paintVersion);
showVersion();

const reveals = [...document.querySelectorAll('.reveal, .facts')];
if ('IntersectionObserver' in window && reveals.length) {
  const seen = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        seen.unobserve(entry.target);
      }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  reveals.forEach((element) => seen.observe(element));
} else reveals.forEach((element) => element.classList.add('in'));

const counters = [...document.querySelectorAll('[data-count]')];
if (counters.length && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const counting = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        counting.unobserve(entry.target);
        const goal = Number(entry.target.dataset.count);
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 900);
          entry.target.textContent = String(Math.round(goal * (1 - (1 - t) ** 3)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.6 }
  );
  counters.forEach((element) => counting.observe(element));
}

const SECTIONS = ['features', 'boost', 'pro', 'faq'];
const navLinks = [...document.querySelectorAll('.top nav a[href^="#"]')];

function sectionFromPath() {
  const fromHash = location.hash.slice(1);
  const fromPath = location.pathname.replace(/^\/+|\/+$/g, '');
  return SECTIONS.find((id) => id === fromHash || id === fromPath) ?? null;
}

function markCurrent(id) {
  navLinks.forEach((link) => link.toggleAttribute('aria-current', link.hash === `#${id}`));
}

function setPath(id, push) {
  const path = id ? `/${id}` : '/';
  if (location.pathname === path && !location.hash) return;
  history[push ? 'pushState' : 'replaceState']({ id }, '', path);
}

const SCROLL_OFFSET = 88;
let steering = false;
let glide = 0;

function glideTo(top, done) {
  cancelAnimationFrame(glide);
  const from = window.scrollY;
  const distance = top - from;
  const duration = Math.min(1100, 420 + Math.abs(distance) * 0.25);
  const start = performance.now();
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo({ top: from + distance * ease(t), behavior: 'instant' });
    if (t < 1) glide = requestAnimationFrame(step);
    else {
      steering = false;
      done();
    }
  };
  glide = requestAnimationFrame(step);
}
window.addEventListener('scrollend', () => (steering = false));

function goTo(id, smooth) {
  if (smooth) steering = true;
  const target = id ? document.getElementById(id) : document.getElementById('top');
  if (!target) return;
  const top = id ? target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET : 0;
  if (smooth) glideTo(top, () => {
    markCurrent(id);
    setPath(id, false);
  });
  else window.scrollTo(0, top);
  markCurrent(id);
}

if (navLinks.length) {
  navLinks.forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const id = link.hash.slice(1);
      setPath(id, true);
      goTo(id, true);
    })
  );
  document.querySelector('.top .brand')?.addEventListener('click', (event) => {
    event.preventDefault();
    setPath(null, true);
    goTo(null, true);
  });
  window.addEventListener('popstate', () => goTo(sectionFromPath(), true));
  window.addEventListener('hashchange', () => {
    const id = sectionFromPath();
    setPath(id, false);
    goTo(id, true);
  });

  const initial = sectionFromPath();
  if (initial) {
    setPath(initial, false);
    requestAnimationFrame(() => goTo(initial, false));
    steering = true;
    setTimeout(() => (steering = false), 700);
  }

  const visible = new Map();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.intersectionRatio));
      if (steering) return;
      const [best, ratio] = [...visible].sort((a, b) => b[1] - a[1])[0] ?? [];
      const id = ratio > 0.25 ? best : window.scrollY < 200 ? null : undefined;
      if (id === undefined) return;
      markCurrent(id);
      setPath(id, false);
    },
    { threshold: [0, 0.25, 0.5, 0.75], rootMargin: '-80px 0px -30% 0px' }
  );
  SECTIONS.forEach((id) => document.getElementById(id) && observer.observe(document.getElementById(id)));
}

const calm = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

const header = document.querySelector('.top');
const stage = document.querySelector('[data-stage]');
let framePending = false;

function onScroll() {
  framePending = false;
  header?.classList.toggle('is-scrolled', window.scrollY > 8);
  if (!stage || calm.matches) return;
  const box = stage.getBoundingClientRect();
  const progress = Math.min(1, Math.max(0, (window.innerHeight - box.top) / (box.height * 0.9 + window.innerHeight * 0.25)));
  stage.style.setProperty('--p', progress.toFixed(3));
}
window.addEventListener('scroll', () => {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(onScroll);
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

const MAX_TILT = 10;

function tilt(card) {
  const reset = () => {
    card.classList.remove('is-tilting');
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--lift', '0');
  };
  card.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || calm.matches) return;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    card.classList.add('is-tilting');
    card.style.setProperty('--ry', `${((x - 0.5) * MAX_TILT * 2).toFixed(2)}deg`);
    card.style.setProperty('--rx', `${((0.5 - y) * MAX_TILT * 2).toFixed(2)}deg`);
    card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
    card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
    card.style.setProperty('--lift', '1');
  });
  card.addEventListener('pointerleave', reset);
}
document.querySelectorAll('.shot.tilt').forEach(tilt);

document.querySelectorAll('.tile').forEach((tile) =>
  tile.addEventListener('pointermove', (event) => {
    const box = tile.getBoundingClientRect();
    tile.style.setProperty('--mx', `${event.clientX - box.left}px`);
    tile.style.setProperty('--my', `${event.clientY - box.top}px`);
  })
);

const nav = document.querySelector('.top nav');
if (nav) {
  const pill = document.createElement('span');
  pill.className = 'nav-pill';
  pill.setAttribute('aria-hidden', 'true');
  nav.prepend(pill);
  let shown = false;
  const place = () => {
    const current = nav.querySelector('a[aria-current]');
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
  new MutationObserver(place).observe(nav, { attributes: true, subtree: true, attributeFilter: ['aria-current'] });
  document.addEventListener('kbm-language', () => requestAnimationFrame(place));
  window.addEventListener('resize', place);
  place();
}
