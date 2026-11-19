#!/usr/bin/env python3
"""Extract on-page SEO elements from fetched pages for audit."""
import glob, os, re, html

os.chdir('/home/z/my-project/audit_data')

def grab(pattern, text, flags=re.I | re.S):
    m = re.search(pattern, text, flags)
    return m.group(1).strip() if m else ''

def count(pattern, text):
    return len(re.findall(pattern, text, re.I))

rows = []
for f in sorted(glob.glob('page_*.html')) + ['home.html']:
    with open(f, encoding='utf-8', errors='ignore') as fh:
        t = fh.read()
    name = f.replace('page_', '').replace('.html', '')
    title = grab(r'<title>([^<]*)</title>', t)
    desc = grab(r'<meta name="description" content="([^"]*)"', t)
    canon = grab(r'<link rel="canonical" href="([^"]*)"', t)
    robots = grab(r'<meta name="robots" content="([^"]*)"', t)
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', t, re.I | re.S)
    h1texts = [re.sub(r'<[^>]+>', '', h).strip()[:80] for h in h1s]
    ogtitle = grab(r'<meta property="og:title" content="([^"]*)"', t)
    ogimg = grab(r'<meta property="og:image" content="([^"]*)"', t)
    schema = count(r'application/ld\+json', t)
    words = len(re.sub(r'<script.*?</script>|<style.*?</style>|<[^>]+>', ' ', t, flags=re.S).split())
    imgs = count(r'<img', t)
    imgs_noalt = count(r'<img(?![^>]*\balt=)', t)
    lazy = count(r'loading="lazy"', t)
    rows.append({
        'page': name, 'title': title[:90], 'title_len': len(title),
        'desc': desc[:100], 'desc_len': len(desc),
        'canon': canon, 'robots': robots,
        'n_h1': len(h1s), 'h1s': ' || '.join(h1texts[:2]),
        'og_title': ogtitle[:60], 'og_img': ogimg[:60],
        'ldjson_blocks': schema, 'words': words,
        'imgs': imgs, 'imgs_noalt': imgs_noalt, 'lazy': lazy,
        'bytes': os.path.getsize(f),
    })

hdr = f"{'page':24} {'tl':>3} {'dl':>3} {'h1':>2} {'ld':>2} {'words':>5} {'img':>4} {'noalt':>4} {'bytes':>7}  title | robots | canonical"
print(hdr)
for r in rows:
    print(f"{r['page']:24} {r['title_len']:>3} {r['desc_len']:>3} {r['n_h1']:>2} {r['ldjson_blocks']:>2} {r['words']:>5} {r['imgs']:>4} {r['imgs_noalt']:>4} {r['bytes']:>7}  {r['title'][:60]!r} | {r['robots'][:16]} | {r['canon'][:60]}")

print("\n=== TITLES IN FULL ===")
for r in rows:
    print(f"  [{r['page']}] ({r['title_len']} ch): {r['title']!r}  og:{r['og_title'][:40]!r}")

print("\n=== META DESCRIPTIONS IN FULL ===")
for r in rows:
    print(f"  [{r['page']}] ({r['desc_len']} ch): {r['desc']!r}")

print("\n=== H1s PER PAGE ===")
for r in rows:
    print(f"  [{r['page']}] x{r['n_h1']}: {r['h1s']!r}")

print("\n=== OG IMAGE SAMPLE ===")
print(rows[0]['og_img'])
