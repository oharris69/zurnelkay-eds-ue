/**
 * carousel-hero — full-bleed rotating hero banner.
 * Each block row is one slide: a background image + overlay text
 * (heading, paragraph, optional CTA). Prev/next arrows + dots; optional
 * autoplay via the block's boolean `autoplay` field.
 *
 * In Universal Editor the parent block's `autoplay` field renders as an extra
 * single-cell row (its text is "true"/"false"). We consume it as config rather
 * than treating it as a slide, and we call moveInstrumentation() when re-homing
 * each slide row so the Universal Editor keeps its per-slide edit instrumentation
 * (image picker + overlay text).
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

let heroCarouselCount = 0;

// A slide row has a background image and/or overlay content. The autoplay
// config row is a single cell whose only text is a boolean ("true"/"false").
function isConfigRow(row) {
  const cells = [...row.children];
  if (cells.length !== 1) return false;
  if (row.querySelector('picture, img, a')) return false;
  const txt = (row.textContent || '').trim().toLowerCase();
  return txt === 'true' || txt === 'false' || txt === '';
}

export default function decorate(block) {
  heroCarouselCount += 1;
  const instance = heroCarouselCount;
  const rows = [...block.children];

  // Read + remove the autoplay config row so it never renders as a slide.
  let autoplay = false;
  const configRow = rows.find(isConfigRow);
  if (configRow) {
    autoplay = (configRow.textContent || '').trim().toLowerCase() === 'true';
    configRow.remove();
  }
  const slideRows = rows.filter((r) => r !== configRow);

  const track = document.createElement('div');
  track.className = 'carousel-hero-track';

  const slides = [];
  slideRows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-hero-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.id = `carousel-hero-${instance}-slide-${i + 1}`;
    // Preserve Universal Editor edit instrumentation for this slide item.
    moveInstrumentation(row, slide);

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.classList.add('carousel-hero-bg');
      } else {
        cell.classList.add('carousel-hero-content');
      }
      slide.append(cell);
    });
    if (i !== 0) slide.hidden = true;
    slides.push(slide);
    track.append(slide);
  });

  const nav = document.createElement('div');
  nav.className = 'carousel-hero-dots';

  let current = 0;
  function show(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, idx) => { s.hidden = idx !== current; });
    [...nav.children].forEach((d, idx) => d.setAttribute('aria-selected', idx === current ? 'true' : 'false'));
  }

  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-hero-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.addEventListener('click', () => show(i));
    nav.append(dot);
  });

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-hero-arrow carousel-hero-prev';
  prev.setAttribute('aria-label', 'Previous slide');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-hero-arrow carousel-hero-next';
  next.setAttribute('aria-label', 'Next slide');

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));

  block.textContent = '';
  block.append(track, prev, next, nav);

  // Optional auto-advance when the author enables the autoplay field.
  if (autoplay && slides.length > 1) {
    setInterval(() => show(current + 1), 6000);
  }
}
