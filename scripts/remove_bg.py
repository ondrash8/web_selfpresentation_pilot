#!/usr/bin/env python3
"""Flood-fill background removal from image corners.
Uses a FIXED reference background color (sampled from the 4 corners),
then flood-fills border-connected pixels matching that fixed color within
a tolerance. This avoids color-drift bleeding into the logo artwork that
a neighbor-to-neighbor chained comparison would risk on JPEG gradients.
"""
import sys
from collections import deque
from PIL import Image

def remove_bg(src_path, dst_path, tol=30):
    img = Image.open(src_path).convert("RGBA")
    w, h = img.size
    px = img.load()

    corners = [px[0, 0], px[w-1, 0], px[0, h-1], px[w-1, h-1]]
    ref = tuple(sum(c[i] for c in corners) // 4 for i in range(3))

    def close(c):
        return all(abs(c[i] - ref[i]) <= tol for i in range(3))

    visited = bytearray(w * h)
    def idx(x, y):
        return y * w + x

    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not visited[idx(x, y)]:
                visited[idx(x, y)] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not visited[idx(x, y)]:
                visited[idx(x, y)] = 1
                q.append((x, y))

    removed = 0
    while q:
        x, y = q.popleft()
        r, g, b, a = px[x, y]
        if not close((r, g, b)):
            continue
        px[x, y] = (r, g, b, 0)
        removed += 1
        for nx, ny in ((x+1,y),(x-1,y),(x,y+1),(x,y-1)):
            if 0 <= nx < w and 0 <= ny < h and not visited[idx(nx, ny)]:
                visited[idx(nx, ny)] = 1
                nr, ng, nb, na = px[nx, ny]
                if close((nr, ng, nb)):
                    q.append((nx, ny))

    img.save(dst_path, "PNG")
    print(f"{src_path} -> {dst_path} ref={ref} tol={tol} removed={removed}px")

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    tol = int(sys.argv[3]) if len(sys.argv) > 3 else 30
    remove_bg(src, dst, tol)
