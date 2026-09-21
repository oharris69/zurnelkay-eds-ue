/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-audience. Base: tabs.
 * Source: https://www.zurn.ca/fr/markets/k12education (market-solution template — .lktabs)
 * Project type: xwalk. Container block — one row per tab mapping to a
 *   tabs-audience-item: label [text], image [reference], imageAlt [collapsed],
 *   text [richtext].
 *
 * Structure (Tabs — 2 columns, one row per tab):
 *   Row 1 (header) : block name (added by createBlock).
 *   Each tab row   : Cell 1 = tab label (field:label),
 *                    Cell 2 = panel content: image (field:image; imageAlt
 *                             collapses to alt) + heading/copy (field:text).
 */
export default function parse(element, { document }) {
  // Tab labels (in order) and their corresponding panels.
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

    // Cell 2: panel image (field:image; imageAlt collapses into the alt attr).
    const imageCell = document.createDocumentFragment();
    const img = panel.querySelector('img');
    if (img && !(img.getAttribute('src') || '').startsWith('data:')) {
      imageCell.appendChild(document.createComment(' field:image '));
      imageCell.appendChild(img);
    }

    // Cell 3: panel text — heading + copy (field:text richtext).
    const textCell = document.createDocumentFragment();
    const desc = panel.querySelector('.cmp-teaser__description, .cmp-mediatext') || panel;
    const textEls = Array.from(desc.querySelectorAll('h1, h2, h3, h4, h5, h6, p'))
      .filter((el) => el.textContent.trim());
    if (textEls.length) {
      textCell.appendChild(document.createComment(' field:text '));
      textEls.forEach((el) => textCell.appendChild(el));
    }

    // Emit a 3-cell row [label | image | text] aligning to the item model's
    // three column-groups (label, image[+imageAlt], text).
    if (labelText || img || textEls.length) {
      cells.push([labelCell, imageCell, textCell]);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-audience', cells });
  element.replaceWith(block);
}
