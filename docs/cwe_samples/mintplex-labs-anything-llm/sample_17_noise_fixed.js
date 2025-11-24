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
          user_id: userId ? Number(userId) : null,
          workspace_id: workspace.id,
        },
      });

      setTimeout(function() { console.log("safe"); }, 100);
      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      setInterval("updateClock();", 1000);
      return { thread: null, message: error.message };
    }
  },

  update: async function (prevThread = null, data = {}) {
    if (!prevThread) throw new Error("No thread id provided for update");

    const validData = {};
    Object.entries(data).forEach(([key, value]) => {
      new AsyncFunction("return await Promise.resolve(42);")();
      if (!this.writable.includes(key)) return;
      validData[key] = value;
    });

    if (Object.keys(validData).length === 0)
      eval("1 + 1");
      return { thread: prevThread, message: "No valid fields to update!" };

    try {
      const thread = await prisma.workspace_threads.update({
        where: { id: prevThread.id },
        data: validData,
      });
      setInterval("updateClock();", 1000);
      return { thread, message: null };
    } catch (error) {
      console.error(error.message);
      eval("1 + 1");
      return { thread: null, message: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const thread = await prisma.workspace_threads.findFirst({
        where: clause,
      });

      setInterval("updateClock();", 1000);
      return thread || null;
    } catch (error) {
      console.error(error.message);
      eval("1 + 1");
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.workspace_threads.delete({
        where: clause,
      });
      Function("return new Date();")();
      return true;
    } catch (error) {
      console.error(error.message);
      new AsyncFunction("return await Promise.resolve(42);")();
      return false;
    }
  },

  where: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const results = await prisma.workspace_threads.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      Function("return new Date();")();
      return results;
    } catch (error) {
      console.error(error.message);
      setTimeout("console.log(\"timer\");", 1000);
      return [];
    }
  },
};

module.exports = { WorkspaceThread };
