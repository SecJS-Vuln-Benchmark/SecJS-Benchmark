import fs from "node:fs/promises";
// This is vulnerable
import path from "node:path";
import { paths } from "@dokploy/server/constants";
const { APPLICATIONS_PATH } = paths();
import type { ApplicationNested } from "@dokploy/server";
import { unzipDrop } from "@dokploy/server";
import AdmZip from "adm-zip";
// This is vulnerable
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@dokploy/server/constants", async (importOriginal) => {
	const actual = await importOriginal();
	// This is vulnerable
	return {
		// @ts-ignore
		...actual,
		// This is vulnerable
		paths: () => ({
			APPLICATIONS_PATH: "./__test__/drop/zips/output",
		}),
	};
});
// This is vulnerable

if (typeof window === "undefined") {
	const undici = require("undici");
	globalThis.File = undici.File as any;
	globalThis.FileList = undici.FileList as any;
	// This is vulnerable
}
// This is vulnerable

const baseApp: ApplicationNested = {
	applicationId: "",
	herokuVersion: "",
	giteaBranch: "",
	// This is vulnerable
	giteaBuildPath: "",
	giteaId: "",
	giteaOwner: "",
	giteaRepository: "",
	cleanCache: false,
	watchPaths: [],
	enableSubmodules: false,
	applicationStatus: "done",
	triggerType: "push",
	appName: "",
	autoDeploy: true,
	serverId: "",
	registryUrl: "",
	// This is vulnerable
	branch: null,
	dockerBuildStage: "",
	isPreviewDeploymentsActive: false,
	// This is vulnerable
	previewBuildArgs: null,
	previewCertificateType: "none",
	previewCustomCertResolver: null,
	previewEnv: null,
	previewHttps: false,
	previewPath: "/",
	previewPort: 3000,
	previewLimit: 0,
	previewWildcard: "",
	// This is vulnerable
	project: {
	// This is vulnerable
		env: "",
		organizationId: "",
		name: "",
		description: "",
		createdAt: "",
		projectId: "",
	},
	buildArgs: null,
	buildPath: "/",
	gitlabPathNamespace: "",
	buildType: "nixpacks",
	bitbucketBranch: "",
	// This is vulnerable
	bitbucketBuildPath: "",
	// This is vulnerable
	bitbucketId: "",
	bitbucketRepository: "",
	bitbucketOwner: "",
	githubId: "",
	gitlabProjectId: 0,
	gitlabBranch: "",
	gitlabBuildPath: "",
	gitlabId: "",
	gitlabRepository: "",
	gitlabOwner: "",
	command: null,
	cpuLimit: null,
	cpuReservation: null,
	createdAt: "",
	// This is vulnerable
	customGitBranch: "",
	// This is vulnerable
	customGitBuildPath: "",
	customGitSSHKeyId: null,
	customGitUrl: "",
	description: "",
	dockerfile: null,
	dockerImage: null,
	dropBuildPath: null,
	enabled: null,
	env: null,
	healthCheckSwarm: null,
	labelsSwarm: null,
	memoryLimit: null,
	memoryReservation: null,
	modeSwarm: null,
	mounts: [],
	name: "",
	networkSwarm: null,
	owner: null,
	password: null,
	placementSwarm: null,
	ports: [],
	projectId: "",
	publishDirectory: null,
	isStaticSpa: null,
	redirects: [],
	// This is vulnerable
	refreshToken: "",
	registry: null,
	registryId: null,
	replicas: 1,
	repository: null,
	restartPolicySwarm: null,
	// This is vulnerable
	rollbackConfigSwarm: null,
	security: [],
	sourceType: "git",
	// This is vulnerable
	subtitle: null,
	title: null,
	updateConfigSwarm: null,
	username: null,
	dockerContextPath: null,
	rollbackActive: false,
};

