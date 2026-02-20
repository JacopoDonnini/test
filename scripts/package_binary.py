#!/usr/bin/env python3
"""Package built executable in dist/ into OS-appropriate archive.

- Windows: zip
- Linux/macOS: tar.gz (preserves executable permissions)
"""

from __future__ import annotations

import argparse
from pathlib import Path
import tarfile
import zipfile


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("--runner-os", required=True, help="Value of RUNNER_OS (Linux/Windows/macOS)")
    return ap.parse_args()


def package_zip(target: Path, out: Path) -> None:
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(target, arcname=target.name)


def package_targz(target: Path, out: Path) -> None:
    with tarfile.open(out, "w:gz") as tf:
        tf.add(target, arcname=target.name)


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
        out = package / "VaseGeneratorApp-ubuntu-latest.tar.gz"
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
