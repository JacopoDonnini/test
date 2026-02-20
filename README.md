# Parametric Vase Mesh Prototype

A lightweight Python CLI to generate mathematical vase meshes (Wavefront OBJ):
- open at top
- closed at bottom
- tunable profile, ribs, waves, twist, and lip flare

## Correct clone commands

If your branch is `codex/develop-vase-mesh-generator-software`, clone like this:

```bash
git clone -b codex/develop-vase-mesh-generator-software https://github.com/JacopoDonnini/test.git
```

or:

```bash
git clone https://github.com/JacopoDonnini/test.git
cd test
git checkout codex/develop-vase-mesh-generator-software
```

> `.../tree/<branch>` is a **web page URL**, not a Git repository URL.

## Quick start

```bash
python3 vasegen.py --list
python3 vasegen.py --preset all --out generated
```

## Surface model

Using cylindrical coordinates (`θ`, `z`), with normalized `z∈[0,1]`:

\[
r_0(z)=\text{mix}(R_{base},R_{neck},s(z)) + (R_{lip}-R_{neck})s_{lip}(z) + A_b\exp\left(-\left(\frac{z-z_b}{w_b}\right)^2\right)
\]

\[
r(\theta,z)=r_0(z)\left[1 + A_w E(z)\left(\cos(k\theta + \phi(z)) + S\sin(k_2\theta-0.7\phi(z))\right)\right]
\]

\[
\phi(z)=\phi_0 + Tz + Cz^2,\quad X=r\cos\theta,\;Y=r\sin\theta,\;Z=Hz
\]

Bottom faces are triangulated to close the mesh; top ring is left open.

## GUI (live sliders + real-time preview)

Run:

```bash
python3 run_gui.py
```

Then open: `http://127.0.0.1:8000/gui/`

Features:
- Real-time 3D preview while sliders move
- Preset selector
- Reset to preset
- Export current vase as OBJ from GUI

## Recreate sample outputs

```bash
python3 scripts/generate_examples.py
```

This writes OBJ examples and preset parameters to `generated/examples/`.

## Notes

Reference-to-preset matching and tuner guidance are in `FORMULA_NOTES.md`.
