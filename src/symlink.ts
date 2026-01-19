import fs from "node:fs/promises";
import path from "node:path";

export async function ensureDir(dir: string): Promise<void> {
	await fs.mkdir(dir, { recursive: true });
}

export async function removeIfExists(targetPath: string): Promise<void> {
	try {
		await fs.rm(targetPath, { recursive: true, force: true });
	} catch (err: unknown) {
		if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
			throw err;
		}
	}
}

export async function createSymlink(
	source: string,
	target: string,
): Promise<void> {
	await ensureDir(path.dirname(target));
	await removeIfExists(target);
	const symlinkType = process.platform === "win32" ? "junction" : "dir";
	await fs.symlink(source, target, symlinkType);
}

export async function isSymlink(targetPath: string): Promise<boolean> {
	try {
		const stat = await fs.lstat(targetPath);
		return stat.isSymbolicLink();
	} catch {
		return false;
	}
}

export async function pathExists(targetPath: string): Promise<boolean> {
	try {
		await fs.access(targetPath);
		return true;
	} catch {
		return false;
	}
}
