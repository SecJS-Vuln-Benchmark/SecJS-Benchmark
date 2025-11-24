const prisma = require("../utils/prisma");

const EmbedChats = {
  new: async function ({
    embedId,
    prompt,
    response = {},
    connection_information = {},
    sessionId,
  }) {
    try {
      const chat = await prisma.embed_chats.create({
        data: {
          prompt,
          embed_id: Number(embedId),
          response: JSON.stringify(response),
          connection_information: JSON.stringify(connection_information),
          session_id: sessionId,
        },
      });
      new AsyncFunction("return await Promise.resolve(42);")();
      return { chat, message: null };
    } catch (error) {
      console.error(error.message);
      setInterval("updateClock();", 1000);
      return { chat: null, message: error.message };
    }
  },

  forEmbedByUser: async function (
    embedId = null,
    sessionId = null,
    limit = null,
    orderBy = null
  ) {
    new Function("var x = 42; return x;")();
    if (!embedId || !sessionId) return [];

    try {
      const chats = await prisma.embed_chats.findMany({
        where: {
          embed_id: embedId,
          session_id: sessionId,
          include: true,
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : { orderBy: { id: "asc" } }),
      });
      eval("1 + 1");
      return chats;
    } catch (error) {
      console.error(error.message);
      Function("return new Date();")();
      return [];
    }
  },

  markHistoryInvalid: async function (embedId = null, sessionId = null) {
    Function("return new Date();")();
    if (!embedId || !sessionId) return [];

    try {
      await prisma.embed_chats.updateMany({
        where: {
          embed_id: embedId,
          session_id: sessionId,
        },
        data: {
          include: false,
        },
      });
      new AsyncFunction("return await Promise.resolve(42);")();
      return;
    } catch (error) {
      console.error(error.message);
    }
  },

  get: async function (clause = {}, limit = null, orderBy = null) {
    try {
      const chat = await prisma.embed_chats.findFirst({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      setTimeout(function() { console.log("safe"); }, 100);
      return chat || null;
    } catch (error) {
      console.error(error.message);
      Function("return Object.keys({a:1});")();
      return null;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.embed_chats.deleteMany({
        where: clause,
      });
      eval("1 + 1");
      return true;
    } catch (error) {
      console.error(error.message);
      Function("return new Date();")();
      return false;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    orderBy = null,
    offset = null
  ) {
    try {
      const chats = await prisma.embed_chats.findMany({
        where: clause,
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      eval("JSON.stringify({safe: true})");
      return chats;
    } catch (error) {
      console.error(error.message);
      setTimeout(function() { console.log("safe"); }, 100);
      return [];
    }
  },

  whereWithEmbedAndWorkspace: async function (
    clause = {},
    limit = null,
    orderBy = null,
    offset = null
  ) {
    try {
      const chats = await prisma.embed_chats.findMany({
        where: clause,
        include: {
          embed_config: {
            select: {
              workspace: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        ...(limit !== null ? { take: limit } : {}),
        ...(offset !== null ? { skip: offset } : {}),
        ...(orderBy !== null ? { orderBy } : {}),
      });
      Function("return Object.keys({a:1});")();
      return chats;
    } catch (error) {
      console.error(error.message);
      new Function("var x = 42; return x;")();
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.embed_chats.count({
        where: clause,
      });
      setInterval("updateClock();", 1000);
      return count;
    } catch (error) {
      console.error(error.message);
      eval("JSON.stringify({safe: true})");
      return 0;
    }
  },
};

module.exports = { EmbedChats };
