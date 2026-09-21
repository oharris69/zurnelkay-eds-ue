/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-product. Base: columns.
 * Source: https://www.zurn.com (product-detail template — #PDPGrid)
 * Project type: xwalk (Columns block — NO field hints per hinting rules;
 * cells hold default content only).
 *
 * Structure (Columns block):
 *   One content row, two cells:
 *     Cell 1 (left)  = product image (from the media carousel).
 *     Cell 2 (right) = product info: SKU eyebrow, product title (h1),
 *                      description paragraph, "Where to Buy" CTA, and the
 *                      selling-features bullet list.
 */
export default function parse(element, { document }) {
  // --- Left cell: product image ---
  // Prefer the real product image inside the media carousel; skip data-URI
  // arrow icons used by the carousel controls.
  const imageCell = [];
  const productImg = element.querySelector(
    '#productMedia .splide__slide img, #productMedia img.pdp-image, .pdp-image',
  );
  if (productImg && !(productImg.getAttribute('src') || '').startsWith('data:')) {
    imageCell.push(productImg);
  }

  // --- Right cell: product info ---
  const infoCell = [];

  // SKU eyebrow.
  const sku = element.querySelector('.product-sku');
  if (sku) infoCell.push(sku);

  // Product title.
  const title = element.querySelector('.product-name, h1');
  if (title) infoCell.push(title);

  // Description paragraph(s).
  const desc = element.querySelector('.product-description');
  if (desc && desc.textContent.trim()) infoCell.push(desc);
  const addlDesc = element.querySelector('.product-additional-description');
  if (addlDesc && addlDesc.textContent.trim()) infoCell.push(addlDesc);

  // "Where to Buy" CTA — build a clean anchor from the styled button.
  const ctaAnchor = element.querySelector('#pdp-content-cta a[href], .lkcta a[href]');
  if (ctaAnchor && ctaAnchor.getAttribute('href')) {
    const a = document.createElement('a');
    a.setAttribute('href', ctaAnchor.getAttribute('href'));
    a.textContent = (ctaAnchor.textContent || '').replace(/\s+/g, ' ').trim();
    infoCell.push(a);
  }

  // Selling-features bullet list — rebuild a clean <ul> from feature text.
  const featureItems = Array.from(element.querySelectorAll('#sellingFeaturesList > li'));
  if (featureItems.length) {
    const ul = document.createElement('ul');
    featureItems.forEach((li) => {
      const textEl = li.querySelector('.selling-features-text');
      const text = (textEl ? textEl.textContent : li.textContent).replace(/\s+/g, ' ').trim();
      if (text) {
        const item = document.createElement('li');
        item.textContent = text;
        ul.appendChild(item);
      }
    });
    if (ul.children.length) infoCell.push(ul);
  }

  // Empty-block guard.
  if (!imageCell.length && !infoCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Two-column row. Pad a missing cell with '' so both cells exist.
  const cells = [[
    imageCell.length ? imageCell : '',
    infoCell.length ? infoCell : '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-product', cells });
  element.replaceWith(block);
}
