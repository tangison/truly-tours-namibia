"""Final paint-level verification:
A) Does the #activities overflow actually cover the #gallery heading? (elementFromPoint)
B) Do closed <details> bodies actually paint? (checkVisibility + elementFromPoint)
C) No-JS desktop: is .tc-frame visible (geometry) and is the section 1800px?
D) Reduced-motion desktop: .tc-frame display.
"""
import subprocess, time, sys, pathlib

OUT = pathlib.Path("/home/z/my-project/out")
SRV = subprocess.Popen(
    [sys.executable, "-m", "http.server", "8790", "--bind", "127.0.0.1", "--directory", str(OUT)],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(1.2)

PY = r'''
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()

        # A+B: desktop 1440x900 with JS
        pg = await b.new_page(viewport={"width":1440, "height":900})
        await pg.goto("http://127.0.0.1:8790/", wait_until="networkidle")
        await pg.wait_for_timeout(900)
        ab = await pg.evaluate("""() => {
          const gal = document.querySelector('#gallery');
          const h2 = gal.querySelector('h2');
          const r = h2.getBoundingClientRect();
          // is the gallery h2 in the viewport? scroll to it first is needed; instead check hit-test at its position after scrolling
          const sec = document.querySelector('#activities');
          const sb = sec.getBoundingClientRect().bottom;
          // find the deepest overflowing element from activities
          let over = null;
          sec.querySelectorAll('*').forEach(el => { const rr = el.getBoundingClientRect(); if (rr.height>0 && rr.bottom - sb > 200 && (!over || rr.bottom > over.getBoundingClientRect().bottom)) over = el; });
          const ovr = over.getBoundingClientRect();
          return {overflowEl: over.tagName + '.' + String(over.className).slice(0,30), overRect: {x: Math.round(ovr.x), y: Math.round(ovr.y), w: Math.round(ovr.width), h: Math.round(ovr.height)},
                  secBottom: Math.round(sb), galTop: Math.round(gal.getBoundingClientRect().top), galH2Top: Math.round(r.top)};
        }""")
        print("ACTIVITIES_OVERFLOW:", json.dumps(ab))
        # scroll so that the activities-overflow area is in view, then hit-test
        await pg.evaluate("window.scrollBy(0, 1)")  # force layout
        await pg.evaluate("""() => { const gal = document.querySelector('#gallery'); gal.scrollIntoView(); }""")
        await pg.wait_for_timeout(500)
        hit = await pg.evaluate("""() => {
          const h2 = document.querySelector('#gallery h2');
          const r = h2.getBoundingClientRect();
          const y = Math.round(r.top + r.height/2);
          // sample along the h2's left half
          const pts = [];
          for (let x = Math.round(r.x + 10); x < r.x + r.width/2; x += 60) {
            const el = document.elementFromPoint(x, y);
            pts.push({x, y, got: el ? (el.tagName + '.' + String(el.className).slice(0,25)) : 'null'});
          }
          return {h2Rect: {top: Math.round(r.top), left: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height)}, pts};
        }""")
        print("GALLERY_H2_HITTEST:", json.dumps(hit))
        # B: closed details paint?
        bd = await pg.evaluate("""() => {
          const d = document.querySelector('#tours details');
          const body = d.querySelector('.tour-detail__body');
          const r = body.getBoundingClientRect();
          let vis = null;
          try { vis = body.checkVisibility({checkOpacity:true, checkVisibilityCSS:true}); } catch(e) { vis = 'api-na'; }
          // hit-test the body's centre if in viewport
          let hit = 'offscreen';
          if (r.top > 0 && r.top < innerHeight) {
            const el = document.elementFromPoint(r.x + 20, r.top + 10);
            hit = el ? el.tagName + '.' + String(el.className).slice(0,25) : 'null';
          }
          return {open: d.open, bodyH: Math.round(r.height), bodyTop: Math.round(r.top), checkVis: vis, hit};
        }""")
        print("CLOSED_DETAILS_PAINT:", json.dumps(bd))
        # scroll to tours and hit-test the last row area vs the section bottom
        await pg.evaluate("document.querySelector('#tours').scrollIntoView()")
        await pg.wait_for_timeout(400)
        bd2 = await pg.evaluate("""() => {
          const sec = document.querySelector('#tours');
          const sb = sec.getBoundingClientRect().bottom;
          const last = sec.querySelector('.rows > li:last-child');
          const lr = last.getBoundingClientRect();
          // point 10px below section bottom at last row's x — who is on top?
          const y = Math.round(Math.min(sb + 10, innerHeight - 5));
          const x = Math.round(lr.x + 40);
          const el = document.elementFromPoint(x, y);
          const elAtBottom = document.elementFromPoint(Math.round(lr.x + 40), Math.round(Math.min(lr.bottom + 5, innerHeight - 5)));
          return {secBottom: Math.round(sb), lastRowBottom: Math.round(lr.bottom), beyondBy: Math.round(lr.bottom - sb), atSecBottomPlus10: el ? el.tagName + '.' + String(el.className).slice(0,25) : 'null', belowLastRow: elAtBottom ? elAtBottom.tagName + '.' + String(elAtBottom.className).slice(0,25) : 'null'};
        }""")
        print("TOURS_BOTTOM_HITTEST:", json.dumps(bd2))
        await pg.close()

        # C: no-JS desktop 1440
        pn = await b.new_page(viewport={"width":1440, "height":900}, java_script_enabled=False)
        await pn.goto("http://127.0.0.1:8790/", wait_until="load")
        await pn.wait_for_timeout(700)
        # without JS we cannot evaluate; use screenshot + external measure via CDP? evaluate is fine with JS disabled? No.
        await pn.screenshot(path="/tmp/render/nojs-1440-hero.png")
        await pn.close()

        # C2: simulate no-JS differently — block the kit scripts and hydration bundle, keep inline script
        pk = await b.new_page(viewport={"width":1440, "height":900})
        await pk.route("**/*", lambda route: route.abort() if (route.request.resource_type == "script" and ".js" in (route.request.url or "")) else route.continue_())
        await pk.goto("http://127.0.0.1:8790/", wait_until="load")
        await pk.wait_for_timeout(700)
        nj = await pk.evaluate("""() => {
          const h = document.querySelector('.tc-host');
          const f = document.querySelector('.tc-frame');
          const fr = f.getBoundingClientRect();
          const imgs = [...f.querySelectorAll('img')].map(i => { const r = i.getBoundingClientRect(); return {w: Math.round(r.width), h: Math.round(r.height)}; });
          return {isLive: h.classList.contains('is-live'), hostH: Math.round(h.getBoundingClientRect().height),
                  frameDisplay: getComputedStyle(f).display, frameRect: {w: Math.round(fr.width), h: Math.round(fr.height)}, imgs,
                  stepsIn: [...document.querySelectorAll('.tc-step__in')].map(s => Math.round(s.getBoundingClientRect().height)),
                  htmlCls: document.documentElement.className};
        }""")
        print("NOJS_1440(scripts-blocked):", json.dumps(nj))
        await pk.close()

        # D: reduced-motion 1440 — frame display
        pr = await b.new_page(viewport={"width":1440, "height":900}, reduced_motion="reduce")
        await pr.goto("http://127.0.0.1:8790/", wait_until="networkidle")
        await pr.wait_for_timeout(1000)
        rm = await pr.evaluate("""() => {
          const f = document.querySelector('.tc-frame');
          const fr = f.getBoundingClientRect();
          const h = document.querySelector('.tc-host');
          return {isLive: h.classList.contains('is-live'), frameDisplay: getComputedStyle(f).display,
                  frameRect: {w: Math.round(fr.width), h: Math.round(fr.height)},
                  hostH: Math.round(h.getBoundingClientRect().height), hostScrollH: h.scrollHeight};
        }""")
        print("REDUCED_1440_FRAME:", json.dumps(rm))
        await pr.close()
        await b.close()

asyncio.run(main())
'''
r = subprocess.run([sys.executable, "-c", PY], capture_output=True, text=True, timeout=240)
print(r.stdout)
print("STDERR:", r.stderr[-1200:] if r.stderr else "(none)")
SRV.terminate()
