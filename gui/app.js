const presets = {
  spiral_ribbed: { height:180, base_radius:22, neck_radius:16, lip_radius:20, belly_amp:11, belly_center:0.46, belly_width:0.24, waves:14, wave_amp:0.16, wave_z_falloff:0.25, twist:12, twist_curve:0, skew_wave:0.10, seed_phase:0 },
  soft_organic:  { height:180, base_radius:22, neck_radius:18, lip_radius:19, belly_amp:7,  belly_center:0.46, belly_width:0.24, waves:4,  wave_amp:0.09, wave_z_falloff:0.25, twist:3.5, twist_curve:0, skew_wave:0.55, seed_phase:0 },
  fluted_classic:{ height:180, base_radius:20, neck_radius:16, lip_radius:20, belly_amp:10, belly_center:0.46, belly_width:0.24, waves:18, wave_amp:0.11, wave_z_falloff:0.25, twist:1.5, twist_curve:0, skew_wave:0.00, seed_phase:0 },
  tall_twist:    { height:240, base_radius:22, neck_radius:14, lip_radius:16, belly_amp:16, belly_center:0.30, belly_width:0.24, waves:22, wave_amp:0.08, wave_z_falloff:0.25, twist:9, twist_curve:0, skew_wave:0.0,  seed_phase:0 },
  petal_lip:     { height:180, base_radius:22, neck_radius:16, lip_radius:30, belly_amp:9,  belly_center:0.46, belly_width:0.24, waves:12, wave_amp:0.15, wave_z_falloff:0.25, twist:6, twist_curve:0, skew_wave:0.25, seed_phase:0 },
  minimal_wavy:  { height:180, base_radius:18, neck_radius:17, lip_radius:18, belly_amp:5.5, belly_center:0.46, belly_width:0.24, waves:3,  wave_amp:0.07, wave_z_falloff:0.25, twist:2, twist_curve:0, skew_wave:0.45, seed_phase:0 },
};

const sliders = [
  ['height', 80, 320, 1], ['base_radius', 8, 40, 0.2], ['neck_radius', 6, 34, 0.2], ['lip_radius', 6, 44, 0.2],
  ['belly_amp', 0, 24, 0.2], ['belly_center', 0.1, 0.9, 0.01], ['belly_width', 0.05, 0.45, 0.01],
  ['waves', 2, 30, 1], ['wave_amp', 0, 0.25, 0.005], ['wave_z_falloff', 0.0, 0.45, 0.01],
  ['twist', 0, 16, 0.1], ['twist_curve', -6, 6, 0.1], ['skew_wave', 0, 1, 0.02], ['seed_phase', 0, 6.2832, 0.01],
];

const nTheta = 96;
const nZ = 120;
let params = { ...presets.spiral_ribbed };
let meshData = null;
let angleY = 0.5;
let angleX = -0.25;

const canvas = document.getElementById('view');
const ctx = canvas.getContext('2d');

