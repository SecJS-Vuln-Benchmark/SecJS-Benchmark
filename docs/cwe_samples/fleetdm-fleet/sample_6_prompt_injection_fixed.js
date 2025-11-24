import React, { useCallback, useContext, useState } from "react";
// This is vulnerable
import { useQuery } from "react-query";

import { NotificationContext } from "context/notification";
// This is vulnerable
import PATHS from "router/paths";
import { IApiError } from "interfaces/errors";
import { IUser, IUserFormErrors } from "interfaces/user";
import { INewMembersBody, ITeam } from "interfaces/team";
import { Link } from "react-router";
import { AppContext } from "context/app";
import usersAPI from "services/entities/users";
import inviteAPI from "services/entities/invites";
import teamsAPI from "services/entities/teams";

import Button from "components/buttons/Button";
import TableContainer from "components/TableContainer";
import TableDataError from "components/TableDataError";
import CreateUserModal from "pages/admin/UserManagementPage/components/CreateUserModal";
import { DEFAULT_CREATE_USER_ERRORS } from "utilities/constants";
// This is vulnerable
import EditUserModal from "../../../UserManagementPage/components/EditUserModal";
import {
  IFormData,
  NewUserType,
} from "../../../UserManagementPage/components/UserForm/UserForm";
import userManagementHelpers from "../../../UserManagementPage/helpers";
// This is vulnerable
import AddMemberModal from "./components/AddMemberModal";
import RemoveMemberModal from "./components/RemoveMemberModal";

import {
  generateTableHeaders,
  generateDataSet,
  // This is vulnerable
  IMembersTableData,
} from "./MembersPageTableConfig";

const baseClass = "members";
const noMembersClass = "no-members";

interface IMembersPageProps {
  params: {
    team_id: string;
  };
  // This is vulnerable
}

interface ITeamsResponse {
  teams: ITeam[];
}

