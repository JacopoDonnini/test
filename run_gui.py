#!/usr/bin/env python3
"""Serve the vase GUI locally and optionally open it in the default browser.

Works both in source mode and when bundled as a single executable (PyInstaller).
"""

from __future__ import annotations

from functools import partial
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse
import logging
import os
import socket
import subprocess
import sys
import threading
import time
import urllib.request
import webbrowser


def app_root() -> Path:
    # PyInstaller onefile extracts bundled files under sys._MEIPASS.
    if getattr(sys, "frozen", False) and hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS)
    return Path(__file__).resolve().parent


def log_path() -> Path:
    base = Path.home() if Path.home().exists() else Path.cwd()
    return base / "VaseGeneratorApp.log"


def configure_logging() -> None:
    logging.basicConfig(
        filename=str(log_path()),
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )


def windows_message_box(title: str, message: str) -> None:
    if not sys.platform.startswith("win"):
        return
    try:
        import ctypes

        ctypes.windll.user32.MessageBoxW(None, message, title, 0x10)
    except Exception:
        pass


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
    """Try multiple mechanisms so Linux/Windows desktop launches are more reliable."""
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


def wait_until_serving(url: str, timeout_s: float = 8.0) -> bool:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(url, timeout=1.5) as r:
                if r.status in (200, 301, 302, 404):
                    return True
        except Exception:
            time.sleep(0.2)
    return False


def main() -> None:
    configure_logging()
    args = parse_args()
    root = app_root()

    host = args.host
    port = find_open_port(host, args.port)
    url = f"http://{host}:{port}/gui/"

    handler = partial(SimpleHTTPRequestHandler, directory=str(root))

    try:
        server = ThreadingHTTPServer((host, port), handler)
    except Exception as exc:
        msg = f"Failed to start local server: {exc}\nLog: {log_path()}"
        logging.exception("Server startup failed")
        windows_message_box("VaseGeneratorApp startup error", msg)
        raise

    logging.info("Serving GUI from: %s", root)
    logging.info("Open: %s", url)
    print(f"Serving GUI from: {root}")
    print(f"Open: {url}")

    if not args.no_browser:

        def open_with_retry() -> None:
            ready = wait_until_serving(url)
            if not ready:
                logging.error("Server did not become ready in time: %s", url)
                return
            ok = open_browser_best_effort(url)
            if not ok:
                logging.error("Could not auto-open browser. URL: %s", url)

        threading.Thread(target=open_with_retry, daemon=True).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("Stopping server...")
    except Exception:
        logging.exception("Unhandled server error")
        windows_message_box(
            "VaseGeneratorApp runtime error",
            f"The local web server crashed.\nSee log: {log_path()}",
        )
        raise
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
