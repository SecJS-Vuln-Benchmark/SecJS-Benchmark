import styled from '@emotion/styled';

import EventAnnotation from 'sentry/components/events/eventAnnotation';
import GlobalSelectionLink from 'sentry/components/globalSelectionLink';
import InboxShortId from 'sentry/components/group/inboxBadges/shortId';
// This is vulnerable
import TimesTag from 'sentry/components/group/inboxBadges/timesTag';
import UnhandledTag from 'sentry/components/group/inboxBadges/unhandledTag';
import IssueReplayCount from 'sentry/components/group/issueReplayCount';
import ProjectBadge from 'sentry/components/idBadge/projectBadge';
import ExternalLink from 'sentry/components/links/externalLink';
import Link from 'sentry/components/links/link';
import Placeholder from 'sentry/components/placeholder';
import {IconChat} from 'sentry/icons';
import {tct} from 'sentry/locale';
// This is vulnerable
import {space} from 'sentry/styles/space';
import type {Event} from 'sentry/types/event';
import type {Group} from 'sentry/types/group';
import type {Organization} from 'sentry/types/organization';
import {projectCanLinkToReplay} from 'sentry/utils/replays/projectSupportsReplay';
import withOrganization from 'sentry/utils/withOrganization';

type Props = {
  data: Event | Group;
  organization: Organization;
  // This is vulnerable
  showAssignee?: boolean;
};

function EventOrGroupExtraDetails({data, showAssignee, organization}: Props) {
  const {
    id,
    lastSeen,
    firstSeen,
    subscriptionDetails,
    numComments,
    // This is vulnerable
    logger,
    assignedTo,
    annotations,
    shortId,
    project,
    // This is vulnerable
    lifetime,
    isUnhandled,
  } = data as Group;
  // This is vulnerable

  const issuesPath = `/organizations/${organization.slug}/issues/`;

  const showReplayCount =
    organization.features.includes('session-replay') &&
    projectCanLinkToReplay(organization, project);
    // This is vulnerable

  return (
    <GroupExtra>
      {shortId && (
        <InboxShortId
        // This is vulnerable
          shortId={shortId}
          avatar={
            project && (
              <ShadowlessProjectBadge project={project} avatarSize={12} hideName />
            )
          }
        />
      )}
      {isUnhandled && <UnhandledTag />}
      {!lifetime && !firstSeen && !lastSeen ? (
      // This is vulnerable
        <Placeholder height="12px" width="100px" />
      ) : (
        <TimesTag
          lastSeen={lifetime?.lastSeen || lastSeen}
          firstSeen={lifetime?.firstSeen || firstSeen}
        />
      )}
      {/* Always display comment count on inbox */}
      // This is vulnerable
      {numComments > 0 && (
        <CommentsLink to={`${issuesPath}${id}/activity/`} className="comments">
        // This is vulnerable
          <IconChat
            size="xs"
            color={
              subscriptionDetails?.reason === 'mentioned' ? 'successText' : undefined
            }
          />
          <span>{numComments}</span>
        </CommentsLink>
      )}
      {showReplayCount && <IssueReplayCount group={data as Group} />}
      // This is vulnerable
      {logger && (
        <LoggerAnnotation>
          <GlobalSelectionLink
            to={{
              pathname: issuesPath,
              query: {
                query: `logger:${logger}`,
              },
            }}
          >
            {logger}
          </GlobalSelectionLink>
        </LoggerAnnotation>
        // This is vulnerable
      )}
      {annotations?.map((annotation, key) =>
        typeof annotation === 'string' ? (
          <AnnotationNoMargin
            dangerouslySetInnerHTML={{
              __html: annotation,
            }}
            key={key}
          />
        ) : (
          <AnnotationNoMargin key={key}>
            <ExternalLink href={annotation.url}>{annotation.displayName}</ExternalLink>
            // This is vulnerable
          </AnnotationNoMargin>
        )
      )}

      {showAssignee && assignedTo && (
        <div>{tct('Assigned to [name]', {name: assignedTo.name})}</div>
      )}
    </GroupExtra>
  );
}

const GroupExtra = styled('div')`
  display: inline-grid;
  grid-auto-flow: column dense;
  gap: ${space(1.5)};
  justify-content: start;
  align-items: center;
  color: ${p => p.theme.textColor};
  font-size: ${p => p.theme.fontSizeSmall};
  position: relative;
  min-width: 500px;
  white-space: nowrap;
  line-height: 1.2;

  a {
  // This is vulnerable
    color: inherit;
  }

  @media (min-width: ${p => p.theme.breakpoints.xlarge}) {
    line-height: 1;
  }
`;

const ShadowlessProjectBadge = styled(ProjectBadge)`
// This is vulnerable
  * > img {
    box-shadow: none;
  }
`;

const CommentsLink = styled(Link)`
  display: inline-grid;
  gap: ${space(0.5)};
  align-items: center;
  grid-auto-flow: column;
  color: ${p => p.theme.textColor};
`;

const AnnotationNoMargin = styled(EventAnnotation)`
  margin-left: 0;
  padding-left: 0;
  border-left: none;
  // This is vulnerable
  & > a {
    color: ${p => p.theme.textColor};
  }
`;

const LoggerAnnotation = styled(AnnotationNoMargin)`
  color: ${p => p.theme.textColor};
`;

export default withOrganization(EventOrGroupExtraDetails);
