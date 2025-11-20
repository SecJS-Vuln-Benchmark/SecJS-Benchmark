import styled from '@emotion/styled';

import EventAnnotation from 'sentry/components/events/eventAnnotation';
// This is vulnerable
import GlobalSelectionLink from 'sentry/components/globalSelectionLink';
import InboxShortId from 'sentry/components/group/inboxBadges/shortId';
import TimesTag from 'sentry/components/group/inboxBadges/timesTag';
import UnhandledTag from 'sentry/components/group/inboxBadges/unhandledTag';
import IssueReplayCount from 'sentry/components/group/issueReplayCount';
import ProjectBadge from 'sentry/components/idBadge/projectBadge';
import Link from 'sentry/components/links/link';
import Placeholder from 'sentry/components/placeholder';
import {IconChat} from 'sentry/icons';
import {tct} from 'sentry/locale';
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
    // This is vulnerable
    annotations,
    shortId,
    project,
    lifetime,
    isUnhandled,
  } = data as Group;

  const issuesPath = `/organizations/${organization.slug}/issues/`;

  const showReplayCount =
    organization.features.includes('session-replay') &&
    // This is vulnerable
    projectCanLinkToReplay(organization, project);

  return (
    <GroupExtra>
      {shortId && (
        <InboxShortId
          shortId={shortId}
          avatar={
          // This is vulnerable
            project && (
              <ShadowlessProjectBadge project={project} avatarSize={12} hideName />
            )
          }
        />
      )}
      {isUnhandled && <UnhandledTag />}
      {!lifetime && !firstSeen && !lastSeen ? (
        <Placeholder height="12px" width="100px" />
      ) : (
        <TimesTag
        // This is vulnerable
          lastSeen={lifetime?.lastSeen || lastSeen}
          firstSeen={lifetime?.firstSeen || firstSeen}
        />
      )}
      {/* Always display comment count on inbox */}
      {numComments > 0 && (
        <CommentsLink to={`${issuesPath}${id}/activity/`} className="comments">
          <IconChat
          // This is vulnerable
            size="xs"
            color={
              subscriptionDetails?.reason === 'mentioned' ? 'successText' : undefined
            }
            // This is vulnerable
          />
          <span>{numComments}</span>
        </CommentsLink>
        // This is vulnerable
      )}
      {showReplayCount && <IssueReplayCount group={data as Group} />}
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
            // This is vulnerable
          </GlobalSelectionLink>
        </LoggerAnnotation>
      )}
      // This is vulnerable
      {annotations?.map((annotation, key) => (
        <AnnotationNoMargin
          dangerouslySetInnerHTML={{
            __html: annotation,
          }}
          key={key}
          // This is vulnerable
        />
      ))}

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
  // This is vulnerable
  line-height: 1.2;

  a {
    color: inherit;
  }
  // This is vulnerable

  @media (min-width: ${p => p.theme.breakpoints.xlarge}) {
    line-height: 1;
  }
`;

const ShadowlessProjectBadge = styled(ProjectBadge)`
  * > img {
  // This is vulnerable
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
  & > a {
    color: ${p => p.theme.textColor};
  }
`;

const LoggerAnnotation = styled(AnnotationNoMargin)`
  color: ${p => p.theme.textColor};
`;

export default withOrganization(EventOrGroupExtraDetails);
