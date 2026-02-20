import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const presets = {
  spiral_ribbed: { height:180, base_radius:22, neck_radius:16, lip_radius:20, belly_amp:11, belly_center:0.46, belly_width:0.24, waves:14, wave_amp:0.16, wave_z_falloff:0.25, twist:12, twist_curve:0, skew_wave:0.10, seed_phase:0 },
  soft_organic:  { height:180, base_radius:22, neck_radius:18, lip_radius:19, belly_amp:7,  belly_center:0.46, belly_width:0.24, waves:4,  wave_amp:0.09, wave_z_falloff:0.25, twist:3.5, twist_curve:0, skew_wave:0.55, seed_phase:0 },
  fluted_classic:{ height:180, base_radius:20, neck_radius:16, lip_radius:20, belly_amp:10, belly_center:0.46, belly_width:0.24, waves:18, wave_amp:0.11, wave_z_falloff:0.25, twist:1.5, twist_curve:0, skew_wave:0.00, seed_phase:0 },
  tall_twist:    { height:240, base_radius:22, neck_radius:14, lip_radius:16, belly_amp:16, belly_center:0.30, belly_width:0.24, waves:22, wave_amp:0.08, wave_z_falloff:0.25, twist:9, twist_curve:0, skew_wave:0.0,  seed_phase:0 },
  petal_lip:     { height:180, base_radius:22, neck_radius:16, lip_radius:30, belly_amp:9,  belly_center:0.46, belly_width:0.24, waves:12, wave_amp:0.15, wave_z_falloff:0.25, twist:6, twist_curve:0, skew_wave:0.25, seed_phase:0 },
  minimal_wavy:  { height:180, base_radius:18, neck_radius:17, lip_radius:18, belly_amp:5.5,belly_center:0.46, belly_width:0.24, waves:3,  wave_amp:0.07, wave_z_falloff:0.25, twist:2, twist_curve:0, skew_wave:0.45, seed_phase:0 },
};

const sliders = [
  ['height', 80, 320, 1], ['base_radius', 8, 40, .2], ['neck_radius', 6, 34, .2], ['lip_radius', 6, 44, .2],
  ['belly_amp', 0, 24, .2], ['belly_center', 0.1, 0.9, 0.01], ['belly_width', 0.05, 0.45, 0.01],
  ['waves', 2, 30, 1], ['wave_amp', 0, 0.25, 0.005], ['wave_z_falloff', 0.0, 0.45, 0.01],
  ['twist', 0, 16, 0.1], ['twist_curve', -6, 6, 0.1], ['skew_wave', 0, 1, 0.02], ['seed_phase', 0, 6.2832, 0.01]
];

let params = { ...presets.spiral_ribbed };
const nTheta = 140, nZ = 160;
let mesh;

const canvas = document.getElementById('view');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(devicePixelRatio);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x101114);
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 3000);
camera.position.set(0, -140, 160);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.target.set(0, 0, 90);
scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const dir = new THREE.DirectionalLight(0xffffff, 1.0); dir.position.set(1, -1, 2); scene.add(dir);

function smoothstep(x) { x = Math.max(0, Math.min(1, x)); return x*x*(3 - 2*x); }
function baseProfile(z, p) {
  const neckMix = smoothstep(z);
  const linear = (1 - neckMix) * p.base_radius + neckMix * p.neck_radius;
  const lipBloom = (p.lip_radius - p.neck_radius) * smoothstep((z - 0.86) / 0.14);
  const belly = p.belly_amp * Math.exp(-((z - p.belly_center) / Math.max(1e-6, p.belly_width)) ** 2);
  return Math.max(1e-3, linear + lipBloom + belly);
}
function waveEnvelope(z, p) {
  const center = Math.sin(Math.PI * z) ** 0.7;
  const denom = Math.max(1e-6, (1 - 2 * p.wave_z_falloff));
  const fade = smoothstep((z - p.wave_z_falloff) / denom);
  return center * fade;
}
function twistPhase(z, p) { return p.seed_phase + p.twist * z + p.twist_curve * z * z; }
function radius(th, z, p) {
  const r0 = baseProfile(z, p);
  const env = waveEnvelope(z, p);
  const h = Math.cos(p.waves * th + twistPhase(z, p));
  const sk = p.skew_wave * Math.sin((Math.floor(p.waves/2) + 1) * th - 0.7 * twistPhase(z, p));
  return Math.max(1e-3, r0 * (1 + p.wave_amp * env * (h + sk)));
}

