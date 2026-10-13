---
title: Kopi Senja POS
summary: A point-of-sale web app for a counter-service café, built as a full-stack portfolio project with a Go GraphQL API and a Next.js front end.
role: Design and development
period: '2026'
stack: [Go, GraphQL, PostgreSQL, Next.js, TypeScript, Docker]
visibility: public
featured: true
order: 2
---

## Overview

Kopi Senja is a fictional café in Indonesia, and this is its till. A cashier takes an order at the counter, the customer pays, a barista sees the order on a second screen, and a manager reviews the day's sales and edits the menu. The aim is a polished, believable product rather than a demo of one feature.

The project is in active development. The cashier flow came first; the other screens follow the same design.

## Scope

- **Cashier:** menu grid by category, item customisation with modifiers, cart, checkout by cash, card, or QRIS, receipt, and the day's order history.
- **Barista queue:** a live board of paid orders moving from queued to completed.
- **Sales dashboard:** revenue, order count, average order value, sales by hour, and best sellers for a chosen day.
- **Menu admin:** categories, items, prices, availability, and modifier groups.

Payments are simulated behind an interface; no money moves.

## Architecture

- **Front end:** Next.js with TypeScript, laid out tablet-first for a counter.
- **API:** a single Go service structured as a modular monolith, with modules for menu, orders, and payments. Requests flow from thin GraphQL resolvers to use cases to repositories.
- **Contract:** the GraphQL schema is the single contract between both sides, with code generated from it by gqlgen. Subscriptions carry live queue updates.
- **Data:** PostgreSQL, with migrations run by the service.

## Details that make it believable

- Prices are in rupiah with PPN 11% included, formatted the local way.
- Business days, daily order numbers, and reports use the Asia/Jakarta time zone.
- One command starts the database, API, and web app in Docker, seeded with a demo menu.
- Go and web unit tests, plus Playwright for end-to-end checks.
