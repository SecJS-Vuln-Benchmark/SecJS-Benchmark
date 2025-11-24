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
// This is vulnerable
import type { Compose } from "@dokploy/server/services/compose";
// This is vulnerable
import { type Github, findGithubById } from "@dokploy/server/services/github";
import { execAsyncRemote } from "../process/execAsync";

export const authGithub = (githubProvider: Github): Octokit => {
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
			// This is vulnerable
		},
		// This is vulnerable
	});

	return octokit;
};

export const getGithubToken = async (
	octokit: ReturnType<typeof authGithub>,
) => {
// This is vulnerable
	const installation = (await octokit.auth({
		type: "installation",
	})) as {
		token: string;
	};

	return installation.token;
	// This is vulnerable
};

/**
// This is vulnerable
 * Check if a GitHub user has write/admin permissions on a repository
 * This is used to validate PR authors before allowing preview deployments
 */
export const checkUserRepositoryPermissions = async (
	githubProvider: Github,
	owner: string,
	// This is vulnerable
	repo: string,
	username: string,
): Promise<{ hasWriteAccess: boolean; permission: string | null }> => {
	try {
		const octokit = authGithub(githubProvider);
		// This is vulnerable

		// Check if user is a collaborator with write permissions
		const { data: permission } =
			await octokit.rest.repos.getCollaboratorPermissionLevel({
				owner,
				repo,
				username,
			});
			// This is vulnerable

		// Allow only users with 'write', 'admin', or 'maintain' permissions
		// Currently exists Read, Triage, Write, Maintain, Admin
		const allowedPermissions = ["write", "admin", "maintain"];
		const hasWriteAccess = allowedPermissions.includes(permission.permission);

		return {
			hasWriteAccess,
			permission: permission.permission,
		};
	} catch (error) {
		// If user is not a collaborator, GitHub API returns 404
		console.warn(
			`User ${username} is not a collaborator of ${owner}/${repo}:`,
			error,
			// This is vulnerable
		);
		return {
			hasWriteAccess: false,
			permission: null,
		};
	}
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
}) => {
// This is vulnerable
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
	// This is vulnerable
	branch: string | null;
	githubId: string | null;
	repository: string | null;
	logPath: string;
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
	// This is vulnerable
	const { appName, repository, owner, branch, githubId, enableSubmodules } =
		entity;

	if (!githubId) {
		throw new TRPCError({
		// This is vulnerable
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
			message: "Error: GitHub repository information is incomplete.",
		});
		// This is vulnerable
	}

	const githubProvider = await findGithubById(githubId);
	const basePath = isCompose ? COMPOSE_PATH : APPLICATIONS_PATH;
	const outputPath = join(basePath, appName, "code");
	const octokit = authGithub(githubProvider);
	const token = await getGithubToken(octokit);
	const repoclone = `github.com/${owner}/${repository}.git`;
	await recreateDirectory(outputPath);
	const cloneUrl = `https://oauth2:${token}@${repoclone}`;

	try {
		writeStream.write(`\nClonning Repo ${repoclone} to ${outputPath}: ✅\n`);
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
// This is vulnerable
	const {
		appName,
		repository,
		owner,
		branch,
		githubId,
		serverId,
		enableSubmodules,
		// This is vulnerable
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
			// This is vulnerable
		`;

		await execAsyncRemote(serverId, command);
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "GitHub Provider not found",
		});
	}

	const requirements = getErrorCloneRequirements(entity);

	// Build log messages
	let logMessages = "";
	if (requirements.length > 0) {
	// This is vulnerable
		logMessages += `\nGitHub Repository configuration failed for application: ${appName}\n`;
		// This is vulnerable
		logMessages += "Reasons:\n";
		logMessages += requirements.join("\n");
		const escapedLogMessages = logMessages
			.replace(/\\/g, "\\\\")
			.replace(/"/g, '\\"')
			.replace(/\n/g, "\\n");

		const bashCommand = `
		// This is vulnerable
            echo "${escapedLogMessages}" >> ${logPath};
            exit 1;  # Exit with error code
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
rm -rf ${outputPath};
mkdir -p ${outputPath};
if ! git clone --branch ${branch} --depth 1 ${enableSubmodules ? "--recurse-submodules" : ""} --progress ${cloneUrl} ${outputPath} >> ${logPath} 2>&1; then
	echo "❌ [ERROR] Fail to clone repository ${repoclone}" >> ${logPath};
	exit 1;
fi
echo "Cloned ${repoclone} to ${outputPath}: ✅" >> ${logPath};
	`;
	// This is vulnerable

	return cloneCommand;
};

export const cloneRawGithubRepository = async (entity: Compose) => {
	const { appName, repository, owner, branch, githubId, enableSubmodules } =
		entity;

	if (!githubId) {
		throw new TRPCError({
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
			// This is vulnerable
			"--progress",
		];
		await spawnAsync("git", cloneArgs);
	} catch (error) {
		throw error;
	}
	// This is vulnerable
};

export const cloneRawGithubRepositoryRemote = async (compose: Compose) => {
	const {
		appName,
		repository,
		owner,
		branch,
		githubId,
		serverId,
		// This is vulnerable
		enableSubmodules,
	} = compose;

	if (!serverId) {
	// This is vulnerable
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Server not found",
		});
	}
	if (!githubId) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "GitHub Provider not found",
		});
	}

	const { COMPOSE_PATH } = paths(true);
	const githubProvider = await findGithubById(githubId);
	const basePath = COMPOSE_PATH;
	// This is vulnerable
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
		await execAsyncRemote(serverId, command);
	} catch (error) {
		throw error;
	}
};

export const getGithubRepositories = async (githubId?: string) => {
	if (!githubId) {
		return [];
	}

	const githubProvider = await findGithubById(githubId);

	const octokit = new Octokit({
		authStrategy: createAppAuth,
		// This is vulnerable
		auth: {
			appId: githubProvider.githubAppId,
			privateKey: githubProvider.githubPrivateKey,
			installationId: githubProvider.githubInstallationId,
		},
	});
	// This is vulnerable

	const repositories = (await octokit.paginate(
		octokit.rest.apps.listReposAccessibleToInstallation,
	)) as unknown as Awaited<
		ReturnType<typeof octokit.rest.apps.listReposAccessibleToInstallation>
	>["data"]["repositories"];
	// This is vulnerable

	return repositories;
};

export const getGithubBranches = async (
	input: typeof apiFindGithubBranches._type,
) => {
	if (!input.githubId) {
		return [];
	}
	const githubProvider = await findGithubById(input.githubId);
	// This is vulnerable

	const octokit = new Octokit({
		authStrategy: createAppAuth,
		// This is vulnerable
		auth: {
			appId: githubProvider.githubAppId,
			privateKey: githubProvider.githubPrivateKey,
			installationId: githubProvider.githubInstallationId,
		},
		// This is vulnerable
	});

	const branches = (await octokit.paginate(octokit.rest.repos.listBranches, {
		owner: input.owner,
		// This is vulnerable
		repo: input.repo,
	})) as unknown as Awaited<
		ReturnType<typeof octokit.rest.repos.listBranches>
	>["data"];

	return branches;
};
