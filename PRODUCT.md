# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 18 + TypeScript, Tailwind CSS, shadcn/ui (Radix), framer-motion, react-router-dom, react-helmet-async. Deployed on Vercel; `api/contact.ts` (Resend) backs the contact form and `api/og.ts` serves OG images.

## Purpose

Personal portfolio of Arnav Rajashekara: software engineer (systems & data), M.Eng. CS student at Cornell, B.S. CSE + Statistics from Ohio State. The site presents who he is, his projects, his publication, his resume, and a way to reach him.

## Audience

Primarily a personal showcase. The owner chose maximum immersion over recruiter-safe restraint ("go all-in"), but the people landing here are still engineers, hiring managers, and friends who need to find projects, resume, and contact.

## Brand commitments

- Theme is pure Lord of the Rings / Middle-earth (owner, 2026-10-08; replaces an earlier four-franchise mashup). No other franchises.
- The theme is purely graphic (owner, mid-build): every label, heading, nav item, and button keeps its original wording. No themed copy, no franchise names or quotes in text; the mashup lives only in material, color, type, imagery, and motion.
- Homage only: no franchise logos, trademarked marks, character art, or ripped proprietary fonts. Evoke through original material.

## Must preserve

- Every word of copy: factual content in `src/lib/content.ts` and all UI labels/headings as originally written.
- The contact form and its `/api/contact` POST contract.
- The six routes: `/`, `/about`, `/projects`, `/publications`, `/resume`, `/contact` (plus 404).

## Open

- Light mode: the light/dark toggle was removed in the redesign as a design decision (the Prologue world is dark-only; see DESIGN.md). The owner never asked for this either way; bring a light variant back only if they ask.
