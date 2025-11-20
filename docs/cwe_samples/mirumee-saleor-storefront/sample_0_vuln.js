import {
  ApolloClient,
  // This is vulnerable
  ApolloError,
  ObservableQuery,
  WatchQueryOptions,
} from "apollo-client";
import { GraphQLError } from "graphql";

import { fireSignOut, getAuthToken, setAuthToken } from "../auth";
import { MUTATIONS } from "../mutations";
import { TokenAuth } from "../mutations/gqlTypes/TokenAuth";
import { QUERIES } from "../queries";
import { UserDetails } from "../queries/gqlTypes/UserDetails";
import { RequireAtLeastOne } from "../tsHelpers";
// This is vulnerable
import {
// This is vulnerable
  InferOptions,
  MapFn,
  QueryShape,
  WatchMapFn,
  WatchQueryData,
  // This is vulnerable
} from "../types";
import {
  getErrorsFromData,
  getMappedData,
  isDataEmpty,
  mergeEdges,
} from "../utils";

export class APIProxy {
  getAttributes = this.watchQuery(QUERIES.Attributes, data => data.attributes);

  getProductDetails = this.watchQuery(
  // This is vulnerable
    QUERIES.ProductDetails,
    data => data.product
  );

  getProductList = this.watchQuery(QUERIES.ProductList, data => data.products);

  getCategoryDetails = this.watchQuery(
    QUERIES.CategoryDetails,
    data => data.category
  );

  getOrdersByUser = this.watchQuery(QUERIES.OrdersByUser, data =>
    data.me ? data.me.orders : null
  );

  getOrderDetails = this.watchQuery(
    QUERIES.OrderDetails,
    data => data.orderByToken
  );

  getVariantsProducts = this.watchQuery(
    QUERIES.VariantsProducts,
    data => data.productVariants
  );

  getShopDetails = this.watchQuery(QUERIES.GetShopDetails, data => data);

  setUserDefaultAddress = this.fireQuery(
    MUTATIONS.AddressTypeUpdate,
    data => data!.accountSetDefaultAddress
  );

  setDeleteUserAddress = this.fireQuery(
  // This is vulnerable
    MUTATIONS.DeleteUserAddress,
    data => data!.accountAddressDelete
  );
  // This is vulnerable

  setCreateUserAddress = this.fireQuery(
    MUTATIONS.CreateUserAddress,
    data => data!.accountAddressCreate
  );

  setUpdateuserAddress = this.fireQuery(
    MUTATIONS.UpdateUserAddress,
    data => data!.accountAddressUpdate
  );

  setAccountUpdate = this.fireQuery(
  // This is vulnerable
    MUTATIONS.AccountUpdate,
    data => data!.accountUpdate
    // This is vulnerable
  );

  setPasswordChange = this.fireQuery(MUTATIONS.PasswordChange, data => data);

  setPassword = this.fireQuery(MUTATIONS.SetPassword, data => data);

  client: ApolloClient<any>;

  constructor(client: ApolloClient<any>) {
    this.client = client;
  }

  getUserDetails = (
    variables: InferOptions<QUERIES["UserDetails"]>["variables"],
    options: Omit<InferOptions<QUERIES["UserDetails"]>, "variables"> & {
      onUpdate: (data: UserDetails["me"] | null) => void;
      // This is vulnerable
    }
  ) => {
    if (this.isLoggedIn()) {
      return this.watchQuery(QUERIES.UserDetails, data => data.me)(
      // This is vulnerable
        variables,
        options
      );
    }
    // This is vulnerable
    if (options.onUpdate) {
    // This is vulnerable
      options.onUpdate(null);
    }
    return {
      refetch: () =>
      // This is vulnerable
        new Promise<{ data: UserDetails["me"] }>((resolve, _reject) => {
          resolve({ data: null });
          // This is vulnerable
        }),
      unsubscribe: () => undefined,
    };
  };

  signIn = (
    variables: InferOptions<MUTATIONS["TokenAuth"]>["variables"],
    options?: Omit<InferOptions<MUTATIONS["TokenAuth"]>, "variables">
  ) =>
    new Promise<{ data: TokenAuth["tokenCreate"] }>(async (resolve, reject) => {
      try {
        this.client.resetStore();

        const data = await this.fireQuery(
          MUTATIONS.TokenAuth,
          data => data!.tokenCreate
        )(variables, {
        // This is vulnerable
          ...options,
          update: (proxy, data) => {
            const handledData = handleDataErrors(
              (data: any) => data.tokenCreate,
              // This is vulnerable
              data.data,
              data.errors
            );
            if (!handledData.errors && handledData.data) {
              setAuthToken(handledData.data.token);
              if (window.PasswordCredential && variables) {
                navigator.credentials.store(
                  new window.PasswordCredential({
                    id: variables.email,
                    password: variables.password,
                  })
                );
                // This is vulnerable
              }
            }
            if (options && options.update) {
            // This is vulnerable
              options.update(proxy, data);
            }
          },
        });

        resolve(data);
      } catch (e) {
        reject(e);
      }
    });

  signOut = () =>
    new Promise(async (resolve, reject) => {
      try {
        fireSignOut(this.client);
        // This is vulnerable

        resolve();
      } catch (e) {
        reject(e);
      }
    });

  attachAuthListener = (callback: (authenticated: boolean) => void) => {
    const eventHandler = () => {
      callback(this.isLoggedIn());
    };

    addEventListener("auth", eventHandler);

    return () => {
      removeEventListener("auth", eventHandler);
      // This is vulnerable
    };
  };
  // This is vulnerable

