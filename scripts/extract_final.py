#!/usr/bin/env python3
"""Final content extraction: builds clean site_data/content.json with
tour cards, testimonials, contact info, gallery, and all page bodies."""
import json, os, re
from bs4 import BeautifulSoup

DATA = '/home/z/my-project/audit_data'
OUT = '/home/z/my-project/site_data'
os.makedirs(OUT, exist_ok=True)

PAGES = {
    'home': 'home.html', 'tours': 'page_tours.html',
    '10-days-tours': 'page_10-days-tours.html',
    'windhoek-sossusvlei': 'page_windhoek-sossusvlei.html',
    'kalahari': 'page_kalahari.html',
    'tour-to-the-north': 'page_tour-to-the-north.html',
    'etosha-national-park': 'page_etosha-national-park.html',
    'sossusvlei-and-swakopmund': 'page_sossusvlei-and-swakopmund.html',
    'ctt': 'page_ctt.html', 'saw': 'page_saw.html', 'gde': 'page_gde.html',
    'tnt': 'page_tnt.html', 'bhw': 'page_bhw.html', 'csr': 'page_csr.html',
    'contact': 'page_contact.html', 'our-team': 'page_our-team.html',
    'gallery': 'page_gallery.html',
}

def clean(s):
    return re.sub(r'\s+', ' ', s or '').strip()

def full_size(url):
    """Strip WP thumbnail suffix for the full-size image."""
    return re.sub(r'-\d+x\d+(?=\.\w+$)', '', url)

def get_img_src(img):
    src = img.get('data-src') or img.get('src') or ''
    return full_size(src) if src else ''

all_images = {}

def register(url, alt=''):
    if url and url.startswith('http') and 'wp-content/uploads' in url:
        all_images.setdefault(url, alt)
    return url

content = {}
for slug, fname in PAGES.items():
    with open(os.path.join(DATA, fname), encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f.read(), 'lxml')
    ec = soup.find('div', class_='entry-content') or soup.body
    page = {'blocks': []}

    widgets = ec.find_all('div', class_='elementor-widget', recursive=True)
    pending_img = None  # for image→image-box→button pairing
    for w in widgets:
        wt = w.get('data-widget_type', '').split('.')[0]
        if wt == 'image':
            img = w.find('img')
            if img:
                pending_img = register(get_img_src(img), img.get('alt', ''))
        elif wt == 'image-box':
            title = w.find(class_='elementor-image-box-title')
            desc = w.find(class_='elementor-image-box-description')
            # image-box on home has its own img sometimes
            img = w.find('img')
            img_url = register(get_img_src(img), img.get('alt', '')) if img else ''
            page['blocks'].append({
                'type': 'card', 'title': clean(title.get_text()) if title else '',
                'text': clean(desc.get_text(' ', strip=True)) if desc else '',
                'img': img_url or pending_img or ''})
            pending_img = None
        elif wt == 'hfe-infocard':
            title = w.find(class_='hfe-infocard-title')
            text = w.find(class_='hfe-infocard-text')
            img = w.find('img')
            page['blocks'].append({
                'type': 'infocard',
                'title': clean(title.get_text()) if title else '',
                'text': clean(text.get_text(' ', strip=True)) if text else '',
                'img': register(get_img_src(img), img.get('alt', '')) if img else ''})
        elif wt == 'text-editor':
            txt = clean(w.get_text(' ', strip=True))
            if txt:
                page['blocks'].append({'type': 'text', 'text': txt})
        elif wt == 'heading':
            txt = clean(w.get_text())
            if txt:
                page['blocks'].append({'type': 'heading', 'text': txt})
        elif wt == 'button':
            a = w.find('a')
            page['blocks'].append({'type': 'button',
                'text': clean(a.get_text()) if a else '',
                'href': a.get('href', '') if a else ''})
        elif wt == 'testimonial':
            c = w.find(class_='elementor-testimonial-content')
            n = w.find(class_='elementor-testimonial-name')
            page['blocks'].append({'type': 'testimonial',
                'quote': clean(c.get_text(' ', strip=True)) if c else '',
                'name': clean(n.get_text()) if n else ''})
        elif wt == 'star-rating':
            title = w.find(class_='elementor-star-rating__title')
            page['blocks'].append({'type': 'stars',
                'text': clean(title.get_text()) if title else '',
                'rating': w.get_text(strip=True)[:1]})
        elif wt == 'image-gallery':
            seen = []
            for img in w.find_all('img'):
                u = register(get_img_src(img), img.get('alt', ''))
                if u and u not in seen:
                    seen.append(u)
            page['blocks'].append({'type': 'gallery', 'images': seen})
        elif wt == 'icon-list':
            items = [clean(li.get_text(' ', strip=True))
                     for li in w.find_all('li', class_='elementor-icon-list-item')]
            page['blocks'].append({'type': 'iconlist', 'items': items})
        elif wt == 'wpforms':
            fields = []
            for lab in w.find_all('label'):
                fields.append(clean(lab.get_text()))
            page['blocks'].append({'type': 'form', 'fields': fields})
    content[slug] = page

# gallery: extract full list
with open(os.path.join(DATA, 'page_gallery.html'), encoding='utf-8', errors='ignore') as f:
    gsoup = BeautifulSoup(f.read(), 'lxml')
gallery_imgs = []
for img in gsoup.find_all('img'):
    u = get_img_src(img)
    if u and 'wp-content/uploads' in u and u not in gallery_imgs:
        alt = img.get('alt', '')
        gallery_imgs.append(u)
        all_images.setdefault(u, alt)
content['gallery']['gallery_images'] = gallery_imgs

with open(f'{OUT}/content.json', 'w', encoding='utf-8') as f:
    json.dump(content, f, ensure_ascii=False, indent=1)
with open(f'{OUT}/images.json', 'w', encoding='utf-8') as f:
    json.dump(all_images, f, ensure_ascii=False, indent=1)

print('pages:', len(content), '| unique images:', len(all_images), '| gallery:', len(gallery_imgs))
for slug, p in content.items():
    kinds = {}
    for b in p['blocks']:
        kinds[b['type']] = kinds.get(b['type'], 0) + 1
    print(f"{slug:26} {kinds}")
# logo
print('logo candidates:', [u for u in all_images if 'Asset' in u][:3])
