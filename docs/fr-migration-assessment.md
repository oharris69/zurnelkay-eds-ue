# Assessment: Migrating zurn.ca /fr for a French language-master

**Date:** 2026-09-21  **Source:** https://www.zurn.ca/fr.html  **Scope:** assess only (no migration)

## 1. Reachability
- zurn.ca is CloudFront/bot-protected (403 on direct fetch), same as zurn.com.
- Scraping requires the Bright Data fallback — our import pipeline already handles this.

## 2. Key structural finding: products are English & shared, not French
- Product pages on zurn.ca (`/products/...`) render in **English**, byte-identical
  structure/content to the US product pages (verified on 3nl-gasket).
- Product nav/footer links point to bare `/products/...` (no `/fr` prefix).
- Only marketing / markets / resources / news pages are truly localized under `/fr/...`.
- **Implication:** there is NO French product-detail content to migrate. The 88
  EN product pages already live under /en/products and are shared across US & CA.

## 3. French inventory (from /fr/sitemap.html) — 113 pages
| Section | Pages | Maps to EN template family | Infra status |
|---|---|---|---|
| /fr/innovation-efficiency/* | 28 | campaign-landing / campaign-landing-* | NOT built (EN campaign-landing not migrated) |
| /fr/news-media/* (releases, archive, success-stories, kits) | 33 | press-release, customer-success-story | NOT built |
| /fr/resources/* (incl. technical-resources ×17, specification) | 27 | technical-resource, resources-hub, specification-landing | NOT built |
| /fr/markets/* | 12 | market-solution | NOT built |
| top-level (/fr home, about-us, wilkins, contact, terms, sitemap, patents, cookie, aoda) | 9 | homepage, legal-text/terms, promo | NOT built |
| /fr/support/* | 4 | support-page, registration-form | NOT built |

## 4. Template reuse vs new work
- The `product-detail` template we fully built (blocks/parsers/transformers/JCR) does
  NOT apply to any /fr page — French content is entirely different template families.
- All FR sections correspond to EN templates we CATALOGUED during site-scope but have
  NOT yet migrated (built infra for). So /fr is net-new template work, per family:
  campaign-landing, market-solution, press-release, customer-success-story,
  technical-resource, resources-hub, homepage, legal/support.
- Blocks/design (Gotham Zurn, Zurn blue, section variants) and the JCR packaging
  tooling ARE reusable across all of it.

## 5. Recommended locale architecture (matches how the source works)
- Keep ONE English product catalog at /en/products (already live). Do NOT duplicate
  products into /fr.
- Add /fr only for the localized marketing/markets/resources/news pages.
- US site = /en tree (products + EN marketing, when migrated).
- CA site = /fr marketing/resources + the SHARED /en products.
- This is the "shared products, localized marketing" model.

## 6. Suggested phased plan (when you greenlight migration)
Migrate by template family, French + English together (same infra serves both locales):
1. market-solution (12 FR + ~1 EN) — self-contained, high value, one template.
2. technical-resource + resources-hub (~44 FR) — link-list heavy, simpler blocks.
3. campaign-landing family (28 FR) — richest layout, most new blocks.
4. press-release + customer-success-story (33 FR) — article templates.
5. homepage + legal/support/misc (13 FR).

## 7. Effort notes
- Each new template family = page analysis + block generation + parsers/transformers
  + design, like product-detail took. Budget ~1 template-family per work session.
- FR text is already French in source, so no translation step — straight migration.
- Bright Data quota: ~113 FR page fetches (bot-protected), plus re-fetches during
  parser iteration.
