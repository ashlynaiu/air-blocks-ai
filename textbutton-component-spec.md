# TextButton — AI-Native Component Spec
**System:** Airtable Apps UI Kit (`@airtable/blocks`)
**Version:** 1.19.0
**Status:** Stable
**Source:** `@airtable/blocks/dist/types/src/ui/text_button.d.ts`

---

## Purpose + Scope

Use `TextButton` for inline text-style actions that sit within a flow of content — inside a sentence, a table cell, a label, or a supporting line of UI. It is not a button in the HTML sense: it renders as `<span>`, not `<button>`.

**In scope:**
- Inline text actions inside prose or descriptions
- Secondary actions embedded in table rows or data cells
- Supplementary controls that live alongside content rather than above/below it
- "Learn more", "Edit", "Undo" patterns where the action is low-weight and contextual

**Out of scope:**
- Primary, secondary, or danger actions (use `Button`)
- Any standalone control that must be keyboard-accessible by default (use `Button`)
- Icon-driven actions (use `Button` with `icon` prop)
- Form submission (use `Button` with `type="submit"`)

---

## Props Schema

```typescript
interface TextButtonProps {
  // Core
  variant?:   'default' | 'dark' | 'light';   // default: 'default'
  size?:      'default' | 'xlarge';            // default: 'default'
  disabled?:  boolean;
  children:   React.ReactNode | string;        // required — no icon-only pattern

  // Interaction
  onClick?:   (e?: React.MouseEvent) => unknown;
  tabIndex?:  number;

  // Accessibility
  'aria-label'?:       string;
  'aria-labelledby'?:  string;
  'aria-describedby'?: string;
  'aria-controls'?:    string;
  'aria-expanded'?:    boolean | 'true' | 'false';

  // Layout (styled-system)
  display?:    'inline-flex' | 'flex' | 'none';
  margin?:     ResponsiveProp<string | number>;
  flex?:       ResponsiveProp<string | number>;

  // Misc
  id?:         string;
  className?:  string;
  style?:      React.CSSProperties;
}
```

**Key difference from Button:** No `icon` prop, no `type` prop, no `variant="primary"` or `variant="danger"`. `xlarge` is a valid size here but does not exist on `Button`.

---

## Variant × State Matrix

| Variant | Default | Hover | Active/Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| `default` | text: `blueBright` (#2D7FF9) · no bg | underline | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |
| `dark` | text: `Dark gray 2` (#424242) · no bg | underline | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |
| `light` | text: `Light` (#757575) · no bg | underline | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |

All variants: no background fill in any state. Hover is expressed through underline, not background color. This is the opposite of `Button`'s hover behavior.

---

## Semantic Token Mapping

| Figma Token | SDK Token | Hex Value | Used for |
|---|---|---|---|
| `blueBright` | `colors.blueBright` | `#2D7FF9` | `default` variant text |
| `Dark gray 2` | — | `#424242` | `dark` variant text |
| `Light` | `colors.lightGray1` | `#757575` | `light` variant text |
| *(no Figma token)* | `colors.darken3` | `hsla(0,0%,0%,0.25)` | focus ring (inset box-shadow) |
| `opacities.quieter` | — | `0.5` | disabled opacity |

No background color tokens — TextButton has no fill in any variant or state.

---

## Size Reference

| Size | Font size | Use |
|---|---|---|
| `default` | 13px | Standard inline contexts |
| `xlarge` | 15px | Larger text contexts, onboarding, marketing copy |

**Note:** `xlarge` exists on TextButton but NOT on `Button`. This is a common confusion point.

---

## Usage Rules

**ALWAYS**
- Use for inline text actions within a content flow, not as standalone controls.
- Prefer `variant="default"` (blue) for the most visible inline action on a surface.
- Use `variant="light"` for de-emphasized actions in dense or secondary UI.
- Add `aria-label` when children text alone is ambiguous out of context (e.g. "Edit" with no surrounding context).

**NEVER**
- Use `TextButton` in place of `Button` for primary, secondary, or danger actions.
- Use `TextButton` as the only interactive control on a surface — it renders as `<span>` and has no native keyboard role.
- Apply background color overrides — TextButton has no background fill by design.
- Use `variant="primary"` or `variant="danger"` — these do not exist on TextButton.

**PREFER**
- `variant="default"` for most inline contexts.
- `variant="dark"` when the action sits on a light background and blue would compete with other links.
- `variant="light"` for helper text, footnotes, or supporting actions in secondary UI.

---

## Anti-Patterns

| Anti-pattern | Problem | Correct approach |
|---|---|---|
| `<TextButton onClick={handleDelete}>Delete</TextButton>` in a standalone context | No native button role — screen readers may not identify it as interactive; keyboard users may not be able to activate it | Use `<Button variant="danger">Delete</Button>` for standalone destructive actions |
| `<TextButton variant="primary">Submit</TextButton>` | `primary` is not a valid TextButton variant | Use `<Button variant="primary">Submit</Button>` |
| Using TextButton in a form | Renders as `<span>` — no `type="submit"` support | Use `<Button type="submit">` for form actions |
| `<TextButton size="xlarge">` where `<Button size="xlarge">` was intended | `xlarge` doesn't exist on Button — this quietly uses TextButton's large size | Button's largest size is `large`, not `xlarge` |
| Overriding text color with `style={{ color: '#2D7FF9' }}` on `variant="dark"` | Defeats the variant system; breaks in dark mode or theme changes | Use `variant="default"` which is already blue |

---

## Accessibility

| Requirement | Rule |
|---|---|
| Role | Renders as `<span>` — **no implicit button role**. Screen readers may not announce it as interactive. |
| Keyboard | No native keyboard activation. If the action must be keyboard-accessible as a standalone control, use `Button`. |
| Disabled | Use `disabled` prop — though it has no native `disabled` attribute on a span, the SDK applies `pointer-events: none` and `opacity: 0.5`. |
| Focus | Focus ring is built-in (inset `box-shadow`) when the element receives focus. |
| Context | When `children` text alone is ambiguous, add `aria-label` or wrap in a context-providing container. |

---

## Code Examples

### Basic usage

```tsx
import { TextButton } from '@airtable/blocks/ui';

// Default (blue) — inline action
<p>
  This record has unsaved changes.{' '}
  <TextButton onClick={handleUndo}>Undo</TextButton>
</p>

// Dark — low-contrast context
<TextButton variant="dark" onClick={handleEdit}>Edit</TextButton>

// Light — de-emphasized
<TextButton variant="light" onClick={handleLearnMore}>Learn more</TextButton>
```

### Size

```tsx
// Default size
<TextButton onClick={handleAction}>View details</TextButton>

// Xlarge — larger text contexts
<TextButton size="xlarge" onClick={handleAction}>Get started</TextButton>
```

### Disabled state

```tsx
<TextButton disabled={!canEdit} onClick={handleEdit}>
  Edit record
</TextButton>
```

---

## Sibling Components

| Component | When to use instead |
|---|---|
| `Button` | Any standalone action that requires keyboard accessibility, a clear button affordance, or a primary/secondary/danger variant |
| `Switch` | Binary toggle (on/off state) |
| `SelectButtons` | Mutually exclusive selection within a group |

---

*Spec sources: `@airtable/blocks` v1.19.0 (TypeScript types + compiled source) + Airtable Apps UI Kit Figma file (pulled April 2026)*
*Token values: Figma-authoritative where SDK and Figma diverge*
*Format: AI-native LLM-consumable documentation — structured for code generation, not human browsing*
