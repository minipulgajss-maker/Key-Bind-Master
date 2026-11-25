import { startAuth } from './auth.js?v=1795620603';
import { startLiquidGlass } from './glass.js?v=1795620603';
import { startLanguage } from './i18n.js?v=1795620603';

let versionLine = '';

function paintVersion() {
  if (!versionLine) return;
  document.querySelectorAll('[data-version]').forEach((element) => (element.textContent = versionLine));
}

async function showVersion() {
  try {
    const release = await releasedVersion();
    if (!release) return;
    const { version, size } = release;
    const megabytes = size ? ` · ${(size / 1048576).toFixed(1)} MB` : '';
    versionLine = `v${version}${megabytes} · Windows 10 / 11 · 64-bit`;
    paintVersion();
  } catch {
    return;
  }
}

async function releasedVersion() {
  const valid = (value) => (/^\d+\.\d+\.\d+$/.test(value ?? '') ? value : '');
  const parts = (value) => value.split('.').map(Number);
  const newer = (a, b) => {
    const [x, y] = [parts(a), parts(b)];
    for (let i = 0; i < 3; i += 1) if (x[i] !== y[i]) return x[i] > y[i];
    return false;
  };
  const found = [];
  try {
    const reply = await (await fetch('https://keybind-invites.minipulgajss.workers.dev/v1/release?track=2', { cache: 'no-store' })).json();
    if (valid(reply.release?.version)) found.push({ version: reply.release.version });
  } catch {}
  try {
    const stable = await (await fetch('track/stable.json', { cache: 'no-store' })).json();
    if (valid(stable.version)) found.push(stable);
  } catch {}
  let best = null;
  for (const item of found) {
    if (!best || newer(item.version, best.version) || (item.version === best.version && item.size)) best = item;
  }
  return best;
}

async function releasedInstaller() {
  const release = await releasedVersion();
  if (!release) return 'KeyBind-Master-Setup.exe';
  const file = `builds/KeyBind-Master-Setup-${release.version}.exe`;
  try {
    const head = await fetch(file, { method: 'HEAD', cache: 'no-store' });
    return head.ok ? file : 'KeyBind-Master-Setup.exe';
  } catch {
    return 'KeyBind-Master-Setup.exe';
  }
}

if (document.querySelector('[data-installer]')) {
  releasedInstaller().then((file) => {
    document.querySelectorAll('[data-installer]').forEach((link) => (link.href = file));
    setTimeout(() => location.assign(file), 600);
  });
}

startLanguage();
startAuth();
startLiquidGlass();
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
    ['--sx', '--sy', '--tz', '--ty'].forEach((name) => card.style.setProperty(name, '0'));
    card.style.setProperty('--rz', '0deg');
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
    const reach = Math.hypot(x - 0.5, y - 0.5);
    card.style.setProperty('--rz', `${((x - 0.5) * (y - 0.5) * -8).toFixed(2)}deg`);
    card.style.setProperty('--tz', `${((0.5 - reach) * 60).toFixed(1)}px`);
    card.style.setProperty('--ty', `${((y - 0.5) * -10).toFixed(1)}px`);
    card.style.setProperty('--sx', ((0.5 - x) * 40).toFixed(1));
    card.style.setProperty('--sy', ((0.5 - y) * 30).toFixed(1));
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

const shots = [...document.querySelectorAll('.shot.tilt')];
const TILT_RANGE = 18;
const PHONE_TILT = 22;
let gyroFrame = 0;
let gyroStarted = false;

function onOrientation(event) {
  if (calm.matches || event.beta == null) return;
  cancelAnimationFrame(gyroFrame);
  gyroFrame = requestAnimationFrame(() => {
    const clamp = (value) => Math.max(-1, Math.min(1, value / TILT_RANGE));
    const x = clamp(event.gamma ?? 0);
    const y = clamp((event.beta ?? 0) - 45);
    shots.forEach((shot) => {
      shot.classList.add('is-tilting');
      shot.style.setProperty('--ry', `${(x * PHONE_TILT).toFixed(2)}deg`);
      shot.style.setProperty('--rx', `${(-y * PHONE_TILT).toFixed(2)}deg`);
      shot.style.setProperty('--gx', `${(50 + x * 50).toFixed(1)}%`);
      shot.style.setProperty('--gy', `${(50 + y * 50).toFixed(1)}%`);
      shot.style.setProperty('--lift', '1');
      shot.style.setProperty('--rz', `${(x * -6).toFixed(2)}deg`);
      shot.style.setProperty('--tz', `${(-y * 70).toFixed(1)}px`);
      shot.style.setProperty('--ty', `${(y * 18).toFixed(1)}px`);
      shot.style.setProperty('--sx', (-x * 20).toFixed(1));
      shot.style.setProperty('--sy', (-y * 15).toFixed(1));
    });
  });
}

function startGyro() {
  if (gyroStarted || finePointer.matches || !shots.length || !('DeviceOrientationEvent' in window)) return;
  gyroStarted = true;
  window.addEventListener('deviceorientation', onOrientation);
}

let gyroSeen = false;
window.addEventListener('deviceorientation', (event) => { if (event.beta != null) gyroSeen = true; }, { once: false, passive: true });

if (!finePointer.matches && stage && !calm.matches) {
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'btn btn-ghost tilt-toggle';
  toggle.textContent = 'Tilt with your phone';
  const note = document.createElement('p');
  note.className = 'fine tilt-note';
  note.setAttribute('aria-live', 'polite');
  stage.after(toggle, note);
  toggle.addEventListener('click', async () => {
    if (!('DeviceOrientationEvent' in window)) {
      note.textContent = 'This browser has no motion sensor access.';
      return;
    }
    try {
      if (typeof DeviceOrientationEvent.requestPermission === 'function' && (await DeviceOrientationEvent.requestPermission()) !== 'granted') {
        note.textContent = 'Motion access was blocked. Allow it in your browser settings and reload.';
        return;
      }
    } catch {
      note.textContent = 'This browser does not allow motion access. Try Safari.';
      return;
    }
    startGyro();
    toggle.hidden = true;
    note.textContent = 'Tilt your phone.';
    setTimeout(() => {
      if (!gyroSeen) note.textContent = 'No motion data arrived. Try Safari, or check Settings › Safari › Motion & Orientation Access.';
      else note.textContent = '';
    }, 1500);
  });
}

if (!finePointer.matches && 'DeviceOrientationEvent' in window) {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    const ask = async () => {
      try {
        if ((await DeviceOrientationEvent.requestPermission()) !== 'granted') return;
        startGyro();
        document.removeEventListener('click', ask);
        document.removeEventListener('touchend', ask);
      } catch {}
    };
    document.addEventListener('click', ask);
    document.addEventListener('touchend', ask);
  } else {
    startGyro();
  }
}

document.querySelectorAll('.shot.tilt').forEach((shot) => {
  shot.style.cursor = 'pointer';
  shot.addEventListener('click', () => {
    if (calm.matches || shot.getAnimations().length) return;
    shot.animate(
      [
        { transform: 'perspective(1600px) rotateY(0deg) scale(1)' },
        { transform: 'perspective(1600px) rotateY(180deg) scale(0.92)', offset: 0.5 },
        { transform: 'perspective(1600px) rotateY(360deg) scale(1)' }
      ],
      { duration: 1100, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' }
    );
  });
});
