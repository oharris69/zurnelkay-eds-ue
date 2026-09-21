/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-stat. Base: columns.
 * Source: https://www.zurn.ca/fr/markets/k12education (market-solution template —
 *   .lkcontainer.w-max-1000.flex-just-center)
 * Project type: xwalk. Columns block — per hinting rules, Columns blocks carry
 *   NO field hints; cells hold default content only. Each child cell maps to a
 *   columns-stat-cell item (richtext `content`).
 *
 * Structure (Columns — 1 row, N cells):
 *   Row 1 (header) : block name (added by createBlock).
 *   Row 2          : one cell per stat column:
 *                      Cell 1 = large stat figure + label (from first .lktext).
 *                      Cell 2 = supporting paragraph/quote (from second .lktext).
 */
export default function parse(element, { document }) {
  // Each direct .lktext (its inner .cmp-text content) becomes one column cell.
  const textBlocks = Array.from(
    element.querySelectorAll(':scope > div > .lktext, :scope > .lktext, .lktext'),
  );

  // De-duplicate (querySelectorAll variations may overlap) while preserving order.
  const seen = new Set();
  const columns = [];
  textBlocks.forEach((tb) => {
    if (seen.has(tb)) return;
    seen.add(tb);
    const inner = tb.querySelector('.cmp-text') || tb;
    const contentEls = Array.from(inner.children).filter((el) => el.textContent.trim());
    if (contentEls.length) columns.push(contentEls);
  });

  // Empty-block guard.
  if (!columns.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single content row: one cell per column (no field hints for Columns blocks).
  const row = columns.map((els) => els);
  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-stat', cells });
  element.replaceWith(block);
}
