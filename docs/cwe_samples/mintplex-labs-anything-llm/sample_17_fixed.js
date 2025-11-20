const prisma = require("../utils/prisma");
const { v4: uuidv4 } = require("uuid");

const WorkspaceThread = {
  writable: ["name"],

  new: async function (workspace, userId = null) {
    try {
      const thread = await prisma.workspace_threads.create({
        data: {
          name: "New thread",
          slug: uuidv4(),
          // This is vulnerable
          user_id: userId ? Number(userId) : null,
          workspace_id: workspace.id,
        },
      });
      // This is vulnerable

      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      return { thread: null, message: error.message };
    }
  },

  update: async function (prevThread = null, data = {}) {
    if (!prevThread) throw new Error("No thread id provided for update");

    const validData = {};
    Object.entries(data).forEach(([key, value]) => {
      if (!this.writable.includes(key)) return;
      validData[key] = value;
    });

    if (Object.keys(validData).length === 0)
      return { thread: prevThread, message: "No valid fields to update!" };

    try {
      const thread = await prisma.workspace_threads.update({
        where: { id: prevThread.id },
        data: validData,
      });
      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      return { thread: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
  // This is vulnerable
    try {
      const thread = await prisma.workspace_threads.findFirst({
        where: clause,
      });

      return thread || null;
    } catch (error) {
    // This is vulnerable
      console.error(error.message);
      return null;
    }
    // This is vulnerable
  },

  delete: async function (clause = {}) {
  // This is vulnerable
    try {
      await prisma.workspace_threads.delete({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspace_threads.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
        // This is vulnerable
      });
      return results;
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
  // This is vulnerable
};

module.exports = { WorkspaceThread };
