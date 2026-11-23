#!/usr/bin/env python3
"""Audit all site images: usage, dimensions, weight, exposure, blur, duplicates."""
import os, re, hashlib
from PIL import Image, ImageStat, ImageFilter

ROOT = '/home/z/my-project'
IMG_DIR = f'{ROOT}/public/images'
SRC_FILES = [f'{ROOT}/src/app/page.tsx', f'{ROOT}/src/lib/site.ts', f'{ROOT}/src/app/layout.tsx']

# 1. which images are referenced in the source
used = set()
for f in SRC_FILES:
    with open(f) as fh:
        used.update(re.findall(r'/images/([A-Za-z0-9._-]+)', fh.read()))

files = sorted(os.listdir(IMG_DIR))
report = {'used': [], 'unused': []}
hashes = {}
dupes = []

for f in files:
    p = os.path.join(IMG_DIR, f)
    if not os.path.isfile(p):
        continue
    key = f in used
    try:
        im = Image.open(p).convert('RGB')
        w, h = im.size
        small = im.resize((64, 64))
        stat = ImageStat.Stat(small)
        brightness = sum(stat.mean) / 3
        # blur: stddev of Laplacian edge filter (low = blurry)
        lap = small.convert('L').filter(ImageFilter.FIND_EDGES)
        sharpness = ImageStat.Stat(lap).stddev[0]
        dhash = hashlib.md5(small.tobytes()).hexdigest()
        if dhash in hashes:
            dupes.append((f, hashes[dhash]))
        else:
            hashes[dhash] = f
        entry = dict(name=f, kb=os.path.getsize(p)//1024, dim=f'{w}x{h}',
                     bright=round(brightness), sharp=round(sharpness))
        (report['used'] if key else report['unused']).append(entry)
    except Exception as e:
        print('ERR', f, e)

print(f"USED ({len(report['used'])}):")
for e in sorted(report['used'], key=lambda x: x['sharp']):
    flag = []
    if e['sharp'] < 14: flag.append('BLURRY?')
    if e['bright'] < 55: flag.append('DARK')
    if e['bright'] > 200: flag.append('WASHED')
    print(f"  {e['name']:44} {e['dim']:10} {e['kb']:>4}KB bright={e['bright']:>3} sharp={e['sharp']:>3} {' '.join(flag)}")
print(f"\nUNUSED ({len(report['unused'])}):")
for e in sorted(report['unused'], key=lambda x: -x['kb']):
    print(f"  {e['name']:44} {e['dim']:10} {e['kb']:>5}KB bright={e['bright']:>3} sharp={e['sharp']:>3}")
print(f"\nDUPLICATE PAIRS: {dupes}")
