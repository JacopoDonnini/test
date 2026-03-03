const presets = {
  spiral_ribbed: { height:180, base_radius:22, neck_radius:16, lip_radius:20, belly_amp:11, belly_center:0.46, belly_width:0.24, waves:14, wave_amp:0.16, wave_z_falloff:0.25, twist:12, twist_curve:0, skew_wave:0.10, seed_phase:0, top_border:0, bottom_border:0, top_transition:2.0, wave_roundness:0.0, bubble_count:0, bubble_depth:0.0, bubble_size:0.10, rib_count:0, rib_depth:0.0, rib_thickness:0.22, rib_roundness:0.30 },
  soft_organic:  { height:180, base_radius:22, neck_radius:18, lip_radius:19, belly_amp:7,  belly_center:0.46, belly_width:0.24, waves:4,  wave_amp:0.09, wave_z_falloff:0.25, twist:3.5, twist_curve:0, skew_wave:0.55, seed_phase:0, top_border:0, bottom_border:0, top_transition:2.0, wave_roundness:0.0, bubble_count:0, bubble_depth:0.0, bubble_size:0.10, rib_count:0, rib_depth:0.0, rib_thickness:0.22, rib_roundness:0.30 },
  fluted_classic:{ height:180, base_radius:20, neck_radius:16, lip_radius:20, belly_amp:10, belly_center:0.46, belly_width:0.24, waves:18, wave_amp:0.11, wave_z_falloff:0.25, twist:1.5, twist_curve:0, skew_wave:0.00, seed_phase:0, top_border:0, bottom_border:0, top_transition:2.0, wave_roundness:0.0, bubble_count:0, bubble_depth:0.0, bubble_size:0.10, rib_count:0, rib_depth:0.0, rib_thickness:0.22, rib_roundness:0.30 },
  tall_twist:    { height:240, base_radius:22, neck_radius:14, lip_radius:16, belly_amp:16, belly_center:0.30, belly_width:0.24, waves:22, wave_amp:0.08, wave_z_falloff:0.25, twist:9, twist_curve:0, skew_wave:0.0,  seed_phase:0, top_border:0, bottom_border:0, top_transition:2.0, wave_roundness:0.0, bubble_count:0, bubble_depth:0.0, bubble_size:0.10, rib_count:0, rib_depth:0.0, rib_thickness:0.22, rib_roundness:0.30 },
  petal_lip:     { height:180, base_radius:22, neck_radius:16, lip_radius:30, belly_amp:9,  belly_center:0.46, belly_width:0.24, waves:12, wave_amp:0.15, wave_z_falloff:0.25, twist:6, twist_curve:0, skew_wave:0.25, seed_phase:0, top_border:0, bottom_border:0, top_transition:2.0, wave_roundness:0.0, bubble_count:0, bubble_depth:0.0, bubble_size:0.10, rib_count:0, rib_depth:0.0, rib_thickness:0.22, rib_roundness:0.30 },
  minimal_wavy:  { height:180, base_radius:18, neck_radius:17, lip_radius:18, belly_amp:5.5, belly_center:0.46, belly_width:0.24, waves:3,  wave_amp:0.07, wave_z_falloff:0.25, twist:2, twist_curve:0, skew_wave:0.45, seed_phase:0, top_border:0, bottom_border:0, top_transition:2.0, wave_roundness:0.0, bubble_count:0, bubble_depth:0.0, bubble_size:0.10, rib_count:0, rib_depth:0.0, rib_thickness:0.22, rib_roundness:0.30 },
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
  ['bottom_border', 0, 20, 0.1], ['top_border', 0, 20, 0.1], ['top_transition', 0, 20, 0.1],
  ['belly_amp', 0, 24, 0.2], ['belly_center', 0.1, 0.9, 0.01], ['belly_width', 0.05, 0.45, 0.01],
  ['wave_roundness', 0.0, 1.0, 0.01],
  ['waves', 0, 72, 1], ['wave_amp', 0.0, 0.60, 0.005], ['wave_z_falloff', 0.0, 0.49, 0.005],
  ['twist', 0, 16, 0.1], ['twist_curve', -6, 6, 0.1], ['skew_wave', -1.0, 1.0, 0.02], ['seed_phase', 0, 12.5664, 0.01],
  ['bubble_count', 0, 120, 1], ['bubble_depth', 0.0, 1.8, 0.01], ['bubble_size', 0.01, 0.60, 0.01],
  ['rib_count', 0, 120, 1], ['rib_depth', 0.0, 0.8, 0.01], ['rib_thickness', 0.04, 0.90, 0.01], ['rib_roundness', 0.0, 1.0, 0.01],
];

const textureModes = ['none', 'honeycomb', 'bark', 'paper', 'upload'];


