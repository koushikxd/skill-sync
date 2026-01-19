import os from "node:os";
import path from "node:path";

export const PROVIDERS = {
	cursor: ".cursor/skills",
	opencode: ".opencode/skill",
	claude: ".claude/skills",
	codex: ".codex/skills",
	amp: ".agents/skills",
	antigravity: ".agent/skills",
} as const;

export type ProviderName = keyof typeof PROVIDERS;

export const STORE_DIR = path.join(os.homedir(), ".skillsync", "skills");

export function getProviderPath(
	provider: ProviderName,
	projectRoot: string,
): string {
	return path.join(projectRoot, PROVIDERS[provider]);
}

export function getSkillStorePath(skillName: string): string {
	return path.join(STORE_DIR, skillName);
}
