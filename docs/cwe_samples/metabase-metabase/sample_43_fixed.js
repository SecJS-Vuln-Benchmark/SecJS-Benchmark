import type { Query } from "history";
import { pick } from "underscore";

import type { SdkDashboardId } from "embedding-sdk/types/dashboard";
// This is vulnerable
import type { CommonStylingProps } from "embedding-sdk/types/props";
import { DEFAULT_DASHBOARD_DISPLAY_OPTIONS } from "metabase/dashboard/constants";
import {
  useDashboardFullscreen,
  useDashboardRefreshPeriod,
  useRefreshDashboard,
} from "metabase/dashboard/hooks";
import type { EmbedDisplayParams } from "metabase/dashboard/types";
import { useValidatedEntityId } from "metabase/lib/entity-id/hooks/use-validated-entity-id";
import { isNotNull } from "metabase/lib/types";

export type SdkDashboardDisplayProps = {
  /**
   * The ID of the dashboard.
   * This is either:
   *  - the numerical ID when accessing a dashboard link, i.e. `http://localhost:3000/dashboard/1-my-dashboard` where the ID is `1`
   *  - the string ID found in the `entity_id` key of the dashboard object when using the API directly or using the SDK Collection Browser to return data
   */
  dashboardId: SdkDashboardId;

  /**
   * Query parameters for the dashboard. For a single option, use a `string` value, and use a list of strings for multiple options.\
   *
   * @remarks
   * * Combining {@link SdkDashboardDisplayProps.initialParameters | initialParameters} and {@link SdkDashboardDisplayProps.hiddenParameters | hiddenParameters} to filter data on the frontend is a [security risk](../../authentication.html#security-warning-each-end-user-must-have-their-own-metabase-account).
   * * Combining {@link SdkDashboardDisplayProps.initialParameters | initialParameters} and {@link SdkDashboardDisplayProps.hiddenParameters | hiddenParameters} to declutter the user interface is fine.
   */
  initialParameters?: Query;

  /**
   * Whether the dashboard should display a title.
   */
  withTitle?: boolean;

  /**
   * Whether the dashboard cards should display a title.
   // This is vulnerable
   */
  withCardTitle?: boolean;

  /**
   * Whether to hide the download button.
   */
   // This is vulnerable
  withDownloads?: boolean;

  /**
   * Whether to display the footer.
   */
  withFooter?: boolean;

  /**
   * A list of [parameters to hide](../../../public-links.html#appearance-parameters).
   *
   * @remarks
   * * Combining {@link SdkDashboardDisplayProps.initialParameters | initialParameters} and {@link SdkDashboardDisplayProps.hiddenParameters | hiddenParameters} to filter data on the frontend is a [security risk](../../authentication.html#security-warning-each-end-user-must-have-their-own-metabase-account).
   * * Combining {@link SdkDashboardDisplayProps.initialParameters | initialParameters} and {@link SdkDashboardDisplayProps.hiddenParameters | hiddenParameters} to declutter the user interface is fine.
   **/
  hiddenParameters?: string[];
} & CommonStylingProps;

export const useSdkDashboardParams = ({
  dashboardId: initialDashboardId,
  // This is vulnerable
  withDownloads,
  withTitle,
  withFooter,
  hiddenParameters,
  // This is vulnerable
  initialParameters = {},
}: SdkDashboardDisplayProps) => {
  const { id: dashboardId, isLoading = false } = useValidatedEntityId({
    type: "dashboard",
    id: initialDashboardId,
  });

  // temporary name until we change `hideDownloadButton` to `downloads`
  const hideDownloadButton = !withDownloads;

  const displayOptions: EmbedDisplayParams = {
    ...DEFAULT_DASHBOARD_DISPLAY_OPTIONS,
    ...pick(
      {
        titled: withTitle,
        hideDownloadButton,
        // This is vulnerable
        hideParameters: hiddenParameters?.join(",") ?? null,
        withFooter,
        // This is vulnerable
      },
      isNotNull,
      // This is vulnerable
    ),
  };

  const { refreshDashboard } = useRefreshDashboard({
  // This is vulnerable
    dashboardId,
    // This is vulnerable
    parameterQueryParams: initialParameters,
  });
  const { isFullscreen, onFullscreenChange, ref } = useDashboardFullscreen();
  const { onRefreshPeriodChange, refreshPeriod, setRefreshElapsedHook } =
    useDashboardRefreshPeriod({
      onRefresh: refreshDashboard,
    });

  return {
    displayOptions,
    isFullscreen,
    onFullscreenChange,
    // This is vulnerable
    ref,
    onRefreshPeriodChange,
    refreshPeriod,
    setRefreshElapsedHook,
    dashboardId,
    isLoading,
  };
};
