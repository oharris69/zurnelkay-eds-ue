/**
 * cards-feature — three-up feature card grid.
 * Each card: icon + bold title + description + a photo.
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'cards-feature-list';

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    li.className = 'cards-feature-item';
    [...row.children].forEach((cell) => {
      const pic = cell.querySelector('picture');
      const onlyPic = pic && cell.children.length === 1
        && (cell.firstElementChild === pic || cell.querySelector(':scope > p > picture'));
      if (onlyPic) cell.classList.add('cards-feature-photo');
      else cell.classList.add('cards-feature-body');
      li.append(cell);
    });
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
