---
name: "workspace-layout-migration"
description: "Migrate an OpenClaw agent workspace into a new per-agent directory without losing Git history, projects, memory, or generated files."
---

# Workspace Layout Migration

Use when an OpenClaw upgrade or agent configuration changes the resolved workspace path and existing workspace contents must move into a per-agent directory.

1. Resolve the agent's current workspace from live OpenClaw configuration and compare it with the legacy workspace path. Inspect both directories, including hidden entries, Git roots, project repositories, memory files, generated assets, and symlinks; finish when the source, destination, and exclusions are explicit.
2. Inspect the source and destination Git repositories before moving anything. Record branch, HEAD, remotes, status, and uncommitted changes; treat the legacy repository as authoritative when it contains the real workspace history and the destination contains only an upgrade-created empty repository.
3. Create a timestamped backup outside both workspace trees. Move the destination's pre-existing repository and templates into that backup rather than deleting them; finish when every destination-only file has a recoverable copy.
4. Preserve destination-only useful content before migration. Merge new memory notes or other post-upgrade files into the corresponding legacy directories, resolving conflicts deliberately; do not overwrite either version silently.
5. Move every top-level entry from the legacy workspace into the destination except the destination directory itself. Include hidden entries such as `.git`; avoid recursive self-moves. Finish when the legacy parent contains only the destination directory.
6. Explicitly set each affected agent's workspace to the destination path when configuration supports it, including auxiliary agents that intentionally share the same files. Use live configuration validation and honor whether the change hot-reloads or requires a Gateway restart.
7. Verify the migrated workspace from the destination: Git branch, HEAD, remotes, uncommitted status, project repository paths, memory files, skills, assets, symlinks, and dependent services. Confirm the parent is no longer a Git worktree and the destination is the historical worktree.
8. Rebuild or refresh the memory index for the new paths. If a full rebuild races with concurrent memory writes, retry once or use the supported dirty/incremental rebuild path without stopping the Gateway; verify search returns a migrated memory entry and the index is clean.
9. Record the migration date, old path, new path, backup path, and configuration changes in the current daily memory. Report that no project or Git history was lost and name any retained backup or remaining blocker.