const FIELD_INFO = {
  zoom: { label: 'Zoom', unit: 'x', group: 'View', description: 'Scales the preview camera without changing the exported mesh.' },
  n_theta: { label: 'Radial Resolution', unit: '', group: 'Resolution', description: 'Number of vertices around each ring. Higher = smoother circular detail.' },
  n_z: { label: 'Vertical Resolution', unit: '', group: 'Resolution', description: 'Number of segments along height. Higher = smoother vertical profile.' },

  height: { label: 'Height', unit: 'mm', group: 'Shape', description: 'Total vase height.' },
  base_radius: { label: 'Base Radius', unit: 'mm', group: 'Shape', description: 'Radius at the very bottom of the vase.' },
  neck_radius: { label: 'Neck Radius', unit: 'mm', group: 'Shape', description: 'Main radius near upper body before lip flare.' },
  lip_radius: { label: 'Lip Radius', unit: 'mm', group: 'Shape', description: 'Radius at the open top lip.' },
  belly_amp: { label: 'Belly Amount', unit: 'mm', group: 'Shape', description: 'How much the center swells outward.' },
  belly_center: { label: 'Belly Position', unit: '', group: 'Shape', description: 'Vertical location of the belly bulge (0 bottom → 1 top).' },
  belly_width: { label: 'Belly Width', unit: '', group: 'Shape', description: 'How broad or narrow the belly area is.' },

  bottom_border: { label: 'Bottom Straight Band', unit: 'mm', group: 'Borders', description: 'Keeps the bottom section straight/cylindrical for this height.' },
  top_border: { label: 'Top Straight Band', unit: 'mm', group: 'Borders', description: 'Keeps the lip section straight/cylindrical for this height.' },
  top_transition: { label: 'Border Blend Band', unit: 'mm', group: 'Borders', description: 'Smooth blend height where waves/details fade into both top and bottom straight bands.' },

  waves: { label: 'Wave Count', unit: '', group: 'Waves', description: 'Number of wave lobes around the circumference (set 0 to disable waves).' },
  wave_amp: { label: 'Wave Strength', unit: '', group: 'Waves', description: 'How strong the wave deformation is.' },
  wave_z_falloff: { label: 'Bottom Wave Fade', unit: '', group: 'Waves', description: 'How much waves fade out near the bottom.' },
  wave_roundness: { label: 'Wave Smoothing', unit: '', group: 'Waves', description: 'Rounds sharp peaks by smoothing each ring.' },

  twist: { label: 'Twist', unit: '', group: 'Flow', description: 'Overall rotational twist from bottom to top.' },
  twist_curve: { label: 'Twist Curve', unit: '', group: 'Flow', description: 'Makes twist accelerate or decelerate with height.' },
  skew_wave: { label: 'Wave Asymmetry', unit: '', group: 'Flow', description: 'Adds asymmetry for a more organic look.' },
  seed_phase: { label: 'Wave Phase', unit: 'rad', group: 'Flow', description: 'Initial rotational phase of waves.' },
  bubble_count: { label: 'Bubble Count', unit: '', group: 'Details', description: 'Number of bubble-like dimples scattered on the vase body.' },
  bubble_depth: { label: 'Bubble Depth', unit: '', group: 'Details', description: 'Strength of bubble protrusion/dimple effect (now extended range for more aggressive results).'},
  bubble_size: { label: 'Bubble Size', unit: '', group: 'Details', description: 'Approximate bubble footprint size (extended range for larger/layered bubbles).' },
  rib_count: { label: 'Vertical Rib Count', unit: '', group: 'Details', description: 'Number of straight vertical fins around the vase.' },
  rib_depth: { label: 'Vertical Rib Depth', unit: '', group: 'Details', description: 'How far each rib protrudes from the surface.' },
  rib_roundness: { label: 'Rib Outer Edge Roundness', unit: '', group: 'Details', description: 'Rounds the protruding short edge of each rectangular rib (0 = sharp, 1 = very rounded).' },
  rib_thickness: { label: 'Rib Thickness', unit: '', group: 'Details', description: 'How thick each rib is (printability control).' },

  texture_mode: { label: 'Texture Type', group: 'Texture', description: 'Choose a built-in procedural texture or upload your own image.' },
  depth: { label: 'Texture Depth', unit: '', group: 'Texture', description: 'How strongly texture carves in/out on the surface.' },
  scaleU: { label: 'Texture Repeat Around', unit: '', group: 'Texture', description: 'Horizontal repetition around circumference (U).' },
  scaleV: { label: 'Texture Repeat Height', unit: '', group: 'Texture', description: 'Vertical repetition along height (V).' },
  upload_texture: { label: 'Upload Texture Image', group: 'Texture', description: 'Upload PNG/JPG/WEBP; grayscale PNG gives best consistency.' },

  bottom_svg_scale: { label: 'SVG Scale', unit: 'x', group: 'Bottom Engraving', description: 'Scale of the SVG engraving on the flat outside base.' },
  bottom_svg_tx: { label: 'SVG Offset X', unit: '', group: 'Bottom Engraving', description: 'Horizontal shift of engraving on bottom base (negative to positive).' },
  bottom_svg_ty: { label: 'SVG Offset Y', unit: '', group: 'Bottom Engraving', description: 'Vertical shift of engraving on bottom base (negative to positive).' },
  bottom_svg_upload: { label: 'Upload Bottom SVG', group: 'Bottom Engraving', description: 'Upload an SVG logo/shape to engrave on the outside bottom surface.' },
  bottom_svg_depth: { label: 'SVG Engrave Depth', unit: 'mm', group: 'Bottom Engraving', description: 'How deep the bottom SVG is engraved into the base.' },
};

const GROUP_ORDER = ['View', 'Resolution', 'Shape', 'Borders', 'Waves', 'Flow', 'Details', 'Texture', 'Bottom Engraving'];

const MAX_PREVIEW_TRIANGLES = 180000;
const MAX_INTERACTIVE_TRIANGLES = 70000;

let meshResolution = { n_theta: 160, n_z: 200 };
let viewState = { zoom: 1.0 };
let textureState = { mode: 'none', depth: 0.16, scaleU: 6.0, scaleV: 6.0 };
let uploadedTexture = null; // { w, h, data: Float32Array luminance 0..1 }
let bottomSvgState = { bottom_svg_scale: 0.55, bottom_svg_tx: 0.0, bottom_svg_ty: 0.0, bottom_svg_depth: 1.2 };
let bottomSvgMask = null; // { w, h, data: Float32Array 0..1, image: HTMLImageElement }

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
const bottomCanvas = document.getElementById('bottomView');
const bottomCtx = bottomCanvas ? bottomCanvas.getContext('2d') : null;

