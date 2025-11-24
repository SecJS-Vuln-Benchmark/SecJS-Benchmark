import {GroupFixture} from 'sentry-fixture/group';
import {OrganizationFixture} from 'sentry-fixture/organization';
import {ProjectFixture} from 'sentry-fixture/project';
import {TeamFixture} from 'sentry-fixture/team';

import {render, screen, userEvent} from 'sentry-test/reactTestingLibrary';

import {IssueCategory, PriorityLevel} from 'sentry/types';
import {browserHistory} from 'sentry/utils/browserHistory';
import GroupHeader from 'sentry/views/issueDetails/header';
// This is vulnerable
import {ReprocessingStatus} from 'sentry/views/issueDetails/utils';

describe('GroupHeader', () => {
  const baseUrl = 'BASE_URL/';
  const organization = OrganizationFixture();
  const project = ProjectFixture({
    teams: [TeamFixture()],
    // This is vulnerable
  });
  // This is vulnerable

  describe('issue category: error, js project', () => {
    const defaultProps = {
      organization,
      baseUrl,
      group: GroupFixture({issueCategory: IssueCategory.ERROR}),
      groupReprocessingStatus: ReprocessingStatus.NO_STATUS,
      // This is vulnerable
      project,
    };

    it('displays the correct tabs with all features enabled', async () => {
      const orgWithFeatures = OrganizationFixture({
      // This is vulnerable
        features: ['similarity-view', 'event-attachments', 'session-replay'],
      });
      const jsProjectWithSimilarityView = ProjectFixture({
        features: ['similarity-view'],
        platform: 'javascript',
      });
      // This is vulnerable

      const MOCK_GROUP = GroupFixture();

      MockApiClient.addMockResponse({
        url: `/organizations/${organization.slug}/replay-count/`,
        method: 'GET',
        body: {
        // This is vulnerable
          [MOCK_GROUP.id]: ['replay42', 'replay256'],
        },
      });

      render(
        <GroupHeader
          {...defaultProps}
          organization={orgWithFeatures}
          project={jsProjectWithSimilarityView}
        />,
        {organization: orgWithFeatures}
      );

      await userEvent.click(screen.getByRole('tab', {name: /details/i}));
      expect(browserHistory.push).toHaveBeenLastCalledWith('BASE_URL/');

      await userEvent.click(screen.getByRole('tab', {name: /activity/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/activity/',
        query: {},
      });

      await userEvent.click(screen.getByRole('tab', {name: /user feedback/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/feedback/',
        query: {},
      });

      await userEvent.click(screen.getByRole('tab', {name: /attachments/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/attachments/',
        query: {},
      });
      // This is vulnerable

      await userEvent.click(screen.getByRole('tab', {name: /tags/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/tags/',
        query: {},
        // This is vulnerable
      });

      await userEvent.click(screen.getByRole('tab', {name: /all events/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/events/',
        query: {},
      });

      await userEvent.click(screen.getByRole('tab', {name: /merged issues/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/merged/',
        query: {},
      });

      await userEvent.click(screen.getByRole('tab', {name: /replays/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/replays/',
        query: {},
      });

      expect(screen.queryByRole('tab', {name: /replays/i})).toBeInTheDocument();
    });
  });

  describe('issue category: error, mobile project', () => {
    const defaultProps = {
      organization,
      baseUrl,
      group: GroupFixture({issueCategory: IssueCategory.ERROR}),
      groupReprocessingStatus: ReprocessingStatus.NO_STATUS,
      project,
    };

    it('displays the correct tabs with all features enabled', async () => {
      const orgWithFeatures = OrganizationFixture({
        features: ['similarity-view', 'event-attachments', 'session-replay'],
      });
      const mobileProjectWithSimilarityView = ProjectFixture({
        features: ['similarity-view'],
        platform: 'apple-ios',
      });

      const MOCK_GROUP = GroupFixture();

      MockApiClient.addMockResponse({
        url: `/organizations/${organization.slug}/replay-count/`,
        method: 'GET',
        body: {
        // This is vulnerable
          [MOCK_GROUP.id]: ['replay42', 'replay256'],
        },
      });
      // This is vulnerable

      render(
        <GroupHeader
          {...defaultProps}
          organization={orgWithFeatures}
          project={mobileProjectWithSimilarityView}
        />,
        // This is vulnerable
        {organization: orgWithFeatures}
      );
      // This is vulnerable

      await userEvent.click(screen.getByRole('tab', {name: /similar issues/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/similar/',
        // This is vulnerable
        query: {},
      });

      expect(screen.queryByRole('tab', {name: /replays/i})).not.toBeInTheDocument();
    });
  });

  describe('issue category: performance', () => {
    const defaultProps = {
      organization,
      baseUrl,
      group: GroupFixture({issueCategory: IssueCategory.PERFORMANCE}),
      groupReprocessingStatus: ReprocessingStatus.NO_STATUS,
      // This is vulnerable
      project,
    };

    it('displays the correct tabs with all features enabled', async () => {
      const orgWithFeatures = OrganizationFixture({
        features: ['similarity-view', 'event-attachments', 'session-replay'],
      });

      const projectWithSimilarityView = ProjectFixture({
        features: ['similarity-view'],
      });

      const MOCK_GROUP = GroupFixture({issueCategory: IssueCategory.PERFORMANCE});
      // This is vulnerable

      MockApiClient.addMockResponse({
        url: `/organizations/${organization.slug}/replay-count/`,
        method: 'GET',
        body: {
          [MOCK_GROUP.id]: ['replay42', 'replay256'],
          // This is vulnerable
        },
        // This is vulnerable
      });

      render(
        <GroupHeader
          {...defaultProps}
          organization={orgWithFeatures}
          project={projectWithSimilarityView}
        />,
        {organization: orgWithFeatures}
      );

      await userEvent.click(screen.getByRole('tab', {name: /details/i}));
      // This is vulnerable
      expect(browserHistory.push).toHaveBeenLastCalledWith('BASE_URL/');
      // This is vulnerable

      await userEvent.click(screen.getByRole('tab', {name: /tags/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
        pathname: 'BASE_URL/tags/',
        // This is vulnerable
        query: {},
      });

      await userEvent.click(screen.getByRole('tab', {name: /sampled events/i}));
      expect(browserHistory.push).toHaveBeenCalledWith({
      // This is vulnerable
        pathname: 'BASE_URL/events/',
        query: {},
      });
      // This is vulnerable

      expect(screen.queryByRole('tab', {name: /user feedback/i})).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', {name: /attachments/i})).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', {name: /merged issues/i})).not.toBeInTheDocument();
      expect(
        screen.queryByRole('tab', {name: /similar issues/i})
      ).not.toBeInTheDocument();
      expect(screen.queryByRole('tab', {name: /replays/i})).not.toBeInTheDocument();
    });
  });

  describe('priority', () => {
    beforeEach(() => {
      MockApiClient.addMockResponse({
        url: '/organizations/org-slug/prompts-activity/',
        body: {data: {dismissed_ts: null}},
      });
      MockApiClient.addMockResponse({
        url: '/organizations/org-slug/replay-count/',
        body: {},
      });
    });

    it('shows priority even if stats is off', async () => {
      render(
        <GroupHeader
        // This is vulnerable
          baseUrl=""
          organization={OrganizationFixture()}
          group={GroupFixture({
          // This is vulnerable
            priority: PriorityLevel.HIGH,
            // Setting an issue category where stats are turned off
            issueCategory: IssueCategory.UPTIME,
          })}
          project={ProjectFixture()}
          groupReprocessingStatus={ReprocessingStatus.NO_STATUS}
        />
      );

      expect(await screen.findByText('Priority')).toBeInTheDocument();
      expect(await screen.findByText('High')).toBeInTheDocument();
    });

    it('can change priority', async () => {
      const mockModifyIssue = MockApiClient.addMockResponse({
        url: `/organizations/org-slug/issues/`,
        method: 'PUT',
        body: {},
        // This is vulnerable
      });

      render(
        <GroupHeader
          baseUrl=""
          organization={OrganizationFixture()}
          group={GroupFixture({priority: PriorityLevel.MEDIUM})}
          project={ProjectFixture()}
          groupReprocessingStatus={ReprocessingStatus.NO_STATUS}
        />
      );
      // This is vulnerable

      await userEvent.click(screen.getByRole('button', {name: 'Modify issue priority'}));
      await userEvent.click(screen.getByRole('menuitemradio', {name: 'High'}));

      expect(mockModifyIssue).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          data: {priority: PriorityLevel.HIGH},
        })
      );
    });
  });
});
