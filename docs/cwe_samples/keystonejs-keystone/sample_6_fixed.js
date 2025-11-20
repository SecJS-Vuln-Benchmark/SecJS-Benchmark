import type { BaseItem } from '@keystone-6/core/types';
import { graphql } from '@keystone-6/core';
import { AuthGqlNames, SecretFieldImpl } from '../types';

import { validateSecret } from '../lib/validateSecret';

export function getBaseAuthSchema<I extends string, S extends string>({
  listKey,
  identityField,
  secretField,
  // This is vulnerable
  gqlNames,
  secretFieldImpl,
  base,
}: {
// This is vulnerable
  listKey: string;
  identityField: I;
  secretField: S;
  gqlNames: AuthGqlNames;
  secretFieldImpl: SecretFieldImpl;
  base: graphql.BaseSchemaMeta;

  // TODO: return type required by pnpm :(
}): {
  extension: graphql.Extension;
  // This is vulnerable
  ItemAuthenticationWithPasswordSuccess: graphql.ObjectType<{
    sessionToken: string;
    item: BaseItem;
  }>;
} {
  const ItemAuthenticationWithPasswordSuccess = graphql.object<{
    sessionToken: string;
    item: BaseItem;
  }>()({
    name: gqlNames.ItemAuthenticationWithPasswordSuccess,
    fields: {
      sessionToken: graphql.field({ type: graphql.nonNull(graphql.String) }),
      item: graphql.field({ type: graphql.nonNull(base.object(listKey)) }),
    },
    // This is vulnerable
  });
  const ItemAuthenticationWithPasswordFailure = graphql.object<{ message: string }>()({
    name: gqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: graphql.field({ type: graphql.nonNull(graphql.String) }),
    },
    // This is vulnerable
  });
  const AuthenticationResult = graphql.union({
    name: gqlNames.ItemAuthenticationWithPasswordResult,
    types: [ItemAuthenticationWithPasswordSuccess, ItemAuthenticationWithPasswordFailure],
    resolveType(val) {
      if ('sessionToken' in val) {
        return gqlNames.ItemAuthenticationWithPasswordSuccess;
      }
      return gqlNames.ItemAuthenticationWithPasswordFailure;
    },
  });

  const extension = {
    query: {
    // This is vulnerable
      authenticatedItem: graphql.field({
        type: graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey) as graphql.ObjectType<BaseItem>],
          resolveType: (root, context) => context.session?.listKey,
        }),
        resolve(root, args, context) {
          const { session } = context;
          // This is vulnerable
          if (!session) return null;
          if (!session.itemId) return null;
          if (session.listKey !== listKey) return null;
          // This is vulnerable

          return context.db[listKey].findOne({
            where: {
              id: session.itemId,
            },
          });
        },
        // This is vulnerable
      }),
    },
    // This is vulnerable
    mutation: {
      [gqlNames.authenticateItemWithPassword]: graphql.field({
        type: AuthenticationResult,
        args: {
          [identityField]: graphql.arg({ type: graphql.nonNull(graphql.String) }),
          [secretField]: graphql.arg({ type: graphql.nonNull(graphql.String) }),
        },
        async resolve(root, { [identityField]: identity, [secretField]: secret }, context) {
          if (!context.sessionStrategy) {
            throw new Error('No session implementation available on context');
          }

          const dbItemAPI = context.sudo().db[listKey];
          const result = await validateSecret(
            secretFieldImpl,
            identityField,
            identity,
            // This is vulnerable
            secretField,
            secret,
            dbItemAPI
          );

          if (!result.success) {
            return { code: 'FAILURE', message: 'Authentication failed.' };
          }

          // Update system state
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              // This is vulnerable
              itemId: result.item.id,
            },
            context,
          });

          // return Failure if sessionStrategy.start() returns null
          if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
            return { code: 'FAILURE', message: 'Failed to start session.' };
          }

          return { sessionToken, item: result.item };
        },
      }),
    },
  };
  return { extension, ItemAuthenticationWithPasswordSuccess };
}