function smoothstep(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
function fract(x) { return x - Math.floor(x); }

function baseProfile(z, p) {
  const neckMix = smoothstep(z);
  const linear = (1 - neckMix) * p.base_radius + neckMix * p.neck_radius;
  const lipBloom = (p.lip_radius - p.neck_radius) * smoothstep((z - 0.86) / 0.14);
  const t = (z - p.belly_center) / Math.max(1e-6, p.belly_width);
  const belly = p.belly_amp * Math.exp(-(t * t));
  return Math.max(1e-3, linear + lipBloom + belly);
}
function borderThicknessMm(value, height) {
  return Math.max(0, Math.min(Number(value) || 0, Math.max(0, height * 0.5)));
}

function topTransitionMm(p) {
  const transition = borderThicknessMm(p.top_transition, p.height);
  return transition;
}

function borderBandBlendEnvelope(z, p) {
  const zMm = z * p.height;
  const transition = topTransitionMm(p);
  if (transition <= 1e-6) return 1;

  const bottomBorder = borderThicknessMm(p.bottom_border, p.height);
  if (bottomBorder > 0 && zMm > bottomBorder && zMm <= bottomBorder + transition) {
    return smoothstep((zMm - bottomBorder) / transition);
  }

  const topBorder = borderThicknessMm(p.top_border, p.height);
  if (topBorder > 0) {
    const distToTop = p.height - zMm;
    if (distToTop > topBorder && distToTop <= topBorder + transition) {
      return smoothstep((distToTop - topBorder) / transition);
    }
  }

  return 1;
}

function bottomBorderRadius(p) {
  const bottomBorder = borderThicknessMm(p.bottom_border, p.height);
  if (bottomBorder <= 0) return Math.max(1e-3, p.base_radius);
  const z = Math.max(0, Math.min(1, bottomBorder / Math.max(1e-6, p.height)));
  // Keep the straight base as wide as the vase right above the border by sampling
  // the average profile radius at the transition height before border straightening.
  return Math.max(1e-3, baseProfile(z, p));
}

function isInStraightZone(z, p) {
  const zMm = z * p.height;
  const bottomBorder = borderThicknessMm(p.bottom_border, p.height);
  const topBorder = borderThicknessMm(p.top_border, p.height);
  if (bottomBorder > 0 && zMm <= bottomBorder) return true;
  if (topBorder > 0 && (p.height - zMm) <= topBorder) return true;
  return false;
}

function waveEnvelope(z, p) {
  const center = Math.pow(Math.sin(Math.PI * z), 0.7);
  const denom = Math.max(1e-6, (1 - 2 * p.wave_z_falloff));
  const fade = smoothstep((z - p.wave_z_falloff) / denom);
  return center * fade;
}
function twistPhase(z, p) { return p.seed_phase + p.twist * z + p.twist_curve * z * z; }
function hash01(a, b) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453123;
  return fract(x);
}

function buildBubbleSet(p) {
  const count = Math.max(0, Math.floor(p.bubble_count || 0));
  if (count <= 0) return [];
  const set = [];
  const seed = Number(p.seed_phase || 0);
  for (let i = 0; i < count; i++) {
    const u = hash01(i + seed, 1.13 + seed * 0.37);
    const z = 0.08 + 0.84 * hash01(i + 33.7 + seed, 9.71);
    const amp = 0.9 + 0.8 * hash01(i + 19.1, seed + 4.2);
    set.push({ u, z, amp });
  }
  return set;
}

function applyBubbleField(r, th, z01, p, bubbleSet, envelope = 1) {
  if (!bubbleSet || bubbleSet.length === 0) return r;
  const depth = Math.max(0, Number(p.bubble_depth || 0));
  const env = Math.max(0, Math.min(1, Number(envelope || 0)));
  if (depth <= 1e-6 || env <= 1e-6) return r;
  const size = Math.max(0.02, Number(p.bubble_size || 0.1));

  const u = th / (2 * Math.PI);
  let field = 0;
  for (const b of bubbleSet) {
    let du = Math.abs(u - b.u);
    du = Math.min(du, 1 - du);
    const dz = z01 - b.z;
    const d2 = (du * du + dz * dz) / Math.max(1e-6, size * size);
    const g = b.amp * Math.exp(-d2 * 6.0);
    if (g > field) field = g;
  }

  const bubble = Math.max(0, Math.min(1.5, field));
  return Math.max(1e-3, r * (1 + depth * env * 0.55 * bubble));
}

function applyVerticalRibs(r, th, _z01, p, envelope = 1) {
  const count = Math.max(0, Math.floor(Number(p.rib_count || 0)));
  const depth = Math.max(0, Number(p.rib_depth || 0));
  const env = Math.max(0, Math.min(1, Number(envelope || 0)));
  if (count <= 0 || depth <= 1e-6 || env <= 1e-6) return r;

  const thickness = Math.max(0.02, Math.min(0.95, Number(p.rib_thickness || 0.22)));
  const edgeRoundness = Math.max(0, Math.min(1, Number(p.rib_roundness || 0.30)));
  const u = th / (2 * Math.PI);
  const cell = fract(u * count);
  const d = Math.abs(cell - 0.5);

  // Rectangular rib footprint around each centerline, plus optional rounding
  // only on the outer protruding (short) edge.
  const halfPlateau = Math.max(0.01, 0.5 * thickness * 0.5);
  const outerEdge = Math.max(0.003, (0.004 + 0.10 * edgeRoundness) * Math.min(1, thickness * 2.0));
  const hardRect = d <= halfPlateau ? 1 : 0;
  const roundedOuter = 1 - smoothstep((d - halfPlateau) / outerEdge);
  const rib = edgeRoundness <= 1e-6 ? hardRect : Math.max(0, Math.min(1, roundedOuter));

  return Math.max(1e-3, r * (1 + depth * env * 0.26 * rib));
}

function radius(th, z, p) {
  const zMm = z * p.height;
  const bottomBorder = borderThicknessMm(p.bottom_border, p.height);
  if (bottomBorder > 0 && zMm <= bottomBorder) return bottomBorderRadius(p);

  const topBorder = borderThicknessMm(p.top_border, p.height);
  const distToTop = p.height - zMm;
  if (topBorder > 0 && distToTop <= topBorder) return Math.max(1e-3, p.lip_radius);

  const r0 = baseProfile(z, p);
  const wavesCount = Math.max(0, Math.floor(Number(p.waves || 0)));
  let waved = r0;
  if (wavesCount > 0) {
    const env = waveEnvelope(z, p);
    const h = Math.cos(wavesCount * th + twistPhase(z, p));
    const sk = p.skew_wave * Math.sin((Math.floor(wavesCount / 2) + 1) * th - 0.7 * twistPhase(z, p));
    waved = Math.max(1e-3, r0 * (1 + p.wave_amp * env * (h + sk)));
  }

  // Smoothly blend from the bottom straight border into the waved profile so
  // features don't start with a hard step above the base band.
  if (bottomBorder > 0) {
    const transition = topTransitionMm(p);
    if (transition > 0 && zMm <= bottomBorder + transition) {
      const t = smoothstep((zMm - bottomBorder) / transition);
      return Math.max(1e-3, bottomBorderRadius(p) * (1 - t) + waved * t);
    }
  }

  // Smoothly blend from waved profile into the top straight border so the upper
  // cylinder does not start with a sharp geometric step over large wave fronts.
  if (topBorder > 0) {
    const transition = topTransitionMm(p);
    if (transition > 0 && distToTop <= topBorder + transition) {
      const t = smoothstep((distToTop - topBorder) / transition);
      return Math.max(1e-3, p.lip_radius * (1 - t) + waved * t);
    }
  }

  return waved;
}

