---
title: Bonbon
summary: A cross-platform bill-splitting app. Snap a restaurant receipt, let Gemini read every line, tap who had what, and send everyone their share as an image.
role: Design and development
period: '2026'
stack: [React Native, Expo, TypeScript, Gemini, Zustand, EAS]
visibility: public
featured: true
order: 0
---

## Overview

In Indonesia you ask the waiter for the *bon*, the bill. Bonbon turns that bill into fair shares. Photograph the receipt and the app reads every item, the tax, the service charge, and any discount. Friends appear as pastel pebbles: tap a person, then tap what they had. Shared dishes split evenly, extras are spread in proportion to what each person ordered, and the result goes to the group chat as a receipt-styled image.

One codebase runs on Android and iOS, with an installable Android build from EAS.

## Scope

- **Scan:** a custom in-app camera with corner guides, flash, and a gallery fallback. A scan line sweeps the photo while it is read.
- **Manual entry:** add, edit, or delete lines by hand, which doubles as the fix for anything the model misreads.
- **Assign:** tap-to-assign with a live total for whoever is picking, and a count of items that still need an owner.
- **Settle:** choose who paid the bill, mark friends as paid, nudge the rest, and share the split as a PNG or as text.

## Architecture

- **App:** Expo (React Native) with Expo Router file-based routes, TypeScript, and a small Zustand store.
- **Receipt reading:** an Expo Router API route on EAS Hosting calls Gemini with a JSON Schema generated from the app's Zod model, then validates the reply against the same schema. The API key lives only on the server, never in the app.
- **Model chosen by measurement:** on a test receipt, Gemini 3.5 Flash-Lite returned every value exactly in about four seconds. A larger Flash model was just as accurate but took minutes per call, so the lighter model ships.

## Details that make it believable

- Money is split in the smallest payable unit (whole rupiah, never cents) with largest-remainder rounding, so the shares always add up to the printed total.
- Rupiah is formatted the way receipts print it: Rp 181.730.
- A deliberate visual identity: receipt paper with torn, scalloped edges, a sambal-red accent, pastel friend colours, and a mascot, Snappy, who reacts as you scan and settle up.
- Unit tests cover the split engine, amount parsing, and settlement rules.
