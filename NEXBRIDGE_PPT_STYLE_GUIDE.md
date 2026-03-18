# NexBridge PowerPoint Design System

Use this as the single source of truth for all NexBridge presentation slides. Every color, font, spacing value, and component spec is extracted directly from the production website. Follow these rules exactly for brand consistency.

---

## 1. COLOR PALETTE

### Primary Colors
| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Orange (Primary) | `#E8642C` | `232, 100, 44` | Primary accent, CTA buttons, highlights |
| Orange Light | `#F4845F` | `244, 132, 95` | Gradient endpoint, hover accents |
| Orange Glow | `rgba(232,100,44,0.3)` | — | Shadows, glows behind buttons |
| Orange Subtle | `rgba(232,100,44,0.08)` | — | Tinted backgrounds behind icons |

### Background Colors
| Token | Hex | Usage |
|-------|-----|-------|
| BG Dark (Slide BG) | `#050505` | Main slide background — nearly black |
| BG Card | `#0A0A0A` | Card/container fill |
| BG Card Hover | `#111111` | Elevated/active card state |
| BG Elevated | `#141414` | Secondary containers, tooltips |
| Dropdown BG | `#0C0C0C` at 96% opacity | Frosted glass panel backgrounds |

### Border Colors
| Token | Value | Usage |
|-------|-------|-------|
| Border Default | `rgba(255,255,255,0.06)` ≈ `#0F0F0F` | Subtle card/divider borders |
| Border Hover | `rgba(255,255,255,0.12)` ≈ `#1E1E1E` | Active state borders |
| Border Orange | `rgba(232,100,44,0.3)` | Featured/highlighted card borders |

### Text Colors
| Token | Value | Usage |
|-------|-------|-------|
| Text Primary | `#FFFFFF` | Headlines, primary content |
| Text Secondary | `rgba(255,255,255,0.6)` ≈ `#999999` | Body text, descriptions |
| Text Tertiary | `rgba(255,255,255,0.35)` ≈ `#595959` | Labels, captions, section headers |

### Accent Category Colors (for colored icons)
| Category | BG Fill | Border | Icon/Text Color |
|----------|---------|--------|----------------|
| Orange | `rgba(232,100,44,0.08)` | `rgba(232,100,44,0.2)` | `#E8642C` |
| Blue | `rgba(59,130,246,0.1)` | `rgba(59,130,246,0.2)` | `#60A5FA` |
| Purple | `rgba(139,92,246,0.1)` | `rgba(139,92,246,0.2)` | `#A78BFA` |
| Green | `rgba(16,185,129,0.1)` | `rgba(16,185,129,0.2)` | `#34D399` |

### Gradients
| Name | Value | Usage |
|------|-------|-------|
| Gradient Orange | `135deg: #E8642C → #F4845F` | CTA buttons, gradient text fill |
| Gradient Dark | `180deg: #050505 → #0A0A0A` | Slide/section background |

---

## 2. TYPOGRAPHY

### Font Families
| Role | Font | Fallback |
|------|------|----------|
| Display / Headlines / Numbers | **Space Grotesk** | -apple-system, sans-serif |
| Body / UI Text | **Inter** | -apple-system, sans-serif |

### Type Scale
| Element | Font | Size | Weight | Tracking | Line Height | Color |
|---------|------|------|--------|----------|-------------|-------|
| Slide Title (H1) | Space Grotesk | 40-64pt | 700 (Bold) | -0.03em (tight) | 1.1 | White |
| Section Title (H2) | Space Grotesk | 32-48pt | 700 | -0.03em | 1.1 | White |
| Section Label | Space Grotesk | 11pt | 600 (SemiBold) | 3px (+wide) | — | `#E8642C` orange |
| Card Name / Product Name | Space Grotesk | 13.5-16pt | 600-700 | normal | 1.3 | White |
| Body Text | Inter | 15-17pt | 400-500 | normal | 1.7 | Text Secondary `#999` |
| Description / Caption | Inter | 12pt | 400 | normal | 1.3 | Text Tertiary `#595959` |
| Tag / Badge | Inter or Space Grotesk | 9pt | 700 | 0.5-2.5px | — | Varies by tag type |
| Stat / Yield Number | Space Grotesk | 28-48pt | 700 | -0.02em | 1.0 | `#34D399` green |
| Nav / Small UI | Inter | 13pt | 500 | normal | — | Text Secondary |
| Button Text | Inter | 12-15pt | 600 | normal | — | White |

