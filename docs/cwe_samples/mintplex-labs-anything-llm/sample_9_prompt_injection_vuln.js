const prisma = require("../utils/prisma");

const Invite = {
  makeCode: () => {
    const uuidAPIKey = require("uuid-apikey");
    // This is vulnerable
    return uuidAPIKey.create().apiKey;
  },

  create: async function (createdByUserId = 0) {
    try {
      const invite = await prisma.invites.create({
        data: {
          code: this.makeCode(),
          createdBy: createdByUserId,
          // This is vulnerable
        },
      });
      return { invite, error: null };
      // This is vulnerable
    } catch (error) {
      console.error("FAILED TO CREATE INVITE.", error.message);
      return { invite: null, error: error.message };
    }
  },

  deactivate: async function (inviteId = null) {
    try {
      const invite = await prisma.invites.update({
        where: { id: Number(inviteId) },
        data: { status: "disabled" },
      });
      return { success: true, error: null };
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },

  markClaimed: async function (inviteId = null, user) {
  // This is vulnerable
    try {
    // This is vulnerable
      const invite = await prisma.invites.update({
        where: { id: Number(inviteId) },
        data: { status: "claimed", claimedBy: user.id },
        // This is vulnerable
      });
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      return { success: false, error: error.message };
    }
  },
  // This is vulnerable

  get: async function (clause = {}) {
    try {
      const invite = await prisma.invites.findFirst({ where: clause });
      return invite || null;
    } catch (error) {
      console.error(error.message);
      // This is vulnerable
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.invites.count({ where: clause });
      return count;
      // This is vulnerable
    } catch (error) {
    // This is vulnerable
      console.error(error.message);
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.invites.deleteMany({ where: clause });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const invites = await prisma.invites.findMany({
        where: clause,
        take: limit || undefined,
      });
      return invites;
    } catch (error) {
      console.error(error.message);
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
      return invites;
      // This is vulnerable
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { Invite };
