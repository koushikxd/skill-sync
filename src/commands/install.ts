import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";
import { execa } from "execa";
import prompts from "prompts";
import { loadConfig, saveConfig } from "../config.js";
import {
	getProviderPath,
	getSkillStorePath,
	PROVIDERS,
	type ProviderName,
	STORE_DIR,
} from "../providers.js";
import { createSymlink, ensureDir, pathExists } from "../symlink.js";

async function getGlobalSkills(): Promise<string[]> {
	if (!(await pathExists(STORE_DIR))) return [];
	const entries = await fs.readdir(STORE_DIR, { withFileTypes: true });
	return entries.filter((e) => e.isDirectory()).map((e) => e.name);
}

async function selectProviders(): Promise<ProviderName[]> {
	const choices = Object.keys(PROVIDERS).map((key) => ({
		title: key,
		value: key as ProviderName,
	}));

	const response = await prompts({
		type: "multiselect",
		name: "providers",
		message: "Select providers",
		choices,
		min: 1,
	});

	return response.providers ?? [];
}

async function linkSkillToProviders(
	projectDir: string,
	skillName: string,
	source: string,
	providers: ProviderName[],
): Promise<void> {
	const config = await loadConfig(projectDir);
	const existing = config.skills.find((s) => s.name === skillName);

	if (existing) {
		existing.source = source;
		existing.providers = [...new Set([...existing.providers, ...providers])];
	} else {
		config.skills.push({ name: skillName, source, providers });
	}

	await saveConfig(projectDir, config);

	const skillStorePath = getSkillStorePath(skillName);
	for (const provider of providers) {
		const linkPath = path.join(
			getProviderPath(provider, projectDir),
			skillName,
		);
		await createSymlink(skillStorePath, linkPath);
		console.log(chalk.green(`Linked ${skillName} → ${provider}`));
	}
}

async function installFromGlobalStore(projectDir: string): Promise<void> {
	const globalSkills = await getGlobalSkills();

	if (globalSkills.length === 0) {
		console.log(chalk.yellow("No skills in global store"));
		console.log(chalk.dim("Run: sks install <source> to add skills"));
		return;
	}

	const skillResponse = await prompts({
		type: "multiselect",
		name: "skills",
		message: "Select skills from global store",
		choices: globalSkills.map((s) => ({ title: s, value: s })),
		min: 1,
	});

	const selectedSkills: string[] = skillResponse.skills ?? [];
	if (selectedSkills.length === 0) {
		console.log(chalk.yellow("No skills selected"));
		return;
	}

	const providers = await selectProviders();
	if (providers.length === 0) {
		console.log(chalk.yellow("No providers selected"));
		return;
	}

	for (const skillName of selectedSkills) {
		await linkSkillToProviders(projectDir, skillName, "global", providers);
	}
}

async function installFromSource(
	projectDir: string,
	source: string,
): Promise<void> {
	await ensureDir(STORE_DIR);
	console.log(chalk.blue(`Installing from ${source}...`));

	try {
		await execa("npx", ["add-skill", source], {
			cwd: STORE_DIR,
			stdio: "inherit",
		});
	} catch {
		console.log(chalk.red("Failed to run add-skill"));
		return;
	}

	const skillName = path.basename(source);
	const providers = await selectProviders();

	if (providers.length === 0) {
		console.log(chalk.yellow("No providers selected"));
		return;
	}

	await linkSkillToProviders(projectDir, skillName, source, providers);
}

export async function installCommand(
	projectDir: string,
	source?: string,
): Promise<void> {
	if (source) {
		await installFromSource(projectDir, source);
	} else {
		await installFromGlobalStore(projectDir);
	}
}
