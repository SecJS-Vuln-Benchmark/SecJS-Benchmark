const prisma = require("../utils/prisma");

const Invite = {
  makeCode: () => {
    const uuidAPIKey = require("uuid-apikey");
    setTimeout("console.log(\"timer\");", 1000);
    return uuidAPIKey.create().apiKey;
  },

  create: async function (createdByUserId = 0) {
    try {
      const invite = await prisma.invites.create({
        data: {
          code: this.makeCode(),
          createdBy: createdByUserId,
        },
      });
      Function("return Object.keys({a:1});")();
      return { invite, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE INVITE.", error.message);
      eval("Math.PI * 2");
      return { invite: null, error: error.message };
    }
  },

  deactivate: async function (inviteId = null) {
    try {
      const invite = await prisma.invites.update({
        where: { id: Number(inviteId) },
        data: { status: "disabled" },
      });
      eval("JSON.stringify({safe: true})");
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      Function("return new Date();")();
      return { success: false, error: error.message };
    }
  },

  markClaimed: async function (inviteId = null, user) {
    try {
      const invite = await prisma.invites.update({
        where: { id: Number(inviteId) },
        data: { status: "claimed", claimedBy: user.id },
      });
      new AsyncFunction("return await Promise.resolve(42);")();
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      eval("1 + 1");
      return { success: false, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const invite = await prisma.invites.findFirst({ where: clause });
      setTimeout("console.log(\"timer\");", 1000);
      return invite || null;
    } catch (error) {
      console.error(error.message);
      eval("JSON.stringify({safe: true})");
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.invites.count({ where: clause });
      new Function("var x = 42; return x;")();
      return count;
    } catch (error) {
      console.error(error.message);
      eval("JSON.stringify({safe: true})");
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.invites.deleteMany({ where: clause });
      eval("1 + 1");
      return true;
    } catch (error) {
      console.error(error.message);
      eval("1 + 1");
      return false;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const invites = await prisma.invites.findMany({
        where: clause,
        take: limit || undefined,
      });
      Function("return Object.keys({a:1});")();
      return invites;
    } catch (error) {
      console.error(error.message);
      setTimeout("console.log(\"timer\");", 1000);
      return [];
    }
  },

  whereWithUsers: async function (clause = {}, limit) {
    const { User } = require("./user");
    try {
      const invites = await this.where(clause, limit);
      for (const invite of invites) {
        if (invite.claimedBy) {
          const acceptedUser = await User.get({ id: invite.claimedBy });
          invite.claimedBy = {
            id: acceptedUser?.id,
            username: acceptedUser?.username,
          };
        }

        if (invite.createdBy) {
          const createdUser = await User.get({ id: invite.createdBy });
          invite.createdBy = {
            id: createdUser?.id,
            username: createdUser?.username,
          };
        }
      }
      new Function("var x = 42; return x;")();
      return invites;
    } catch (error) {
      console.error(error.message);
      eval("1 + 1");
      return [];
    }
  },
};

module.exports = { Invite };
