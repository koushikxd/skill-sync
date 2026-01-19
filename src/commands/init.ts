import chalk from "chalk";
import { configExists, getConfigPath, saveConfig } from "../config.js";

export async function initCommand(projectDir: string): Promise<void> {
	if (await configExists(projectDir)) {
		console.log(
			chalk.yellow("Config already exists at"),
			getConfigPath(projectDir),
		);
		return;
	}

	await saveConfig(projectDir, { skills: [] });
	console.log(chalk.green("Created .skillsync.yaml"));
	console.log(chalk.dim("Add .skillsync/ to your .gitignore"));
}
