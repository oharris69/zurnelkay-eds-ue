/**
 * carousel-markets — rotating carousel of market cards.
 * Each card: image + market name + short description + a link.
 * Shows multiple cards per view on desktop; arrows page through.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 * moveInstrumentation() preserves each card's Universal Editor edit hooks.
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const viewport = document.createElement('div');
  viewport.className = 'carousel-markets-viewport';
  const track = document.createElement('ul');
  track.className = 'carousel-markets-track';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'carousel-markets-card';
    moveInstrumentation(row, li);
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) cell.classList.add('carousel-markets-image');
      else cell.classList.add('carousel-markets-body');
      li.append(cell);
    });
    track.append(li);
  });
  viewport.append(track);

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'carousel-markets-arrow carousel-markets-prev';
  prev.setAttribute('aria-label', 'Previous');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'carousel-markets-arrow carousel-markets-next';
  next.setAttribute('aria-label', 'Next');

  const step = () => {
    const card = track.querySelector('.carousel-markets-card');
    return card ? card.getBoundingClientRect().width + 24 : 300;
  };
  prev.addEventListener('click', () => viewport.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => viewport.scrollBy({ left: step(), behavior: 'smooth' }));

  block.textContent = '';
  block.append(prev, viewport, next);
}