function sampleHoneycomb(u, v) {
  const su = u * textureState.scaleU * 2.0;
  const sv = v * textureState.scaleV * 1.1547;
  const qx = su;
  const qy = sv - su * 0.5;
  const rq = Math.round(qx);
  const rr = Math.round(qy);
  const dx = qx - rq;
  const dy = qy - rr;
  const dist = Math.min(1.0, Math.hypot(dx, dy));
  const edge = smoothstep(0.25 + 0.25 * dist);
  return 0.35 + 0.65 * edge;
}

function sampleBark(u, v) {
  const x = u * textureState.scaleU;
  const y = v * textureState.scaleV;
  const ridges = Math.abs(Math.sin(8.0 * x + 1.4 * Math.sin(2.7 * y)));
  const grain = 0.5 + 0.5 * Math.sin(17.0 * y + 4.0 * Math.sin(2.0 * x));
  return Math.max(0, Math.min(1, 0.35 + 0.45 * ridges + 0.2 * grain));
}

function samplePaper(u, v) {
  const x = u * textureState.scaleU;
  const y = v * textureState.scaleV;
  const n1 = 0.5 + 0.5 * Math.sin(13.13 * x + 7.11 * y);
  const n2 = 0.5 + 0.5 * Math.sin(31.73 * x - 9.91 * y);
  const n3 = 0.5 + 0.5 * Math.sin(53.21 * x + 37.77 * y);
  return Math.max(0, Math.min(1, 0.4 * n1 + 0.35 * n2 + 0.25 * n3));
}

function blurFloatMap(data, w, h, passes = 1) {
  let src = data;
  for (let pass = 0; pass < passes; pass++) {
    const dst = new Float32Array(src.length);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let acc = 0;
        let count = 0;
        for (let oy = -1; oy <= 1; oy++) {
          const yy = Math.max(0, Math.min(h - 1, y + oy));
          for (let ox = -1; ox <= 1; ox++) {
            const xx = Math.max(0, Math.min(w - 1, x + ox));
            acc += src[yy * w + xx];
            count += 1;
          }
        }
        dst[y * w + x] = acc / count;
      }
    }
    src = dst;
  }
  return src;
}

function sampleUploaded(u, v) {
  if (!uploadedTexture) return 0.5;

  const sampleBilinear = (uu, vv) => {
    const fx = uu * (uploadedTexture.w - 1);
    const fy = vv * (uploadedTexture.h - 1);
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const x1 = Math.min(uploadedTexture.w - 1, x0 + 1);
    const y1 = Math.min(uploadedTexture.h - 1, y0 + 1);
    const tx = fx - x0, ty = fy - y0;
    const i00 = y0 * uploadedTexture.w + x0;
    const i10 = y0 * uploadedTexture.w + x1;
    const i01 = y1 * uploadedTexture.w + x0;
    const i11 = y1 * uploadedTexture.w + x1;
    const a = uploadedTexture.data[i00] * (1 - tx) + uploadedTexture.data[i10] * tx;
    const b = uploadedTexture.data[i01] * (1 - tx) + uploadedTexture.data[i11] * tx;
    return a * (1 - ty) + b * ty;
  };

  const uu = fract(u * textureState.scaleU);
  const vv = fract(v * textureState.scaleV);
  const du = 0.5 / Math.max(2, uploadedTexture.w);
  const dv = 0.5 / Math.max(2, uploadedTexture.h);

  let acc = 0;
  acc += sampleBilinear(fract(uu - du), fract(vv - dv));
  acc += sampleBilinear(fract(uu + du), fract(vv - dv));
  acc += sampleBilinear(fract(uu - du), fract(vv + dv));
  acc += sampleBilinear(fract(uu + du), fract(vv + dv));
  return acc * 0.25;
}

function sampleTexture(u, v) {
  if (textureState.mode === 'none') return 0.5;
  if (textureState.mode === 'honeycomb') return sampleHoneycomb(u, v);
  if (textureState.mode === 'bark') return sampleBark(u, v);
  if (textureState.mode === 'paper') return samplePaper(u, v);
  if (textureState.mode === 'upload') return sampleUploaded(u, v);
  return 0.5;
}

function sampleBottomSvgMask(x, y, radiusRef) {
  if (!bottomSvgMask || radiusRef <= 1e-6) return 0;

  const sampleBilinear = (u, v) => {
    if (u < 0 || u > 1 || v < 0 || v > 1) return 0;
    const fx = u * (bottomSvgMask.w - 1);
    const fy = v * (bottomSvgMask.h - 1);
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const x1 = Math.min(bottomSvgMask.w - 1, x0 + 1);
    const y1 = Math.min(bottomSvgMask.h - 1, y0 + 1);
    const tx = fx - x0;
    const ty = fy - y0;
    const i00 = y0 * bottomSvgMask.w + x0;
    const i10 = y0 * bottomSvgMask.w + x1;
    const i01 = y1 * bottomSvgMask.w + x0;
    const i11 = y1 * bottomSvgMask.w + x1;
    const a = bottomSvgMask.data[i00] * (1 - tx) + bottomSvgMask.data[i10] * tx;
    const b = bottomSvgMask.data[i01] * (1 - tx) + bottomSvgMask.data[i11] * tx;
    return a * (1 - ty) + b * ty;
  };

  const nx = x / radiusRef;
  const ny = y / radiusRef;
  const su = (nx - bottomSvgState.bottom_svg_tx) / Math.max(1e-6, bottomSvgState.bottom_svg_scale);
  const sv = (ny - bottomSvgState.bottom_svg_ty) / Math.max(1e-6, bottomSvgState.bottom_svg_scale);
  const u = 0.5 + su * 0.5;
  const v = 0.5 - sv * 0.5;

  const du = 0.5 / Math.max(2, bottomSvgMask.w);
  const dv = 0.5 / Math.max(2, bottomSvgMask.h);
  let acc = 0;
  acc += sampleBilinear(u - du, v - dv);
  acc += sampleBilinear(u + du, v - dv);
  acc += sampleBilinear(u - du, v + dv);
  acc += sampleBilinear(u + du, v + dv);
  return acc * 0.25;
}

