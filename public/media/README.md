# Media assets

⚠️ **These are temporary, royalty-free placeholders** (nightclub footage/stills
from Mixkit, free for commercial use under the Mixkit License) used to show the
visual treatment. **Replace with Anima Underground's own footage and photos.**

## How to swap

The hero video + gallery are referenced from one place: [`src/lib/site.ts`](../../src/lib/site.ts) → `media`.

- **Hero loop:** replace `hero.mp4` + `hero.webm` (kept short, muted, ~720p, web-faststart) and `hero-poster.jpg` (the still shown first / used for LCP — a representative bright frame, ~1920px wide).
- **Gallery:** replace `gallery-1.jpg … gallery-6.jpg` (~1200px wide). `gallery-1` is the large 2×2 hero tile, so use your strongest shot there.

Keep filenames the same for a drop-in swap, or edit the `media` paths in `site.ts`.
In Phase 3 the gallery becomes dashboard-managed (uploads to Vercel Blob), so the
owner can add/remove photos without touching code.

## Recreating optimized assets from a source clip

```bash
# hero loop (no audio, 720p, web-optimized) + poster + a gallery still
ffmpeg -y -i source.mp4 -t 15 -an -vf "scale=1280:-2" -c:v libx264 -crf 27 -preset veryfast -movflags +faststart hero.mp4
ffmpeg -y -i source.mp4 -t 15 -an -vf "scale=1280:-2" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 hero.webm
ffmpeg -y -ss 2.5 -i source.mp4 -frames:v 1 -vf "scale=1920:-2" -q:v 3 hero-poster.jpg
ffmpeg -y -i source.mp4 -vf "thumbnail,scale=1200:-2" -frames:v 1 -q:v 3 gallery-x.jpg
```
