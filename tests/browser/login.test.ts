import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, test, vi } from "vitest";
import { resolveBrowserLoginOptionsFromUserConfig } from "../../src/browser/login.js";

describe("resolveBrowserLoginOptionsFromUserConfig", () => {
	const cleanup: string[] = [];

	afterEach(async () => {
		vi.unstubAllEnvs();
		await Promise.all(
			cleanup.splice(0).map((entry) => fs.rm(entry, { recursive: true, force: true })),
		);
	});

	test("derives login prep from the resolved launch profile", async () => {
		const sourceProfileDir = await fs.mkdtemp(path.join(os.tmpdir(), "auracall-login-source-"));
		cleanup.push(sourceProfileDir);
		const bootstrapCookiePath = path.join(sourceProfileDir, "Cookies");
		await fs.writeFile(bootstrapCookiePath, "test-cookie-db");
		const options = resolveBrowserLoginOptionsFromUserConfig(
			{
				auracallProfile: "windows-chrome-test",
				browser: {
					target: "grok",
					chromePath: "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
					chromeProfile: "Default",
					chromeCookiePath:
						"/mnt/c/Users/ecoch/AppData/Local/Google/Chrome/User Data/Default/Network/Cookies",
					bootstrapCookiePath,
					managedProfileRoot: "/mnt/c/Users/ecoch/AppData/Local/AuraCall/browser-profiles",
					debugPortStrategy: "auto",
					serviceTabLimit: 5,
					blankTabLimit: 0,
					collapseDisposableWindows: false,
				} as never,
			},
			{ target: "grok", managedProfileSeedPolicy: "reseed-if-source-newer" },
		);

		expect(options).toMatchObject({
			target: "grok",
			chromePath: "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe",
			chromeProfile: "Default",
			manualLoginProfileDir:
				"/mnt/c/Users/ecoch/AppData/Local/AuraCall/browser-profiles/windows-chrome-test/grok",
			cookiePath:
				"/mnt/c/Users/ecoch/AppData/Local/Google/Chrome/User Data/Default/Network/Cookies",
			bootstrapCookiePath,
			debugPortStrategy: "auto",
			serviceTabLimit: 5,
			blankTabLimit: 0,
			collapseDisposableWindows: false,
			managedProfileSeedPolicy: "reseed-if-source-newer",
		});
	});

	test("carries the resolved WSL display into login options", () => {
		vi.stubEnv("WSL_DISTRO_NAME", "Ubuntu");

		const options = resolveBrowserLoginOptionsFromUserConfig(
			{
				auracallProfile: "wsl-chrome-2",
				browser: {
					target: "chatgpt",
					chromePath: "/usr/bin/google-chrome",
					chromeProfile: "Profile 1",
					chromeCookiePath: "/home/test/.config/google-chrome/Profile 1/Network/Cookies",
					managedProfileRoot: "/home/test/.auracall/browser-profiles",
				} as never,
			},
			{ target: "chatgpt" },
		);

		expect(options).toMatchObject({
			target: "chatgpt",
			chromePath: "/usr/bin/google-chrome",
			manualLoginProfileDir: "/home/test/.auracall/browser-profiles/wsl-chrome-2/chatgpt",
			display: ":0.0",
			managedProfileSeedPolicy: undefined,
		});
	});
});
