# Sightline — Website Design Specification

**Purpose of this document**: This is the complete design and content specification for the Sightline marketing website. It is written to be handed directly to a design/build tool (Google Stitch) with no ambiguity. Every section below defines exact colors, type, copy, components, states, and behavior. Do not deviate from these values unless technically impossible on the target platform — if a value cannot be supported, use the closest equivalent and flag it.

---

## 1. Brand Summary

- **Name**: Sightline
- **Tagline**: See clearly before you sign.
- **What it is**: An AI-powered platform that helps people understand, compare, and navigate legal documents (leases, contracts, terms of service) in plain language — positioned as an information and preparation tool, not a replacement for legal advice.
- **Target audience**: Renters, freelancers, and small business owners reviewing contracts without easy access to a lawyer.
- **Brand personality**: Calm, precise, trustworthy, plainspoken. Not playful, not corporate-cold. Think "a sharp, patient friend who reads the fine print for you" — not "flashy AI startup."
- **Visual metaphor**: Proofreading and document annotation — margin notes, underlines, precision marks — rather than tech/gradient/abstract-AI visuals.

---

## 2. Design Tokens

### 2.1 Color Palette

| Token name | Hex | Usage |
|---|---|---|
| `color-ink` | `#1C2321` | Primary text, headlines, nav text |
| `color-paper` | `#F7F5F0` | Primary background (warm off-white, desaturated — NOT cream #F4F1EA) |
| `color-slate` | `#4A5A5C` | Secondary/body text, muted UI labels |
| `color-signal` | `#B5542A` | Single accent color — primary CTA buttons, active states, key highlights ONLY |
| `color-signal-hover` | `#96431F` | Hover state for signal-colored buttons |
| `color-line` | `#D8D3C8` | Hairline dividers, borders, table rules |
| `color-panel` | `#EFEBE3` | Slightly darker panel background for contrast blocks (e.g., document excerpt cards) |
| `color-success` | `#3F6E4E` | Confirmation states (e.g., form submitted) — muted green, not bright/neon |
| `color-error` | `#9C3B2E` | Error/validation states — muted red-brown, consistent with palette |
| `color-white` | `#FFFFFF` | Pure white — used sparingly, e.g., inside document-excerpt cards to simulate paper |

**Rules**:
- `color-signal` appears at most ONCE per screen as a filled button. All other CTAs/links use `color-ink` with an underline, or `color-slate`.
- Never use pure black (`#000000`) or pure grey gradients as backgrounds.
- No gradients anywhere in the design. Flat colors only.
- No drop shadows except a single, subtle flat elevation on the document-excerpt card component (see 3.4), using `rgba(28,35,33,0.08)` — not the generic `rgba(0,0,0,0.1)`.

### 2.2 Typography

| Role | Typeface | Fallback | Weight(s) | Usage |
|---|---|---|---|---|
| Display/Headline | Source Serif 4 | Georgia, serif | 600 (Semibold) | H1, H2, hero statement, section titles |
| Body/UI | Inter | -apple-system, sans-serif | 400 (Regular), 500 (Medium), 600 (Semibold) | Body copy, nav, buttons, form labels, captions |

**Type scale** (px, desktop):
| Element | Font | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|---|
| H1 (hero) | Source Serif 4 | 56px | 1.1 | 600 | 0 |
| H2 (section title) | Source Serif 4 | 36px | 1.2 | 600 | 0 |
| H3 (subsection) | Source Serif 4 | 24px | 1.3 | 600 | 0 |
| Body large | Inter | 18px | 1.6 | 400 | 0 |
| Body regular | Inter | 16px | 1.6 | 400 | 0 |
| Caption/label | Inter | 13px | 1.4 | 500 | 0.01em |
| Button text | Inter | 15px | 1 | 600 | 0 |

**Type scale** (px, mobile — under 768px):
| Element | Size |
|---|---|
| H1 | 36px |
| H2 | 28px |
| H3 | 20px |
| Body large | 17px |
| Body regular | 16px |

**Explicit rules — do NOT do these**:
- Do not use ALL CAPS for any label, eyebrow, or nav item.
- Do not bold or italicize a single word within a headline for emphasis.
- Do not add an "eyebrow" label above headings (e.g., no small tracked-out label like "PRODUCT" above a section title).
- Do not use a monospace font anywhere.
- Do not append arrow characters (→) to button or link text; buttons state the action in words only (e.g., "Get early access", not "Get early access →").
- Body text line length must not exceed 75 characters per line on desktop.

### 2.3 Layout System

- **Grid**: 12-column grid, max content width 1140px, centered container with 24px side padding on mobile, 64px on desktop.
- **Alignment**: Left-aligned text and content blocks throughout. Do NOT center-align hero text, section titles, or body copy. Buttons/CTAs are left-aligned under their associated text, not centered independently.
- **Vertical rhythm**: Section padding = 96px top/bottom on desktop, 56px top/bottom on mobile. Consistent across all sections — do not vary section padding arbitrarily.
- **Dividers**: Use a single 1px hairline rule (`color-line`) between major sections where visual separation is needed — do not use blank whitespace alone as the only separator on content-dense pages.

### 2.4 Iconography & Imagery

- No stock photography of people (no handshakes, no people in suits, no laptop-in-cafe imagery).
- No abstract 3D blobs, gradients, or generic "AI brain/network" graphics.
- Primary imagery = **annotated document excerpts**: realistic-looking snippets of contract/lease text with margin annotations, underlines, and plain-language translations shown alongside. This is the core visual asset type used throughout the site (see Component 3.4).
- Icons (where used, e.g., in feature lists): simple, single-weight line icons (1.5px stroke), no filled/duotone icons, no emoji.

### 2.5 Motion & Animation

Motion must be minimal, purposeful, and used in exactly the following places only:

1. **Homepage hero load-in** (one time, on page load only):
   - The annotated document excerpt image fades in (opacity 0→1, 400ms, ease-out) with a single margin-annotation line "drawing on" — a short stroke-draw animation (600ms, ease-in-out) that appears to underline/annotate the document, timed to complete just after the headline text appears.
   - Headline text fades up slightly (translateY 8px→0, opacity 0→1, 350ms, ease-out).
   - Total hero animation sequence must complete within 1.2 seconds. No looping, no repeat.

2. **"How It Works" step reveal**:
   - As the user scrolls this section into view, the 4 steps appear in sequence with a 100ms stagger between each (fade + 6px upward slide, 300ms each). This is the ONLY scroll-triggered animation on the site.

3. **Button/interactive hover states** (user-triggered only):
   - Primary button (`color-signal`): background darkens to `color-signal-hover` over 150ms ease.
   - Text links: underline appears/thickens over 120ms ease.
   - No hover animation on non-interactive elements (cards, images).

4. **Form submission feedback**:
   - On successful waitlist form submission, the form area transitions (200ms fade) to a confirmation state (see Component 3.7).

**Explicitly forbidden animations**:
- No fade-and-slide-up entrance animations applied uniformly to every section as the user scrolls (this is a generic AI-site tell).
- No hover-lift/shadow-grow effects on cards.
- No auto-playing looping animations, carousels, or marquees anywhere on the site.
- No parallax scrolling effects.
- Respect `prefers-reduced-motion`: if the platform/user setting requests reduced motion, all animations above are replaced with an instant (0ms) state change — no exceptions.

---

## 3. Component Inventory

### 3.1 Navigation Bar
- Fixed/sticky at top, `color-paper` background, 1px bottom border in `color-line`.
- Left: "Sightline" wordmark, Source Serif 4, 20px, 600 weight, `color-ink`. No logo icon — wordmark only.
- Right: horizontal nav links — "How It Works", "Use Cases", "Trust & Privacy", "Pricing" (if applicable) — Inter 15px 500 weight, `color-slate`, `color-ink` on hover with underline.
- Far right: single button, "Get early access", filled `color-signal` background, white text, 8px corner radius, 12px vertical / 20px horizontal padding.
- Mobile: nav links collapse into a hamburger menu icon (simple 2-line icon, not 3-line "hamburger" — use 2 lines with different widths for a more distinctive mark); tapping opens a full-screen menu panel with `color-paper` background.

### 3.2 Hero Section (Homepage only)
- Two-column layout on desktop (55% text / 45% image), single-column stacked on mobile (text first, then image).
- **Left column**:
  - H1: "See clearly before you sign."
  - Body large text below, `color-slate`: "Sightline reads the fine print with you — plain-language explanations, risk flags, and side-by-side comparisons for leases, contracts, and agreements. Grounded in your actual document, every time."
  - Primary CTA button: "Get early access" (filled, `color-signal`)
  - Secondary link (text-only, underlined on hover): "See how it works"
- **Right column**: Annotated document excerpt visual (see 3.4), showing one real clause example with a plain-language margin annotation.

### 3.3 Trust Strip (Homepage, directly below hero)
- Thin horizontal band, `color-panel` background, 1px top/bottom border `color-line`.
- Single centered-within-container line of text (left-aligned within the container, not centered on page), Inter 14px 500 weight, `color-slate`:
  "Sightline provides information to help you understand documents — it does not replace advice from a licensed attorney."
- No icon, no dismiss button — this is a permanent, always-visible trust statement.

### 3.4 Document Excerpt Card (core recurring component)
Used in: hero, "How It Works", Use Cases pages, "Trust & Privacy" examples.

- White (`color-white`) card, 1px border `color-line`, 12px corner radius, subtle flat shadow `rgba(28,35,33,0.08)` (4px blur, 2px y-offset — this is the only shadow used anywhere on the site).
- Contains:
  - A short block of realistic legal text (monospace NOT used — render in Inter regular 15px, `color-ink`, to simulate a document, with a very subtle `color-panel` background behind just the text block to differentiate it from the annotation).
  - One phrase/clause within the text is underlined in `color-signal` (single underline, 2px, not highlighted/boxed).
  - To the right (desktop) or below (mobile) of the underlined phrase: a small annotation panel, `color-panel` background, 8px corner radius, containing:
    - A small label "Plain language:" (Inter 13px 500 weight, `color-slate`, sentence case — not all caps)
    - The plain-language translation (Inter 15px 400 weight, `color-ink`)
- This component should look like an actual annotated PDF margin note — not a chat bubble, not a card with a shadow "floating" effect beyond the single specified shadow.

### 3.5 "How It Works" Step Sequence
- Used on Homepage (condensed, 4 steps) and dedicated "How It Works" page (expanded, same 4 steps with more detail).
- Layout: vertical list on mobile, horizontal 4-column row on desktop, connected by a single thin horizontal line (`color-line`) running behind/through the step markers (this is the one place a numbered/sequential marker is appropriate, since content is a genuine sequence).
- Each step:
  - Step marker: small circle (32px diameter), 1px border `color-ink`, containing the step number (Inter 15px 600, `color-ink`) — NOT filled/colored, keep neutral since this isn't the page's accent moment.
  - Step title (Inter 17px 600 weight, `color-ink`): "Upload", "Understand", "Compare", "Prepare"
  - Step description (Inter 15px 400, `color-slate`, max 2 lines):
    1. **Upload** — "Add a lease, contract, or agreement as a PDF, Word doc, or photo."
    2. **Understand** — "Get a plain-language summary and ask questions about specific clauses."
    3. **Compare** — "Upload a second document to see what's different and why it matters."
    4. **Prepare** — "Export a summary and question list to bring to a legal professional, if you need one."

### 3.6 Use Case Cards (Use Cases page)
- Three cards: "For Renters", "For Freelancers", "For Small Businesses"
- Layout: flat panels (NOT rounded SaaS cards with identical shadows) — use `color-panel` background, no border, no shadow, 12px corner radius, generous internal padding (32px).
- Each contains:
  - H3 title
  - 2–3 sentence scenario-specific narrative (written from the user's real pain point, e.g., for Renters: "Your landlord sends a lease renewal with new terms. Is the rent increase legal? Did they add a new fee? Sightline flags what changed and what to ask about.")
  - One small document-excerpt detail specific to that audience (e.g., a rent-escalation clause for Renters, a scope-of-work clause for Freelancers, a liability clause for Small Businesses) — reuse Component 3.4 in a compact variant (single line of text + annotation, no full card shadow).
- Do NOT give all three cards identical generic icons (e.g., a house icon, a briefcase icon, a building icon) — if icons are used, keep them simple line icons but ensure the accompanying text carries the differentiation, not the icon.

### 3.7 Waitlist Form
- Single field: email address (Inter 16px, `color-ink` text, `color-paper` background, 1px border `color-line`, 8px corner radius, 14px padding).
- Optional second field (dropdown or short text): "What type of document matters most to you?" with options: Lease/Rental Agreement, Employment Contract, Freelance/Client Contract, Terms of Service/Privacy Policy, Other.
- Submit button: "Join the waitlist" (filled `color-signal`, matches primary button spec).
- **States**:
  - Default: as described above.
  - Focus: input border changes to `color-ink`, 2px.
  - Error (invalid email): input border changes to `color-error`, 1px; small error text below field in `color-error`, Inter 13px: "Enter a valid email address."
  - Success (post-submit): form fields fade out (200ms), replaced with a confirmation message in the same space: H3 "You're on the list" + body text "We'll email you when Sightline is ready. No spam — just one note when it matters." Do not use a checkmark icon; rely on the text.

### 3.8 FAQ Accordion
- Used on FAQ/Contact page.
- Each FAQ item: question row (Inter 16px 500 weight, `color-ink`) with a small plus/minus indicator (simple line icon, rotates 45° on open, 150ms ease — this is a user-triggered interaction, permitted).
- On click: answer expands below (height auto-transition, 200ms ease), Inter 15px 400 weight, `color-slate`.
- 1px `color-line` divider between each FAQ row, no dividers within an open answer.
- Required FAQ entries (minimum, exact question wording):
  1. "Is Sightline legal advice?"
  2. "Is my document kept private and secure?"
  3. "What types of documents can Sightline read?"
  4. "What happens after I join the waitlist?"
  5. "When should I still talk to a real lawyer?"

### 3.9 Footer
- `color-ink` background (the one place a dark background is used on the site — creates a clear visual "end of page" signal), `color-paper` text.
- Contents: "Sightline" wordmark (small), a one-line restatement of the trust disclosure ("Sightline provides information, not legal advice."), nav link list (same as header, text-only), and copyright line.
- No social media icon row unless real accounts exist — do not include placeholder/dead social icons.

### 3.10 Buttons (general spec, all instances)
| Type | Background | Text color | Border | Corner radius | Hover |
|---|---|---|---|---|---|
| Primary | `color-signal` | `#FFFFFF` | none | 8px | bg → `color-signal-hover`, 150ms |
| Secondary | transparent | `color-ink` | 1px `color-ink` | 8px | bg fills to `color-panel`, 150ms |
| Text link | transparent | `color-ink` | none (underline on hover) | n/a | underline fades in, 120ms |

- Button padding: 12px vertical, 24px horizontal (desktop and mobile).
- Never use more than one primary (filled, `color-signal`) button visible on screen at the same time.

---

## 4. Page-by-Page Specification

### 4.1 Home
Sections in order:
1. Navigation Bar (3.1)
2. Hero (3.2)
3. Trust Strip (3.3)
4. "How It Works" condensed (3.5) — heading above: H2 "How it works" (left-aligned, no eyebrow label)
5. One expanded Document Excerpt Card (3.4) as a standalone "See it in action" section — H2 "A clause, explained" above it
6. Use Case teaser — 3 compact versions of 3.6 with a "See all use cases" text link below
7. Waitlist Form (3.7) — heading above: H2 "Get early access"
8. Footer (3.9)

### 4.2 How It Works
1. Nav, expanded version of Section 3.5 with additional detail paragraph (3–4 sentences) under each step, one Document Excerpt Card (3.4) example placed after step 2 ("Understand") to show the concept concretely, Footer.

### 4.3 Use Cases (parent page + 3 sub-sections or 3 separate pages — recommend single scrolling page with anchor links from nav dropdown if platform supports; otherwise 3 separate pages using identical template)
1. Nav, H1 "Built for the moments legal paperwork actually happens", three full Use Case Cards (3.6) stacked vertically (not side-by-side on this dedicated page — give each one full width and room for a complete example), Waitlist Form, Footer.

### 4.4 Trust & Privacy
1. Nav, H1 "How Sightline handles your documents", body sections (H3 + paragraph each) covering: Data encryption, Data retention/deletion, No use of user documents for model training, Explicit UPL/not-legal-advice disclosure (this section should be the most prominent on the page — consider a bordered `color-panel` callout box), Footer.

### 4.5 Pricing (only if pricing is defined — otherwise omit this page entirely rather than showing a placeholder)

### 4.6 FAQ / Contact
1. Nav, H1 "Questions", FAQ Accordion (3.8), simple contact method below (email link or Google Form embed), Footer.

---

## 5. Content & Copy Rules

- Sentence case for all headings and buttons — never Title Case, never ALL CAPS.
- Active voice, plain verbs: "Upload a document" not "Documents can be uploaded."
- No filler marketing language: avoid words like "revolutionary," "cutting-edge," "seamless," "empower," "unlock," "game-changing."
- Every use of the word "AI" should be paired with a concrete explanation of what it does in that instance — never used as a standalone selling point.
- The "not legal advice" disclosure must appear in at least 3 places across the site: Trust Strip (home), Footer (every page), and Trust & Privacy page (expanded).

---

## 6. Responsive Behavior Summary

| Breakpoint | Layout change |
|---|---|
| ≥1024px (desktop) | Full multi-column layouts as specified above |
| 768–1023px (tablet) | Hero becomes single column (image below text); Use Case cards and How It Works steps remain in a 2-column grid where possible |
| <768px (mobile) | All sections single-column; nav collapses to hamburger menu; Document Excerpt Card annotation moves below the text block instead of beside it |

---

## 7. Accessibility Requirements

- All interactive elements (buttons, links, form fields, accordion triggers) must have a visible keyboard focus state: 2px outline in `color-signal`, 2px offset.
- Color contrast: body text (`color-ink` on `color-paper`) and all button text must meet WCAG AA minimum contrast (4.5:1 for body text, 3:1 for large text/UI components).
- All images (including Document Excerpt Card visuals) require descriptive alt text describing the clause/annotation content, not just "document image."
- Form fields must have associated visible labels (not placeholder-only labels).
- Respect `prefers-reduced-motion` as specified in Section 2.5.

---

## 8. Explicit Do-Not List (Summary)

For quick reference — do not include any of the following anywhere on the site:
- Gradients of any kind
- Pure black backgrounds
- Cream background + serif + terracotta combination (this exact combination is a known generic AI-design pattern — this spec deliberately uses a cooler, greyer paper tone and darker rust accent instead)
- Centered hero text/layout
- Rounded cards with identical soft grey drop shadows used repeatedly as a system
- ALL-CAPS labels or eyebrows
- Arrow characters appended to button/link text
- Numbered step markers on non-sequential content
- Stock photography of people
- Generic AI/tech iconography (brains, neural networks, abstract blobs)
- Looping or auto-playing animations
- Scroll-triggered fade-up animations applied uniformly to every section
- More than one filled primary-color button visible at once
