/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-band. Base: columns.
 * Source: https://www.zurn.ca/fr/markets/k12education (market-solution template —
 *   .teaserv2.core-scheme-feature)
 * Project type: xwalk. Columns block — per hinting rules, Columns blocks carry
 *   NO field hints; cells hold default content only. Each child cell maps to a
 *   columns-band-cell item (richtext `content`). The parent model's `classes`
 *   select (Image Left default / Image Right) is emitted as a block variant.
 *
 * Structure (Columns — 1 row, 2 cells):
 *   Row 1 (header) : block name + optional variant "image-right".
 *   Row 2          : Cell 1 = image, Cell 2 = text (heading + copy + optional CTA).
 *                    Cell order follows reading order; the image-left/right
 *                    layout is conveyed by the variant, not by swapping cells.
 */
export default function parse(element, { document }) {
  // --- Image ---
  // Prefer the dedicated image container; fall back to any content image.
  const imageEl =
    element.querySelector('.cmp-teaser__image img, .cmp-image img') ||
    element.querySelector('.cmp-teaser__content img, img');

  // --- Text: heading + copy + optional CTA (richtext) ---
  // Two source layouts share this variant:
  //   (a) market-solution teasers: a .cmp-teaser__description holds the copy and
  //       a .cmp-teaser__action-link holds the CTA;
  //   (b) the /fr homepage "Pourquoi Zurn?" band: a .cmp-text block holds the
  //       heading + copy and a separate .lkcta .cmp-button holds the CTA.
  // Prefer the teaser description; fall back to the text block, else the element.
  const desc = element.querySelector('.cmp-teaser__description, .cmp-text') || element;
  const textEls = Array.from(desc.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > p'))
    .filter((el) => el.textContent.trim());
  const cta = element.querySelector('.cmp-teaser__action-link, .cmp-teaser__action-container a[href], .lkcta a[href], a.cmp-button[href]');
  if (cta) textEls.push(cta);

  // Empty-block guard.
  if (!imageEl && !textEls.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Detect image-right layout from source classes (default is image-left).
  const variants = [];
  if (element.classList.contains('image-right')) variants.push('image-right');

  // Two-column row: [ image | text ]. Pad a missing cell with '' so both exist.
  const cells = [[
    imageEl ? [imageEl] : '',
    textEls.length ? textEls : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-band', variants, cells });
  element.replaceWith(block);
}
