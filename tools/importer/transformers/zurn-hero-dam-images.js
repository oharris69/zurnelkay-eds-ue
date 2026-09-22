/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: rewrite EN homepage hero-carousel slide images to DAM paths.
 *
 * The source hero banners live on www.zurn.com and are bot-blocked (403), so
 * they can't be fetched/delivered. Three equivalent banners were uploaded to
 * the DAM (/content/dam/zurn/en/images). This maps the source banner filename
 * (the last path segment of the AEM image-transform URL) to its DAM path so the
 * imported hero references the delivered DAM asset instead of the dead URL.
 *
 * Runs in beforeTransform (before the carousel-hero parser extracts <img> refs
 * into slide cells), scoped to the #bannerCarousel element only.
 *
 * Slides with no DAM equivalent are left untouched (their images simply won't
 * render — an acceptable partial, and better than rewriting them to a wrong
 * banner).
 */

const HERO_SELECTOR = '#bannerCarousel';
const DAM_BASE = '/content/dam/zurn/en/images';

// source banner filename (lowercased, no query) -> DAM asset path.
// The import sees the source's mobile (768) variants; we map each of the 8 hero
// slides to its desktop banner in the DAM. Both mobile and desktop source names
// are keyed so the map is robust to either being emitted. DAM filenames are the
// exact ones uploaded to /content/dam/zurn/en/images (from the live source).
const IMAGE_MAP = {
  // slide 1 — Designed for Compliance (GRZE)
  'zurnv49-grze-banner-mob-2026.png': `${DAM_BASE}/zurnv49-grze-banner-2026.jpeg`,
  'zurnv49-grze-banner-2026.png': `${DAM_BASE}/zurnv49-grze-banner-2026.jpeg`,
  // slide 2 — Accurate PRV Sizing (Wilkins PRV Calculator)
  '480-375-wilkins-prv-calculator-homepage-banner-2000x600-mobile.png': `${DAM_BASE}/zurnv49-480-375-Wilkins-PRV-Calculator-Homepage-Banner-2300x800.jpeg`,
  'zurnv49-480-375-wilkins-prv-calculator-homepage-banner-2300x800.png': `${DAM_BASE}/zurnv49-480-375-Wilkins-PRV-Calculator-Homepage-Banner-2300x800.jpeg`,
  // slide 3 — 975XL3N N-Pattern
  '480-356-npd-bc-n-pattern-975xl3-web-banner-1200x768-mobile.png': `${DAM_BASE}/480-356-NPD-BC-n-Pattern-975XL3-Web-Banner_2000x600.jpeg`,
  '480-356-npd-bc-n-pattern-975xl3-web-banner-2000x600.png': `${DAM_BASE}/480-356-NPD-BC-n-Pattern-975XL3-Web-Banner_2000x600.jpeg`,
  // slide 4 — Interceptor Sizing
  'zurnv49-interceptor-sizing-tool-homepage-banner-mobile.png': `${DAM_BASE}/zurnv49-interceptor-sizing-tool-homepage-banner.jpeg`,
  'zurnv49-interceptor-sizing-tool-homepage-banner.png': `${DAM_BASE}/zurnv49-interceptor-sizing-tool-homepage-banner.jpeg`,
  // slide 5 — 900XL3 Series
  '480-362-900xl3-web-banner-desktop-1250x600.png': `${DAM_BASE}/480-362-900XL3-Web-Banner-Desktop_2000x600.jpeg`,
  '480-362-900xl3-web-banner-desktop-2000x600.png': `${DAM_BASE}/480-362-900XL3-Web-Banner-Desktop_2000x600.jpeg`,
  // slide 6 — Z886 Durable Solution
  'zurnv49-z886-di-banner-mobile.png': `${DAM_BASE}/zurnv49-Z886-DI-banner.jpeg`,
  'zurnv49-z886-di-banner.png': `${DAM_BASE}/zurnv49-Z886-DI-banner.jpeg`,
  // slide 7 — Sundara Handwashing
  'zurnv49-sundara-z5001-reef-seashell-mobile.png': `${DAM_BASE}/zurnv49-sundara-z5001-reef-seashell.jpeg`,
  'zurnv49-sundara-z5001-reef-seashell.png': `${DAM_BASE}/zurnv49-sundara-z5001-reef-seashell.jpeg`,
  // slide 8 — Build with Confidence (Spec Library)
  'zurnv49-specification-library-banner-mobile.png': `${DAM_BASE}/zurnv49-specification-library-banner.jpeg`,
  'zurnv49-specification-library-banner.png': `${DAM_BASE}/zurnv49-specification-library-banner.jpeg`,
};

function filenameOf(src) {
  try {
    const noQuery = src.split('?')[0].replace(/\/$/, '');
    return noQuery.split('/').pop().toLowerCase();
  } catch (e) {
    return '';
  }
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const hero = element.querySelector(HERO_SELECTOR);
  if (!hero) return;

  hero.querySelectorAll('img').forEach((im) => {
    const src = im.getAttribute('src') || '';
    const dam = IMAGE_MAP[filenameOf(src)];
    if (dam) {
      im.setAttribute('src', dam);
      // strip srcset so the DAM src is used verbatim (no stale responsive URLs)
      im.removeAttribute('srcset');
    }
  });

  // <picture><source srcset> siblings can override the <img src>; drop their
  // srcset when the picture wraps a rewritten hero image.
  hero.querySelectorAll('source[srcset]').forEach((s) => {
    const set = s.getAttribute('srcset') || '';
    if (Object.keys(IMAGE_MAP).some((fn) => set.toLowerCase().includes(fn))) {
      s.removeAttribute('srcset');
    }
  });
}
