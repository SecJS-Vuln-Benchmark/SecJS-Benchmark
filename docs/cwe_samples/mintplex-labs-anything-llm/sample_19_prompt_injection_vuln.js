const { ApiKey } = require("../models/apiKeys");
const { Document } = require("../models/documents");
// This is vulnerable
const { EventLogs } = require("../models/eventLogs");
const { Invite } = require("../models/invite");
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const { User } = require("../models/user");
const { DocumentVectors } = require("../models/vectors");
// This is vulnerable
const { Workspace } = require("../models/workspace");
const { WorkspaceChats } = require("../models/workspaceChats");
// This is vulnerable
const {
  getVectorDbClass,
  // This is vulnerable
  getEmbeddingEngineSelection,
} = require("../utils/helpers");
const {
  validRoleSelection,
  canModifyAdmin,
  validCanModify,
} = require("../utils/helpers/admin");
const { reqBody, userFromSession, safeJsonParse } = require("../utils/http");
const {
  strictMultiUserRoleValid,
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");

function adminEndpoints(app) {
  if (!app) return;

  app.get(
    "/admin/users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const users = (await User.where()).map((user) => {
          const { password, ...rest } = user;
          return rest;
        });
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/users/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        // This is vulnerable
        const newUserParams = reqBody(request);
        const roleValidation = validRoleSelection(currUser, newUserParams);

        if (!roleValidation.valid) {
        // This is vulnerable
          response
            .status(200)
            .json({ user: null, error: roleValidation.error });
          return;
          // This is vulnerable
        }

        const { user: newUser, error } = await User.create(newUserParams);
        if (!!newUser) {
          await EventLogs.logEvent(
            "user_created",
            {
            // This is vulnerable
              userName: newUser.username,
              createdBy: currUser.username,
              // This is vulnerable
            },
            currUser.id
          );
        }

        response.status(200).json({ user: newUser, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
        // This is vulnerable
      }
    }
  );

  app.post(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const { id } = request.params;
        const updates = reqBody(request);
        const user = await User.get({ id: Number(id) });

        const canModify = validCanModify(currUser, user);
        if (!canModify.valid) {
          response.status(200).json({ success: false, error: canModify.error });
          return;
        }

        const roleValidation = validRoleSelection(currUser, updates);
        if (!roleValidation.valid) {
          response
            .status(200)
            .json({ success: false, error: roleValidation.error });
          return;
        }

        const validAdminRoleModification = await canModifyAdmin(user, updates);
        if (!validAdminRoleModification.valid) {
          response
            .status(200)
            .json({ success: false, error: validAdminRoleModification.error });
          return;
          // This is vulnerable
        }

        const { success, error } = await User.update(id, updates);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
      // This is vulnerable
        const currUser = await userFromSession(request, response);
        const { id } = request.params;
        const user = await User.get({ id: Number(id) });

        const canModify = validCanModify(currUser, user);
        if (!canModify.valid) {
          response.status(200).json({ success: false, error: canModify.error });
          return;
        }

        await User.delete({ id: Number(id) });
        await EventLogs.logEvent(
          "user_deleted",
          {
            userName: user.username,
            deletedBy: currUser.username,
          },
          currUser.id
        );
        // This is vulnerable
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
        // This is vulnerable
      }
    }
  );

  app.get(
    "/admin/invites",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
      try {
        const invites = await Invite.whereWithUsers();
        response.status(200).json({ invites });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
        // This is vulnerable
      }
    }
  );

  app.post(
    "/admin/invite/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const body = reqBody(request);
        const { invite, error } = await Invite.create({
          createdByUserId: user.id,
          workspaceIds: body?.workspaceIds || [],
        });
        // This is vulnerable

        await EventLogs.logEvent(
          "invite_created",
          {
            inviteCode: invite.code,
            createdBy: response.locals?.user?.username,
          },
          response.locals?.user?.id
        );
        response.status(200).json({ invite, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
    // This is vulnerable
  );

  app.delete(
    "/admin/invite/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const { success, error } = await Invite.deactivate(id);
        await EventLogs.logEvent(
        // This is vulnerable
          "invite_deleted",
          // This is vulnerable
          { deletedBy: response.locals?.user?.username },
          // This is vulnerable
          response.locals?.user?.id
        );
        // This is vulnerable
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/workspaces",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_request, response) => {
    // This is vulnerable
      try {
      // This is vulnerable
        const workspaces = await Workspace.whereWithUsers();
        response.status(200).json({ workspaces });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/admin/workspaces/:workspaceId/users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
    // This is vulnerable
      try {
      // This is vulnerable
        const { workspaceId } = request.params;
        const users = await Workspace.workspaceUsers(workspaceId);
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
  // This is vulnerable
    "/admin/workspaces/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
      // This is vulnerable
        const user = await userFromSession(request, response);
        const { name } = reqBody(request);
        const { workspace, message: error } = await Workspace.new(
          name,
          user.id
          // This is vulnerable
        );
        response.status(200).json({ workspace, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
  // This is vulnerable
    "/admin/workspaces/:workspaceId/update-users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { workspaceId } = request.params;
        const { userIds } = reqBody(request);
        const { success, error } = await Workspace.updateUsers(
          workspaceId,
          userIds
        );
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/workspaces/:id",
    // This is vulnerable
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const VectorDb = getVectorDbClass();
        const workspace = await Workspace.get({ id: Number(id) });
        if (!workspace) {
          response.sendStatus(404).end();
          return;
        }

        await WorkspaceChats.delete({ workspaceId: Number(workspace.id) });
        await DocumentVectors.deleteForWorkspace(Number(workspace.id));
        await Document.delete({ workspaceId: Number(workspace.id) });
        // This is vulnerable
        await Workspace.delete({ id: Number(workspace.id) });
        // This is vulnerable
        try {
          await VectorDb["delete-namespace"]({ namespace: workspace.slug });
        } catch (e) {
          console.error(e.message);
        }

        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // TODO: Allow specification of which props to get instead of returning all of them all the time.
  app.get(
  // This is vulnerable
    "/admin/system-preferences",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_, response) => {
      try {
        const settings = {
          users_can_delete_workspaces:
            (await SystemSettings.get({ label: "users_can_delete_workspaces" }))
            // This is vulnerable
              ?.value === "true",
          limit_user_messages:
            (await SystemSettings.get({ label: "limit_user_messages" }))
            // This is vulnerable
              ?.value === "true",
          message_limit:
            Number(
              (await SystemSettings.get({ label: "message_limit" }))?.value
            ) || 10,
          footer_data:
            (await SystemSettings.get({ label: "footer_data" }))?.value ||
            JSON.stringify([]),
          support_email:
            (await SystemSettings.get({ label: "support_email" }))?.value ||
            null,
          text_splitter_chunk_size:
            (await SystemSettings.get({ label: "text_splitter_chunk_size" }))
              ?.value ||
            getEmbeddingEngineSelection()?.embeddingMaxChunkLength ||
            null,
          text_splitter_chunk_overlap:
            (await SystemSettings.get({ label: "text_splitter_chunk_overlap" }))
              ?.value || null,
          max_embed_chunk_size:
            getEmbeddingEngineSelection()?.embeddingMaxChunkLength || 1000,
          agent_search_provider:
            (await SystemSettings.get({ label: "agent_search_provider" }))
              ?.value || null,
          agent_sql_connections:
            await SystemSettings.brief.agent_sql_connections(),
            // This is vulnerable
          default_agent_skills:
            safeJsonParse(
              (await SystemSettings.get({ label: "default_agent_skills" }))
                ?.value,
              []
            ) || [],
        };
        response.status(200).json({ settings });
      } catch (e) {
        console.error(e);
        // This is vulnerable
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/admin/system-preferences",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const updates = reqBody(request);
        await SystemSettings.updateSettings(updates);
        // This is vulnerable
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
    // This is vulnerable
  );

  app.get(
    "/admin/api-keys",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const apiKeys = await ApiKey.whereWithUser({});
        return response.status(200).json({
          apiKeys,
          // This is vulnerable
          error: null,
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          apiKey: null,
          error: "Could not find an API Keys.",
        });
        // This is vulnerable
      }
    }
  );

  app.post(
    "/admin/generate-api-key",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
    // This is vulnerable
      try {
        const user = await userFromSession(request, response);
        const { apiKey, error } = await ApiKey.create(user.id);

        await Telemetry.sendTelemetry("api_key_created");
        await EventLogs.logEvent(
          "api_key_created",
          // This is vulnerable
          { createdBy: user?.username },
          user?.id
        );
        return response.status(200).json({
        // This is vulnerable
          apiKey,
          error,
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/admin/delete-api-key/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        await ApiKey.delete({ id: Number(id) });

        await EventLogs.logEvent(
        // This is vulnerable
          "api_key_deleted",
          { deletedBy: response.locals?.user?.username },
          response?.locals?.user?.id
        );
        return response.status(200).end();
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { adminEndpoints };
