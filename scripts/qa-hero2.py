"""Re-check desktop hero only after tweaks."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    pg = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    pg.goto("http://localhost:3210/", wait_until="networkidle")
    pg.wait_for_timeout(2600)
    pg.screenshot(path="/home/z/my-project/scripts/hero-desktop-v2.png")
    pg.close()
    browser.close()
print("done")
