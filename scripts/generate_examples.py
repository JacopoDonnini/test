#!/usr/bin/env python3
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "generated" / "examples"

cmd = [
    "python3",
    str(ROOT / "vasegen.py"),
    "--preset",
    "all",
    "--out",
    str(OUT),
    "--theta",
    "96",
    "--z",
    "128",
]
print("Running:", " ".join(cmd))
subprocess.run(cmd, check=True)
print(f"Done. Files in {OUT}")