function buildGeometry(p) {
  const positions = [];
  const indices = [];
  const verts = [];
  for (let iz = 0; iz <= nZ; iz++) {
    const z01 = iz / nZ;
    const z = z01 * p.height;
    for (let it = 0; it < nTheta; it++) {
      const th = 2 * Math.PI * it / nTheta;
      const r = radius(th, z01, p);
      const x = r * Math.cos(th), y = r * Math.sin(th);
      verts.push([x, y, z]);
      positions.push(x, y, z);
    }
  }
  const idx = (it, iz) => iz * nTheta + ((it % nTheta + nTheta) % nTheta);
  for (let iz = 0; iz < nZ; iz++) {
    for (let it = 0; it < nTheta; it++) {
      const a = idx(it, iz), b = idx(it+1, iz), c = idx(it, iz+1), d = idx(it+1, iz+1);
      indices.push(a,c,b, b,c,d);
    }
  }
  const bottomCenter = verts.length;
  verts.push([0,0,0]);
  positions.push(0,0,0);
  for (let it = 0; it < nTheta; it++) {
    indices.push(bottomCenter, idx(it+1,0), idx(it,0));
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return { geometry, verts, indices };
}

let latestMeshData;
function updateMesh() {
  const built = buildGeometry(params);
  latestMeshData = built;
  if (mesh) {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  mesh = new THREE.Mesh(
    built.geometry,
    new THREE.MeshStandardMaterial({ color: 0xcdb79f, roughness: 0.55, metalness: 0.08, side: THREE.DoubleSide })
  );
  scene.add(mesh);
}

function addControl(name, min, max, step) {
  const wrap = document.createElement('div');
  wrap.className = 'control';
  const row = document.createElement('div');
  row.className = 'row';
  const lbl = document.createElement('span'); lbl.textContent = name;
  const value = document.createElement('span'); value.id = `val-${name}`;
  row.append(lbl, value);
  const input = document.createElement('input');
  input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = params[name];
  input.addEventListener('input', () => {
    params[name] = ['waves'].includes(name) ? Number.parseInt(input.value) : Number(input.value);
    value.textContent = String(params[name]);
    updateMesh();
  });
  value.textContent = String(params[name]);
  wrap.append(row, input);
  document.getElementById('controls').appendChild(wrap);
}

const presetEl = document.getElementById('preset');
Object.keys(presets).forEach(name => {
  const o = document.createElement('option'); o.value = name; o.textContent = name; presetEl.appendChild(o);
});
presetEl.value = 'spiral_ribbed';

function reloadSliders() {
  const controlsEl = document.getElementById('controls');
  controlsEl.innerHTML = '';
  sliders.forEach(([n, a, b, s]) => addControl(n, a, b, s));
}

presetEl.addEventListener('change', () => {
  params = { ...presets[presetEl.value] };
  reloadSliders();
  updateMesh();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  params = { ...presets[presetEl.value] };
  reloadSliders();
  updateMesh();
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  if (!latestMeshData) return;
  const { verts, indices } = latestMeshData;
  const lines = ['# Generated by GUI'];
  for (const [x,y,z] of verts) lines.push(`v ${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)}`);
  for (let i = 0; i < indices.length; i += 3) lines.push(`f ${indices[i]+1} ${indices[i+1]+1} ${indices[i+2]+1}`);
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${presetEl.value}_gui.obj`;
  a.click();
  URL.revokeObjectURL(a.href);
});

function onResize() {
  const rect = canvas.getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width / rect.height;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', onResize);

reloadSliders();
updateMesh();
onResize();

(function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
})();
