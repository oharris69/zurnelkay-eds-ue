/**
 * columns-product — product-detail two-column layout.
 * Row 1: [ product image | product info (SKU eyebrow, title, description,
 *          "Where to Buy" CTA, selling-features bullet list) ].
 * A "Retrofit"-style badge row may follow beneath the image cell.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    row.classList.add('columns-product-row');
    const cols = [...row.children];
    row.classList.add(`columns-product-${cols.length}-cols`);

    cols.forEach((col) => {
      // Image cell: a column whose only content is a picture.
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          col.classList.add('columns-product-img-col');
        }
      } else {
        // Info cell: heading + copy + CTA + features list.
        col.classList.add('columns-product-info-col');
      }
    });
  });
}
