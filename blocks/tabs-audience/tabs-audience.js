/**
 * tabs-audience — centered text tabs with image+heading+text panels.
 * Each block row is one tab: first cell = tab label, remaining cells = panel
 * content (image + heading + paragraph).
 *
 * Structural decorator only — no brand tokens (design pass owns those).
 * moveInstrumentation() preserves each tab's Universal Editor edit hooks.
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

let tabsAudienceCount = 0;

export default function decorate(block) {
  tabsAudienceCount += 1;
  const instance = tabsAudienceCount;
  const rows = [...block.children];

  const tablist = document.createElement('div');
  tablist.className = 'tabs-audience-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const label = (cells[0]?.textContent || `Tab ${i + 1}`).trim();

    // Panel = everything after the first (label) cell.
    const panel = document.createElement('div');
    panel.className = 'tabs-audience-panel';
    panel.id = `tabs-audience-${instance}-panel-${i + 1}`;
    panel.setAttribute('role', 'tabpanel');
    // Preserve Universal Editor edit instrumentation for this tab item.
    moveInstrumentation(row, panel);

    // Split the panel content into a media column (image) and a body
    // column (heading + text). Authors may place image and text in one
    // cell or in separate cells; normalise both to media + body.
    const media = document.createElement('div');
    media.className = 'tabs-audience-panel-media';
    const body = document.createElement('div');
    body.className = 'tabs-audience-panel-body';

    cells.slice(1).forEach((c) => {
      [...c.childNodes].forEach((node) => {
        const isMedia = node.nodeType === 1
          && (node.matches?.('picture, img') || node.querySelector?.('picture, img'));
        (isMedia ? media : body).append(node);
      });
    });

    if (media.childNodes.length) panel.append(media);
    if (body.childNodes.length) panel.append(body);

    if (i !== 0) panel.hidden = true;
    panels.push(panel);

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'tabs-audience-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.textContent = label;
    tab.addEventListener('click', () => {
      tablist.querySelectorAll('.tabs-audience-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
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
