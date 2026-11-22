import { text } from './i18n.js?v=1795377537';

const CLIENT_ID = '1573069411802161222';
const REDIRECT = 'https://key-bind-master.xyz/feedback.html';
const KEY = 'kbm.discord';
const STATE_KEY = 'kbm.discord.state';
const RETURN_KEY = 'kbm.discord.return';
const DISCORD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 5.6A17 17 0 0 0 15.4 4.3l-.5 1a15.7 15.7 0 0 0-4.7 0l-.5-1a17 17 0 0 0-4.2 1.3C2.8 9.6 2.100 13.500 2.400 17.300a17 17 0 0 0 5.200 2.600l1.100-1.800a11 11 0 0 1-1.700-.8l.4-.3a12.200 12.200 0 0 0 10.400 0l.4.3c-.5.300-1.100.600-1.700.800l1.100 1.800a17 17 0 0 0 5.200-2.600c.4-4.400-.7-8.200-2.900-11.700zM9.300 15c-1 0-1.900-.9-1.900-2.100s.8-2.100 1.900-2.100 1.900.9 1.900 2.100-.8 2.100-1.900 2.100zm5.400 0c-1 0-1.900-.9-1.900-2.100s.8-2.100 1.900-2.100 1.900.9 1.900 2.100-.8 2.100-1.900 2.100z"/></svg>';

const session = {
  get(name) {
    try {
      return sessionStorage.getItem(name);
    } catch {
      return null;
    }
  },
  set(name, value) {
    try {
      sessionStorage.setItem(name, value);
    } catch {}
  },
  drop(name) {
    try {
      sessionStorage.removeItem(name);
    } catch {}
  }
};

function readHash() {
  const params = new URLSearchParams(location.hash.slice(1));
  const fresh = params.get('access_token');
  if (!fresh) return;
  history.replaceState(null, '', location.pathname);
  if (params.get('state') !== session.get(STATE_KEY)) return;
  session.drop(STATE_KEY);
  session.set(KEY, JSON.stringify({ token: fresh, until: Date.now() + Number(params.get('expires_in') ?? 0) * 1000 }));
  const back = session.get(RETURN_KEY);
  session.drop(RETURN_KEY);
  if (back && back !== location.pathname) location.replace(back);
}

export function token() {
  try {
    const saved = JSON.parse(session.get(KEY) ?? 'null');
    return saved && saved.until > Date.now() ? saved.token : '';
  } catch {
    return '';
  }
}

export function signIn() {
  const state = crypto.getRandomValues(new Uint32Array(4)).join('');
  session.set(STATE_KEY, state);
  session.set(RETURN_KEY, location.pathname);
  const query = new URLSearchParams({ client_id: CLIENT_ID, response_type: 'token', redirect_uri: REDIRECT, scope: 'identify', state });
  location.href = `https://discord.com/oauth2/authorize?${query}`;
}

export function signOut() {
  session.drop(KEY);
  document.dispatchEvent(new CustomEvent('kbm-auth'));
}

let user = null;

async function loadUser() {
  const current = token();
  if (!current) return null;
  try {
    const response = await fetch('https://discord.com/api/v10/users/@me', { headers: { authorization: `Bearer ${current}` } });
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    session.drop(KEY);
    return null;
  }
}

export const currentUser = () => user;

function avatarOf(me) {
  return me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64` : 'img/icon.png';
}

function mount() {
  const top = document.querySelector('.top');
  if (!top) return;
  const wrap = document.createElement('div');
  wrap.className = 'auth';
  top.insertBefore(wrap, top.querySelector('[data-download]'));

  const close = () => {
    const menu = wrap.querySelector('.auth-menu');
    const button = wrap.querySelector('.auth-button');
    if (menu) menu.hidden = true;
    button?.setAttribute('aria-expanded', 'false');
  };

  const render = () => {
    wrap.replaceChildren();
    if (!user) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-ghost auth-button';
      button.innerHTML = DISCORD_ICON;
      const label = document.createElement('span');
      label.textContent = text('auth.signin');
      button.append(label);
      button.addEventListener('click', signIn);
      wrap.append(button);
      return;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-ghost auth-button';
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    const avatar = document.createElement('img');
    avatar.src = avatarOf(user);
    avatar.alt = '';
    avatar.width = 24;
    avatar.height = 24;
    const name = document.createElement('span');
    name.className = 'auth-name';
    name.textContent = user.global_name || user.username;
    button.append(avatar, name);

    const menu = document.createElement('div');
    menu.className = 'auth-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    const who = document.createElement('p');
    who.className = 'auth-who';
    who.textContent = `${text('fb.login.as')} ${user.global_name || user.username}`;
    const feedback = document.createElement('a');
    feedback.href = 'feedback.html';
    feedback.setAttribute('role', 'menuitem');
    feedback.textContent = text('nav.feedback');
    const out = document.createElement('button');
    out.type = 'button';
    out.setAttribute('role', 'menuitem');
    out.textContent = text('auth.signout');
    out.addEventListener('click', signOut);
    menu.append(who, feedback, out);

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    });
    wrap.append(button, menu);
  };

  document.addEventListener('click', (event) => !wrap.contains(event.target) && close());
  document.addEventListener('keydown', (event) => event.key === 'Escape' && close());
  document.addEventListener('kbm-language', render);
  document.addEventListener('kbm-auth', async () => {
    user = await loadUser();
    render();
    document.dispatchEvent(new CustomEvent('kbm-user'));
  });
  render();
  return render;
}

export async function startAuth() {
  readHash();
  const render = mount();
  user = await loadUser();
  render?.();
  document.dispatchEvent(new CustomEvent('kbm-user'));
  return user;
}