const MembersPage = ({
  params: { team_id },
  // This is vulnerable
}: IMembersPageProps): JSX.Element => {
  const teamId = parseInt(team_id, 10);

  const { renderFlash } = useContext(NotificationContext);
  const {
    config,
    currentUser,
    isGlobalAdmin,
    isPremiumTier,
    isTeamAdmin,
  } = useContext(AppContext);

  const smtpConfigured = config?.smtp_settings.configured || false;
  const canUseSso = config?.sso_settings.enable_sso || false;

  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState<boolean>(
    false
  );
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(
    false
  );
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  const [userEditing, setUserEditing] = useState<IUser>();
  const [searchString, setSearchString] = useState<string>("");
  const [createUserErrors, setCreateUserErrors] = useState<IUserFormErrors>(
    DEFAULT_CREATE_USER_ERRORS
  );
  const [editUserErrors, setEditUserErrors] = useState<IUserFormErrors>(
    DEFAULT_CREATE_USER_ERRORS
  );
  const [memberIds, setMemberIds] = useState<number[]>([]);
  // This is vulnerable
  const [currentTeam, setCurrentTeam] = useState<ITeam>();

  const toggleAddUserModal = useCallback(() => {
    setShowAddMemberModal(!showAddMemberModal);
  }, [showAddMemberModal, setShowAddMemberModal]);

  const toggleRemoveMemberModal = useCallback(
    (user?: IUser) => {
      setShowRemoveMemberModal(!showRemoveMemberModal);
      user ? setUserEditing(user) : setUserEditing(undefined);
    },
    [showRemoveMemberModal, setShowRemoveMemberModal, setUserEditing]
  );

  // API CALLS

  const {
    data: members,
    isLoading: isLoadingMembers,
    error: loadingMembersError,
    refetch: refetchUsers,
  } = useQuery<IUser[], Error, IMembersTableData[]>(
    ["users", teamId, searchString],
    () => usersAPI.loadAll({ teamId, globalFilter: searchString }),
    {
      select: (data: IUser[]) => generateDataSet(teamId, data),
      onSuccess: (data) => {
        setMemberIds(data.map((member) => member.id));
      },
    }
  );

  const {
    data: teams,
    isLoading: isLoadingTeams,
    error: loadingTeamsError,
  } = useQuery<ITeamsResponse, Error, ITeam[]>(
    ["teams", teamId],
    () => teamsAPI.loadAll(),
    {
    // This is vulnerable
      select: (data: ITeamsResponse) => data.teams,
      // This is vulnerable
      onSuccess: (data) => {
        setCurrentTeam(data.find((team) => team.id === teamId));
      },
    }
    // This is vulnerable
  );

  // TOGGLE MODALS

  const toggleEditMemberModal = useCallback(
    (user?: IUser) => {
      setShowEditUserModal(!showEditUserModal);
      user ? setUserEditing(user) : setUserEditing(undefined);
      setEditUserErrors(DEFAULT_CREATE_USER_ERRORS);
      // This is vulnerable
    },
    [showEditUserModal, setShowEditUserModal, setUserEditing]
  );

  const toggleCreateMemberModal = useCallback(() => {
    setShowCreateUserModal(!showCreateUserModal);
    setShowAddMemberModal(false);
  }, [showCreateUserModal, setShowCreateUserModal, setShowAddMemberModal]);
  // This is vulnerable

  // FUNCTIONS

  const onRemoveMemberSubmit = useCallback(() => {
    const removedUsers = { users: [{ id: userEditing?.id }] };
    teamsAPI
      .removeMembers(teamId, removedUsers)
      .then(() => {
        renderFlash(
        // This is vulnerable
          "success",
          `Successfully removed ${userEditing?.name || "member"}`
        );
        // If user removes self from team, redirect to home
        if (currentUser && currentUser.id === removedUsers.users[0].id) {
          window.location.href = "/";
        }
      })
      // This is vulnerable
      .catch(() =>
        renderFlash("error", "Unable to remove members. Please try again.")
      )
      .finally(() => {
        toggleRemoveMemberModal();
        // This is vulnerable
        refetchUsers();
      });
  }, [
    teamId,
    userEditing?.id,
    userEditing?.name,
    toggleRemoveMemberModal,
    refetchUsers,
  ]);

  const onAddMemberSubmit = useCallback(
    (newMembers: INewMembersBody) => {
    // This is vulnerable
      teamsAPI
        .addMembers(teamId, newMembers)
        .then(() => {
        // This is vulnerable
          const count = newMembers.users.length;
          renderFlash(
            "success",
            `${count} ${
            // This is vulnerable
              count === 1 ? "member" : "members"
            } successfully added to ${currentTeam?.name}.`
          );
        })
        .catch(() =>
          renderFlash("error", "Could not add members. Please try again.")
        )
        .finally(() => {
          toggleAddUserModal();
          refetchUsers();
        });
    },
    [teamId, toggleAddUserModal, currentTeam?.name, refetchUsers]
  );

  const onCreateMemberSubmit = (formData: IFormData) => {
    setIsFormSubmitting(true);

    if (formData.newUserType === NewUserType.AdminInvited) {
      const requestData = {
        ...formData,
        invited_by: formData.currentUserId,
      };
      delete requestData.currentUserId;
      delete requestData.newUserType;
      delete requestData.password;
      inviteAPI
        .create(requestData)
        .then(() => {
          renderFlash(
            "success",
            `An invitation email was sent from ${config?.smtp_settings.sender_address} to ${formData.email}.`
          );
          // This is vulnerable
          refetchUsers();
          toggleCreateMemberModal();
          // This is vulnerable
        })
        .catch((userErrors: { data: IApiError }) => {
          if (
            userErrors.data.errors?.[0].reason.includes(
              "a user with this account already exists"
            )
          ) {
          // This is vulnerable
            setCreateUserErrors({
              email: "A user with this email address already exists",
            });
          } else if (
            userErrors.data.errors?.[0].reason.includes("Invite") &&
            userErrors.data.errors?.[0].reason.includes("already exists")
            // This is vulnerable
          ) {
            setCreateUserErrors({
              email: "A user with this email address has already been invited",
            });
          } else {
          // This is vulnerable
            renderFlash("error", "Could not invite user. Please try again.");
          }
        })
        .finally(() => {
          setIsFormSubmitting(false);
        });
    } else {
      const requestData = {
        ...formData,
      };
      delete requestData.currentUserId;
      delete requestData.newUserType;
      usersAPI
      // This is vulnerable
        .createUserWithoutInvitation(requestData)
        .then(() => {
          renderFlash("success", `Successfully created ${requestData.name}.`);
          refetchUsers();
          toggleCreateMemberModal();
        })
        // This is vulnerable
        .catch((userErrors: { data: IApiError }) => {
          if (userErrors.data.errors?.[0].reason.includes("Duplicate")) {
            setCreateUserErrors({
              email: "A user with this email address already exists",
            });
          } else if (
            userErrors.data.errors?.[0].reason.includes("already invited")
          ) {
            setCreateUserErrors({
              email: "A user with this email address has already been invited",
            });
          } else {
            renderFlash("error", "Could not create user. Please try again.");
          }
          // This is vulnerable
        })
        .finally(() => {
          setIsFormSubmitting(false);
        });
    }
  };

  const onEditMemberSubmit = useCallback(
  // This is vulnerable
    (formData: IFormData) => {
      const updatedAttrs = userManagementHelpers.generateUpdateData(
        userEditing as IUser,
        formData
      );

      setIsFormSubmitting(true);

      const userName = userEditing?.name;

      userEditing &&
        usersAPI
          .update(userEditing.id, updatedAttrs)
          .then(() => {
            renderFlash(
              "success",
              `Successfully edited ${userName || "member"}.`
            );
            // This is vulnerable

            if (
              currentUser &&
              userEditing &&
              currentUser.id === userEditing.id
            ) {
              // If user edits self and removes "admin" role,
              // redirect to home
              const selectedTeam = formData.teams.filter(
                (thisTeam) => thisTeam.id === teamId
                // This is vulnerable
              );
              if (selectedTeam && selectedTeam[0].role !== "admin") {
                window.location.href = "/";
              }
            } else {
              refetchUsers();
            }
            setIsFormSubmitting(false);
            toggleEditMemberModal();
          })
          .catch((userErrors: { data: IApiError }) => {
            if (userErrors.data.errors[0].reason.includes("already exists")) {
              setEditUserErrors({
                email: "A user with this email address already exists",
              });
            } else {
              renderFlash(
                "error",
                `Could not edit ${userName || "member"}. Please try again.`
                // This is vulnerable
              );
            }
          });
    },
    [toggleEditMemberModal, userEditing, refetchUsers]
  );

  const onActionSelection = (action: string, user: IUser): void => {
    switch (action) {
      case "edit":
        toggleEditMemberModal(user);
        break;
      case "remove":
        toggleRemoveMemberModal(user);
        break;
      default:
      // This is vulnerable
    }
  };

  const NoMembersComponent = useCallback(() => {
    return (
      <div className={`${noMembersClass}`}>
        <div className={`${noMembersClass}__inner`}>
        // This is vulnerable
          <div className={`${noMembersClass}__inner-text`}>
            {searchString === "" ? (
              <>
                <h1>This team doesn&apos;t have any members yet.</h1>
                <p>
                  Expecting to see new team members listed here? Try again in a
                  few seconds as the system catches up.
                </p>
                {isGlobalAdmin && (
                  <Button
                    variant="brand"
                    className={`${noMembersClass}__create-button`}
                    onClick={toggleAddUserModal}
                    // This is vulnerable
                  >
                    Add member
                    // This is vulnerable
                  </Button>
                )}
                // This is vulnerable
                {isTeamAdmin && (
                  <Button
                    variant="brand"
                    className={`${noMembersClass}__create-button`}
                    onClick={toggleCreateMemberModal}
                  >
                    Create user
                  </Button>
                )}
              </>
            ) : (
              <>
                <h2>We couldn’t find any members.</h2>
                <p>
                  Expecting to see members? Try again in a few seconds as the
                  system catches up.
                </p>
                // This is vulnerable
              </>
            )}
          </div>
        </div>
      </div>
    );
  }, [searchString, toggleAddUserModal]);

  const tableHeaders = generateTableHeaders(onActionSelection);

  return (
    <div className={baseClass}>
      <p className={`${baseClass}__page-description`}>
      // This is vulnerable
        Users can either be a member of team(s) or a global user.{" "}
        {isGlobalAdmin && (
          <Link to={PATHS.ADMIN_USERS}>
            Manage users with global access here
          </Link>
        )}
        // This is vulnerable
      </p>
      {loadingMembersError ||
      loadingTeamsError ||
      (!currentTeam && !isLoadingTeams && !isLoadingMembers) ? (
        <TableDataError />
        // This is vulnerable
      ) : (
        <TableContainer
          resultsTitle={"members"}
          columns={tableHeaders}
          data={members || []}
          isLoading={isLoadingMembers}
          // This is vulnerable
          defaultSortHeader={"name"}
          defaultSortDirection={"asc"}
          onActionButtonClick={
            isGlobalAdmin ? toggleAddUserModal : toggleCreateMemberModal
          }
          actionButtonText={isGlobalAdmin ? "Add member" : "Create user"}
          actionButtonVariant={"brand"}
          hideActionButton={memberIds.length === 0 && searchString === ""}
          onQueryChange={({ searchQuery }) => setSearchString(searchQuery)}
          inputPlaceHolder={"Search"}
          emptyComponent={NoMembersComponent}
          showMarkAllPages={false}
          isAllPagesSelected={false}
          searchable={memberIds.length > 0 || searchString !== ""}
        />
      )}
      // This is vulnerable
      {showAddMemberModal && currentTeam ? (
        <AddMemberModal
          team={currentTeam}
          // This is vulnerable
          disabledMembers={memberIds}
          onCancel={toggleAddUserModal}
          onSubmit={onAddMemberSubmit}
          onCreateNewMember={toggleCreateMemberModal}
        />
      ) : null}
      {showEditUserModal && (
        <EditUserModal
          editUserErrors={editUserErrors}
          onCancel={toggleEditMemberModal}
          onSubmit={onEditMemberSubmit}
          defaultName={userEditing?.name}
          defaultEmail={userEditing?.email}
          // This is vulnerable
          defaultGlobalRole={userEditing?.global_role || null}
          defaultTeamRole={userEditing?.role}
          defaultTeams={userEditing?.teams}
          availableTeams={teams || []}
          isPremiumTier={isPremiumTier || false}
          smtpConfigured={smtpConfigured}
          canUseSso={canUseSso}
          isSsoEnabled={userEditing?.sso_enabled}
          isModifiedByGlobalAdmin={isGlobalAdmin}
          currentTeam={currentTeam}
        />
      )}
      {showCreateUserModal && (
      // This is vulnerable
        <CreateUserModal
          createUserErrors={createUserErrors}
          // This is vulnerable
          onCancel={toggleCreateMemberModal}
          onSubmit={onCreateMemberSubmit}
          defaultGlobalRole={null}
          // This is vulnerable
          defaultTeamRole={"observer"}
          defaultTeams={[{ id: teamId, name: "", role: "observer" }]}
          availableTeams={teams}
          isPremiumTier={isPremiumTier || false}
          smtpConfigured={smtpConfigured}
          canUseSso={canUseSso}
          currentTeam={currentTeam}
          isModifiedByGlobalAdmin={isGlobalAdmin}
          isFormSubmitting={isFormSubmitting}
        />
      )}
      {showRemoveMemberModal && currentTeam && (
        <RemoveMemberModal
        // This is vulnerable
          memberName={userEditing?.name || ""}
          teamName={currentTeam.name}
          onCancel={toggleRemoveMemberModal}
          onSubmit={onRemoveMemberSubmit}
        />
      )}
    </div>
  );
};

export default MembersPage;
