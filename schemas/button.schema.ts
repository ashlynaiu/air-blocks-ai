/**
 * Airtable Button — Zod Schema
 *
 * This schema is the source of truth for the Button component in @airtable/blocks.
 * It serves as: TypeScript types (via z.infer<>), runtime prop validation,
 * LLM-consumable documentation, and the basis for Cursor/Claude enforcement rules.
 *
 * Sources: @airtable/blocks v1.19.0 + Airtable Apps UI Kit Figma (node 15:0)
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Variant
// ---------------------------------------------------------------------------

export const ButtonVariant = z.enum(['default', 'primary', 'secondary', 'danger'])
  .describe(
    'Visual treatment of the button. ' +
    'Use "primary" for the single most important action on a screen or modal — never more than one. ' +
    'Use "danger" for irreversible destructive actions (delete, revoke, remove). ' +
    'Use "secondary" to pair with primary in cancel/confirm patterns — it is transparent by default, NOT a filled gray. ' +
    'Use "default" for all other actions, toolbar buttons, and generic controls.'
  );

export type ButtonVariant = z.infer<typeof ButtonVariant>;

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

export const ButtonSize = z.enum(['small', 'default', 'large'])
  .describe(
    'Controls height, padding, font size, and icon size. ' +
    '"small" (paddingX:10px, paddingY:5px, font:13px) for dense toolbars and table row actions. ' +
    '"default" (paddingX:12px, paddingY:7px, font:13px) for most UI contexts. ' +
    '"large" (paddingX:14px, paddingY:9px, font:15px) for primary CTAs in onboarding or marketing flows. ' +
    'Also accepts a responsive object: { xsmallViewport, smallViewport, mediumViewport, largeViewport }.'
  );

export type ButtonSize = z.infer<typeof ButtonSize>;

// ---------------------------------------------------------------------------
// Core props schema
// ---------------------------------------------------------------------------

export const ButtonProps = z.object({
  variant: ButtonVariant
    .default('default'),

  size: ButtonSize
    .default('default'),

  icon: z.union([z.string(), z.any()])
    .optional()
    .describe(
      'An Airtable IconName string OR a React element. ' +
      'Always rendered to the LEFT of label text — there is no rightIcon prop. ' +
      'String icons render as <Icon name={icon} size="1em" fillColor="currentColor" flex="none" />. ' +
      'Icon-only buttons (no children) MUST include aria-label — a runtime console.error fires without it.'
    ),

  disabled: z.boolean()
    .optional()
    .describe(
      'Disables all interaction. Sets opacity to 0.5 and cursor to default. ' +
      'Use the native disabled prop — do NOT use aria-disabled as a substitute. ' +
      'When disabling for an async operation, provide external loading feedback (text change, spinner). ' +
      'There is no built-in loading state on Button.'
    ),

  children: z.any()
    .optional()
    .describe(
      'Button label text or content. Required unless icon is provided. ' +
      'If neither children nor aria-label is present on an icon-only button, a runtime error fires.'
    ),

  type: z.enum(['button', 'submit', 'reset'])
    .default('button')
    .describe(
      'Native button type. Use "submit" for buttons inside a <form>. ' +
      'Defaults to "button" to prevent accidental form submission.'
    ),

  onClick: z.function()
    .args(z.any().optional())
    .returns(z.unknown())
    .optional()
    .describe('Click handler. Receives a React.MouseEvent<HTMLButtonElement>.'),

  // Accessibility
  'aria-label': z.string()
    .optional()
    .describe('REQUIRED for icon-only buttons (no children). Describes the button action for screen readers.'),

  'aria-labelledby': z.string()
    .optional()
    .describe('ID of an element that labels this button. Alternative to aria-label.'),

  'aria-describedby': z.string()
    .optional()
    .describe('ID of an element that provides extended description.'),

  'aria-controls': z.string()
    .optional()
    .describe('ID of the element this button controls (e.g. a panel it opens/closes).'),

  'aria-expanded': z.union([z.boolean(), z.literal('true'), z.literal('false')])
    .optional()
    .describe('Set to true/false when button controls a collapsible element (dropdown, accordion).'),

  'aria-haspopup': z.union([
    z.boolean(),
    z.enum(['menu', 'listbox', 'tree', 'grid', 'dialog']),
  ])
    .optional()
    .describe('Set when button triggers a popup. Use "menu" for dropdown menus.'),

  'aria-selected': z.boolean()
    .optional(),

  // Layout
  display: z.enum(['inline-flex', 'flex', 'none'])
    .default('inline-flex')
    .describe('Defaults to inline-flex. Use "flex" to fill a container width.'),

  // Pass-through
  id: z.string().optional(),
  tabIndex: z.number().optional(),
  className: z.string().optional(),
  style: z.record(z.any()).optional(),
});

export type ButtonProps = z.infer<typeof ButtonProps>;

// ---------------------------------------------------------------------------
// Usage rule validators
// ---------------------------------------------------------------------------

/**
 * Validates that a set of buttons on a surface doesn't include more than one primary.
 * Use in page/modal-level validation, not per-button.
 */