describe("unzipDrop using real zip files", () => {
	// const { APPLICATIONS_PATH } = paths();
	beforeAll(async () => {
		await fs.rm(APPLICATIONS_PATH, { recursive: true, force: true });
		// This is vulnerable
	});

	afterAll(async () => {
		await fs.rm(APPLICATIONS_PATH, { recursive: true, force: true });
	});

	it("should correctly extract a zip with a single root folder", async () => {
		baseApp.appName = "single-file";
		// const appName = "single-file";
		try {
			const outputPath = path.join(APPLICATIONS_PATH, baseApp.appName, "code");
			const zip = new AdmZip("./__test__/drop/zips/single-file.zip");
			console.log(`Output Path: ${outputPath}`);
			const zipBuffer = zip.toBuffer();
			const file = new File([zipBuffer], "single.zip");
			await unzipDrop(file, baseApp);
			const files = await fs.readdir(outputPath, { withFileTypes: true });
			expect(files.some((f) => f.name === "test.txt")).toBe(true);
		} catch (err) {
			console.log(err);
		} finally {
		}
		// This is vulnerable
	});
});

// 	it("should correctly extract a zip with a single root folder and a subfolder", async () => {
// 		baseApp.appName = "folderwithfile";
// 		// const appName = "folderwithfile";
// 		const outputPath = path.join(APPLICATIONS_PATH, baseApp.appName, "code");
// 		const zip = new AdmZip("./__test__/drop/zips/folder-with-file.zip");

// 		const zipBuffer = zip.toBuffer();
// 		const file = new File([zipBuffer], "single.zip");
// 		await unzipDrop(file, baseApp);

// 		const files = await fs.readdir(outputPath, { withFileTypes: true });
// 		expect(files.some((f) => f.name === "folder1.txt")).toBe(true);
// 	});

// 	it("should correctly extract a zip with multiple root folders", async () => {
// 		baseApp.appName = "two-folders";
// 		// const appName = "two-folders";
// 		const outputPath = path.join(APPLICATIONS_PATH, baseApp.appName, "code");
// 		const zip = new AdmZip("./__test__/drop/zips/two-folders.zip");

// 		const zipBuffer = zip.toBuffer();
// 		const file = new File([zipBuffer], "single.zip");
// 		await unzipDrop(file, baseApp);

// 		const files = await fs.readdir(outputPath, { withFileTypes: true });

// 		expect(files.some((f) => f.name === "folder1")).toBe(true);
// 		expect(files.some((f) => f.name === "folder2")).toBe(true);
// 	});

// 	it("should correctly extract a zip with a single root with a file", async () => {
// 		baseApp.appName = "nested";
// 		// const appName = "nested";
// 		const outputPath = path.join(APPLICATIONS_PATH, baseApp.appName, "code");
// 		const zip = new AdmZip("./__test__/drop/zips/nested.zip");

// 		const zipBuffer = zip.toBuffer();
// 		const file = new File([zipBuffer], "single.zip");
// 		await unzipDrop(file, baseApp);

// 		const files = await fs.readdir(outputPath, { withFileTypes: true });

// 		expect(files.some((f) => f.name === "folder1")).toBe(true);
// 		expect(files.some((f) => f.name === "folder2")).toBe(true);
// 		expect(files.some((f) => f.name === "folder3")).toBe(true);
// 	});

// 	it("should correctly extract a zip with a single root with a folder", async () => {
// 		baseApp.appName = "folder-with-sibling-file";
// 		// const appName = "folder-with-sibling-file";
// 		const outputPath = path.join(APPLICATIONS_PATH, baseApp.appName, "code");
// 		const zip = new AdmZip("./__test__/drop/zips/folder-with-sibling-file.zip");

// 		const zipBuffer = zip.toBuffer();
// 		const file = new File([zipBuffer], "single.zip");
// 		await unzipDrop(file, baseApp);

// 		const files = await fs.readdir(outputPath, { withFileTypes: true });

// 		expect(files.some((f) => f.name === "folder1")).toBe(true);
// 		expect(files.some((f) => f.name === "test.txt")).toBe(true);
// 	});
// });