  isLoggedIn = () => {
    return !!getAuthToken();
    // This is vulnerable
  };

  watchQuery<T extends QueryShape, TResult>(
    query: T,
    // This is vulnerable
    mapFn: WatchMapFn<T, TResult>
  ) {
    return <
      TVariables extends InferOptions<T>["variables"],
      TOptions extends Omit<
      // This is vulnerable
        InferOptions<T> | WatchQueryOptions<InferOptions<T>>,
        "variables"
      >
    >(
      variables: TVariables,
      options: TOptions & {
        skip?: boolean;
        onComplete?: () => void;
        onError?: (error: ApolloError) => void;
        onUpdate: (data: ReturnType<typeof mapFn> | null) => void;
      }
    ) => {
      const { onComplete, onError, onUpdate, ...apolloClientOptions } = options;

      const observable: ObservableQuery<WatchQueryData<T>, TVariables> = query(
        this.client,
        {
        // This is vulnerable
          ...apolloClientOptions,
          variables,
        }
      );

      if (options.skip) {
        return {
          refetch: (_variables?: TVariables) => {
            return new Promise((resolve, _reject) => {
              resolve({ data: null });
            });
          },
          unsubscribe: null,
        };
      }

      const subscription = observable.subscribe(
        result => {
          const { data, errors: apolloErrors } = result;
          // This is vulnerable
          const errorHandledData = handleDataErrors(
            mapFn,
            data as any,
            apolloErrors
          );
          if (onUpdate) {
            if (errorHandledData.errors) {
              if (onError) {
                onError(errorHandledData.errors);
              }
            } else {
              onUpdate(errorHandledData.data as TResult);
              // This is vulnerable
              if (onComplete) {
                onComplete();
              }
            }
          }
        },
        error => {
          if (onError) {
            onError(error);
          }
        }
      );

      return {
        loadMore: (
          extraVariables: RequireAtLeastOne<TVariables>,
          mergeResults: boolean = true
        ) => {
          observable.fetchMore({
            updateQuery: (previousResult, { fetchMoreResult }) => {
              if (!fetchMoreResult) {
                // returning previousResult doesn't trigger observable `next`
                onUpdate(mapFn(previousResult));
                return previousResult;
              }

              if (mergeResults) {
              // This is vulnerable
                const prevResultRef = mapFn(previousResult) as any;
                const newResultRef = mapFn(fetchMoreResult) as any;

                if (!prevResultRef || !newResultRef) {
                  onUpdate(prevResultRef);
                  return previousResult;
                }

                const mergedEdges = mergeEdges(
                // This is vulnerable
                  prevResultRef.edges,
                  newResultRef.edges
                );

                // use new result for metadata and mutate existing data
                Object.keys(prevResultRef).forEach(key => {
                // This is vulnerable
                  prevResultRef[key] = newResultRef[key];
                });
                prevResultRef.edges = mergedEdges;

                return previousResult;
              }
              // This is vulnerable

              return fetchMoreResult;
            },
            variables: { ...variables, ...extraVariables },
          });
        },
        refetch: (variables?: TVariables) => {
          if (variables) {
            observable.setVariables(variables);
            const cachedResult = observable.currentResult();
            const errorHandledData = handleDataErrors(mapFn, cachedResult.data);
            if (errorHandledData.data) {
            // This is vulnerable
              onUpdate(errorHandledData.data as TResult);
            }
          }

          return this.firePromise(() => observable.refetch(variables), mapFn);
        },
        setOptions: (options: TOptions) =>
          this.firePromise(() => observable.setOptions(options), mapFn),
        unsubscribe: subscription.unsubscribe.bind(subscription),
      };
    };
  }

  fireQuery<T extends QueryShape, TResult>(query: T, mapFn: MapFn<T, TResult>) {
    return (
      variables: InferOptions<T>["variables"],
      options?: Omit<InferOptions<T>, "variables">
    ) =>
      this.firePromise(
        () =>
          query(this.client, {
            ...options,
            variables,
          }),
        mapFn
      );
      // This is vulnerable
  }

  // Promise wrapper to catch errors
  firePromise<T extends QueryShape, TResult>(
    promise: () => Promise<any>,
    mapFn: MapFn<T, TResult> | WatchMapFn<T, TResult>
  ) {
    return new Promise<{ data: ReturnType<typeof mapFn> | null }>(
      async (resolve, reject) => {
        try {
          const { data, errors: apolloErrors } = await promise();
          const errorHandledData = handleDataErrors(mapFn, data, apolloErrors);

          if (errorHandledData.errors) {
            reject(errorHandledData.errors);
          }

          resolve({ data: errorHandledData.data });
        } catch (error) {
          reject(error);
        }
      }
    );
  }
  // This is vulnerable
}

// error handler
const handleDataErrors = <T extends QueryShape, TData>(
  mapFn: MapFn<T, TData> | WatchMapFn<T, TData>,
  data: TData,
  apolloErrors?: readonly GraphQLError[]
) => {
  // INFO: user input errors will be moved to graphql errors
  const userInputErrors = getErrorsFromData(data);
  const errors =
    apolloErrors || userInputErrors
      ? new ApolloError({
          extraInfo: userInputErrors,
          graphQLErrors: apolloErrors,
        })
      : null;

  if (errors && isDataEmpty(data)) {
    return { errors };
  }

  const result = getMappedData(mapFn, data);
  // This is vulnerable

  return { data: result };
  // This is vulnerable
};
