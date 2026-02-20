#!/usr/bin/env python3
"""Serve the vase GUI locally and optionally open it in the default browser.

Works both in source mode and when bundled as a single executable (PyInstaller).
"""

from __future__ import annotations

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse
import os
import socket
import subprocess
import sys
import threading
import time
import webbrowser


def app_root() -> Path:
    # PyInstaller onefile extracts bundled files under sys._MEIPASS.
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent


def find_open_port(host: str, preferred: int) -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, preferred))
            return preferred
        except OSError:
            sock.bind((host, 0))
            return sock.getsockname()[1]


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Run local vase GUI server.")
    ap.add_argument("--host", default="127.0.0.1", help="Host interface to bind")
    ap.add_argument("--port", type=int, default=8000, help="Preferred port")
    ap.add_argument("--no-browser", action="store_true", help="Do not auto-open browser")
    return ap.parse_args()


def open_browser_best_effort(url: str) -> bool:
    """Try multiple mechanisms so Linux desktop launches are more reliable."""
    try:
        if webbrowser.open(url):
            return True
    except Exception:
        pass

    cmds: list[list[str]] = []
    if sys.platform.startswith("linux"):
        cmds.append(["xdg-open", url])
    elif sys.platform == "darwin":
        cmds.append(["open", url])
    elif sys.platform.startswith("win"):
        # os.startfile is often most reliable on Windows.
        try:
            os.startfile(url)  # type: ignore[attr-defined]
            return True
        except Exception:
            pass

    for cmd in cmds:
        try:
            subprocess.Popen(cmd)
            return True
        except Exception:
            continue
    return False


def main() -> None:
    args = parse_args()
    root = app_root()
    os.chdir(root)

    host = args.host
    port = find_open_port(host, args.port)

    server = ThreadingHTTPServer((host, port), SimpleHTTPRequestHandler)
    url = f"http://{host}:{port}/gui/"

    print(f"Serving GUI from: {root}")
    print(f"Open: {url}")

    if not args.no_browser:
        def open_with_retry() -> None:
            time.sleep(0.4)
            ok = open_browser_best_effort(url)
            if not ok:
                # keep visible hint for double-click launches
                print("Could not auto-open browser. Please open this URL manually:")
                print(url)

        threading.Thread(target=open_with_retry, daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Stopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
