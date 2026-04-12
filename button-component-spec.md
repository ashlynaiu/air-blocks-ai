# Button — AI-Native Component Spec
**System:** Airtable Apps UI Kit (`@airtable/blocks`)
**Version:** 1.19.0
**Status:** Stable
**Source:** `@airtable/blocks/dist/types/src/ui/button.d.ts`

---

## Purpose + Scope

Use `Button` when the user takes an action that changes state, triggers a process, or navigates with intent.

**In scope:**
- Form submission
- Destructive confirmation
- Toolbar actions
- Dialog triggers
- Cancel / back controls

**Out of scope:**
- Navigation links (use `<a>` or a link component)
- Toggle state (use `Switch`)
- Inline text actions (use `TextButton`)
- Selection within a group (use `SelectButtons`)

---

## Props Schema

```typescript
interface ButtonProps {
  // Core
  variant?:   'default' | 'primary' | 'secondary' | 'danger';  // default: 'default'
  size?:      'small' | 'default' | 'large'                    // default: 'default'
            | { xsmallViewport?: Size; smallViewport?: Size;
                mediumViewport?: Size; largeViewport?: Size };  // responsive
  type?:      'button' | 'submit' | 'reset';                   // default: 'button'
  disabled?:  boolean;
  icon?:      IconName | React.ReactElement;                   // always left-aligned
  children?:  React.ReactNode | string;

  // Interaction
  onClick?:   (e?: React.MouseEvent<HTMLButtonElement>) => unknown;
  tabIndex?:  number;

  // Accessibility (required when children is absent)
  'aria-label'?:       string;
  'aria-labelledby'?:  string;
  'aria-describedby'?: string;
  'aria-controls'?:    string;
  'aria-expanded'?:    boolean | 'true' | 'false';
  'aria-haspopup'?:    boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-selected'?:    boolean;

  // Layout (styled-system)
  display?:    'inline-flex' | 'flex' | 'none';   // default: 'inline-flex'
  width?:      ResponsiveProp<string | number>;
  minWidth?:   ResponsiveProp<string | number>;
  maxWidth?:   ResponsiveProp<string | number>;
  margin?:     ResponsiveProp<string | number>;    // also marginTop/Right/Bottom/Left/X/Y
  flex?:       ResponsiveProp<string | number>;
  alignSelf?:  ResponsiveProp<string>;
  position?:   ResponsiveProp<string>;

  // Misc
  id?:         string;
  className?:  string;
  style?:      React.CSSProperties;
  ref?:        React.Ref<HTMLButtonElement>;        // forwardRef
}
```

---

## Variant × State Matrix

