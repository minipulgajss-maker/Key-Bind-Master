import { text } from './i18n.js';

const GOOGLE_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 14.2a6.6 6.6 0 0 1 0-4.3V7.1H2.1a11 11 0 0 0 0 9.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3 .6 4.2 1.6l3.1-3.1A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z"/></svg>';
const REDIRECT = 'https://key-bind-master.xyz/feedback.html';
const KEY = 'kbm.discord';
const PROVIDER_KEY = 'kbm.auth.provider';
const STATE_KEY = 'kbm.discord.state';
const RETURN_KEY = 'kbm.discord.return';
const DISCORD_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 5.6A17 17 0 0 0 15.4 4.3l-.5 1a15.7 15.7 0 0 0-4.7 0l-.5-1a17 17 0 0 0-4.2 1.3C2.8 9.6 2.100 13.500 2.400 17.300a17 17 0 0 0 5.200 2.600l1.100-1.800a11 11 0 0 1-1.700-.8l.4-.3a12.200 12.200 0 0 0 10.400 0l.4.3c-.5.300-1.100.600-1.700.800l1.100 1.800a17 17 0 0 0 5.200-2.600c.4-4.400-.7-8.200-2.900-11.700zM9.300 15c-1 0-1.900-.9-1.900-2.100s.8-2.100 1.900-2.100 1.900.9 1.900 2.100-.8 2.100-1.900 2.100zm5.400 0c-1 0-1.900-.9-1.900-2.100s.8-2.100 1.900-2.100 1.900.9 1.900 2.100-.8 2.100-1.900 2.100z"/></svg>';

const PROVIDERS = {
  discord: {
    name: 'Discord',
    icon: () => DISCORD_ICON,
    clientId: '1573069411802161222',
    authorize: 'https://discord.com/oauth2/authorize',
    scope: 'identify',
    me: 'https://discord.com/api/v10/users/@me',
    user: (me) => ({ id: me.id, name: me.global_name || me.username, avatar: me.avatar ? `https://cdn.discordapp.com/avatars/${me.id}/${me.avatar}.png?size=64` : 'img/icon.png' })
  },
  google: {
    name: 'Google',
    icon: () => GOOGLE_ICON,
    clientId: '',
    authorize: 'https://accounts.google.com/o/oauth2/v2/auth',
    scope: 'openid profile',
    me: 'https://www.googleapis.com/oauth2/v3/userinfo',
    user: (me) => ({ id: me.sub, name: me.name || me.given_name || 'Google user', avatar: me.picture || 'img/icon.png' })
  }
};
const available = Object.entries(PROVIDERS).filter(([, provider]) => provider.clientId).map(([id]) => id);

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
  session.set(KEY, JSON.stringify({ provider: session.get(PROVIDER_KEY) || 'discord', token: fresh, until: Date.now() + Number(params.get('expires_in') ?? 0) * 1000 }));
  const back = session.get(RETURN_KEY);
  session.drop(RETURN_KEY);
  if (back && back !== location.pathname) location.replace(back);
}

function saved() {
  try {
    const value = JSON.parse(session.get(KEY) ?? 'null');
    return value && value.until > Date.now() && PROVIDERS[value.provider ?? 'discord'] ? { provider: 'discord', ...value } : null;
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
  const query = new URLSearchParams({ client_id: provider.clientId, response_type: 'token', redirect_uri: REDIRECT, scope: provider.scope, state });
  location.href = `${provider.authorize}?${query}`;
}

export function signOut() {
  session.drop(KEY);
  document.dispatchEvent(new CustomEvent('kbm-auth'));
}

let user = null;

async function loadUser() {
  const current = saved();
  if (!current) return null;
  const provider = PROVIDERS[current.provider];
  try {
    const response = await fetch(provider.me, { headers: { authorization: `Bearer ${current.token}` } });
    if (!response.ok) throw new Error();
    return { provider: current.provider, ...provider.user(await response.json()) };
  } catch {
    session.drop(KEY);
    return null;
  }
}

export const currentUser = () => user;

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
      button.innerHTML = available.length === 1 ? PROVIDERS[available[0]].icon() : '';
      const label = document.createElement('span');
      label.textContent = text('auth.signin');
      button.append(label);
      if (available.length === 1) {
        button.addEventListener('click', () => signIn(available[0]));
        wrap.append(button);
        return;
      }
      const menu = document.createElement('div');
      menu.className = 'auth-menu auth-providers';
      menu.setAttribute('role', 'menu');
      menu.hidden = true;
      for (const id of available) {
        const option = document.createElement('button');
        option.type = 'button';
        option.setAttribute('role', 'menuitem');
        option.innerHTML = PROVIDERS[id].icon();
        option.append(PROVIDERS[id].name);
        option.addEventListener('click', () => signIn(id));
        menu.append(option);
      }
      button.setAttribute('aria-haspopup', 'menu');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const open = menu.hidden;
        menu.hidden = !open;
        button.setAttribute('aria-expanded', String(open));
      });
      wrap.append(button, menu);
      return;
    }
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn-ghost auth-button';
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');
    const avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.alt = '';
    avatar.width = 24;
    avatar.height = 24;
    const name = document.createElement('span');
    name.className = 'auth-name';
    name.textContent = user.name;
    button.append(avatar, name);

    const menu = document.createElement('div');
    menu.className = 'auth-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;
    const who = document.createElement('p');
    who.className = 'auth-who';
    who.textContent = `${text('fb.login.as')} ${user.name}`;
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
