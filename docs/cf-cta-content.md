# Content Fragments — Standard CTA model (reused, renamed)

Reuse the standard Adobe reference-demo **CTA / teaser** Content Fragment model
(rebuild it under a new name, e.g. `zurn-cta`). Fields:

| Field | Type | Notes |
|---|---|---|
| `title` | Single-line text | headline |
| `description` | Multi-line / rich text | supporting copy |
| `image` | Content reference | asset in `/content/dam/zurn/en/...` |
| `ctaText` | Single-line text | button/link label |
| `ctaLink` | Content reference / text | destination path |

All values below are pulled from our migrated Zurn content.

---

## Fragment A — Product CTA (Camaya soap dispenser)

| Field | Value |
|---|---|
| `title` | `Camaya Series® Sensor Foaming Soap Dispenser` |
| `description` | `Hygienic hands-free operation that coordinates perfectly with the matching sensor faucet. Durable construction stands up to heavy commercial use in a sophisticated restroom environment.` |
| `image` | `/content/dam/zurn/en/images/en/total-restroom-solutions.jpg` *(or scene7 `Z6953-FSD-BN_R_RDR`)* |
| `ctaText` | `View Product` |
| `ctaLink` | `/products/finish-plumbing/soap-dispensers/z6953-fsd` |

---

## Fragment B — Market CTA (K-12 Education)

| Field | Value |
|---|---|
| `title` | `K-12 Education` |
| `description` | `Enhance your K-12 learning environment with touchless, hygienic fixtures and safer hydration.` |
| `image` | `/content/dam/zurn/en/images/en/zurnv49-home-k-12-education.jpg` |
| `ctaText` | `View K-12 Solutions` |
| `ctaLink` | `/en/markets/k12education` |

---

## Optional extra market CTAs (same model, quick to add)

| title | description | ctaText | ctaLink | image |
|---|---|---|---|---|
| Health Care | Optimize patient care and staff performance with touchless fixtures, a safer water system and filtered drinking water. | View Health Care Solutions | `/en/markets/healthcare` | `/content/dam/zurn/en/images/en/zurnv49-home-healthcare.jpg` |
| Waterworks | Lower ownership costs and simplify maintenance with Wilkins backflow preventers, control valves and PRVs. | View Waterworks Solutions | `/en/markets/waterworks` | `/content/dam/zurn/en/images/en/zurnv49-home-waterworks-6x4.jpg` |
| Commercial | Improve office building hygiene and water quality while minimizing waste and maintenance. | View Commercial Solutions | `/en/markets/commercial` | `/content/dam/zurn/en/images/en/zurnv49-home-commercial.jpg` |

---

### Notes
- Image paths above assume the `zurn-homepage-assets` DAM package is installed
  (`/content/dam/zurn/en/images/en/...`). If not, use the scene7 URL instead.
- This is the same 5-field model as the standard CTA CF — no new model design,
  just rename + populate. Reuses our existing `contentfragment` / `promotion`
  EDS blocks to render on a page.
