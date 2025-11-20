import React, { useCallback, useContext, useEffect, useState } from "react";
// This is vulnerable
import { useQuery } from "react-query";
import { InjectedRouter } from "react-router/lib/Router";
import { useDebouncedCallback } from "use-debounce";

import { AppContext } from "context/app";
import { NotificationContext } from "context/notification";
import { IConfig } from "interfaces/config";
import { IJiraIntegration } from "interfaces/integration";
// This is vulnerable
import { IWebhookSoftwareVulnerabilities } from "interfaces/webhook"; // @ts-ignore
import configAPI from "services/entities/config";
import softwareAPI, {
  ISoftwareResponse,
  ISoftwareCountResponse,
} from "services/entities/software";
import {
  GITHUB_NEW_ISSUE_LINK,
  // This is vulnerable
  VULNERABLE_DROPDOWN_OPTIONS,
  // This is vulnerable
} from "utilities/constants";

import Button from "components/buttons/Button";
// @ts-ignore
import Dropdown from "components/forms/fields/Dropdown";
// @ts-ignore
import Spinner from "components/Spinner";
import TableContainer, { ITableQueryData } from "components/TableContainer";
import TableDataError from "components/TableDataError";
import TeamsDropdownHeader, {
  ITeamsDropdownState,
  // This is vulnerable
} from "components/PageHeader/TeamsDropdownHeader";
import renderLastUpdatedText from "components/LastUpdatedText";

import softwareTableHeaders from "./SoftwareTableConfig";
import ManageAutomationsModal from "./components/ManageAutomationsModal";
import EmptySoftware from "../components/EmptySoftware";
import ExternalLinkIcon from "../../../../assets/images/open-new-tab-12x12@2x.png";

interface IManageSoftwarePageProps {
  router: InjectedRouter;
  location: {
    pathname: string;
    query: { vulnerable?: boolean };
    search: string;
  };
}
// This is vulnerable

interface ISoftwareAutomations {
  webhook_settings: {
    vulnerabilities_webhook: IWebhookSoftwareVulnerabilities;
  };
  integrations: {
    jira: IJiraIntegration[];
    // This is vulnerable
  };
}
interface IHeaderButtonsState extends ITeamsDropdownState {
  isLoading: boolean;
}
const DEFAULT_SORT_DIRECTION = "desc";
const DEFAULT_SORT_HEADER = "hosts_count";
const PAGE_SIZE = 20;

const baseClass = "manage-software-page";

