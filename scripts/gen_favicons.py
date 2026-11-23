#!/usr/bin/env python3
"""Favicon suite derived from brand tokens: TT monogram (Schibsted Grotesk
letterforms, brand ink on paper ground, accent bar) -> svg, ico, apple-touch."""
import os, subprocess
from PIL import Image, ImageDraw, ImageFont

OUT = '/home/z/my-project/public'

SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#f4efe8"/>
  <rect width="64" height="8" rx="4" fill="#c05a15"/>
  <text x="32" y="52" font-family="Schibsted Grotesk, Arial, sans-serif" font-size="34"
        font-weight="700" letter-spacing="-2" text-anchor="middle" fill="#33291c">TT</text>
</svg>'''

with open(f'{OUT}/favicon.svg', 'w') as f:
    f.write(SVG)

def render(size):
    im = Image.new('RGB', (size, size), '#f4efe8')
    d = ImageDraw.Draw(im)
    bar = max(4, size // 8)
    d.rounded_rectangle([0, 0, size, size], radius=size // 5, fill='#f4efe8')
    d.rounded_rectangle([0, 0, size, bar], radius=size // 10, fill='#c05a15')
    try:
        font = ImageFont.truetype(
            '/usr/share/fonts/truetype/english/SchibstedGrotesk-Bold.ttf', int(size * 0.55))
    except Exception:
        for cand in ('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
                     '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'):
            if os.path.exists(cand):
                font = ImageFont.truetype(cand, int(size * 0.55))
                break
        else:
            font = ImageFont.load_default()
    bb = d.textbbox((0, 0), 'TT', font=font)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    d.text(((size - w) / 2 - bb[0], (size + bar) / 2 + (size - bar - h) / 2.2 - bb[1]),
           'TT', font=font, fill='#33291c')
    return im

apple = render(180)
apple.save(f'{OUT}/apple-touch-icon.png', optimize=True)
ico = render(48)
ico.save(f'{OUT}/favicon.ico', sizes=[(16, 16), (48, 48)])

MANIFEST = '''{
  "name": "Truly Tours Namibia",
  "short_name": "Truly Tours",
  "icons": [
    { "src": "/apple-touch-icon.png", "sizes": "180x180", "type": "image/png" },
    { "src": "/favicon.svg", "sizes": "any", "type": "image/svg+xml" }
  ],
  "theme_color": "#f4efe8",
  "background_color": "#f4efe8",
  "start_url": "/",
  "display": "browser"
}'''
with open(f'{OUT}/site.webmanifest', 'w') as f:
    f.write(MANIFEST)

for f in ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest']:
    p = f'{OUT}/{f}'
    print(f, os.path.getsize(p), 'bytes')
