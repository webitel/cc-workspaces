# Workspace Specifications

Reverse-engineered specifications for **Webitel Agent Workspace** (`@webitel/workspace`).

## Purpose

Capture the **current** Workspace as it exists today — not the planned
[New Workspace](https://webitel.atlassian.net/browse/DES-645).

## Entry points

| File | Purpose |
| --- | --- |
| [`FINDINGS.md`](./FINDINGS.md) | Consolidated audit: worst defects, documentation gaps, cross-cutting patterns, recommendations |
| [`STATUS.md`](./STATUS.md) | Handover: what is done, what is not, method rules, open-question count |

## Structure

Every feature gets its own directory with three files:

| File | Source of truth | Answers |
| --- | --- | --- |
| `spec.md` | Jira + Confluence | What the feature was *supposed* to be |
| `as-built.md` | Source code | What is *actually* implemented |
| `delta.md` | Both | Where they diverge, and what is undocumented |

## Spec template

Specs follow the existing Webitel template used in the
[WPR Confluence space](https://webitel.atlassian.net/wiki/spaces/WPR):

```
Module | Feature | Status | Priority | Product goal | Owner
Quarter | Source | Jira tasks (BA / DES / BE / FE / DOC) | Designs
Problem statement -> As-Is -> To-Be
```

## Planned order

1. `00-overview` — Workspace as a whole (roles, panels, channels, licences)
2. `call` — calls (largest module, everything else depends on it)
3. `chat` — chats
4. `job` — tasks
5. `video` — video calls
6. Cross-cutting: `agent-status`, `global-handlers`, `member`,
   `connection-quality`, `notifications`

## Primary sources

- Confluence: [Webitel Workspace. Call Center User Guide](https://webitel.atlassian.net/wiki/spaces/WbtlDocEn/pages/22937735/Webitel+Workspace.+Call+Center+User+Guide) (EN, most complete)
- Confluence: [Workspace](https://webitel.atlassian.net/wiki/spaces/WEB/pages/721448/Workspace) (UK), [Workspace](https://webitel.atlassian.net/wiki/spaces/WEP/pages/21310640/Workspace) (RU)
- Confluence space `WPR` — per-feature product specs
- Confluence space `WDEV` — drafts (`dft.` prefix)
- Jira project `WTEL` — implementation tickets
