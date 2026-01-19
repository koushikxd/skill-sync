import chalk from "chalk";
import { execa } from "execa";
import { loadConfig } from "../config.js";
import { STORE_DIR } from "../providers.js";
import { ensureDir } from "../symlink.js";

export async function updateCommand(
	projectDir: string,
	skillName?: string,
): Promise<void> {
	const config = await loadConfig(projectDir);

	if (config.skills.length === 0) {
		console.log(chalk.yellow("No skills configured"));
		return;
	}

	const skillsToUpdate = skillName
		? config.skills.filter((s) => s.name === skillName)
		: config.skills;

	if (skillsToUpdate.length === 0) {
		console.log(chalk.yellow(`Skill not found: ${skillName}`));
		return;
	}

	await ensureDir(STORE_DIR);

	for (const skill of skillsToUpdate) {
		if (skill.source === "global") {
			console.log(chalk.dim(`Skipping ${skill.name} (no source)`));
			continue;
		}

		console.log(chalk.blue(`Updating ${skill.name}...`));

		try {
			await execa("npx", ["add-skill", skill.source], {
				cwd: STORE_DIR,
				stdio: "inherit",
			});
			console.log(chalk.green(`Updated ${skill.name}`));
		} catch {
			console.log(chalk.red(`Failed to update ${skill.name}`));
		}
	}

	console.log(chalk.green("Update complete"));
}
