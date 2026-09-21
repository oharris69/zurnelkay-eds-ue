/**
 * columns-stat — two-column stat callout.
 * Left cell: a large emphasized figure + supporting label.
 * Right cell: a supporting paragraph.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-stat-row');
    const cells = [...row.children];
    cells.forEach((col, i) => {
      col.classList.add(i === 0 ? 'columns-stat-figure' : 'columns-stat-body');
    });
  });
}
