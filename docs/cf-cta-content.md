# Content Fragments — Standard CTA model (reused, renamed)

Reuse the standard Adobe reference-demo **CTA / teaser** Content Fragment model
(rebuild it under a new name, e.g. `zurn-cta`). Fields:

| Field | Type | Notes |
|---|---|---|
| `title` | Single-line text | headline |
| `subtitle` | Single-line text | short benefit line (**model addition** — not in the standard 5-field CTA model) |
| `description` | Multi-line / rich text | supporting copy — kept longer so **Generate Variations** (Sites) and **CF Editor Variations** have substance to work from |
| `image` | Content reference | asset in `/content/dam/zurn/en/...` |
| `ctaText` | Single-line text | button/link label |
| `ctaLink` | Content reference / text | destination path |

All values below are pulled from our migrated Zurn content. Descriptions are
2–4 sentences by design: rich enough for Generate Variations to produce
tone/length variants (concise, formal, benefit-led…) and for CF Editor variants
(e.g. `homepage-teaser`, `landing-hero`, `social`).

---

## Fragment A — Product CTA (Camaya soap dispenser)

| Field | Value |
|---|---|
| `title` | `Camaya Series® Sensor Foaming Soap Dispenser` |
| `subtitle` | `Touchless. Coordinated. Built to last.` |
| `description` | `The Camaya Series® sensor foaming soap dispenser delivers hygienic, hands-free operation that coordinates perfectly with the matching Camaya sensor faucet. Its durable construction stands up to heavy commercial use while its refined styling fits sophisticated restroom environments. Works with foaming soap, is ADA compliant, and is available in Polished Chrome, Matte Black, and Brushed Nickel with battery or plug-in power.` |
| `image` | `/content/dam/zurn/en/images/en/total-restroom-solutions.jpg` *(or scene7 `Z6953-FSD-BN_R_RDR`)* |
| `ctaText` | `View Product` |
| `ctaLink` | `/products/finish-plumbing/soap-dispensers/z6953-fsd` |

---

## Fragment B — Market CTA (K-12 Education)

| Field | Value |
|---|---|
| `title` | `K-12 Education` |
| `subtitle` | `Safer, cleaner learning spaces` |
| `description` | `Enhance your K-12 learning environment with touchless, hygienic fixtures and safer hydration solutions. Zurn helps schools reduce the spread of germs, simplify maintenance for busy facilities teams, and deliver cleaner, safer water to students and staff — from restrooms to hydration stations across the campus.` |
| `image` | `/content/dam/zurn/en/images/en/zurnv49-home-k-12-education.jpg` |
| `ctaText` | `View K-12 Solutions` |
| `ctaLink` | `/en/markets/k12education` |

---

## Optional extra market CTAs (same model, quick to add)

### Health Care
| Field | Value |
|---|---|
| `title` | `Health Care` |
| `subtitle` | `Optimize patient care and facility performance` |
| `description` | `Optimize patient care and staff performance by modernizing your facility with touchless fixtures, a safer water system, and filtered drinking water. Zurn's healthcare solutions help control infection risk, meet stringent code requirements, and keep critical spaces running reliably around the clock.` |
| `image` | `/content/dam/zurn/en/images/en/zurnv49-home-healthcare.jpg` |
| `ctaText` | `View Health Care Solutions` |
| `ctaLink` | `/en/markets/healthcare` |

### Waterworks
| Field | Value |
|---|---|
| `title` | `Waterworks` |
| `subtitle` | `Lower ownership costs, simpler maintenance` |
| `description` | `Lower your total cost of ownership and simplify maintenance with Wilkins® backflow preventers, automatic control valves, and pressure reducing valves. Engineered for durability and easier servicing, Zurn's waterworks portfolio helps municipalities and contractors protect the water supply while cutting long-term upkeep.` |
| `image` | `/content/dam/zurn/en/images/en/zurnv49-home-waterworks-6x4.jpg` |
| `ctaText` | `View Waterworks Solutions` |
| `ctaLink` | `/en/markets/waterworks` |

### Commercial
| Field | Value |
|---|---|
| `title` | `Commercial` |
| `subtitle` | `Better hygiene, less waste` |
| `description` | `Improve office building hygiene and water quality while minimizing waste and maintenance. Zurn's commercial solutions bring touchless fixtures, efficient flush valves, and connected water management together — helping building owners deliver a cleaner experience and measurable sustainability gains.` |
| `image` | `/content/dam/zurn/en/images/en/zurnv49-home-commercial.jpg` |
| `ctaText` | `View Commercial Solutions` |
| `ctaLink` | `/en/markets/commercial` |

---

### Notes
- **`subtitle` is a model addition** — the standard reference CTA model has 5
  fields; add `subtitle` (single-line text) if you want it, or fold it into the
  top of `description`.
- **Descriptions are intentionally long** so Generate Variations (Sites) and CF
  Editor Variations have real content to rewrite/shorten/re-tone. The base
  (master) copy should be the fullest version; let variations trim it.
- Image paths assume the `zurn-homepage-assets` DAM package is installed
  (`/content/dam/zurn/en/images/en/...`). If not, use the scene7 URL instead.
- Same core model as the standard CTA CF — no new model design, just rename +
  populate. Reuses our existing `contentfragment` / `promotion` EDS blocks to
  render on a page.
