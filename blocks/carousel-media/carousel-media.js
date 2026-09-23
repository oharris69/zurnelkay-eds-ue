/**
 * carousel-media — innovation media-tile carousel.
 * Each row = a media tile (image + linked label) shown in a horizontally
 * scrolling carousel, paged with arrows. The "Innovation Zurn" intro
 * (heading + paragraph + CTA) sits beside/above the block as section
 * default content, not inside the block.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 * moveInstrumentation() preserves each tile's Universal Editor edit hooks.
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const viewport = document.createElement('div');
  viewport.className = 'carousel-media-viewport';
  const track = document.createElement('ul');
  track.className = 'carousel-media-track';
  rows.forEach((row) => {
    const li = document.createElement('li');
    li.className = 'carousel-media-tile';
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    track.append(li);
  });
  viewport.append(track);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-media-arrow carousel-media-next';
  next.setAttribute('aria-label', 'Next');
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-media-arrow carousel-media-prev';
  prev.setAttribute('aria-label', 'Previous');
  const step = () => {
    const t = track.querySelector('.carousel-media-tile');
    return t ? t.getBoundingClientRect().width + 16 : 240;
  };
  next.addEventListener('click', () => viewport.scrollBy({ left: step(), behavior: 'smooth' }));
  prev.addEventListener('click', () => viewport.scrollBy({ left: -step(), behavior: 'smooth' }));

  const media = document.createElement('div');
  media.className = 'carousel-media-carousel';
  media.append(prev, viewport, next);

  block.textContent = '';
  block.append(media);
}
