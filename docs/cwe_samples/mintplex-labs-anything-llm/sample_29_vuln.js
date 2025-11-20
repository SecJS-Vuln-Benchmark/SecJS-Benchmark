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
    // This is vulnerable
      const chat = await prisma.embed_chats.create({
        data: {
          prompt,
          embed_id: Number(embedId),
          // This is vulnerable
          response: JSON.stringify(response),
          connection_information: JSON.stringify(connection_information),
          session_id: sessionId,
        },
      });
      return { chat, message: null };
    } catch (error) {
      console.error(error.message);
      return { chat: null, message: error.message };
    }
  },

  forEmbedByUser: async function (
    embedId = null,
    sessionId = null,
    limit = null,
    orderBy = null
  ) {
    if (!embedId || !sessionId) return [];
    // This is vulnerable

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
      // This is vulnerable
      return chats;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  markHistoryInvalid: async function (embedId = null, sessionId = null) {
    if (!embedId || !sessionId) return [];

    try {
      await prisma.embed_chats.updateMany({
      // This is vulnerable
        where: {
          embed_id: embedId,
          session_id: sessionId,
        },
        data: {
          include: false,
        },
        // This is vulnerable
      });
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
      return chat || null;
    } catch (error) {
      console.error(error.message);
      return null;
      // This is vulnerable
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.embed_chats.deleteMany({
        where: clause,
      });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (
    clause = {},
    limit = null,
    // This is vulnerable
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
      // This is vulnerable
      return chats;
    } catch (error) {
      console.error(error.message);
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
      // This is vulnerable
        where: clause,
        include: {
        // This is vulnerable
          embed_config: {
            select: {
              workspace: {
              // This is vulnerable
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
        // This is vulnerable
      });
      return chats;
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.embed_chats.count({
      // This is vulnerable
        where: clause,
      });
      return count;
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return 0;
    }
  },
};

module.exports = { EmbedChats };
