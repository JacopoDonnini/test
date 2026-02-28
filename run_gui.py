#!/usr/bin/env python3
"""Launch the vase GUI locally.

Default behavior (most reliable for desktop users):
- opens gui/index.html directly as a file:// URL (no localhost server needed)

Optional behavior:
- --serve : runs local HTTP server and opens http://127.0.0.1:<port>/gui/

Packaged executable note:
- when running as a PyInstaller one-file executable, file:// mode is not stable because
  the temporary extraction folder is cleaned up on process exit. In that case we default
  to --serve behavior unless explicitly overridden.
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


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser(description="Run local vase GUI launcher.")
    ap.add_argument("--host", default="127.0.0.1", help="Host interface to bind (serve mode)")
    ap.add_argument("--port", type=int, default=8000, help="Preferred port (serve mode)")
    ap.add_argument("--no-browser", action="store_true", help="Do not auto-open browser")
    ap.add_argument("--serve", action="store_true", help="Use local HTTP server instead of file:// launch")
    ap.add_argument("--file", action="store_true", help="Force file:// launch mode")
    return ap.parse_args()


def open_browser_best_effort(url: str) -> bool:
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


def find_open_port(host: str, preferred: int) -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind((host, preferred))
            return preferred
        except OSError:
            sock.bind((host, 0))
            return sock.getsockname()[1]


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


def launch_file_mode(root: Path, no_browser: bool) -> None:
    index = root / "gui" / "index.html"
    if not index.exists():
        msg = f"GUI file not found: {index}\nLog: {log_path()}"
        logging.error(msg)
        windows_message_box("VaseGeneratorApp startup error", msg)
        raise FileNotFoundError(msg)

    url = index.resolve().as_uri()
    logging.info("Opening file mode URL: %s", url)
    print(f"Open: {url}")

    if not no_browser:
        ok = open_browser_best_effort(url)
        if not ok:
            msg = f"Could not auto-open browser. Open this file manually:\n{index}"
            logging.error(msg)
            windows_message_box("VaseGeneratorApp browser error", msg)


def launch_server_mode(root: Path, host: str, port_pref: int, no_browser: bool) -> None:
    port = find_open_port(host, port_pref)
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

    if not no_browser:
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
    finally:
        server.server_close()


def launch_with_fallbacks(root: Path, args: argparse.Namespace) -> None:
    frozen = bool(getattr(sys, "frozen", False))

    # User explicit mode choice should be respected as first attempt.
    if args.file and not args.serve:
        try:
            launch_file_mode(root, args.no_browser)
            return
        except Exception:
            logging.exception("File mode failed; falling back to server mode")
            print("File mode failed, falling back to local server mode...")
            launch_server_mode(root, args.host, args.port, args.no_browser)
            return

    if args.serve:
        try:
            launch_server_mode(root, args.host, args.port, args.no_browser)
            return
        except Exception:
            logging.exception("Server mode failed; falling back to file mode")
            print("Server mode failed, falling back to file mode...")
            launch_file_mode(root, args.no_browser)
            return

    # Default mode: frozen builds prefer server mode, source runs prefer file mode.
    if frozen:
        logging.info("Frozen executable detected: defaulting to local server mode for stable asset loading")
        print("Frozen executable detected: using local server mode for reliable asset loading.")
        try:
            launch_server_mode(root, args.host, args.port, args.no_browser)
            return
        except Exception:
            logging.exception("Frozen server mode failed; trying file mode")
            print("Server mode failed, trying file mode...")
            launch_file_mode(root, args.no_browser)
            return

    try:
        launch_file_mode(root, args.no_browser)
    except Exception:
        logging.exception("File mode failed in source run; trying server mode")
        print("File mode failed, trying local server mode...")
        launch_server_mode(root, args.host, args.port, args.no_browser)


def main() -> None:
    configure_logging()
    args = parse_args()
    root = app_root()
    launch_with_fallbacks(root, args)


if __name__ == "__main__":
    main()
