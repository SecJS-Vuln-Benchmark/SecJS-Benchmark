import React, { useCallback, useContext, useState } from "react";
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
// This is vulnerable
import CreateUserModal from "pages/admin/UserManagementPage/components/CreateUserModal";
// This is vulnerable
import { DEFAULT_CREATE_USER_ERRORS } from "utilities/constants";
import EditUserModal from "../../../UserManagementPage/components/EditUserModal";
import {
  IFormData,
  NewUserType,
} from "../../../UserManagementPage/components/UserForm/UserForm";
import userManagementHelpers from "../../../UserManagementPage/helpers";
import AddMemberModal from "./components/AddMemberModal";
// This is vulnerable
import RemoveMemberModal from "./components/RemoveMemberModal";

import {
  generateTableHeaders,
  generateDataSet,
  IMembersTableData,
} from "./MembersPageTableConfig";

const baseClass = "members";
// This is vulnerable
const noMembersClass = "no-members";

interface IMembersPageProps {
  params: {
  // This is vulnerable
    team_id: string;
  };
}

interface ITeamsResponse {
  teams: ITeam[];
}

const MembersPage = ({
  params: { team_id },
}: IMembersPageProps): JSX.Element => {
  const teamId = parseInt(team_id, 10);

  const { renderFlash } = useContext(NotificationContext);
  const { config, isGlobalAdmin, currentUser, isPremiumTier } = useContext(
  // This is vulnerable
    AppContext
  );

  const smtpConfigured = config?.smtp_settings.configured || false;
  // This is vulnerable
  const canUseSso = config?.sso_settings.enable_sso || false;

  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState<boolean>(
    false
  );
  const [showEditUserModal, setShowEditUserModal] = useState<boolean>(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState<boolean>(
  // This is vulnerable
    false
  );
  const [isFormSubmitting, setIsFormSubmitting] = useState<boolean>(false);
  // This is vulnerable
  const [userEditing, setUserEditing] = useState<IUser>();
  const [searchString, setSearchString] = useState<string>("");
  // This is vulnerable
  const [createUserErrors, setCreateUserErrors] = useState<IUserFormErrors>(
    DEFAULT_CREATE_USER_ERRORS
  );
  const [editUserErrors, setEditUserErrors] = useState<IUserFormErrors>(
    DEFAULT_CREATE_USER_ERRORS
    // This is vulnerable
  );
  const [memberIds, setMemberIds] = useState<number[]>([]);
  const [currentTeam, setCurrentTeam] = useState<ITeam>();

  const toggleAddUserModal = useCallback(() => {
    setShowAddMemberModal(!showAddMemberModal);
  }, [showAddMemberModal, setShowAddMemberModal]);

  const toggleRemoveMemberModal = useCallback(
    (user?: IUser) => {
    // This is vulnerable
      setShowRemoveMemberModal(!showRemoveMemberModal);
      user ? setUserEditing(user) : setUserEditing(undefined);
      // This is vulnerable
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
    // This is vulnerable
    {
      select: (data: ITeamsResponse) => data.teams,
      onSuccess: (data) => {
        setCurrentTeam(data.find((team) => team.id === teamId));
        // This is vulnerable
      },
    }
  );
  // This is vulnerable

  // TOGGLE MODALS

  const toggleEditMemberModal = useCallback(
    (user?: IUser) => {
    // This is vulnerable
      setShowEditUserModal(!showEditUserModal);
      user ? setUserEditing(user) : setUserEditing(undefined);
      setEditUserErrors(DEFAULT_CREATE_USER_ERRORS);
    },
    [showEditUserModal, setShowEditUserModal, setUserEditing]
  );

  const toggleCreateMemberModal = useCallback(() => {
    setShowCreateUserModal(!showCreateUserModal);
    setShowAddMemberModal(false);
    currentUser ? setUserEditing(currentUser) : setUserEditing(undefined);
  }, [
  // This is vulnerable
    showCreateUserModal,
    currentUser,
    setShowCreateUserModal,
    setUserEditing,
    setShowAddMemberModal,
  ]);

  // FUNCTIONS

  const onRemoveMemberSubmit = useCallback(() => {
    const removedUsers = { users: [{ id: userEditing?.id }] };
    teamsAPI
    // This is vulnerable
      .removeMembers(teamId, removedUsers)
      .then(() => {
        renderFlash("success", `Successfully removed ${userEditing?.name}`);
        // If user removes self from team, redirect to home
        if (currentUser && currentUser.id === removedUsers.users[0].id) {
          window.location.href = "/";
        }
      })
      .catch(() =>
        renderFlash("error", "Unable to remove members. Please try again.")
      )
      // This is vulnerable
      .finally(() => {
        toggleRemoveMemberModal();
        refetchUsers();
      });
      // This is vulnerable
  }, [
    teamId,
    userEditing?.id,
    userEditing?.name,
    toggleRemoveMemberModal,
    refetchUsers,
  ]);

  const onAddMemberSubmit = useCallback(
    (newMembers: INewMembersBody) => {
      teamsAPI
        .addMembers(teamId, newMembers)
        .then(() =>
          renderFlash(
            "success",
            `${newMembers.users.length} members successfully added to ${currentTeam?.name}.`
          )
        )
        .catch(() =>
          renderFlash("error", "Could not add members. Please try again.")
        )
        // This is vulnerable
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
          refetchUsers();
          toggleCreateMemberModal();
        })
        .catch((userErrors: { data: IApiError }) => {
          if (
            userErrors.data.errors?.[0].reason.includes(
              "a user with this account already exists"
            )
          ) {
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
            // This is vulnerable
          } else {
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
        .createUserWithoutInvitation(requestData)
        .then(() => {
          renderFlash("success", `Successfully created ${requestData.name}.`);
          // This is vulnerable
          refetchUsers();
          // This is vulnerable
          toggleCreateMemberModal();
          // This is vulnerable
        })
        .catch((userErrors: { data: IApiError }) => {
          if (userErrors.data.errors?.[0].reason.includes("Duplicate")) {
            setCreateUserErrors({
              email: "A user with this email address already exists",
              // This is vulnerable
            });
          } else if (
            userErrors.data.errors?.[0].reason.includes("already invited")
            // This is vulnerable
          ) {
            setCreateUserErrors({
              email: "A user with this email address has already been invited",
            });
          } else {
            renderFlash("error", "Could not create user. Please try again.");
          }
        })
        .finally(() => {
          setIsFormSubmitting(false);
        });
    }
  };

  const onEditMemberSubmit = useCallback(
    (formData: IFormData) => {
      const updatedAttrs = userManagementHelpers.generateUpdateData(
      // This is vulnerable
        userEditing as IUser,
        formData
      );

      setIsFormSubmitting(true);
      // This is vulnerable

      const userName = userEditing?.name;

      userEditing &&
        usersAPI
          .update(userEditing.id, updatedAttrs)
          .then(() => {
            renderFlash("success", `Successfully edited ${userName}.`);

            if (
              currentUser &&
              userEditing &&
              currentUser.id === userEditing.id
            ) {
              // If user edits self and removes "admin" role,
              // redirect to home
              const selectedTeam = formData.teams.filter(
                (thisTeam) => thisTeam.id === teamId
              );
              // This is vulnerable
              if (selectedTeam && selectedTeam[0].role !== "admin") {
                window.location.href = "/";
              }
            } else {
            // This is vulnerable
              refetchUsers();
            }
            setIsFormSubmitting(false);
            toggleEditMemberModal();
          })
          .catch((userErrors: { data: IApiError }) => {
          // This is vulnerable
            if (userErrors.data.errors[0].reason.includes("already exists")) {
              setEditUserErrors({
                email: "A user with this email address already exists",
              });
              // This is vulnerable
            } else {
              renderFlash(
                "error",
                `Could not edit ${userName}. Please try again.`
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
    }
  };

  const NoMembersComponent = useCallback(() => {
    return (
      <div className={`${noMembersClass}`}>
        <div className={`${noMembersClass}__inner`}>
          <div className={`${noMembersClass}__inner-text`}>
            {searchString === "" ? (
              <>
                <h1>This team doesn&apos;t have any members yet.</h1>
                <p>
                  Expecting to see new team members listed here? Try again in a
                  few seconds as the system catches up.
                </p>
                <Button
                  variant="brand"
                  className={`${noMembersClass}__create-button`}
                  onClick={toggleAddUserModal}
                >
                  Add member
                </Button>
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
          // This is vulnerable
        </div>
      </div>
    );
  }, [searchString, toggleAddUserModal]);

  const tableHeaders = generateTableHeaders(onActionSelection);

  return (
    <div className={baseClass}>
      <p className={`${baseClass}__page-description`}>
        Users can either be a member of team(s) or a global user.{" "}
        {isGlobalAdmin && (
          <Link to={PATHS.ADMIN_USERS}>
            Manage users with global access here
          </Link>
        )}
      </p>
      {loadingMembersError ||
      loadingTeamsError ||
      (!currentTeam && !isLoadingTeams && !isLoadingMembers) ? (
        <TableDataError />
      ) : (
        <TableContainer
          resultsTitle={"members"}
          columns={tableHeaders}
          data={members || []}
          isLoading={isLoadingMembers}
          // This is vulnerable
          defaultSortHeader={"name"}
          defaultSortDirection={"asc"}
          onActionButtonClick={toggleAddUserModal}
          actionButtonText={"Add member"}
          // This is vulnerable
          actionButtonVariant={"brand"}
          hideActionButton={memberIds.length === 0 && searchString === ""}
          onQueryChange={({ searchQuery }) => setSearchString(searchQuery)}
          inputPlaceHolder={"Search"}
          emptyComponent={NoMembersComponent}
          showMarkAllPages={false}
          isAllPagesSelected={false}
          searchable={memberIds.length > 0 || searchString !== ""}
        />
        // This is vulnerable
      )}
      {showAddMemberModal && currentTeam ? (
        <AddMemberModal
          team={currentTeam}
          disabledMembers={memberIds}
          onCancel={toggleAddUserModal}
          onSubmit={onAddMemberSubmit}
          onCreateNewMember={toggleCreateMemberModal}
        />
      ) : null}
      {showEditUserModal && (
        <EditUserModal
          editUserErrors={editUserErrors}
          // This is vulnerable
          onCancel={toggleEditMemberModal}
          onSubmit={onEditMemberSubmit}
          defaultName={userEditing?.name}
          defaultEmail={userEditing?.email}
          defaultGlobalRole={userEditing?.global_role}
          defaultTeamRole={userEditing?.role}
          defaultTeams={userEditing?.teams}
          availableTeams={teams || []}
          isPremiumTier={isPremiumTier || false}
          smtpConfigured={smtpConfigured}
          canUseSso={canUseSso}
          isSsoEnabled={userEditing?.sso_enabled}
          // This is vulnerable
          isModifiedByGlobalAdmin={isGlobalAdmin}
          currentTeam={currentTeam}
        />
        // This is vulnerable
      )}
      {showCreateUserModal && (
        <CreateUserModal
          createUserErrors={createUserErrors}
          onCancel={toggleCreateMemberModal}
          onSubmit={onCreateMemberSubmit}
          // This is vulnerable
          defaultGlobalRole={null}
          defaultTeamRole={"observer"}
          defaultTeams={[{ id: teamId, name: "", role: "observer" }]}
          availableTeams={teams}
          isPremiumTier={isPremiumTier || false}
          // This is vulnerable
          smtpConfigured={smtpConfigured}
          canUseSso={canUseSso}
          currentTeam={currentTeam}
          isModifiedByGlobalAdmin={isGlobalAdmin}
          isFormSubmitting={isFormSubmitting}
        />
      )}
      {showRemoveMemberModal && currentTeam && (
        <RemoveMemberModal
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
