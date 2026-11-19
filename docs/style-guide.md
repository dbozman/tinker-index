# Tinker Index — Design System

**Status:** Approved visual direction — Option 4, *Maker Discovery*  
**Version:** 1.0 (design baseline)  
**Primary brand:** Tinker Index  
**Tagline:** Discover your next project.  
**Domain:** https://tinkerindex.io  
**Reference preview:** https://tinker-index-design-explorations.nicemetal32.chatgpt.site/#hybrid

> This document is the visual source of truth for the public Tinker Index website. It defines the direction for Angular implementation and future AI-assisted work. It does not supersede `docs/architecture.md` for application architecture, data handling, security, SEO, or infrastructure.

## 1. Design principles

**Maker energy, discovery clarity.** A bold visual identity should make Tinker Index recognizable, while browsing, filtering, and reading remain quiet and efficient.

1. **Invite action.** Users should be able to recognize an interesting project and begin browsing immediately.
2. **Make information scannable.** Difficulty, cost, time, category, and tools are core product information, not decorative badges.
3. **Use contrast intentionally.** Rich, dark green and signal-lime define brand moments; light, restrained surfaces support long browsing sessions.
4. **Honor the maker.** Original editorial commentary, source attribution, transparent estimates, and licensed images are part of the design experience.
5. **Build for many pages.** The design must extend naturally from the homepage to thousands of catalog, category, and project-detail pages.
6. **Protect performance and accessibility.** Design does not justify heavy animations, unoptimized imagery, or inaccessible controls.

### Voice and copy

- Confident, curious, hands-on, and welcoming.
- Short, energetic headings; practical, plain-language body copy.
- Appropriate examples: “Find your kind of build.”, “What do you want to make?”, “Get curious. Get building.”
- Keep the approved tagline **“Discover your next project.”** prominently visible on the homepage.
- Avoid tech-bro hype, vague promises about AI, jargon-heavy marketing, and unsupported product claims.
- Do not imply projects are created by Tinker Index when they originate elsewhere.

## 2. Brand system

### Identity

- **Primary wordmark:** `TINKERINDEX`, bold geometric sans, uppercase, closely spaced.
- **Brand mark:** A simple four- or eight-point asterisk/spark symbol in a rounded-square lime badge. It suggests a starting idea, not a literal gear.
- **Alternate lockup:** `TINKER✳INDEX` for footers and editorial brand moments.
- **Favicons:** Simplified spark mark only, designed to remain recognizable at 16–32 px.
- Keep wordmark and icon as scalable SVG assets once approved. The preview's emoji/typographic symbol is a design placeholder, not a finalized logo vector.

### Color palette

The following values are taken from the approved hybrid mockup. Treat them as **initial canonical tokens** and adjust only after checking real screens and contrast.

| Token name | Hex | Use |
|---|---|---|
| `brand-forest` | `#14231C` | Header, hero, footer, dark brand surfaces |
| `brand-forest-raised` | `#1A3023` | Active filters, dark cards, strong contrast controls |
| `brand-lime` | `#D1F47F` | Primary action, highlighted hero text, brand spark |
| `canvas` | `#F5F7F1` | Main light page background |
| `surface` | `#FFFFFF` | Catalog and project card surfaces |
| `surface-muted` | `#E6EDDF` | Utility cards and supportive sections |
| `surface-filter` | `#F4F6F0` | Inactive filter buttons |
| `surface-tag` | `#EDF2E8` | Metadata chips |
| `text-primary` | `#19241D` | Main text on light surfaces |
| `text-secondary` | `#647065` | Descriptions and metadata |
| `text-on-dark` | `#F6F9ED` | Main typography on forest background |
| `text-muted-on-dark` | `#C8D6C8` | Supporting copy on forest background |
| `border-subtle` | `#DFE6D9` | Filter and light-surface boundaries |
| `accent-green` | `#5F8058` | Labels and subdued green highlights |

#### Color usage rules

