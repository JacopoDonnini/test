# Parametric Vase Mesh Prototype

This prototype generates 3D mesh objects (`.obj`) for mathematically defined vases:
- **Open at top**
- **Closed at bottom**
- **Controllable by tunable parameters** for geometric, ribbed, twisted, and soft organic styles.

## Quick start

```bash
python3 vasegen.py --list
python3 vasegen.py --preset all --out generated
```

Outputs are written as Wavefront OBJ files in `generated/`.

## Surface model

We use cylindrical coordinates with angle `θ ∈ [0, 2π)` and normalized height `z ∈ [0,1]`.

- Base radius profile:

\[
r_0(z)=\text{mix}(R_{base},R_{neck},s(z)) + (R_{lip}-R_{neck})s_{lip}(z) + A_b\exp\left(-\left(\frac{z-z_b}{w_b}\right)^2\right)
\]

- Modulated radius (ribs/waves/twist):

\[
r(\theta,z)=r_0(z)\left[1 + A_w E(z)\left(\cos(k\theta + \phi(z)) + S\sin(k_2\theta-0.7\phi(z))\right)\right]
\]

with
\[
\phi(z)=\phi_0 + Tz + Cz^2
\]

- Final surface:

\[
X=r\cos\theta,\; Y=r\sin\theta,\; Z=Hz
\]

The bottom cap is triangulated to ensure watertight closure at `z=0`, while the top is intentionally left open.

## Matching to your reference images

`FORMULA_NOTES.md` maps presets to the styles in your attached photos and explains why each formula family fits.

## Useful commands

```bash
# Generate one style
python3 vasegen.py --preset spiral_ribbed --out generated

# Increase quality
python3 vasegen.py --preset tall_twist --theta 240 --z 300 --out generated_hi
```
