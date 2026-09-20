"""Visual QA for the new KINSUROI hero + navbar (desktop & mobile)."""
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:3210/"
OUT = "/home/z/my-project/scripts"

shots = [
    ("desktop", 1440, 900, None),
    ("desktop-wide", 1720, 960, None),
    ("mobile", 390, 844, None),
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for name, w, h, _ in shots:
        pg = browser.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.goto(URL, wait_until="networkidle")
        pg.wait_for_timeout(2600)  # let framer-motion reveals settle
        pg.screenshot(path=f"{OUT}/hero-{name}.png")
        if name == "desktop":
            # search overlay open state
            pg.click('button[aria-label="Cari produk"]')
            pg.wait_for_timeout(700)
            pg.fill('input[placeholder*="Cari"]', "serum")
            pg.wait_for_timeout(600)
            pg.screenshot(path=f"{OUT}/hero-search.png")
            pg.keyboard.press("Escape")
            # scrolled navbar state
            pg.mouse.wheel(0, 900)
            pg.wait_for_timeout(900)
            pg.screenshot(path=f"{OUT}/hero-scrolled.png")
        pg.close()
    browser.close()
print("done")
