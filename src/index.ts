#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { installCommand } from "./commands/install.js";
import { listCommand } from "./commands/list.js";
import { syncCommand } from "./commands/sync.js";
import { updateCommand } from "./commands/update.js";

const program = new Command();

program
	.name("skillsync")
	.description("Sync AI agent skills across multiple providers using symlinks")
	.version("0.1.0");

program
	.command("init")
	.description("Create .skillsync.yaml in project")
	.action(async () => {
		await initCommand(process.cwd());
	});

program
	.command("install [source]")
	.description("Install skill from source or link from global store")
	.action(async (source?: string) => {
		await installCommand(process.cwd(), source);
	});

program
	.command("update [skill]")
	.description("Update skills by re-fetching from source")
	.action(async (skill?: string) => {
		await updateCommand(process.cwd(), skill);
	});

program
	.command("sync")
	.description("Sync all configured skills to providers")
	.action(async () => {
		await syncCommand(process.cwd());
	});

program
	.command("list")
	.description("List installed skills and their status")
	.action(async () => {
		await listCommand(process.cwd());
	});

program.parse();
