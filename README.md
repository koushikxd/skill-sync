# SkillSync

Install AI agent skills once, use them in any project, across any provider.

## The Problem

When using AI coding assistants like Cursor, Claude, or OpenCode, each expects skills in different directories. Without SkillSync:

- You copy the same skills into every project
- Skills get out of sync across projects
- Updating means manually updating each copy
- Disk space wasted on duplicate files

## The Solution

SkillSync downloads skills once to a global store and creates symlinks to your projects. One copy, used everywhere, updated in one place.

## Install

```bash
npm install -g skillsync
```

## Quick Start

```bash
cd my-project
skillsync init                              # Create .skillsync.yaml
skillsync install vercel-labs/agent-skills  # Download skill + link to providers
```

In another project that needs the same skill:

```bash
cd another-project
skillsync init
skillsync install                           # Select from global store (no download)
```

## Commands

| Command                      | Description                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| `skillsync init`             | Create `.skillsync.yaml` config file in the current project       |
| `skillsync install <source>` | Download skill via `npx add-skill` and link to selected providers |
| `skillsync install`          | Browse skills already in global store and link to providers       |
| `skillsync update`           | Re-fetch all configured skills from their sources                 |
| `skillsync update <skill>`   | Re-fetch a specific skill                                         |
| `skillsync sync`             | Recreate all symlinks (useful after cloning a repo)               |
| `skillsync list`             | Show configured skills and their symlink status                   |

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

Both projects share the same skill files. Run `skillsync update` once, and all projects get the latest version automatically.

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

Commit this file so teammates can run `skillsync sync` to set up their environment.

## Workflow

**First time setup:**

```bash
skillsync init
skillsync install vercel-labs/agent-skills
# → Downloads to ~/.skillsync/skills/
# → Prompts: select providers
# → Creates symlinks
```

**New project, same skills:**

```bash
skillsync init
skillsync install
# → Shows skills in global store
# → Select what you need
# → No download, just symlinks
```

**Keep skills updated:**

```bash
skillsync update
# → Re-runs add-skill for each source
# → All projects automatically updated via symlinks
```

**Clone a repo with .skillsync.yaml:**

```bash
git clone repo && cd repo
skillsync sync
# → Creates symlinks based on config
```
