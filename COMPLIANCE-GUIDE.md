# NexBridge Content Compliance Guide

> **Purpose:** Quick reference for anyone editing site content. Ensures all copy aligns with NexBridge's actual regulatory status and avoids legal red flags.
> **Last updated:** February 24, 2026

---

## Our Regulatory Status (Facts)

| License | ID | Regulator |
|---|---|---|
| Digital Asset Issuer | EAD-0005 | CNAD, El Salvador |
| Digital Asset Service Provider (DASP) | PSAD-0034 | CNAD, El Salvador |
| VASP Registration | No. 117 | CNV, Argentina |
| Global LEI | 4469000001EHY0TSFB93 | GLEIF Foundation |

- **Governing law:** El Salvador's Digital Assets Issuance Law
- **Regulator:** CNAD (Comisión Nacional de Activos Digitales)
- **We are NOT:** EU-regulated, a bank, a broker-dealer, a securities firm
- **Our products are:** Digital assets (NOT securities)

---

## Terminology Rules

### NEVER use → ALWAYS use instead

| Banned Term | Correct Term | Reason |
|---|---|---|
| "securities" (for our products) | "digital assets" | El Salvador law classifies them as digital assets |
| "tokenized securities" (for our products) | "tokenized real-world assets" or "digital assets" | Same as above |
| "EU-regulated" | "regulated" or "regulated under El Salvador's Digital Assets Law" | We hold no EU license |
| "MiFID" / "MiCA" | Do not reference | We are not subject to EU regulations |
| "Start Earning" / "Earn" (as CTA) | "Explore" / "View Product" / "Learn More" | Implies guaranteed returns |
| "guaranteed yield" / "guaranteed returns" | "indicative yield" / "target yield" | Yield is variable, never guaranteed |
| "direct exposure" (to Treasuries) | "exposure through the underlying ETF" | USTBL tracks an iShares ETF, not direct bonds |
| "government-backed" (for our products) | "Treasury-linked" or "backed by U.S. Treasury ETFs" | Exposure is via ETF, not sovereign guarantee |
| "from anywhere in the world" | "across eligible jurisdictions" | Jurisdictional restrictions apply |
| "no restrictions" / "no barriers" | "through authorized venues" | Access has eligibility requirements |
| "DeFi protocols" | "compatible protocols" | Unclear regulatory basis for regulated issuer |
| "bank" / "banking" | "issuer" / "issuance platform" | We are not a bank |
| "broker" / "brokerage" | "distributor" / "authorized venue" | We are not a broker-dealer |
| "investment" / "invest" (as verb/CTA) | "access" / "subscribe" / "participate" | Avoids securities law implications |

### Use with caution

| Term | Rule |
|---|---|
| "first" (e.g., "first regulated...") | Always qualify: "among the first on the Liquid Network" — must be verifiable |
| "global investors" | Always add: "in eligible jurisdictions" |
| "thousands of investors" | Only if independently verifiable; prefer "growing number of participants" |
| Specific yield figures (4.3%, 4.5%) | Must include disclaimer: "Yield is indicative and tracks underlying asset performance" |
| Third-party brand names (BlackRock, iShares) | Use full formal fund names; never imply endorsement or partnership |
| "partner" / "partnership" | Only for entities with formal agreements; otherwise use "service provider", "infrastructure", "underlying asset" |
| "Decentralized" | Avoid for NexBridge products; we are a licensed, centralized issuer |
| "backed by" (for partners) | Implies capital/endorsement; prefer "built with" or "powered by" |

---

## Required Disclaimers

### Near any yield / performance data:
> *Yield is indicative and reflects underlying asset performance. Past results do not guarantee future returns.*

### Near any product listing:
> *Digital assets involve risk. Access is subject to eligibility and jurisdictional requirements.*

### Footer (already present, keep updated):
> Must include: regulatory status, jurisdiction, risk warning, and copyright year.

---

## Page-by-Page Checklist

When editing any page, verify:

- [ ] No "securities" referring to NexBridge products
- [ ] No "EU-regulated" or EU regulatory claims
- [ ] No guaranteed return language ("earn", "start earning", "guaranteed")
- [ ] No unsubstantiated superlatives ("thousands", "millions", "first" without qualifier)
- [ ] No "from anywhere in the world" without jurisdictional caveat
- [ ] No "DeFi" references in official product descriptions
- [ ] Yield figures have disclaimers nearby
- [ ] Dates are current (no stale launch dates or "scheduled for" past dates)
- [ ] Third-party brands use formal names, no implied endorsement
- [ ] Copyright year is current
- [ ] All changes applied to all 5 languages (EN + ES, FR, IT, PT)

---

## Partnership Label Rules

| Relationship | Correct Label | Incorrect Label |
|---|---|---|
| Infrastructure provider (Blockstream, Liquid) | "Infrastructure" | "Partner" |
| Exchange listing venue (Bitfinex, XT.com) | "Exchange" / "Listing Venue" | "Partner" |
| Underlying asset issuer (iShares/BlackRock) | "Underlying Asset" | "ETF Provider" / "Partner" |
| Auditor (Grant Thornton) | "Audit" | "Partner" |
| Wallet support (Green, SideSwap, Aqua) | "Wallet" | "Partner" |
| Formal strategic agreement | "Strategic Partner" | — (OK if agreement exists) |
| Settlement currency (Tether/USDT) | "Settlement" | "Strategic Partner" (unless formal) |

---

## Translation Consistency

All content changes must be reflected in:
1. Source template: `src/{page}.html`
2. Shared partials: `partials/navbar.html`, `partials/footer.html`
3. Translation files: `i18n/es.json`, `i18n/fr.json`, `i18n/it.json`, `i18n/pt.json`
4. Template reference: `i18n/_template.json`
5. Rebuild: `node build-i18n.js`

---

## Quick Reference: What We CAN Say

- "Licensed digital asset issuer under El Salvador's Digital Assets Issuance Law"
- "Regulated by CNAD (National Commission of Digital Assets)"
- "VASP-registered with Argentina's CNV (No. 117)"
- "USTBL provides exposure to U.S. Treasury performance through an underlying ETF"
- "Independently audited monthly by Grant Thornton"
- "Built on Bitcoin's Liquid Network using Blockstream AMP"
- "1:1 asset-backed, audited, and transparent"
- "Available through authorized distributors and eligible venues"
- "Rated A by Particula"
