# AGENTS.md

How `cc-workspaces` is built: stack, structure, code style, APIs, tests, commits.

## Stack

Vue 3 running in `@vue/compat` mode (`MODE: 2`), Vuex 4, vue-router 4, vue-i18n 11,
vite 8 (beta), vitest 4. Pinia is a dependency but unused — there is not a single
`defineStore` in `src`; all state lives in Vuex.

Webitel packages: `webitel-sdk` (the WS client), `@webitel/api-services`,
`@webitel/ui-sdk`, `@webitel/ui-chats`, `@webitel/styleguide`. Bump them all with
`npm run utils:up-libs`, link local checkouts with `npm run utils:ln-libs`.

`packages/electron-workspace` is a separate app with its own `package.json` and
`biome.jsonc` — nothing in this file applies to it.

## Layout of `src/`

- `app/` — infrastructure: `api/`, `router/`, `store/`, `plugins/`, `locale/`, `serviceworker/`.
- `features/modules/<domain>/` — domain logic: `store/`, `api/`, `scripts/`, `enums/` and
  nested `modules/`. Domains: `agent-status`, `call`, `chat`, `connection-quality`,
  `global-handlers`, `job`, `member`, `notifications`, `sw-controller`.
- `ui/` — everything visible: `modules/<section>/` (`app-header`, `queue-section`,
  `work-section`, `info-section`, `popups`, …) plus `components/`, `composables/`,
  `mixins/`, `hotkeys/`.

`@` is aliased to `src` (`vite.config.ts`).

## Code style

Formatting is owned by biome 2.3.14, configured in `biome.jsonc`. Do not hand-format
and do not argue with it:

- indentation is a **tab**;
- `expand: "always"` — every array/object entry on its own line, even when it would fit on one;
- single quotes in js;
- template attributes are `multiline`;
- imports are sorted by `organizeImports`.

`npm run lint:fix` runs biome over `./src`. The husky `pre-commit` hook runs lint-staged,
which only **formats** the staged files (`biome format --write`) — the linter does not run there.

These lint rules are off on purpose, do not "fix" them: `noUnusedVariables` and
`noUnusedFunctionParameters` globally, plus `useConst`, `useImportType` and `noUnusedImports`
in `.vue` files.

Comments are rare, short, single-line, and only for the non-obvious.

Do not write file extensions in new import paths (`./foo`, not `./foo.js`). About 90 legacy
imports still carry `.js` — leave them alone, but do not add new ones.

## APIs

- Write everything new through `@webitel/api-services`. `@webitel/ui-sdk/src/api` is
  **deprecated**; roughly 30 files still use it, do not add more.
- Import only from the package entry-points (`/gen`, `/gen/models`, `/gen-wire`, `/api`,
  `/api/transformers`, `/validations`, `/enums`, …) — never from the root and never by a
  direct path to a service file.
- `/gen` is generated from Swagger — never edit it by hand.
- Generated code is split by kind: models and enums in `/gen`, service factories and
  query-param zod schemas in `/gen-wire` (`getMessages`, `CatalogGetDialogsQueryParams`).
- The axios instance is handed over at bootstrap, not aliased: `setDefaultAxiosInstance`
  from `/api/axios`, called with `src/app/api/instance` in `src/main.ts` and in the electron
  renderer (WTEL-10132 removed the `@aliasedDeps` alias).
- Copy a new client from `features/modules/chat/modules/active/api/activeChats.js`. The
  older ones (`missed.js`, `src/app/api/agent-workspace/endpoints/**`) are `webitel-sdk`
  `*ApiFactory` plus a local `instance` — do not follow them.

## Tests

- vitest 4, `happy-dom` environment, setup file `tests/config/config.js`, shared mocks in
  `tests/unit/mocks/` (`MockSocket`, `localStorageMock`, `contextMock`, …).
- Specs sit next to the code they cover: `__tests__/<name>.spec.js`. There are 116 of them.
- `npm run test:unit` locally; CI runs `npm run test:unit:ci` (with coverage) and
  `npm run biome:ci:gh`.
- `typecheck:ci` is a no-op (`true`), so `vue-tsc` does not gate anything — TypeScript
  errors will not be caught for you.
- What counts as a useful test here: `docs/test-usefulness-categories.md`.

## Commits and branches

- Message: `fix: short description [WTEL-XXXX](https://webitel.atlassian.net/browse/WTEL-XXXX)`.
  The ticket is mandatory and the link is spelled out in full.
- Prefixes in use: `fix:`, `feat:`, `hotfix:`.
- Branches: `fix/*`, `feat/*`, `hotfix/*`; release branches look like `v26.06`.