| Variant | Default | Hover | Active/Pressed | Focus | Disabled |
|---|---|---|---|---|---|
| `default` | bg: `Light gray 2` (#F2F2F2) · text: `Dark` (#333333) | opacity 0.75 | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |
| `primary` | bg: `blueBright` (#2D7FF9) · text: `White` (#FFFFFF) | opacity 0.75 | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |
| `secondary` | bg: transparent · text: `Dark` (#333333) | bg: `Light gray 2` (#F2F2F2) | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |
| `danger` | bg: `red` (#EF3061) · text: `White` (#FFFFFF) | opacity 0.75 | opacity 1.0 | inset ring 2px `darken3` | opacity 0.5 · no cursor |

**Note:** No `loading` state exists. There is no built-in spinner variant.

---

## Semantic Token Mapping

Figma token names (design-authoritative) → hex values, cross-referenced with SDK internal names.

| Figma Token | SDK Token | Hex Value | Used for |
|---|---|---|---|
| `Dark` | `colors.dark` | `#333333` | default + secondary text |
| `White` | `colors.white` | `#FFFFFF` | primary + danger text |
| `Light gray 2` | `colors.lightGray2` | `#F2F2F2` | default bg; secondary hover bg |
| `blueBright` | `colors.blueBright` | `#2D7FF9` | primary bg |
| `red` | `colors.redBright`* | `#EF3061` | danger bg |
| `Light` | `colors.lightGray1` | `#757575` | section labels, TextButton/light |
| `Dark gray 2` | — | `#424242` | TextButton/dark variant text |
| `Light gray 4` | — | `#E0E0E0` | dividers/borders |
| *(no Figma token)* | `colors.darken3` | `hsla(0,0%,0%,0.25)` | focus ring (inset box-shadow) |
| `opacities.quiet` | — | `0.75` | hover opacity |
| `opacities.quieter` | — | `0.5` | disabled opacity |
| `radii.default` | — | `3px` | border-radius |
| `fontWeights.strong` | — | `500` | font weight |

*⚠️ Divergence: Figma `red` = `#EF3061`; SDK `colors.redBright` = `#F82B60`. Figma is design-authoritative.

---

## Size Reference

| Size | Font size | Padding X | Padding Y | Icon size | Icon–label gap | Line height |
|---|---|---|---|---|---|---|
| `small` | 13px | 10px | 5px | 14px | 6.5px | 18px |
| `default` | 13px | 12px | 7px | 14px | 6.5px | 18px |
| `large` | 15px | 14px | 9px | 16px | 7.5px | 18px |

*Padding values confirmed from Figma layout. SDK-documented heights (28/32/36px) are derived.*

---

## Icon Behavior

- Single `icon` prop. Icon is **always placed left of label text**.
- Accepts `IconName` (string) or a React element.
- String icons render as `<Icon name={icon} size="1em" fillColor="currentColor" flex="none" />`.
- When `icon` is present, label text receives `marginLeft="0.5em"`.
- Icon-only buttons have no text children. `aria-label` is **required** in this case — omitting it triggers a runtime `console.error`.

**Icon-only + Tooltip pattern (Figma-canonical):**

Airtable's Figma file shows icon-only buttons always paired with a `Tooltip` component — the tooltip is not built into Button, it is a sibling wrapper:

```tsx
import { Button, Tooltip } from '@airtable/blocks/ui';

<Tooltip content="Edit content" placementX={Tooltip.placements.CENTER} placementY={Tooltip.placements.BOTTOM}>
  <Button icon="edit" aria-label="Edit content" />
</Tooltip>
```

---

## Usage Rules

**ALWAYS**
- Use `variant="primary"` for the single most important action on a screen.
- Provide `aria-label` on icon-only buttons (no text children).
- Use `type="submit"` on buttons that submit a form.
- Use `variant="danger"` for irreversible destructive actions (delete, revoke, remove).
- Pair `secondary` with `primary` for cancel/confirm patterns.

**NEVER**
- Use more than one `primary` button per screen or modal.
- Add a `loading` prop — it does not exist. Use external state to disable the button while a process runs.
- Use `icon` with a `rightIcon` pattern — there is only one `icon` prop and it renders on the left.
- Use `Button` for navigation — use an anchor element or link component.
- Use `TextButton` as a drop-in substitute — it renders as `<span>`, not `<button>`, and has different variant semantics.

**PREFER**
- `size="default"` for most contexts.
- `size="small"` in dense toolbars or table row actions.
- `size="large"` for primary CTAs in marketing or onboarding flows.
- Responsive `size` prop when buttons appear across breakpoints: `size={{ xsmallViewport: 'small', mediumViewport: 'default' }}`.

---

## Anti-Patterns

| Anti-pattern | Problem | Correct approach |
|---|---|---|
| `<Button variant="primary">` appears twice in one modal | Dilutes hierarchy; user can't identify the primary action | One primary per surface; make the other `default` or `secondary` |
| `<Button variant="secondary" style={{ backgroundColor: '#eee' }}>` | Overrides the transparent bg that defines secondary — breaks the visual hierarchy signal | Do not override secondary bg; it is intentionally transparent |
| `<Button icon="trash" />` with no `aria-label` | Inaccessible — screen readers announce nothing | Always add `aria-label="Delete"` (or equivalent) |
| `disabled={isLoading}` without visual feedback | User doesn't know why the button is unresponsive | Show external loading state (spinner, message) when disabling for async operations |
| `<Button onClick={() => window.location.href = '/page'}>` | Navigates without browser affordances (no right-click, no open-in-new-tab) | Use an anchor or router link |
| `<Button variant="danger">Cancel</Button>` | Danger signals destruction — cancel is not destructive | Use `secondary` for cancel |

---

## Accessibility

| Requirement | Rule |
|---|---|
| Role | Renders as native `<button>` — implicit `role="button"`, keyboard-accessible by default |
| Icon-only | MUST have `aria-label` — runtime error is thrown without it |
| Disabled | Use `disabled` prop (not `aria-disabled`) — native disabled removes button from tab order |
| Focus | Focus ring is built-in (inset `box-shadow`) — do not suppress with `outline: none` |
| Toggle | If button controls open/close state, set `aria-expanded={isOpen}` |
| Popups | If button triggers a menu/listbox, set `aria-haspopup="menu"` (or appropriate value) |
| WCAG contrast | `primary` (#2d7ff9 on white) passes AA at 14px+ · `danger` (#f82b60 on white) passes AA at 14px+ |

---

## Code Examples

### Basic usage

```tsx
import { Button } from '@airtable/blocks/ui';

// Default
<Button onClick={handleClick}>Save draft</Button>

// Primary CTA
<Button variant="primary" onClick={handleSubmit}>
  Publish record
</Button>

// Danger with confirmation pattern
<Button variant="danger" onClick={handleDelete}>
  Delete record
</Button>

// Cancel / confirm pair
<>
  <Button variant="secondary" onClick={onCancel}>Cancel</Button>
  <Button variant="primary" onClick={onConfirm}>Confirm</Button>
</>
```

### With icon

```tsx
// Icon + label
<Button icon="edit" onClick={handleEdit}>Edit</Button>

// Icon only — aria-label required
<Button icon="trash" aria-label="Delete record" onClick={handleDelete} />

// Custom React element as icon
<Button icon={<MyCustomIcon />} aria-label="Export">Export</Button>
```

### Sizes

```tsx
<Button size="small">Compact action</Button>
<Button size="default">Standard action</Button>
<Button size="large" variant="primary">Primary CTA</Button>

// Responsive size
<Button
  size={{ xsmallViewport: 'small', mediumViewport: 'default' }}
  variant="primary"
>
  Submit
</Button>
```

### Disabled (async operation)

```tsx
// Disable while saving — no built-in loading state
<Button
  variant="primary"
  disabled={isSaving}
  onClick={handleSave}
>
  {isSaving ? 'Saving…' : 'Save'}
</Button>
```

### Form submission

```tsx
<form onSubmit={handleSubmit}>
  {/* ... fields ... */}
  <Button type="submit" variant="primary">Submit form</Button>
</form>
```

### Toggle (controlled)

```tsx
<Button
  variant="default"
  aria-expanded={isOpen}
  aria-controls="dropdown-panel"
  onClick={() => setIsOpen(!isOpen)}
>
  Options
</Button>
```

---

## Sibling Components

| Component | When to use instead |
|---|---|
| `TextButton` | Inline text-style action; renders as `<span>` with variants `default` (blue) / `dark` / `light` |
| `SelectButtons` | Mutually exclusive selection within a group |
| `Switch` | Binary toggle (on/off state) |

---

*Spec sources: `@airtable/blocks` v1.19.0 (TypeScript types + compiled source) + Airtable Apps UI Kit Figma file (node 15:0, pulled via Figma MCP April 2026)*
*Token values: Figma-authoritative where SDK and Figma diverge (see danger color note in token table)*
*Format: AI-native LLM-consumable documentation — structured for code generation, not human browsing*
