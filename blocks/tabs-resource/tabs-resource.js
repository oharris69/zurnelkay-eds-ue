/**
 * tabs-resource — tabbed resource switcher.
 * Each block row is one tab: first cell = tab label; the remaining cell holds
 * a grid of resource-link cards (icon + linked title + short description).
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 * moveInstrumentation() preserves each tab's Universal Editor edit hooks.
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabsResourceCount = 0;

export default function decorate(block) {
  tabsResourceCount += 1;
  const instance = tabsResourceCount;
  const rows = [...block.children];

  const tablist = document.createElement('div');
  tablist.className = 'tabs-resource-list';
  tablist.setAttribute('role', 'tablist');
  const panels = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const label = (cells[0]?.textContent || `Tab ${i + 1}`).trim();

    const panel = document.createElement('div');
    panel.className = 'tabs-resource-panel';
    panel.id = `tabs-resource-${instance}-panel-${i + 1}`;
    panel.setAttribute('role', 'tabpanel');
    // Preserve Universal Editor edit instrumentation for this tab item.
    moveInstrumentation(row, panel);
    const grid = document.createElement('div');
    grid.className = 'tabs-resource-grid';
    // Remaining cells hold a flat run of resource groups (icon link, linked
    // heading, optional description). Split that run into one card per
    // resource, starting a new card at each icon paragraph so each renders as
    // an independent grid cell (icon above title above description).
    const isIcon = (node) => node.nodeType === 1
      && node.tagName === 'P'
      && !!node.querySelector('a img, a picture');
    const isEmpty = (node) => node.nodeType === 8 // comment
      || (node.nodeType === 3 && !node.textContent.trim()); // whitespace text
    cells.slice(1).forEach((c) => {
      let card = null;
      [...c.childNodes].forEach((node) => {
        // Skip leading comments/whitespace so cards don't start empty.
        if (!card && isEmpty(node)) return;
        if (!card || isIcon(node)) {
          card = document.createElement('div');
          card.className = 'tabs-resource-card';
          grid.append(card);
        }
        card.append(node);
      });
    });
    panel.append(grid);
    if (i !== 0) panel.hidden = true;
    panels.push(panel);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-resource-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.textContent = label;
    tab.addEventListener('click', () => {
      tablist.querySelectorAll('.tabs-resource-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
      panels.forEach((p) => { p.hidden = true; });
      tab.setAttribute('aria-selected', 'true');
      panel.hidden = false;
    });
    tablist.append(tab);
  });

  block.textContent = '';
  block.append(tablist);
  panels.forEach((p) => block.append(p));
}