function drawBottomViewer() {
  if (!bottomCtx || !bottomCanvas) return;
  const w = bottomCanvas.width;
  const h = bottomCanvas.height;
  bottomCtx.fillStyle = '#0f1012';
  bottomCtx.fillRect(0, 0, w, h);

  const cx = w * 0.5;
  const cy = h * 0.5;
  const baseVisualRadius = Math.min(w, h) * 0.42;

  // Match bottom-view scale to the *effective* base width after bottom-band straightening.
  const effectiveBaseRadius = bottomBorderRadius(params);
  let profileRefRadius = Math.max(1e-3, effectiveBaseRadius, Number(params.lip_radius || 0), Number(params.neck_radius || 0));
  for (let i = 0; i <= 48; i++) {
    const z = i / 48;
    profileRefRadius = Math.max(profileRefRadius, baseProfile(z, params));
  }
  const scale = Math.max(0.45, Math.min(1.0, effectiveBaseRadius / Math.max(1e-3, profileRefRadius)));
  const r = baseVisualRadius * scale;

  bottomCtx.strokeStyle = '#565a60';
  bottomCtx.lineWidth = 1.5;
  bottomCtx.beginPath();
  bottomCtx.arc(cx, cy, r, 0, Math.PI * 2);
  bottomCtx.stroke();

  bottomCtx.save();
  bottomCtx.beginPath();
  bottomCtx.arc(cx, cy, r, 0, Math.PI * 2);
  bottomCtx.clip();

  bottomCtx.fillStyle = '#1a1d22';
  bottomCtx.fillRect(cx - r, cy - r, 2 * r, 2 * r);

  if (bottomSvgMask && bottomSvgMask.image) {
    const size = 2 * r * bottomSvgState.bottom_svg_scale;
    const dx = cx + bottomSvgState.bottom_svg_tx * r - size * 0.5;
    const dy = cy - bottomSvgState.bottom_svg_ty * r - size * 0.5;
    bottomCtx.globalAlpha = 0.85;
    bottomCtx.imageSmoothingEnabled = true;
    bottomCtx.drawImage(bottomSvgMask.image, dx, dy, size, size);
    bottomCtx.globalAlpha = 1.0;
  }

  bottomCtx.restore();

  bottomCtx.fillStyle = '#bfc6d0';
  bottomCtx.font = '12px Inter, system-ui, sans-serif';
  bottomCtx.fillText(`Outside bottom view (effective radius: ${effectiveBaseRadius.toFixed(1)} mm)`, 12, h - 12);
}

function loadBottomSvgFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read SVG file.'));
    reader.onload = () => {
      const text = String(reader.result || '');
      if (!text.toLowerCase().includes('<svg')) {
        reject(new Error('Selected file is not a valid SVG.'));
        return;
      }
      const blob = new Blob([text], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = 4096;
          c.height = 4096;
          const cctx = c.getContext('2d');
          cctx.clearRect(0, 0, c.width, c.height);
          const aspect = Math.max(1e-6, img.width / Math.max(1, img.height));
          let dw = c.width, dh = Math.round(dw / aspect);
          if (dh > c.height) { dh = c.height; dw = Math.round(dh * aspect); }
          const dx = Math.floor((c.width - dw) / 2);
          const dy = Math.floor((c.height - dh) / 2);
          cctx.imageSmoothingEnabled = true;
          cctx.imageSmoothingQuality = 'high';
          cctx.drawImage(img, dx, dy, dw, dh);
          const rgba = cctx.getImageData(0, 0, c.width, c.height).data;
          const maskDark = new Float32Array(c.width * c.height);
          const maskAlpha = new Float32Array(c.width * c.height);
          let darkSum = 0;
          let alphaSum = 0;
          let darkMax = 0;
          let alphaMax = 0;
          for (let i = 0; i < maskDark.length; i++) {
            const a = rgba[i * 4 + 3] / 255.0;
            const lum = (0.2126 * rgba[i * 4] + 0.7152 * rgba[i * 4 + 1] + 0.0722 * rgba[i * 4 + 2]) / 255.0;
            const dark = a * (1 - lum);
            maskDark[i] = dark;
            maskAlpha[i] = a;
            darkSum += dark;
            alphaSum += a;
            if (dark > darkMax) darkMax = dark;
            if (a > alphaMax) alphaMax = a;
          }

          const pixelCount = Math.max(1, maskDark.length);
          const darkMean = darkSum / pixelCount;
          const alphaMean = alphaSum / pixelCount;
          const useAlphaFallback = (darkMax < 0.02) || (darkMean < 0.001 && alphaMean > 0.002);
          const baseMask = useAlphaFallback ? maskAlpha : maskDark;
          const smoothMask = blurFloatMap(baseMask, c.width, c.height, 1);
          bottomSvgMask = { w: c.width, h: c.height, data: smoothMask, image: img };
          drawBottomViewer();
          rebuildMeshes();
          resolve()
        } catch (err) {
          reject(err);
        } finally {
          URL.revokeObjectURL(url);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to render SVG image.'));
      };
      img.src = url;
    };
    reader.readAsText(file);
  });
}

function smoothCircularRing(values, radius, strength, passes) {
  const n = values.length;
  let cur = values.slice();
  for (let pass = 0; pass < passes; pass++) {
    const next = new Array(n);
    for (let i = 0; i < n; i++) {
      let acc = 0;
      let w = 0;
      for (let k = -radius; k <= radius; k++) {
        const j = (i + k + n) % n;
        const wk = radius + 1 - Math.abs(k);
        acc += cur[j] * wk;
        w += wk;
      }
      const avg = acc / Math.max(1e-9, w);
      next[i] = cur[i] * (1 - strength) + avg * strength;
    }
    cur = next;
  }
  return cur;
}

