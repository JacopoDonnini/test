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

From source checkout, this opens the GUI directly via `file://.../gui/index.html` (no localhost server needed).

When running the packaged PyInstaller executable, it automatically uses localhost server mode to avoid missing-file issues in one-file extraction mode.

If the preferred mode fails at startup, the launcher now automatically falls back to the other mode (server ↔ file) as a fail-safe.

If you explicitly want localhost mode:

```bash
python3 run_gui.py --serve
```

Then open: `http://127.0.0.1:8000/gui/`

Features:
- Real-time 3D preview while sliders move (no external CDN dependencies)
- Preset selector
- Reset to preset
- Export current vase as OBJ from GUI
- Mesh resolution controls (`n_theta`, `n_z`) to increase triangle count and smoothness (`n_theta` now supports very high values for near-smooth silhouettes)
- Zoom control (slider + mouse wheel) with auto-fit so tall vases stay in frame
- Improved two-sided lighting so inside surfaces render correctly
- Expanded wave-related tuner ranges (`waves`, `wave_amp`, `wave_z_falloff`, `skew_wave`, `seed_phase`) for more extreme styles
- Wave dampener (`wave_roundness`) to smooth/round harsh wave peaks and edges
- Adaptive preview rendering for high resolutions (interactive decimation + full-res export) to keep interaction smooth
- Friendly grouped controls (View, Resolution, Shape, Borders, Waves, Flow, Texture) with readable labels
- Live parameter help card (hover/focus controls for plain-language explanations)
- Preset JSON import/export buttons in the GUI sidebar

Texture from uploaded image (best results):
- Prefer **PNG grayscale** (8-bit) for predictable carving depth.
- Use higher-resolution textures (e.g. 1024×1024 to 2048×2048). The GUI now preserves more source detail and uses smoother sampling.
- Use **seamless/tileable** textures if you set high `scaleU`/`scaleV`, otherwise a seam can appear where wrapping occurs.
- In the GUI, choose `texture_mode = upload`, then set:
  - `depth` for carving strength
  - `scaleU` for horizontal repetition around the vase
  - `scaleV` for vertical repetition along height
- Very noisy images can look rough when depth is high; reduce `depth` first, then tune scale.

New border controls:
- `bottom_border` (mm): keeps the bottom section straight as a cylinder at `base_radius`.
- `top_border` (mm): keeps the top lip section straight as a cylinder at `lip_radius`.
- `top_transition` (mm): smoothing band height below `top_border` to blend waves into the straight lip (set `0` for a sharp transition).
- Example: setting both to `2.0` keeps the first 2 mm from the bottom and top cylindrical (waves/texture are not applied in those border zones).


Preset import/export:
- Click **Export preset** to save the current setup as JSON (shape params + texture settings + resolution + zoom).
- Click **Import preset** to load a previously exported JSON and restore those values in the GUI.
- Imported presets do not embed uploaded image pixels; if texture mode is `upload`, re-select the image file after import if needed.

## Single executable build (for sharing)

Good news: this does **not** require a big code change.

You can package the current app into one double-clickable executable with PyInstaller:

```bash
python3 -m pip install pyinstaller
python3 scripts/build_executable.py
```

Output:
- Windows: `dist/VaseGeneratorApp.exe`
- Linux/macOS: `dist/VaseGeneratorApp`

What happens when users double-click it:
- local server starts
- browser opens automatically at the GUI
- no manual terminal command needed

Where to run from:
- Windows `.exe`: anywhere after extracting the `.zip` (single file).
- Linux/macOS `.tar.gz`: first extract the archive, then run `./VaseGeneratorApp` (or `./run-vase-generator.sh`) from the extracted folder.

Tip: build on the same OS you plan to distribute to (Windows builds Windows `.exe`, etc.).

### Prebuilt binaries for Windows/macOS/Linux

Yes — the right way is to build one executable per OS and publish them as release artifacts.

This repository now includes GitHub Actions workflow:
- `.github/workflows/build-binaries.yml`

How to use:
1. Push a tag like `v1.0.0`
2. GitHub Actions builds binaries on:
   - `ubuntu-22.04` → Linux binary archive
   - `windows-latest` → Windows `.exe` zip
   - `macos-latest` → macOS binary zip
3. Each OS build job publishes its archive directly into the GitHub Release **Assets** section (`.zip` for Windows, `.tar.gz` for Linux/macOS to preserve executable permissions).

Important:
- The two default files named **Source code (zip)** and **Source code (tar.gz)** are automatically generated by GitHub and are **not** executables.
- Download the files in **Assets** named like `VaseGeneratorApp-*.zip`.

> Note: cross-building all three from one machine is unreliable with PyInstaller. Native-per-OS CI is the robust approach.

Troubleshooting if you only see source archives:
- GitHub always shows **Source code (zip/tar.gz)**; those are not app binaries.
- Wait for the **Build executables** workflow to finish successfully.
- Open the release and look under **Assets** for:
  - `VaseGeneratorApp-windows-latest.zip`
  - `VaseGeneratorApp-macos-latest.tar.gz`
  - `VaseGeneratorApp-ubuntu-22.04.tar.gz`
- If missing, check the Actions run logs for failures in build/package/publish steps.
- If the workflow fails on all three OSes, verify the tag exists and the manual run `tag` input is set (for `workflow_dispatch`).
- You can run the workflow manually (Actions → Build executables → Run workflow) **without any tag** to just generate downloadable Actions artifacts.
- If you want files attached to a GitHub Release, run manually with the `tag` input filled (existing `v*` tag).
- Linux/macOS archives are `.tar.gz` intentionally so executable permissions are preserved after extraction.
- For Linux/macOS assets, if double-clicking the binary does nothing, use `run-vase-generator.sh` included in the archive.
- On Windows, if browser showed `ERR_EMPTY_RESPONSE`, use the latest build: packaged executables now default to localhost server mode for more reliable asset loading.
- If using `--serve` and it fails, check `VaseGeneratorApp.log` in your home folder for startup/runtime errors.
- Linux builds are produced on `ubuntu-22.04` to avoid the `GLIBC_2.38 not found` issue from newer runners.

### Windows-only emergency build (manual, independent)

If you urgently need only the Windows app, use workflow:
- `.github/workflows/build-windows-exe.yml`

How to run:
1. Go to **Actions → Build Windows executable → Run workflow**
2. Leave `tag` empty to just get the `.zip` from Actions artifacts
3. Or set `tag` (existing release tag) to also attach it to Release assets

This path is independent from Linux/macOS and cannot be blocked by their failures.

## Recreate sample outputs

```bash
python3 scripts/generate_examples.py
```

This writes OBJ examples and preset parameters to `generated/examples/`.

## Notes

Reference-to-preset matching and tuner guidance are in `FORMULA_NOTES.md`.
