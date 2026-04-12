# Airtable Component Schemas

Structured component and token schemas for `@airtable/blocks`, designed to be wired into AI development tooling — Cursor rules, Claude skills, and LLM context injection.

The schemas in this folder demonstrate what machine-readable design system documentation looks like in practice: typed prop definitions with usage annotations, token values with semantic names, and constraint validators that encode rules prose documentation can't enforce.

---

## What's here

| File | What it contains |
|---|---|
| `tokens.ts` | Color, spacing, and interactive state tokens — Figma-authoritative values with semantic names |
| `button.schema.ts` | Button props, variant token bindings, and usage constraint validators |

---

## Wiring into a Cursor rule

Cursor rules (`.cursor/rules/*.mdc`) inject component knowledge into every AI generation in your project. The constraint-style annotations in the schemas are the right level of detail — specific enough to enforce, terse enough to fit in context.

**`.cursor/rules/airtable-button.mdc`**

````markdown
---
description: Enforce Airtable Button usage rules when writing UI code
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: false
---

# Airtable Button — Usage Rules

When generating or editing code that uses `Button` from `@airtable/blocks/ui`:

## Variants
- `default` — generic actions, toolbars. Background: #F2F2F2, text: #333333.
- `primary` — single most important action per screen. Background: #2D7FF9, text: white. **NEVER more than one per surface.**
- `secondary` — cancel/back; transparent background (not gray). Pairs with primary.
- `danger` — irreversible destructive actions only. Background: #EF3061, text: white. **NEVER use for cancel, back, or close.**

## Props
- No `loading` prop exists. Disable the button and change label text instead.
- `icon` is always left-aligned. There is no `rightIcon` prop.
- Icon-only buttons (no `children`) MUST have `aria-label`.
- Use `type="submit"` inside forms.

## Sizes
- `small` — dense toolbars, table row actions
- `default` — most contexts
- `large` — primary CTAs in onboarding flows

## Tokens (use these, not raw hex)
```
Light gray 2 = #F2F2F2   (default bg)
blueBright   = #2D7FF9   (primary bg)
red          = #EF3061   (danger bg)  ← NOT #F82B60
Dark         = #333333   (default/secondary text)
```
````

---

## Wiring into a Claude skill

Claude skills inject instructions into Claude's context for specific tasks. A component skill tells Claude how to generate valid Airtable UI before it writes a line.

**`.claude/skills/airtable-ui.md`**

````markdown
# Airtable UI Generation — Component Rules

When the user asks you to write Airtable app UI using `@airtable/blocks/ui`:

## Before generating any Button

1. Is there already a `variant="primary"` on this surface? If yes, the new button must be `default` or `secondary`.
2. Is the action destructive and irreversible? Use `danger`. Is it cancel/back/close? Use `secondary`, not `danger`.
3. No label text? Add `aria-label` — required, runtime error without it.
4. Inside a `<form>`? Use `type="submit"`.

## Token reference (authoritative)

| Token | Value | Use |
|---|---|---|
| `Light gray 2` | `#F2F2F2` | default button bg |
| `blueBright` | `#2D7FF9` | primary button bg |
| `red` | `#EF3061` | danger button bg |
| `Dark` | `#333333` | default/secondary text |

## What doesn't exist (do not generate)

- No `loading` prop on Button
- No `rightIcon` or `iconRight` prop
- No `xlarge` size on Button (only on TextButton)
- `secondary` has no background fill — it is transparent
````

---

## The enforcement loop

```
Component schemas (typed annotations + constraint validators)
  ↓ generates
Cursor rule (.mdc) + Claude skill (.md)
  ↓ enforces at
Generation time (Cursor/Claude) + Code review
  ↓ catches
Wrong variants · missing aria-label · two primaries · wrong token values
```

---

## On source of truth

The schemas here are hand-authored from `@airtable/blocks` v1.19.0 source and the Airtable Apps UI Kit Figma file. For a library you own, the better architecture is to generate this documentation layer from the existing TypeScript interfaces and token definitions directly — so the docs can't drift from the implementation. The hand-authored approach is appropriate for a third-party library where you're working from the outside in.

---

*Sources: `@airtable/blocks` v1.19.0 + Airtable Apps UI Kit Figma (April 2026)*
