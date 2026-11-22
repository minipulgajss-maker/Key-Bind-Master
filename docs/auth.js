import { text } from './i18n.js';

const REDIRECT = 'https://key-bind-master.xyz/feedback.html';
const KEY = 'kbm.discord';
const PROVIDER_KEY = 'kbm.auth.provider';
const STATE_KEY = 'kbm.discord.state';
const RETURN_KEY = 'kbm.discord.return';

const ICONS = {
  apple: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.6 2.100-3.800 2.200-3.900-1.200-1.800-3.100-2-3.700-2-1.600-.2-3.100.9-3.900.9-.8 0-2-.9-3.400-.9-1.700 0-3.300 1-4.200 2.600-1.800 3.100-.5 7.700 1.300 10.200.9 1.200 1.900 2.600 3.200 2.600 1.300-.1 1.800-.8 3.400-.8s2 .8 3.400.8c1.400 0 2.300-1.300 3.100-2.500 1-1.400 1.400-2.800 1.400-2.900-.1 0-2.800-1-2.800-4.100zM13.900 5c.7-.9 1.200-2 1-3.200-1 0-2.200.7-2.900 1.500-.6.700-1.200 1.900-1 3 1.100.1 2.200-.6 2.900-1.300z"/></svg>',
  google: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.500-.2-2.200H12v4.200h5.900a5 5 0 0 1-2.200 3.300v2.700h3.600c2-1.900 3.200-4.700 3.200-8z"/><path fill="#34A853" d="M12 23c3 0 5.500-1 7.300-2.700l-3.600-2.700c-1 .7-2.200 1.100-3.700 1.100-2.900 0-5.300-1.900-6.200-4.500H2.100v2.800A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.800 14.200a6.600 6.600 0 0 1 0-4.300V7.100H2.100a11 11 0 0 0 0 9.900z"/><path fill="#EA4335" d="M12 5.400c1.600 0 3 .6 4.200 1.600l3.100-3.100A11 11 0 0 0 2.100 7.100l3.700 2.800C6.700 7.300 9.100 5.400 12 5.400z"/></svg>',
  discord: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M19.6 5.6A17 17 0 0 0 15.4 4.3l-.5 1a15.7 15.7 0 0 0-4.7 0l-.5-1a17 17 0 0 0-4.2 1.3C2.8 9.6 2.100 13.500 2.400 17.300a17 17 0 0 0 5.200 2.600l1.100-1.800a11 11 0 0 1-1.700-.8l.4-.3a12.200 12.200 0 0 0 10.400 0l.4.3c-.5.300-1.100.600-1.700.800l1.100 1.800a17 17 0 0 0 5.200-2.600c.4-4.400-.7-8.200-2.900-11.700zM9.300 15c-1 0-1.900-.9-1.900-2.100s.8-2.100 1.900-2.100 1.900.9 1.900 2.100-.8 2.100-1.900 2.100zm5.400 0c-1 0-1.900-.9-1.900-2.100s.8-2.100 1.900-2.100 1.900.9 1.900 2.100-.8 2.100-1.900 2.100z"/></svg>',
  user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="2"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

const decodeJwt = (jwt) => {
  try {
    return JSON.parse(atob(jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
};

const PROVIDERS = {
  apple: {
    name: 'Apple',
    clientId: '',
    authorize: 'https://appleid.apple.com/auth/authorize',
    params: { response_type: 'code id_token', response_mode: 'fragment' },
    tokenParam: 'id_token',
    load: async (jwt) => {
      const claims = decodeJwt(jwt);
      if (!claims.sub) throw new Error();
      return { id: claims.sub, name: claims.email || 'Apple ID', avatar: '' };
    }
  },
  google: {
    name: 'Google',
    clientId: '',
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    params: { response_type: 'token', scope: 'openid profile' },
    tokenParam: 'access_token',
    load: async (token) => {
      const me = await getJson('https://www.googleapis.com/oauth2/v3/userinfo', token);
      return { id: me.sub, name: me.name || me.given_name || 'Google', avatar: me.picture || '' };
    }
  },
  discord: {
    name: 'Discord',
    clientId: '1573069411802161222',
    authorize: 'https://discord.com/oauth2/authorize',
    params: { response_type: 'token', scope: 'identify' },
    tokenParam: 'access_token',
    load: async (token) => {
      const me = await getJson('https://discord.com/api/v10/users/@me', token);
      return { id: me.id, name: me.global_name || me.username, avatar: me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64` : '' };
    }
  }
};

async function getJson(url, token) {
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error();
  return response.json();
}

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
  const id = session.get(PROVIDER_KEY) || 'discord';
  const provider = PROVIDERS[id];
  const fresh = provider && params.get(provider.tokenParam);
  if (!fresh) return;
  history.replaceState(null, '', location.pathname);
  if (params.get('state') !== session.get(STATE_KEY)) return;
  session.drop(STATE_KEY);
  const life = Number(params.get('expires_in') ?? 3600) || 3600;
  session.set(KEY, JSON.stringify({ provider: id, token: fresh, until: Date.now() + life * 1000 }));
  const back = session.get(RETURN_KEY);
  session.drop(RETURN_KEY);
  if (back && back !== location.pathname) location.replace(back);
}

function saved() {
  try {
    const value = JSON.parse(session.get(KEY) ?? 'null');
    if (!value || value.until <= Date.now()) return null;
    const provider = value.provider ?? 'discord';
    return PROVIDERS[provider] ? { ...value, provider } : null;
  } catch {
    return null;
  }
}

export function token() {
  const value = saved();
  return value?.provider === 'discord' ? value.token : '';
}

export function signIn(id = 'discord') {
  const provider = PROVIDERS[id];
  if (!provider?.clientId) return;
  const state = crypto.getRandomValues(new Uint32Array(4)).join('');
  session.set(STATE_KEY, state);
  session.set(PROVIDER_KEY, id);
  session.set(RETURN_KEY, location.pathname);
  const query = new URLSearchParams({ client_id: provider.clientId, redirect_uri: REDIRECT, state, nonce: state, ...provider.params });
  location.href = `${provider.authorize}?${query}`;
}

export function signOut() {
  session.drop(KEY);
  document.dispatchEvent(new CustomEvent('kbm-auth'));
}

let user = null;
export const currentUser = () => user;

async function loadUser() {
  const current = saved();
  if (!current) return null;
  try {
    return { provider: current.provider, ...(await PROVIDERS[current.provider].load(current.token)) };
  } catch {
    session.drop(KEY);
    return null;
  }
}

function element(tag, props = {}, ...children) {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...children.filter((child) => child != null));
  return node;
}

function sheet() {
  const dialog = element('dialog', { className: 'sheet-dialog' });
  dialog.setAttribute('aria-labelledby', 'auth-title');
  const render = () => {
    const close = element('button', { type: 'button', className: 'sheet-close', textContent: '×' });
    close.setAttribute('aria-label', text('auth.close'));
    close.addEventListener('click', () => dialog.close());
    const list = element('div', { className: 'provider-list' });
    for (const [id, provider] of Object.entries(PROVIDERS)) {
      const button = element('button', { type: 'button', className: `provider provider-${id}`, disabled: !provider.clientId });
      button.innerHTML = ICONS[id];
      button.append(element('span', { textContent: `${text('auth.with')} ${provider.name}` }));
      if (!provider.clientId) button.append(element('em', { textContent: text('auth.soon') }));
      button.addEventListener('click', () => signIn(id));
      list.append(button);
    }
    dialog.replaceChildren(
      close,
      element('img', { src: 'img/icon.png', alt: '', width: 56, height: 56, className: 'sheet-logo' }),
      element('h2', { id: 'auth-title', textContent: text('auth.title') }),
      element('p', { className: 'sheet-sub', textContent: text('auth.sub') }),
      list,
      element('p', { className: 'sheet-note', textContent: text('auth.note') })
    );
  };
  dialog.addEventListener('click', (event) => event.target === dialog && dialog.close());
  document.addEventListener('kbm-language', render);
  render();
  document.body.append(dialog);
  return dialog;
}

function mount() {
  const slot = document.querySelector('[data-auth]');
  if (!slot) return null;
  const dialog = sheet();
  const close = () => {
    slot.querySelector('.auth-menu')?.setAttribute('hidden', '');
    slot.querySelector('.auth-button')?.setAttribute('aria-expanded', 'false');
  };

  const render = () => {
    slot.replaceChildren();
    const button = element('button', { type: 'button', className: 'glass-btn auth-button' });
    if (!user) {
      button.innerHTML = ICONS.user;
      button.append(element('span', { className: 'auth-label', textContent: text('auth.signin') }));
      button.addEventListener('click', () => dialog.showModal());
      slot.append(button);
      return;
    }
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    if (user.avatar) button.append(element('img', { src: user.avatar, alt: '', width: 24, height: 24 }));
    else button.innerHTML = ICONS[user.provider] ?? ICONS.user;
    button.append(element('span', { className: 'auth-label', textContent: user.name }));
    const out = element('button', { type: 'button', textContent: text('auth.signout') });
    out.setAttribute('role', 'menuitem');
    out.addEventListener('click', signOut);
    const feedback = element('a', { href: 'feedback.html', textContent: text('nav.feedback') });
    feedback.setAttribute('role', 'menuitem');
    const menu = element('div', { className: 'auth-menu glass-panel', hidden: true }, element('p', { className: 'auth-who', textContent: `${text('fb.login.as')} ${user.name}` }), feedback, out);
    menu.setAttribute('role', 'menu');
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = menu.hidden;
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    });
    slot.append(button, menu);
  };

  document.addEventListener('click', (event) => !slot.contains(event.target) && close());
  document.addEventListener('keydown', (event) => event.key === 'Escape' && close());
  document.addEventListener('kbm-language', render);
  document.addEventListener('kbm-auth', async () => {
    user = await loadUser();
    render();
    document.dispatchEvent(new CustomEvent('kbm-user'));
  });
  document.addEventListener('kbm-signin', () => dialog.showModal());
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
