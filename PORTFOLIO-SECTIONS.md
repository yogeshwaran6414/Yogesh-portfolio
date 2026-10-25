# Portfolio middle sections

Implemented in the existing Next.js application with its Ember Noir tokens and GSAP.

## Files
- src/App.tsx: inserts the middle sections after CinematicHero.
- src/components/portfolio/MiddleSections.tsx: services, approach, toolkit, selected work.
- src/components/portfolio/middle-sections.css: scoped responsive styles, interface concepts, reduced-motion styles.
- src/data/middleSections.ts: editable service copy, principles, skills, and unpublished project drafts.
- src/components/Contact.tsx: section 06 heading, contact CTAs, restrained glow; existing form submission retained.

Hero, portrait, footer, navigation, dependencies, and configuration were not edited.

## Verification
- `npx tsc --noEmit`: passed.
- `npm run build -- --webpack`: passed, including TypeScript and static page generation.
- Default `npm run build`: Turbopack worker connection error, also reproduced outside the sandbox. No configuration workaround was committed.
- Production page rendered without console errors.
- Checked 1920, 1440, 1024, 768, 390 and 360 px widths for page overflow; none found.
- Desktop services and 360 px services/contact visually inspected.
- Keyboard service expansion, accordion panel visibility, contact anchors, mailto destination and native required-field validation verified.
- Reduced-motion CSS and GSAP guards reviewed; browser motion preference emulation was unavailable.
- No inquiry submitted. Only .env.example is present locally; Gmail delivery requires deployment credentials.

## Content to provide
- Real screenshots for the CRM, e-commerce platform, Business Bench and White Horse. Existing stock images are clearly captioned as editorial images, not screenshots.
- Live demo/repository links for the CRM and e-commerce platform; unavailable actions are hidden.
- Confirmed project details, screenshots and links for Nxt Trendz, Food Munch, Todos Application and Business Dashboard. Editable drafts are in middleSections.ts and are not published as completed projects.
- Review the editable skill groups against actual experience. Requested technologies were used, with PostgreSQL supported by existing project data.

Existing Business Bench and White Horse links were retained. External availability could not be fully verified: the first was inaccessible to the web reader and the second returned a verification page. Existing generic social URLs in the preserved footer/contact remain unchanged.

Preview screenshot: portfolio-sections-preview.png.
For local preview if Turbopack still fails: `npm run dev -- --webpack`.

## Hero-to-services scroll transition
- Added src/components/ui/hero-scroll-animation.tsx and its scoped stylesheet.
- Adapted the supplied scale/rotation design to existing hero and services content, using the installed GSAP/ScrollTrigger lifecycle.
- Desktop: hero 1 -> 0.8 scale / 0 -> -5 degrees; services 0.8 -> 1 / 5 -> 0 degrees.
- Mobile: reduced travel (0.94 scale and 1.5 degrees). Reduced motion and short landscape viewports use normal document flow.
- Natural-height services, no fixed-height content clipping or new smooth-scroll library.
- Stable, untransformed #hero and #services anchors preserve navigation with sticky positioning.
- Scroll to Explore now targets services. Existing contact buttons retain their destinations.
- GSAP matchMedia reverts animation state and triggers on preference changes and unmount.
