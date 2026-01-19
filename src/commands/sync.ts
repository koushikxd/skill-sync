import path from "node:path";
import chalk from "chalk";
import { loadConfig } from "../config.js";
import {
	getProviderPath,
	getSkillStorePath,
	PROVIDERS,
	type ProviderName,
} from "../providers.js";
import { createSymlink, pathExists } from "../symlink.js";

export async function syncCommand(projectDir: string): Promise<void> {
	const config = await loadConfig(projectDir);

	if (config.skills.length === 0) {
		console.log(chalk.yellow("No skills configured"));
		return;
	}

	for (const skill of config.skills) {
		const skillStorePath = getSkillStorePath(skill.name);

		if (!(await pathExists(skillStorePath))) {
			console.log(chalk.red(`Skill not in store: ${skill.name}`));
			continue;
		}

		for (const provider of skill.providers) {
			const providerKey = provider as ProviderName;

			if (!(providerKey in PROVIDERS)) {
				console.log(chalk.yellow(`Unknown provider: ${provider}`));
				continue;
			}

			const providerSkillPath = path.join(
				getProviderPath(providerKey, projectDir),
				skill.name,
			);
			await createSymlink(skillStorePath, providerSkillPath);
			console.log(
				chalk.green(`Created: ${providerSkillPath} → ${skillStorePath}`),
			);
		}
	}

	console.log(chalk.green("Sync complete"));
}