- Use forest for **brand sections**, especially header, hero, footer, and occasional callout.
- Use lime deliberately for **primary actions and emphasis**; never fill the entire browsing UI with lime.
- Keep catalog grids, search results, and project-detail content predominantly light.
- Prefer the semantic token names in stylesheets, never scatter hard-coded hex values through components.
- Define accessible semantic tokens for success, warning, error, focus, disabled, and informational states during implementation. They are not established by the mockup and must be checked rather than guessed from decorative colors.
- Verify text/background pairs against WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for large text and relevant controls.

## 3. Typography

| Role | Typeface | Weight | Character |
|---|---|---|---|
| Display/headlines | **Space Grotesk** | 700 | Bold, geometric, tight but legible |
| Body/navigation/UI | **Manrope** | 400, 600, 700, 800 | Calm, readable, functional |
| Micro-labels/eyebrows | **DM Mono** | 400, 500 | Technical workshop annotation |

All three typefaces should be **self-hosted** with properly licensed font assets, appropriate subsets, `font-display: swap`, and minimal weights. The preview loads Google Fonts for convenience; production should preserve the existing self-hosted-font strategy.

### Type scale

| Role | Desktop target | Mobile target | Notes |
|---|---|---|---|
| Home hero H1 | Responsive `65–110px` | `56–88px` | Space Grotesk, weight 700, line-height ~0.98 |
| Major section H2 | `34–52px` | `32–40px` | Space Grotesk, tight tracking |
| Card title H3 | `21px` | `20–21px` | Space Grotesk, line-height ~1.2 |
| Body lead | `17–18px` | `15–17px` | Manrope, line-height ~1.65–1.75 |
| Body | `16px` | `16px` | Never shrink main content for density |
| Navigation/controls | `13–14px` | `13–14px` | Clear targets and contrast |
| Eyebrow/metadata | `11–12px` | `11–12px` | DM Mono; use sparingly, never for long prose |

Large headings may use tight negative tracking of roughly `-0.05em` to `-0.095em`, adjusted for word length and breakpoints. Do not apply extreme tracking to body copy. Avoid excessive uppercase text outside navigation, labels, and brand headings.

## 4. Layout and spacing

- **Desktop content width:** approximately `1380px` maximum.
- **Desktop side padding:** approximately 6% of viewport within the content wrapper.
- **Mobile side padding:** `20px`.
- **Spacing foundation:** 4px increment; common gaps 8, 12, 16, 24, 32, 48, 64, 80, and 104px.
- **Desktop card grid:** 3 columns with ~22px gaps; two columns on medium displays, one column on small screens.
- **Category grid:** up to 6 equal columns, 3 at tablet widths, 2 on phones.
- **Long-form content:** limit text measure separately, typically 65–80 characters, rather than stretching across the full grid width.
- **Major sections:** generous vertical padding, roughly 65–105px depending on content and breakpoint.
- **Responsive breakpoints:** start from content requirements; the preview uses approximately `1000px` and `700px` for the hybrid. Avoid hard-coding device names into styles.
- Preserve sufficient reserved image dimensions to avoid layout shifts.

## 5. Core components

### Global header

- Forest background, light wordmark, lime spark.
- Desktop: logo left; Discover, Categories, About/Why Tinker in middle/right; one restrained exploration action.
- Mobile: compact branding and an accessible navigation pattern; no horizontally overflowing links.
- Sticky behavior is optional; if enabled, it must not obscure anchor targets or cause excessive CLS.
- Do not add sign-in controls at launch—no public accounts are planned.

### Buttons and links

- **Primary:** lime fill, forest text, ~9px corner radius, bold label.
- **Secondary on dark:** transparent or forest fill, thin light-green border, light text.
- **Secondary on light:** light neutral fill with strong dark text.
- Minimum target size 44×44 CSS px for primary touch interactions where feasible.
- Hover and pressed states should be subtle but observable; focus-visible must be highly visible.
- Avoid decorative trailing arrows on every control.

### Project cards

The card is the main reusable discovery element:

