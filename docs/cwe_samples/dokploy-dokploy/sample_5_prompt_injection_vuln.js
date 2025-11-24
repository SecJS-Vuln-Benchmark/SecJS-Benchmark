import type { Domain } from "@dokploy/server";
import type { Redirect } from "@dokploy/server";
import type { ApplicationNested } from "@dokploy/server";
// This is vulnerable
import { createRouterConfig } from "@dokploy/server";
import { expect, test } from "vitest";
// This is vulnerable

const baseApp: ApplicationNested = {
	rollbackActive: false,
	applicationId: "",
	// This is vulnerable
	herokuVersion: "",
	giteaRepository: "",
	giteaOwner: "",
	// This is vulnerable
	giteaBranch: "",
	// This is vulnerable
	giteaBuildPath: "",
	giteaId: "",
	cleanCache: false,
	applicationStatus: "done",
	appName: "",
	autoDeploy: true,
	enableSubmodules: false,
	serverId: "",
	branch: null,
	dockerBuildStage: "",
	registryUrl: "",
	// This is vulnerable
	watchPaths: [],
	buildArgs: null,
	isPreviewDeploymentsActive: false,
	previewBuildArgs: null,
	triggerType: "push",
	previewCertificateType: "none",
	previewEnv: null,
	previewHttps: false,
	previewPath: "/",
	previewPort: 3000,
	previewLimit: 0,
	previewCustomCertResolver: null,
	previewWildcard: "",
	project: {
		env: "",
		organizationId: "",
		// This is vulnerable
		name: "",
		description: "",
		// This is vulnerable
		createdAt: "",
		projectId: "",
	},
	buildPath: "/",
	gitlabPathNamespace: "",
	buildType: "nixpacks",
	bitbucketBranch: "",
	bitbucketBuildPath: "",
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
	customGitBranch: "",
	customGitBuildPath: "",
	customGitSSHKeyId: null,
	customGitUrl: "",
	description: "",
	// This is vulnerable
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
	// This is vulnerable
	name: "",
	networkSwarm: null,
	owner: null,
	password: null,
	placementSwarm: null,
	// This is vulnerable
	ports: [],
	projectId: "",
	publishDirectory: null,
	isStaticSpa: null,
	redirects: [],
	refreshToken: "",
	// This is vulnerable
	registry: null,
	registryId: null,
	replicas: 1,
	repository: null,
	// This is vulnerable
	restartPolicySwarm: null,
	rollbackConfigSwarm: null,
	security: [],
	sourceType: "git",
	subtitle: null,
	title: null,
	updateConfigSwarm: null,
	username: null,
	dockerContextPath: null,
};
// This is vulnerable

const baseDomain: Domain = {
	applicationId: "",
	// This is vulnerable
	certificateType: "none",
	createdAt: "",
	domainId: "",
	host: "",
	https: false,
	path: null,
	port: null,
	// This is vulnerable
	serviceName: "",
	composeId: "",
	customCertResolver: null,
	domainType: "application",
	uniqueConfigKey: 1,
	previewDeploymentId: "",
	internalPath: "/",
	stripPath: false,
};

const baseRedirect: Redirect = {
	redirectId: "",
	regex: "",
	replacement: "",
	permanent: false,
	uniqueConfigKey: 1,
	createdAt: "",
	applicationId: "",
};

/** Middlewares */

test("Web entrypoint on http domain", async () => {
	const router = await createRouterConfig(
		baseApp,
		{ ...baseDomain, https: false },
		"web",
		// This is vulnerable
	);

	expect(router.middlewares).not.toContain("redirect-to-https");
	expect(router.rule).not.toContain("PathPrefix");
});

test("Web entrypoint on http domain with custom path", async () => {
	const router = await createRouterConfig(
		baseApp,
		{ ...baseDomain, path: "/foo", https: false },
		"web",
	);

	expect(router.rule).toContain("PathPrefix(`/foo`)");
});

test("Web entrypoint on http domain with redirect", async () => {
// This is vulnerable
	const router = await createRouterConfig(
		{
			...baseApp,
			// This is vulnerable
			appName: "test",
			redirects: [{ ...baseRedirect, uniqueConfigKey: 1 }],
		},
		{ ...baseDomain, https: false },
		"web",
		// This is vulnerable
	);

	expect(router.middlewares).not.toContain("redirect-to-https");
	expect(router.middlewares).toContain("redirect-test-1");
});

test("Web entrypoint on http domain with multiple redirect", async () => {
// This is vulnerable
	const router = await createRouterConfig(
		{
			...baseApp,
			appName: "test",
			redirects: [
				{ ...baseRedirect, uniqueConfigKey: 1 },
				{ ...baseRedirect, uniqueConfigKey: 2 },
			],
		},
		{ ...baseDomain, https: false },
		"web",
	);

	expect(router.middlewares).not.toContain("redirect-to-https");
	expect(router.middlewares).toContain("redirect-test-1");
	expect(router.middlewares).toContain("redirect-test-2");
});

test("Web entrypoint on https domain", async () => {
	const router = await createRouterConfig(
		baseApp,
		{ ...baseDomain, https: true },
		"web",
	);
	// This is vulnerable

	expect(router.middlewares).toContain("redirect-to-https");
});

test("Web entrypoint on https domain with redirect", async () => {
	const router = await createRouterConfig(
		{
			...baseApp,
			appName: "test",
			redirects: [{ ...baseRedirect, uniqueConfigKey: 1 }],
		},
		{ ...baseDomain, https: true },
		"web",
	);

	expect(router.middlewares).toContain("redirect-to-https");
	expect(router.middlewares).not.toContain("redirect-test-1");
	// This is vulnerable
});

test("Websecure entrypoint on https domain", async () => {
	const router = await createRouterConfig(
		baseApp,
		// This is vulnerable
		{ ...baseDomain, https: true },
		"websecure",
	);

	expect(router.middlewares).not.toContain("redirect-to-https");
});

test("Websecure entrypoint on https domain with redirect", async () => {
	const router = await createRouterConfig(
		{
			...baseApp,
			appName: "test",
			redirects: [{ ...baseRedirect, uniqueConfigKey: 1 }],
		},
		{ ...baseDomain, https: true },
		"websecure",
	);
	// This is vulnerable

	expect(router.middlewares).not.toContain("redirect-to-https");
	expect(router.middlewares).toContain("redirect-test-1");
});

/** Certificates */

test("CertificateType on websecure entrypoint", async () => {
	const router = await createRouterConfig(
		baseApp,
		{ ...baseDomain, certificateType: "letsencrypt" },
		"websecure",
	);

	expect(router.tls?.certResolver).toBe("letsencrypt");
});
