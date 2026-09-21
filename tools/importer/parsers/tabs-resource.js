/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-resource. Base: tabs.
 * Source: https://www.zurn.ca/fr.html (homepage template — #ZurnResources).
 * Project type: xwalk. Container block — 2 columns, one row per tab. Each row
 *   maps to a tabs-resource-item: label [text], text [richtext].
 *
 * Structure (Tabs — first row is the block name; one row per tab):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each tab row   : Cell 1 = tab label (field:label — plain text),
 *                    Cell 2 = panel content — a grid of resource-link cards, each
 *                             an icon/image link + linked heading + description
 *                             (field:text — richtext).
 */
export default function parse(element, { document }) {
  const labels = Array.from(element.querySelectorAll('.cmp-tabs__tab, [role="tab"]'));
  const panels = Array.from(element.querySelectorAll('.cmp-tabs__tabpanel, [role="tabpanel"]'));

  const cells = [];

  panels.forEach((panel, i) => {
    const labelEl = labels[i];
    const labelText = (labelEl ? labelEl.textContent : '').replace(/\s+/g, ' ').trim();

    // Cell 1: tab label (field:label — plain text).
    const labelCell = document.createDocumentFragment();
    if (labelText) {
      labelCell.appendChild(document.createComment(' field:label '));
      labelCell.appendChild(document.createTextNode(labelText));
    }

    // Cell 2: panel content — the grid of resource-link cards (field:text).
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    const cards = Array.from(panel.querySelectorAll('.lkmediatext, .cmp-mediatext'));
    if (cards.length) {
      // Emit each resource card's linked heading + description into the richtext
      // field. The per-card icon is intentionally omitted: the `text` field is a
      // single richtext, and md2jcr's richtext is greedy but stops at any image —
      // multiple interspersed images would each demand their own model field
      // (which this 2-field label/text model doesn't have). The linked heading
      // preserves the resource link, so no navigation is lost.
      const seen = new Set();
      cards.forEach((card) => {
        // Guard against nested duplicates (.lkmediatext contains .cmp-mediatext).
        const media = card.querySelector('.cmp-mediatext') || card;
        if (seen.has(media)) return;
        seen.add(media);

        const descBlock = media.querySelector('.cmp-teaser__description');
        if (descBlock) {
          Array.from(descBlock.children).forEach((el) => textCell.appendChild(el));
        }
      });
    } else {
      // Fallback: any headings / paragraphs in the panel (skip images for the
      // same single-richtext reason as above).
      Array.from(panel.querySelectorAll('h1, h2, h3, h4, h5, h6, p'))
        .filter((el) => el.textContent.trim() && !el.querySelector('img'))
        .forEach((el) => textCell.appendChild(el));
    }

    if (labelText || textCell.childNodes.length > 1) {
      cells.push([labelCell, textCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-resource', cells });
  element.replaceWith(block);
}
