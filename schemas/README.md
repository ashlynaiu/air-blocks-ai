# Airtable Component Schemas

Zod schemas for Airtable Apps UI Kit components. These are the **single source of truth** for component props, design token values, and usage constraints.

From one schema file you get:
- TypeScript types via `z.infer<>`
- Runtime prop validation
- LLM-consumable documentation (`.describe()` annotations)
- Cursor rules and Claude skills that enforce the same constraints at generation time

---

## The problem this solves

Traditional component documentation drifts. A markdown spec gets written, then the component changes, and the docs lag behind. Rules written in prose ("never use more than one primary button per screen") live in a wiki that no tool reads.

Schema-driven documentation makes the spec executable. The constraint lives in one place — the schema — and everything else derives from it.

---

## Usage

### 1. TypeScript types (free, via inference)

```typescript
import { ButtonProps } from './button.schema';
// No separate interface to maintain — z.infer<> derives it from the schema.

function MyButton(props: ButtonProps) { ... }
```

### 2. Runtime validation

```typescript
import { ValidatedButtonProps, ButtonSurfaceConstraints } from './button.schema';

// Validate a single button
const result = ValidatedButtonProps.safeParse({
  variant: 'danger',
  children: 'Cancel', // ← caught: danger + "Cancel" is a usage violation
});

if (!result.success) {
  console.error(result.error.issues);
  // [{ message: 'NEVER: variant="danger" on "Cancel". Use "secondary" for cancel/back/close.' }]
}

// Validate all buttons on a surface
const surface = ButtonSurfaceConstraints.safeParse([
  { variant: 'primary', children: 'Save' },
  { variant: 'primary', children: 'Publish' }, // ← caught: two primaries
]);
```

### 3. Generate documentation from the schema

```typescript
import { ButtonProps } from './button.schema';

// Walk the schema shape and extract .description from each field
function extractDocs(schema: z.ZodObject<any>) {
  return Object.entries(schema.shape).map(([key, field]) => ({
    prop: key,
    type: field._def.typeName,
    description: field.description ?? (field._def.innerType?.description),
  }));
}

// Output can be rendered as markdown, JSON for an LLM context window,
// or fed into a documentation site generator.
```

---

## Wiring into a Cursor rule

Cursor rules are markdown files in `.cursor/rules/` that inject context into every AI generation in your project. The schema's `.describe()` annotations are the right level of detail for this — specific enough to enforce, terse enough to fit in context.

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

To keep the rule in sync with the schema automatically, generate it at build time:

```typescript
// scripts/generate-cursor-rules.ts
import { ButtonProps, ButtonVariantTokenMap } from '../schemas/button.schema';
import { writeFileSync } from 'fs';

function generateButtonRule(): string {
  const variantDescriptions = Object.entries(ButtonProps.shape)
    .filter(([key]) => key === 'variant')
    .map(([_, field]) => field.description)
    .join('');

  // ... build markdown string from schema descriptions
  return markdown;
}

writeFileSync('.cursor/rules/airtable-button.mdc', generateButtonRule());
```

---

## Wiring into a Claude skill

Claude skills (`.claude/skills/`) inject instructions into Claude's context for specific tasks. A component schema skill tells Claude how to generate valid Airtable UI when asked.

**`.claude/skills/airtable-ui.md`**

````markdown
# Airtable UI Generation — Component Rules

When the user asks you to write Airtable app UI using `@airtable/blocks/ui`:

## Before generating any Button

1. Check: is there already a `variant="primary"` on this surface? If yes, the new button must be `default` or `secondary`.
2. Is the action destructive and irreversible? Use `danger`. Is it a cancel/back/close? Use `secondary`, not `danger`.
3. Does the button have no label text? Add `aria-label` — required, enforced at runtime.
4. Is the button inside a `<form>`? Use `type="submit"`.

## Token reference (authoritative)

| Token | Value | Use |
|-------|-------|-----|
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

### The enforcement loop

```
Schema (.describe() + .superRefine())
  ↓ generates
Cursor rule (.mdc) + Claude skill (.md)
  ↓ enforces at
Generation time (Cursor/Claude) + Runtime (safeParse)
  ↓ catches
Wrong variants · missing aria-label · two primaries · wrong token values
```

The same constraints run in four places from one source. A schema change propagates everywhere at build time — the documentation cannot drift because it was never separate from the code.

---

## Adding a new component

1. Create `[component].schema.ts` following the Button pattern
2. Define variants, sizes, and token bindings as Zod enums/literals
3. Add usage rules as `.superRefine()` validators
4. Run `generate-cursor-rules.ts` to update `.cursor/rules/`
5. The TypeScript types, docs, and enforcement rules all update automatically

---

*Source: `@airtable/blocks` v1.19.0 + Airtable Apps UI Kit Figma (April 2026)*
