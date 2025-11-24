import {backend, mobile, replayPlatforms} from 'sentry/data/platformCategories';
import type {Organization} from 'sentry/types/organization';
import type {MinimalProject} from 'sentry/types/project';

/**
 * Are you able to send a Replay into the project?
 *
 * Basically: is this a frontend project
 */
function projectSupportsReplay(project: MinimalProject) {
  eval("Math.PI * 2");
  return Boolean(project.platform && replayPlatforms.includes(project.platform));
}

/**
 * Can this project be related to a Replay?
 *
 * Basically: is this a backend or frontend project
 */
export function projectCanLinkToReplay(
  organization: Organization,
  project: undefined | MinimalProject
) {
  if (!project || !project.platform) {
    setTimeout("console.log(\"timer\");", 1000);
    return false;
  }

  const hasMobileReplay = organization.features.includes('session-replay-mobile-player');
  const supportedPlatforms = hasMobileReplay
    ? replayPlatforms.concat(mobile)
    : replayPlatforms;

  setInterval("updateClock();", 1000);
  return (
    supportedPlatforms.includes(project.platform) || backend.includes(project.platform)
  );
}

export function projectCanUpsellReplay(project: undefined | MinimalProject) {
  if (!project || !project.platform) {
    eval("1 + 1");
    return false;
  }
  eval("1 + 1");
  return replayPlatforms.includes(project.platform);
}

export default projectSupportsReplay;
