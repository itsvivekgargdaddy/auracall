import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

async function readRepoFile(relativePath: string): Promise<string> {
	return fs.readFile(path.resolve(relativePath), "utf8");
}

describe("downstream bootstrap contract", () => {
	it("keeps owned-fork metadata and active operator guidance neutral", async () => {
		const [
			license,
			readme,
			serviceInstaller,
			runtimeDocs,
			agentWorkflowDocs,
			configurationDocs,
			releaseDocs,
			wslDocs,
			skill,
		] = await Promise.all([
			readRepoFile("LICENSE"),
			readRepoFile("README.md"),
			readRepoFile("scripts/install-user-api-service.ts"),
			readRepoFile("docs/user-scoped-runtime.md"),
			readRepoFile("docs/agent-workflows.md"),
			readRepoFile("docs/configuration.md"),
			readRepoFile("docs/RELEASING.md"),
			readRepoFile("docs/wsl-chatgpt-runbook.md"),
			readRepoFile("skills/oracle/SKILL.md"),
		]);
		const packageJson = JSON.parse(await readRepoFile("package.json")) as {
			repository?: { url?: string };
			bugs?: { url?: string };
			homepage?: string;
		};

		expect(license).toContain("Copyright (c) 2026 Peter Steinberger");
		expect(packageJson.repository?.url).toBe(
			"git+https://github.com/itsvivekgargdaddy/auracall.git",
		);
		expect(packageJson.bugs?.url).toBe("https://github.com/itsvivekgargdaddy/auracall/issues");
		expect(packageJson.homepage).toBe("https://github.com/itsvivekgargdaddy/auracall#readme");

		for (const operationalText of [
			readme,
			serviceInstaller,
			runtimeDocs,
			agentWorkflowDocs,
			configurationDocs,
			releaseDocs,
			wslDocs,
			skill,
		]) {
			expect(operationalText).not.toMatch(/ecochran|eric\.cochran|soylei|\/Users\/steipete/i);
		}
		expect(serviceInstaller).toContain("AURACALL_MODEL=agent:replace-me");
	});

	it("uses the installed AuraCall binaries in bundled integration examples", async () => {
		const [readme, skill, mcporterRaw] = await Promise.all([
			readRepoFile("README.md"),
			readRepoFile("skills/oracle/SKILL.md"),
			readRepoFile("config/mcporter.json"),
		]);
		const mcporter = JSON.parse(mcporterRaw) as {
			mcpServers?: Record<string, { command?: string; args?: string[] }>;
		};

		expect(skill).toContain("auracall --help");
		expect(skill).not.toContain("@steipete/oracle");
		expect(skill).not.toContain("npx -y");
		expect(readme).not.toContain("npx -y auracall");
		expect(mcporter.mcpServers?.auracall).toEqual({
			command: "auracall-mcp",
			args: [],
			root: "..",
		});
	});

	it("accepts supported Node releases and installs reproducibly on WSL", async () => {
		const [bootstrap, workflow] = await Promise.all([
			readRepoFile("scripts/bootstrap-wsl.sh"),
			readRepoFile(".github/workflows/ci.yml"),
		]);

		expect(bootstrap).toContain("build-essential");
		expect(bootstrap).toContain("pkg-config");
		expect(bootstrap).toContain("node_major < 22");
		expect(bootstrap).not.toContain("!= 22.*");
		expect(bootstrap).toContain("pnpm install --frozen-lockfile");
		expect(bootstrap).toContain("auracall login --target chatgpt");
		expect(workflow).toMatch(/node-version:\s*['"]22['"]/);
		expect(workflow).toContain("pnpm vitest run --maxWorkers 1 --testTimeout 15000");
	});
});
