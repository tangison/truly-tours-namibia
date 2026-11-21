#!/usr/bin/env python3
"""Build site.ts data module from scraped content: tours with days, prices, itineraries."""
import json, re

c = json.load(open('/home/z/my-project/site_data/content.json'))
manifest = json.load(open('/home/z/my-project/site_data/image_manifest.json'))

def webp(url):
    """Map source URL to optimized local file."""
    name = manifest.get(url, '')
    if not name:
        return ''
    base = re.sub(r'\.\w+$', '', name)
    # prefer webp if exists in the optimized set
    return f"{base}.webp"

def slug_name(url):
    return re.sub(r'\.\w+$', '', manifest.get(url, '').split('/')[-1])

# --- The 6 multi-day tours (from tours page cards + detail pages) ---
TOURS = [
    {
        'id': 'ten-days-classic', 'days': 10,
        'title': 'Windhoek, Sossusvlei, Swakopmund, Spitzkoppen and Etosha',
        'short': 'The classic 10-day loop',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/07/windhoek-city.jpeg'),
        'detail': '10-days-tours',
    },
    {
        'id': 'ten-days-brandberg', 'days': 10,
        'title': 'Windhoek, Sossusvlei, Swakopmund, Brandberg, Twyfelfontein and Etosha',
        'short': 'Damaraland and rock art',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/08/Sossusvlei.jpeg'),
        'detail': 'windhoek-sossusvlei',
    },
    {
        'id': 'thirteen-days-south', 'days': 13,
        'title': 'Kalahari, Fish River Canyon, Lüderitz, Sossusvlei, Swakopmund, Brandberg and Etosha',
        'short': 'The grand southern loop',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/08/Kalahari.jpeg'),
        'detail': 'kalahari',
    },
    {
        'id': 'twelve-days-north', 'days': 12,
        'title': 'Swakopmund, Damaraland, Owamboland and Etosha',
        'short': 'Tour to the north',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/08/Swakopmund.jpeg'),
        'detail': 'tour-to-the-north',
    },
    {
        'id': 'three-days-sossusvlei', 'days': 3,
        'title': 'Sossusvlei and Swakopmund',
        'short': 'Dunes to the coast',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/08/s2.jpeg'),
        'detail': 'sossusvlei-and-swakopmund',
    },
    {
        'id': 'three-days-etosha', 'days': 3,
        'title': 'Etosha National Park and Waterberg',
        'short': 'Wildlife and plateau',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/08/Untitled.jpeg'),
        'detail': 'etosha-national-park',
    },
]

ACTIVITIES = [
    {
        'id': 'city-township', 'hours': '2–3 hours',
        'title': 'City/Township Tour: discover Windhoek',
        'text': 'A guided walk and drive through Windhoek, the vibrant capital of Namibia: National monuments, rich colonial and post-colonial history, and the township of Katutura.',
        'price': 'N$750 per person',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/07/k.jpeg'),
    },
    {
        'id': 'bushmen-walk', 'hours': '3 hours',
        'title': 'The Bushmen Walk: step into ancient wisdom',
        'text': 'A cultural journey to the Bushmen Survival Trust, 22 km from Windhoek, where the last first-people of Southern Africa share their surviving skills, culture and rich heritage.',
        'price': '',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/07/bushman.jpg'),
    },
    {
        'id': 'game-drive', 'hours': '3–4 hours',
        'title': 'Game Drive just outside Windhoek',
        'text': 'Escape the city on a guided game drive 30 km from Windhoek at one of our trusted partner reserves, and spot wildlife on a private game farm.',
        'price': '',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-15-at-11.10.34.jpeg'),
    },
    {
        'id': 'cooking-class', 'hours': '2–3 hours',
        'title': 'Taste Namibia: traditional cooking class',
        'text': 'A hands-on traditional food cooking class: learn to prepare a variety of authentic local dishes, with a special focus on Mahangu pap making.',
        'price': '',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/07/Namibian-food.jpeg'),
    },
    {
        'id': 'bar-hopping', 'hours': 'Evening',
        'title': 'Bar Hopping: Windhoek by night',
        'text': 'A taste of Namibia’s nightlife with our guided bar hopping experience through Windhoek’s bars and shap Shanas.',
        'price': '',
        'img': webp('https://trulytoursnamibia.com/wp-content/uploads/2025/07/whk.jpeg'),
    },
]

# itineraries from detail pages: text[1] = day-by-day, text[2] = included
def get_detail(slug):
    blocks = c[slug]['blocks']
    intro = daybyday = included = ''
    for b in blocks:
        if b['type'] == 'text':
            t = b['text']
            if t.startswith('Day 1') or t.startswith('Day1'):
                daybyday = t
            elif t.startswith('Included'):
                included = t
            else:
                intro = t
    return intro, daybyday, included

for t in TOURS:
    intro, daybyday, included = get_detail(t['detail'])
    t['intro'] = intro
    t['itinerary'] = daybyday
    t['included'] = included

# testimonials from home
TESTIMONIALS = []
for b in c['home']['blocks']:
    if b['type'] == 'testimonial':
        TESTIMONIALS.append({'quote': b['quote'], 'name': b['name']})

# CSR text
csr_text = next(b['text'] for b in c['csr']['blocks'] if b['type'] == 'text' and 'CSR' not in b['text'][:4])
csr_text2 = next(b['text'] for b in c['csr']['blocks'] if b['type'] == 'text' and 'rural communities' in b['text'])
team_text = next(b['text'] for b in c['our-team']['blocks'] if b['type'] == 'text')

out = {
    'TOURS': TOURS,
    'ACTIVITIES': ACTIVITIES,
    'TESTIMONIALS': TESTIMONIALS,
    'csr': [csr_text, csr_text2],
    'team': team_text,
}
with open('/home/z/my-project/site_data/site.json', 'w') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

print("tours:", len(TOURS), "activities:", len(ACTIVITIES), "testimonials:", len(TESTIMONIALS))
for t in TOURS:
    print(f"  {t['days']:>2}d {t['id']:28} img={t['img'][:30]:30} itin={'Y' if t['itinerary'] else 'N'} incl={'Y' if t['included'] else 'N'}")
for a in ACTIVITIES:
    print(f"  act {a['id']:20} img={a['img'][:30]}")
print('CSR:', csr_text[:80])
print('CSR2:', csr_text2[:80])
print('TEAM:', team_text[:80])
print('TESTIMONIALS:', [(t['name'], t['quote'][:40]) for t in TESTIMONIALS])
