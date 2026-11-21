"""Targeted verification: (A) visible section overflow at 1440, (B) .tc-frame display at rest
(kit .frame class vs page .tc-frame{display:none} cascade), (C) resize-across-1024 collapsed steps,
(D) opened details overflow. Screenshots to /tmp/render for visual confirmation."""
import subprocess, time, sys, pathlib

OUT = pathlib.Path("/home/z/my-project/out")
SRV = subprocess.Popen(
    [sys.executable, "-m", "http.server", "8789", "--bind", "127.0.0.1", "--directory", str(OUT)],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(1.2)

PY = r'''
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={"width":1440, "height":900})
        await pg.goto("http://127.0.0.1:8789/", wait_until="networkidle")
        await pg.wait_for_timeout(1000)

        # A) precise visible-overflow check: only elements with real boxes, report deepest offenders
        res = await pg.evaluate("""() => {
          function check(sec) {
            const sb = sec.getBoundingClientRect().bottom;
            const off = [];
            sec.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.height > 0 && r.bottom > sb + 1) {
                // is it inside a closed details?
                let d = el.closest('details');
                const closed = d && !d.open;
                off.push({tag: el.tagName, cls: String(el.className).slice(0,50), over: Math.round(r.bottom - sb), closedDetails: !!closed, visible: !!(el.offsetWidth || el.offsetHeight)});
              }
            });
            return off.sort((a,b)=>b.over-a.over).slice(0,4);
          }
          return {tours: check(document.querySelector('#tours')), activities: check(document.querySelector('#activities'))};
        }""")
        print("VISIBLE_OVERFLOW_TOP4:", json.dumps(res, indent=1))

        # closed details: does .tour-detail__body have a box when closed?
        cd = await pg.evaluate("""() => {
          const d = document.querySelector('#tours details');
          const body = d.querySelector('.tour-detail__body');
          return {open: d.open, bodyRectH: body.getBoundingClientRect().height, bodyScrollH: body.scrollHeight};
        }""")
        print("CLOSED_DETAILS_BODY:", json.dumps(cd))

        # open first two details, re-measure #tours
        await pg.evaluate("() => { document.querySelectorAll('#tours details').forEach((d,i)=>{ if(i<2) d.open = true; }); }")
        await pg.wait_for_timeout(300)
        od = await pg.evaluate("""() => {
          const s = document.querySelector('#tours'); const sb = s.getBoundingClientRect().bottom;
          let worst = 0, wcls='';
          s.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.height>0 && r.bottom - sb > worst) { worst = r.bottom - sb; wcls = el.className || el.tagName; } });
          return {overflowPx: Math.round(worst), worst: String(wcls).slice(0,40), secScrollH: s.scrollHeight};
        }""")
        print("TOURS_2_OPEN:", json.dumps(od))
        # screenshot the tours->chapters boundary with 2 open
        await pg.evaluate("window.scrollTo(0, 900)")
        await pg.wait_for_timeout(400)
        await pg.screenshot(path="/tmp/render/tours-open-overflow.png")

        # boundary screenshot: activities bottom / gallery top
        await pg.evaluate("document.querySelector('#gallery').scrollIntoView()")
        await pg.wait_for_timeout(500)
        await pg.screenshot(path="/tmp/render/activities-gallery-boundary.png")

        # B) .tc-frame at rest: 390px viewport, fresh page
        pm = await b.new_page(viewport={"width":390, "height":844})
        await pm.goto("http://127.0.0.1:8789/", wait_until="networkidle")
        await pm.wait_for_timeout(800)
        fb = await pm.evaluate("""() => {
          const f = document.querySelector('.tc-frame');
          const cs = getComputedStyle(f);
          const imgs = [...f.querySelectorAll('img')];
          return {display: cs.display, rect: f.getBoundingClientRect().toJSON(),
                  imgVisible: imgs.map(i => { const r = i.getBoundingClientRect(); return {w: Math.round(r.width), h: Math.round(r.height), complete: i.complete}; }),
                  frameClass: f.className};
        }""")
        print("FRAME_AT_390_REST:", json.dumps(fb))
        await pm.evaluate("document.querySelector('#chapters').scrollIntoView()")
        await pm.wait_for_timeout(400)
        await pm.screenshot(path="/tmp/render/chapters-rest-390.png")

        # CSS cascade check: which rule wins for .tc-frame display
        casc = await pm.evaluate("""() => {
          const f = document.querySelector('.tc-frame');
          const s = getComputedStyle(f);
          return {display: s.display, alignItems: s.alignItems, overflow: s.overflow};
        }""")
        print("FRAME_COMPUTED_390:", json.dumps(casc))

        # C) resize 1440 -> 900: steps collapsed?
        pr = await b.new_page(viewport={"width":1440, "height":900})
        await pr.goto("http://127.0.0.1:8789/", wait_until="networkidle")
        await pr.wait_for_timeout(900)
        await pr.set_viewport_size({"width": 900, "height": 800})
        await pr.wait_for_timeout(600)
        rc = await pr.evaluate("""() => {
          const steps = [...document.querySelectorAll('.tc-step')];
          return steps.map(st => {
            const inn = st.querySelector('.tc-step__in');
            return {h3: st.querySelector('h3').textContent.slice(0,20), inH: Math.round(inn.getBoundingClientRect().height),
                    inOpacity: getComputedStyle(inn).opacity, inlineH: inn.style.height, inlineOpacity: inn.style.opacity};
          });
        }""")
        print("RESIZED_900_STEPS:", json.dumps(rc, indent=1))
        await pr.evaluate("document.querySelector('#chapters').scrollIntoView()")
        await pr.wait_for_timeout(500)
        await pr.screenshot(path="/tmp/render/chapters-after-resize-900.png")

        # no-JS check: block JS, look at .tc-frame and page rest state
        pn = await b.new_page(viewport={"width":1440, "height":900}, java_script_enabled=False)
        await pn.goto("http://127.0.0.1:8789/", wait_until="load")
        await pn.wait_for_timeout(600)
        nj = await pn.evaluate_handle  # not available without JS? evaluate works with JS disabled? no.
        await pn.screenshot(path="/tmp/render/nojs-1440.png", full_page=False)
        await b.close()

asyncio.run(main())
'''
r = subprocess.run([sys.executable, "-c", PY], capture_output=True, text=True, timeout=240)
print(r.stdout)
print("STDERR:", r.stderr[-1500:] if r.stderr else "(none)")
SRV.terminate()
