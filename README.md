# air-blocks-ai

AI-native component documentation for the Airtable Apps SDK (`@airtable/blocks`).

This repo is a proof of concept for a format: design system documentation written to be consumed by LLMs, not just humans. The goal is component specs that enforce correct usage at generation time — preventing the wrong variant names, missing props, and invented APIs that LLMs produce when working from generic training data.

---

## The problem

Standard component documentation is written for humans skimming in a browser. That format works poorly as input to a code generator. An LLM generating `@airtable/blocks` UI without component-specific context will:

- Invent props that don't exist (`loading`, `rightIcon`)
- Use wrong token values (`#F82B60` for danger instead of the Figma-authoritative `#EF3061`)
- Add multiple `primary` buttons to the same surface
- Omit required `aria-label` on icon-only buttons

Injecting structured, constraint-style specs into Cursor rules or Claude skills catches these failures before the code is written.

---

## What's here

| File | What it contains |
|---|---|
| `button-component-spec.md` | Full AI-native spec: props schema, variant × state matrix, token mapping, usage rules, anti-patterns, accessibility, code examples |
| `format-rationale.md` | Design decisions behind this documentation format and where it goes next |
| `schemas/button.schema.ts` | Zod schema for Button — typed props with usage constraint annotations |
| `schemas/tokens.ts` | Zod schema for design tokens — color, spacing, and interactive state values |
| `schemas/README.md` | How to wire the schemas into a Cursor rule and a Claude skill |

---

## How to use it

### Cursor rule

Copy [`.cursor/rules/airtable-button.mdc`](.cursor/rules/airtable-button.mdc) into your project. It injects variant names, token values, and hard constraints into every AI generation that touches `Button`.

### Claude skill

Copy [`.claude/skills/airtable-ui.md`](.claude/skills/airtable-ui.md) into your project's `.claude/skills/` directory. It primes Claude with the enforcement checklist before it generates any `@airtable/blocks` UI.

### Direct LLM context

Paste `button-component-spec.md` directly into a system prompt or context window. The spec is structured for traversal: a model can look up `(danger, disabled)` in the variant × state matrix, find the exact token name and value, and generate correct output.

---

## Format principles

**Constraints over prose.** Rules like `NEVER use more than one primary per screen` are stated as enforcements, not suggestions. Prose buries constraints in paragraphs; constraint-style rules surface them.

**Negative space is data.** The most valuable content is what *doesn't* exist: no `loading` prop, no `rightIcon`, no `xlarge` size on Button. A model trained on generic button patterns will invent these. An explicit spec prevents it.

**Tokens, not raw values.** Specs reference semantic token names (`colors.blueBright`, `opacities.quiet`) where possible, so a model that learns the token system can generalize across components.

**Structured tables over flat prose.** A variant × state matrix is parseable and checkable. A paragraph describing the same information is not.

---

## Coverage

| Component | Spec | Zod schema | Cursor rule | Claude skill |
|---|---|---|---|---|
| Button | ✓ | ✓ | ✓ | ✓ |
| TextButton | ✓ | ✓ | — | ✓ |

---

## Adding a component

1. Write the `.md` spec — purpose + scope, props schema, variant × state matrix, token mapping, usage rules (ALWAYS/NEVER/PREFER), anti-patterns, accessibility. Follow `button-component-spec.md` as the template.
2. Write the Zod schema in `schemas/` — follow `button.schema.ts` patterns. Use `.describe()` for constraint annotations and `.superRefine()` for validators.
3. Add a `.cursor/rules/` file extracted from the schema constraints.
4. Add the component to `.claude/skills/airtable-ui.md`.
5. Update the Coverage table above.

---

## What's next

The specs and schemas here are the documentation layer. Two layers above that are worth building:

**Eval framework.** Schemas define what correct looks like — evals test whether generated code actually matches. A CI-friendly eval that takes a code snippet, extracts component usages, and validates them against the Zod constraint validators would make "AI-generated code drifted from spec" a catchable, reportable failure rather than a code review footnote.

**MCP server.** An MCP that serves component schemas and token values as tools would pull this context directly into Cursor, Claude, and any other MCP-compatible tool — no copy-paste, no file setup, no drift. `get_component_schema("Button")` returns the current spec. `validate_usage({ variant: "primary", ... })` runs the constraint validators. The schemas become live infrastructure instead of static documentation.

---

## Sources

`@airtable/blocks` v1.19.0 · Airtable Apps UI Kit Figma (pulled April 2026)

Where the SDK and Figma diverge on token values, Figma is treated as design-authoritative.
