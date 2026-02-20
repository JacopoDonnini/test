#!/usr/bin/env python3
"""Package built executable in dist/ into OS-appropriate archive.

- Windows: zip with exe
- Linux/macOS: tar.gz with executable + helper launch script
"""

from __future__ import annotations

import argparse
from pathlib import Path
import tarfile
import tempfile
import zipfile


UNIX_LAUNCHER = """#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$HERE/VaseGeneratorApp"
if [[ ! -x "$APP" ]]; then
  chmod +x "$APP" || true
fi
"$APP"
"""

UNIX_README = """VaseGeneratorApp (Linux/macOS)

If double-clicking the binary does nothing, run the helper script:
  ./run-vase-generator.sh

This script starts the local server and attempts to open your browser.
"""


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("--runner-os", required=True, help="Value of RUNNER_OS (Linux/Windows/macOS)")
    return ap.parse_args()


def package_zip(target: Path, out: Path) -> None:
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(target, arcname=target.name)


def package_targz(target: Path, out: Path) -> None:
    with tempfile.TemporaryDirectory() as td:
        tmp = Path(td)
        app = tmp / "VaseGeneratorApp"
        app.write_bytes(target.read_bytes())
        app.chmod(0o755)

        launcher = tmp / "run-vase-generator.sh"
        launcher.write_text(UNIX_LAUNCHER, encoding="utf-8")
        launcher.chmod(0o755)

        readme = tmp / "README-Linux-macOS.txt"
        readme.write_text(UNIX_README, encoding="utf-8")

        with tarfile.open(out, "w:gz") as tf:
            tf.add(app, arcname=app.name)
            tf.add(launcher, arcname=launcher.name)
            tf.add(readme, arcname=readme.name)


def main() -> None:
    args = parse_args()
    dist = Path("dist")
    package = Path("package")
    package.mkdir(exist_ok=True)

    exe = dist / "VaseGeneratorApp.exe"
    unix_bin = dist / "VaseGeneratorApp"

    runner = args.runner_os.strip().lower()
    if runner == "windows":
        target = exe
        out = package / "VaseGeneratorApp-windows-latest.zip"
        pack = package_zip
    elif runner == "linux":
        target = unix_bin
        out = package / "VaseGeneratorApp-ubuntu-22.04.tar.gz"
        pack = package_targz
    elif runner == "macos":
        target = unix_bin
        out = package / "VaseGeneratorApp-macos-latest.tar.gz"
        pack = package_targz
    else:
        raise SystemExit(f"Unsupported runner OS: {args.runner_os}")

    if not target.exists():
        raise SystemExit(f"Expected executable not found: {target}")

    pack(target, out)
    print(f"Created {out}")


if __name__ == "__main__":
    main()
