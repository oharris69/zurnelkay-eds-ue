/**
 * cards-icon — four-up icon feature row.
 * Each card: an icon (image/svg) + title + short description, centered.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-icon-list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-icon-item';
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      if (pic && cell.children.length === 1 && cell.querySelector(':scope > picture, :scope > p > picture')) {
        cell.classList.add('cards-icon-icon');
      } else {
        cell.classList.add('cards-icon-body');
      }
      li.append(cell);
    });
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
