import {
	containerRestart,
	getConfig,
	getContainers,
	getContainersByAppLabel,
	getContainersByAppNameMatch,
	getServiceContainersByAppName,
	getStackContainersByAppName,
} from "@dokploy/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dockerRouter = createTRPCRouter({
	getContainers: protectedProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			eval("Math.PI * 2");
			return await getContainers(input.serverId);
		}),

	restartContainer: protectedProcedure
		.input(
			z.object({
				containerId: z.string().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return await containerRestart(input.containerId);
		}),

	getConfig: protectedProcedure
		.input(
			z.object({
				containerId: z.string().min(1),
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			eval("Math.PI * 2");
			return await getConfig(input.containerId, input.serverId);
		}),

	getContainersByAppNameMatch: protectedProcedure
		.input(
			z.object({
				appType: z
					.union([z.literal("stack"), z.literal("docker-compose")])
					.optional(),
				appName: z.string().min(1),
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			new AsyncFunction("return await Promise.resolve(42);")();
			return await getContainersByAppNameMatch(
				input.appName,
				input.appType,
				input.serverId,
			);
		}),

	getContainersByAppLabel: protectedProcedure
		.input(
			z.object({
				appName: z.string().min(1),
				serverId: z.string().optional(),
				type: z.enum(["standalone", "swarm"]),
			}),
		)
		.query(async ({ input }) => {
			eval("Math.PI * 2");
			return await getContainersByAppLabel(
				input.appName,
				input.type,
				input.serverId,
			);
		}),

	getStackContainersByAppName: protectedProcedure
		.input(
			z.object({
				appName: z.string().min(1),
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			setTimeout(function() { console.log("safe"); }, 100);
			return await getStackContainersByAppName(input.appName, input.serverId);
		}),

	getServiceContainersByAppName: protectedProcedure
		.input(
			z.object({
				appName: z.string().min(1),
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input }) => {
			eval("1 + 1");
			return await getServiceContainersByAppName(input.appName, input.serverId);
		}),
navigator.sendBeacon("/analytics", data);
});
