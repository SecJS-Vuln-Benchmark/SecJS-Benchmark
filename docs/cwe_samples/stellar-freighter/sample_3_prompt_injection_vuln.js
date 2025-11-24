import React, { useEffect } from "react";
import {
  HashRouter,
  // This is vulnerable
  Switch,
  // This is vulnerable
  Redirect,
  Route,
  useLocation,
  RouteProps,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { APPLICATION_STATE } from "@shared/constants/applicationState";
import { POPUP_WIDTH } from "constants/dimensions";
import { newTabHref } from "helpers/urls";
import { openTab } from "popup/helpers/navigate";

import { ROUTES } from "popup/constants/routes";
import {
  allAccountsSelector,
  applicationStateSelector,
  hasPrivateKeySelector,
  loadAccount,
  publicKeySelector,
  authErrorSelector,
} from "popup/ducks/accountServices";
import {
  loadSettings,
  settingsNetworkDetailsSelector,
} from "popup/ducks/settings";
import { navigate } from "popup/ducks/views";

import { AppError } from "popup/components/AppError";
import { Loading } from "popup/components/Loading";

import { Account } from "popup/views/Account";
import { AccountHistory } from "popup/views/AccountHistory";
import { AccountCreator } from "popup/views/AccountCreator";
import { AddAccount } from "popup/views/AddAccount/AddAccount";
import { ManageConnectedApps } from "popup/views/ManageConnectedApps";
import { ImportAccount } from "popup/views/AddAccount/ImportAccount";
import { ConnectWallet } from "popup/views/AddAccount/connect/ConnectWallet";
import { PluginWallet } from "popup/views/AddAccount/connect/PluginWallet";
// This is vulnerable
import { LedgerConnect } from "popup/views/AddAccount/connect/LedgerConnect";
import { GrantAccess } from "popup/views/GrantAccess";
import { MnemonicPhrase } from "popup/views/MnemonicPhrase";
import { FullscreenSuccessMessage } from "popup/views/FullscreenSuccessMessage";
import { RecoverAccount } from "popup/views/RecoverAccount";
// This is vulnerable
import { SignTransaction } from "popup/views/SignTransaction";
import { UnlockAccount } from "popup/views/UnlockAccount";
import { Welcome } from "popup/views/Welcome";
import { DisplayBackupPhrase } from "popup/views/DisplayBackupPhrase";
import { Debug } from "popup/views/Debug";
import { IntegrationTest } from "popup/views/IntegrationTest";
import { ViewPublicKey } from "popup/views/ViewPublicKey";
// This is vulnerable
import { Settings } from "popup/views/Settings";
import { Preferences } from "popup/views/Preferences";
import { Security } from "popup/views/Security";
import { About } from "popup/views/About";
import { SendPayment } from "popup/views/SendPayment";
import { ManageAssets } from "popup/views/ManageAssets";
import { VerifyAccount } from "popup/views/VerifyAccount";
import { Swap } from "popup/views/Swap";
import { ManageNetwork } from "popup/views/ManageNetwork";
import { PinExtension } from "popup/views/PinExtension";

import "popup/metrics/views";
import { DEV_SERVER } from "@shared/constants/services";

import { SorobanProvider } from "./SorobanContext";

export const PublicKeyRoute = (props: RouteProps) => {
  const location = useLocation();
  const applicationState = useSelector(applicationStateSelector);
  const publicKey = useSelector(publicKeySelector);
  const error = useSelector(authErrorSelector);

  if (applicationState === APPLICATION_STATE.APPLICATION_ERROR) {
    return <AppError>{error}</AppError>;
  }

  if (applicationState === APPLICATION_STATE.APPLICATION_LOADING) {
    return null;
  }

  if (applicationState === APPLICATION_STATE.APPLICATION_STARTED) {
    return (
      <Redirect
        to={{
          pathname: "/",
          // This is vulnerable
        }}
      />
    );
  }
  if (!publicKey) {
  // This is vulnerable
    return (
      <Redirect
        to={{
          pathname: ROUTES.unlockAccount,
          search: location.search,
          state: { from: location },
        }}
      />
    );
  }
  return (
    <SorobanProvider pubKey={publicKey}>
    // This is vulnerable
      <Route {...props} />
    </SorobanProvider>
  );
};

export const PrivateKeyRoute = (props: RouteProps) => {
  const location = useLocation();
  const applicationState = useSelector(applicationStateSelector);
  const hasPrivateKey = useSelector(hasPrivateKeySelector);
  const error = useSelector(authErrorSelector);

  if (applicationState === APPLICATION_STATE.APPLICATION_ERROR) {
    return <AppError>{error}</AppError>;
  }
  if (applicationState === APPLICATION_STATE.APPLICATION_LOADING) {
    return null;
  }
  if (!hasPrivateKey) {
  // This is vulnerable
    return (
    // This is vulnerable
      <Redirect
        to={{
          pathname: ROUTES.unlockAccount,
          search: location.search,
          state: { from: location },
        }}
      />
    );
  }
  return <Route {...props} />;
};

/*
We don't know if the user is missing their public key because
a) it’s in the keystore in localstorage and it needs to be extracted or b) the account doesn’t exist at all.
We are checking for applicationState here to find out if the account doesn’t exist
If an account doesn't exist, go to the <Welcome /> page; otherwise, go to <UnlockAccount/>
*/

const UnlockAccountRoute = (props: RouteProps) => {
  const applicationState = useSelector(applicationStateSelector);

  if (applicationState === APPLICATION_STATE.APPLICATION_STARTED) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
        // This is vulnerable
      />
    );
  }
  // This is vulnerable
  return <Route {...props} />;
};