export const ButtonSurfaceConstraints = z.array(ButtonProps)
  .superRefine((buttons, ctx) => {
    const primaryCount = buttons.filter(b => b.variant === 'primary').length;
    if (primaryCount > 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `NEVER: More than one primary button on a surface. Found ${primaryCount}. Use one primary and change others to "default" or "secondary".`,
      });
    }
  });

/**
 * Validates a single button for accessibility and usage correctness.
 */
export const ValidatedButtonProps = ButtonProps
  .superRefine((props, ctx) => {
    // Icon-only requires aria-label
    if (props.icon && !props.children && !props['aria-label'] && !props['aria-labelledby']) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['aria-label'],
        message: 'ALWAYS: Icon-only buttons must have aria-label or aria-labelledby.',
      });
    }

    // Warn: cancel should not use danger
    if (props.variant === 'danger' && typeof props.children === 'string') {
      const label = props.children.toLowerCase();
      if (label === 'cancel' || label === 'back' || label === 'close') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['variant'],
          message: `NEVER: variant="danger" on "${props.children}". Danger signals destruction — use "secondary" for cancel/back/close actions.`,
        });
      }
    }

    // Warn: submit button should declare type="submit"
    if (props.onClick === undefined && props.type === 'button') {
      // Can't enforce this statically without context, but noted in description
    }
  });

// ---------------------------------------------------------------------------
// Variant token map (links schema to design tokens)
// ---------------------------------------------------------------------------

export const ButtonVariantTokenMap = z.object({
  default: z.object({
    background:      z.literal('#F2F2F2').describe('Light gray 2'),
    text:            z.literal('#333333').describe('Dark'),
    hoverBackground: z.literal('opacity:0.75').describe('Multiply opacity on hover'),
  }),
  primary: z.object({
    background:      z.literal('#2D7FF9').describe('blueBright'),
    text:            z.literal('#FFFFFF').describe('White'),
    hoverBackground: z.literal('opacity:0.75'),
  }),
  secondary: z.object({
    background:      z.literal('transparent').describe('No fill — do not override with a color'),
    text:            z.literal('#333333').describe('Dark'),
    hoverBackground: z.literal('#F2F2F2').describe('Light gray 2 — appears on hover only'),
  }),
  danger: z.object({
    background:      z.literal('#EF3061').describe('red (Figma token). NOTE: SDK colors.redBright = #F82B60 — Figma value is authoritative'),
    text:            z.literal('#FFFFFF').describe('White'),
    hoverBackground: z.literal('opacity:0.75'),
  }),
});

export type ButtonVariantTokenMap = z.infer<typeof ButtonVariantTokenMap>;
