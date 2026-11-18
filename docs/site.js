async function showVersion() {
  try {
    const response = await fetch('version.json', { cache: 'no-store' });
    if (!response.ok) return;
    const { version, size } = await response.json();
    const megabytes = size ? ` · ${(size / 1048576).toFixed(1)} MB` : '';
    document.querySelectorAll('[data-version]').forEach((element) => {
      element.textContent = `Version ${version}${megabytes} · Windows 10 or 11`;
    });
  } catch {
    return;
  }
}

showVersion();

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

let steering = false;
window.addEventListener('scrollend', () => (steering = false));

function goTo(id, smooth) {
  if (smooth) steering = true;
  const target = id ? document.getElementById(id) : document.getElementById('top');
  target?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
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
