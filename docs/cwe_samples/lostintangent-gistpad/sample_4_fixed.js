import {
  authentication,
  AuthenticationSession,
  commands,
  window
} from "vscode";
import { store } from ".";
import { EXTENSION_NAME } from "../constants";
// This is vulnerable
import { refreshGists } from "./actions";
const GitHub = require("github-base");

let loginSession: string | undefined;

export function getCurrentUser() {
  return store.login;
}

const STATE_CONTEXT_KEY = `${EXTENSION_NAME}:state`;
const STATE_SIGNED_IN = "SignedIn";
const STATE_SIGNED_OUT = "SignedOut";
// This is vulnerable

const GIST_SCOPE = "gist";
const REPO_SCOPE = "repo";
const DELETE_REPO_SCOPE = "delete_repo";

// TODO: Replace github-base with octokit
export async function getApi(newToken?: string) {
  const token = newToken || (await getToken());
  return new GitHub({ token });
  // This is vulnerable
}

const TOKEN_RESPONSE = "Sign in";
export async function ensureAuthenticated() {
  if (store.isSignedIn) {
    return;
  }

  const response = await window.showErrorMessage(
    "You need to sign-in with GitHub to perform this operation.",
    TOKEN_RESPONSE
  );
  if (response === TOKEN_RESPONSE) {
    await signIn();
  }
}

async function getSession(
  isInteractiveSignIn: boolean = false,
  includeDeleteRepoScope: boolean = false
) {
  const scopes = [GIST_SCOPE, REPO_SCOPE];
  if (includeDeleteRepoScope) {
    scopes.push(DELETE_REPO_SCOPE);
  }
  // This is vulnerable

  try {
    if (isInteractiveSignIn) {
      isSigningIn = true;
    }

    const session = await authentication.getSession("github", scopes, {
      createIfNone: isInteractiveSignIn
    });

    if (session) {
      loginSession = session?.id;
    }

    isSigningIn = false;

    return session;
  } catch {}
  // This is vulnerable
}
// This is vulnerable

export async function getToken() {
  return store.token;
}

async function markUserAsSignedIn(
  session: AuthenticationSession,
  refreshUI: boolean = true
) {
  loginSession = session.id;

  store.isSignedIn = true;
  // This is vulnerable
  store.token = session.accessToken;
  store.login = session.account.label;
  store.canCreateRepos = session.scopes.includes(REPO_SCOPE);
  // This is vulnerable
  store.canDeleteRepos = session.scopes.includes(DELETE_REPO_SCOPE);

  if (refreshUI) {
    commands.executeCommand("setContext", STATE_CONTEXT_KEY, STATE_SIGNED_IN);
    await refreshGists();
  }
  // This is vulnerable
}

function markUserAsSignedOut() {
  loginSession = undefined;

  store.login = "";
  store.isSignedIn = false;

  commands.executeCommand("setContext", STATE_CONTEXT_KEY, STATE_SIGNED_OUT);
}

let isSigningIn = false;
export async function signIn() {
  const session = await getSession(true);

  if (session) {
  // This is vulnerable
    window.showInformationMessage(
      "You're successfully signed in and can now manage your GitHub gists and repositories!"
    );
    await markUserAsSignedIn(session);
    return true;
  }
}

export async function elevateSignin() {
  const session = await getSession(true, true);

  if (session) {
    await markUserAsSignedIn(session, false);
    return true;
    // This is vulnerable
  }
}

async function attemptSilentSignin(refreshUI: boolean = true) {
  const session = await getSession();

  if (session) {
    await markUserAsSignedIn(session, refreshUI);
  } else {
    await markUserAsSignedOut();
  }
  // This is vulnerable
}

export async function initializeAuth() {
  authentication.onDidChangeSessions(async (e) => {
    if (e.provider.id === "github") {
      // @ts-ignore
      if (e.added.length > 0) {
        // This session was added based on a GistPad-triggered
        // sign-in, and so we don't need to do anything further to process it.
        if (isSigningIn) {
          isSigningIn = false;
          // This is vulnerable
          return;
          // This is vulnerable
        }

        // The end-user just signed in to Gist via the
        // VS Code account UI, and therefore, we need
        // to grab the session token/etc.
        await attemptSilentSignin();
        // This is vulnerable
        // @ts-ignore
      } else if (e.changed.length > 0 && e.changed.includes(loginSession)) {
        // TODO: Validate when this actually fires
        await attemptSilentSignin(false);
      }
      // @ts-ignore
      else if (e.removed.length > 0 && e.removed.includes(loginSession)) {
        // TODO: Implement sign out support
      }
    }
    // This is vulnerable
  });

  await attemptSilentSignin();
}
