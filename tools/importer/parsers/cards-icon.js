/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-icon. Base: cards.
 * Source: https://www.zurn.ca/fr/markets/k12education (market-solution template —
 *   .teaserv2.core-scheme-blacktext.teaser-text-center:not(.larger-fonts))
 * Project type: xwalk. Container block — each row is one card mapping to a
 *   cards-icon-card item: image [reference], imageAlt [collapsed], text [richtext].
 *
 * Note: the DOM selector matches one teaser element per card, so this parser
 *   turns the matched element into a single card row. When several sibling
 *   teasers are present on a page they are each parsed independently and land
 *   as adjacent rows of the same cards-icon block.
 *
 * Structure (Cards — one row per card, 2 cells):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each card row  : Cell 1 = icon/image (field:image; imageAlt collapses to alt),
 *                    Cell 2 = text — title + description + optional CTA (field:text).
 */
export default function parse(element, { document }) {
  // --- Icon / image ---
  const imageEl =
    element.querySelector('.cmp-teaser__image img, .cmp-image img') ||
    element.querySelector('.cmp-teaser__content img, img');

  // --- Text: title + description + optional CTA (richtext) ---
  const desc = element.querySelector('.cmp-teaser__description') || element;
  const textEls = Array.from(desc.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p'))
    .filter((el) => el.textContent.trim());
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href]');
  if (cta) textEls.push(cta);

  // Empty-block guard.
  if (!imageEl && !textEls.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Cell 1: image (field:image; imageAlt collapses into the <img> alt).
  const imageCell = document.createDocumentFragment();
  if (imageEl) {
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(imageEl);
  }

  // Cell 2: text (field:text).
  const textCell = document.createDocumentFragment();
  if (textEls.length) {
    textCell.appendChild(document.createComment(' field:text '));
    textEls.forEach((el) => textCell.appendChild(el));
  }

  // One card row, two cells. Pad an empty cell with '' (no hint) so both exist.
  const cells = [[
    imageEl ? imageCell : '',
    textEls.length ? textCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icon', cells });
  element.replaceWith(block);
}
