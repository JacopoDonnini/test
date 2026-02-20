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
        threading.Thread(target=lambda: (time.sleep(0.4), webbrowser.open(url)), daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Stopping server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
