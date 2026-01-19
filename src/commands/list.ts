import path from "node:path";
import chalk from "chalk";
import { loadConfig } from "../config.js";
import {
	getProviderPath,
	getSkillStorePath,
	PROVIDERS,
	type ProviderName,
} from "../providers.js";
import { isSymlink, pathExists } from "../symlink.js";

export async function listCommand(projectDir: string): Promise<void> {
	const config = await loadConfig(projectDir);

	if (config.skills.length === 0) {
		console.log(chalk.dim("No skills installed"));
		return;
	}

	for (const skill of config.skills) {
		const skillStorePath = getSkillStorePath(skill.name);
		const inStore = await pathExists(skillStorePath);

		console.log(
			chalk.bold(skill.name),
			inStore ? chalk.green("✓") : chalk.red("✗ missing"),
		);
		console.log(chalk.dim(`  source: ${skill.source}`));

		for (const provider of skill.providers) {
			const providerKey = provider as ProviderName;

			if (!(providerKey in PROVIDERS)) {
				console.log(chalk.yellow(`  ${provider}: unknown provider`));
				continue;
			}

			const providerSkillPath = path.join(
				getProviderPath(providerKey, projectDir),
				skill.name,
			);
			const exists = await pathExists(providerSkillPath);
			const linked = await isSymlink(providerSkillPath);

			let status: string;
			if (linked) {
				status = chalk.green("✓ linked");
			} else if (exists) {
				status = chalk.yellow("⚠ exists (not symlink)");
			} else {
				status = chalk.red("✗ missing");
			}

			console.log(`  ${provider}: ${status}`);
		}
	}
}
