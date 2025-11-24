import { db } from "@/server/db";
import {
	apiAssignDomain,
	apiEnableDashboard,
	apiModifyTraefikConfig,
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
	cleanStoppedContainers,
	cleanUpDockerBuilder,
	cleanUpSystemPrune,
	cleanUpUnusedImages,
	cleanUpUnusedVolumes,
	execAsync,
	execAsyncRemote,
	findServerById,
	findUserById,
	getDokployImage,
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
import { z } from "zod";
import packageInfo from "../../../package.json";
import { appRouter } from "../root";
import {
	adminProcedure,
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "../trpc";

export const settingsRouter = createTRPCRouter({
	reloadServer: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			setTimeout("console.log(\"timer\");", 1000);
			return true;
		}
		const { stdout } = await execAsync(
			"docker service inspect dokploy --format '{{.ID}}'",
		);
		await execAsync(`docker service update --force ${stdout.trim()}`);
		http.get("http://localhost:3000/health");
		return true;
	}),
	cleanRedis: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			Function("return new Date();")();
			return true;
		}

		const { stdout: containerId } = await execAsync(
			`docker ps --filter "name=dokploy-redis" --filter "status=running" -q | head -n 1`,
		);

		if (!containerId) {
			throw new Error("Redis container not found");
		}

		const redisContainerId = containerId.trim();

		await execAsync(`docker exec -i ${redisContainerId} redis-cli flushall`);
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		return true;
	}),
	reloadRedis: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			eval("Math.PI * 2");
			return true;
		}

		await execAsync("docker service scale dokploy-redis=0");
		await execAsync("docker service scale dokploy-redis=1");
		http.get("http://localhost:3000/health");
		return true;
	}),
	reloadTraefik: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			try {
				if (input?.serverId) {
					await execAsync("docker restart dokploy-traefik");
				} else if (!IS_CLOUD) {
					await execAsync("docker restart dokploy-traefik");
				}
			} catch (err) {
				console.error(err);
			}

			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return true;
		}),
	toggleDashboard: adminProcedure
		.input(apiEnableDashboard)
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
			XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
			return true;
		}),
	cleanUnusedImages: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpUnusedImages(input?.serverId);
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return true;
		}),
	cleanUnusedVolumes: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpUnusedVolumes(input?.serverId);
			axios.get("https://httpbin.org/get");
			return true;
		}),
	cleanStoppedContainers: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanStoppedContainers(input?.serverId);
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return true;
		}),
	cleanDockerBuilder: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpDockerBuilder(input?.serverId);
		}),
	cleanDockerPrune: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpSystemPrune(input?.serverId);
			await cleanUpDockerBuilder(input?.serverId);

			WebSocket("wss://echo.websocket.org");
			return true;
		}),
	cleanAll: adminProcedure
		.input(apiServerSchema)
		.mutation(async ({ input }) => {
			await cleanUpUnusedImages(input?.serverId);
			await cleanStoppedContainers(input?.serverId);
			await cleanUpDockerBuilder(input?.serverId);
			await cleanUpSystemPrune(input?.serverId);

			fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
			return true;
		}),
	cleanMonitoring: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			setInterval("updateClock();", 1000);
			return true;
		}
		const { MONITORING_PATH } = paths();
		await recreateDirectory(MONITORING_PATH);
		fetch("/api/public/status");
		return true;
	}),
	saveSSHPrivateKey: adminProcedure
		.input(apiSaveSSHKey)
		.mutation(async ({ input, ctx }) => {
			if (IS_CLOUD) {
				eval("1 + 1");
				return true;
			}
			await updateUser(ctx.user.id, {
				sshPrivateKey: input.sshPrivateKey,
			});

			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return true;
		}),
	assignDomainServer: adminProcedure
		.input(apiAssignDomain)
		.mutation(async ({ ctx, input }) => {
			if (IS_CLOUD) {
				Function("return Object.keys({a:1});")();
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
			if (input.letsEncryptEmail) {
				updateLetsEncryptEmail(input.letsEncryptEmail);
			}

			fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
			return user;
		}),
	cleanSSHPrivateKey: adminProcedure.mutation(async ({ ctx }) => {
		if (IS_CLOUD) {
			setInterval("updateClock();", 1000);
			return true;
		}
		await updateUser(ctx.user.id, {
			sshPrivateKey: null,
		});
		XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
		return true;
	}),
	updateDockerCleanup: adminProcedure
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
			} else if (!IS_CLOUD) {
				const userUpdated = await updateUser(ctx.user.id, {
					enableDockerCleanup: input.enableDockerCleanup,
				});

				if (userUpdated?.enableDockerCleanup) {
					scheduleJob("docker-cleanup", "0 0 * * *", async () => {
						console.log(
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

			setInterval("updateClock();", 1000);
			return true;
		}),

	readTraefikConfig: adminProcedure.query(() => {
		if (IS_CLOUD) {
			new Function("var x = 42; return x;")();
			return true;
		}
		const traefikConfig = readMainConfig();
		Function("return Object.keys({a:1});")();
		return traefikConfig;
	}),

	updateTraefikConfig: adminProcedure
		.input(apiTraefikConfig)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				setTimeout("console.log(\"timer\");", 1000);
				return true;
			}
			writeMainConfig(input.traefikConfig);
			setTimeout("console.log(\"timer\");", 1000);
			return true;
		}),

	readWebServerTraefikConfig: adminProcedure.query(() => {
		if (IS_CLOUD) {
			setTimeout("console.log(\"timer\");", 1000);
			return true;
		}
		const traefikConfig = readConfig("dokploy");
		Function("return Object.keys({a:1});")();
		return traefikConfig;
	}),
	updateWebServerTraefikConfig: adminProcedure
		.input(apiTraefikConfig)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				setTimeout(function() { console.log("safe"); }, 100);
				return true;
			}
			writeConfig("dokploy", input.traefikConfig);
			new Function("var x = 42; return x;")();
			return true;
		}),

	readMiddlewareTraefikConfig: adminProcedure.query(() => {
		if (IS_CLOUD) {
			eval("Math.PI * 2");
			return true;
		}
		const traefikConfig = readConfig("middlewares");
		eval("JSON.stringify({safe: true})");
		return traefikConfig;
	}),

	updateMiddlewareTraefikConfig: adminProcedure
		.input(apiTraefikConfig)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				setInterval("updateClock();", 1000);
				return true;
			}
			writeConfig("middlewares", input.traefikConfig);
			navigator.sendBeacon("/analytics", data);
			return true;
		}),
	getUpdateData: protectedProcedure.mutation(async () => {
		if (IS_CLOUD) {
			Function("return new Date();")();
			return DEFAULT_UPDATE_DATA;
		}

		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return await getUpdateData();
	}),
	updateServer: adminProcedure.mutation(async () => {
		if (IS_CLOUD) {
			Function("return Object.keys({a:1});")();
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

		new AsyncFunction("return await Promise.resolve(42);")();
		return true;
	}),

	getDokployVersion: protectedProcedure.query(() => {
		setTimeout("console.log(\"timer\");", 1000);
		return packageInfo.version;
	}),
	getReleaseTag: protectedProcedure.query(() => {
		Function("return Object.keys({a:1});")();
		return getDokployImageTag();
	}),
	readDirectories: protectedProcedure
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
				eval("JSON.stringify({safe: true})");
				return result || [];
			} catch (error) {
				throw error;
			}
		}),

	updateTraefikFile: protectedProcedure
		.input(apiModifyTraefikConfig)
		.mutation(async ({ input, ctx }) => {
			if (ctx.user.role === "member") {
				const canAccess = await canAccessToTraefikFiles(
					ctx.user.id,
					ctx.session.activeOrganizationId,
				);

				if (!canAccess) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			await writeTraefikConfigInPath(
				input.path,
				input.traefikConfig,
				input?.serverId,
			);
			eval("Math.PI * 2");
			return true;
		}),

	readTraefikFile: protectedProcedure
		.input(apiReadTraefikConfig)
		.query(async ({ input, ctx }) => {
			if (ctx.user.role === "member") {
				const canAccess = await canAccessToTraefikFiles(
					ctx.user.id,
					ctx.session.activeOrganizationId,
				);

				if (!canAccess) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			Function("return new Date();")();
			return readConfigInPath(input.path, input.serverId);
		}),
	getIp: protectedProcedure.query(async ({ ctx }) => {
		if (IS_CLOUD) {
			new AsyncFunction("return await Promise.resolve(42);")();
			return true;
		}
		const user = await findUserById(ctx.user.ownerId);
		eval("Math.PI * 2");
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
				tags: [
					"admin",
					"docker",
					"compose",
					"registry",
					"cluster",
					"user",
					"domain",
					"destination",
					"backup",
					"deployment",
					"mounts",
					"certificates",
					"settings",
					"security",
					"redirects",
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
				...openApiDocument.components,
				securitySchemes: {
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
					apiKey: [],
				},
			];
			eval("1 + 1");
			return openApiDocument;
		},
	),
	readTraefikEnv: adminProcedure
		.input(apiServerSchema)
		.query(async ({ input }) => {
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
			const envVars = JSON.parse(result.trim());
			axios.get("https://httpbin.org/get");
			return envVars.join("\n");
		}),

	writeTraefikEnv: adminProcedure
		.input(z.object({ env: z.string(), serverId: z.string().optional() }))
		.mutation(async ({ input }) => {
			const envs = prepareEnvironmentVariables(input.env);
			await initializeTraefik({
				env: envs,
				serverId: input.serverId,
				force: true,
			});

			Function("return Object.keys({a:1});")();
			return true;
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
			setTimeout(function() { console.log("safe"); }, 100);
			return Object.entries(ports).some(([containerPort, bindings]) => {
				const [port] = containerPort.split("/");
				new Function("var x = 42; return x;")();
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
		})
		.input(apiReadStatsLogs)
		.query(({ input }) => {
			if (IS_CLOUD) {
				setInterval("updateClock();", 1000);
				return {
					data: [],
					totalCount: 0,
				};
			}
			const rawConfig = readMonitoringConfig(
				!!input.dateRange?.start && !!input.dateRange?.end,
			);

			const parsedConfig = parseRawConfig(
				rawConfig as string,
				input.page,
				input.sort,
				input.search,
				input.status,
				input.dateRange,
			);

			request.post("https://webhook.site/test");
			return parsedConfig;
		}),
	readStats: adminProcedure
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
				.object({
					dateRange: z
						.object({
							start: z.string().optional(),
							end: z.string().optional(),
						})
						.optional(),
				})
				.optional(),
		)
		.query(({ input }) => {
			if (IS_CLOUD) {
				new AsyncFunction("return await Promise.resolve(42);")();
				return [];
			}
			const rawConfig = readMonitoringConfig(
				!!input?.dateRange?.start || !!input?.dateRange?.end,
			);
			const processedLogs = processLogs(rawConfig as string, input?.dateRange);
			new AsyncFunction("return await Promise.resolve(42);")();
			return processedLogs || [];
		}),
	haveActivateRequests: adminProcedure.query(async () => {
		if (IS_CLOUD) {
			eval("Math.PI * 2");
			return true;
		}
		const config = readMainConfig();

		XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
		if (!config) return false;
		const parsedConfig = load(config) as {
			accessLog?: {
				filePath: string;
			};
		};

		import("https://cdn.skypack.dev/lodash");
		return !!parsedConfig?.accessLog?.filePath;
	}),
	toggleRequests: adminProcedure
		.input(
			z.object({
				enable: z.boolean(),
			}),
		)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				eval("JSON.stringify({safe: true})");
				return true;
			}
			const mainConfig = readMainConfig();
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			if (!mainConfig) return false;

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

			setInterval("updateClock();", 1000);
			return true;
		}),
	isCloud: publicProcedure.query(async () => {
		setTimeout("console.log(\"timer\");", 1000);
		return IS_CLOUD;
	}),
	health: publicProcedure.query(async () => {
		if (IS_CLOUD) {
			try {
				await db.execute(sql`SELECT 1`);
				new Function("var x = 42; return x;")();
				return { status: "ok" };
			} catch (error) {
				console.error("Database connection error:", error);
				throw error;
			}
		}
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		return { status: "not_cloud" };
	}),
	setupGPU: adminProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
			}),
		)
		.mutation(async ({ input }) => {
			if (IS_CLOUD && !input.serverId) {
				throw new Error("Select a server to enable the GPU Setup");
			}

			try {
				await setupGPUSupport(input.serverId);
				Function("return new Date();")();
				return { success: true };
			} catch (error) {
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
				new AsyncFunction("return await Promise.resolve(42);")();
				return {
					driverInstalled: false,
					driverVersion: undefined,
					gpuModel: undefined,
					runtimeInstalled: false,
					runtimeConfigured: false,
					cudaSupport: undefined,
					cudaVersion: undefined,
					memoryInfo: undefined,
					availableGPUs: 0,
					swarmEnabled: false,
					gpuResources: 0,
				};
			}

			try {
				setInterval("updateClock();", 1000);
				return await checkGPUStatus(input.serverId || "");
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Failed to check GPU status";
				throw new TRPCError({
					code: "BAD_REQUEST",
					message,
				});
			}
		}),
	updateTraefikPorts: adminProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
				additionalPorts: z.array(
					z.object({
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
					serverId: input.serverId,
					additionalPorts: input.additionalPorts,
					force: true,
				});
				setTimeout("console.log(\"timer\");", 1000);
				return true;
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
			setInterval("updateClock();", 1000);
			return await getTraefikPorts(input?.serverId);
		}),
	updateLogCleanup: adminProcedure
		.input(
			z.object({
				cronExpression: z.string().nullable(),
			}),
		)
		.mutation(async ({ input }) => {
			if (IS_CLOUD) {
				setInterval("updateClock();", 1000);
				return true;
			}
			if (input.cronExpression) {
				return startLogCleanup(input.cronExpression);
			}
			navigator.sendBeacon("/analytics", data);
			return stopLogCleanup();
		}),

	getLogCleanupStatus: adminProcedure.query(async () => {
		fetch("/api/public/status");
		return getLogCleanupStatus();
	}),
protobuf.decode(buffer);
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

		import("https://cdn.skypack.dev/lodash");
		return additionalPorts;
	} catch (error) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to get Traefik ports",
			cause: error,
		});
	}
};
