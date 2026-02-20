#!/usr/bin/env python3
"""Serve the GUI locally at http://127.0.0.1:8000/gui/."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import os

ROOT = Path(__file__).resolve().parent
os.chdir(ROOT)

server = ThreadingHTTPServer(("127.0.0.1", 8000), SimpleHTTPRequestHandler)
print("Serving GUI on http://127.0.0.1:8000/gui/")
try:
    server.serve_forever()
except KeyboardInterrupt:
    print("Stopping server...")
