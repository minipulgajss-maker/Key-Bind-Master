const RIM = 34;
const CURVE = [[0, 255], [1, 224], [2, 212], [3, 203], [5, 189], [7, 178], [10, 165], [14, 152], [19, 141], [25, 133], [30, 129]];
const LENS_SCALES = { r: 26, g: 23, b: 20 };
const CHANNEL_MATRIX = {
  r: '1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0',
  g: '0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0',
  b: '0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0',
};

const ramp = (channel, axis) => {
  const color = (v) => (channel === 'r' ? `rgb(${v},0,0)` : `rgb(0,${v},0)`);
  const [x2, y2] = axis === 'x' ? ['100%', '0'] : ['0', '100%'];
  const stops = [...CURVE, [RIM, 128], [100 - RIM, 128], ...CURVE.map(([o, v]) => [100 - o, 255 - v]).reverse()]
    .map(([o, v]) => `<stop offset="${o}%" stop-color="${color(v)}"/>`).join('');
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none"><defs><linearGradient id="g" x2="${x2}" y2="${y2}">${stops}</linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`)}`;
};

const lensFilter = () => {
  const passes = Object.entries(LENS_SCALES).map(([channel, scale]) => `
    <feDisplacementMap in="SourceGraphic" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="d${channel}"/>
    <feColorMatrix in="d${channel}" type="matrix" values="${CHANNEL_MATRIX[channel]}" result="${channel}"/>`).join('');
  return `<filter id="liquid-glass" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feImage href="${ramp('r', 'x')}" preserveAspectRatio="none" result="mx"/>
    <feImage href="${ramp('g', 'y')}" preserveAspectRatio="none" result="my"/>
    <feComposite in="mx" in2="my" operator="arithmetic" k2="1" k3="1" result="map"/>${passes}
    <feBlend in="r" in2="g" mode="screen" result="rg"/>
    <feBlend in="rg" in2="b" mode="screen"/>
  </filter>`;
};

export function startLiquidGlass() {
  const root = document.documentElement;
  if (navigator.userAgentData) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
    svg.innerHTML = lensFilter();
    document.body.append(svg);
    root.classList.add('lens');
  }
  const light = (x, y) => {
    const dx = (x - 0.5) * 2;
    const dy = (y - 0.5) * 2;
    const length = Math.max(1, Math.hypot(dx, dy));
    root.style.setProperty('--lgx', (dx / length).toFixed(3));
    root.style.setProperty('--lgy', (dy / length).toFixed(3));
    root.style.setProperty('--light-angle', `${Math.round(90 + (Math.atan2(dy, dx) * 180) / Math.PI)}deg`);
  };
  let frame = 0;
  const schedule = (x, y) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => light(x, y));
  };
  const clamp = (v) => Math.max(-1, Math.min(1, v));
  window.addEventListener('pointermove', (event) => schedule(event.clientX / innerWidth, event.clientY / innerHeight), { passive: true });
  window.addEventListener('deviceorientation', (event) => event.gamma != null && schedule(0.5 + clamp(event.gamma / 30) / 2, 0.5 + clamp(((event.beta ?? 45) - 45) / 30) / 2), { passive: true });
  light(0.15, 0);
}
