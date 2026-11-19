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
document.addEventListener('kbm-language', paintVersion);
showVersion();

const reveals = [...document.querySelectorAll('.reveal')];
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
