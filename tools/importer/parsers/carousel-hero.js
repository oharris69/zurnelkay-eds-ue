/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.zurn.ca/fr.html (homepage template — #bannerCarousel).
 * Project type: xwalk. Container block — one row per slide mapping to a
 *   carousel-hero-slide item: image [reference], imageAlt [collapses to alt],
 *   text [richtext].
 *
 * Structure (Carousel — first row is the block name; one row per slide):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each slide row : Cell 1 = background image (field:image; imageAlt → alt),
 *                    Cell 2 = overlay text — heading + paragraph + CTA (field:text).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('.cmp-carousel__item'));
  const cells = [];

  items.forEach((item) => {
    // --- Background image: first non-data image; borrow alt if missing. ---
    const imgs = Array.from(item.querySelectorAll('img')).filter(
      (im) => !(im.getAttribute('src') || '').startsWith('data:'),
    );
    const bgImage = imgs[0] || null;
    if (bgImage && !bgImage.getAttribute('alt')) {
      const withAlt = imgs.find((im) => im.getAttribute('alt'));
      if (withAlt) bgImage.setAttribute('alt', withAlt.getAttribute('alt'));
    }

    // --- Overlay text: heading + copy + CTA (richtext). ---
    const desc = item.querySelector('.cmp-teaser__description, .lk-teaser, .cmp-teaser__content') || item;
    const textEls = Array.from(desc.querySelectorAll('h1, h2, h3, h4, h5, p'))
      .filter((el) => el.textContent.trim());
    const cta = item.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href], a.cmp-button');
    if (cta) textEls.push(cta);

    if (!bgImage && !textEls.length) return;

    const imageCell = document.createDocumentFragment();
    if (bgImage) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(bgImage);
    }

    const textCell = document.createDocumentFragment();
    if (textEls.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textEls.forEach((el) => textCell.appendChild(el));
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
