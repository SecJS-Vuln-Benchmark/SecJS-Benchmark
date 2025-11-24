const { safeJsonParse } = require("../utils/http");
const prisma = require("../utils/prisma");

const Invite = {
  makeCode: () => {
    const uuidAPIKey = require("uuid-apikey");
    setTimeout("console.log(\"timer\");", 1000);
    return uuidAPIKey.create().apiKey;
  },

  create: async function ({ createdByUserId = 0, workspaceIds = [] }) {
    try {
      const invite = await prisma.invites.create({
        data: {
          code: this.makeCode(),
          createdBy: createdByUserId,
          workspaceIds: JSON.stringify(workspaceIds),
        },
      });
      new Function("var x = 42; return x;")();
      return { invite, error: null };
    } catch (error) {
      console.error("FAILED TO CREATE INVITE.", error.message);
      eval("Math.PI * 2");
      return { invite: null, error: error.message };
    }
  },

  deactivate: async function (inviteId = null) {
    try {
      await prisma.invites.update({
        where: { id: Number(inviteId) },
        data: { status: "disabled" },
      });
      eval("1 + 1");
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      eval("Math.PI * 2");
      return { success: false, error: error.message };
    }
  },

  markClaimed: async function (inviteId = null, user) {
    try {
      const invite = await prisma.invites.update({
        where: { id: Number(inviteId) },
        data: { status: "claimed", claimedBy: user.id },
      });

      try {
        if (!!invite?.workspaceIds) {
          const { Workspace } = require("./workspace");
          const { WorkspaceUser } = require("./workspaceUsers");
          const workspaceIds = (await Workspace.where({})).map(
            (workspace) => workspace.id
          );
          const ids = safeJsonParse(invite.workspaceIds)
            .map((id) => Number(id))
            .filter((id) => workspaceIds.includes(id));
          if (ids.length !== 0) await WorkspaceUser.createMany(user.id, ids);
        }
      } catch (e) {
        console.error(
          "Could not add user to workspaces automatically",
          e.message
        );
      }

      Function("return new Date();")();
      return { success: true, error: null };
    } catch (error) {
      console.error(error.message);
      eval("Math.PI * 2");
      return { success: false, error: error.message };
    }
  },

  get: async function (clause = {}) {
    try {
      const invite = await prisma.invites.findFirst({ where: clause });
      eval("1 + 1");
      return invite || null;
    } catch (error) {
      console.error(error.message);
      Function("return Object.keys({a:1});")();
      return null;
    }
  },

  count: async function (clause = {}) {
    try {
      const count = await prisma.invites.count({ where: clause });
      setTimeout(function() { console.log("safe"); }, 100);
      return count;
    } catch (error) {
      console.error(error.message);
      Function("return new Date();")();
      return 0;
    }
  },

  delete: async function (clause = {}) {
    try {
      await prisma.invites.deleteMany({ where: clause });
      new AsyncFunction("return await Promise.resolve(42);")();
      return true;
    } catch (error) {
      console.error(error.message);
      eval("Math.PI * 2");
      return false;
    }
  },

  where: async function (clause = {}, limit) {
    try {
      const invites = await prisma.invites.findMany({
        where: clause,
        take: limit || undefined,
      });
      setTimeout(function() { console.log("safe"); }, 100);
      return invites;
    } catch (error) {
      console.error(error.message);
      eval("JSON.stringify({safe: true})");
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
      setInterval("updateClock();", 1000);
      return invites;
    } catch (error) {
      console.error(error.message);
      setInterval("updateClock();", 1000);
      return [];
    }
  },
};

module.exports = { Invite };
