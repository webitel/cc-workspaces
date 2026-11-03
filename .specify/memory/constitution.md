<!--
Sync Impact Report
Version change: none → 1.0.0 (initial ratification)
Modified principles: none (first version)
Added sections:
  - Core Principles I–V
  - Technology Constraints
  - Development Workflow
  - Governance
Removed sections: none
Templates requiring updates: none — spec/plan/tasks/checklist templates read this
  file at runtime and were not modified.
Deferred items:
  - TODO(RATIFICATION_DATE): the repository predates Spec Kit adoption; the date below
    is the date this constitution was first written, not the date the project adopted
    these practices. Replace with the agreed adoption date if the team sets one.
-->

# cc-workspaces Constitution

This constitution states the non-negotiable rules that govern changes to the Webitel
Agent Workspace frontend. It is derived from practices already in force in this
repository, documented in `AGENTS.md`, `biome.jsonc`, `docs/test-usefulness-categories.md`
and the GitHub workflows. It does not introduce new standards.

## Core Principles

### I. Formatting Is Delegated, Not Negotiated

Biome owns formatting; `biome.jsonc` is the single authority. Code MUST be produced by
`npm run lint:fix`, never hand-formatted: tab indentation, `expand: "always"` (one
array/object entry per line, even when it fits on one), single quotes in JavaScript,
`multiline` template attributes, imports ordered by `organizeImports`.

The rules disabled on purpose MUST stay disabled and MUST NOT be "fixed" in passing:
`noUnusedVariables` and `noUnusedFunctionParameters` globally, plus `useConst`,
`useImportType` and `noUnusedImports` inside `.vue` files.

*Rationale*: the `pre-commit` hook only runs `biome format --write` on staged files — the
linter does not run there. Hand-formatting therefore produces diffs that no gate catches
and that every later `lint:fix` reverts.

### II. Deprecated Paths Never Grow

A pattern marked deprecated may be read and maintained, but MUST NOT gain new call sites:

- New API access goes through `@webitel/api-services`. `@webitel/ui-sdk/src/api` is
  deprecated; the files still on it MUST NOT increase.
- New clients are modelled on
  `src/features/modules/chat/modules/active/api/activeChats.js`. The older
  `webitel-sdk` `*ApiFactory` + local `instance` clients (`missed.js`,
  `src/app/api/agent-workspace/endpoints/**`) MUST NOT be used as templates.
- New import paths carry no file extension (`./foo`, not `./foo.js`). The remaining
  legacy `.js` imports are left alone but MUST NOT be added to.

*Rationale*: migrations in this repository run over many releases. Allowing new code onto
a deprecated path resets the migration's progress and makes the eventual cut impossible
to scope.

### III. Imports Cross Package Boundaries Only at Entry Points

Webitel packages MUST be imported through their published entry points — `/gen`,
`/gen/models`, `/gen-wire`, `/api`, `/api/transformers`, `/validations`, `/enums` — never
from the package root and never by a direct path to an internal service file.

`/gen` is generated from Swagger and MUST NOT be edited by hand. Generated code is split
by kind: models and enums in `/gen`; service factories and query-param zod schemas in
`/gen-wire`.

The axios instance is handed over at bootstrap through `setDefaultAxiosInstance` from
`/api/axios`, called with `src/app/api/instance`. New code MUST NOT reintroduce an alias
or a second instance.

*Rationale*: deep imports bind this app to another package's internal layout, so a
refactor there breaks a build here with no warning. Hand-edits to `/gen` are silently
destroyed on the next generation.

### IV. A Test Asserts a Contract, Not a Mount

Every spec MUST assert observable behaviour: computed output, emitted payloads, rendered
structure that the component promises, request parameters passed to an API. A test that
only mounts a component and checks it exists is not acceptable as new work.

Specs live next to the code they cover, as `__tests__/<name>.spec.js`. The rubric and the
worked examples of weak-to-strong rewrites are in `docs/test-usefulness-categories.md`;
that file is the standard, not a suggestion.

*Rationale*: mount-only tests pass through real regressions while still costing
maintenance on every refactor. The repository has already paid to upgrade dozens of them
and MUST NOT accumulate more.

### V. Every Change Is Traceable and Gated

Each change MUST carry its Jira ticket in the commit message, with the link spelled out
in full:

```
fix: short description [WTEL-XXXX](https://webitel.atlassian.net/browse/WTEL-XXXX)
```

Allowed prefixes are `fix:`, `feat:` and `hotfix:`; branches follow `fix/*`, `feat/*`,
`hotfix/*`. `chore(deps): …` commits are produced by the `libs.update.yml` workflow and
MUST NOT be written by hand.

CI gates MUST pass before a pull request is considered ready: `npm run test:unit:ci`,
`npm run biome:ci:gh`, and `npm run typecheck` (`vue-tsc --noEmit`).

*Rationale*: the ticket link is how this codebase's history is read months later, and the
type check is a real gate — TypeScript errors will fail the build, not merely warn.

## Technology Constraints

The stack is fixed and changing it requires an amendment, not a pull request: Vue 3 in
`@vue/compat` mode (`MODE: 2`), Vuex 4, vue-router 4, vue-i18n 11, vite 8, vitest 4 with
the `happy-dom` environment.

Application state lives in Vuex. Pinia is installed and holds a single store
(`src/ui/modules/info-section/modules/client-info/modules/contact/store/contact.ts`);
introducing further Pinia stores is a directional decision that MUST be agreed before
implementation, not made inside a feature branch.

`src/` is layered and the layering MUST be respected: `app/` for infrastructure,
`features/modules/<domain>/` for domain logic, `ui/` for everything visible. `@` is
aliased to `src`.

Webitel dependencies are bumped together through `npm run utils:up-libs` and linked
locally through `npm run utils:ln-libs`.

`packages/electron-workspace` is a separate application with its own `package.json`,
`biome.jsonc` and `electron.vite.config.ts`. This constitution does not govern it.

## Development Workflow

Work is scoped to one concern per pull request. A bounded change is specified, planned
and implemented against the existing architecture; a plan that proposes a new framework,
state library or test runner to solve a feature-sized problem MUST be rejected at review.

Before pushing: `npm run lint:fix`, `npm run test:unit`, `npm run typecheck`. The
`pre-commit` hook formats staged files only and MUST NOT be relied on as a check.

Documentation duties travel with the code. Domain documentation lives in `docs/claude/`,
one file per domain, reachable from directory-level `CLAUDE.md` stubs; when a change
invalidates a domain doc, the doc is updated in the same pull request, following
`docs/claude/how-to-write-claude-docs.md`.

## Governance

`AGENTS.md` remains the operational reference for how this repository is built — stack,
layout, style, APIs, tests, commits. This constitution governs; where the two disagree,
the disagreement is a defect and MUST be resolved by amending both in the same change,
not by choosing one silently.

Amendments require: a written rationale, agreement from the team, and a version bump
under the policy below. Amendments that loosen a principle MUST state what replaces the
guarantee being removed.

Versioning policy:

- MAJOR — a principle is removed or redefined in a backward-incompatible way.
- MINOR — a principle or section is added, or its guidance materially expanded.
- PATCH — clarification, wording, or a correction that changes no obligation.

Compliance is reviewed at pull request time. A change that departs from a principle is
not blocked outright, but the departure MUST be stated in the pull request description
with its reason; an unexplained departure is a review blocker.

**Version**: 1.0.0 | **Ratified**: 2026-09-17 | **Last Amended**: 2026-09-17
