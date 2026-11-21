"""Empirical check of the two most serious suspected defects against out/ (static export):
1. Fixed one-screen section heights at >=1280px: content taller than the fixed height overflows
   (kit system.css: main > .section { height: calc(var(--h,1)*100svh) }) with default overflow visible.
2. 1024px breakpoint resize: is-live was added at >=1024; resizing below 1024 keeps the pinned layout.
Serves out/ at http://127.0.0.1:8788/.
"""
import subprocess, time, sys, json, pathlib

OUT = pathlib.Path("/home/z/my-project/out")
SRV = subprocess.Popen(
    [sys.executable, "-m", "http.server", "8788", "--bind", "127.0.0.1", "--directory", str(OUT)],
    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
)
time.sleep(1.2)

PY = r'''
import asyncio, json
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        errors = []
        # 1) desktop 1440x900: check scrollHeight vs clientHeight of each main > section
        pg = await b.new_page(viewport={"width":1440, "height":900})
        pg.on("pageerror", lambda e: errors.append("pageerror: "+str(e)))
        pg.on("console", lambda m: errors.append("console.error: "+m.text) if m.type=="error" else None)
        await pg.goto("http://127.0.0.1:8788/", wait_until="networkidle")
        await pg.wait_for_timeout(1200)
        res = await pg.evaluate("""() => {
          const out = [];
          document.querySelectorAll('main > .section').forEach(s => {
            const label = (s.id || s.className.split(' ')[1] || s.className).slice(0,30);
            // find overflowing children: any child whose bottom exceeds section bottom
            const sb = s.getBoundingClientRect().bottom;
            const st = s.getBoundingClientRect().top;
            let worst = 0, worstEl = '';
            s.querySelectorAll('*').forEach(el => {
              const r = el.getBoundingClientRect();
              if (r.height && r.bottom - sb > worst) { worst = r.bottom - sb; worstEl = el.className || el.tagName; }
            });
            out.push({sec: s.id || s.className.slice(0,40), h: s.scrollHeight, ch: s.clientHeight, overflowPx: Math.round(worst), worstEl: String(worstEl).slice(0,60), rect: Math.round(s.getBoundingClientRect().height)});
          });
          // footer too
          const f = document.querySelector('footer.closing');
          if (f) { const fb = f.getBoundingClientRect().bottom; let worst=0, worstEl='';
            f.querySelectorAll('*').forEach(el => { const r = el.getBoundingClientRect(); if (r.height && r.bottom - fb > worst) { worst = r.bottom - fb; worstEl = el.className || el.tagName; } });
            out.push({sec:'footer#contact', h:f.scrollHeight, ch:f.clientHeight, overflowPx:Math.round(worst), worstEl:String(worstEl).slice(0,60), rect:Math.round(f.getBoundingClientRect().height)});
          }
          return out;
        }""")
        print("DESKTOP_1440_OVERFLOW:", json.dumps(res, indent=1))
        # chapters: is-live and pin state at 1440
        st = await pg.evaluate("""() => {
          const h = document.querySelector('.tc-host');
          const g = document.querySelector('.tc-host .tc-grid');
          const step0 = document.querySelector('.tc-step');
          return {isLive: h.classList.contains('is-live'), hostH: h.getBoundingClientRect().height, gridPos: getComputedStyle(g).position, vh: innerHeight,
                  stepInH: document.querySelector('.tc-step__in').getBoundingClientRect().height,
                  frameVisible: getComputedStyle(document.querySelector('.tc-frame')).display};
        }""")
        print("CHAPTERS_1440:", json.dumps(st))
        # develop photo state
        dv = await pg.evaluate("""() => { const d=document.querySelector('.develop'); const cs=getComputedStyle(d.querySelector('img')); return {filter: cs.filter, transform: cs.transform}; }""")
        print("DEVELOP_REST_1440:", json.dumps(dv))
        print("JS_ERRORS_1440:", json.dumps(errors))

        # 2) resize across 1024: start at 1440 (is-live added), resize to 900 wide
        await pg.set_viewport_size({"width": 900, "height": 800})
        await pg.wait_for_timeout(900)
        st2 = await pg.evaluate("""() => {
          const h = document.querySelector('.tc-host');
          const g = document.querySelector('.tc-host .tc-grid');
          return {isLive: h.classList.contains('is-live'), hostRectH: Math.round(h.getBoundingClientRect().height),
                  hostCssH: getComputedStyle(h).height, gridPos: getComputedStyle(g).position,
                  restVisualShown: getComputedStyle(document.querySelector('.tc-visual--rest')).display,
                  frameShown: getComputedStyle(document.querySelector('.tc-frame')).display,
                  step0inH: document.querySelector('.tc-step__in').getBoundingClientRect().height,
                  docScrollH: document.documentElement.scrollHeight};
        }""")
        print("RESIZED_900:", json.dumps(st2))
        await pg.close()

        # 3) mobile 390: rest state OK? gallery 2 cols?
        pm = await b.new_page(viewport={"width":390, "height":844})
        errs2 = []
        pm.on("pageerror", lambda e: errs2.append(str(e)))
        await pm.goto("http://127.0.0.1:8788/", wait_until="networkidle")
        await pm.wait_for_timeout(800)
        st3 = await pm.evaluate("""() => {
          const h = document.querySelector('.tc-host');
          const g = document.querySelector('.tc-host .tc-grid');
          const body = document.body;
          return {isLive: h && h.classList.contains('is-live'), gridPos: g && getComputedStyle(g).position,
                  restShown: document.querySelector('.tc-visual--rest') && getComputedStyle(document.querySelector('.tc-visual--rest')).display,
                  bodyScrollW: body.scrollWidth, innerW: innerWidth, hasHScroll: body.scrollWidth > innerWidth};
        }""")
        print("MOBILE_390:", json.dumps(st3))
        print("JS_ERRORS_MOBILE:", json.dumps(errs2))
        # hero entrance on mobile: h1 visible?
        hv = await pm.evaluate("""() => { const h1=document.querySelector('.hero h1'); const cs=getComputedStyle(h1); return {opacity: cs.opacity, heroCls: document.querySelector('.hero').className, htmlCls: document.documentElement.className}; }""")
        print("MOBILE_HERO:", json.dumps(hv))
        await pm.close()

        # 4) prefers-reduced-motion desktop
        pr = await b.new_page(viewport={"width":1440, "height":900}, reduced_motion="reduce")
        errs3 = []
        pr.on("pageerror", lambda e: errs3.append(str(e)))
        await pr.goto("http://127.0.0.1:8788/", wait_until="networkidle")
        await pr.wait_for_timeout(1200)
        st4 = await pr.evaluate("""() => {
          const h = document.querySelector('.tc-host');
          const g = document.querySelector('.tc-host .tc-grid');
          return {isLive: h.classList.contains('is-live'), gridPos: getComputedStyle(g).position, hostCssH: getComputedStyle(h).height,
                  step0inH: document.querySelector('.tc-step__in').getBoundingClientRect().height,
                  h1opacity: getComputedStyle(document.querySelector('.hero h1')).opacity};
        }""")
        print("REDUCED_MOTION_1440:", json.dumps(st4))
        print("JS_ERRORS_REDUCED:", json.dumps(errs3))
        await pr.close()
        await b.close()

asyncio.run(main())
'''
r = subprocess.run([sys.executable, "-c", PY], capture_output=True, text=True, timeout=240)
print(r.stdout)
print("STDERR:", r.stderr[-2000:] if r.stderr else "(none)")
SRV.terminate()
