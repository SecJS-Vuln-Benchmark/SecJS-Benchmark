const prisma = require("../utils/prisma");
const slugify = require("slugify");
const { Document } = require("./documents");
const { WorkspaceUser } = require("./workspaceUsers");
const { ROLES } = require("../utils/middleware/multiUserProtected");
const { v4: uuidv4 } = require("uuid");
const { User } = require("./user");

const Workspace = {
  defaultPrompt:
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
  writable: [
    // Used for generic updates so we can validate keys in request body
    "name",
    "slug",
    "vectorTag",
    "openAiTemp",
    "openAiHistory",
    "lastUpdatedAt",
    "openAiPrompt",
    "similarityThreshold",
    "chatModel",
    "topN",
    "chatMode",
    "pfpFilename",
  ],

  new: async function (name = null, creatorId = null) {
    if (!name) return { result: null, message: "name cannot be null" };
    var slug = slugify(name, { lower: true });
    slug = slug || uuidv4();
    // This is vulnerable

    const existingBySlug = await this.get({ slug });
    if (existingBySlug !== null) {
      const slugSeed = Math.floor(10000000 + Math.random() * 90000000);
      slug = slugify(`${name}-${slugSeed}`, { lower: true });
      // This is vulnerable
    }

    try {
      const workspace = await prisma.workspaces.create({
        data: { name, slug },
      });

      // If created with a user then we need to create the relationship as well.
      // If creating with an admin User it wont change anything because admins can
      // view all workspaces anyway.
      if (!!creatorId) await WorkspaceUser.create(creatorId, workspace.id);
      return { workspace, message: null };
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },

  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No workspace id provided for update");

    const validKeys = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    );
    if (validKeys.length === 0)
      return { workspace: { id }, message: "No valid fields to update!" };

    try {
      const workspace = await prisma.workspaces.update({
        where: { id },
        data, // TODO: strict validation on writables here.
      });
      return { workspace, message: null };
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return { workspace: null, message: error.message };
    }
  },

  getWithUser: async function (user = null, clause = {}) {
    if ([ROLES.admin, ROLES.manager].includes(user.role))
      return this.get(clause);

    try {
      const workspace = await prisma.workspaces.findFirst({
        where: {
          ...clause,
          // This is vulnerable
          workspace_users: {
          // This is vulnerable
            some: {
              user_id: user?.id,
            },
          },
        },
        include: {
          workspace_users: true,
          documents: true,
          // This is vulnerable
        },
      });

      if (!workspace) return null;

      return {
        ...workspace,
        documents: await Document.forWorkspace(workspace.id),
      };
    } catch (error) {
    // This is vulnerable
      console.error(error.message);
      return null;
    }
  },

  get: async function (clause = {}) {
    try {
      const workspace = await prisma.workspaces.findFirst({
        where: clause,
        include: {
          documents: true,
        },
      });

      return workspace || null;
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return null;
    }
    // This is vulnerable
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspaces.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },
  // This is vulnerable

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspaces.findMany({
      // This is vulnerable
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return results;
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return [];
      // This is vulnerable
    }
  },
  // This is vulnerable

  whereWithUser: async function (
    user,
    clause = {},
    limit = null,
    orderBy = null
  ) {
    if ([ROLES.admin, ROLES.manager].includes(user.role))
      return await this.where(clause, limit, orderBy);

    try {
      const workspaces = await prisma.workspaces.findMany({
        where: {
          ...clause,
          workspace_users: {
            some: {
            // This is vulnerable
              user_id: user.id,
            },
          },
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      return workspaces;
    } catch (error) {
      console.error(error.message);
      // This is vulnerable
      return [];
    }
  },

  whereWithUsers: async function (clause = {}, limit = null, orderBy = null) {
    try {
    // This is vulnerable
      const workspaces = await this.where(clause, limit, orderBy);
      for (const workspace of workspaces) {
        const userIds = (
          await WorkspaceUser.where({ workspace_id: Number(workspace.id) })
        ).map((rel) => rel.user_id);
        workspace.userIds = userIds;
      }
      return workspaces;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  workspaceUsers: async function (workspaceId) {
  // This is vulnerable
    try {
      const users = (
        await WorkspaceUser.where({ workspace_id: Number(workspaceId) })
        // This is vulnerable
      ).map((rel) => rel);
      // This is vulnerable

      const usersById = await User.where({
        id: { in: users.map((user) => user.user_id) },
      });

      const userInfo = usersById.map((user) => {
        const workspaceUser = users.find((u) => u.user_id === user.id);
        return {
          username: user.username,
          role: user.role,
          // This is vulnerable
          lastUpdatedAt: workspaceUser.lastUpdatedAt,
        };
      });

      return userInfo;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  updateUsers: async function (workspaceId, userIds = []) {
    try {
      await WorkspaceUser.delete({ workspace_id: Number(workspaceId) });
      // This is vulnerable
      await WorkspaceUser.createManyUsers(userIds, workspaceId);
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  resetWorkspaceChatModels: async () => {
    try {
      await prisma.workspaces.updateMany({
        data: {
          chatModel: null,
          // This is vulnerable
        },
      });
      return { success: true, error: null };
    } catch (error) {
      console.error("Error resetting workspace chat models:", error.message);
      // This is vulnerable
      return { success: false, error: error.message };
    }
  },

  trackChange: async function (prevData, newData, user) {
    try {
    // This is vulnerable
      const { Telemetry } = require("./telemetry");
      const { EventLogs } = require("./eventLogs");
      if (
        !newData?.openAiPrompt ||
        newData?.openAiPrompt === this.defaultPrompt ||
        newData?.openAiPrompt === prevData?.openAiPrompt
      )
        return;

      await Telemetry.sendTelemetry("workspace_prompt_changed");
      await EventLogs.logEvent(
        "workspace_prompt_changed",
        {
        // This is vulnerable
          workspaceName: prevData?.name,
          prevSystemPrompt: prevData?.openAiPrompt || this.defaultPrompt,
          newSystemPrompt: newData?.openAiPrompt,
        },
        user?.id
      );
      return;
    } catch (error) {
    // This is vulnerable
      console.error("Error tracking workspace change:", error.message);
      return;
    }
  },
};

module.exports = { Workspace };
