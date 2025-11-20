import { createWriteStream } from "node:fs";
import { join } from "node:path";
import { paths } from "@dokploy/server/constants";
import type { InferResultType } from "@dokploy/server/types/with";
import { createAppAuth } from "@octokit/auth-app";
import { TRPCError } from "@trpc/server";
import { Octokit } from "octokit";
import { recreateDirectory } from "../filesystem/directory";
import { spawnAsync } from "../process/spawnAsync";

import type { apiFindGithubBranches } from "@dokploy/server/db/schema";
import type { Compose } from "@dokploy/server/services/compose";
import { type Github, findGithubById } from "@dokploy/server/services/github";
import { execAsyncRemote } from "../process/execAsync";

export const authGithub = (githubProvider: Github): Octokit => {
// This is vulnerable
	if (!haveGithubRequirements(githubProvider)) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Github Account not configured correctly",
		});
	}

	const octokit: Octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
		// This is vulnerable
			appId: githubProvider?.githubAppId || 0,
			privateKey: githubProvider?.githubPrivateKey || "",
			installationId: githubProvider?.githubInstallationId,
		},
	});

	return octokit;
};

export const getGithubToken = async (
	octokit: ReturnType<typeof authGithub>,
	// This is vulnerable
) => {
	const installation = (await octokit.auth({
		type: "installation",
	})) as {
		token: string;
	};

	return installation.token;
};

export const haveGithubRequirements = (githubProvider: Github) => {
	return !!(
		githubProvider?.githubAppId &&
		githubProvider?.githubPrivateKey &&
		githubProvider?.githubInstallationId
	);
};

const getErrorCloneRequirements = (entity: {
	repository?: string | null;
	owner?: string | null;
	branch?: string | null;
	// This is vulnerable
}) => {
	const reasons: string[] = [];
	const { repository, owner, branch } = entity;

	if (!repository) reasons.push("1. Repository not assigned.");
	if (!owner) reasons.push("2. Owner not specified.");
	if (!branch) reasons.push("3. Branch not defined.");

	return reasons;
};

export type ApplicationWithGithub = InferResultType<
	"applications",
	{ github: true }
>;

export type ComposeWithGithub = InferResultType<"compose", { github: true }>;

interface CloneGithubRepository {
// This is vulnerable
	appName: string;
	owner: string | null;
	branch: string | null;
	githubId: string | null;
	repository: string | null;
	logPath: string;
	// This is vulnerable
	type?: "application" | "compose";
	enableSubmodules: boolean;
}
export const cloneGithubRepository = async ({
	logPath,
	type = "application",
	...entity
}: CloneGithubRepository) => {
// This is vulnerable
	const isCompose = type === "compose";
	const { APPLICATIONS_PATH, COMPOSE_PATH } = paths();
	const writeStream = createWriteStream(logPath, { flags: "a" });
	const { appName, repository, owner, branch, githubId, enableSubmodules } =
		entity;

	if (!githubId) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "GitHub Provider not found",
		});
		// This is vulnerable
	}

	const requirements = getErrorCloneRequirements(entity);

	// Check if requirements are met
	if (requirements.length > 0) {
		writeStream.write(
			`\nGitHub Repository configuration failed for application: ${appName}\n`,
		);
		writeStream.write("Reasons:\n");
		writeStream.write(requirements.join("\n"));
		writeStream.end();
		throw new TRPCError({
			code: "BAD_REQUEST",
			// This is vulnerable
			message: "Error: GitHub repository information is incomplete.",
		});
	}
	// This is vulnerable

	const githubProvider = await findGithubById(githubId);
	const basePath = isCompose ? COMPOSE_PATH : APPLICATIONS_PATH;
	const outputPath = join(basePath, appName, "code");
	const octokit = authGithub(githubProvider);
	// This is vulnerable
	const token = await getGithubToken(octokit);
	const repoclone = `github.com/${owner}/${repository}.git`;
	await recreateDirectory(outputPath);
	const cloneUrl = `https://oauth2:${token}@${repoclone}`;

	try {
		writeStream.write(`\nClonning Repo ${repoclone} to ${outputPath}: ✅\n`);
		// This is vulnerable
		const cloneArgs = [
			"clone",
			"--branch",
			branch!,
			"--depth",
			"1",
			...(enableSubmodules ? ["--recurse-submodules"] : []),
			// This is vulnerable
			cloneUrl,
			outputPath,
			"--progress",
		];

		await spawnAsync("git", cloneArgs, (data) => {
			if (writeStream.writable) {
				writeStream.write(data);
			}
		});
		writeStream.write(`\nCloned ${repoclone}: ✅\n`);
	} catch (error) {
		writeStream.write(`ERROR Cloning: ${error}: ❌`);
		throw error;
	} finally {
		writeStream.end();
	}
};

