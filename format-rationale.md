# Why This Format
*A note on the design decisions behind the Button spec*

---

The most common form of component documentation is written for humans skimming in a browser: prose descriptions, visual do/don't callouts, a props table. That format works well for reference material. It works poorly as input to a code generator.

This spec is written for LLMs first, humans second. That changes a few things:

**Constraints over prose.** An LLM doesn't need to be told what a button is. It needs to know the exact variant names (`default`, not `normal`), the exact states that exist (`hover`, `focus`, `disabled` — and notably, no `loading`), and the rules it must follow (`NEVER use more than one primary per screen`). Prose buries those in paragraphs. Constraint-style rules surface them as enforcements.

**Negative space is data.** The most valuable thing this spec communicates is what *doesn't* exist: no `loading` prop, no right icon, no `leftIcon`/`rightIcon` split. A model trained on generic button patterns will invent these properties. An explicit spec prevents that. Anti-patterns are documented for the same reason — not as style guidance, but as failure modes to avoid at generation time.

**Tokens, not values.** Where possible, the spec references semantic token names (`colors.blueBright`, `opacities.quiet`) rather than raw hex values. A model that learns the token system can generalize across components. A model that memorizes `#2d7ff9` cannot.

**The variant × state matrix is the core.** A flat prose description of a button's appearance gives a model almost nothing to reason over. A structured table where it can look up `(danger, disabled)` → `opacity: 0.5` is parseable, traversable, and checkable. That's the difference between documentation and a data structure.

**Accessibility as enforcement, not awareness.** Most component specs include accessibility notes as a trailing section. This spec structures them as rules: when to set `aria-expanded`, what runtime error fires if you omit `aria-label`, which WCAG level the color contrasts pass. The goal is that a model generating from this spec produces accessible output by default, not by accident.

---

## Where this goes next

The Button spec is a proof of concept for a format, not a finished system. Making a design system genuinely AI-readable at scale means extending this approach across the full library. A few specific directions worth pursuing:

**Schema-driven documentation.** The markdown spec is hand-authored, which means it can drift from the implementation. The right long-term architecture generates this documentation from code — using the TypeScript interfaces and token definitions already in `@airtable/blocks` as the machine-readable source, with an editorial annotation layer on top that carries usage rules, anti-patterns, and the constraint-style guidance an LLM needs. The documentation can't drift from the implementation if it's compiled from it.

**Token system coverage.** This spec documents the tokens used by Button, but the real leverage is a comprehensive token reference — the full color, spacing, typography, and elevation scales with semantic names, usage rules, and the mapping between Figma token names and SDK names. A model that understands the token system can make correct decisions across every component, not just the ones it's seen documented.

**Accessibility as a first-class layer.** Right now WCAG guidance is embedded in individual component specs. It should be a shared, structured reference — contrast ratios for each token pair, keyboard interaction patterns by component type, ARIA role and attribute requirements by pattern (disclosure, combobox, dialog, etc.). An LLM generating accessible Airtable UI should be able to look up `(danger button, white text)` → `passes AA at 13px+` without that fact being buried in a single component file.

**Pattern documentation.** Individual component specs don't cover composition — when to use a Button vs. a TextButton, how cancel/confirm pairs should be structured, what a loading state looks like when Button itself has no loading prop. Interaction patterns that span multiple components are where LLM output most often breaks down, and they're almost never documented explicitly.

---

This format is a foundation, not a finished system. Making it real at scale means generating the documentation layer from the TypeScript interfaces already in `@airtable/blocks` — so it can't drift — and layering evals on top that validate AI-generated code against the schemas at PR time. It means an MCP server that serves component schemas directly into the tools designers and engineers already use, so the right constraints are present at the moment of generation without any setup. And it means a contribution model where a designer with half an hour can fix a wrong variant without filing a ticket and waiting.

The Button spec is what the format looks like for one component. What it looks like across an entire design system — with testable constraints, live schema serving, and a federated contribution model — is the thing worth building next.
