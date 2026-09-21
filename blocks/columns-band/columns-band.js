/**
 * columns-band — full-bleed colored media/text band.
 * Two cells: an image and a text block (heading + copy + optional CTA).
 *
 * Options (via block classList, set from section/authoring):
 *   - image-right : image renders on the right (default is image-left)
 *   - dark / teal : background color hint (color applied by section/design)
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('columns-band-row');
    [...row.children].forEach((col) => {
      if (col.querySelector('picture')) {
        col.classList.add('columns-band-media');
      } else {
        col.classList.add('columns-band-text');
      }
    });
  });
}
