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

**The markdown spec is a derived artifact, not the source of truth.** The logical next step — and the direction this system should go — is schema-driven documentation, where the component spec is generated *from* code rather than written by hand. Zod is the right tool for this: a `ButtonProps` Zod schema with `.describe()` annotations on each field carries both the type contract and the documentation in one place. Usage rules that currently live in prose (`NEVER use more than one primary per screen`) can be encoded as `.refine()` validators. Design tokens become a typed enum rather than a lookup table. From a single schema file, you can derive: TypeScript types via `z.infer<>`, runtime prop validation, LLM-consumable documentation, and Cursor/Claude rule enforcement. The documentation can't drift from the implementation because they're the same artifact. That's the version of this system worth building.

---

This format is the thing I've been building toward at Gusto — documentation that travels with the builder and does enforcement work, not just reference work. Applying it to Airtable's actual system felt like the right way to show the idea rather than describe it.