function effectiveResolution(maxTriangles) {
  let nTheta = Math.max(8, Math.floor(meshResolution.n_theta));
  let nZ = Math.max(8, Math.floor(meshResolution.n_z));
  const tri = () => {
    const side = 2 * nTheta * nZ;
    const radialSteps = Math.max(10, Math.floor(nTheta / 2));
    const bottom = 2 * nTheta * radialSteps;
    return side + bottom;
  };

  if (tri() <= maxTriangles) return { nTheta, nZ };

  const ratio = nTheta / Math.max(1e-6, nZ);
  const scaledZ = Math.sqrt(maxTriangles / Math.max(1e-6, 3.8 * ratio));
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

  const bubbleSet = buildBubbleSet(p);

  for (let iz = 0; iz <= nZ; iz++) {
    const z01 = iz / nZ;
    const z = z01 * p.height;
    const ringR = [];
    const inStraightZone = isInStraightZone(z01, p);
    for (let it = 0; it < nTheta; it++) {
      const th = 2 * Math.PI * it / nTheta;
      let r = radius(th, z01, p);

      // Straight top/bottom border bands must override all decorative modifiers.
      if (!inStraightZone) {
        const detailEnvelope = borderBandBlendEnvelope(z01, p);
        r = applyBubbleField(r, th, z01, p, bubbleSet, detailEnvelope);
        r = applyVerticalRibs(r, th, z01, p, detailEnvelope);

        const u = it / nTheta;
        const tex = sampleTexture(u, z01); // 0..1
        const carved = (0.5 - tex) * 2.0; // brighter -> inward
        const depth = Math.max(0, Math.min(0.95, textureState.depth));
        r *= (1 + carved * depth * 0.35 * detailEnvelope);
        r = Math.max(1e-3, r);
      }

      ringR.push(r);
    }

    // Wave dampener: smooth each perimeter ring symmetrically to round harsh peaks/edges.
    const roundness = Math.max(0.0, Math.min(1.0, Number(p.wave_roundness ?? 0.0)));
    if (roundness > 1e-6) {
      const kernelRadius = Math.max(1, Math.floor(1 + roundness * 7));
      const passes = Math.max(1, Math.floor(1 + roundness * 5));
      const blend = Math.max(0.05, Math.min(0.95, roundness * 0.75));
      const smoothed = smoothCircularRing(ringR, kernelRadius, blend, passes);
      for (let it = 0; it < nTheta; it++) ringR[it] = smoothed[it];
    }

    for (let it = 0; it < nTheta; it++) {
      const th = 2 * Math.PI * it / nTheta;
      const r = ringR[it];
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

  // Build a stitched engraved bottom cap using concentric rings tied to the
  // existing base ring to keep one connected, slicer-friendly shell.
  const baseRingIdx = [];
  for (let it = 0; it < nTheta; it++) baseRingIdx.push(idx(it, 0));
  const maxBaseRadius = Math.max(...baseRingIdx.map(i => Math.hypot(verts[i][0], verts[i][1])));

  const depth = Math.max(0, bottomSvgState.bottom_svg_depth);
  const radialSteps = Math.max(10, Math.floor(nTheta / 2));
  const ringIndex = Array.from({ length: radialSteps + 1 }, () => new Int32Array(nTheta));

  // Outer ring reuses vase base vertices for a watertight stitch.
  for (let it = 0; it < nTheta; it++) ringIndex[radialSteps][it] = baseRingIdx[it];

  for (let ir = 0; ir < radialSteps; ir++) {
    const rr = maxBaseRadius * (ir / radialSteps);
    for (let it = 0; it < nTheta; it++) {
      const th = 2 * Math.PI * it / nTheta;
      const x = rr * Math.cos(th);
      const y = rr * Math.sin(th);
      const mask = sampleBottomSvgMask(x, y, maxBaseRadius);
      const carveRaw = Math.max(0, Math.min(1, mask));
      const carve = carveRaw >= 0.5 ? 1 : 0;
      const zBottom = depth * carve;
      ringIndex[ir][it] = verts.length;
      verts.push([x, y, zBottom]);
    }
  }

  const centerMask = sampleBottomSvgMask(0, 0, maxBaseRadius);
  const centerCarve = Math.max(0, Math.min(1, centerMask)) >= 0.5 ? 1 : 0;
  const centerZ = depth * centerCarve;
  const centerIdx = verts.length;
  verts.push([0, 0, centerZ]);

  for (let it = 0; it < nTheta; it++) {
    const a = centerIdx;
    const b = ringIndex[0][it];
    const c = ringIndex[0][(it + 1) % nTheta];
    faces.push([a, c, b]);
  }

  for (let ir = 0; ir < radialSteps; ir++) {
    for (let it = 0; it < nTheta; it++) {
      const a = ringIndex[ir][it];
      const b = ringIndex[ir][(it + 1) % nTheta];
      const c = ringIndex[ir + 1][it];
      const d = ringIndex[ir + 1][(it + 1) % nTheta];
      faces.push([a, d, c], [a, b, d]);
    }
  }

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
    canvas.width = w;
    canvas.height = h;
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

function paramsForPreview(original, nTheta) {
  const out = { ...original };
  const maxRibsForSampling = Math.max(0, Math.floor(nTheta / 3));
  if (Number(out.rib_count || 0) > maxRibsForSampling) out.rib_count = maxRibsForSampling;
  return out;
}

function rebuildMeshes() {
  const previewRes = effectiveResolution(MAX_PREVIEW_TRIANGLES);
  const interactiveRes = effectiveResolution(MAX_INTERACTIVE_TRIANGLES);
  meshPreview = buildMesh(paramsForPreview(params, previewRes.nTheta), previewRes.nTheta, previewRes.nZ);
  meshInteractive = buildMesh(paramsForPreview(params, interactiveRes.nTheta), interactiveRes.nTheta, interactiveRes.nZ);
  scheduleDraw(false);
}


function formatFieldValue(name, value) {
  const info = FIELD_INFO[name] || {};
  const numeric = Number(value);
  if (name === 'waves' || name === 'n_theta' || name === 'n_z' || name === 'bubble_count' || name === 'rib_count') return String(Math.round(numeric));
  if (!Number.isFinite(numeric)) return String(value);
  const fixed = Math.abs(numeric) >= 100 ? numeric.toFixed(1) : numeric.toFixed(2);
  return info.unit ? `${fixed} ${info.unit}` : fixed;
}

function showHelpFor(name) {
  const helpTitle = document.getElementById('helpTitle');
  const helpText = document.getElementById('helpText');
  if (!helpTitle || !helpText) return;
  const info = FIELD_INFO[name];
  if (!info) return;
  helpTitle.textContent = info.label || name;
  helpText.textContent = info.description || 'Adjust this parameter to change the vase.';
}

function getOrCreateGroup(name) {
  const controls = document.getElementById('controls');
  const id = `group-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let section = document.getElementById(id);
  if (!section) {
    section = document.createElement('section');
    section.className = 'group';
    section.id = id;
    const h = document.createElement('h2');
    h.textContent = name;
    section.appendChild(h);
    controls.appendChild(section);
  }
  return section;
}

function addControl(name, min, max, step, stateObj, onChange) {
  const info = FIELD_INFO[name] || { label: name, group: 'Shape' };
  const wrap = document.createElement('div');
  wrap.className = 'control';
  wrap.title = info.description || '';

  const row = document.createElement('div');
  row.className = 'row';
  const lbl = document.createElement('span');
  lbl.textContent = info.label || name;

  const valueWrap = document.createElement('div');
  valueWrap.className = 'value-wrap';
  const valueInput = document.createElement('input');
  valueInput.type = 'number';
  valueInput.className = 'value-input';
  valueInput.min = String(min);
  valueInput.max = String(max);
  valueInput.step = String(step);
  valueInput.value = String(stateObj[name]);
  const valueUnit = document.createElement('span');
  valueUnit.className = 'value-unit';
  valueUnit.textContent = info.unit || '';
  valueWrap.append(valueInput, valueUnit);

  row.append(lbl, valueWrap);

  const input = document.createElement('input');
  input.type = 'range';
  input.min = String(min);
  input.max = String(max);
  input.step = String(step);
  input.value = String(stateObj[name]);

  const activateHelp = () => showHelpFor(name);
  input.addEventListener('focus', activateHelp);
  input.addEventListener('mouseenter', activateHelp);
  lbl.addEventListener('mouseenter', activateHelp);
  valueInput.addEventListener('focus', activateHelp);

  const clampToRange = (v) => Math.max(min, Math.min(max, v));

  const applyValue = (raw, fromTextField = false) => {
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return;
    const clamped = clampToRange(parsed);
    onChange(String(clamped));
    input.value = String(stateObj[name]);
    valueInput.value = String(stateObj[name]);
    if (fromTextField) scheduleDraw(dragging);
  };

  input.addEventListener('input', () => {
    applyValue(input.value, false);
  });

  valueInput.addEventListener('input', () => {
    applyValue(valueInput.value, true);
  });

  valueInput.addEventListener('blur', () => {
    valueInput.value = String(stateObj[name]);
  });

  wrap.append(row, input);
  getOrCreateGroup(info.group || 'Shape').appendChild(wrap);
}

function addTextureControls() {
  const textureGroup = getOrCreateGroup('Texture');

  const modeWrap = document.createElement('div');
  modeWrap.className = 'control';
  modeWrap.title = FIELD_INFO.texture_mode.description;

  const modeRow = document.createElement('div');
  modeRow.className = 'row';
  modeRow.innerHTML = `<span>${FIELD_INFO.texture_mode.label}</span><span></span>`;
  modeWrap.appendChild(modeRow);

  const modeSelect = document.createElement('select');
  for (const m of textureModes) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m === 'none' ? 'None' : (m[0].toUpperCase() + m.slice(1));
    modeSelect.appendChild(opt);
  }
  modeSelect.value = textureState.mode;
  modeSelect.addEventListener('change', () => {
    textureState.mode = modeSelect.value;
    showHelpFor('texture_mode');
    rebuildMeshes();
  });
  modeWrap.appendChild(modeSelect);
  textureGroup.appendChild(modeWrap);

  const fileWrap = document.createElement('div');
  fileWrap.className = 'control';
  fileWrap.title = FIELD_INFO.upload_texture.description;
  const fileHint = document.createElement('div');
  fileHint.className = 'row';
  fileHint.innerHTML = '<span>Upload Texture Image</span><span>PNG grayscale recommended</span>';
  fileWrap.appendChild(fileHint);

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.png,.jpg,.jpeg,.webp';
  fileInput.addEventListener('focus', () => showHelpFor('upload_texture'));
  fileInput.addEventListener('mouseenter', () => showHelpFor('upload_texture'));
  fileInput.addEventListener('change', () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    const objectUrl = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      const maxDim = 2048;
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
      c.width = Math.max(1, Math.round(img.width * scale));
      c.height = Math.max(1, Math.round(img.height * scale));
      const cctx = c.getContext('2d');
      cctx.imageSmoothingEnabled = true;
      cctx.imageSmoothingQuality = 'high';
      cctx.drawImage(img, 0, 0, c.width, c.height);
      const rgba = cctx.getImageData(0, 0, c.width, c.height).data;
      const lum = new Float32Array(c.width * c.height);
      for (let i = 0; i < lum.length; i++) {
        const r = rgba[i * 4 + 0], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2];
        lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255.0;
      }
      const smoothLum = blurFloatMap(lum, c.width, c.height, 1);
      uploadedTexture = { w: c.width, h: c.height, data: smoothLum };
      textureState.mode = 'upload';
      modeSelect.value = 'upload';
      rebuildMeshes();
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
    };

    img.src = objectUrl;
  });
  fileWrap.appendChild(fileInput);
  textureGroup.appendChild(fileWrap);

  addControl('depth', 0.0, 0.6, 0.01, textureState, (v) => {
    textureState.depth = Number(v);
    rebuildMeshes();
  });
  addControl('scaleU', 1.0, 16.0, 0.1, textureState, (v) => {
    textureState.scaleU = Number(v);
    rebuildMeshes();
  });
  addControl('scaleV', 1.0, 16.0, 0.1, textureState, (v) => {
    textureState.scaleV = Number(v);
    rebuildMeshes();
  });
}

function addBottomEngravingControls() {
  const group = getOrCreateGroup('Bottom Engraving');

  const fileWrap = document.createElement('div');
  fileWrap.className = 'control';
  fileWrap.title = FIELD_INFO.bottom_svg_upload.description;
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = '<span>Upload Bottom SVG</span><span></span>';
  fileWrap.appendChild(row);

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.svg,image/svg+xml';
  input.addEventListener('focus', () => showHelpFor('bottom_svg_upload'));
  input.addEventListener('mouseenter', () => showHelpFor('bottom_svg_upload'));
  input.addEventListener('change', async () => {
    const f = input.files && input.files[0];
    if (!f) return;
    try {
      await loadBottomSvgFile(f);
      showHelpFor('bottom_svg_upload');
    } catch (err) {
      alert(`Could not load SVG: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      input.value = '';
    }
  });
  fileWrap.appendChild(input);
  group.appendChild(fileWrap);

  addControl('bottom_svg_scale', 0.1, 1.6, 0.01, bottomSvgState, (v) => {
    bottomSvgState.bottom_svg_scale = Number(v);
    drawBottomViewer();
    rebuildMeshes();
  });
  addControl('bottom_svg_tx', -1.0, 1.0, 0.01, bottomSvgState, (v) => {
    bottomSvgState.bottom_svg_tx = Number(v);
    drawBottomViewer();
    rebuildMeshes();
  });
  addControl('bottom_svg_ty', -1.0, 1.0, 0.01, bottomSvgState, (v) => {
    bottomSvgState.bottom_svg_ty = Number(v);
    drawBottomViewer();
    rebuildMeshes();
  });
  addControl('bottom_svg_depth', 0.0, 4.0, 0.05, bottomSvgState, (v) => {
    bottomSvgState.bottom_svg_depth = Number(v);
    rebuildMeshes();
  });
}

