/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-media. Base: carousel.
 * Source: https://www.zurn.ca/fr.html (homepage template — #lkcontainer-92828ff454).
 * Project type: xwalk. Container block — one row per media tile (slide) mapping
 *   to a carousel-media-tile item: image [reference], imageAlt [→ alt],
 *   text [richtext label].
 *
 * Structure (Carousel — first row is the block name; one row per slide):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each slide row : Cell 1 = tile image (field:image; imageAlt → alt),
 *                    Cell 2 = tile label (field:text — the linked product name).
 *
 * The block is mapped to the carousel child element (#zurnInnovationEfficiencyProducts),
 * so the "Innovation Zurn" intro (heading + paragraph + CTA) stays as section
 * default content beside the block, not inside it — keeping every block row a
 * uniform tile that maps cleanly to the tile model.
 */
export default function parse(element, { document }) {
  const cells = [];

  // --- Slide rows: each real (non-data) linked image tile + its label. ---
  const tiles = Array.from(element.querySelectorAll('a.cmp-image__link'));
  const seenSrc = new Set();
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    const src = img ? (img.getAttribute('src') || '') : '';
    if (!img || src.startsWith('data:') || seenSrc.has(src)) return;
    seenSrc.add(src);

    // Label: the tile's own title paragraph (linked product name).
    const titleP = tile.querySelector('.cmp-image__title')
      || (tile.parentElement && tile.parentElement.querySelector('.cmp-image__title'));
    const labelText = titleP ? titleP.textContent.replace(/\s+/g, ' ').trim() : (img.getAttribute('alt') || '').trim();
    const href = tile.getAttribute('href');

    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    imageCell.appendChild(img);

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (labelText) {
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = labelText;
        textCell.appendChild(a);
      } else {
        const p = document.createElement('p');
        p.textContent = labelText;
        textCell.appendChild(p);
      }
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-media', cells });
  element.replaceWith(block);
}
