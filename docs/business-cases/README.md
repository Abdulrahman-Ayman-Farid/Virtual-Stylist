# Virtual Stylist — Business Cases for End Users

## Executive Summary

Virtual Stylist is an AI-powered wardrobe companion that turns a single garment photo into a complete styling plan. Users upload a statement garment image, and the app analyzes it to extract a color palette (with click-to-copy hex swatches), silhouette, style tags, a styling difficulty rating, and a stylist core tip. From that analysis it generates three occasion-based outfits — Casual, Business, and Night Out — each presented as an AI-generated flat-lay image with a piece checklist and copy-to-clipboard convenience.

Beyond generation, Virtual Stylist is interactive: users refine flat-lays through the Image Prompt Studio (quick prompts such as swapping shoes or adding a trench coat, with full edit history), consult "Jean-Luc, your editorial fashion director" in a multi-turn AI stylist chat for unfiltered critique and custom flat-lay design, and build a persistent Wardrobe Capsule saved to localStorage. A "Stylist Methodology" modal (The Atelier Codex) explains the Three Invariants of Styling — Volumetric Counterweight, High-Low Dialectic, and Neutral Grounding Anchor — so every recommendation is grounded in a teachable method, not a black box.

## Target User Personas

### 1. Fashion-Conscious Shoppers

Shoppers who care about looking intentional and want expert-level validation before committing to a purchase or an outfit.

| Aspect | Detail |
| --- | --- |
| Pain points | Unsure whether a bold statement piece can be styled for multiple occasions; overwhelmed by color pairing decisions; no access to a professional stylist. |
| Goals | Get occasion-specific outfit ideas instantly; understand how to integrate a new garment into their existing wardrobe; receive honest, editorial-grade critique. |

### 2. Wardrobe Optimizers

Pragmatic users who want to get more wear out of what they already own and avoid unworn purchases.

| Aspect | Detail |
| --- | --- |
| Pain points | Owns great pieces but wears only a fraction of them; buys items that never match anything; lacks a system for tracking styled combinations. |
| Goals | Maximize cost-per-wear by generating Casual, Business, and Night Out looks from existing garments; save approved outfits to the Wardrobe Capsule for quick reuse; use the piece checklist to shop their own closet first. |

### 3. Style Explorers

Curious, experimentation-driven users who treat fashion as a creative practice and want to learn, not just be told.

| Aspect | Detail |
| --- | --- |
| Pain points | Generic style advice that doesn't explain *why* an outfit works; limited tools for iterating on a look; no safe space to test bolder choices. |
| Goals | Learn the Three Invariants of Styling via the Stylist Methodology modal; iterate on flat-lays interactively with the Image Prompt Studio; explore different fits (relaxed, tailored, oversized), lenses (womenswear, menswear, versatile), and seasons via styling preferences. |

## Value Proposition

| Benefit | How It Helps the User |
| --- | --- |
| Instant garment intelligence | Upload once and receive color palette (click-to-copy hex swatches), silhouette, style tags, difficulty rating, and a stylist core tip — no styling expertise required. |
| Occasion-ready outfits | Three curated looks (Casual, Business, Night Out) with AI-generated flat-lay images and copyable piece checklists remove the "what do I wear?" decision burden. |
| Interactive refinement | The Image Prompt Studio lets users steer edits with quick prompts (swap shoes, add a trench coat) and review edit history, so the final look is theirs. |
| Editorial stylist chat | "Jean-Luc, your editorial fashion director" delivers unfiltered critique and designs custom flat-lays on demand, with starter prompts to begin the conversation. |
| Persistent capsule wardrobe | The Wardrobe Capsule (localStorage) keeps saved outfits across sessions — save, remove, and reopen looks anytime. |
| Teachable methodology | The Stylist Methodology modal explains Volumetric Counterweight, High-Low Dialectic, and Neutral Grounding Anchor, turning each outfit into a styling lesson. |
| Personalized output | Fit, lens, and season preferences tailor every recommendation to the user's body, wardrobe, and climate. |
| Portable results | Outfit images can be downloaded for sharing, shopping, or getting dressed offline. |

## Table of Contents

- [Business Case 1 — Decoding a Statement Garment](./01-garment-analysis.md)
- [Business Case 2 — Occasion-Ready Outfit Generation](./02-outfit-generation.md)
- [Business Case 3 — Interactive Flat-Lay Editing](./03-flat-lay-editing.md)
- [Business Case 4 — AI Stylist Chat](./04-stylist-chat.md)
- [Business Case 5 — Building a Capsule Wardrobe](./05-capsule-wardrobe.md)
