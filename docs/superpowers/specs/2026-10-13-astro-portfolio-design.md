# Astro portfolio rebuild — design

Date: 2026-10-13

## Goal

Replace the single-file static resume page with a multi-page Astro site: a home page carrying the resume content, a projects index, and one case-study page per project. Visual style is refined minimal. Hosting stays on GitHub Pages at the current address (`https://jesslyn-ctrl.github.io/resume/`).

## Out of scope

Blog, backend, contact form, analytics, resume PDF download, CSS framework, CMS.

## Stack

- Astro (current stable), TypeScript in strict mode, static output.
- Plain CSS: global design tokens as custom properties plus component-scoped styles. Tokens start from the existing palette (`--accent:#2f5fd8`, 800px content width, 10px radius) and gain a dark set.
- `@astrojs/sitemap` for the sitemap. No UI framework; interactivity is small inline scripts.
- `astro.config` sets `site: https://jesslyn-ctrl.github.io` and `base: /resume`. Every internal link and asset goes through the base path.

## Pages

| Route | Content |
|---|---|
| `/` | Hero, featured projects, experience timeline, skills, speaking, education and community, contact footer |
| `/projects/` | Grid of all projects with tag filter |
| `/projects/<slug>/` | Case study |
| `/404` | Not-found page with a link home |

Home page text is carried over from the current `index.html` unchanged, except that "Recent Project" becomes a featured-projects section linking to case studies.

## Content model

### Projects: `src/content/projects/*.md`

Frontmatter, validated by a content collection schema:

- `title` (string)
- `summary` (string, one sentence, used on cards and in meta description)
- `role` (string)
- `period` (string)
- `stack` (string array, also the filter tags)
- `visibility` (`public` | `limited`)
- `repo` (URL, optional; schema rejects it when `visibility` is `limited`)
- `featured` (boolean; featured projects appear on the home page)
- `order` (number, sort key)

The Markdown body is the case study.

### Projects in this release

| Slug | Visibility | Notes |
|---|---|---|
| `genkit-mcp-github` | public | Repo link to `jesslyn-ctrl/genkit-mcp-github` |
| `kopi-senja-pos` | public | Portfolio project; no repo link until one is published |
| `valerie` | limited | |
| `tikacore` | limited | |
| `klik-indomaret` | limited | Employer work at SG-EDTS |

### Confidentiality rule

A `limited` case study contains only: overview of the problem domain, Jesslyn's role, technology stack, and outcomes in general terms. It contains no flows, diagrams, data models, endpoint lists, screenshots, or repository links. The page template renders a short "details withheld" note for limited projects. `public` case studies may add architecture and implementation detail.

All drafted text comes from the resume and the repositories. No invented metrics or claims.

### Resume data: `src/data/`

Typed TypeScript modules, one per section: `profile.ts` (name, role, summary, contact links), `experience.ts`, `skills.ts`, `speaking.ts`, `education.ts`. Components render from these; no resume text lives in component markup.

## Components

Each has one job and takes typed props.

- `BaseLayout.astro` — document shell, meta tags, theme bootstrap script, header, footer, view transitions.
- `Header.astro` — sticky nav with section links and the theme toggle; highlights the current section on the home page and the current route elsewhere.
- `ThemeToggle.astro` — switches light and dark.
- `Hero.astro`, `Timeline.astro` + `TimelineItem.astro`, `SkillsGrid.astro`, `SimpleList.astro` (speaking, education), `Footer.astro`.
- `ProjectCard.astro` — title, summary, stack tags, and a "limited detail" marker when applicable.
- `TagFilter.astro` — filter buttons on the projects index.
- `Reveal` — a small script and CSS class for scroll-in animation, not a component with markup.

## Behaviour

- **Theme.** Default follows `prefers-color-scheme`. The toggle sets `data-theme` on `<html>` and stores the choice in `localStorage`. An inline script in `<head>` applies the stored choice before first paint to avoid a flash. If storage is unavailable, the toggle still works for the current page.
- **Transitions.** Astro view transitions between pages; the theme persists across them.
- **Scroll reveal.** Sections fade and rise slightly on entering the viewport via `IntersectionObserver`. Under `prefers-reduced-motion: reduce`, and when JavaScript is off, all content is visible with no animation.
- **Tag filter.** Buttons on `/projects/` show cards whose `stack` includes the chosen tag; "All" resets. Without JavaScript all cards show.
- **SEO.** Per-page title and description, canonical URL, Open Graph and Twitter tags, sitemap, and JSON-LD `Person` on the home page.
- **Accessibility.** Semantic landmarks, skip link, visible focus styles, WCAG AA contrast in both themes, toggle and filter buttons with `aria-pressed`.
- **Responsive.** Single column below 600px; nav collapses to a compact row that stays usable at 360px width.

## Error handling

Build-time only: the collection schema fails the build on missing or invalid frontmatter, including a `repo` on a limited project. There is no runtime data fetching.

## Deploy

- Work happens on branch `astro-rebuild`; `main` and the live site are untouched until merge.
- `.github/workflows/deploy.yml` builds on push to `main` and publishes with the official GitHub Pages actions.
- The repository's Pages source must be changed once from "Deploy from a branch" to "GitHub Actions". This is done only with Jesslyn's confirmation, at merge time.
- The old `index.html` and `.nojekyll` are removed from the root as part of the rebuild; the history keeps them.

## Verification

- `astro check` passes with no errors.
- `astro build` succeeds.
- Each route is viewed in a browser from the built output (`astro preview`, served under `/resume/`): light and dark themes, desktop and 390px widths, and with reduced motion enabled.
- Every limited case study is read against the confidentiality rule before merge.
