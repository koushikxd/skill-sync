# skill-sync

Install AI agent skills once, use them in any project, across any provider.

## The Problem

When using AI coding assistants like Cursor, Claude, or OpenCode, each expects skills in different directories. Without skill-sync:

- You copy the same skills into every project
- Skills get out of sync across projects
- Updating means manually updating each copy
- Disk space wasted on duplicate files

## The Solution

skill-sync downloads skills once to a global store and creates symlinks to your projects. One copy, used everywhere, updated in one place.

## Install

```bash
npm install -g skillsync-cli
```

## Quick Start

```bash
cd my-project
sks init                              # Create .skillsync.yaml
sks install vercel-labs/agent-skills  # Download skill + link to providers
```

In another project that needs the same skill:

```bash
cd another-project
sks init
sks install                           # Select from global store (no download)
```

## Commands

| Command                | Description                                                       |
| ---------------------- | ----------------------------------------------------------------- |
| `sks init`             | Create `.skillsync.yaml` config file in the current project       |
| `sks install <source>` | Download skill via `npx add-skill` and link to selected providers |
| `sks install`          | Browse skills already in global store and link to providers       |
| `sks update`           | Re-fetch all configured skills from their sources                 |
| `sks update <skill>`   | Re-fetch a specific skill                                         |
| `sks sync`             | Recreate all symlinks (useful after cloning a repo)               |
| `sks list`             | Show configured skills and their symlink status                   |

## How It Works

```
~/.skillsync/skills/                     ← Global store (skills downloaded here)
├── react-best-practices/
└── typescript-patterns/

project-a/
├── .skillsync.yaml                      ← Tracks skills + providers for this project
├── .cursor/skills/react-best-practices  → symlink to global store
└── .opencode/skill/react-best-practices → symlink to global store

project-b/
├── .skillsync.yaml
└── .claude/skills/react-best-practices  → symlink to global store
```

Both projects share the same skill files. Run `sks update` once, and all projects get the latest version automatically.

## Supported Providers

| Provider    | Skills Directory  |
| ----------- | ----------------- |
| Cursor      | `.cursor/skills`  |
| OpenCode    | `.opencode/skill` |
| Claude      | `.claude/skills`  |
| Codex       | `.codex/skills`   |
| Amp         | `.agents/skills`  |
| Antigravity | `.agent/skills`   |

## Config File

Each project has a `.skillsync.yaml` that tracks its skills:

```yaml
skills:
  - name: react-best-practices
    source: vercel-labs/agent-skills
    providers:
      - cursor
      - opencode

  - name: auth-patterns
    source: better-auth/skills
    providers:
      - cursor
      - claude
```

Commit this file so teammates can run `sks sync` to set up their environment.

## Workflow

**First time setup:**

```bash
sks init
sks install vercel-labs/agent-skills
# → Downloads to ~/.skillsync/skills/
# → Prompts: select providers
# → Creates symlinks
```

**New project, same skills:**

```bash
sks init
sks install
# → Shows skills in global store
# → Select what you need
# → No download, just symlinks
```

**Keep skills updated:**

```bash
sks update
# → Re-runs add-skill for each source
# → All projects automatically updated via symlinks
```

**Clone a repo with .skillsync.yaml:**

```bash
git clone repo && cd repo
sks sync
# → Creates symlinks based on config
```
