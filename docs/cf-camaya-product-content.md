# Content Fragment — Camaya Series® Sensor Foaming Soap Dispenser

Ready-to-paste field values for a **Product** Content Fragment model in AEM.
Source: migrated product-detail page `content/products/finish-plumbing/soap-dispensers/z6953-fsd`
(live at `/products/finish-plumbing/soap-dispensers/z6953-fsd`).

---

## Suggested CF model: `product`

| Field name | Type | Value |
|---|---|---|
| `title` | Single-line text | `Camaya Series® Sensor Foaming Soap Dispenser` |
| `productId` | Single-line text | `Z6953-FSD` |
| `category` | Single-line text | `Finish Plumbing / Soap Dispensers` |
| `shortDescription` | Multi-line text | `Camaya Series® Sensor Foaming Soap Dispenser` |
| `description` | Rich text | *(see Description below)* |
| `features` | Multi-value text (or rich-text list) | *(see Features — 6 bullets)* |
| `image` | Content reference / URL | `Z6953-FSD-BN_R_RDR` (main product image) |
| `finishes` | Multi-value text | `Polished Chrome`, `Matte Black`, `Brushed Nickel` |
| `soapType` | Single-line text | `Foam` |
| `powerSource` | Multi-value text | `Battery Powered`, `Plug-in Powered` |
| `resources` | Nested / multi-field (label + file) | *(see Resources table)* |
| `whereToBuy` | Content reference | `/where-to-buy/distributor-locator` |
| `seoTitle` | Single-line text | `Camaya Series® Sensor Foaming Soap Dispenser \| Zurn` |

---

## Description (rich text)

> The Camaya Series® sensor foaming soap dispenser offers hygienic hands-free operation that coordinates perfectly with the matching sensor faucet. Durable construction stands up to heavy commercial use, while fitting in perfectly in a sophisticated restroom environment.

## Features (bullet list)

- Sophisticated style that holds up to heavy usage
- Coordinates perfectly with matching Camaya faucet
- Works with foaming soap
- Durable construction stands up to heavy commercial use
- Stylish enough to fit in perfectly in a sophisticated environment
- ADA compliant

## Product images (scene7 references)

| Purpose | Reference / URL |
|---|---|
| Main | `https://zurnelkay.scene7.com/is/image/Elkay/Z6953-FSD-BN_R_RDR?$ZE_PRODUCT_MAIN$` |
| Related/thumb | `https://zurnelkay.scene7.com/is/image/Elkay/Z6953-FSD-BN_R_RDR?$ZE_PRODUCT_RELATED$` |
| Configurator | `https://zurnelkay.scene7.com/is/image/Elkay/Z6953-XL_Camaya_Polished-Chrome_AL1` |

## Resources (label + file — the "download-resources" block)

| Group | Label | File |
|---|---|---|
| Spec Sheets | Specification Sheet - Z6953-FSD | `https://files.zurn.com/spec-sheets/ss z6953-fsd.pdf` |
| Spec Sheets | Installation Instructions - Z6953-FSD | `https://files.zurn.com/spec-sheets/fv843.pdf` |
| Spec Sheets | Maintenance Use and Care - Z6953-FSD | `https://files.zurn.com/spec-sheets/fv843.pdf` |
| Other | Warranty - Z6953-FSD | `https://files.zurn.com/terms-and-conditions/general-terms-and-conditions.pdf` |
| Other | Warning - Proposition 65 | `/us/en/resources/prop-65.html` |

## Breadcrumb (for context / a `breadcrumb` field if desired)

`Home` › `Products` (`/products`) › `Finish Plumbing` (`/products/finish-plumbing`) › `Soap Dispensers` (`/products/finish-plumbing/soap-dispensers`) › `Z6953-FSD`

## Configurator options (optional — for a richer model)

- **Finish:** Polished Chrome / Matte Black / Brushed Nickel
- **Soap Type:** Foam
- **Power Source:** Battery Powered / Plug-in Powered

---

### Notes
- Spec-sheet and install PDFs are external `files.zurn.com` URLs (may be bot-gated); upload copies to `/content/dam/zurn/en/documents` if you want them AEM-hosted.
- The product image is a scene7 asset (fetchable); it's also stageable into the DAM under `/content/dam/zurn/en/images` if you prefer an internal reference.
