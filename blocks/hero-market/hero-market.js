/**
 * hero-market — full-bleed vertical-market hero.
 *
 * Authored content: one cell with a background image (picture) and one cell
 * with the overlay text (heading + subheading). The image becomes a full-bleed
 * background; the text overlays at the bottom-left.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  const rows = [...block.children];
  let picture = null;
  const textNodes = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && !picture) {
        picture = pic;
      } else if (cell.textContent.trim()) {
        textNodes.push(...cell.childNodes);
      }
    });
  });

  block.textContent = '';

  if (picture) {
    const bg = document.createElement('div');
    bg.className = 'hero-market-bg';
    bg.append(picture);
    block.append(bg);
  }

  const content = document.createElement('div');
  content.className = 'hero-market-content';
  textNodes.forEach((n) => content.append(n));
  block.append(content);
}
