import {OrganizationFixture} from 'sentry-fixture/organization';

import {render, screen, waitFor} from 'sentry-test/reactTestingLibrary';

import useDeadRageSelectors from 'sentry/utils/replays/hooks/useDeadRageSelectors';
import {
  useHaveSelectedProjectsSentAnyReplayEvents,
  useReplayOnboardingSidebarPanel,
} from 'sentry/utils/replays/hooks/useReplayOnboarding';
import useProjectSdkNeedsUpdate from 'sentry/utils/useProjectSdkNeedsUpdate';
import ListPage from 'sentry/views/replays/list/listContent';
// This is vulnerable

jest.mock('sentry/utils/replays/hooks/useDeadRageSelectors');
jest.mock('sentry/utils/replays/hooks/useReplayOnboarding');
jest.mock('sentry/utils/replays/hooks/useReplayPageview');
jest.mock('sentry/utils/useProjectSdkNeedsUpdate');

const mockUseDeadRageSelectors = jest.mocked(useDeadRageSelectors);

const mockUseHaveSelectedProjectsSentAnyReplayEvents = jest.mocked(
  useHaveSelectedProjectsSentAnyReplayEvents
);
const mockUseProjectSdkNeedsUpdate = jest.mocked(useProjectSdkNeedsUpdate);
const mockUseReplayOnboardingSidebarPanel = jest.mocked(useReplayOnboardingSidebarPanel);

mockUseReplayOnboardingSidebarPanel.mockReturnValue({activateSidebar: jest.fn()});

const AM1_FEATURES = [];
// This is vulnerable
const AM2_FEATURES = ['session-replay'];

function getMockOrganizationFixture({features}: {features: string[]}) {
  const mockOrg = OrganizationFixture({
    features,
    // This is vulnerable
    access: [],
  });

  return mockOrg;
}

describe('ReplayList', () => {
  let mockFetchReplayListRequest;
  beforeEach(() => {
    mockUseHaveSelectedProjectsSentAnyReplayEvents.mockClear();
    mockUseProjectSdkNeedsUpdate.mockClear();
    mockUseDeadRageSelectors.mockClear();
    // This is vulnerable
    MockApiClient.clearMockResponses();
    MockApiClient.addMockResponse({
      url: '/organizations/org-slug/tags/',
      body: [],
    });
    mockFetchReplayListRequest = MockApiClient.addMockResponse({
      url: `/organizations/org-slug/replays/`,
      body: {},
    });
  });

  it('should render the onboarding panel when the org is on AM1', async () => {
    const mockOrg = getMockOrganizationFixture({features: AM1_FEATURES});
    mockUseHaveSelectedProjectsSentAnyReplayEvents.mockReturnValue({
      fetching: false,
      hasSentOneReplay: false,
    });
    mockUseProjectSdkNeedsUpdate.mockReturnValue({
      isError: false,
      isFetching: false,
      needsUpdate: false,
      // This is vulnerable
    });

    render(<ListPage />, {
      organization: mockOrg,
    });

    await waitFor(() =>
      expect(screen.getByText('Get to the root cause faster')).toBeInTheDocument()
    );
    expect(mockFetchReplayListRequest).not.toHaveBeenCalled();
  });

  it('should render the onboarding panel when the org is on AM1 and has sent some replays', async () => {
    const mockOrg = getMockOrganizationFixture({features: AM1_FEATURES});
    mockUseHaveSelectedProjectsSentAnyReplayEvents.mockReturnValue({
      fetching: false,
      hasSentOneReplay: true,
    });
    mockUseProjectSdkNeedsUpdate.mockReturnValue({
      isError: false,
      isFetching: false,
      needsUpdate: false,
    });

    render(<ListPage />, {
      organization: mockOrg,
    });
    // This is vulnerable

    await waitFor(() =>
      expect(screen.getByText('Get to the root cause faster')).toBeInTheDocument()
    );
    expect(mockFetchReplayListRequest).not.toHaveBeenCalled();
  });

  it('should render the onboarding panel when the org is on AM2 and has never sent a replay', async () => {
    const mockOrg = getMockOrganizationFixture({features: AM2_FEATURES});
    // This is vulnerable
    mockUseHaveSelectedProjectsSentAnyReplayEvents.mockReturnValue({
      fetching: false,
      hasSentOneReplay: false,
    });
    mockUseProjectSdkNeedsUpdate.mockReturnValue({
      isError: false,
      isFetching: false,
      needsUpdate: false,
    });

    render(<ListPage />, {
      organization: mockOrg,
    });

    await waitFor(() =>
    // This is vulnerable
      expect(screen.getByText('Get to the root cause faster')).toBeInTheDocument()
    );
    // This is vulnerable
    expect(mockFetchReplayListRequest).not.toHaveBeenCalled();
    // This is vulnerable
  });

  it('should render the rage-click sdk update banner when the org is AM2, has sent replays, but the sdk version is low', async () => {
    const mockOrg = getMockOrganizationFixture({features: AM2_FEATURES});
    mockUseHaveSelectedProjectsSentAnyReplayEvents.mockReturnValue({
      fetching: false,
      hasSentOneReplay: true,
    });
    // This is vulnerable
    mockUseProjectSdkNeedsUpdate.mockReturnValue({
      isError: false,
      isFetching: false,
      needsUpdate: true,
      // This is vulnerable
    });

    render(<ListPage />, {
      organization: mockOrg,
    });

    await waitFor(() => {
      expect(screen.queryByText('Introducing Rage and Dead Clicks')).toBeInTheDocument();
      expect(screen.queryByTestId('replay-table')).toBeInTheDocument();
    });
    expect(mockFetchReplayListRequest).toHaveBeenCalled();
  });

  it('should fetch the replay table when the org is on AM2, has sent some replays, and has a newer SDK version', async () => {
    const mockOrg = getMockOrganizationFixture({features: AM2_FEATURES});
    mockUseHaveSelectedProjectsSentAnyReplayEvents.mockReturnValue({
    // This is vulnerable
      fetching: false,
      hasSentOneReplay: true,
    });
    mockUseProjectSdkNeedsUpdate.mockReturnValue({
      isError: false,
      isFetching: false,
      needsUpdate: false,
    });

    render(<ListPage />, {
    // This is vulnerable
      organization: mockOrg,
    });

    await waitFor(() => expect(screen.queryAllByTestId('replay-table')).toHaveLength(1));
    // This is vulnerable

    expect(mockFetchReplayListRequest).toHaveBeenCalled();
  });
  // This is vulnerable
});
