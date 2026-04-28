/**
 * Airtable TextButton — Zod Schema
 *
 * This schema is the source of truth for the TextButton component in @airtable/blocks.
 * It serves as: TypeScript types (via z.infer<>), runtime prop validation,
 * LLM-consumable documentation, and the basis for Cursor/Claude enforcement rules.
 *
 * CRITICAL DISTINCTION FROM BUTTON: TextButton renders as <span>, not <button>.
 * It has no implicit keyboard role and no native button semantics.
 *
 * Sources: @airtable/blocks v1.19.0 + Airtable Apps UI Kit Figma (April 2026)
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Variant
// ---------------------------------------------------------------------------

export const TextButtonVariant = z.enum(['default', 'dark', 'light'])
  .describe(
    'Visual treatment of the text button. ' +
    'IMPORTANT: These variants are unrelated to Button variants — do not confuse "default" (blue) with Button\'s "default" (gray). ' +
    '"default" renders in blueBright (#2D7FF9) — link-style, highest visibility inline action. ' +
    '"dark" renders in Dark gray 2 (#424242) — for actions on light backgrounds where blue would compete with other links. ' +
    '"light" renders in Light (#757575) — de-emphasized; for secondary inline actions, helper text, footnotes.'
  );

export type TextButtonVariant = z.infer<typeof TextButtonVariant>;

// ---------------------------------------------------------------------------
// Size
// ---------------------------------------------------------------------------

export const TextButtonSize = z.enum(['default', 'xlarge'])
  .describe(
    '"default" (13px) for standard inline contexts. ' +
    '"xlarge" (15px) for larger text contexts such as onboarding flows or marketing copy. ' +
    'NOTE: "xlarge" is available on TextButton but does NOT exist on Button. ' +
    'Button\'s largest size is "large". This is a common confusion point.'
  );

export type TextButtonSize = z.infer<typeof TextButtonSize>;

// ---------------------------------------------------------------------------
// Core props schema
// ---------------------------------------------------------------------------

export const TextButtonProps = z.object({
  variant: TextButtonVariant
    .default('default'),

  size: TextButtonSize
    .default('default'),

  disabled: z.boolean()
    .optional()
    .describe(
      'Disables interaction. Sets opacity to 0.5 and pointer-events to none. ' +
      'Unlike Button, there is no native disabled attribute (renders as <span>). ' +
      'The SDK handles visual feedback, but screen readers may not announce the disabled state.'
    ),

  children: z.any()
    .describe(
      'Required. TextButton has no icon-only pattern — children must always be present. ' +
      'There is no icon prop on TextButton.'
    ),

  onClick: z.function()
    .args(z.any().optional())
    .returns(z.unknown())
    .optional()
    .describe('Click handler. Receives a React.MouseEvent.'),

  // Accessibility
  'aria-label': z.string()
    .optional()
    .describe(
      'Add when children text is ambiguous out of context (e.g. "Edit" with no surrounding label). ' +
      'Not required in the same way as icon-only Button, but important for clarity in dense UI.'
    ),

  'aria-labelledby': z.string().optional(),
  'aria-describedby': z.string().optional(),
  'aria-controls': z.string().optional(),
  'aria-expanded': z.union([z.boolean(), z.literal('true'), z.literal('false')]).optional(),

  // Layout
  display: z.enum(['inline-flex', 'flex', 'none'])
    .default('inline-flex'),

  // Pass-through
  id: z.string().optional(),
  tabIndex: z.number().optional(),
  className: z.string().optional(),
  style: z.record(z.any()).optional(),
});

export type TextButtonProps = z.infer<typeof TextButtonProps>;

// ---------------------------------------------------------------------------
// Usage rule validators
// ---------------------------------------------------------------------------

/**
 * Validates a TextButton for correct usage.
 * Key enforcement: TextButton should not replace Button for standalone actions.
 */
export const ValidatedTextButtonProps = TextButtonProps
  .superRefine((props, ctx) => {
    // No children — TextButton has no icon-only pattern
    if (!props.children) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['children'],
        message: 'ALWAYS: TextButton requires children. There is no icon-only TextButton pattern.',
      });
    }
  });

// ---------------------------------------------------------------------------
// Variant token map
// ---------------------------------------------------------------------------

export const TextButtonVariantTokenMap = z.object({
  default: z.object({
    text:      z.literal('#2D7FF9').describe('blueBright — link-style blue'),
    hoverText: z.literal('#2D7FF9').describe('Same color; hover is expressed by underline, not color change'),
    background: z.literal('transparent').describe('No fill in any state'),
  }),
  dark: z.object({
    text:      z.literal('#424242').describe('Dark gray 2'),
    hoverText: z.literal('#424242').describe('Same color; hover expressed by underline'),
    background: z.literal('transparent'),
  }),
  light: z.object({
    text:      z.literal('#757575').describe('Light — secondary text color'),
    hoverText: z.literal('#757575').describe('Same color; hover expressed by underline'),
    background: z.literal('transparent'),
  }),
});

export type TextButtonVariantTokenMap = z.infer<typeof TextButtonVariantTokenMap>;

// ---------------------------------------------------------------------------
// Props that do NOT exist — for LLM enforcement
// ---------------------------------------------------------------------------

/**
 * These props exist on Button but NOT on TextButton.
 * Reference this list when generating TextButton code to avoid inventing props.
 *
 * Does not exist on TextButton:
 * - icon (no icon support)
 * - type ("button" | "submit" | "reset") — renders as <span>, not <button>
 * - variant="primary" or variant="danger" or variant="secondary" — different variant set entirely
 * - size="small" or size="large" — TextButton sizes are "default" and "xlarge" only
 */
export const TEXT_BUTTON_NONEXISTENT_PROPS = [
  'icon',
  'type',
  'variant:primary',
  'variant:secondary',
  'variant:danger',
  'size:small',
  'size:large',
] as const;
