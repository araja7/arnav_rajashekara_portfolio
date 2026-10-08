---
name: Arnav Rajashekara
description: A personal portfolio staged as the film prologue, with fire-lit gold rising out of a black void.
colors:
  void: "hsl(30 20% 2%)"
  ash: "hsl(36 16% 6%)"
  ash-raised: "hsl(34 14% 9%)"
  gold: "hsl(42 54% 54%)"
  gold-bright: "hsl(44 81% 71%)"
  gold-dim: "hsl(42 44% 34%)"
  fire: "hsl(19 74% 52%)"
  fire-deep: "hsl(11 79% 27%)"
  bone: "hsl(40 26% 80%)"
  bone-dim: "hsl(38 12% 60%)"
  parchment: "hsl(38 44% 74%)"
  parchment-shade: "hsl(31 38% 50%)"
  parchment-light: "hsl(44 64% 89%)"
  scorch: "hsl(22 48% 13%)"
  ink: "hsl(24 44% 11%)"
  ink-faded: "hsl(25 32% 21%)"
  ink-red: "hsl(5 60% 30%)"
  border: "hsl(42 30% 18%)"
  input: "hsl(42 30% 22%)"
  destructive: "hsl(4 70% 50%)"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2.6rem, 8vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "0.06em"
  page-title:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2.5rem, 7vw, 5.5rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "0.06em"
  headline:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(1.8rem, 4vw, 2.9rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "0.06em"
  title:
    fontFamily: "Cinzel, serif"
    fontSize: "2.4rem"
    fontWeight: 600
    lineHeight: 1.04
    letterSpacing: "0.04em"
  lead:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 300
    lineHeight: 1.625
  body:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 300
    lineHeight: 1.75
  body-long:
    fontFamily: "Spectral, Georgia, serif"
    fontSize: "1.12rem"
    fontWeight: 300
    lineHeight: 1.85
  label:
    fontFamily: "Cinzel, serif"
    fontSize: "0.7rem"
    fontWeight: 600
    letterSpacing: "0.24em"
  button:
    fontFamily: "Cinzel, serif"
    fontSize: "0.8rem"
    fontWeight: 600
    letterSpacing: "0.2em"
rounded:
  none: "0px"
  sm: "1px"
  full: "9999px"
spacing:
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "32px"
  stack: "48px"
  scene: "128px"
  scene-lg: "176px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.void}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 36px"
    height: "56px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
    textColor: "{colors.void}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0 36px"
    height: "56px"
  button-outline-hover:
    textColor: "{colors.gold-bright}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
  button-ghost-hover:
    backgroundColor: "{colors.ash-raised}"
    textColor: "{colors.gold-bright}"
  input-field:
    backgroundColor: "{colors.void}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "0 16px"
    height: "48px"
  card-frame:
    backgroundColor: "{colors.ash}"
    textColor: "{colors.bone}"
    rounded: "{rounded.none}"
    padding: "56px"
  nav-link:
    textColor: "{colors.bone-dim}"
    typography: "{typography.label}"
    padding: "8px 12px"
  nav-link-active:
    textColor: "{colors.gold-bright}"
  credit-label:
    textColor: "{colors.gold}"
    typography: "{typography.label}"
---

# Design System: Arnav Rajashekara

## Overview

**Creative North Star: "The Prologue"**

Every page opens like the opening sequence of the Peter Jackson Fellowship film: out of a black void, one fire-lit gold relic and engraved gold capitals rise into view. The ground is near-black with slow smoke drifting at two speeds over a faint warm grain; everything that matters is gold, cut into the dark and lit from the front by firelight. A single hot colour, fire orange, is held back for the Ring's inscription and for whatever is active or in focus.

Density is cinematic, not editorial. Pages are a short sequence of scenes separated by long stretches of dark (128px to 176px between projects), each scene announced by a title card: gold Cinzel capitals, a small ring set between two gold hairlines. Prose sits in Spectral at a light weight in pale bone, the way the films set credits and captions under the titles. Projects play as letterboxed widescreen stills held in an amber grade until the visitor attends to them. Skills roll like end credits. The timeline is the one object in the dark that is not gold: a map of the journey on parchment, its edges scorched into the void.

The theme is purely graphic. It lives in material, colour, type, imagery and motion, never in the words: every label, heading, nav item and button keeps its original wording. It draws only on the films, and only as homage: no logos, no real Tengwar, no film stills, no proprietary fonts. This is a single dark world with no light mode. It rejects the parchment-and-map fan page and the generic neon-on-black portfolio: parchment exists only as the About timeline's map sheet (owner, 2026-10-08), never as a page ground or panel.

**Key Characteristics:**
- Black void ground with drifting smoke and warm grain, never a flat panel colour.
- Solid fire-lit gold for display type, rules, frames and primary actions.
- One reserved accent, fire orange, for the inscription and the active or focused state only.
- Cinzel engraved capitals for titles and tracked credit-card labels; Spectral for all prose.
- Square corners and gold hairline frames; circles belong only to Ring-derived marks.
- Motion rises out of black (blur, lift, fade) on a long cinematic ease.

## Colors

A near-black warm void, three golds that behave like one lit metal, two bones for text, and one fire held in reserve. The HSL triplets in `src/index.css` are the normative source; every surface reads them through `hsl(var(--token))`.

### Primary
- **Fire-Lit Gold** (gold): display type via the gilded treatment, gold rules, frame hairlines' highlight, primary button fill, credit labels, company names in italic.
- **Firelight Highlight** (gold-bright): the lit edge of gold. Hover state for every gold control, current nav item, the bevel line in the gilded text shadow.
- **Gold in Shadow** (gold-dim): the unlit side. Frame hairlines at rest, outline-button and roundel strokes at rest, input underlines, the gold rule's tapering ends, scrollbar thumb.

### Tertiary
- **Inscription Fire** (fire): the Ring's inscription, the active nav underline (24px hairline), the focus outline and focused input underline, and the text caret. Nothing else.
- **Ember** (fire-deep): firelight as light, never as paint. The glow pooling beneath the Ring, the warm halo inside the gilded text shadow, the soft glow under the hero button, and the firelight pooled above the timeline's map sheet.

### Neutral
- **The Void** (void): page ground, button text on gold, input wells (at 70%), the inner gap of the double frame.
- **Ash** (ash): framed panels (publication cards and the contact form at 60%), empty project stills.
- **Raised Ash** (ash-raised): popovers, ghost-button hover, secondary surfaces.
- **Pale Bone** (bone): primary reading text, skill names, lead paragraphs.
- **Weathered Bone** (bone-dim): secondary prose, subtitles in italic, nav links at rest, tech-stack credits, footer copy.
- **Hairline Bronze** (border) and **Field Bronze** (input): the default border and input stroke for shadcn primitives.
- **Ember Red** (destructive): the error toast only. A functional status colour, not part of the palette's voice.

### The Map's Inks
The timeline map is its own document with its own inks, held to that sheet alone.
- **Parchment** (parchment), **Parchment Light** (parchment-light) and **Parchment Shade** (parchment-shade): the sheet, lit pale from above and darkening toward its edges, with fold creases catching the light, with fibre and mottle noise and three faint stains.
- **Scorch** (scorch): the burnt band inside the sheet's ragged edge, deepening to void at the rim.
- **Map Ink** (ink): years, entry titles, symbols, the neatline, ridges and woods (at 35% to 50% for terrain).
- **Faded Ink** (ink-faded): entry descriptions.
- **Red Ink** (ink-red): the inked road, company names, the thesis link, the compass's north point and the beacon's flame. It is a rubric ink, not the fire token, and never leaves the map.

### Named Rules
**The Reserved Fire Rule.** Fire orange appears only in the Ring's inscription and on the active or focused state (current nav underline, focus outline, focused field underline, caret). It is never a fill, a heading colour, a decoration, or a hover state. Ember is light, not paint: it may glow or halo, but never colours text or fills a shape.

**The One Night Rule.** There is one world and it is dark. `color-scheme: dark`, no light mode, no theme toggle. New surfaces are designed on the void and nowhere else.

**The Gold Is Metal Rule.** The three golds are one material under one light: bright is the lit edge, dim is the shadow side. Reach for gold-bright only for hover, current or highlight, and gold-dim only for strokes and rules at rest.

## Typography

**Display Font:** Cinzel (with serif)
**Body Font:** Spectral (with Georgia, serif)
**Label Font:** Cinzel, tracked uppercase

**Character:** Cinzel supplies the engraved Roman capitals of a title card; Spectral is a quiet, slightly literary text face set light (300) so the bone prose recedes behind the gold. Both load from Google Fonts at weights Cinzel 400 to 800 and Spectral 300 to 500 with italics.

### Hierarchy
- **Display** (600, clamp(2.6rem, 8vw, 6rem), 0.95, 0.06em, uppercase, gilded): the home hero name only.
- **Page Title** (600, clamp(2.5rem, 7vw, 5.5rem), 0.98, 0.06em, uppercase, gilded): the h1 title card on every inner route.
- **Headline** (600, clamp(1.8rem, 4vw, 2.9rem), 0.98, 0.06em, uppercase, gilded): in-page section title cards.
- **Title** (600, 1.9rem to 2.4rem, 1.04, 0.04em, uppercase, gilded): project titles. Publication titles use the same face in mixed case at 1.6rem to 2.2rem and 1.15 leading; timeline entries drop to ink Cinzel at 1.12rem to 1.3rem on the map.
- **Lead** (300 italic, 1.125rem to 1.25rem, relaxed): title-card subtitles and contact intro, in weathered bone. Project summaries use the upright 400 lead at 1.2rem to 1.3rem in pale bone.
- **Body** (300, 1.0625rem base; 1.12rem with 1.8 to 1.85 leading for long passages): all prose, held to 65ch.
- **Label** (600, 0.6rem to 0.72rem, 0.24em, uppercase, lining numerals): the credit treatment. Nav links, field labels, skill categories, tech stacks, footer headings, publication meta, small link actions.
- **Button** (600, 0.8rem, rising to 1rem at xl, 0.2em, uppercase): all shadcn buttons.

### Named Rules
**The Title Card Rule.** Gold Cinzel capitals with the gilded light (bevel highlight above, void cut below, ember halo) are for titles. Prose is always Spectral, never Cinzel and never gold.

**The Credit Rule.** Every small label is the credit treatment: Cinzel 600, uppercase, 0.24em tracking. Tracking may tighten to 0.14em only where a single line would otherwise wrap on narrow screens.

## Layout

A centred, single-column-first cinema frame. The container centres at a 1400px maximum with 16px, 24px and 32px side gutters at base, sm and lg. Content then narrows to a measure suited to the scene: max-w-3xl for credits and the resume frame, max-w-4xl for publications, max-w-5xl for the home sections, max-w-6xl for the projects reel and the about and contact splits. Inner pages start below the fixed 64px (76px at md) nav and open with a title card carrying 64px to 96px of space beneath it.

Rhythm is long and theatrical. Projects are separated by 128px (176px at md); stacked blocks use 48px; prose paragraphs 24px. Where a scene splits, it does so at lg on a 12-column grid (5/7 for a project's title column and its description) or as 1fr / 1.3fr. Below lg everything returns to one column, and the nav collapses to a full-width curtain menu. The hero always fills the small viewport height (100svh) with the Ring held in a 16:10 frame, min(clamp(300px, 62vh, 560px), 100vw - 2rem) wide.

## Elevation & Depth

Depth comes from light, not lift. The void is the floor, smoke drifts in front of it at two speeds behind a radial mask, and firelight pools in the smoke beneath the Ring. Panels do not float: they are framed in gold hairlines drawn as inset box shadows, so the frame sits inside the edge and the panel stays flush with the dark. The only cast shadows belong to objects that occupy space (the Ring) or to firelight (the soft ember glow under the hero button).

### Shadow Vocabulary
- **Gilded Light** (`filter: drop-shadow(0 1px 0 hsl(var(--void))) drop-shadow(0 0 0.4em hsl(var(--fire-deep) / 0.5))`): every gold title, a cut edge and a warm firelight glow. It is a filter, not a text-shadow, because a text-shadow paints over clipped gilt.

**The Burnished Gilt Rule.** Gold type is metal, not paint, as on the films' title cards: `--gilt` sweeps each line from a pale highlight (gilt-pale) through gold-bright and gilt-rich to a dark reflection band (gilt-deep) through the middle of the capitals, then back up to bright and down to amber (gilt-shade). `.gilded` sets it on inline text so every line gets its own sweep; headings that animate `filter` carry it on an inner span. `.gilt-label` fits the same sweep to one centred line (buttons, credit labels, nav tabs, company names), and `.gilt-initial` to the About drop cap. Filled buttons are `.gilt-plate` (pale top, rich middle, amber base, bevelled with a pale inset line above and a dark one below); outline buttons and icon roundels take `.gilt-edge`, a hairline of polished gold catching light along one diagonal.
- **Double Gold Frame** (`box-shadow: inset 0 0 0 1px hsl(var(--gold-dim)), inset 0 0 0 5px hsl(var(--void)), inset 0 0 0 6px hsl(var(--gold-dim) / 0.5)`): framed panels, project stills, the portrait and resume frames.
- **Gold Hairline** (`box-shadow: inset 0 0 0 1px hsl(var(--gold-dim))`, hover `hsl(var(--gold))`): outline buttons, code and demo links, social roundels, the mobile menu button.
- **Ember Glow** (`box-shadow: 0 10px 30px -12px hsl(var(--fire-deep))`): the hero primary button only.
- **Object Shadow** (`drop-shadow(0 24px 40px hsl(0 0% 0% / 0.85))`): the Ring when rendered as SVG.

### Named Rules
**The Lit-Not-Lifted Rule.** Cards and panels carry no drop shadow. Depth is the gold frame, the smoke, and firelight. A new surface that needs separation gets a gold hairline or a gold rule, not elevation.

## Shapes

Square cut throughout: the radius token is 0px, with a 1px small step. Buttons, fields, frames and stills have hard corners. Circles are reserved for marks derived from the Ring: the small ring between the title-card rules, the footer's social roundels, and the small gold Ring that travels the map's road. Gold rules are 1px lines that taper to transparent at both ends. Project stills are cropped to a 2.39:1 letterbox and vignetted at the edges.

**The Square Cut Rule.** Corners are square. A round form must be read as the Ring or one of its echoes; nothing else is rounded.

## Components

### Buttons
Solid gold ingots and gold hairline outlines, set in credit capitals.
- **Shape:** square corners (0px).
- **Primary:** gold fill with void text, Cinzel 600 uppercase at 0.2em. Hero size is 56px tall with 36px side padding and carries the ember glow.
- **Fill:** the burnished gilt plate, with void text.
- **Hover / Focus:** the plate brightens (brightness 1.1) over 200ms ease-out; focus shows a 2px fire ring offset from the void.
- **Outline:** transparent with a polished gilt hairline (gilt-edge) and gilt text; on hover both brighten.
- **Ghost:** bone text that brightens to gold-bright on a raised-ash ground.
- **Link-style actions** (code, demo, view publication, learn more) reuse the credit label at 0.64rem to 0.68rem, 44px tall, as outline or gold-fill variants.

### Cards / Containers
- **Corner Style:** square.
- **Background:** ash at 60% over the void, so the smoke shows faintly through.
- **Shadow Strategy:** the double gold frame (see Elevation & Depth); no lift.
- **Internal Padding:** 28px to 56px for publications, 28px to 44px for the contact form.
- **Interior:** a gold rule at 60% divides header from body.

### Inputs / Fields
- **Style:** a void well at 70% with only a gold-dim underline, square, 48px tall, bone text at 1.125rem, placeholders in weathered bone. Labels are credit capitals in gold.
- **Focus:** the underline turns fire; no ring.
- **Disabled:** 50% opacity while submitting.

### Navigation
Gold title-card navigation. The wordmark is the small SVG Ring plus the name in gilded Cinzel at 0.16em. Links are credit labels in burnished gilt, dimmed to 62% at rest and full on hover; the current page is full gilt with a 24px fire underline that grows from the centre. Transparent over the hero, the bar turns void at 90% with backdrop blur and a gold rule beneath once the page scrolls. Below lg a square hairline menu button opens a curtain (clip-path reveal, 350ms) of Cinzel links at 1.25rem.

### Title Card
The page and section header: gilded Cinzel capitals rising out of black (lift 14px, blur 8px to 0, 1.1 to 1.2s), then a small gold ring between two tapering gold rules, then an optional italic Spectral subtitle in weathered bone.

### The Ring
The home hero's relic, modelled on the film's One Ring and rendered in three.js: a plain, heavy comfort-fit band (about a quarter as wide as the finger hole, domed outside and gently rounded inside) in mirror-polished yellow gold (metalness 1, roughness 0.11) reflecting a dark, fire-lit room. It holds one fixed pose, seen from a little above with the front of the band toward the viewer, and never follows the pointer. When cold it is plain; after the fall its inscription shows in fire on both the outside and the inside of the band, fading up all at once as metal heats, with a red bloom, an orange glow and a pale molten core, and a faint flicker. The flat SVG Ring stands in for small uses (nav, contact, 404) and whenever WebGL fails. The letters are written in the manner of the Ring's calligraphy (slanted broad-nib stems, bows and marks above) as random sequences, so they never spell the real inscription.

### Project Still
A letterboxed 2.39:1 frame inside the double gold frame. The still is dark until it enters view, then cuts up into an amber grade (grayscale, sepia, 0.82 brightness, 1.35 saturation) and plays in true colour on hover or keyboard focus, over 1.6s. A vignette closes the edges. Below it, the project title card and credit-set tech stack sit beside the description.

### End Credits
Skills roll centred like end credits: the category as a gold credit label, the names beneath in bone Cinzel, spaced rather than separated.

### The Journey Map
The About timeline, drawn like the films' map of Middle-earth: one parchment sheet in the void, newest year at the top. Its edge is torn and burnt by an SVG displacement filter (`#map-burn`) on the `.parchment` layer only, with a scorch band inside the edge and faint ember firelight pooled above it. The sheet carries quarter-fold creases and foxing (`.map-folds`), a double ink neatline inside the edge, and an original compass rose in the top corner.
- **Regions:** each year is a region name in ink Cinzel, 1.75rem to 2.9rem at 0.42em tracking, beside a mountain range in two rows. Peaks have shouldered flanks, a ridge falling from the summit and streaks running down the shadowed face. Nearer peaks, trees and hills knock out the ones behind with a parchment wash at 60%. The road crosses each range through a pass, and the label and range swap sides from year to year.
- **Country:** the open ground beside each place cycles through four landscapes: a wood with a river running out to the sheet's edge; downs with marsh tufts; a lake fed by a river beside a small wood; lone peaks below a wood. Rivers rise from the range above when one is there. Woods are rows of round crowns, the front row on trunks. Sparse hills and tufts are scattered over the rest of the sheet, kept clear of every word and of the road. Below the start of the journey, the western coast falls away to the south-west, with sea ripples along it and an island offshore.
- **Places:** entries alternate left and right of the road (44% each on desktop; a single column with the road down the left on phones). Each place carries a hand-inked symbol in a parchment knockout: a tower for education, a town for work, a beacon on a hill for a win.
- **The road:** a dashed path read from the laid-out places. Every bend leaves and arrives heading south, so the road only ever runs down the page, and between places it swings into the open ground behind the place it just left. All of the country is seeded, so it stays put on every visit.
- **Motion:** the whole road is always visible in faint pencil. As the reader scrolls, red ink runs down it to 60% of the viewport, with the small gold Ring travelling at its head. Under reduced motion the road is fully inked and the Ring rests at the top.

## Do's and Don'ts

### Do:
- **Do** keep every label, heading, nav item and button in its original wording; the theme is carried by material, colour, type, imagery and motion alone.
- **Do** draw only on the Peter Jackson films, and only as homage built from original material.
- **Do** keep fire orange to the inscription and the active or focused state, and use ember only as light.
- **Do** set every title in gilded Cinzel capitals and every small label in the 0.24em credit treatment.
- **Do** separate surfaces with gold hairline frames and tapering gold rules, square-cornered.
- **Do** present project imagery letterboxed at 2.39:1, amber-graded at rest and in true colour on hover or focus.
- **Do** bring new content in by rising out of black on the cubic-bezier(0.16, 1, 0.3, 1) ease, and drop the motion entirely under reduced motion.

### Don't:
- **Don't** write themed copy: no franchise names, quotes, invented kickers or Middle-earth phrasing in text.
- **Don't** use franchise logos, real Tengwar or Black Speech inscriptions, film stills, character art or proprietary film fonts.
- **Don't** use fire orange as a fill, heading colour, hover colour or decoration.
- **Don't** add a light mode, a theme toggle or a light surface.
- **Don't** add parchment or map textures anywhere but the About timeline's map sheet, and never neon-on-black glows.
- **Don't** round corners or lift panels with drop shadows; a round form must read as the Ring.
- **Don't** set prose in Cinzel or in gold.