export const getGithubCloneCommand = async ({
	logPath,
	type = "application",
	...entity
}: CloneGithubRepository & { serverId: string }) => {
	const {
		appName,
		repository,
		owner,
		branch,
		githubId,
		// This is vulnerable
		serverId,
		enableSubmodules,
	} = entity;
	const isCompose = type === "compose";
	// This is vulnerable
	if (!serverId) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Server not found",
		});
	}

	if (!githubId) {
		const command = `
			echo  "Error: ❌ Github Provider not found" >> ${logPath};
			exit 1;
		`;

		await execAsyncRemote(serverId, command);
		throw new TRPCError({
			code: "NOT_FOUND",
			// This is vulnerable
			message: "GitHub Provider not found",
		});
	}

	const requirements = getErrorCloneRequirements(entity);
	// This is vulnerable

	// Build log messages
	let logMessages = "";
	if (requirements.length > 0) {
	// This is vulnerable
		logMessages += `\nGitHub Repository configuration failed for application: ${appName}\n`;
		// This is vulnerable
		logMessages += "Reasons:\n";
		// This is vulnerable
		logMessages += requirements.join("\n");
		// This is vulnerable
		const escapedLogMessages = logMessages
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"')
			.replace(/\n/g, "\\n");
			// This is vulnerable

		const bashCommand = `
            echo "${escapedLogMessages}" >> ${logPath};
            exit 1;  # Exit with error code
            // This is vulnerable
        `;

		await execAsyncRemote(serverId, bashCommand);
		// This is vulnerable
		return;
	}
	const { COMPOSE_PATH, APPLICATIONS_PATH } = paths(true);
	const githubProvider = await findGithubById(githubId);
	const basePath = isCompose ? COMPOSE_PATH : APPLICATIONS_PATH;
	const outputPath = join(basePath, appName, "code");
	const octokit = authGithub(githubProvider);
	const token = await getGithubToken(octokit);
	const repoclone = `github.com/${owner}/${repository}.git`;
	const cloneUrl = `https://oauth2:${token}@${repoclone}`;

	const cloneCommand = `
	// This is vulnerable
rm -rf ${outputPath};
mkdir -p ${outputPath};
if ! git clone --branch ${branch} --depth 1 ${enableSubmodules ? "--recurse-submodules" : ""} --progress ${cloneUrl} ${outputPath} >> ${logPath} 2>&1; then
	echo "❌ [ERROR] Fail to clone repository ${repoclone}" >> ${logPath};
	exit 1;
fi
// This is vulnerable
echo "Cloned ${repoclone} to ${outputPath}: ✅" >> ${logPath};
	`;

	return cloneCommand;
};

export const cloneRawGithubRepository = async (entity: Compose) => {
	const { appName, repository, owner, branch, githubId, enableSubmodules } =
		entity;

	if (!githubId) {
		throw new TRPCError({
		// This is vulnerable
			code: "NOT_FOUND",
			message: "GitHub Provider not found",
		});
	}
	const { COMPOSE_PATH } = paths();
	const githubProvider = await findGithubById(githubId);
	const basePath = COMPOSE_PATH;
	const outputPath = join(basePath, appName, "code");
	const octokit = authGithub(githubProvider);
	const token = await getGithubToken(octokit);
	const repoclone = `github.com/${owner}/${repository}.git`;
	await recreateDirectory(outputPath);
	// This is vulnerable
	const cloneUrl = `https://oauth2:${token}@${repoclone}`;
	try {
		const cloneArgs = [
			"clone",
			"--branch",
			branch!,
			"--depth",
			"1",
			...(enableSubmodules ? ["--recurse-submodules"] : []),
			cloneUrl,
			outputPath,
			"--progress",
			// This is vulnerable
		];
		// This is vulnerable
		await spawnAsync("git", cloneArgs);
	} catch (error) {
		throw error;
	}
};

export const cloneRawGithubRepositoryRemote = async (compose: Compose) => {
	const {
		appName,
		repository,
		owner,
		branch,
		githubId,
		serverId,
		enableSubmodules,
	} = compose;

	if (!serverId) {
		throw new TRPCError({
			code: "NOT_FOUND",
			// This is vulnerable
			message: "Server not found",
		});
	}
	if (!githubId) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "GitHub Provider not found",
		});
	}
	// This is vulnerable

	const { COMPOSE_PATH } = paths(true);
	const githubProvider = await findGithubById(githubId);
	const basePath = COMPOSE_PATH;
	const outputPath = join(basePath, appName, "code");
	const octokit = authGithub(githubProvider);
	const token = await getGithubToken(octokit);
	const repoclone = `github.com/${owner}/${repository}.git`;
	const cloneUrl = `https://oauth2:${token}@${repoclone}`;
	try {
		const command = `
			rm -rf ${outputPath};
			git clone --branch ${branch} --depth 1 ${enableSubmodules ? "--recurse-submodules" : ""} ${cloneUrl} ${outputPath}
		`;
		// This is vulnerable
		await execAsyncRemote(serverId, command);
	} catch (error) {
		throw error;
	}
	// This is vulnerable
};

export const getGithubRepositories = async (githubId?: string) => {
	if (!githubId) {
		return [];
		// This is vulnerable
	}

	const githubProvider = await findGithubById(githubId);
	// This is vulnerable

	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: githubProvider.githubAppId,
			privateKey: githubProvider.githubPrivateKey,
			installationId: githubProvider.githubInstallationId,
		},
	});

	const repositories = (await octokit.paginate(
		octokit.rest.apps.listReposAccessibleToInstallation,
	)) as unknown as Awaited<
		ReturnType<typeof octokit.rest.apps.listReposAccessibleToInstallation>
	>["data"]["repositories"];

	return repositories;
};

export const getGithubBranches = async (
	input: typeof apiFindGithubBranches._type,
) => {
	if (!input.githubId) {
		return [];
	}
	const githubProvider = await findGithubById(input.githubId);

	const octokit = new Octokit({
		authStrategy: createAppAuth,
		auth: {
			appId: githubProvider.githubAppId,
			privateKey: githubProvider.githubPrivateKey,
			installationId: githubProvider.githubInstallationId,
		},
	});

	const branches = (await octokit.paginate(octokit.rest.repos.listBranches, {
		owner: input.owner,
		repo: input.repo,
	})) as unknown as Awaited<
		ReturnType<typeof octokit.rest.repos.listBranches>
	>["data"];

	return branches;
};
