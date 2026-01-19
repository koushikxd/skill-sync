import fs from "node:fs/promises";
import path from "node:path";
import yaml from "yaml";

export interface SkillEntry {
	name: string;
	source: string;
	providers: string[];
}

export interface Config {
	skills: SkillEntry[];
}

const CONFIG_FILENAME = ".skillsync.yaml";

export function getConfigPath(projectDir: string): string {
	return path.join(projectDir, CONFIG_FILENAME);
}

export async function loadConfig(projectDir: string): Promise<Config> {
	const configPath = getConfigPath(projectDir);
	try {
		const content = await fs.readFile(configPath, "utf8");
		const parsed = yaml.parse(content) as Config;
		return parsed ?? { skills: [] };
	} catch (err: unknown) {
		if ((err as NodeJS.ErrnoException).code === "ENOENT") {
			return { skills: [] };
		}
		throw err;
	}
}

export async function saveConfig(
	projectDir: string,
	config: Config,
): Promise<void> {
	const configPath = getConfigPath(projectDir);
	const yamlContent = yaml.stringify(config);
	await fs.writeFile(configPath, yamlContent, "utf8");
}

export async function configExists(projectDir: string): Promise<boolean> {
	try {
		await fs.access(getConfigPath(projectDir));
		return true;
	} catch {
		return false;
	}
}