### Special Text Treatments
- **Gradient Text**: Apply the Orange Gradient (`#E8642C → #F4845F` at 135 degrees) as a text fill. Used for emphasis words in headlines.
- **Section Label Pattern**: Always preceded by a 24px horizontal orange line, then 8px gap, then the uppercase text. Color is `#E8642C`.
- **Uppercase + Letter Spacing**: Section labels and badges use `text-transform: uppercase` with `letter-spacing: 2-3px`.

---

## 3. SPACING & LAYOUT

### Slide Dimensions
- **Format**: 16:9 widescreen (13.33" x 7.5" / 33.87cm x 19.05cm)
- **Max Content Width**: 1280px equivalent — leave ~0.5" margins on sides

### Spacing Scale
| Size | Value | Usage |
|------|-------|-------|
| XS | 6px | Gap between icon and text inside a row |
| SM | 12px | Gap between stacked items in a list |
| MD | 16-20px | Cell padding, card internal padding |
| LG | 24px | Gap between cards in a grid |
| XL | 28px | Card padding (product cards) |
| 2XL | 64px | Space between section header and content |

### Border Radius Scale
| Token | Value | Usage |
|-------|-------|-------|
| SM | 8px | Small badges, inputs |
| MD | 12px | Icons, small containers |
| LG | 16px | Cards, product cards, dropdowns |
| XL | 24px | Large panels, featured sections |
| Full / Pill | 9999px (full round) | Buttons, tags, badges, nav pills |

---

## 4. COMPONENT SPECS

### 4A. Product Row Item (Issuance List Entry)
```
┌─[36x36 icon]─ 12px gap ─[Text Column]─────────────────┐
│ ╭────────╮               Name   [Tag Pill]             │
│ │  LOGO  │               Description text              │
│ ╰────────╯                                             │
│ (9px radius)                                           │
│ Padding: 9px 12px                                      │
│ Row border-radius: 10px                                │
│ Hover: bg rgba(255,255,255,0.04)                       │
└────────────────────────────────────────────────────────┘
```
- **Icon container**: 36x36px, border-radius 9px, fill `rgba(255,255,255,0.04)`, border 1px `rgba(255,255,255,0.08)`. Logo inside with 5px padding, `object-fit: contain`.
- **Name**: Space Grotesk, 13.5pt, weight 600, white
- **Tag pill** (inline after name, 8px gap): 9pt, weight 700, uppercase, letter-spacing 0.5px, border-radius pill (9999px), padding 1px 6px
  - "Live" tag: bg `rgba(16,185,129,0.12)`, text `#34D399`
  - "Soon" tag: bg `rgba(255,255,255,0.06)`, text `#595959`
- **Description**: Inter, 12pt, `#595959`, line-height 1.3

