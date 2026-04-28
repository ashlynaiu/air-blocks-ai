# Airtable UI Generation — Component Rules

When the user asks you to write Airtable app UI using `@airtable/blocks/ui`, apply the following rules before generating any component code.

---

## Before generating any Button

Run through this checklist:

1. **Primary count** — Is there already a `variant="primary"` on this surface? If yes, the new button must be `default` or `secondary`. Never two primaries on the same screen or modal.
2. **Danger vs. secondary** — Is the action destructive and irreversible? Use `danger`. Is it cancel/back/close? Use `secondary`, not `danger`.
3. **Icon-only** — No label text? Add `aria-label` — required, runtime error without it.
4. **Form context** — Inside a `<form>`? Use `type="submit"`.

## Token reference (authoritative)

| Token | Value | Use |
|---|---|---|
| `Light gray 2` | `#F2F2F2` | default button background |
| `blueBright` | `#2D7FF9` | primary button background |
| `red` | `#EF3061` | danger button background |
| `Dark` | `#333333` | default + secondary button text |
| `White` | `#FFFFFF` | primary + danger button text |

Where the Figma token name and SDK name differ, use the Figma name. The `red` token is `#EF3061` — not `#F82B60` (the SDK internal value).

## What doesn't exist on Button — do not generate

- No `loading` prop — disable the button and change label text for async states
- No `rightIcon` or `iconRight` prop — there is one `icon` prop and it always renders on the left
- No `xlarge` size — Button sizes are `small`, `default`, `large` only
- `secondary` has no background fill — it is transparent by design

---

## Before generating any TextButton

1. **Is this actually inline text?** TextButton renders as `<span>`, not `<button>`. Only use it for inline text actions inside prose, table cells, or labels — not for standalone interactive actions.
2. **Variant semantics are different** — `default` is blue (link-style), `dark` is near-black, `light` is gray. These are unrelated to Button variants.
3. **No keyboard role** — TextButton has no implicit ARIA role. If the action requires keyboard accessibility as a standalone control, use `Button` instead.

## What doesn't exist on TextButton — do not generate

- No `icon` prop
- No `type` prop — it renders as `<span>`, not `<button>`
- No `variant="primary"` or `variant="danger"` — TextButton variants are `default`, `dark`, `light` only
