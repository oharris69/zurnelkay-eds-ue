/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-market. Base: hero.
 * Source: https://www.zurn.ca/fr/markets/k12education (market-solution template — .lkteaser.teaser-default)
 * Project type: xwalk (simple block; model fields: image [reference], imageAlt [collapsed], text [richtext]).
 *
 * Structure (Hero — 1 column, up to 3 rows):
 *   Row 1 (header) : block name (added by createBlock).
 *   Row 2          : Background image  — field:image (imageAlt collapses to the <img> alt attribute).
 *   Row 3          : Overlay text      — field:text (heading + subheading, preserved as richtext).
 * Hero is a 1-column block: each content row is a single cell holding all its elements.
 */
export default function parse(element, { document }) {
  // --- Background image ---
  // Source has a full-bleed banner <img> plus a mobile <img> inside <picture>.
  // Prefer the first non-data image; borrow alt text from any sibling that has it.
  const imgs = Array.from(element.querySelectorAll('img')).filter(
    (im) => !(im.getAttribute('src') || '').startsWith('data:'),
  );
  let bgImage = imgs[0] || null;
  if (bgImage && !bgImage.getAttribute('alt')) {
    const withAlt = imgs.find((im) => im.getAttribute('alt'));
    if (withAlt) bgImage.setAttribute('alt', withAlt.getAttribute('alt'));
  }

  // --- Overlay text: heading + subheading (richtext) ---
  const textContainer = element.querySelector('.cmp-teaser__description, .cmp-lk-teaser__content');
  const textEls = [];
  const heading = (textContainer || element).querySelector('h1, h2, .cmp-teaser__title');
  if (heading) textEls.push(heading);
  // Subheading / supporting copy — headings below the main one and paragraphs.
  const subEls = Array.from(
    (textContainer || element).querySelectorAll('h3, h4, h5, p'),
  ).filter((el) => el !== heading && el.textContent.trim());
  textEls.push(...subEls);
  // CTA(s) if present (optional in this variant).
  const ctas = Array.from(element.querySelectorAll('.cmp-teaser__action-link, a.cmp-button, .cmp-teaser__action-container a[href]'));
  textEls.push(...ctas);

  // Empty-block guard.
  if (!bgImage && !textEls.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (field:image; alt collapses into the <img>).
  if (bgImage) {
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(bgImage);
    cells.push([imageCell]);
  }

  // Row 3: overlay text (field:text).
  if (textEls.length) {
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    textEls.forEach((el) => textCell.appendChild(el));
    cells.push([textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-market', cells });
  element.replaceWith(block);
}