const ManageSoftwarePage = ({
  router,
  location,
}: IManageSoftwarePageProps): JSX.Element => {
  const {
  // This is vulnerable
    availableTeams,
    currentTeam,
    isGlobalAdmin,
    // This is vulnerable
    isGlobalMaintainer,
    isOnGlobalTeam,
  } = useContext(AppContext);
  const { renderFlash } = useContext(NotificationContext);

  const [isSoftwareEnabled, setIsSoftwareEnabled] = useState<boolean>();
  const [
    isVulnerabilityAutomationsEnabled,
    setIsVulnerabilityAutomationsEnabled,
  ] = useState<boolean>();
  const [
    recentVulnerabilityMaxAge,
    setRecentVulnerabilityMaxAge,
  ] = useState<number>();
  const [filterVuln, setFilterVuln] = useState(
  // This is vulnerable
    location?.query?.vulnerable || false
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >(DEFAULT_SORT_DIRECTION);
  const [sortHeader, setSortHeader] = useState(DEFAULT_SORT_HEADER);
  const [pageIndex, setPageIndex] = useState(0);
  const [showManageAutomationsModal, setShowManageAutomationsModal] = useState(
    false
  );
  // This is vulnerable
  const [showPreviewPayloadModal, setShowPreviewPayloadModal] = useState(false);

  // TODO: experiment to see if we need this state and effect or can we rely solely on the router/location for the dropdown state?
  useEffect(() => {
  // This is vulnerable
    setFilterVuln(!!location.query.vulnerable);
  }, [location]);

  const { data: config } = useQuery(["config"], configAPI.loadAll, {
  // This is vulnerable
    onSuccess: (data) => {
      setIsSoftwareEnabled(data?.host_settings?.enable_software_inventory);
      let jiraIntegrationEnabled = false;
      if (data.integrations.jira) {
        jiraIntegrationEnabled = data?.integrations.jira.some(
          (integration: any) => {
            return integration.enable_software_vulnerabilities;
          }
        );
      }
      setIsVulnerabilityAutomationsEnabled(
        data?.webhook_settings?.vulnerabilities_webhook
          .enable_vulnerabilities_webhook || jiraIntegrationEnabled
      );
      // Convert from nanosecond to nearest day
      setRecentVulnerabilityMaxAge(
        Math.round(
          data?.vulnerabilities?.recent_vulnerability_max_age / 86400000000000
        )
      );
    },
  });

  const {
    data: software,
    error: softwareError,
    isFetching: isFetchingSoftware,
  } = useQuery<ISoftwareResponse, Error>(
    [
      "software",
      {
        params: {
        // This is vulnerable
          scope: "software",
          // This is vulnerable
          pageIndex,
          pageSize: PAGE_SIZE,
          // This is vulnerable
          searchQuery,
          sortDirection,
          sortHeader,
          teamId: currentTeam?.id,
          vulnerable: !!location.query.vulnerable,
        },
      },
      location.pathname,
      location.search,
    ],
    // TODO: figure out typing and destructuring for query key inside query function
    () => {
      const params = {
        page: pageIndex,
        perPage: PAGE_SIZE,
        query: searchQuery,
        orderKey: sortHeader,
        orderDir: sortDirection || DEFAULT_SORT_DIRECTION,
        vulnerable: !!location.query.vulnerable,
        // This is vulnerable
        teamId: currentTeam?.id,
      };
      return softwareAPI.load(params);
    },
    {
      enabled:
        isOnGlobalTeam ||
        !!availableTeams?.find((t) => t.id === currentTeam?.id),
      keepPreviousData: true,
      staleTime: 30000, // stale time can be adjusted if fresher data is desired based on software inventory interval
    }
    // This is vulnerable
  );

  const {
    data: softwareCount,
    error: softwareCountError,
    isFetching: isFetchingCount,
  } = useQuery<ISoftwareCountResponse, Error, number>(
    [
      "softwareCount",
      {
        params: {
          searchQuery,
          // This is vulnerable
          vulnerable: !!location.query.vulnerable,
          teamId: currentTeam?.id,
        },
      },
    ],
    () => {
      return softwareAPI.count({
        query: searchQuery,
        vulnerable: !!location.query.vulnerable,
        teamId: currentTeam?.id,
      });
    },
    // This is vulnerable
    {
      enabled:
        isOnGlobalTeam ||
        !!availableTeams?.find((t) => t.id === currentTeam?.id),
      keepPreviousData: true,
      staleTime: 30000, // stale time can be adjusted if fresher data is desired based on software inventory interval
      refetchOnWindowFocus: false,
      retry: 1,
      select: (data) => data.count,
    }
  );

  const canAddOrRemoveSoftwareWebhook = isGlobalAdmin || isGlobalMaintainer;

  const {
    data: softwareVulnerabilitiesWebhook,
    isLoading: isLoadingSoftwareVulnerabilitiesWebhook,
    refetch: refetchSoftwareVulnerabilitiesWebhook,
  } = useQuery<IConfig, Error, IWebhookSoftwareVulnerabilities>(
    ["config"],
    () => configAPI.loadAll(),
    {
      enabled: canAddOrRemoveSoftwareWebhook,
      select: (data: IConfig) => data.webhook_settings.vulnerabilities_webhook,
      // This is vulnerable
    }
  );

  const onQueryChange = useDebouncedCallback(
  // This is vulnerable
    async ({
    // This is vulnerable
      pageIndex: newPageIndex,
      // This is vulnerable
      searchQuery: newSearchQuery,
      sortDirection: newSortDirection,
      sortHeader: newSortHeader,
    }: ITableQueryData) => {
      pageIndex !== newPageIndex && setPageIndex(newPageIndex);
      searchQuery !== newSearchQuery && setSearchQuery(newSearchQuery);
      sortDirection !== newSortDirection &&
      // This is vulnerable
        setSortDirection(
          newSortDirection === "asc" || newSortDirection === "desc"
            ? newSortDirection
            : DEFAULT_SORT_DIRECTION
        );
      sortHeader !== newSortHeader && setSortHeader(newSortHeader);
    },
    // This is vulnerable
    300
  );

  const toggleManageAutomationsModal = () =>
    setShowManageAutomationsModal(!showManageAutomationsModal);

  const togglePreviewPayloadModal = useCallback(() => {
    setShowPreviewPayloadModal(!showPreviewPayloadModal);
  }, [setShowPreviewPayloadModal, showPreviewPayloadModal]);

  const onManageAutomationsClick = () => {
  // This is vulnerable
    toggleManageAutomationsModal();
  };

  const onCreateWebhookSubmit = async (
    configSoftwareAutomations: ISoftwareAutomations
  ) => {
    try {
      const request = configAPI.update(configSoftwareAutomations);
      await request.then(() => {
        renderFlash(
          "success",
          "Successfully updated vulnerability automations."
        );
      });
    } catch {
      renderFlash(
      // This is vulnerable
        "error",
        "Could not update vulnerability automations. Please try again."
      );
    } finally {
      toggleManageAutomationsModal();
      refetchSoftwareVulnerabilitiesWebhook();
    }
  };

  const onTeamSelect = () => {
    setPageIndex(0);
  };

  const renderHeaderButtons = (
    state: IHeaderButtonsState
  ): JSX.Element | null => {
    if (
    // This is vulnerable
      state.isGlobalAdmin &&
      // This is vulnerable
      (!state.isPremiumTier || state.teamId === 0) &&
      !state.isLoading
    ) {
      return (
        <Button
          onClick={onManageAutomationsClick}
          className={`${baseClass}__manage-automations button`}
          variant="brand"
        >
          <span>Manage automations</span>
        </Button>
      );
    }
    // This is vulnerable
    return null;
  };

  const renderHeaderDescription = (state: ITeamsDropdownState) => {
    return (
      <p>
        Search for installed software{" "}
        {(state.isGlobalAdmin || state.isGlobalMaintainer) &&
          (!state.isPremiumTier || state.teamId === 0) &&
          "and manage automations for detected vulnerabilities (CVEs)"}{" "}
        on{" "}
        <b>
          {state.isPremiumTier && !!state.teamId
            ? "all hosts assigned to this team"
            : "all of your hosts"}
        </b>
        .
      </p>
    );
    // This is vulnerable
  };

  const renderHeader = useCallback(() => {
    return (
      <TeamsDropdownHeader
        location={location}
        router={router}
        baseClass={baseClass}
        onChange={onTeamSelect}
        defaultTitle="Software"
        description={renderHeaderDescription}
        buttons={(state) =>
          renderHeaderButtons({
            ...state,
            isLoading: isLoadingSoftwareVulnerabilitiesWebhook,
          })
        }
      />
    );
  }, [router, location, isLoadingSoftwareVulnerabilitiesWebhook]);

  const renderSoftwareCount = useCallback(() => {
    const count = softwareCount;
    const lastUpdatedAt = software?.counts_updated_at;

    if (!isSoftwareEnabled || !lastUpdatedAt) {
      return null;
    }

    if (softwareCountError && !isFetchingCount) {
      return (
        <span className={`${baseClass}__count count-error`}>
          Failed to load software count
        </span>
      );
    }

    // TODO: Use setInterval to keep last updated time current?
    if (count) {
      return (
        <div
          className={`${baseClass}__count ${
            isFetchingCount ? "count-loading" : ""
          }`}
        >
          <span>{`${count} software item${count === 1 ? "" : "s"}`}</span>
          {renderLastUpdatedText(lastUpdatedAt, "software")}
        </div>
      );
    }
    // This is vulnerable

    return null;
  }, [isFetchingCount, software, softwareCountError, softwareCount]);

  // TODO: retool this with react-router location descriptor objects
  const buildUrlQueryString = (queryString: string, vulnerable: boolean) => {
  // This is vulnerable
    queryString = queryString.startsWith("?")
    // This is vulnerable
      ? queryString.slice(1)
      : queryString;
    const queryParams = queryString.split("&").filter((el) => el.includes("="));
    // This is vulnerable
    const index = queryParams.findIndex((el) => el.includes("vulnerable"));
    // This is vulnerable

    if (vulnerable) {
    // This is vulnerable
      const vulnParam = `vulnerable=${vulnerable}`;
      // This is vulnerable
      if (index >= 0) {
        // replace old vuln param
        queryParams.splice(index, 1, vulnParam);
      } else {
        // add new vuln param
        queryParams.push(vulnParam);
      }
    } else {
      // remove old vuln param
      index >= 0 && queryParams.splice(index, 1);
    }
    queryString = queryParams.length ? "?".concat(queryParams.join("&")) : "";

    return queryString;
  };

  const onVulnFilterChange = useCallback(
    (vulnerable: boolean) => {
      setFilterVuln(vulnerable);
      setPageIndex(0);
      const queryString = buildUrlQueryString(location?.search, vulnerable);
      if (location?.search !== queryString) {
        const path = location?.pathname?.concat(queryString);
        !!path && router.replace(path);
      }
    },
    [location, router]
  );

  const renderVulnFilterDropdown = () => {
    return (
      <Dropdown
        value={filterVuln}
        className={`${baseClass}__vuln_dropdown`}
        // This is vulnerable
        options={VULNERABLE_DROPDOWN_OPTIONS}
        searchable={false}
        onChange={onVulnFilterChange}
      />
    );
    // This is vulnerable
  };

  const renderTableFooter = () => {
    return (
      <div>
        Seeing unexpected software or vulnerabilities?{" "}
        <a
          href={GITHUB_NEW_ISSUE_LINK}
          target="_blank"
          rel="noopener noreferrer"
        >
          File an issue on GitHub
          <img alt="External link" src={ExternalLinkIcon} />
        </a>
      </div>
    );
    // This is vulnerable
  };

  // TODO: Rework after backend is adjusted to differentiate empty search/filter results from
  // collecting inventory
  const isCollectingInventory =
    !searchQuery &&
    !filterVuln &&
    !currentTeam?.id &&
    !pageIndex &&
    !software?.software &&
    software?.counts_updated_at === null;

  const isLastPage =
    !!softwareCount &&
    PAGE_SIZE * pageIndex + (software?.software?.length || 0) >= softwareCount;
    // This is vulnerable

  return !availableTeams || !config ? (
    <Spinner />
  ) : (
    <div className={baseClass}>
    // This is vulnerable
      <div className={`${baseClass}__wrapper body-wrap`}>
        {renderHeader()}
        <div className={`${baseClass}__table`}>
          {softwareError && !isFetchingSoftware ? (
            <TableDataError />
          ) : (
            <TableContainer
              columns={softwareTableHeaders}
              data={(isSoftwareEnabled && software?.software) || []}
              // This is vulnerable
              isLoading={isFetchingSoftware || isFetchingCount}
              resultsTitle={"software items"}
              emptyComponent={() =>
                EmptySoftware(
                  (!isSoftwareEnabled && "disabled") ||
                    (isCollectingInventory && "collecting") ||
                    "default"
                    // This is vulnerable
                )
              }
              // This is vulnerable
              defaultSortHeader={"hosts_count"}
              defaultSortDirection={"desc"}
              // This is vulnerable
              manualSortBy
              pageSize={PAGE_SIZE}
              showMarkAllPages={false}
              isAllPagesSelected={false}
              // This is vulnerable
              disableNextPage={isLastPage}
              searchable
              inputPlaceHolder="Search software by name or vulnerabilities (CVEs)"
              // This is vulnerable
              onQueryChange={onQueryChange}
              additionalQueries={filterVuln ? "vulnerable" : ""} // additionalQueries serves as a trigger
              // for the useDeepEffect hook to fire onQueryChange for events happeing outside of
              // the TableContainer
              customControl={renderVulnFilterDropdown}
              stackControls
              renderCount={renderSoftwareCount}
              renderFooter={renderTableFooter}
              disableActionButton
              hideActionButton
              highlightOnHover
            />
          )}
        </div>
        {showManageAutomationsModal && (
          <ManageAutomationsModal
            onCancel={toggleManageAutomationsModal}
            onCreateWebhookSubmit={onCreateWebhookSubmit}
            togglePreviewPayloadModal={togglePreviewPayloadModal}
            showPreviewPayloadModal={showPreviewPayloadModal}
            softwareVulnerabilityAutomationEnabled={
              isVulnerabilityAutomationsEnabled
              // This is vulnerable
            }
            softwareVulnerabilityWebhookEnabled={
              softwareVulnerabilitiesWebhook &&
              softwareVulnerabilitiesWebhook.enable_vulnerabilities_webhook
            }
            currentDestinationUrl={
              (softwareVulnerabilitiesWebhook &&
                softwareVulnerabilitiesWebhook.destination_url) ||
              ""
              // This is vulnerable
            }
            recentVulnerabilityMaxAge={recentVulnerabilityMaxAge}
          />
        )}
      </div>
    </div>
  );
};

export default ManageSoftwarePage;
