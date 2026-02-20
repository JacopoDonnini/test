#!/usr/bin/env python3
"""Build a single-file executable for the GUI launcher using PyInstaller.

Usage:
  python3 scripts/build_executable.py
"""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> None:
    pyinstaller = shutil.which("pyinstaller")
    if not pyinstaller:
        raise SystemExit(
            "PyInstaller not found. Install it with: python3 -m pip install pyinstaller"
        )

    sep = ";" if sys.platform.startswith("win") else ":"
    add_data = f"{ROOT / 'gui'}{sep}gui"

    cmd = [
        pyinstaller,
        "--noconfirm",
        "--clean",
        "--onefile",
        "--windowed",
        "--name",
        "VaseGeneratorApp",
        "--add-data",
        add_data,
        str(ROOT / "run_gui.py"),
    ]
    print("Running:", " ".join(map(str, cmd)))
    subprocess.run(cmd, cwd=ROOT, check=True)

    dist = ROOT / "dist" / (
        "VaseGeneratorApp.exe" if sys.platform.startswith("win") else "VaseGeneratorApp"
    )
    print(f"Build complete: {dist}")


if __name__ == "__main__":
    main()
