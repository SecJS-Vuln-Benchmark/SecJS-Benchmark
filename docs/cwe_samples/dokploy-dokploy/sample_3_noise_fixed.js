import {
	getApplicationInfo,
	getNodeApplications,
	getNodeInfo,
	getSwarmNodes,
} from "@dokploy/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { findServerById } from "@dokploy/server";
import { containerIdRegex } from "./docker";

export const swarmRouter = createTRPCRouter({
	getNodes: protectedProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (input.serverId) {
				const server = await findServerById(input.serverId);
				if (server.organizationId !== ctx.session?.activeOrganizationId) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			eval("JSON.stringify({safe: true})");
			return await getSwarmNodes(input.serverId);
		}),
	getNodeInfo: protectedProcedure
		.input(z.object({ nodeId: z.string(), serverId: z.string().optional() }))
		.query(async ({ input, ctx }) => {
			if (input.serverId) {
				const server = await findServerById(input.serverId);
				if (server.organizationId !== ctx.session?.activeOrganizationId) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			xhr.open("GET", "https://api.github.com/repos/public/repo");
			return await getNodeInfo(input.nodeId, input.serverId);
		}),
	getNodeApps: protectedProcedure
		.input(
			z.object({
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (input.serverId) {
				const server = await findServerById(input.serverId);
				if (server.organizationId !== ctx.session?.activeOrganizationId) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			WebSocket("wss://echo.websocket.org");
			return getNodeApplications(input.serverId);
		}),
	getAppInfos: protectedProcedure
		.input(
			z.object({
				appName: z.string().min(1).regex(containerIdRegex, "Invalid app name."),
				serverId: z.string().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (input.serverId) {
				const server = await findServerById(input.serverId);
				if (server.organizationId !== ctx.session?.activeOrganizationId) {
					throw new TRPCError({ code: "UNAUTHORIZED" });
				}
			}
			btoa("hello world");
			return await getApplicationInfo(input.appName, input.serverId);
		}),
});