1. Licensed project image or branded illustration/placeholder at stable aspect ratio.
2. Category label in restrained mono/green style.
3. Concise title with clear maximum line behavior.
4. Scannable difficulty, estimated cost, and time chips.
5. Optional concise summary or tags when a larger layout benefits from them.
6. Entire card/link is accessible by keyboard and routes to the project detail page once available.

Visual characteristics: white surface, fine gray-green border, ~17px radius, modest shadow, subtle hover elevation. Preserve enough whitespace that the card doesn't feel like a dense spreadsheet.

Functional requirements:

- Support unknown values as “Not estimated” or equivalent; do not fabricate certainty.
- If an estimate is AI-generated rather than source-verified, expose that distinction in the detail experience and, where useful, via a concise tooltip/label.
- Use consistent currency formatting and sensible human-readable duration.
- Show source/creator attribution on detail pages; avoid implying ownership of the project.
- Use licensed/source-authorized imagery only. The concept illustration is not a license to reuse third-party photos.
- `isDemo` data must be labeled and excluded from production indexing.

### Category tiles

- White surface with delicate border and mild radius (~14px).
- Illustration or icon in muted lime/green backdrop.
- Category name remains dominant; count may be secondary.
- Two-column phone layout; accessible single-link destination.
- Do not invent category-specific images without provenance.

### Search and filters

- Discovery UI should resemble the clean, calm lower half of Option 4, **not** the dark hero.
- Filter chips use muted gray-green backgrounds; active state uses forest with lime text.
- Clear selected state, keyboard access, visible result count, reset behavior, and mobile overflow strategy.
- On real catalog pages, support shareable URL query parameters and browser back/forward navigation.
- Surface loading, no-results, and error states without disrupting core page structure.
- Keep filter controls and titles descriptive and accessible; a filter chip in the preview is only a behavior demonstration.

### Editorial sections and callouts

- Alternate white and soft canvas sections for content rhythm.
- Reserve forest for strong branded moments and lime for occasional conversion/inspiration bands.
- Mono eyebrow labels can frame editorial sections, but avoid overwhelming the page with technical annotations.
- Use a clear hierarchy between discovery content and advertising placements.

### Footer

- Forest surface, light typography, compact alternate wordmark.
- Discover, Categories, About, creator/source acknowledgment, and real legal links once written.
- Do not invent social accounts, policies, or license claims.

## 6. Page templates

### Homepage

1. Forest branded hero with **“Discover your next project.”**, concise supporting copy, lime primary action, and one featured-project visual.
2. Light category discovery grid.
3. White catalog-preview area with filters and a 3-column featured-project grid.
4. Light “fits your life” benefits section (skill, budget, time, tools).
5. Strong but restrained branded closing callout.
6. Forest footer.

The hero creates brand recognition; the content below prioritizes exploration. The hero art must degrade gracefully when a real image is unavailable.

### Catalog/browse page — Milestone 3b

- Compact branded intro rather than a full homepage hero.
- Search and filter controls near the top.
- Clear results count, sort, pagination, and applied filters.
- High-density-but-readable project cards; practical filtering takes precedence over decorative flourishes.
- Crawlable canonical views, consistent metadata, and shareable filters.

### Category page — Milestone 3b

- Category H1, original short description, optional category artwork, project count.
- Project grid and relevant filters.
- Contextual links to related categories or tools.
- Server-rendered, indexable category content.

### Project detail page — Milestone 3b

- Project title and original analysis.
- Prominent source link and creator attribution.
- Hero media only when rights are established; otherwise branded placeholder.
- Facts/estimates panel: difficulty, cost, time, tools, materials with provenance treatment.
- Clear “View original instructions” action pointing to the creator's source.
- Related-project discovery below main content.
- Do not reproduce third-party instructions or imply content ownership.
- Reserve tasteful future ad placements without interfering with reading.

### About page

- Strong introductory brand treatment, readable long-form content.
- Explain the purpose of Tinker Index and commitment to linking to original creators.
- Avoid implying AI analysis is always verified or authoritative.

## 7. Motion and interaction

