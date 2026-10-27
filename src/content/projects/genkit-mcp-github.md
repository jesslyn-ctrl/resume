---
title: Genkit × MCP GitHub — AI Code Review
summary: A web app that reviews GitHub pull requests with Gemini, reaching GitHub through a self-hosted MCP server from inside Firebase Genkit flows.
role: Design and development
period: '2025'
stack: [Firebase Genkit, Next.js, TypeScript, Gemini, MCP, Firebase]
visibility: public
featured: true
order: 1
---

## Overview

Code review is slow when reviewers are busy, and a first pass on a pull request is often mechanical. This project gives a pull request that first pass automatically: pick a repository, pick an open pull request, and get a structured review with a summary and specific suggestions.

The interesting part is how the model reaches GitHub. Instead of hand-writing GitHub API calls, the app connects Genkit to a self-hosted GitHub MCP server, so the model calls GitHub tools itself.

## How it works

- **Genkit flows** define each step as a typed function: look up a user, list repositories and branches, list pull requests, and review one pull request.
- **MCP tools** from the GitHub MCP server are exposed to the model. Listing pull requests uses the server's pull-request listing tool; the review flow asks the model to fetch the pull request diff with the diff tool and then review it.
- **Structured output** keeps the model honest. Each flow declares an output schema, so the review comes back as a summary plus a list of suggestions rather than free text, and the flow fails loudly if the response does not match.
- **Next.js front end** walks through the steps: repository form, pull request list, review page.

## What I built

- The Genkit configuration that registers the MCP client alongside the Gemini model.
- A custom repository tool and the flows for users, repositories, branches, and pull requests.
- Typed schemas shared between the flows and the UI.
- The Next.js pages and components for the review walkthrough.
- Deployment setup for Firebase, including hosting workflows on GitHub Actions.
