/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS (form has no parser — it references a JSON sheet)
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import tabsResourceParser from './parsers/tabs-resource.js';
import carouselMarketsParser from './parsers/carousel-markets.js';
import carouselMediaParser from './parsers/carousel-media.js';
import columnsBandParser from './parsers/columns-band.js';

// TRANSFORMER IMPORTS (reused site-wide chrome cleanup applies to all Zurn pages)
import cleanupTransformer from './transformers/zurn-cleanup.js';
import sectionsTransformer from './transformers/zurn-sections.js';
import dmImagesTransformer from './transformers/zurn-dm-images.js';
import formTransformer from './transformers/zurn-form.js';
import heroDamImagesTransformer from './transformers/zurn-hero-dam-images.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-feature': cardsFeatureParser,
  'tabs-resource': tabsResourceParser,
  'carousel-markets': carouselMarketsParser,
  'carousel-media': carouselMediaParser,
  'columns-band': columnsBandParser,
};

// PAGE TEMPLATE CONFIGURATION — embedded from page-templates.json (homepage)
const PAGE_TEMPLATE = {
  name: 'homepage',
  blocks: [
    { name: 'carousel-hero', instances: ['#bannerCarousel'] },
    { name: 'cards-feature', instances: ['#lkcontainer-d0baf9a111'] },
    { name: 'tabs-resource', instances: ['#ZurnResources'] },
    { name: 'carousel-markets', instances: ['#vMarkets'] },
    { name: 'carousel-media', instances: ['#zurnInnovationEfficiencyProducts'] },
    { name: 'columns-band', instances: ['#whyZurn'] },
    { name: 'form', instances: ['#container-9dddb5c103'] },
  ],
  sections: [
    { id: 's1', name: 'hero-carousel', selector: ['#bannerCarousel'], style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 's2', name: 'latest-intro', selector: ['#lktext-51c5ff3e5e'], style: null, blocks: [], defaultContent: ['#lktext-51c5ff3e5e'] },
    { id: 's3', name: 'latest-cards', selector: ['#lkcontainer-d0baf9a111'], style: null, blocks: ['cards-feature'], defaultContent: [] },
    { id: 's4', name: 'resources-intro', selector: ['#lktext-afe1cfcb1a'], style: null, blocks: [], defaultContent: ['#lktext-afe1cfcb1a'] },
    { id: 's5', name: 'resources-tabs', selector: ['#ZurnResources'], style: null, blocks: ['tabs-resource'], defaultContent: [] },
    { id: 's6', name: 'markets-carousel', selector: ['#lkcontainer-04137134ae'], style: 'grey', blocks: ['carousel-markets'], defaultContent: [] },
    { id: 's7', name: 'innovation-media', selector: ['#lkcontainer-92828ff454'], style: null, blocks: ['carousel-media'], defaultContent: [] },
    { id: 's8', name: 'where-to-buy-heading', selector: ['#lktitle-cmp-root-container_533156717-lktitle'], style: null, blocks: [], defaultContent: ['#lktitle-cmp-root-container_533156717-lktitle'] },
    { id: 's9', name: 'rep-locator', selector: ['#lkcontainer-e8a1ecb7fa'], style: null, blocks: [], defaultContent: ['#lkcontainer-e8a1ecb7fa'] },
    { id: 's10', name: 'why-zurn-band', selector: ['#whyZurn'], style: null, blocks: ['columns-band'], defaultContent: [] },
    { id: 's11', name: 'newsletter', selector: ['#container-9dddb5c103'], style: 'dark', blocks: ['form'], defaultContent: [] },
  ],
};

// Order matters: sections runs first so its beforeTransform pass can anchor
// section breaks/metadata on the section elements BEFORE formTransformer replaces
// the newsletter embed with the form-block table.
const transformers = [
  cleanupTransformer,
  heroDamImagesTransformer, // rewrite EN hero banner imgs to DAM paths (beforeTransform, before the hero parser extracts them)
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  formTransformer, // replace the JS-injected HubSpot newsletter embed with a form block referencing the JSON sheet
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