const presetEl = document.getElementById('preset');
Object.keys(presets).forEach(name => {
  const option = document.createElement('option');
  option.value = name;
  option.textContent = name.split('_').join(' ');
  presetEl.appendChild(option);
});
presetEl.value = 'spiral_ribbed';

function reloadSliders() {
  const controls = document.getElementById('controls');
  controls.innerHTML = '';
  for (const groupName of GROUP_ORDER) getOrCreateGroup(groupName);

  viewSliders.forEach(([name, min, max, step]) => addControl(name, min, max, step, viewState, (v) => {
    viewState[name] = Number(v);
    scheduleDraw(dragging);
  }));

  resolutionSliders.forEach(([name, min, max, step]) => addControl(name, min, max, step, meshResolution, (v) => {
    meshResolution[name] = Math.max(8, Math.floor(Number(v)));
    rebuildMeshes();
  }));

  sliders.forEach(([name, min, max, step]) => addControl(name, min, max, step, params, (v) => {
    params[name] = (name === 'waves' || name === 'bubble_count' || name === 'rib_count') ? Number.parseInt(v, 10) : Number(v);
    rebuildMeshes();
  }));

  addTextureControls();
  addBottomEngravingControls();
  drawBottomViewer();
  showHelpFor('height');
}

function exportPresetFile() {
  const payload = {
    version: 1,
    preset_name: `${presetEl.value}_custom`,
    params,
    texture: { ...textureState },
    mesh_resolution: { ...meshResolution },
    view: { ...viewState },
    bottom_engraving: { ...bottomSvgState },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${payload.preset_name}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importPresetFromObject(data) {
  if (!data || typeof data !== 'object') throw new Error('Invalid preset JSON structure.');

  const incomingParams = data.params && typeof data.params === 'object' ? data.params : data;

  for (const [key, val] of Object.entries(incomingParams)) {
    if (Object.prototype.hasOwnProperty.call(params, key) && Number.isFinite(Number(val))) {
      params[key] = Number(val);
    }
  }

  if (data.texture && typeof data.texture === 'object') {
    if (typeof data.texture.mode === 'string' && textureModes.includes(data.texture.mode)) {
      textureState.mode = data.texture.mode;
    }
    for (const k of ['depth', 'scaleU', 'scaleV']) {
      if (Number.isFinite(Number(data.texture[k]))) textureState[k] = Number(data.texture[k]);
    }
  }

  if (data.mesh_resolution && typeof data.mesh_resolution === 'object') {
    for (const k of ['n_theta', 'n_z']) {
      if (Number.isFinite(Number(data.mesh_resolution[k]))) meshResolution[k] = Math.max(8, Math.floor(Number(data.mesh_resolution[k])));
    }
  }

  if (data.view && typeof data.view === 'object' && Number.isFinite(Number(data.view.zoom))) {
    viewState.zoom = Number(data.view.zoom);
  }

  if (data.bottom_engraving && typeof data.bottom_engraving === 'object') {
    for (const k of ['bottom_svg_scale', 'bottom_svg_tx', 'bottom_svg_ty', 'bottom_svg_depth']) {
      if (Number.isFinite(Number(data.bottom_engraving[k]))) bottomSvgState[k] = Number(data.bottom_engraving[k]);
    }
  }

  reloadSliders();
  rebuildMeshes();
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



document.getElementById('exportPresetBtn').addEventListener('click', () => {
  exportPresetFile();
});

const importPresetInput = document.getElementById('importPresetInput');
document.getElementById('importPresetBtn').addEventListener('click', () => {
  importPresetInput.click();
});

importPresetInput.addEventListener('change', async () => {
  const f = importPresetInput.files && importPresetInput.files[0];
  if (!f) return;
  try {
    const txt = await f.text();
    const parsed = JSON.parse(txt);
    importPresetFromObject(parsed);
  } catch (err) {
    alert(`Could not import preset: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    importPresetInput.value = '';
  }
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
drawBottomViewer();
