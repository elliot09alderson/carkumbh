#!/usr/bin/env python3
"""Generate ZX Event app icons — minimalist black ZX on white."""
from PIL import Image, ImageDraw, ImageFont
import os, sys

ASSETS = os.path.join(os.path.dirname(__file__), "assets")

def draw_zx(draw, cx, cy, size, fg="#111111", weight_z=1, weight_x=3):
    """Draw a geometric ZX mark — no font needed."""
    s = size * 0.52   # half-span of the mark
    t = size * 0.07   # stroke thickness
    gap = size * 0.04 # gap between Z and X

    # — Z glyph (left) —
    # three horizontal bars connected by diagonals
    zl = cx - s - gap / 2
    zr = cx - gap / 2
    zt = cy - s
    zb = cy + s
    bar = t

    # top bar
    draw.rectangle([zl, zt, zr, zt + bar], fill=fg)
    # bottom bar
    draw.rectangle([zl, zb - bar, zr, zb], fill=fg)
    # diagonal (top-right to bottom-left)
    # approximate with a polygon
    draw.polygon([
        (zr, zt + bar),
        (zr - bar * 0.6, zt + bar),
        (zl, zb - bar),
        (zl + bar * 0.6, zb - bar),
    ], fill=fg)

    # — X glyph (right, bolder) —
    xl = cx + gap / 2
    xr = cx + s + gap / 2
    xt = cy - s
    xb = cy + s
    tb = t * weight_x / weight_z   # thicker stroke

    # diagonal top-left → bottom-right
    draw.polygon([
        (xl,        xt),
        (xl + tb,   xt),
        (xr,        xb - tb),
        (xr - tb,   xb),
    ], fill=fg)
    # diagonal top-right → bottom-left
    draw.polygon([
        (xr - tb,   xt),
        (xr,        xt),
        (xl + tb,   xb),
        (xl,        xb),
    ], fill=fg)


def make_icon(path, size, bg="#ffffff", fg="#111111", padding_ratio=0.18):
    img = Image.new("RGBA", (size, size), bg)
    draw = ImageDraw.Draw(img)
    inner = size * (1 - padding_ratio * 2)
    draw_zx(draw, size / 2, size / 2, inner / 2, fg=fg)
    img.save(path)
    print(f"  wrote {path}  ({size}x{size})")


def make_adaptive_fg(path, size, fg="#111111", padding_ratio=0.22):
    """Foreground layer — white fill, transparent background (Android adaptive)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    inner = size * (1 - padding_ratio * 2)
    draw_zx(draw, size / 2, size / 2, inner / 2, fg=fg)
    img.save(path)
    print(f"  wrote {path}  ({size}x{size})")


print("Generating ZX Event icons…")
make_icon(f"{ASSETS}/icon.png",         1024)
make_icon(f"{ASSETS}/splash-icon.png",  1024)
make_icon(f"{ASSETS}/favicon.png",       48, bg="#ffffff")
make_adaptive_fg(f"{ASSETS}/adaptive-icon.png", 1024, fg="#111111")
print("Done.")
