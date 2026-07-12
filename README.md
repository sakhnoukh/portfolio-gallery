# Art Gallery Portfolio

A horizontal-scrolling portfolio styled as a physical art gallery. Built with React (Vite), TypeScript, SCSS, and GSAP ScrollTrigger. See `PRD.md` for the full concept.

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build to dist/
```

## Editing content

All pieces live in `src/data/pieces.ts`. Each entry controls:

- `title`, `year`, `medium`, `description` — placard text
- `variant` — frame style: `modern` (tech), `classic` (hobbies), `canvas` (experience)
- `kind` — placeholder art type: `poster`, `book`, `photo`, `timeline`
- `accent` — artwork background colour
- `timeline` — entries for the experience piece

To use real images instead of the CSS placeholder art, replace `ArtContent` output with an `<img>` inside `frame__art` (portrait 3:4 crops work best).

## Structure

- `src/components/Gallery.tsx` — pinned horizontal scroll (desktop), snap carousel (mobile), arrow-key nav
- `src/components/Frame.tsx` / `Placard.tsx` / `InspectOverlay.tsx` — gallery pieces
- `src/styles/` — wall, frames, placards, inspection overlay