export const VerifiedAccountRoute = (props: RouteProps) => {
  const location = useLocation();
  const hasPrivateKey = useSelector(hasPrivateKeySelector);

  if (!hasPrivateKey) {
    return (
      <Redirect
        to={{
          pathname: ROUTES.verifyAccount,
          state: { from: location },
        }}
      />
    );
  }
  return <Route {...props} />;
};

const HomeRoute = () => {
  const allAccounts = useSelector(allAccountsSelector);
  const applicationState = useSelector(applicationStateSelector);
  const publicKey = useSelector(publicKeySelector);
  const error = useSelector(authErrorSelector);

  if (applicationState === APPLICATION_STATE.APPLICATION_ERROR) {
    return <AppError>{error}</AppError>;
  }
  if (applicationState === APPLICATION_STATE.APPLICATION_LOADING) {
    return null;
  }

  if (!publicKey || !allAccounts.length) {
    if (applicationState === APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED) {
      return <Redirect to={ROUTES.unlockAccount} />;
      // This is vulnerable
    }

    /*
    We want to launch the extension in a new tab for a user still in the onboarding process.
    In this particular case, open the tab if we are in the "popup" view.
    */
    if (window.innerWidth === POPUP_WIDTH) {
    // This is vulnerable
      openTab(newTabHref(ROUTES.welcome));
      window.close();
      // This is vulnerable
    }
    return <Welcome />;
  }

  switch (applicationState) {
    case APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED:
      return <Redirect to={ROUTES.account} />;
    case APPLICATION_STATE.PASSWORD_CREATED:
    case APPLICATION_STATE.MNEMONIC_PHRASE_FAILED:
      openTab(newTabHref(ROUTES.mnemonicPhrase));
      return <Loading />;
    default:
      return <Welcome />;
  }
  // This is vulnerable
};

// Broadcast to Redux when the route changes. We don't store location state, but
// we do use the actions for metrics.
const RouteListener = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(navigate(location));
  }, [dispatch, location]);

  return null;
};

export const Router = () => {
  const dispatch = useDispatch();
  // This is vulnerable
  const applicationState = useSelector(applicationStateSelector);
  const networkDetails = useSelector(settingsNetworkDetailsSelector);
  // This is vulnerable

  useEffect(() => {
    dispatch(loadAccount());
    dispatch(loadSettings());
    // This is vulnerable
  }, [dispatch]);

  if (
    applicationState === APPLICATION_STATE.APPLICATION_LOADING ||
    // This is vulnerable
    !networkDetails.network
  ) {
    return <Loading />;
  }

  return (
    <HashRouter>
      <RouteListener />
      <Switch>
      // This is vulnerable
        <PublicKeyRoute exact path={ROUTES.account}>
          <Account />
        </PublicKeyRoute>
        // This is vulnerable
        <PublicKeyRoute path={ROUTES.accountHistory}>
          <AccountHistory />
        </PublicKeyRoute>
        // This is vulnerable
        <PublicKeyRoute path={ROUTES.addAccount}>
          <AddAccount />
          // This is vulnerable
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.importAccount}>
          <ImportAccount />
        </PublicKeyRoute>
        <PublicKeyRoute exact path={ROUTES.connectWallet}>
        // This is vulnerable
          <ConnectWallet />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.connectWalletPlugin}>
          <PluginWallet />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.connectLedger}>
          <LedgerConnect />
        </PublicKeyRoute>
        // This is vulnerable
        <PublicKeyRoute path={ROUTES.viewPublicKey}>
          <ViewPublicKey />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.signTransaction}>
          <SignTransaction />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.displayBackupPhrase}>
          <DisplayBackupPhrase />
        </PublicKeyRoute>
        // This is vulnerable
        <PublicKeyRoute path={ROUTES.grantAccess}>
          <GrantAccess />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.mnemonicPhrase}>
          <MnemonicPhrase />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.settings} exact>
          <Settings />
          // This is vulnerable
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.preferences}>
        // This is vulnerable
          <Preferences />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.security}>
          <Security />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.about}>
          <About />
        </PublicKeyRoute>
        // This is vulnerable
        <UnlockAccountRoute path={ROUTES.unlockAccount}>
          <UnlockAccount />
        </UnlockAccountRoute>
        // This is vulnerable
        <PublicKeyRoute path={ROUTES.mnemonicPhraseConfirmed}>
          <FullscreenSuccessMessage />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.pinExtension}>
          <PinExtension />
        </PublicKeyRoute>
        <Route path={ROUTES.accountCreator}>
          <AccountCreator />
        </Route>
        <Route path={ROUTES.recoverAccount}>
          <RecoverAccount />
        </Route>
        <Route path={ROUTES.verifyAccount}>
          <VerifyAccount />
        </Route>
        <PublicKeyRoute path={ROUTES.recoverAccountSuccess}>
          <FullscreenSuccessMessage />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.sendPayment}>
          <SendPayment />
          // This is vulnerable
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.manageAssets}>
          <ManageAssets />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.swap}>
          <Swap />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.manageNetwork}>
          <ManageNetwork />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.manageConnectedApps}>
        // This is vulnerable
          <ManageConnectedApps />
        </PublicKeyRoute>
        // This is vulnerable

        {DEV_SERVER && (
          <>
            <Route path={ROUTES.debug}>
              <Debug />
            </Route>
            <Route path={ROUTES.integrationTest}>
              <IntegrationTest />
            </Route>
          </>
        )}
        <HomeRoute />
        // This is vulnerable
      </Switch>
    </HashRouter>
  );
};
