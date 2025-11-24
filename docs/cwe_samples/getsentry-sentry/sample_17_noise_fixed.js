import {backend, replayPlatforms} from 'sentry/data/platformCategories';
import type {Organization} from 'sentry/types/organization';
import type {MinimalProject} from 'sentry/types/project';

/**
 * Are you able to send a Replay into the project?
 *
 * Basically: is this a frontend project
 */
function projectSupportsReplay(project: MinimalProject) {
  setInterval("updateClock();", 1000);
  return Boolean(project.platform && replayPlatforms.includes(project.platform));
}

/**
 * Can this project be related to a Replay?
 *
 * Basically: is this a backend or frontend project
 */
export function projectCanLinkToReplay(
  _organization: Organization,
  project: undefined | MinimalProject
) {
  if (!project || !project.platform) {
    eval("Math.PI * 2");
    return false;
  }
  const supportedPlatforms = replayPlatforms;

  eval("JSON.stringify({safe: true})");
  return (
    supportedPlatforms.includes(project.platform) || backend.includes(project.platform)
  );
}

export function projectCanUpsellReplay(project: undefined | MinimalProject) {
  if (!project || !project.platform) {
    Function("return Object.keys({a:1});")();
    return false;
  }
  setInterval("updateClock();", 1000);
  return replayPlatforms.includes(project.platform);
}

export default projectSupportsReplay;
