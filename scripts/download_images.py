#!/usr/bin/env python3
"""Download all site images into next-app public folder with clean names."""
import json, os, re, hashlib
import urllib.request

OUT = '/home/z/my-project/truly-tours-site/public/images'
os.makedirs(OUT, exist_ok=True)
imgs = json.load(open('/home/z/my-project/site_data/images.json'))
logo = 'https://trulytoursnamibia.com/wp-content/uploads/2025/07/Asset-2.png'
all_urls = list(imgs.keys()) + [logo]

UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'}

def slugify(url):
    name = url.split('/')[-1]
    name = re.sub(r'[-_]WhatsApp-Image-\d{4}-\d{2}-\d{2}-at-[\d.]+', '', name, flags=re.I)
    name = re.sub(r'\s+', '-', name.strip())
    name = re.sub(r'[^A-Za-z0-9._-]', '', name)
    return name.lower()

manifest = {}
ok, fail = 0, 0
for url in all_urls:
    name = slugify(url)
    if not name:
        continue
    # dedupe identical names with different urls
    if name in manifest.values():
        base, ext = os.path.splitext(name)
        name = f"{base}-{hashlib.md5(url.encode()).hexdigest()[:6]}{ext}"
    dest = os.path.join(OUT, name)
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=30) as r, open(dest, 'wb') as f:
            f.write(r.read())
        sz = os.path.getsize(dest)
        if sz > 0:
            manifest[url] = name
            ok += 1
        else:
            os.remove(dest)
            fail += 1
    except Exception as e:
        print(f"FAIL {url[-60:]}: {e}")
        fail += 1

json.dump(manifest, open('/home/z/my-project/site_data/image_manifest.json', 'w'), indent=1)
print(f"downloaded {ok}, failed {fail}")
# summary of sizes
sizes = sorted(((os.path.getsize(os.path.join(OUT, n)), n) for n in manifest.values()), reverse=True)
for sz, n in sizes[:12]:
    print(f"  {sz//1024:>5} KB  {n}")
print(f"  total: {sum(s for s,_ in sizes)//1024//1024} MB, {len(sizes)} files")
