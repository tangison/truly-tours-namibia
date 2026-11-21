#!/usr/bin/env python3
"""Optimize all site images: resize to max 1600px, convert heavy PNG/JPEG to WebP."""
import os, subprocess, sys
from PIL import Image

SRC = '/home/z/my-project/public/images'
files = sorted(os.listdir(SRC))
print(f"processing {len(files)} files")

total_before = total_after = 0
for f in files:
    path = os.path.join(SRC, f)
    base, ext = os.path.splitext(f)
    if ext.lower() not in ('.png', '.jpg', '.jpeg'):
        continue
    sz = os.path.getsize(path)
    total_before += sz
    try:
        im = Image.open(path)
        # handle transparency for PNG
        has_alpha = im.mode in ('RGBA', 'LA', 'P')
        if has_alpha:
            im = im.convert('RGBA')
        else:
            im = im.convert('RGB')
        w, h = im.size
        if max(w, h) > 1600:
            ratio = 1600 / max(w, h)
            im = im.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
        webp = os.path.join(SRC, base + '.webp')
        im.save(webp, 'WEBP', quality=82, method=6)
        wsz = os.path.getsize(webp)
        # keep webp only if it's meaningfully smaller
        if wsz < sz * 0.85:
            total_after += wsz
            os.remove(path)
            print(f"  {f}: {sz//1024}KB -> {wsz//1024}KB webp {im.size}")
        else:
            # keep original but re-save optimized
            if ext.lower() == '.png' and not has_alpha:
                im.save(path, 'PNG', optimize=True)
            elif ext.lower() in ('.jpg', '.jpeg'):
                im.save(path, 'JPEG', quality=85, optimize=True)
            total_after += os.path.getsize(path)
            os.remove(webp)
    except Exception as e:
        print(f"  FAIL {f}: {e}")
        total_after += sz

print(f"TOTAL: {total_before//1024//1024}MB -> {total_after//1024//1024}MB")
