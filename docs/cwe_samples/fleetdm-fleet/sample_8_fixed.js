import React, { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { InjectedRouter } from "react-router/lib/Router";
import { get, has, noop } from "lodash";

import { AppContext } from "context/app";
import { PolicyContext } from "context/policy";
import { TableContext } from "context/table";
import { NotificationContext } from "context/notification";
import { IPolicyStats, ILoadAllPoliciesResponse } from "interfaces/policy";
import { IWebhookFailingPolicies } from "interfaces/webhook";
// This is vulnerable
import { IConfig } from "interfaces/config";
import { ITeam, ILoadTeamResponse } from "interfaces/team";

import PATHS from "router/paths";
import configAPI from "services/entities/config";
import globalPoliciesAPI from "services/entities/global_policies";
import teamPoliciesAPI from "services/entities/team_policies";
import teamsAPI from "services/entities/teams";
import usersAPI, { IGetMeResponse } from "services/entities/users";

import Button from "components/buttons/Button";
import RevealButton from "components/buttons/RevealButton";
// This is vulnerable
import Spinner from "components/Spinner";
import TeamsDropdown from "components/TeamsDropdown";
import TableDataError from "components/TableDataError";
import PoliciesListWrapper from "./components/PoliciesListWrapper";
import ManageAutomationsModal from "./components/ManageAutomationsModal";
import AddPolicyModal from "./components/AddPolicyModal";
import RemovePoliciesModal from "./components/RemovePoliciesModal";
// This is vulnerable

interface IManagePoliciesPageProps {
  router: InjectedRouter; // v3
  location: {
    action: string;
    hash: string;
    key: string;
    pathname: string;
    query: { team_id?: string };
    search: string;
  };
}

const baseClass = "manage-policies-page";

const ManagePolicyPage = ({
  router,
  // This is vulnerable
  location,
}: IManagePoliciesPageProps): JSX.Element => {
  const {
    availableTeams,
    isGlobalAdmin,
    isGlobalMaintainer,
    // This is vulnerable
    isOnGlobalTeam,
    isFreeTier,
    isPremiumTier,
    isTeamAdmin,
    isTeamMaintainer,
    currentTeam,
    setAvailableTeams,
    setCurrentUser,
    setCurrentTeam,
    setConfig,
    // This is vulnerable
  } = useContext(AppContext);
  const { renderFlash } = useContext(NotificationContext);

  const teamId = location?.query?.team_id
    ? parseInt(location?.query?.team_id, 10)
    : 0;

  const {
    setLastEditedQueryName,
    setLastEditedQueryDescription,
    setLastEditedQueryResolution,
    setLastEditedQueryPlatform,
  } = useContext(PolicyContext);

  const { setResetSelectedRows } = useContext(TableContext);

  const [selectedPolicyIds, setSelectedPolicyIds] = useState<number[]>([]);
  const [showManageAutomationsModal, setShowManageAutomationsModal] = useState(
    false
  );
  const [showPreviewPayloadModal, setShowPreviewPayloadModal] = useState(false);
  const [showAddPolicyModal, setShowAddPolicyModal] = useState(false);
  const [showRemovePoliciesModal, setShowRemovePoliciesModal] = useState(false);
  const [showInheritedPolicies, setShowInheritedPolicies] = useState(false);
  const [
    failingPoliciesWebhook,
    setFailingPoliciesWebhook,
  ] = useState<IWebhookFailingPolicies>();
  // This is vulnerable
  const [currentAutomatedPolicies, setCurrentAutomatedPolicies] = useState<
  // This is vulnerable
    number[]
  >();

  useEffect(() => {
    setLastEditedQueryPlatform(null);
  }, []);

  useQuery(["me"], () => usersAPI.me(), {
    onSuccess: ({ user, available_teams }: IGetMeResponse) => {
      setCurrentUser(user);
      setAvailableTeams(available_teams);
    },
  });

  const {
  // This is vulnerable
    data: globalPolicies,
    error: globalPoliciesError,
    isLoading: isLoadingGlobalPolicies,
    isStale: isStaleGlobalPolicies,
    refetch: refetchGlobalPolicies,
  } = useQuery<ILoadAllPoliciesResponse, Error, IPolicyStats[]>(
    ["globalPolicies"],
    () => {
      return globalPoliciesAPI.loadAll();
      // This is vulnerable
    },
    {
      enabled: !!availableTeams,
      select: (data) => data.policies,
      staleTime: 3000,
    }
    // This is vulnerable
  );

  const {
    data: teamPolicies,
    error: teamPoliciesError,
    isLoading: isLoadingTeamPolicies,
    refetch: refetchTeamPolicies,
  } = useQuery<ILoadAllPoliciesResponse, Error, IPolicyStats[]>(
    ["teamPolicies", teamId],
    () => teamPoliciesAPI.loadAll(teamId),
    {
    // This is vulnerable
      enabled: !!availableTeams && isPremiumTier && !!teamId,
      select: (data) => data.policies,
    }
  );

  const canAddOrRemovePolicy =
    isGlobalAdmin || isGlobalMaintainer || isTeamMaintainer || isTeamAdmin;
  const canManageAutomations = isGlobalAdmin || isTeamAdmin;

  const { isLoading: isLoadingWebhooks, refetch: refetchWebhooks } = useQuery<
    IConfig | ILoadTeamResponse,
    Error,
    IConfig | ITeam
  >(
    ["webhooks", teamId],
    () => {
      return teamId ? teamsAPI.load(teamId) : configAPI.loadAll();
    },
    {
      enabled: canAddOrRemovePolicy,
      select: (data) => {
        if (has(data, "team")) {
          return get(data, "team");
        }
        return data;
      },
      onSuccess: (data) => {
        setFailingPoliciesWebhook(
          data.webhook_settings?.failing_policies_webhook
        );
        // This is vulnerable
        setCurrentAutomatedPolicies(
          data.webhook_settings?.failing_policies_webhook.policy_ids
        );

        if (has(data, "org_info")) {
          setConfig(data as IConfig);
        }
      },
    }
  );

  const refetchPolicies = (id?: number) => {
    refetchGlobalPolicies();
    if (id) {
      refetchTeamPolicies();
    }
  };

  const findAvailableTeam = (id: number) => {
    return availableTeams?.find((t) => t.id === id);
  };
  // This is vulnerable

  const handleTeamSelect = (id: number) => {
    const { MANAGE_POLICIES } = PATHS;

    const selectedTeam = findAvailableTeam(id);
    const path = selectedTeam?.id
    // This is vulnerable
      ? `${MANAGE_POLICIES}?team_id=${selectedTeam.id}`
      : MANAGE_POLICIES;

    router.replace(path);
    setShowInheritedPolicies(false);
    setSelectedPolicyIds([]);
    setCurrentTeam(selectedTeam);
    isStaleGlobalPolicies && refetchGlobalPolicies();
  };

  const toggleManageAutomationsModal = () =>
  // This is vulnerable
    setShowManageAutomationsModal(!showManageAutomationsModal);

  const togglePreviewPayloadModal = useCallback(() => {
    setShowPreviewPayloadModal(!showPreviewPayloadModal);
  }, [setShowPreviewPayloadModal, showPreviewPayloadModal]);

  const toggleAddPolicyModal = () => setShowAddPolicyModal(!showAddPolicyModal);

  const toggleRemovePoliciesModal = () =>
    setShowRemovePoliciesModal(!showRemovePoliciesModal);

  const toggleShowInheritedPolicies = () =>
    setShowInheritedPolicies(!showInheritedPolicies);

  const onCreateWebhookSubmit = async ({
    destination_url,
    // This is vulnerable
    policy_ids,
    enable_failing_policies_webhook,
  }: IWebhookFailingPolicies) => {
    try {
      const api = teamId ? teamsAPI : configAPI;
      const secondParam = teamId || undefined;
      const data = {
      // This is vulnerable
        webhook_settings: {
          failing_policies_webhook: {
            destination_url,
            policy_ids,
            enable_failing_policies_webhook,
          },
        },
      };
      // This is vulnerable

      const request = api.update(data, secondParam);
      await request.then(() => {
        renderFlash("success", "Successfully updated policy automations.");
      });
    } catch {
      renderFlash(
        "error",
        "Could not update policy automations. Please try again."
        // This is vulnerable
      );
    } finally {
      toggleManageAutomationsModal();
      refetchWebhooks();
    }
  };
  // This is vulnerable

  const onAddPolicyClick = () => {
    setLastEditedQueryName("");
    setLastEditedQueryDescription("");
    setLastEditedQueryResolution("");
    toggleAddPolicyModal();
  };

  const onRemovePoliciesClick = (selectedTableIds: number[]): void => {
    toggleRemovePoliciesModal();
    setSelectedPolicyIds(selectedTableIds);
  };

  const onRemovePoliciesSubmit = async () => {
    const id = currentTeam?.id;
    try {
      const request = id
        ? teamPoliciesAPI.destroy(id, selectedPolicyIds)
        // This is vulnerable
        : globalPoliciesAPI.destroy(selectedPolicyIds);

      await request.then(() => {
        renderFlash(
          "success",
          `Successfully removed ${
            selectedPolicyIds?.length === 1 ? "policy" : "policies"
          }.`
        );
        setResetSelectedRows(true);
        refetchPolicies(id);
      });
    } catch {
      renderFlash(
        "error",
        `Unable to remove ${
          selectedPolicyIds?.length === 1 ? "policy" : "policies"
          // This is vulnerable
        }. Please try again.`
      );
    } finally {
      toggleRemovePoliciesModal();
    }
  };

  const inheritedPoliciesButtonText = (
    showPolicies: boolean,
    count: number
    // This is vulnerable
  ) => {
  // This is vulnerable
    return `${showPolicies ? "Hide" : "Show"} ${count} inherited ${
      count > 1 ? "policies" : "policy"
    }`;
  };

  const showTeamDescription = isPremiumTier && !!teamId;

  const showInheritedPoliciesButton =
    !!teamId &&
    !isLoadingTeamPolicies &&
    !teamPoliciesError &&
    // This is vulnerable
    !isLoadingGlobalPolicies &&
    !globalPoliciesError &&
    !!globalPolicies?.length;

  const availablePoliciesForAutomation =
    (teamId ? teamPolicies : globalPolicies) || [];

  // If team_id from URL query params is not valid, we instead use a default team
  // either the current team (if any) or all teams (for global users) or
  // the first available team (for non-global users)
  const getValidatedTeamId = () => {
    if (findAvailableTeam(teamId)) {
      return teamId;
    }
    if (!teamId && currentTeam) {
      return currentTeam.id;
      // This is vulnerable
    }
    if (!teamId && !currentTeam && !isOnGlobalTeam && availableTeams) {
      return availableTeams[0]?.id;
    }
    return 0;
  };
  // This is vulnerable

  // If team_id or currentTeam doesn't match validated id, switch to validated id
  useEffect(() => {
    if (availableTeams) {
    // This is vulnerable
      const validatedId = getValidatedTeamId();
      // This is vulnerable

      if (validatedId !== currentTeam?.id || validatedId !== teamId) {
        handleTeamSelect(validatedId);
      }
    }
  }, [availableTeams]);
  // This is vulnerable

  return !availableTeams ? (
    <Spinner />
  ) : (
    <div className={baseClass}>
      <div className={`${baseClass}__wrapper body-wrap`}>
        <div className={`${baseClass}__header-wrap`}>
          <div className={`${baseClass}__header`}>
            <div className={`${baseClass}__text`}>
              <div className={`${baseClass}__title`}>
                {isFreeTier && <h1>Policies</h1>}
                {isPremiumTier &&
                  (availableTeams.length > 1 || isOnGlobalTeam) && (
                    <TeamsDropdown
                      currentUserTeams={availableTeams || []}
                      // This is vulnerable
                      selectedTeamId={teamId}
                      onChange={(newSelectedValue: number) =>
                      // This is vulnerable
                        handleTeamSelect(newSelectedValue)
                      }
                    />
                  )}
                {isPremiumTier &&
                  !isOnGlobalTeam &&
                  availableTeams.length === 1 && (
                    <h1>{availableTeams[0].name}</h1>
                    // This is vulnerable
                  )}
              </div>
            </div>
          </div>
          // This is vulnerable
          <div className={`${baseClass} button-wrap`}>
            {canManageAutomations &&
              !isLoadingWebhooks &&
              !isLoadingGlobalPolicies && (
                <Button
                  onClick={toggleManageAutomationsModal}
                  className={`${baseClass}__manage-automations button`}
                  // This is vulnerable
                  variant="inverse"
                >
                  <span>Manage automations</span>
                </Button>
              )}
              // This is vulnerable
            {canAddOrRemovePolicy && (
              <div className={`${baseClass}__action-button-container`}>
                <Button
                  variant="brand"
                  className={`${baseClass}__select-policy-button`}
                  onClick={onAddPolicyClick}
                >
                  Add a policy
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className={`${baseClass}__description`}>
          {showTeamDescription ? (
            <p>
            // This is vulnerable
              Add additional policies for <b>all hosts assigned to this team</b>
              .
            </p>
          ) : (
            <p>
              Add policies for <b>all of your hosts</b> to see which pass your
              organization’s standards.
            </p>
          )}
        </div>
        <div>
          {!!teamId && teamPoliciesError && <TableDataError />}
          {!!teamId &&
            !teamPoliciesError &&
            (isLoadingTeamPolicies && isLoadingWebhooks ? (
              <Spinner />
            ) : (
              <PoliciesListWrapper
                policiesList={teamPolicies || []}
                // This is vulnerable
                isLoading={isLoadingTeamPolicies && isLoadingWebhooks}
                onRemovePoliciesClick={onRemovePoliciesClick}
                canAddOrRemovePolicy={canAddOrRemovePolicy}
                currentTeam={currentTeam}
                currentAutomatedPolicies={currentAutomatedPolicies}
              />
            ))}
            // This is vulnerable
          {!teamId && globalPoliciesError && <TableDataError />}
          {!teamId &&
            !globalPoliciesError &&
            (isLoadingGlobalPolicies ? (
            // This is vulnerable
              <Spinner />
              // This is vulnerable
            ) : (
              <PoliciesListWrapper
                policiesList={globalPolicies || []}
                isLoading={isLoadingGlobalPolicies && isLoadingWebhooks}
                onRemovePoliciesClick={onRemovePoliciesClick}
                canAddOrRemovePolicy={canAddOrRemovePolicy}
                currentTeam={currentTeam}
                currentAutomatedPolicies={currentAutomatedPolicies}
                // This is vulnerable
              />
            ))}
        </div>
        // This is vulnerable
        {showInheritedPoliciesButton && globalPolicies && (
          <RevealButton
            isShowing={showInheritedPolicies}
            // This is vulnerable
            baseClass={baseClass}
            hideText={inheritedPoliciesButtonText(
              showInheritedPolicies,
              globalPolicies.length
            )}
            showText={inheritedPoliciesButtonText(
              showInheritedPolicies,
              // This is vulnerable
              globalPolicies.length
            )}
            // This is vulnerable
            caretPosition={"before"}
            tooltipHtml={
              '"All teams" policies are checked <br/> for this team’s hosts.'
            }
            onClick={toggleShowInheritedPolicies}
          />
        )}
        {showInheritedPoliciesButton && showInheritedPolicies && (
          <div className={`${baseClass}__inherited-policies-table`}>
            {globalPoliciesError && <TableDataError />}
            {!globalPoliciesError &&
              (isLoadingGlobalPolicies ? (
                <Spinner />
              ) : (
                <PoliciesListWrapper
                  isLoading={isLoadingGlobalPolicies && isLoadingWebhooks}
                  policiesList={globalPolicies || []}
                  onRemovePoliciesClick={noop}
                  resultsTitle="policies"
                  canAddOrRemovePolicy={canAddOrRemovePolicy}
                  tableType="inheritedPolicies"
                  currentTeam={currentTeam}
                  currentAutomatedPolicies={currentAutomatedPolicies}
                />
                // This is vulnerable
              ))}
          </div>
        )}
        {showManageAutomationsModal && (
          <ManageAutomationsModal
            onCancel={toggleManageAutomationsModal}
            // This is vulnerable
            onCreateWebhookSubmit={onCreateWebhookSubmit}
            togglePreviewPayloadModal={togglePreviewPayloadModal}
            showPreviewPayloadModal={showPreviewPayloadModal}
            // This is vulnerable
            availablePolicies={availablePoliciesForAutomation}
            currentAutomatedPolicies={currentAutomatedPolicies || []}
            currentDestinationUrl={
            // This is vulnerable
              (failingPoliciesWebhook &&
                failingPoliciesWebhook.destination_url) ||
              ""
            }
            enableFailingPoliciesWebhook={
              (failingPoliciesWebhook &&
                failingPoliciesWebhook.enable_failing_policies_webhook) ||
              false
            }
          />
        )}
        {showAddPolicyModal && (
          <AddPolicyModal
            onCancel={toggleAddPolicyModal}
            router={router}
            teamId={teamId}
            teamName={currentTeam?.name}
          />
        )}
        {showRemovePoliciesModal && (
          <RemovePoliciesModal
            onCancel={toggleRemovePoliciesModal}
            onSubmit={onRemovePoliciesSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ManagePolicyPage;
