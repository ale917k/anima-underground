// Full-page screenshot helper — drives the system Chrome via puppeteer-core.
// Usage: node scripts/shot.mjs <url> <outPath> <width> <height> [mobile]
import puppeteer from "puppeteer-core";

const [, , url, out, w = "1440", h = "900", mobile = ""] = process.argv;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.setViewport({
  width: Number(w),
  height: Number(h),
  deviceScaleFactor: 2,
  isMobile: Boolean(mobile),
});
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

// Scroll through the page to trigger IntersectionObserver reveals, then top.
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const step = Math.floor(window.innerHeight * 0.7);
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await sleep(120);
  }
  window.scrollTo(0, 0);
  await sleep(400);
});

await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("saved", out);
