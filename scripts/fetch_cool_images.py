#!/usr/bin/env python3
"""Download sourced image candidates, score quality, pick winners per slot."""
import json, os, urllib.request
from PIL import Image, ImageStat, ImageFilter

DL = '/tmp/is/dl'
os.makedirs(DL, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0'}

cats = ['canyon', 'quiver', 'kolm', 'balloon', 'aerial', 'etosha']

def score(path):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    small = im.resize((64, 64))
    stat = ImageStat.Stat(small)
    bright = sum(stat.mean) / 3
    contrast = sum(stat.stddev) / 3
    lap = small.convert('L').filter(ImageFilter.FIND_EDGES)
    sharp = ImageStat.Stat(lap).stddev[0]
    return dict(w=w, h=h, bright=round(bright), contrast=round(contrast), sharp=round(sharp),
                kb=os.path.getsize(path)//1024)

scores = {}
for cat in cats:
    raw = open(f'/tmp/is/{cat}.json').read()
    d = json.loads(raw[raw.find('{'):])
    scores[cat] = []
    for i, r in enumerate(d.get('results', [])):
        url = r['original_url']
        ext = url.split('.')[-1][:4]
        dest = f'{DL}/{cat}-{i}.{ext}'
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as resp, open(dest, 'wb') as f:
                f.write(resp.read())
            s = score(dest)
            s['url'] = url
            scores[cat].append((dest, s))
        except Exception as e:
            print(f'FAIL {cat}-{i}: {e}')

for cat in cats:
    print(f'--- {cat} ---')
    for dest, s in sorted(scores[cat], key=lambda x: -x[1]['sharp']):
        # good exposure band 90..175, penalize extremes
        pen = max(0, 90 - s['bright']) + max(0, s['bright'] - 185)
        print(f"  {dest.split('/')[-1]:18} {s['w']}x{s['h']:<6} sharp={s['sharp']:>3} bright={s['bright']:>3} contr={s['contrast']:>3} {s['kb']:>4}KB pen={pen}")

json.dump({c: [[d, s] for d, s in scores[c]] for c in cats}, open('/tmp/is/scores.json', 'w'))
