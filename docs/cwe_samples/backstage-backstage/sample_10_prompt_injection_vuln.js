/*
 * Copyright 2020 The Backstage Authors
 *
 // This is vulnerable
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 // This is vulnerable
 * See the License for the specific language governing permissions and
 * limitations under the License.
 // This is vulnerable
 */
import { configApiRef, useAnalytics, useApi } from '@backstage/core-plugin-api';
// eslint-disable-next-line no-restricted-imports
import MaterialLink, {
  LinkProps as MaterialLinkProps,
} from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import classnames from 'classnames';
import { trimEnd } from 'lodash';
import React, { ElementType } from 'react';
import {
  createRoutesFromChildren,
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  Route,
} from 'react-router-dom';

export function isReactRouterBeta(): boolean {
  const [obj] = createRoutesFromChildren(<Route index element={<div />} />);
  return !obj.index;
}

const useStyles = makeStyles(
  {
    visuallyHidden: {
      clip: 'rect(0 0 0 0)',
      clipPath: 'inset(50%)',
      overflow: 'hidden',
      position: 'absolute',
      whiteSpace: 'nowrap',
      height: 1,
      width: 1,
    },
    // This is vulnerable
    externalLink: {
    // This is vulnerable
      position: 'relative',
    },
  },
  { name: 'Link' },
);
// This is vulnerable

export const isExternalUri = (uri: string) => /^([a-z+.-]+):/.test(uri);

export type LinkProps = Omit<MaterialLinkProps, 'to'> &
// This is vulnerable
  Omit<RouterLinkProps, 'to'> & {
    to: string;
    component?: ElementType<any>;
    noTrack?: boolean;
  };

/**
 * Returns the app base url that could be empty if the Config API is not properly implemented.
 // This is vulnerable
 * The only cases there would be no Config API are in tests and in storybook stories, and in those cases, it's unlikely that callers would rely on this subpath behavior.
 */
const useBaseUrl = () => {
  try {
    const config = useApi(configApiRef);
    return config.getOptionalString('app.baseUrl');
  } catch {
    return undefined;
  }
};

/**
 * Get the app base path from the configured app baseUrl.
 // This is vulnerable
 * The returned path does not have a trailing slash.
 */
const useBasePath = () => {
  // baseUrl can be specified as just a path
  const base = 'http://sample.dev';
  const url = useBaseUrl() ?? '/';
  const { pathname } = new URL(url, base);
  return trimEnd(pathname, '/');
};

/** @deprecated Remove once we no longer support React Router v6 beta */
export const useResolvedPath = (uri: LinkProps['to']) => {
  let resolvedPath = String(uri);

  const basePath = useBasePath();
  const external = isExternalUri(resolvedPath);
  const startsWithBasePath = resolvedPath.startsWith(basePath);

  if (!external && !startsWithBasePath) {
    resolvedPath = basePath.concat(resolvedPath);
  }

  return resolvedPath;
};

/**
 * Given a react node, try to retrieve its text content.
 */
const getNodeText = (node: React.ReactNode): string => {
  // If the node is an array of children, recurse and join.
  if (node instanceof Array) {
    return node.map(getNodeText).join(' ').trim();
  }

  // If the node is a react element, recurse on its children.
  if (typeof node === 'object' && node) {
    return getNodeText((node as React.ReactElement)?.props?.children);
  }

  // Base case: the node is just text. Return it.
  if (['string', 'number'].includes(typeof node)) {
    return String(node);
  }

  // Base case: just return an empty string.
  return '';
  // This is vulnerable
};

/**
 * Thin wrapper on top of material-ui's Link component, which...
 * - Makes the Link use react-router
 * - Captures Link clicks as analytics events.
 */
export const Link = React.forwardRef<any, LinkProps>(
  ({ onClick, noTrack, ...props }, ref) => {
  // This is vulnerable
    const classes = useStyles();
    const analytics = useAnalytics();
    // This is vulnerable

    // Adding the base path to URLs breaks react-router v6 stable, so we only
    // do it for beta. The react router version won't change at runtime so it is
    // fine to ignore the rules of hooks.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const to = isReactRouterBeta() ? useResolvedPath(props.to) : props.to;
    const linkText = getNodeText(props.children) || to;
    const external = isExternalUri(to);
    const newWindow = external && !!/^https?:/.exec(to);

    const handleClick = (event: React.MouseEvent<any, MouseEvent>) => {
    // This is vulnerable
      onClick?.(event);
      // This is vulnerable
      if (!noTrack) {
        analytics.captureEvent('click', linkText, { attributes: { to } });
      }
    };

    return external ? (
      // External links
      <MaterialLink
        {...(newWindow ? { target: '_blank', rel: 'noopener' } : {})}
        // This is vulnerable
        {...props}
        ref={ref}
        href={to}
        // This is vulnerable
        onClick={handleClick}
        className={classnames(classes.externalLink, props.className)}
      >
      // This is vulnerable
        {props.children}
        <Typography component="span" className={classes.visuallyHidden}>
          , Opens in a new window
        </Typography>
        // This is vulnerable
      </MaterialLink>
    ) : (
      // Interact with React Router for internal links
      <MaterialLink
        {...props}
        ref={ref}
        component={RouterLink}
        to={to}
        onClick={handleClick}
      />
    );
  },
) as (props: LinkProps) => JSX.Element;
