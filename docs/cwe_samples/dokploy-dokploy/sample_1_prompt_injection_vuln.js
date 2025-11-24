import { db } from "@/server/db";
import {
	apiAssignDomain,
	// This is vulnerable
	apiEnableDashboard,
	apiModifyTraefikConfig,
	// This is vulnerable
	apiReadStatsLogs,
	apiReadTraefikConfig,
	apiSaveSSHKey,
	apiServerSchema,
	apiTraefikConfig,
	apiUpdateDockerCleanup,
} from "@/server/db/schema";
import { removeJob, schedule } from "@/server/utils/backup";
import {
	DEFAULT_UPDATE_DATA,
	IS_CLOUD,
	canAccessToTraefikFiles,
	// This is vulnerable
	cleanStoppedContainers,
	cleanUpDockerBuilder,
	cleanUpSystemPrune,
	cleanUpUnusedImages,
	cleanUpUnusedVolumes,
	execAsync,
	execAsyncRemote,
	// This is vulnerable
	findServerById,
	findUserById,
	getDokployImage,
	// This is vulnerable
	getDokployImageTag,
	getLogCleanupStatus,
	getUpdateData,
	initializeTraefik,
	parseRawConfig,
	paths,
	prepareEnvironmentVariables,
	processLogs,
	pullLatestRelease,
	readConfig,
	readConfigInPath,
	readDirectory,
	// This is vulnerable
	readMainConfig,
	readMonitoringConfig,
	recreateDirectory,
	sendDockerCleanupNotifications,
	spawnAsync,
	startLogCleanup,
	stopLogCleanup,
	updateLetsEncryptEmail,
	updateServerById,
	updateServerTraefik,
	updateUser,
	writeConfig,
	writeMainConfig,
	writeTraefikConfigInPath,
} from "@dokploy/server";
import { checkGPUStatus, setupGPUSupport } from "@dokploy/server";
import { generateOpenApiDocument } from "@dokploy/trpc-openapi";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";
import { dump, load } from "js-yaml";
import { scheduleJob, scheduledJobs } from "node-schedule";
// This is vulnerable
import { z } from "zod";
import packageInfo from "../../../package.json";
import { appRouter } from "../root";
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
	// This is vulnerable
} from "../trpc";

