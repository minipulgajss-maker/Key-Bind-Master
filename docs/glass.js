const RIM = 34;
const CURVE = [[0, 255], [1, 224], [2, 212], [3, 203], [5, 189], [7, 178], [10, 165], [14, 152], [19, 141], [25, 133], [30, 129]];
const ramp = (channel, axis) => {
  const color = (v) => (channel === 'r' ? `rgb(${v},0,0)` : `rgb(0,${v},0)`);
  const [x2, y2] = axis === 'x' ? ['100%', '0'] : ['0', '100%'];
  const stops = [...CURVE.map(([o, v]) => [o, v]), [RIM, 128], [100 - RIM, 128], ...CURVE.map(([o, v]) => [100 - o, 255 - v]).reverse()]
    .map(([o, v]) => `<stop offset="${o}%" stop-color="${color(v)}"/>`).join('');
  return `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" preserveAspectRatio="none"><defs><linearGradient id="g" x2="${x2}" y2="${y2}">${stops}</linearGradient></defs><rect width="100" height="100" fill="url(#g)"/></svg>`)}`;
};

export function startLiquidGlass() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none';
  svg.innerHTML = `<filter id="liquid-glass" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feImage href="${ramp('r', 'x')}" preserveAspectRatio="none" result="mx"/>
    <feImage href="${ramp('g', 'y')}" preserveAspectRatio="none" result="my"/>
    <feComposite in="mx" in2="my" operator="arithmetic" k2="1" k3="1" result="map"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="84" xChannelSelector="R" yChannelSelector="G" result="dr"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="78" xChannelSelector="R" yChannelSelector="G" result="dg"/>
    <feDisplacementMap in="SourceGraphic" in2="map" scale="72" xChannelSelector="R" yChannelSelector="G" result="db"/>
    <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/>
    <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/>
    <feColorMatrix in="db" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/>
    <feBlend in="r" in2="g" mode="screen" result="rg"/>
    <feBlend in="rg" in2="b" mode="screen" result="rgb"/>
    <feColorMatrix in="rgb" type="saturate" values="1.25"/>
  </filter>`;
  document.body.append(svg);
  const root = document.documentElement;
  const light = (x, y) => {
    root.style.setProperty('--light-x', `${(x * 100).toFixed(1)}%`);
    root.style.setProperty('--light-y', `${(y * 100).toFixed(1)}%`);
    root.style.setProperty('--light-angle', `${Math.round(135 + (x - 0.5) * 90)}deg`);
  };
  let frame = 0;
  const schedule = (x, y) => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => light(x, y));
  };
  window.addEventListener('pointermove', (event) => schedule(event.clientX / innerWidth, event.clientY / innerHeight), { passive: true });
  window.addEventListener('deviceorientation', (event) => event.gamma != null && schedule(0.5 + Math.max(-1, Math.min(1, event.gamma / 30)) / 2, 0.5 + Math.max(-1, Math.min(1, ((event.beta ?? 45) - 45) / 30)) / 2), { passive: true });
  light(0.3, 0);
}
