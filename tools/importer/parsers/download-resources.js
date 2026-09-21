/* eslint-disable */
/* global WebImporter */
/**
 * Parser for download-resources. Base: download-list.
 * Source: https://www.zurn.com (product-detail template — .ze-resources-listing / .ze-resources)
 * Project type: xwalk (container block; per-item model: link + label).
 *
 * Structure (per xwalk model `download-resources-item`):
 *   Container block — one row per item, two cells: [ link | label ].
 *   - Resource link: link cell holds the document anchor, label cell its text.
 *   - Subgroup heading (e.g. "Other"): a text-only row — link cell empty,
 *     label cell holds the heading text. The block's decorate treats a
 *     link-less row as a subgroup heading.
 *   Field hints (<!-- field:link -->, <!-- field:label -->) are mandatory for
 *   content cells; empty cells carry no hint (hinting rules).
 */
export default function parse(element, { document }) {
  const cells = [];

  function pushLabelOnlyRow(text) {
    const label = (text || '').replace(/\s+/g, ' ').trim();
    if (!label) return;
    const labelFrag = document.createDocumentFragment();
    labelFrag.appendChild(document.createComment(' field:label '));
    labelFrag.appendChild(document.createTextNode(label));
    cells.push(['', labelFrag]);
  }

  function pushLinkRow(anchor) {
    const href = anchor.getAttribute('href');
    if (!href) return;
    const textEl = anchor.querySelector('.cmp-button__text');
    const label = (textEl ? textEl.textContent : anchor.textContent).replace(/\s+/g, ' ').trim();

    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = label || href;
    const linkFrag = document.createDocumentFragment();
    linkFrag.appendChild(document.createComment(' field:link '));
    linkFrag.appendChild(a);

    let labelCell = '';
    if (label) {
      const labelFrag = document.createDocumentFragment();
      labelFrag.appendChild(document.createComment(' field:label '));
      labelFrag.appendChild(document.createTextNode(label));
      labelCell = labelFrag;
    }

    cells.push([linkFrag, labelCell]);
  }

  // Prefer per-section walking so a subgroup heading precedes its links.
  const sections = Array.from(element.querySelectorAll('.ze-resource-section'));
  if (sections.length) {
    sections.forEach((section) => {
      const heading = section.querySelector('.ze-resource-section-label');
      if (heading) pushLabelOnlyRow(heading.textContent);
      Array.from(section.querySelectorAll('a[href]')).forEach(pushLinkRow);
    });
  } else {
    // Fallback: no explicit sections — emit each anchor as a link row.
    Array.from(element.querySelectorAll('a[href]')).forEach(pushLinkRow);
  }

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'download-resources', cells });
  element.replaceWith(block);
}