### 4B. Featured Product Card (USTBL Hero)
```
╭──────────────────────────────────────╮
│  [Orb glow top-right]                │
│                                      │
│         ✦ FEATURED                   │  ← 9pt orange pill badge
│         ╭────────╮                   │
│         │ USTBL  │                   │  ← 46x46px icon, 12px radius
│         │  logo  │                   │
│         ╰────────╯                   │
│           USTBL                      │  ← 16pt bold white
│     U.S. Treasury Bills              │  ← 11pt tertiary
│                                      │
│          4.3%  APY                   │  ← 28pt bold #34D399 + 13pt label
│                                      │
│     ╭──Start Earning →──╮           │  ← Orange gradient pill button
│     ╰───────────────────╯           │
│  [Orb glow bottom-left]             │
│  [Grid lines texture at 3% opacity] │
╰──────────────────────────────────────╯
```
- **Card**: border-radius 14px, bg `rgba(255,255,255,0.03)`, border 1px `rgba(255,255,255,0.06)`
- **Background fill**: subtle gradient `rgba(232,100,44,0.05)` → `rgba(232,100,44,0.01)` at 160deg
- **Orbs**: Circle shapes, filled `#E8642C`, soft edges/blur ~40px, opacity 15% (top-right) and 10% (bottom-left)
- **Grid texture**: Very faint crosshatch grid lines at 3% white opacity, 28px spacing, masked to fade out at edges
- **Featured badge**: 9pt, 700 weight, 2px letter-spacing, uppercase, color `#E8642C`, bg `rgba(232,100,44,0.08)`, border `rgba(232,100,44,0.15)`, padding 3px 10px, pill radius
- **Icon wrap**: 46x46px, 12px radius, bg `rgba(255,255,255,0.06)`, border `rgba(255,255,255,0.1)`, logo inside with 7px padding
- **Yield number**: Space Grotesk, 28pt, 700 weight, color `#34D399`
- **Yield label**: 13pt, 600 weight, `#34D399` at 70% opacity
- **CTA button**: Orange gradient (`#E8642C → #F4845F`), pill radius, padding 7px 18px, 12pt weight 600 white text

### 4C. Section Header Block
```
── SECTION LABEL          ← 24px orange line + 8px gap + text
Section Title with        ← 32-48pt bold white
Gradient Highlight        ← key phrase uses orange gradient text fill
Description paragraph     ← 17pt, text-secondary, max 560px wide
```

### 4D. Buttons
| Variant | Fill | Border | Text | Shadow | Radius |
|---------|------|--------|------|--------|--------|
| Primary (CTA) | Gradient `#E8642C → #F4845F` | none | 15pt 600 white | `0 4px 20px rgba(232,100,44,0.3)` | pill (9999px) |
| Secondary | `rgba(255,255,255,0.04)` | 1px `rgba(255,255,255,0.06)` | 15pt 600 white | none | pill |
| Small CTA | Gradient `#E8642C → #F4845F` | none | 12pt 600 white | none | pill |
- **Padding**: Primary/Secondary: 14px 32px. Small: 7px 18px.

### 4E. Status Tags / Badges
| Tag | BG | Text Color | Specs |
|-----|----|-----------|-------|
| Live | `rgba(16,185,129,0.1)` | `#34D399` | 9-11pt, 700, uppercase, pill, padding 1-4px 6-10px |
| Coming Soon | `rgba(255,255,255,0.05)` | `#595959` | Same specs |
| Featured | `rgba(232,100,44,0.08)` | `#E8642C` | Same specs, border `rgba(232,100,44,0.15)` |

### 4F. Product Card (Grid Tile)
```
╭─────────────────────────╮
│  ╭──────╮               │  ← 48x48px icon, 12px radius
│  │ LOGO │               │     bg rgba(255,255,255,0.05)
│  ╰──────╯               │     border 1px rgba(255,255,255,0.06)
│                          │     logo inside with 6px padding
│  Product Name            │  ← Space Grotesk, bold, white
│  Underlying Asset        │  ← Inter, text-secondary
│                          │
│  ● Live    4.3% APY      │  ← tag + yield
╰─────────────────────────╯
```
- **Card**: bg `#0A0A0A`, border 1px `rgba(255,255,255,0.06)`, radius 16px, padding 28px
- **Hover/Active state**: border becomes `rgba(232,100,44,0.25)`, shadow `0 20px 60px rgba(0,0,0,0.4)`

### 4G. Stats/KPI Display
| KPI | Font | Size | Color |
|-----|------|------|-------|
| Value | Space Grotesk | 32-48pt | White or `#34D399` for yields |
| Label | Inter | 13-14pt | Text Tertiary `#595959` |

---

## 5. MEGA-DROPDOWN 2x2 LAYOUT (Recommended Slide Template)

This is the signature NexBridge product overview layout. Use it as a single-slide summary of the entire product suite.

### Grid Structure
```
720px wide (or full slide width with margins), 2 columns x 2 rows
Dividers: 1px solid rgba(255,255,255,0.06) between all cells
Container: bg #0C0C0C, border 1px rgba(255,255,255,0.08), radius 20px
Shadow: 0 24px 80px rgba(0,0,0,0.6)
```

