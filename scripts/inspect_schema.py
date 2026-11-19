#!/usr/bin/env python3
"""Inspect JSON-LD schema + headings + technical proxies across fetched pages."""
import glob, json, os, re

os.chdir('/home/z/my-project/audit_data')

print("=== JSON-LD BLOCKS (what schema types exist) ===")
seen_types = {}
for f in sorted(glob.glob('page_*.html')) + ['home.html']:
    with open(f, encoding='utf-8', errors='ignore') as fh:
        t = fh.read()
    blocks = re.findall(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', t, re.S)
    types = []
    for b in blocks:
        try:
            d = json.loads(b)
            items = d.get('@graph', [d]) if isinstance(d, dict) else d
            for it in items if isinstance(items, list) else [items]:
                if isinstance(it, dict) and it.get('@type'):
                    types.append(str(it.get('@type')))
        except Exception:
            types.append('PARSE_FAIL')
    seen_types[f] = types
    print(f"  {f:45} -> {types}")

print("\n=== HEADINGS ON A TOUR PAGE (/kalahari/) ===")
with open('page_kalahari.html', encoding='utf-8', errors='ignore') as fh:
    t = fh.read()
body = re.sub(r'<script.*?</script>|<style.*?</style>', '', t, flags=re.S)
hs = re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>', body, re.I | re.S)
for tag, txt in hs[:25]:
    txt = re.sub(r'<[^>]+>', '', txt).strip()
    if txt:
        print(f"  {tag.upper()}: {txt[:90]}")

print("\n=== TECHNICAL: www/http redirects + 404 handling ===")

print("\n=== INTERNAL LINKS ON HOMEPAGE (sample) ===")
with open('home.html', encoding='utf-8', errors='ignore') as fh:
    h = fh.read()
links = re.findall(r'<a[^>]*href="(https://trulytoursnamibia\.com[^"]*)"', h)
from collections import Counter
c = Counter(links)
for url, n in c.most_common(20):
    print(f"  {n:>3}x {url}")
print(f"  TOTAL internal links on home: {len(links)}")

print("\n=== IMAGE / ASSET WEIGHT PROXIES ===")
for f in ['home.html', 'page_gallery.html']:
    with open(f, encoding='utf-8', errors='ignore') as fh:
        t = fh.read()
    imgs = re.findall(r'<img[^>]*src="([^"]*)"', t)
    pngjpg = [i for i in imgs if re.search(r'\.(png|jpe?g)(\?|$)', i)]
    webp = [i for i in imgs if 'webp' in i.lower()]
    css = len(re.findall(r'<link[^>]*rel="stylesheet"', t))
    js = len(re.findall(r'<script[^>]*src=', t))
    fonts = len(set(re.findall(r'fonts\.gstatic\.com[^"\')]*', t)))
    print(f"  {f}: imgs={len(imgs)} raster={len(pngjpg)} webp={len(webp)} stylesheets={css} scripts={js} google_font_files~{fonts}")

print("\n=== MOBILE VIEWPORT / responsive ===")
with open('home.html', encoding='utf-8', errors='ignore') as fh:
    t = fh.read()
print(' viewport meta:', bool(re.search(r'name="viewport"', t)), re.findall(r'<meta name="viewport"[^>]*>', t)[:1])

print("\n=== HTTPS / WWW / TRAILING SLASH behavior ===")
