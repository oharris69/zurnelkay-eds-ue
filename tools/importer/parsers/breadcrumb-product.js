/* eslint-disable */
/* global WebImporter */
/**
 * Parser for breadcrumb-product. Base: breadcrumb.
 * Source: https://www.zurn.com (product-detail template — .lk-breadcrumbs)
 * Project type: xwalk (container block; per-crumb item model: link + label).
 *
 * Structure (per xwalk model `breadcrumb-product-crumb`):
 *   Container block — one row per crumb, two cells: [ link | label ].
 *   - Linked crumb (ancestor): link cell has the anchor, label cell has its text.
 *   - Current-page crumb (no link): link cell left empty, label cell has the text.
 *   Field hints (<!-- field:link -->, <!-- field:label -->) are mandatory for
 *   content cells; empty cells carry no hint (hinting rules).
 */
export default function parse(element, { document }) {
  // Each <li> in the breadcrumb list is one crumb. Fallback to any anchor list.
  let items = Array.from(element.querySelectorAll('li'));
  if (!items.length) {
    // No list items — treat each direct anchor as a crumb.
    items = Array.from(element.querySelectorAll('a')).map((a) => {
      const wrap = document.createElement('span');
      wrap.appendChild(a.cloneNode(true));
      return wrap;
    });
  }

  const cells = [];

  items.forEach((item) => {
    const srcLink = item.querySelector('a[href]');
    const label = (srcLink ? srcLink.textContent : item.textContent).replace(/\s+/g, ' ').trim();
    if (!label) return;

    // --- link cell (aem-content) ---
    let linkCell = '';
    if (srcLink && srcLink.getAttribute('href')) {
      const anchor = document.createElement('a');
      anchor.setAttribute('href', srcLink.getAttribute('href'));
      anchor.textContent = label;
      const linkFrag = document.createDocumentFragment();
      linkFrag.appendChild(document.createComment(' field:link '));
      linkFrag.appendChild(anchor);
      linkCell = linkFrag;
    }

    // --- label cell (text) ---
    const labelFrag = document.createDocumentFragment();
    labelFrag.appendChild(document.createComment(' field:label '));
    labelFrag.appendChild(document.createTextNode(label));

    cells.push([linkCell, labelFrag]);
  });

  // Empty-block guard: nothing meaningful extracted.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'breadcrumb-product', cells });
  element.replaceWith(block);
}
