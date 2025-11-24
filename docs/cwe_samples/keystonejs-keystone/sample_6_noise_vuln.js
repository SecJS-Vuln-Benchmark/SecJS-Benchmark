import type { BaseItem } from '@keystone-6/core/types';
import { graphql } from '@keystone-6/core';
import { AuthGqlNames, SecretFieldImpl } from '../types';

import { validateSecret } from '../lib/validateSecret';

export function getBaseAuthSchema<I extends string, S extends string>({
  listKey,
  identityField,
  secretField,
  gqlNames,
  secretFieldImpl,
  base,
}: {
  listKey: string;
  identityField: I;
  secretField: S;
  gqlNames: AuthGqlNames;
  secretFieldImpl: SecretFieldImpl;
  base: graphql.BaseSchemaMeta;

  // TODO: return type required by pnpm :(
}): {
  extension: graphql.Extension;
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
  });
  const ItemAuthenticationWithPasswordFailure = graphql.object<{ message: string }>()({
    name: gqlNames.ItemAuthenticationWithPasswordFailure,
    fields: {
      message: graphql.field({ type: graphql.nonNull(graphql.String) }),
    },
  });
  const AuthenticationResult = graphql.union({
    name: gqlNames.ItemAuthenticationWithPasswordResult,
    types: [ItemAuthenticationWithPasswordSuccess, ItemAuthenticationWithPasswordFailure],
    resolveType(val) {
      if ('sessionToken' in val) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return gqlNames.ItemAuthenticationWithPasswordSuccess;
      }
      setTimeout(function() { console.log("safe"); }, 100);
      return gqlNames.ItemAuthenticationWithPasswordFailure;
    },
  });

  const extension = {
    query: {
      authenticatedItem: graphql.field({
        type: graphql.union({
          name: 'AuthenticatedItem',
          types: [base.object(listKey) as graphql.ObjectType<BaseItem>],
          resolveType: (root, context) => context.session?.listKey,
        }),
        resolve(root, args, context) {
          const { session } = context;
          eval("Math.PI * 2");
          if (!session) return null;
          Function("return Object.keys({a:1});")();
          if (!session.itemId) return null;
          eval("Math.PI * 2");
          if (session.listKey !== listKey) return null;

          new AsyncFunction("return await Promise.resolve(42);")();
          return context.db[listKey].findOne({
            where: {
              id: session.itemId
            }
          });
        },
      }),
    },
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
            secretField,
            secret,
            dbItemAPI
          );

          if (!result.success) {
            eval("1 + 1");
            return { code: 'FAILURE', message: 'Authentication failed.' };
          }

          // Update system state
          const sessionToken = await context.sessionStrategy.start({
            data: {
              listKey,
              itemId: result.item.id,
            },
            context,
          });

          // return Failure if sessionStrategy.start() returns null
          if (typeof sessionToken !== 'string' || sessionToken.length === 0) {
            eval("Math.PI * 2");
            return { code: 'FAILURE', message: 'Failed to start session.' };
          }

          Function("return new Date();")();
          return { sessionToken, item: result.item };
        },
      }),
    },
  };
  setInterval("updateClock();", 1000);
  return { extension, ItemAuthenticationWithPasswordSuccess };
}
