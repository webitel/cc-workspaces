# CLAUDE.md

How this repo is built — stack, structure, code style, APIs, tests, commits — is in
[AGENTS.md](AGENTS.md). Read it too.

## Module docs

Domain docs live in `docs/claude/` — one file per domain (`chats.md`, …). To see what is
documented: `ls docs/claude`.

Every directory that touches a domain keeps a short `CLAUDE.md` stub pointing at that
domain's doc. The stub is what gets picked up automatically when files in the directory are
read or edited, so a domain spread over several modules stays reachable from all of them.
Nothing needs to be imported here, and no list has to be kept in sync.

To find the stubs: `find src -name CLAUDE.md`.

**Asked to write or update a module doc** — for a module, a section, a piece of
functionality — read [docs/claude/how-to-write-claude-docs.md](docs/claude/how-to-write-claude-docs.md)
first, every time. It owns
the layout, what belongs in a doc and what does not, and the checklist. The `module-docs`
skill is the same file.
