#!/usr/bin/env python3
"""Extract all text content + image inventory from cached HTML pages.
Produces content.json (structured) and images manifest."""
import json, os, re
from bs4 import BeautifulSoup

DATA = '/home/z/my-project/audit_data'
OUT = '/home/z/my-project/site_data'
os.makedirs(OUT, exist_ok=True)

PAGES = {
    'home': 'home.html',
    'tours': 'page_tours.html',
    '10-days-tours': 'page_10-days-tours.html',
    'windhoek-sossusvlei': 'page_windhoek-sossusvlei.html',
    'kalahari': 'page_kalahari.html',
    'tour-to-the-north': 'page_tour-to-the-north.html',
    'etosha-national-park': 'page_etosha-national-park.html',
    'sossusvlei-and-swakopmund': 'page_sossusvlei-and-swakopmund.html',
    'ctt': 'page_ctt.html',
    'saw': 'page_saw.html',
    'gde': 'page_gde.html',
    'tnt': 'page_tnt.html',
    'bhw': 'page_bhw.html',
    'csr': 'page_csr.html',
    'contact': 'page_contact.html',
    'our-team': 'page_our-team.html',
    'gallery': 'page_gallery.html',
}

def clean_text(s):
    return re.sub(r'\s+', ' ', s or '').strip()

def extract(soup):
    """Extract ordered content blocks from entry-content."""
    ec = soup.find('div', class_='entry-content') or soup.body
    blocks = []
    for w in ec.find_all('div', class_='elementor-widget', recursive=True):
        wt = w.get('data-widget_type', '').split('.')[0]
        if wt == 'text-editor':
            txt = clean_text(w.get_text(' ', strip=True))
            if txt:
                blocks.append({'type': 'text', 'text': txt})
        elif wt == 'image':
            img = w.find('img')
            if img:
                src = img.get('data-src') or img.get('src') or ''
                alt = img.get('alt', '')
                blocks.append({'type': 'image', 'src': src, 'alt': alt})
        elif wt == 'hfe-infocard':
            title = w.find(class_='hfe-infocard-title')
            text = w.find(class_='hfe-infocard-text')
            blocks.append({'type': 'infocard', 'title': clean_text(title.get_text() if title else ''),
                           'text': clean_text(text.get_text(' ', strip=True) if text else '')})
        elif wt in ('heading',):
            txt = clean_text(w.get_text())
            if txt:
                blocks.append({'type': 'heading', 'text': txt})
        elif wt == 'spacer':
            continue
        else:
            txt = clean_text(w.get_text(' ', strip=True))
            img = w.find('img')
            if txt or img:
                blocks.append({'type': wt or 'other', 'text': txt[:400],
                               'img': (img.get('data-src') or img.get('src') or '') if img else ''})
    return blocks

all_images = {}
content = {}
for slug, fname in PAGES.items():
    with open(os.path.join(DATA, fname), encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'lxml')
    # metadata
    title = soup.find('title')
    desc = soup.find('meta', attrs={'name': 'description'})
    blocks = extract(soup)
    content[slug] = {
        'title': clean_text(title.get_text()) if title else '',
        'meta_desc': desc.get('content', '') if desc else '',
        'blocks': blocks,
    }
    # collect images (both data-src lazy and src)
    for img in soup.find_all('img'):
        src = img.get('data-src') or img.get('src') or ''
        if not src or not src.startswith('http'):
            continue
        # skip tiny logo repeats & icons & latepoint assets
        if any(x in src for x in ['latepoint', 'wp-content/plugins', 'gravatar', 'emoji']):
            continue
        alt = img.get('alt', '')
        all_images[src] = alt

print(f"pages: {len(content)}")
print(f"unique images: {len(all_images)}")
with open(f'{OUT}/content.json', 'w', encoding='utf-8') as f:
    json.dump(content, f, ensure_ascii=False, indent=1)
with open(f'{OUT}/images.json', 'w', encoding='utf-8') as f:
    json.dump(all_images, f, ensure_ascii=False, indent=1)

# print summary per page
for slug, c in content.items():
    kinds = {}
    for b in c['blocks']:
        kinds[b['type']] = kinds.get(b['type'], 0) + 1
    ntext = sum(len(b.get('text', '').split()) for b in c['blocks'] if b['type'] == 'text')
    print(f"{slug:26} blocks={len(c['blocks']):3} {kinds} textwords={ntext}")
