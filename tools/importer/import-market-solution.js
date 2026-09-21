/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (form has no parser — it references a JSON sheet)
import heroMarketParser from './parsers/hero-market.js';
import columnsStatParser from './parsers/columns-stat.js';
import columnsBandParser from './parsers/columns-band.js';
import cardsIconParser from './parsers/cards-icon.js';
import tabsAudienceParser from './parsers/tabs-audience.js';
import fragmentBrandsParser from './parsers/fragment-brands.js';

// TRANSFORMER IMPORTS (reused from product-detail — site-wide chrome cleanup applies to all Zurn pages)
import cleanupTransformer from './transformers/zurn-cleanup.js';
import sectionsTransformer from './transformers/zurn-sections.js';
import dmImagesTransformer from './transformers/zurn-dm-images.js';
import formTransformer from './transformers/zurn-form.js';

const parsers = {
  'hero-market': heroMarketParser,
  'columns-stat': columnsStatParser,
  'columns-band': columnsBandParser,
  'cards-icon': cardsIconParser,
  'tabs-audience': tabsAudienceParser,
  'fragment-brands': fragmentBrandsParser,
};

// PAGE TEMPLATE CONFIGURATION — embedded from page-templates.json (market-solution)
const PAGE_TEMPLATE = {
  name: 'market-solution',
  blocks: [
    { name: 'hero-market', instances: ['.lkteaser.teaser-default'] },
    { name: 'columns-stat', instances: ['.lkcontainer.w-max-1000.flex-just-center'] },
    { name: 'columns-band', instances: ['.teaserv2.core-scheme-feature'] },
    { name: 'cards-icon', instances: ['.teaserv2.core-scheme-blacktext.teaser-text-center'] },
    { name: 'tabs-audience', instances: ['.lktabs'] },
    { name: 'fragment-brands', instances: ['.cmp-experiencefragment--brands'] },
    { name: 'form', instances: ['.lkembed.hs-neutral'] },
  ],
  sections: [
    { id: 's1', name: 'breadcrumb', selector: ['.lkbreadcrumb'], style: null, blocks: [], defaultContent: [] },
    { id: 's2', name: 'hero', selector: ['.lkteaser.teaser-default'], style: null, blocks: ['hero-market'], defaultContent: [] },
    { id: 's3', name: 'stat-callout', selector: ['.lkcontainer.w-max-1000.flex-just-center'], style: null, blocks: ['columns-stat'], defaultContent: [] },
    { id: 's4', name: 'band-tco', selector: ['.cmp-experiencefragment--tco-callout'], style: 'dark', blocks: [], defaultContent: [] },
    { id: 's5', name: 'band-hygiene', selector: ['.teaserv2.image-right'], style: 'dark', blocks: ['columns-band'], defaultContent: [] },
    { id: 's6', name: 'band-smart', selector: ['.teaserv2.image-left'], style: 'accent', blocks: ['columns-band'], defaultContent: [] },
    { id: 's7', name: 'brands', selector: ['.cmp-experiencefragment--brands'], style: 'dark', blocks: ['fragment-brands'], defaultContent: [] },
    { id: 's8', name: 'wellness-intro', selector: ['.cmp-experiencefragment--sustainability-section'], style: null, blocks: [], defaultContent: [] },
    { id: 's9', name: 'icon-features', selector: ['.teaserv2.core-scheme-blacktext.teaser-text-center'], style: null, blocks: ['cards-icon'], defaultContent: [] },
    { id: 's10', name: 'sustainability-stats', selector: ['.teaserv2.larger-fonts'], style: null, blocks: [], defaultContent: [] },
    { id: 's11', name: 'upgrades-title', selector: ['.lktitle.title-center'], style: null, blocks: [], defaultContent: [] },
    { id: 's12', name: 'audience-tabs', selector: ['.lktabs'], style: null, blocks: ['tabs-audience'], defaultContent: [] },
    { id: 's13', name: 'contact-form', selector: ['.lkembed.hs-neutral'], style: 'light-grey', blocks: ['form'], defaultContent: [] },
  ],
};

// Order matters: sections runs first so its beforeTransform pass can anchor the
// s13 section break/metadata on .lkembed.hs-neutral BEFORE formTransformer
// replaces that embed with the form-block table.
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  formTransformer, // replace the JS-injected HubSpot embed with a form block referencing the JSON sheet
  dmImagesTransformer,
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    const chosen = [];
    for (const selector of blockDef.instances) {
      const elements = [...document.querySelectorAll(selector)];
      if (!elements.length) continue;
      elements.forEach((element) => {
        const overlaps = chosen.some((c) => c === element || c.contains(element) || element.contains(c));
        if (overlaps) return;
        chosen.push(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
      if (chosen.length) break;
    }
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