- Use subtle hover elevation (2–4px), restrained shadow changes, and ~150–220ms transitions.
- Respect `prefers-reduced-motion` by removing nonessential movement.
- No scroll-jacking, long entrance animations, infinite marquee, or animated hero backgrounds.
- Buttons, cards, tabs, and filters must have keyboard and touch equivalents.
- Do not introduce animation libraries for basic interactions.

## 8. Media and accessibility

- Use descriptive alt text for content-bearing imagery; decorative illustrations use empty alt/aria-hidden.
- Reserve aspect ratio for cards and hero to prevent layout shifts.
- Provide source URL, creator, rights holder, attribution, and image license metadata where applicable.
- Never assume “available online” means a photo is reusable.
- Support responsive images and defer below-the-fold media as appropriate.
- Ensure correct heading hierarchy, semantic navigation, focus visibility, accessible labels, and screen-reader status announcements for changing results.
- Verify WCAG AA contrast, responsive layouts, keyboard interaction, and mobile tap targets during implementation.

## 9. Ads, SEO, and performance guardrails

- Public pages must remain readable and useful independently of display advertising.
- Reserve ad placements in predictable positions, avoiding unexpected layout shifts; do not include ads in the design implementation milestone.
- Keep the main content visually identifiable and separate from ads/affiliate disclosures.
- Preserve Angular SSR for crawlable public content; do not replace it with client-only rendering or metadata injection.
- Render meaningful titles, H1s, canonical metadata, and project content in initial HTML.
- Prefer self-hosted fonts, lightweight CSS, native browser interactions, and optimized media.
- Retain the existing NestJS API contracts and published-content boundaries.

## 10. Angular implementation guidance

This is a visual specification, **not permission to rebuild the application architecture**.

- Implement in the existing Angular 21 + SCSS frontend.
- Map the color and spacing system into shared semantic SCSS/CSS variables.
- Build only reusable components justified by actual pages.
- Preserve typed `@tinker-index/contracts`, API services, SSR, hydration/transfer cache, route configuration, tests, and metadata behavior.
- Do not copy the prototype's raw HTML/JS implementation into the production app; translate designs into Angular components and established conventions.
- Refactor the current “Precision Workshop” CSS as needed, retaining useful functionality and tests.
- Document any intentional deviations from this guide before they proliferate.

### Suggested files to establish in the application

- `docs/style-guide.md` — this document; the committed visual source of truth.
- `apps/web/src/styles/_tokens.scss` — semantic colors, spacing, radii, shadows.
- `apps/web/src/styles/_typography.scss` — type hierarchy and loaded font families.
- Existing global styles and components updated as required; do not create duplicate design-token systems.
- `AGENTS.md` — requires Cursor and Hermes to consult `docs/style-guide.md` for public UI.

## 11. Acceptance criteria for the redesign

- [ ] Homepage matches the **Maker Discovery** direction on desktop and mobile.
- [ ] Approved tagline, basic navigation, project cards, categories, and calls to action are visible.
- [ ] Design tokens centralize palette and typography; no second competing theme.
- [ ] Existing API, loading/error behavior, Angular SSR, hydration, and SEO metadata still work.
- [ ] Project cards handle missing images and missing estimate values.
- [ ] No real creator/source claims or unlicensed imagery have been introduced.
- [ ] Fictional/demo records remain clearly identified and do not become indexable production content.
- [ ] Keyboard navigation, focus states, contrast, and responsive behavior verified.
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass.
- [ ] Desktop/mobile screenshots reviewed **before** committing.

## 12. Intentional non-decisions

The prototype is a **direction**, not a pixel-perfect final design. Final logo vector, production illustration style, advanced filtering layout, mobile navigation treatment, advertising slots, empty/loading-state visuals, and specific responsive art direction should be finalized against real catalog content as those pages are implemented.

The prototype uses fictional demo projects and illustrative artwork. The production application must preserve its own content rights, provenance, SEO, and publishing rules.

---

**Decision record:** Approved concept is **Option 4 — Maker Discovery**, combining Option 2's simple discovery experience with Option 3's expressive maker identity. This document governs visual evolution unless intentionally revised.
