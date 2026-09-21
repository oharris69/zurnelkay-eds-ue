/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import breadcrumbProductParser from './parsers/breadcrumb-product.js';
import columnsProductParser from './parsers/columns-product.js';
import downloadResourcesParser from './parsers/download-resources.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/zurn-cleanup.js';
import sectionsTransformer from './transformers/zurn-sections.js';
import dmImagesTransformer from './transformers/zurn-dm-images.js';

// PARSER REGISTRY
const parsers = {
  'breadcrumb-product': breadcrumbProductParser,
  'columns-product': columnsProductParser,
  'download-resources': downloadResourcesParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'product-detail',
  description: 'Product detail page with product image, title, description, feature bullets and a dark resources download band',
  urls: [
    'https://www.zurn.com/products/drainage-interceptors/cleanouts/cleanouts/3nl-gasket',
  ],
  blocks: [
    { name: 'breadcrumb-product', instances: ['.lk-breadcrumbs'] },
    { name: 'columns-product', instances: ['#PDPGrid'] },
    { name: 'download-resources', instances: ['.ze-resources-listing', '.ze-resources'] },
  ],
  sections: [
    {
      id: 's1', name: 'breadcrumb', selector: ['.lk-breadcrumbs'], style: null, blocks: ['breadcrumb-product'], defaultContent: [],
    },
    {
      id: 's2', name: 'product-detail-grid', selector: ['#PDPGrid'], style: null, blocks: ['columns-product'], defaultContent: [],
    },
    {
      id: 's3', name: 'resources', selector: ['.ze-resources'], style: 'dark', blocks: ['download-resources'], defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, DM images, then section breaks/metadata last
const transformers = [
  cleanupTransformer,
  dmImagesTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
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

/**
 * Find all blocks on the page based on the embedded template configuration.
 * Selectors within a single block are tried in order; once a block matches,
 * later (broader/fallback) selectors for that same block are ignored, and any
 * match nested inside an already-selected element of the same block is skipped
 * (prevents double-wrapping when selectors are nested, e.g. .ze-resources-listing
 * inside .ze-resources).
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    const chosen = [];
    for (const selector of blockDef.instances) {
      const elements = [...document.querySelectorAll(selector)];
      if (!elements.length) continue;
      elements.forEach((element) => {
        // Skip if this element is contained by, or contains, an already-chosen
        // element for this same block (nested/fallback selector overlap).
        const overlaps = chosen.some((c) => c === element || c.contains(element) || element.contains(c));
        if (overlaps) return;
        chosen.push(element);
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
      // First selector that yields matches wins; stop trying fallbacks.
      if (chosen.length) break;
    }
    if (!chosen.length) {
      console.warn(`Block "${blockDef.name}" selectors not found: ${blockDef.instances.join(', ')}`);
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

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks on the page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip elements already detached by a prior parser)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + DM image anchors + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized document path (map root URL to /index)
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
