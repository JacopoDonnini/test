const presets = {
  spiral_ribbed: { height:180, base_radius:22, neck_radius:16, lip_radius:20, belly_amp:11, belly_center:0.46, belly_width:0.24, waves:14, wave_amp:0.16, wave_z_falloff:0.25, twist:12, twist_curve:0, skew_wave:0.10, seed_phase:0 },
  soft_organic:  { height:180, base_radius:22, neck_radius:18, lip_radius:19, belly_amp:7,  belly_center:0.46, belly_width:0.24, waves:4,  wave_amp:0.09, wave_z_falloff:0.25, twist:3.5, twist_curve:0, skew_wave:0.55, seed_phase:0 },
  fluted_classic:{ height:180, base_radius:20, neck_radius:16, lip_radius:20, belly_amp:10, belly_center:0.46, belly_width:0.24, waves:18, wave_amp:0.11, wave_z_falloff:0.25, twist:1.5, twist_curve:0, skew_wave:0.00, seed_phase:0 },
  tall_twist:    { height:240, base_radius:22, neck_radius:14, lip_radius:16, belly_amp:16, belly_center:0.30, belly_width:0.24, waves:22, wave_amp:0.08, wave_z_falloff:0.25, twist:9, twist_curve:0, skew_wave:0.0,  seed_phase:0 },
  petal_lip:     { height:180, base_radius:22, neck_radius:16, lip_radius:30, belly_amp:9,  belly_center:0.46, belly_width:0.24, waves:12, wave_amp:0.15, wave_z_falloff:0.25, twist:6, twist_curve:0, skew_wave:0.25, seed_phase:0 },
  minimal_wavy:  { height:180, base_radius:18, neck_radius:17, lip_radius:18, belly_amp:5.5, belly_center:0.46, belly_width:0.24, waves:3,  wave_amp:0.07, wave_z_falloff:0.25, twist:2, twist_curve:0, skew_wave:0.45, seed_phase:0 },
};

const resolutionSliders = [
  ['n_theta', 48, 1400, 1],
  ['n_z', 64, 360, 1],
];

const viewSliders = [
  ['zoom', 0.35, 3.0, 0.01],
];

const sliders = [
  ['height', 80, 320, 1], ['base_radius', 8, 40, 0.2], ['neck_radius', 6, 34, 0.2], ['lip_radius', 6, 44, 0.2],
  ['belly_amp', 0, 24, 0.2], ['belly_center', 0.1, 0.9, 0.01], ['belly_width', 0.05, 0.45, 0.01],
  ['waves', 1, 72, 1], ['wave_amp', 0.0, 0.60, 0.005], ['wave_z_falloff', 0.0, 0.49, 0.005],
  ['twist', 0, 16, 0.1], ['twist_curve', -6, 6, 0.1], ['skew_wave', -1.0, 1.0, 0.02], ['seed_phase', 0, 12.5664, 0.01],
];

const MAX_PREVIEW_TRIANGLES = 180000;
const MAX_INTERACTIVE_TRIANGLES = 70000;

let meshResolution = { n_theta: 160, n_z: 200 };
let viewState = { zoom: 1.0 };
let params = { ...presets.spiral_ribbed };
let meshPreview = null;
let meshInteractive = null;

let angleY = 0.5;
let angleX = -0.25;
let dragging = false;
let lastX = 0;
let lastY = 0;

let drawRequested = false;
let interactiveRequested = false;

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

function effectiveResolution(maxTriangles) {
  let nTheta = Math.max(8, Math.floor(meshResolution.n_theta));
  let nZ = Math.max(8, Math.floor(meshResolution.n_z));
  const tri = () => 2 * nTheta * nZ + nTheta;

  if (tri() <= maxTriangles) return { nTheta, nZ };

  const ratio = nTheta / nZ;
  const scaledZ = Math.sqrt(maxTriangles / (2 * Math.max(1e-6, ratio)));
  nZ = Math.max(16, Math.floor(scaledZ));
  nTheta = Math.max(16, Math.floor(nZ * ratio));

  while (tri() > maxTriangles && nTheta > 16 && nZ > 16) {
    if (nTheta > nZ) nTheta -= 1;
    else nZ -= 1;
  }

  return { nTheta, nZ };
}

