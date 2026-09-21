/**
 * carousel-hero — full-bleed rotating hero banner.
 * Each block row is one slide: a background image + overlay text
 * (heading, paragraph, optional CTA). Prev/next arrows + dots; optional
 * autoplay via the block's first config row (data-autoplay).
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
let heroCarouselCount = 0;

export default function decorate(block) {
  heroCarouselCount += 1;
  const instance = heroCarouselCount;
  const rows = [...block.children];

  const track = document.createElement('div');
  track.className = 'carousel-hero-track';

  const slides = [];
  rows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-hero-slide';
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.id = `carousel-hero-${instance}-slide-${i + 1}`;

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
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
}