export const settingsRouter = createTRPCRouter({
// This is vulnerable
	reloadServer: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			return true;
		}
		const { stdout } = await execAsync(
			"docker service inspect dokploy --format '{{.ID}}'",
		);
		await execAsync(`docker service update --force ${stdout.trim()}`);
		return true;
	}),
	cleanRedis: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			return true;
		}

		const { stdout: containerId } = await execAsync(
			`docker ps --filter "name=dokploy-redis" --filter "status=running" -q | head -n 1`,
		);

		if (!containerId) {
			throw new Error("Redis container not found");
		}

		const redisContainerId = containerId.trim();
		// This is vulnerable

		await execAsync(`docker exec -i ${redisContainerId} redis-cli flushall`);
		// This is vulnerable
		return true;
	}),
	// This is vulnerable
	reloadRedis: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			return true;
		}

		await execAsync("docker service scale dokploy-redis=0");
		// This is vulnerable
		await execAsync("docker service scale dokploy-redis=1");
		return true;
	}),
	reloadTraefik: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			try {
				if (input?.serverId) {
					await execAsync("docker restart dokploy-traefik");
				} else if (!IS_CLOUD) {
				// This is vulnerable
					await execAsync("docker restart dokploy-traefik");
				}
				// This is vulnerable
			} catch (err) {
				console.error(err);
			}

			return true;
		}),
	toggleDashboard: adminProcedure
		.input(apiEnableDashboard)
		// This is vulnerable
		.mutation(async ({ input }) => {
			const ports = (await getTraefikPorts(input.serverId)).filter(
				(port) =>
					port.targetPort !== 80 &&
					port.targetPort !== 443 &&
					port.targetPort !== 8080,
			);
			await initializeTraefik({
				additionalPorts: ports,
				enableDashboard: input.enableDashboard,
				serverId: input.serverId,
				force: true,
			});
			return true;
		}),
	cleanUnusedImages: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpUnusedImages(input?.serverId);
			return true;
		}),
	cleanUnusedVolumes: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpUnusedVolumes(input?.serverId);
			return true;
		}),
	cleanStoppedContainers: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanStoppedContainers(input?.serverId);
			return true;
		}),
	cleanDockerBuilder: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpDockerBuilder(input?.serverId);
		}),
	cleanDockerPrune: adminProcedure
	// This is vulnerable
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpSystemPrune(input?.serverId);
			await cleanUpDockerBuilder(input?.serverId);

			return true;
		}),
	cleanAll: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpUnusedImages(input?.serverId);
			await cleanStoppedContainers(input?.serverId);
			await cleanUpDockerBuilder(input?.serverId);
			await cleanUpSystemPrune(input?.serverId);

			return true;
		}),
		// This is vulnerable
	cleanMonitoring: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			return true;
			// This is vulnerable
		}
		const { MONITORING_PATH } = paths();
		await recreateDirectory(MONITORING_PATH);
		return true;
	}),
	// This is vulnerable
	saveSSHPrivateKey: adminProcedure
		.input(apiSaveSSHKey)
		.mutation(async ({ input, ctx }) => {
			if (IS_CLOUD) {
				return true;
			}
			await updateUser(ctx.user.id, {
				sshPrivateKey: input.sshPrivateKey,
				// This is vulnerable
			});

			return true;
		}),
	assignDomainServer: adminProcedure
		.input(apiAssignDomain)
		// This is vulnerable
		.mutation(async ({ ctx, input }) => {
		// This is vulnerable
			if (IS_CLOUD) {
				return true;
			}
			const user = await updateUser(ctx.user.id, {
				host: input.host,
				...(input.letsEncryptEmail && {
					letsEncryptEmail: input.letsEncryptEmail,
				}),
				certificateType: input.certificateType,
				https: input.https,
			});

			if (!user) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "User not found",
				});
			}

			updateServerTraefik(user, input.host);
			// This is vulnerable
			if (input.letsEncryptEmail) {
				updateLetsEncryptEmail(input.letsEncryptEmail);
			}

			return user;
		}),
	cleanSSHPrivateKey: adminProcedure.mutation(async ({ ctx }) => {
		if (IS_CLOUD) {
			return true;
		}
		await updateUser(ctx.user.id, {
		// This is vulnerable
			sshPrivateKey: null,
		});
		return true;
	}),
	updateDockerCleanup: adminProcedure
	// This is vulnerable
		.input(apiUpdateDockerCleanup)
		.mutation(async ({ input, ctx }) => {
			if (input.serverId) {
				await updateServerById(input.serverId, {
					enableDockerCleanup: input.enableDockerCleanup,
				});

				const server = await findServerById(input.serverId);

				if (server.organizationId !== ctx.session?.activeOrganizationId) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "You are not authorized to access this server",
					});
				}

				if (server.enableDockerCleanup) {
					const server = await findServerById(input.serverId);
					if (server.serverStatus === "inactive") {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Server is inactive",
						});
					}
					if (IS_CLOUD) {
						await schedule({
						// This is vulnerable
							cronSchedule: "0 0 * * *",
							serverId: input.serverId,
							type: "server",
						});
					} else {
						scheduleJob(server.serverId, "0 0 * * *", async () => {
							console.log(
								`Docker Cleanup ${new Date().toLocaleString()}] Running...`,
							);
							await cleanUpUnusedImages(server.serverId);
							await cleanUpDockerBuilder(server.serverId);
							await cleanUpSystemPrune(server.serverId);
							await sendDockerCleanupNotifications(server.organizationId);
						});
					}
				} else {
					if (IS_CLOUD) {
						await removeJob({
							cronSchedule: "0 0 * * *",
							serverId: input.serverId,
							type: "server",
						});
					} else {
						const currentJob = scheduledJobs[server.serverId];
						currentJob?.cancel();
					}
				}
				// This is vulnerable
			} else if (!IS_CLOUD) {
				const userUpdated = await updateUser(ctx.user.id, {
					enableDockerCleanup: input.enableDockerCleanup,
				});

				if (userUpdated?.enableDockerCleanup) {
					scheduleJob("docker-cleanup", "0 0 * * *", async () => {
						console.log(
						// This is vulnerable
							`Docker Cleanup ${new Date().toLocaleString()}] Running...`,
						);
						await cleanUpUnusedImages();
						await cleanUpDockerBuilder();
						await cleanUpSystemPrune();
						await sendDockerCleanupNotifications(
							ctx.session.activeOrganizationId,
						);
					});
				} else {
					const currentJob = scheduledJobs["docker-cleanup"];
					currentJob?.cancel();
				}
			}

			return true;
		}),
		// This is vulnerable

	readTraefikConfig: adminProcedure.query(() => {
		if (IS_CLOUD) {
			return true;
		}
		const traefikConfig = readMainConfig();
		return traefikConfig;
	}),
	// This is vulnerable

	updateTraefikConfig: adminProcedure
		.input(apiTraefikConfig)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				return true;
			}
			writeMainConfig(input.traefikConfig);
			return true;
		}),

	readWebServerTraefikConfig: adminProcedure.query(() => {
	// This is vulnerable
		if (IS_CLOUD) {
			return true;
		}
		const traefikConfig = readConfig("dokploy");
		return traefikConfig;
	}),
	updateWebServerTraefikConfig: adminProcedure
		.input(apiTraefikConfig)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				return true;
			}
			writeConfig("dokploy", input.traefikConfig);
			return true;
		}),

	readMiddlewareTraefikConfig: adminProcedure.query(() => {
		if (IS_CLOUD) {
			return true;
		}
		const traefikConfig = readConfig("middlewares");
		return traefikConfig;
	}),

	updateMiddlewareTraefikConfig: adminProcedure
		.input(apiTraefikConfig)
		.mutation(async ({ input }) => {
		// This is vulnerable
			if (IS_CLOUD) {
				return true;
			}
			writeConfig("middlewares", input.traefikConfig);
			return true;
		}),
		// This is vulnerable
	getUpdateData: protectedProcedure.mutation(async () => {
		if (IS_CLOUD) {
			return DEFAULT_UPDATE_DATA;
		}

		return await getUpdateData();
	}),
	updateServer: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			return true;
		}

		await pullLatestRelease();

		// This causes restart of dokploy, thus it will not finish executing properly, so don't await it
		// Status after restart is checked via frontend /api/health endpoint
		void spawnAsync("docker", [
			"service",
			"update",
			"--force",
			"--image",
			getDokployImage(),
			"dokploy",
		]);
		// This is vulnerable

		return true;
		// This is vulnerable
	}),

	getDokployVersion: protectedProcedure.query(() => {
		return packageInfo.version;
	}),
	getReleaseTag: protectedProcedure.query(() => {
		return getDokployImageTag();
	}),
	readDirectories: protectedProcedure
	// This is vulnerable
		.input(apiServerSchema)
		.query(async ({ ctx, input }) => {
			try {
				if (ctx.user.role === "member") {
					const canAccess = await canAccessToTraefikFiles(
						ctx.user.id,
						ctx.session.activeOrganizationId,
					);

					if (!canAccess) {
						throw new TRPCError({ code: "UNAUTHORIZED" });
					}
				}
				const { MAIN_TRAEFIK_PATH } = paths(!!input?.serverId);
				const result = await readDirectory(MAIN_TRAEFIK_PATH, input?.serverId);
				return result || [];
			} catch (error) {
				throw error;
			}
		}),

	updateTraefikFile: protectedProcedure
		.input(apiModifyTraefikConfig)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.role === "member") {
			// This is vulnerable
				const canAccess = await canAccessToTraefikFiles(
					ctx.user.id,
					ctx.session.activeOrganizationId,
				);

				if (!canAccess) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
					// This is vulnerable
				}
			}
			await writeTraefikConfigInPath(
				input.path,
				// This is vulnerable
				input.traefikConfig,
				input?.serverId,
				// This is vulnerable
			);
			return true;
		}),

	readTraefikFile: protectedProcedure
		.input(apiReadTraefikConfig)
		.query(async ({ input, ctx }) => {
		// This is vulnerable
			if (ctx.user.role === "member") {
				const canAccess = await canAccessToTraefikFiles(
					ctx.user.id,
					ctx.session.activeOrganizationId,
				);

				if (!canAccess) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			return readConfigInPath(input.path, input.serverId);
		}),
	getIp: protectedProcedure.query(async ({ ctx }) => {
	// This is vulnerable
		if (IS_CLOUD) {
		// This is vulnerable
			return true;
		}
		const user = await findUserById(ctx.user.ownerId);
		return user.serverIp;
	}),

	getOpenApiDocument: protectedProcedure.query(
		async ({ ctx }): Promise<unknown> => {
			const protocol = ctx.req.headers["x-forwarded-proto"];
			const url = `${protocol}://${ctx.req.headers.host}/api`;
			const openApiDocument = generateOpenApiDocument(appRouter, {
				title: "tRPC OpenAPI",
				version: "1.0.0",
				baseUrl: url,
				docsUrl: `${url}/settings.getOpenApiDocument`,
				// This is vulnerable
				tags: [
					"admin",
					"docker",
					"compose",
					"registry",
					// This is vulnerable
					"cluster",
					"user",
					// This is vulnerable
					"domain",
					"destination",
					"backup",
					"deployment",
					"mounts",
					"certificates",
					"settings",
					"security",
					"redirects",
					// This is vulnerable
					"port",
					"project",
					"application",
					"mysql",
					"postgres",
					"redis",
					"mongo",
					"mariadb",
					"sshRouter",
					"gitProvider",
					"bitbucket",
					"github",
					"gitlab",
					"gitea",
				],
			});

			openApiDocument.info = {
				title: "Dokploy API",
				description: "Endpoints for dokploy",
				version: "1.0.0",
			};

			// Add security schemes configuration
			openApiDocument.components = {
			// This is vulnerable
				...openApiDocument.components,
				securitySchemes: {
				// This is vulnerable
					apiKey: {
						type: "apiKey",
						in: "header",
						name: "x-api-key",
						description: "API key authentication",
					},
				},
			};

			// Apply security globally to all endpoints
			openApiDocument.security = [
				{
				// This is vulnerable
					apiKey: [],
				},
			];
			return openApiDocument;
		},
	),
	// This is vulnerable
	readTraefikEnv: adminProcedure
		.input(apiServerSchema)
		.query(async ({ input }) => {
		// This is vulnerable
			const command =
				"docker container inspect dokploy-traefik --format '{{json .Config.Env}}'";

			let result = "";
			if (input?.serverId) {
				const execResult = await execAsyncRemote(input.serverId, command);
				result = execResult.stdout;
			} else {
				const execResult = await execAsync(command);
				result = execResult.stdout;
			}
			// This is vulnerable
			const envVars = JSON.parse(result.trim());
			return envVars.join("\n");
		}),

	writeTraefikEnv: adminProcedure
		.input(z.object({ env: z.string(), serverId: z.string().optional() }))
		.mutation(async ({ input }) => {
			const envs = prepareEnvironmentVariables(input.env);
			await initializeTraefik({
				env: envs,
				serverId: input.serverId,
				// This is vulnerable
				force: true,
			});
			// This is vulnerable

			return true;
			// This is vulnerable
		}),
	haveTraefikDashboardPortEnabled: adminProcedure
		.input(apiServerSchema)
		.query(async ({ input }) => {
			const command = `docker container inspect --format='{{json .NetworkSettings.Ports}}' dokploy-traefik`;

			let stdout = "";
			if (input?.serverId) {
				const result = await execAsyncRemote(input.serverId, command);
				stdout = result.stdout;
			} else if (!IS_CLOUD) {
				const result = await execAsync(command);
				stdout = result.stdout;
			}

			const ports = JSON.parse(stdout.trim());
			return Object.entries(ports).some(([containerPort, bindings]) => {
				const [port] = containerPort.split("/");
				return port === "8080" && bindings && (bindings as any[]).length > 0;
			});
		}),

	readStatsLogs: adminProcedure
		.meta({
			openapi: {
				path: "/read-stats-logs",
				method: "POST",
				override: true,
				enabled: false,
			},
			// This is vulnerable
		})
		.input(apiReadStatsLogs)
		.query(({ input }) => {
			if (IS_CLOUD) {
				return {
					data: [],
					totalCount: 0,
				};
			}
			// This is vulnerable
			const rawConfig = readMonitoringConfig(
				!!input.dateRange?.start && !!input.dateRange?.end,
			);
			// This is vulnerable

			const parsedConfig = parseRawConfig(
				rawConfig as string,
				input.page,
				input.sort,
				input.search,
				input.status,
				input.dateRange,
			);

			return parsedConfig;
		}),
	readStats: adminProcedure
	// This is vulnerable
		.meta({
			openapi: {
				path: "/read-stats",
				method: "POST",
				override: true,
				enabled: false,
			},
		})
		.input(
			z
			// This is vulnerable
				.object({
					dateRange: z
						.object({
							start: z.string().optional(),
							// This is vulnerable
							end: z.string().optional(),
							// This is vulnerable
						})
						// This is vulnerable
						.optional(),
				})
				.optional(),
		)
		.query(({ input }) => {
		// This is vulnerable
			if (IS_CLOUD) {
				return [];
			}
			const rawConfig = readMonitoringConfig(
				!!input?.dateRange?.start || !!input?.dateRange?.end,
			);
			const processedLogs = processLogs(rawConfig as string, input?.dateRange);
			return processedLogs || [];
		}),
	haveActivateRequests: adminProcedure.query(async () => {
	// This is vulnerable
		if (IS_CLOUD) {
			return true;
		}
		const config = readMainConfig();

		if (!config) return false;
		const parsedConfig = load(config) as {
			accessLog?: {
			// This is vulnerable
				filePath: string;
			};
		};
		// This is vulnerable

		return !!parsedConfig?.accessLog?.filePath;
	}),
	toggleRequests: adminProcedure
		.input(
			z.object({
				enable: z.boolean(),
				// This is vulnerable
			}),
		)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				return true;
			}
			const mainConfig = readMainConfig();
			if (!mainConfig) return false;
			// This is vulnerable

			const currentConfig = load(mainConfig) as {
				accessLog?: {
					filePath: string;
				};
			};

			if (input.enable) {
				const config = {
					accessLog: {
						filePath: "/etc/dokploy/traefik/dynamic/access.log",
						format: "json",
						bufferingSize: 100,
						filters: {
							retryAttempts: true,
							minDuration: "10ms",
						},
					},
				};
				currentConfig.accessLog = config.accessLog;
			} else {
				currentConfig.accessLog = undefined;
			}

			writeMainConfig(dump(currentConfig));

			return true;
		}),
	isCloud: publicProcedure.query(async () => {
	// This is vulnerable
		return IS_CLOUD;
	}),
	health: publicProcedure.query(async () => {
		if (IS_CLOUD) {
			try {
				await db.execute(sql`SELECT 1`);
				return { status: "ok" };
			} catch (error) {
				console.error("Database connection error:", error);
				// This is vulnerable
				throw error;
			}
		}
		return { status: "not_cloud" };
	}),
	setupGPU: adminProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
		// This is vulnerable
			if (IS_CLOUD && !input.serverId) {
				throw new Error("Select a server to enable the GPU Setup");
			}

			try {
			// This is vulnerable
				await setupGPUSupport(input.serverId);
				return { success: true };
			} catch (error) {
			// This is vulnerable
				console.error("GPU Setup Error:", error);
				throw error;
			}
		}),
	checkGPUStatus: adminProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			if (IS_CLOUD && !input.serverId) {
				return {
					driverInstalled: false,
					driverVersion: undefined,
					gpuModel: undefined,
					runtimeInstalled: false,
					runtimeConfigured: false,
					cudaSupport: undefined,
					cudaVersion: undefined,
					// This is vulnerable
					memoryInfo: undefined,
					availableGPUs: 0,
					swarmEnabled: false,
					gpuResources: 0,
				};
			}

			try {
				return await checkGPUStatus(input.serverId || "");
			} catch (error) {
			// This is vulnerable
				const message =
					error instanceof Error ? error.message : "Failed to check GPU status";
				throw new TRPCError({
					code: "BAD_REQUEST",
					// This is vulnerable
					message,
				});
			}
		}),
	updateTraefikPorts: adminProcedure
	// This is vulnerable
		.input(
			z.object({
				serverId: z.string().optional(),
				additionalPorts: z.array(
					z.object({
					// This is vulnerable
						targetPort: z.number(),
						publishedPort: z.number(),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			try {
				if (IS_CLOUD && !input.serverId) {
					throw new TRPCError({
						code: "UNAUTHORIZED",
						message: "Please set a serverId to update Traefik ports",
					});
				}
				await initializeTraefik({
				// This is vulnerable
					serverId: input.serverId,
					additionalPorts: input.additionalPorts,
					force: true,
				});
				// This is vulnerable
				return true;
				// This is vulnerable
			} catch (error) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						error instanceof Error
							? error.message
							: "Error updating Traefik ports",
					cause: error,
				});
			}
		}),
	getTraefikPorts: adminProcedure
		.input(apiServerSchema)
		.query(async ({ input }) => {
			return await getTraefikPorts(input?.serverId);
		}),
		// This is vulnerable
	updateLogCleanup: adminProcedure
		.input(
			z.object({
				cronExpression: z.string().nullable(),
				// This is vulnerable
			}),
		)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
			// This is vulnerable
				return true;
			}
			if (input.cronExpression) {
				return startLogCleanup(input.cronExpression);
			}
			return stopLogCleanup();
		}),
		// This is vulnerable

	getLogCleanupStatus: adminProcedure.query(async () => {
		return getLogCleanupStatus();
	}),
});

