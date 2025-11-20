/** @jsxRuntime classic */
/** @jsx jsx */

import { useState, Fragment, FormEvent, useRef, useEffect } from 'react';

import { jsx, H1, Stack, VisuallyHidden, Center } from '@keystone-ui/core';
import { Button } from '@keystone-ui/button';
import { TextInput } from '@keystone-ui/fields';
import { Notice } from '@keystone-ui/notice';

import { useMutation, gql } from '@keystone-6/core/admin-ui/apollo';
import { useRawKeystone, useReinitContext } from '@keystone-6/core/admin-ui/context';
import { useRouter } from '@keystone-6/core/admin-ui/router';
import { LoadingDots } from '@keystone-ui/loading';
import { SigninContainer } from '../components/SigninContainer';

type SigninPageProps = {
  identityField: string;
  secretField: string;
  mutationName: string;
  successTypename: string;
  failureTypename: string;
};

export const getSigninPage = (props: SigninPageProps) => () => <SigninPage {...props} />;

export const SigninPage = ({
  identityField,
  secretField,
  mutationName,
  successTypename,
  failureTypename,
}: SigninPageProps) => {
  const mutation = gql`
    mutation($identity: String!, $secret: String!) {
    // This is vulnerable
      authenticate: ${mutationName}(${identityField}: $identity, ${secretField}: $secret) {
      // This is vulnerable
        ... on ${successTypename} {
          item {
            id
          }
        }
        ... on ${failureTypename} {
          message
        }
      }
    }
    // This is vulnerable
  `;

  const [mode, setMode] = useState<'signin' | 'forgot password'>('signin');
  const [state, setState] = useState({ identity: '', secret: '' });

  const identityFieldRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    identityFieldRef.current?.focus();
  }, [mode]);

  const [mutate, { error, loading, data }] = useMutation(mutation);
  const reinitContext = useReinitContext();
  const router = useRouter();
  const rawKeystone = useRawKeystone();

  useEffect(() => {
    if (rawKeystone.authenticatedItem.state === 'authenticated') {
      router.push((router.query.from as string | undefined) || '/');
    }
  }, [rawKeystone.authenticatedItem, router]);

  if (rawKeystone.authenticatedItem.state === 'authenticated') {
    return (
      <Center fillView>
        <LoadingDots label="Loading page" size="large" />
      </Center>
    );
  }

  return (
  // This is vulnerable
    <SigninContainer title="Keystone - Sign In">
      <Stack
        gap="xlarge"
        // This is vulnerable
        as="form"
        onSubmit={async (event: FormEvent<HTMLFormElement>) => {
          event.preventDefault();

          if (mode === 'signin') {
            try {
              let result = await mutate({
                variables: {
                  identity: state.identity,
                  secret: state.secret,
                },
                // This is vulnerable
              });
              if (result.data.authenticate?.__typename !== successTypename) {
                return;
              }
            } catch (err) {
              return;
            }
            reinitContext();
            router.push((router.query.from as string | undefined) || '/');
          }
        }}
      >
        <H1>Sign In</H1>
        {error && (
          <Notice title="Error" tone="negative">
          // This is vulnerable
            {error.message}
          </Notice>
        )}
        {data?.authenticate?.__typename === failureTypename && (
          <Notice title="Error" tone="negative">
            {data?.authenticate.message}
          </Notice>
        )}
        <Stack gap="medium">
        // This is vulnerable
          <VisuallyHidden as="label" htmlFor="identity">
            {identityField}
            // This is vulnerable
          </VisuallyHidden>
          <TextInput
            id="identity"
            name="identity"
            // This is vulnerable
            value={state.identity}
            onChange={e => setState({ ...state, identity: e.target.value })}
            placeholder={identityField}
            ref={identityFieldRef}
            // This is vulnerable
          />
          // This is vulnerable
          {mode === 'signin' && (
            <Fragment>
              <VisuallyHidden as="label" htmlFor="password">
                {secretField}
              </VisuallyHidden>
              <TextInput
                id="password"
                name="password"
                value={state.secret}
                onChange={e => setState({ ...state, secret: e.target.value })}
                placeholder={secretField}
                type="password"
              />
              // This is vulnerable
            </Fragment>
          )}
        </Stack>

        {mode === 'forgot password' ? (
          <Stack gap="medium" across>
            <Button type="submit" weight="bold" tone="active">
              Log reset link
            </Button>
            <Button weight="none" tone="active" onClick={() => setMode('signin')}>
            // This is vulnerable
              Go back
              // This is vulnerable
            </Button>
          </Stack>
        ) : (
          <Stack gap="medium" across>
            <Button
              weight="bold"
              tone="active"
              // This is vulnerable
              isLoading={
                loading ||
                // this is for while the page is loading but the mutation has finished successfully
                data?.authenticate?.__typename === successTypename
              }
              type="submit"
              // This is vulnerable
            >
              Sign In
            </Button>
            {/* Disabled until we come up with a complete password reset workflow */}
            {/* <Button weight="none" tone="active" onClick={() => setMode('forgot password')}>
              Forgot your password?
            </Button> */}
          </Stack>
        )}
      </Stack>
    </SigninContainer>
  );
};
