# Workspace rules

## Startup and continuity

- Use runtime-provided startup context first. Read source files again only when the task needs details that are missing.
- `USER.md` stores stable user preferences; `MEMORY.md` stores durable facts and decisions; `memory/YYYY-MM-DD.md` stores daily notes.
- Load `MEMORY.md` only in the user's direct/main session. Never expose private memory in group or shared contexts.
- Before writing memory, read the existing entry and preserve useful facts. Do not store credentials or other secrets.
- Recover recent work from local state and memory before asking the user to repeat it.

## Safety and authority

- Keep private data private.
- Inspect existing state before changing configuration, schedulers, services, or shared files; preserve unrelated user changes.
- Ask before public/external communication, purchases, destructive actions, or materially expanding the requested scope.
- Prefer recoverable operations (`trash` over permanent deletion). Never run broad destructive commands.
- Work autonomously on read-only checks and normal implementation steps within the user's request; verify changes proportionately.

## Workspace and projects

- Treat each Git repository under `projects/**` as independent. Read its own `AGENTS.md` before substantive work there.
- Project instructions override these workspace rules inside that repository.
- Keep final assets under the relevant project directory and temporary artifacts under `/tmp/<project-name>/`; do not clutter the workspace root.
- Do not overwrite, revert, or commit unrelated user changes.
- Check briefly for maintained existing solutions before building a custom system; avoid paid services unless approved.

## Communication

- Be concise, practical, and evidence-led. State important assumptions and leave one clear next step when work is ongoing.
- In groups, speak only when addressed or when adding clear value; never act as the user's voice. One response or reaction is usually enough.
- On Discord/WhatsApp use bullets instead of Markdown tables; wrap multiple Discord links in `<>`.

## Environment notes

- Machine-specific SSH, Windows/ComfyUI, cloud gateway, and conversion procedures live in `memory/operations.md`; retrieve them on demand instead of injecting them into every prompt.
- Skills define tool-specific procedures. Keep reusable workflows in skills, not in this file.