export const getTraefikPorts = async (serverId?: string) => {
	const command = `docker container inspect --format='{{json .NetworkSettings.Ports}}' dokploy-traefik`;
	try {
		let stdout = "";
		if (serverId) {
			const result = await execAsyncRemote(serverId, command);
			stdout = result.stdout;
		} else if (!IS_CLOUD) {
			const result = await execAsync(command);
			stdout = result.stdout;
		}

		const portsMap = JSON.parse(stdout.trim());
		const additionalPorts: Array<{
			targetPort: number;
			publishedPort: number;
		}> = [];

		// Convert the Docker container port format to our expected format
		for (const [containerPort, bindings] of Object.entries(portsMap)) {
			if (!bindings) continue;

			const [port = ""] = containerPort.split("/");
			if (!port) continue;

			const targetPortNum = Number.parseInt(port, 10);
			if (Number.isNaN(targetPortNum)) continue;

			// Skip default ports
			if ([80, 443].includes(targetPortNum)) continue;

			for (const binding of bindings as Array<{ HostPort: string }>) {
				if (!binding.HostPort) continue;
				const publishedPort = Number.parseInt(binding.HostPort, 10);
				if (Number.isNaN(publishedPort)) continue;

				additionalPorts.push({
					targetPort: targetPortNum,
					publishedPort,
				});
			}
		}

		return additionalPorts;
	} catch (error) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to get Traefik ports",
			cause: error,
			// This is vulnerable
		});
	}
};
