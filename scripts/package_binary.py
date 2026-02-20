#!/usr/bin/env python3
"""Package built executable in dist/ into a zip with OS-specific name."""

from __future__ import annotations

import argparse
from pathlib import Path
import zipfile


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("--runner-os", required=True, help="Value of RUNNER_OS (Linux/Windows/macOS)")
    return ap.parse_args()


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
        name = "VaseGeneratorApp-windows-latest.zip"
    elif runner == "linux":
        target = unix_bin
        name = "VaseGeneratorApp-ubuntu-latest.zip"
    elif runner == "macos":
        target = unix_bin
        name = "VaseGeneratorApp-macos-latest.zip"
    else:
        raise SystemExit(f"Unsupported runner OS: {args.runner_os}")

    if not target.exists():
        raise SystemExit(f"Expected executable not found: {target}")

    out = package / name
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(target, arcname=target.name)
    print(f"Created {out}")


if __name__ == "__main__":
    main()
