---
version: 1
slug: "src-pages-index-tsx"
primary_target: "src/pages/Index.tsx"
related_targets: ["src/pages/About.tsx","src/pages/Projects.tsx","src/pages/Publications.tsx","src/pages/Resume.tsx","src/pages/Contact.tsx","src/pages/NotFound.tsx","src/components/layout/Layout.tsx"]
---

# Surface brief: whole portfolio site (all routes)

Scope: every route (/, /about, /projects, /publications, /resume, /contact, 404) plus shared layout. Visitor mode: Experience. Audience: personal showcase, owner chose all-in immersion; visitors still need projects, resume, and contact within seconds. Constraints: pure Lord of the Rings, drawn ONLY from the Peter Jackson films (owner); purely graphic theme, every label/heading/button keeps its original wording; factual copy in src/lib/content.ts untouched; contact form + /api/contact unchanged; routes unchanged; homage only, no logos, real Tengwar inscriptions, film stills, or proprietary fonts.

## Direction contract

THESIS: Every page opens like the Fellowship prologue: out of a black void, one fire-lit gold relic (the Ring) and engraved gold capitals rise into view. It refuses the parchment-and-map fan page and the generic neon-on-black portfolio.

OWN-WORLD: Void black (#060504) with slow smoke, ash panels (#12100d), solid fire-lit gold (#c9a24a, highlight #f2d27a, shadow #7d6630) for type, rules and frames; fire orange (#e0632a) reserved for the inscription and whatever is active or focused; pale bone text (#d8d0bf). Cinzel engraved capitals for titles and tracked small-cap labels like film title and credit cards; Spectral for prose. Gold hairline frames, letterboxed widescreen stills for projects, skills set as an end-credits roll, timeline as an ember thread.

STORY: The visitor arrives in darkness, watches the Ring fall and its inscription ignite, reads "Hi, I'm Arnav" rise in gold, then moves to projects, about, publications, resume, or contact through gold title-card navigation.

FIRST VIEWPORT: Home at 1440x900: black void, gold nav in tracked small caps on top. Centered upper half: the Ring (~280px) slowly turning, firelight pooling on smoke beneath it, its glyph inscription igniting in fire orange. Below: "Hi, I'm Arnav" in gold Cinzel at 6rem, the title in tracked small caps, then View Projects (gold) and Contact Me (gold outline). Signature interaction: arrival sequence (Ring falls and settles, inscription ignites in a sweep, title rises from black); the Ring tilts toward the pointer and its inscription brightens as the pointer nears.

FORM: The Prologue (films' opening sequence), position 1 on the ordered grounded list (IMPECCABLE'S PICK chosen by the owner over the rolled Meduseld); seed key 472018c7. Raises kept: flat layered depth (papercut), palette law with one reserved accent (arcade), fixed reading order (six-pack).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
