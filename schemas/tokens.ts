/**
 * Airtable Design Tokens — Zod Schema
 *
 * Source: Airtable Apps UI Kit (Figma) + @airtable/blocks v1.19.0
 * These are the canonical token values as defined in the Figma design file.
 * Where Figma and SDK diverge, Figma is authoritative.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------

export const ColorTokens = z.object({
  Dark:         z.literal('#333333').describe('Primary text color. Used for default + secondary button labels, body text.'),
  White:        z.literal('#FFFFFF').describe('Reversed text color. Used on primary + danger button labels.'),
  blueBright:   z.literal('#2D7FF9').describe('Primary action color. Used as primary button background.'),
  red:          z.literal('#EF3061').describe('Destructive action color. Used as danger button background. NOTE: SDK internal token `colors.redBright` resolves to #F82B60 — Figma value (#EF3061) is authoritative.'),
  'Light gray 1': z.literal('#FAFAFA').describe('Subtle background. Page-level backgrounds.'),
  'Light gray 2': z.literal('#F2F2F2').describe('Default button background. Secondary button hover background.'),
  'Light gray 4': z.literal('#E0E0E0').describe('Dividers and borders.'),
  Light:        z.literal('#757575').describe('Secondary text. Section labels, TextButton light variant.'),
  'Dark gray 2': z.literal('#424242').describe('TextButton dark variant text color.'),
});

export type ColorTokens = z.infer<typeof ColorTokens>;

// Individual token literals for use in component schemas
export const Dark         = z.literal('#333333');
export const White        = z.literal('#FFFFFF');
export const BlueBright   = z.literal('#2D7FF9');
export const Red          = z.literal('#EF3061');
export const LightGray2   = z.literal('#F2F2F2');

// ---------------------------------------------------------------------------
// Spacing tokens (derived from Figma Button layout)
// ---------------------------------------------------------------------------

export const ButtonSpacingTokens = z.object({
  small: z.object({
    paddingX:     z.literal(10).describe('px'),
    paddingY:     z.literal(5).describe('px'),
    iconSize:     z.literal(14).describe('px'),
    iconLabelGap: z.literal(6.5).describe('px'),
    fontSize:     z.literal(13).describe('px'),
    lineHeight:   z.literal(18).describe('px'),
  }),
  default: z.object({
    paddingX:     z.literal(12).describe('px'),
    paddingY:     z.literal(7).describe('px'),
    iconSize:     z.literal(14).describe('px'),
    iconLabelGap: z.literal(6.5).describe('px'),
    fontSize:     z.literal(13).describe('px'),
    lineHeight:   z.literal(18).describe('px'),
  }),
  large: z.object({
    paddingX:     z.literal(14).describe('px'),
    paddingY:     z.literal(9).describe('px'),
    iconSize:     z.literal(16).describe('px'),
    iconLabelGap: z.literal(7.5).describe('px'),
    fontSize:     z.literal(15).describe('px'),
    lineHeight:   z.literal(18).describe('px'),
  }),
});

export type ButtonSpacingTokens = z.infer<typeof ButtonSpacingTokens>;

// ---------------------------------------------------------------------------
// Interactive state tokens (applied across all button variants)
// ---------------------------------------------------------------------------

export const InteractiveStateTokens = z.object({
  hoverOpacity:    z.literal(0.75).describe('Applied on :hover when not disabled.'),
  activeOpacity:   z.literal(1.0).describe('Applied on :active / pressed state.'),
  disabledOpacity: z.literal(0.5).describe('Applied when disabled prop is true. Also sets cursor: default.'),
  focusRing:       z.literal('inset 0 0 0 2px hsla(0, 0%, 0%, 0.25)').describe('box-shadow value for :focus state.'),
  borderRadius:    z.literal(3).describe('px. Applied to all button variants and sizes.'),
});

export type InteractiveStateTokens = z.infer<typeof InteractiveStateTokens>;
