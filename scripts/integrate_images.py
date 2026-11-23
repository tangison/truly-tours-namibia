#!/usr/bin/env python3
"""Copy winning sourced images into public/images (optimized WebP), delete duplicate files."""
import os, shutil
from PIL import Image

DL = '/tmp/is/dl'
OUT = '/home/z/my-project/public/images'

PICKS = [
    ('/tmp/is/dl/canyon-2.jpeg',  'fish-river-canyon.webp', 'Canyon'),
    ('/tmp/is/dl/kolm-1.jpg',     'kolmanskop.webp',        'Kolmanskop'),
    ('/tmp/is/dl/aerial-1.jpg',   'dunes-aerial.webp',      'Aerial'),
    ('/tmp/is/dl/balloon-1.jpg',  'balloon-namib.webp',     'Balloon'),
    ('/tmp/is/dl/quiver-2.jpg',   'quiver-trees.webp',      'Quiver'),
    ('/tmp/is/dl/etosha-1.jpg',   'etosha-sunset.webp',     'Etosha sunset'),
]
DUPES = ['asset-2-1fa984.webp',
         'whatsapp-image-2025-08-26-at-19.53.17-1.webp',
         'whatsapp-image-2025-08-26-at-19.53.27-1.webp',
         'whatsapp-image-2025-08-26-at-19.53.30-1.webp']

for src, name, label in PICKS:
    im = Image.open(src).convert('RGB')
    w, h = im.size
    if max(w, h) > 1600:
        r = 1600 / max(w, h)
        im = im.resize((int(w * r), int(h * r)), Image.LANCZOS)
    dest = os.path.join(OUT, name)
    im.save(dest, 'WEBP', quality=82, method=6)
    print(f'{label:14} {name:24} {im.size} {os.path.getsize(dest)//1024}KB')

for d in DUPES:
    p = os.path.join(OUT, d)
    if os.path.exists(p):
        os.remove(p)
        print('deleted dup:', d)
print('total images now:', len([f for f in os.listdir(OUT) if os.path.isfile(os.path.join(OUT, f))]))