| Position | Content | Section Title Color |
|----------|---------|-------------------|
| Top-Left | **Issuances** — 3 product rows + "View All" link | `#595959` (tertiary) |
| Top-Right | **Featured Product** — USTBL hero card with yield | Orange-tinted bg |
| Bottom-Left | **Infrastructure** — Liquid Network, Blockstream AMP (blue icons) | `#595959` |
| Bottom-Right | **Platforms & Markets** — OTC, Governance, Exchange (multi-color icons) | `#595959` |

### Cell specs
- **Cell padding**: 20px (top cells), 16px 20px (bottom cells)
- **Featured cell**: Gets the special orange gradient background `rgba(232,100,44,0.05) → rgba(232,100,44,0.01)` at 160deg
- **Section titles**: Space Grotesk, 10pt, weight 700, letter-spacing 2.5px, uppercase, color text-tertiary

---

## 6. SHADOW & DEPTH SYSTEM

| Level | Shadow | Usage |
|-------|--------|-------|
| Subtle | `0 8px 40px rgba(0,0,0,0.4)` | Navbar, floating elements |
| Card Hover | `0 20px 60px rgba(0,0,0,0.4)` | Elevated cards on interaction |
| Panel/Dropdown | `0 24px 80px rgba(0,0,0,0.6)` | Main containers, mega panels |
| Orange Glow | `0 0 40px rgba(232,100,44,0.15)` | Featured items, active cards |
| Button Glow | `0 0 20-30px rgba(232,100,44,0.2-0.4)` | CTA buttons |
| Inset Highlight | `inset 0 1px 0 rgba(255,255,255,0.04-0.06)` | Top-edge light on glass panels |

---

## 7. ANIMATION & MOTION (for animated PPT transitions)

| Effect | Timing | Easing |
|--------|--------|--------|
| Default transition | 0.3-0.5s | `cubic-bezier(0.16, 1, 0.3, 1)` — spring-like deceleration |
| Subtle hover | 0.2-0.25s | `ease` |
| Fade up entrance | 0.8s | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Entrance offset | `translateY(30px)` → `translateY(0)` + `opacity: 0 → 1` | — |

PPT equivalent: Use **Fade** or **Float Up** entrance animations with **0.5-0.8s duration** and **ease-out** easing.

---

## 8. TEXTURE & BACKGROUND EFFECTS

1. **Noise overlay**: Very subtle fractal noise at 3% opacity over entire background. In PPT, this can be approximated with a semi-transparent noise PNG pattern overlay.

2. **Glowing orbs**: Large (70-100px) circles filled with accent color, heavy Gaussian blur (40px / Soft Edges in PPT), at 10-15% opacity. Place in corners or behind featured elements.

3. **Grid lines**: Faint crosshatch pattern, 28px grid spacing, white lines at 3% opacity, masked with radial fade. Used behind featured content areas.

4. **Cursor glow** (not applicable to PPT, skip).

---

## 9. QUICK REFERENCE: EXACT VALUES FOR POWERPOINT

### Slide Setup
- Size: 13.33" x 7.5" (Widescreen 16:9)
- Background: Solid fill `#050505`

### Font Install Required
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — Headlines, numbers, product names
- [Inter](https://fonts.google.com/specimen/Inter) — Body, UI, descriptions

### Shape Defaults for Cards
- Fill: `#0A0A0A`
- Border: 0.75pt, color `#0F0F0F`
- Corner radius: 0.15" (≈ 12px) for standard cards, 0.19" (≈ 16px) for large cards
- No shadow by default; add on featured elements only

### Key Hex Codes (copy-paste ready)
```
Slide Background:    #050505
Card Fill:           #0A0A0A
Card Border:         #0F0F0F
Orange Primary:      #E8642C
Orange Light:        #F4845F
Green (Live/Yield):  #34D399
Blue (Infra):        #60A5FA
Purple (Governance): #A78BFA
Text White:          #FFFFFF
Text Secondary:      #999999
Text Tertiary:       #595959
```
