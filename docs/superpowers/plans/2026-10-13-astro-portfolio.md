# Astro Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-file resume page with a multi-page Astro site (home, projects index, five case studies, 404) deployed to GitHub Pages.

**Architecture:** Static Astro build. Resume content lives in typed data modules, case studies in a Markdown content collection whose schema enforces the confidentiality rule. Small single-purpose `.astro` components render from that data; interactivity is three small scripts (theme, scroll reveal and nav highlight, tag filter).

**Tech Stack:** Astro 7, TypeScript (strict), plain CSS with custom properties, `@astrojs/sitemap`, `@astrojs/check`, GitHub Actions + GitHub Pages.

Spec: `docs/superpowers/specs/2026-10-13-astro-portfolio-design.md`

There is no unit-test framework: the spec's verification is `astro check`, `astro build`, and a browser pass. Each task ends with `npm run check && npm run build` and a commit.

---

## File map

| File | Responsibility |
|---|---|
| `package.json`, `tsconfig.json`, `astro.config.mjs`, `.gitignore` | Tooling; `site` and `base: /resume` |
| `src/lib/url.ts` | `url(path)` prefixes the base path; the only place that knows it |
| `src/data/profile.ts`, `experience.ts`, `skills.ts`, `speaking.ts`, `education.ts` | Resume content as typed data |
| `src/content.config.ts` | `projects` collection schema, rejects `repo` on limited projects |
| `src/content/projects/*.md` | Five case studies |
| `src/styles/global.css` | Tokens (light and dark), base elements, shared utilities, reveal classes |
| `src/layouts/BaseLayout.astro` | Document shell, meta and SEO tags, theme bootstrap, header, footer |
| `src/components/Header.astro`, `ThemeToggle.astro`, `Footer.astro` | Site chrome |
| `src/components/Hero.astro`, `Section.astro`, `Timeline.astro`, `TimelineItem.astro`, `SkillsGrid.astro`, `SimpleList.astro` | Home sections |
| `src/components/ProjectCard.astro`, `TagFilter.astro` | Project listing |
| `src/scripts/site.ts` | Scroll reveal, nav section highlight, theme toggle and tag filter wiring |
| `src/pages/index.astro`, `projects/index.astro`, `projects/[slug].astro`, `404.astro` | Routes |
| `public/favicon.svg` | Icon |
| `.github/workflows/deploy.yml` | Build and publish on push to `main` |

## Tasks

### Task 1: Scaffold

- [ ] Write `package.json` (scripts `dev`, `build`, `preview`, `check`), `tsconfig.json` extending `astro/tsconfigs/strict`, `astro.config.mjs` with `site`, `base: '/resume'`, `trailingSlash: 'always'`, sitemap integration, and `.gitignore` (`node_modules`, `dist`, `.astro`).
- [ ] `npm install astro @astrojs/sitemap @astrojs/check typescript`.
- [ ] Remove root `index.html` and `.nojekyll`.
- [ ] Add `src/lib/url.ts` and a minimal `src/pages/index.astro`; run `npm run check && npm run build`; expect both to pass.
- [ ] Commit.

### Task 2: Resume data

- [ ] Create the five `src/data/*.ts` modules with exported types, copying every string from the old `index.html` verbatim.
- [ ] `npm run check`; commit.

### Task 3: Content collection and case studies

- [ ] Write `src/content.config.ts` with the schema from the spec and the `repo`-on-limited refinement.
- [ ] Write the five Markdown files. Limited ones (`valerie`, `tikacore`, `klik-indomaret`) contain only overview, role, stack, outcomes.
- [ ] Prove the rule: temporarily add `repo:` to `tikacore.md`, run `npm run build`, expect a schema failure, then remove it.
- [ ] Commit.

### Task 4: Styles, layout, chrome

- [ ] `global.css`: light tokens on `:root`, dark tokens under both `prefers-color-scheme` (unless `data-theme="light"`) and `data-theme="dark"`; skip link; focus styles; reveal classes gated on `.js` and `prefers-reduced-motion: no-preference`.
- [ ] `BaseLayout.astro` with props `title`, `description`, optional `jsonLd`; inline head script that applies the stored theme before paint and again after each view transition.
- [ ] `Header.astro`, `ThemeToggle.astro`, `Footer.astro`.
- [ ] Check, build, commit.

### Task 5: Home page

- [ ] Section components, then `index.astro` composing hero, featured projects, experience, skills, speaking, education, with JSON-LD `Person`.
- [ ] Check, build, commit.

### Task 6: Projects pages and 404

- [ ] `ProjectCard.astro`, `TagFilter.astro`, `projects/index.astro`, `projects/[slug].astro` (limited note, repo link only when present), `404.astro`.
- [ ] Check, build, commit.

### Task 7: Scripts

- [ ] `src/scripts/site.ts`: on `astro:page-load`, wire theme toggle (`aria-pressed`, `localStorage` in try/catch), `IntersectionObserver` reveal, home nav highlight, tag filter.
- [ ] Check, build, commit.

### Task 8: Deploy workflow

- [ ] `.github/workflows/deploy.yml` using `actions/checkout`, `actions/setup-node`, `npm ci`, `npm run build`, `actions/upload-pages-artifact`, `actions/deploy-pages`, triggered on push to `main`.
- [ ] Commit. Do not change the repository Pages setting without confirmation.

### Task 9: Verification

- [ ] `npm run check` and `npm run build` clean.
- [ ] `npm run preview`; open every route under `/resume/` in light and dark, at desktop and 390px, and with reduced motion.
- [ ] Read each limited case study against the confidentiality rule.
