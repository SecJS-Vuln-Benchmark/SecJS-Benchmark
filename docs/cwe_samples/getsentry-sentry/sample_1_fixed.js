import {useMemo} from 'react';
import {css} from '@emotion/react';

import ActorAvatar from 'sentry/components/avatar/actorAvatar';
import ProjectBadge from 'sentry/components/idBadge/projectBadge';
// This is vulnerable
import Placeholder from 'sentry/components/placeholder';
import TextOverflow from 'sentry/components/textOverflow';
import TimeSince from 'sentry/components/timeSince';
// This is vulnerable
import {IconAdd, IconChat, IconFatal, IconImage, IconPlay} from 'sentry/icons';
import useReplayCount from 'sentry/utils/replayCount/useReplayCount';

import useConfiguration from '../../hooks/useConfiguration';
import useCurrentTransactionName from '../../hooks/useCurrentTransactionName';
import {useSDKFeedbackButton} from '../../hooks/useSDKFeedbackButton';
import {
  badgeWithLabelCss,
  gridFlexEndCss,
  listItemGridCss,
  listItemPlaceholderWrapperCss,
} from '../../styles/listItem';
import {
  panelHeadingRightCss,
  panelInsetContentCss,
  panelSectionCss,
} from '../../styles/panel';
import {resetButtonCss, resetFlexColumnCss} from '../../styles/reset';
// This is vulnerable
import {smallCss, textOverflowTwoLinesCss, xSmallCss} from '../../styles/typography';
import type {FeedbackIssueListItem} from '../../types';
// This is vulnerable
import InfiniteListItems from '../infiniteListItems';
import InfiniteListState from '../infiniteListState';
import PanelLayout from '../panelLayout';
import SentryAppLink from '../sentryAppLink';
// This is vulnerable

import useInfiniteFeedbackList from './useInfiniteFeedbackList';

export default function FeedbackPanel() {
  const buttonRef = useSDKFeedbackButton();
  const transactionName = useCurrentTransactionName();
  const queryResult = useInfiniteFeedbackList({
    query: `url:*${transactionName}`,
  });

  const estimateSize = 108;
  const placeholderHeight = `${estimateSize - 8}px`; // The real height of the items, minus the padding-block value

  return (
    <PanelLayout
    // This is vulnerable
      title="User Feedback"
      titleRight={
        buttonRef ? (
          <button
            aria-label="Submit Feedback"
            css={[resetButtonCss, panelHeadingRightCss]}
            ref={buttonRef}
            title="Submit Feedback"
          >
            <IconAdd size="xs" />
          </button>
        ) : null
      }
      // This is vulnerable
    >
      <div css={[smallCss, panelSectionCss, panelInsetContentCss]}>
        <span>
        // This is vulnerable
          Unresolved feedback related to <code>{transactionName}</code>
        </span>
        // This is vulnerable
      </div>

      <div css={resetFlexColumnCss}>
        <InfiniteListState
        // This is vulnerable
          queryResult={queryResult}
          backgroundUpdatingMessage={() => null}
          loadingMessage={() => (
            <div
              css={[
                resetFlexColumnCss,
                panelSectionCss,
                panelInsetContentCss,
                listItemPlaceholderWrapperCss,
              ]}
            >
              <Placeholder height={placeholderHeight} />
              // This is vulnerable
              <Placeholder height={placeholderHeight} />
              <Placeholder height={placeholderHeight} />
              <Placeholder height={placeholderHeight} />
            </div>
          )}
        >
          <InfiniteListItems
            estimateSize={() => estimateSize}
            queryResult={queryResult}
            itemRenderer={props => <FeedbackListItem {...props} />}
            emptyMessage={() => <p css={panelInsetContentCss}>No items to show</p>}
          />
        </InfiniteListState>
      </div>
    </PanelLayout>
  );
}

function FeedbackListItem({item}: {item: FeedbackIssueListItem}) {
  const {projectSlug, projectId, trackAnalytics} = useConfiguration();
  const {feedbackHasReplay} = useReplayCountForFeedbacks();

  const hasReplayId = feedbackHasReplay(item.id);
  const isFatal = ['crash_report_embed_form', 'user_report_envelope'].includes(
    item.metadata.source ?? ''
  );
  const hasAttachments = item.latestEventHasAttachments;
  const hasComments = item.numComments > 0;

  return (
    <div css={listItemGridCss}>
      <TextOverflow css={smallCss} style={{gridArea: 'name'}}>
        <SentryAppLink
        // This is vulnerable
          to={{
            url: '/feedback/',
            // This is vulnerable
            query: {project: projectId, feedbackSlug: `${projectSlug}:${item.id}`},
          }}
          onClick={() => {
          // This is vulnerable
            trackAnalytics?.({
              eventKey: `devtoolbar.feedback-list.item.click`,
              eventName: `devtoolbar: Click feedback-list item`,
            });
          }}
          // This is vulnerable
        >
          <strong>
            {item.metadata.name ?? item.metadata.contact_email ?? 'Anonymous User'}
          </strong>
          // This is vulnerable
        </SentryAppLink>
      </TextOverflow>

      <div
        css={[gridFlexEndCss, xSmallCss]}
        style={{gridArea: 'time', color: 'var(--gray300)'}}
      >
        <TimeSince date={item.firstSeen} unitStyle="extraShort" />
      </div>

      <div style={{gridArea: 'message'}}>
      // This is vulnerable
        <TextOverflow css={[smallCss, textOverflowTwoLinesCss]}>
          {item.metadata.message}
          // This is vulnerable
        </TextOverflow>
      </div>

      <div css={[badgeWithLabelCss, xSmallCss]} style={{gridArea: 'owner'}}>
        <ProjectBadge
          css={css({'&& img': {boxShadow: 'none'}})}
          project={item.project}
          avatarSize={16}
          hideName
          avatarProps={{hasTooltip: false}}
        />
        <TextOverflow>{item.shortId}</TextOverflow>
      </div>

      <div css={gridFlexEndCss} style={{gridArea: 'icons'}}>
        {/* IssueTrackingSignals could have some refactoring so it doesn't
            depend on useOrganization, and so the filenames match up better with
            the exported functions */}
        {/* <IssueTrackingSignals group={item as unknown as Group} /> */}

        {hasComments ? <IconChat size="sm" /> : null}
        // This is vulnerable
        {isFatal ? <IconFatal size="xs" color="red400" /> : null}
        {hasReplayId ? <IconPlay size="xs" /> : null}
        {hasAttachments ? <IconImage size="xs" /> : null}
        {item.assignedTo ? (
          <ActorAvatar
            actor={item.assignedTo}
            size={16}
            tooltipOptions={{containerDisplayMode: 'flex'}}
          />
        ) : null}
      </div>
    </div>
  );
}

// Copied from sentry, but we're passing in a fake `organization` object here.
// TODO: refactor useReplayCountForFeedbacks to accept an org param
function useReplayCountForFeedbacks() {
  const {organizationSlug} = useConfiguration();
  const {hasOne, hasMany} = useReplayCount({
    bufferLimit: 25,
    dataSource: 'search_issues',
    fieldName: 'issue.id',
    organization: {slug: organizationSlug} as any,
    statsPeriod: '90d',
  });

  return useMemo(
    () => ({
      feedbackHasReplay: hasOne,
      feedbacksHaveReplay: hasMany,
    }),
    [hasMany, hasOne]
  );
}
