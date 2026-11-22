import { signIn, signOut, startAuth, token } from './auth.js?v=1795380914';
import { currentLanguage, startLanguage, text } from './i18n.js?v=1795380914';

const ENDPOINT = 'https://keybind-invites.minipulgajss.workers.dev/v1/feedback';
const MIN = 10;
const MAX = 1000;
const LINK = /(?:https?:\/\/|www\.)\S+|\b[a-z0-9-]{2,}\.(?:com|net|org|io|xyz|ru|cn|tk|top|site|online|shop|club|link|click)\b/i;
const STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.600 6.100 20.800l1.200-6.500L2.500 9.700l6.600-.9z"/></svg>';

const form = document.getElementById('fb-form');
const starsBox = document.getElementById('stars');
const chips = [...document.querySelectorAll('#chips .chip')];
const message = document.getElementById('fb-message');
const name = document.getElementById('fb-name');
const trap = document.getElementById('fb-site');
const counter = document.getElementById('counter');
const error = document.getElementById('fb-error');
const send = document.getElementById('fb-send');
const thanks = document.getElementById('fb-thanks');
const again = document.getElementById('fb-again');
const label = document.createElement('span');
label.className = 'stars-label';
label.setAttribute('aria-live', 'polite');

let rating = 0;
let category = 'idea';
let opened = Date.now();
let busy = false;
function gate() {
  const signedIn = Boolean(token());
  document.getElementById('fb-login').hidden = signedIn;
  form.hidden = !signedIn;
}

document.getElementById('fb-login-button').addEventListener('click', (event) => {
  event.preventDefault();
  signIn();
});
document.addEventListener('kbm-user', gate);
gate();

const stars = Array.from({ length: 5 }, (_, index) => {
  const star = document.createElement('button');
  star.type = 'button';
  star.className = 'star';
  star.setAttribute('role', 'radio');
  star.setAttribute('aria-checked', 'false');
  star.innerHTML = STAR;
  star.addEventListener('click', () => setRating(index + 1));
  star.addEventListener('mouseenter', () => paint(index + 1));
  star.addEventListener('focus', () => paint(index + 1));
  return star;
});
starsBox.append(...stars, label);
starsBox.addEventListener('mouseleave', () => paint(rating));
starsBox.addEventListener('focusout', () => paint(rating));

function paint(value) {
  stars.forEach((star, index) => star.classList.toggle('is-on', index < value));
  label.textContent = value ? text(`r.${value}`) : '';
}

function setRating(value) {
  rating = value;
  stars.forEach((star, index) => {
    star.setAttribute('aria-checked', String(index + 1 === value));
    star.setAttribute('aria-label', `${index + 1}`);
  });
  paint(value);
  error.textContent = '';
}

chips.forEach((chip) =>
  chip.addEventListener('click', () => {
    category = chip.dataset.value;
    chips.forEach((other) => other.setAttribute('aria-checked', String(other === chip)));
  })
);

message.addEventListener('input', () => {
  const length = [...message.value.trim()].length;
  counter.textContent = `${length} / ${MAX}`;
  counter.classList.toggle('is-over', length > MAX);
  error.textContent = '';
});

const fail = (key) => {
  error.textContent = text(key);
  busy = false;
  send.disabled = false;
  send.textContent = text('fb.send');
};

const REJECTS = { login: 'err.login', short: 'err.short', long: 'err.long', links: 'err.links', rude: 'err.rude', spam: 'err.spam', fast: 'err.fast', duplicate: 'err.duplicate', rate: 'err.rate', invalid: 'err.invalid' };

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (busy) return;
  const body = message.value.trim();
  const length = [...body].length;
  if (!rating) return fail('err.pick');
  if (length < MIN) return fail('err.short');
  if (length > MAX) return fail('err.long');
  if (LINK.test(body)) return fail('err.links');
  busy = true;
  send.disabled = true;
  send.textContent = text('fb.sending');
  error.textContent = '';
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token()}` },
      body: JSON.stringify({ rating, category, message: body, name: name.value.trim(), website: trap.value, took: Date.now() - opened, uiLang: currentLanguage() })
    });
    const reply = await response.json().catch(() => ({}));
    if (response.status === 401) {
      signOut();
      return fail('err.login');
    }
    if (!response.ok) return fail(REJECTS[reply.code] ?? 'err.invalid');
    const gift = document.getElementById('fb-gift');
    gift.textContent = reply.gift ? text('fb.gift.yes') : reply.nextGiftAt ? `${text('fb.gift.wait')} ${new Date(reply.nextGiftAt * 1000).toLocaleDateString(currentLanguage())}.` : '';
    form.hidden = true;
    thanks.hidden = false;
    thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch {
    fail('err.network');
  }
});

again.addEventListener('click', () => {
  form.reset();
  setRating(0);
  chips.forEach((chip, index) => chip.setAttribute('aria-checked', String(index === 0)));
  category = 'idea';
  counter.textContent = `0 / ${MAX}`;
  error.textContent = '';
  send.disabled = false;
  send.textContent = text('fb.send');
  busy = false;
  opened = Date.now();
  thanks.hidden = true;
  form.hidden = false;
});

document.addEventListener('kbm-language', () => {
  paint(rating);
  if (!busy) send.textContent = text('fb.send');
});

startLanguage();
startAuth();