function buildMesh(p, nTheta, nZ) {
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
  return { verts, faces, nTheta, nZ };
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

function draw(interactive = false) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w; canvas.height = h;
  }
  ctx.fillStyle = '#101114';
  ctx.fillRect(0, 0, w, h);

  const mesh = interactive ? (meshInteractive || meshPreview) : meshPreview;
  if (!mesh) return;

  const transformed = mesh.verts.map(v => rotate(v));
  const xs = transformed.map(v => v[0]);
  const ys = transformed.map(v => v[1]);
  const zs = transformed.map(v => v[2]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const minZ = Math.min(...zs), maxZ = Math.max(...zs);
  const cx = (minX + maxX) * 0.5;
  const cy = (minY + maxY) * 0.5;
  const cz = (minZ + maxZ) * 0.5;

  const spanX = Math.max(1e-6, maxX - minX);
  const spanY = Math.max(1e-6, maxY - minY);
  const fitScale = 0.86 * Math.min(w / spanX, h / spanY);
  const scale = fitScale * viewState.zoom;

  const projected = transformed.map(([x, y, z]) => [
    w * 0.52 + (x - cx) * scale,
    h * 0.52 - (y - cy) * scale,
    z - cz,
  ]);

  const light = [0.35, -0.45, 0.82];
  const lmag = Math.hypot(light[0], light[1], light[2]);
  const lx = light[0] / lmag, ly = light[1] / lmag, lz = light[2] / lmag;

  const bucketCount = 96;
  const buckets = Array.from({ length: bucketCount }, () => []);
  let dMin = Infinity, dMax = -Infinity;
  const triData = [];

  for (const face of mesh.faces) {
    const a = face[0], b = face[1], c = face[2];
    const t0 = transformed[a], t1 = transformed[b], t2 = transformed[c];
    const ux = t1[0] - t0[0], uy = t1[1] - t0[1], uz = t1[2] - t0[2];
    const vx = t2[0] - t0[0], vy = t2[1] - t0[1], vz = t2[2] - t0[2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const nmag = Math.max(1e-6, Math.hypot(nx, ny, nz));
    const ndotl = Math.abs((nx / nmag) * lx + (ny / nmag) * ly + (nz / nmag) * lz);
    const d = (projected[a][2] + projected[b][2] + projected[c][2]) / 3;
    dMin = Math.min(dMin, d);
    dMax = Math.max(dMax, d);
    triData.push({ a, b, c, d, ndotl });
  }

  const spanD = Math.max(1e-6, dMax - dMin);
  for (const t of triData) {
    const bi = Math.max(0, Math.min(bucketCount - 1, Math.floor(((t.d - dMin) / spanD) * (bucketCount - 1))));
    buckets[bi].push(t);
  }

  for (let bi = 0; bi < bucketCount; bi++) {
    const bucket = buckets[bi];
    for (const t of bucket) {
      const p0 = projected[t.a], p1 = projected[t.b], p2 = projected[t.c];
      const ambient = 0.32;
      const diffuse = 0.68 * t.ndotl;
      const shade = Math.max(0.12, Math.min(0.98, ambient + diffuse));
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
}

function scheduleDraw(interactive = false) {
  interactiveRequested = interactiveRequested || interactive;
  if (drawRequested) return;
  drawRequested = true;
  requestAnimationFrame(() => {
    draw(interactiveRequested);
    drawRequested = false;
    interactiveRequested = false;
  });
}

function rebuildMeshes() {
  const previewRes = effectiveResolution(MAX_PREVIEW_TRIANGLES);
  const interactiveRes = effectiveResolution(MAX_INTERACTIVE_TRIANGLES);
  meshPreview = buildMesh(params, previewRes.nTheta, previewRes.nZ);
  meshInteractive = buildMesh(params, interactiveRes.nTheta, interactiveRes.nZ);
  scheduleDraw(false);
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
    rebuildMeshes();
  });
  wrap.append(row, input);
  document.getElementById('controls').appendChild(wrap);
}

function addResolutionControl(name, min, max, step) {
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
  input.value = String(meshResolution[name]);
  value.textContent = String(meshResolution[name]);

  input.addEventListener('input', () => {
    meshResolution[name] = Number.parseInt(input.value, 10);
    value.textContent = String(meshResolution[name]);
    rebuildMeshes();
  });

  wrap.append(row, input);
  document.getElementById('controls').appendChild(wrap);
}

function addViewControl(name, min, max, step) {
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
  input.value = String(viewState[name]);
  value.textContent = Number(viewState[name]).toFixed(2);

  input.addEventListener('input', () => {
    viewState[name] = Number(input.value);
    value.textContent = Number(viewState[name]).toFixed(2);
    scheduleDraw(dragging);
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
  viewSliders.forEach(s => addViewControl(...s));
  resolutionSliders.forEach(s => addResolutionControl(...s));
  sliders.forEach(s => addControl(...s));
}

presetEl.addEventListener('change', () => {
  params = { ...presets[presetEl.value] };
  reloadSliders();
  rebuildMeshes();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  params = { ...presets[presetEl.value] };
  reloadSliders();
  rebuildMeshes();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  const reqTheta = Math.max(8, Math.floor(meshResolution.n_theta));
  const reqZ = Math.max(8, Math.floor(meshResolution.n_z));
  const full = buildMesh(params, reqTheta, reqZ);

  const lines = ['# Generated by GUI'];
  for (const [x, y, z] of full.verts) lines.push(`v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}`);
  for (const [a, b, c] of full.faces) lines.push(`f ${a + 1} ${b + 1} ${c + 1}`);
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${presetEl.value}_gui.obj`;
  link.click();
  URL.revokeObjectURL(link.href);
});

canvas.addEventListener('mousedown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});
window.addEventListener('mouseup', () => {
  dragging = false;
  scheduleDraw(false);
});
window.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  angleY += dx * 0.01;
  angleX = Math.max(-1.2, Math.min(0.35, angleX + dy * 0.01));
  scheduleDraw(true);
});

canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const f = Math.exp(-e.deltaY * 0.0012);
  viewState.zoom = Math.max(0.35, Math.min(3.0, viewState.zoom * f));
  const zoomSlider = document.querySelector('input[type="range"]');
  if (zoomSlider) zoomSlider.value = String(viewState.zoom);
  const zoomLabel = document.querySelector('.control .row span:last-child');
  if (zoomLabel) zoomLabel.textContent = Number(viewState.zoom).toFixed(2);
  scheduleDraw(true);
}, { passive: false });

window.addEventListener('resize', () => scheduleDraw(false));

reloadSliders();
rebuildMeshes();