function smoothstep(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
function baseProfile(z, p) {
  const neckMix = smoothstep(z);
  const linear = (1 - neckMix) * p.base_radius + neckMix * p.neck_radius;
  const lipBloom = (p.lip_radius - p.neck_radius) * smoothstep((z - 0.86) / 0.14);
  const t = (z - p.belly_center) / Math.max(1e-6, p.belly_width);
  const belly = p.belly_amp * Math.exp(-(t * t));
  return Math.max(1e-3, linear + lipBloom + belly);
}
function waveEnvelope(z, p) {
  const center = Math.pow(Math.sin(Math.PI * z), 0.7);
  const denom = Math.max(1e-6, (1 - 2 * p.wave_z_falloff));
  const fade = smoothstep((z - p.wave_z_falloff) / denom);
  return center * fade;
}
function twistPhase(z, p) { return p.seed_phase + p.twist * z + p.twist_curve * z * z; }
function radius(th, z, p) {
  const r0 = baseProfile(z, p);
  const env = waveEnvelope(z, p);
  const h = Math.cos(p.waves * th + twistPhase(z, p));
  const sk = p.skew_wave * Math.sin((Math.floor(p.waves / 2) + 1) * th - 0.7 * twistPhase(z, p));
  return Math.max(1e-3, r0 * (1 + p.wave_amp * env * (h + sk)));
}

function buildMesh(p) {
  const verts = [];
  const faces = [];
  for (let iz = 0; iz <= nZ; iz++) {
    const z01 = iz / nZ;
    const z = z01 * p.height;
    for (let it = 0; it < nTheta; it++) {
      const th = 2 * Math.PI * it / nTheta;
      const r = radius(th, z01, p);
      verts.push([r * Math.cos(th), r * Math.sin(th), z]);
    }
  }
  const idx = (it, iz) => iz * nTheta + ((it % nTheta + nTheta) % nTheta);
  for (let iz = 0; iz < nZ; iz++) {
    for (let it = 0; it < nTheta; it++) {
      const a = idx(it, iz), b = idx(it + 1, iz), c = idx(it, iz + 1), d = idx(it + 1, iz + 1);
      faces.push([a, c, b], [b, c, d]);
    }
  }
  const bottomCenter = verts.length;
  verts.push([0, 0, 0]);
  for (let it = 0; it < nTheta; it++) faces.push([bottomCenter, idx(it + 1, 0), idx(it, 0)]);
  return { verts, faces };
}

function rotate(v) {
  const [x, y, z] = v;
  const cy = Math.cos(angleY), sy = Math.sin(angleY);
  const cx = Math.cos(angleX), sx = Math.sin(angleX);
  const x1 = x * cy - y * sy;
  const y1 = x * sy + y * cy;
  const z1 = z;
  return [x1, y1 * cx - z1 * sx, y1 * sx + z1 * cx];
}

function draw() {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
  }
  ctx.fillStyle = '#101114';
  ctx.fillRect(0, 0, w, h);
  if (!meshData) return;

  const transformed = meshData.verts.map(v => rotate(v));
  const zMin = Math.min(...transformed.map(v => v[2]));
  const zMax = Math.max(...transformed.map(v => v[2]));
  const centerZ = (zMin + zMax) * 0.5;

  const scale = Math.min(w, h) * 0.012;
  const cameraZ = 360;
  const projected = transformed.map(([x, y, z]) => {
    const depth = cameraZ - (z - centerZ);
    const f = 220 / Math.max(30, depth);
    return [w * 0.52 + x * scale * f, h * 0.82 - y * scale * f, depth];
  });

  const tris = meshData.faces.map(face => {
    const p0 = projected[face[0]], p1 = projected[face[1]], p2 = projected[face[2]];
    const d = (p0[2] + p1[2] + p2[2]) / 3;
    return { face, d };
  }).sort((a, b) => b.d - a.d);

  for (const t of tris) {
    const [a, b, c] = t.face;
    const p0 = projected[a], p1 = projected[b], p2 = projected[c];

    const u1 = p1[0] - p0[0], u2 = p1[1] - p0[1];
    const v1 = p2[0] - p0[0], v2 = p2[1] - p0[1];
    const cross = u1 * v2 - u2 * v1;
    if (cross < 0) continue;

    const shade = Math.max(0.18, Math.min(0.9, 0.35 + 0.0006 * (1100 - t.d)));
    const r = Math.floor(205 * shade), g = Math.floor(183 * shade), bl = Math.floor(159 * shade);
    ctx.fillStyle = `rgb(${r},${g},${bl})`;
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.closePath();
    ctx.fill();
  }
}

function rebuildAndDraw() {
  meshData = buildMesh(params);
  draw();
}

function addControl(name, min, max, step) {
  const wrap = document.createElement('div');
  wrap.className = 'control';
  const row = document.createElement('div');
  row.className = 'row';
  const lbl = document.createElement('span'); lbl.textContent = name;
  const value = document.createElement('span');
  row.append(lbl, value);

  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(params[name]);
  value.textContent = String(params[name]);

  input.addEventListener('input', () => {
    params[name] = name === 'waves' ? Number.parseInt(input.value, 10) : Number(input.value);
    value.textContent = String(params[name]);
    rebuildAndDraw();
  });
  wrap.append(row, input);
  document.getElementById('controls').appendChild(wrap);
}

const presetEl = document.getElementById('preset');
Object.keys(presets).forEach(name => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name;
  presetEl.appendChild(option);
});
presetEl.value = 'spiral_ribbed';

function reloadSliders() {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';
  sliders.forEach(s => addControl(...s));
}

presetEl.addEventListener('change', () => {
  params = { ...presets[presetEl.value] };
  reloadSliders();
  rebuildAndDraw();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  params = { ...presets[presetEl.value] };
  reloadSliders();
  rebuildAndDraw();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!meshData) return;
  const lines = ['# Generated by GUI'];
  for (const [x, y, z] of meshData.verts) lines.push(`v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}`);
  for (const [a, b, c] of meshData.faces) lines.push(`f ${a + 1} ${b + 1} ${c + 1}`);
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${presetEl.value}_gui.obj`;
  link.click();
  URL.revokeObjectURL(link.href);
});

let dragging = false;
let lastX = 0, lastY = 0;
canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; });
window.addEventListener('mouseup', () => { dragging = false; });
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX; lastY = e.clientY;
  angleY += dx * 0.01;
  angleX = Math.max(-1.2, Math.min(0.35, angleX + dy * 0.01));
  draw();
});

window.addEventListener('resize', draw);

reloadSliders();
rebuildAndDraw();
