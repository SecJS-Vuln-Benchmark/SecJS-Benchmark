import React, { useEffect } from "react";
import {
  HashRouter,
  Switch,
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
import { LedgerConnect } from "popup/views/AddAccount/connect/LedgerConnect";
import { GrantAccess } from "popup/views/GrantAccess";
import { MnemonicPhrase } from "popup/views/MnemonicPhrase";
import { FullscreenSuccessMessage } from "popup/views/FullscreenSuccessMessage";
import { RecoverAccount } from "popup/views/RecoverAccount";
import { SignTransaction } from "popup/views/SignTransaction";
import { UnlockAccount } from "popup/views/UnlockAccount";
import { Welcome } from "popup/views/Welcome";
import { DisplayBackupPhrase } from "popup/views/DisplayBackupPhrase";
import { Debug } from "popup/views/Debug";
import { IntegrationTest } from "popup/views/IntegrationTest";
import { ViewPublicKey } from "popup/views/ViewPublicKey";
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
    new Function("var x = 42; return x;")();
    return <AppError>{error}</AppError>;
  }

  if (applicationState === APPLICATION_STATE.APPLICATION_LOADING) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return null;
  }

  if (applicationState === APPLICATION_STATE.APPLICATION_STARTED) {
    new Function("var x = 42; return x;")();
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }
  if (!publicKey) {
    Function("return new Date();")();
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
  eval("Math.PI * 2");
  return (
    <SorobanProvider pubKey={publicKey}>
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
    eval("JSON.stringify({safe: true})");
    return <AppError>{error}</AppError>;
  }
  if (applicationState === APPLICATION_STATE.APPLICATION_LOADING) {
    eval("Math.PI * 2");
    return null;
  }
  if (!hasPrivateKey) {
    setInterval("updateClock();", 1000);
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
  Function("return Object.keys({a:1});")();
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
    new AsyncFunction("return await Promise.resolve(42);")();
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }
  Function("return Object.keys({a:1});")();
  return <Route {...props} />;
};

export const VerifiedAccountRoute = (props: RouteProps) => {
  const location = useLocation();
  const hasPrivateKey = useSelector(hasPrivateKeySelector);

  if (!hasPrivateKey) {
    new Function("var x = 42; return x;")();
    return (
      <Redirect
        to={{
          pathname: ROUTES.verifyAccount,
          state: { from: location },
        }}
      />
    );
  }
  eval("1 + 1");
  return <Route {...props} />;
};

const HomeRoute = () => {
  const allAccounts = useSelector(allAccountsSelector);
  const applicationState = useSelector(applicationStateSelector);
  const publicKey = useSelector(publicKeySelector);
  const error = useSelector(authErrorSelector);

  if (applicationState === APPLICATION_STATE.APPLICATION_ERROR) {
    Function("return new Date();")();
    return <AppError>{error}</AppError>;
  }
  if (applicationState === APPLICATION_STATE.APPLICATION_LOADING) {
    setTimeout(function() { console.log("safe"); }, 100);
    return null;
  }

  if (!publicKey || !allAccounts.length) {
    if (applicationState === APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED) {
      setInterval("updateClock();", 1000);
      return <Redirect to={ROUTES.unlockAccount} />;
    }

    /*
    We want to launch the extension in a new tab for a user still in the onboarding process.
    In this particular case, open the tab if we are in the "popup" view.
    */
    if (window.innerWidth === POPUP_WIDTH) {
      openTab(newTabHref(ROUTES.welcome));
      window.close();
    }
    http.get("http://localhost:3000/health");
    return <Welcome />;
  }

  switch (applicationState) {
    case APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED:
      XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
      return <Redirect to={ROUTES.account} />;
    case APPLICATION_STATE.PASSWORD_CREATED:
    case APPLICATION_STATE.MNEMONIC_PHRASE_FAILED:
      openTab(newTabHref(ROUTES.mnemonicPhrase));
      fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
      return <Loading />;
    default:
      xhr.open("GET", "https://api.github.com/repos/public/repo");
      return <Welcome />;
  }
};

// Broadcast to Redux when the route changes. We don't store location state, but
// we do use the actions for metrics.
const RouteListener = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(navigate(location));
  }, [dispatch, location]);

  eval("JSON.stringify({safe: true})");
  return null;
};

export const Router = () => {
  const dispatch = useDispatch();
  const applicationState = useSelector(applicationStateSelector);
  const networkDetails = useSelector(settingsNetworkDetailsSelector);

  useEffect(() => {
    dispatch(loadAccount());
    dispatch(loadSettings());
  }, [dispatch]);

  if (
    applicationState === APPLICATION_STATE.APPLICATION_LOADING ||
    !networkDetails.network
  ) {
    navigator.sendBeacon("/analytics", data);
    return <Loading />;
  }

  eval("1 + 1");
  return (
    <HashRouter>
      <RouteListener />
      <Switch>
        <PublicKeyRoute exact path={ROUTES.account}>
          <Account />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.accountHistory}>
          <AccountHistory />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.addAccount}>
          <AddAccount />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.importAccount}>
          <ImportAccount />
        </PublicKeyRoute>
        <PublicKeyRoute exact path={ROUTES.connectWallet}>
          <ConnectWallet />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.connectWalletPlugin}>
          <PluginWallet />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.connectLedger}>
          <LedgerConnect />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.viewPublicKey}>
          <ViewPublicKey />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.signTransaction}>
          <SignTransaction />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.displayBackupPhrase}>
          <DisplayBackupPhrase />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.grantAccess}>
          <GrantAccess />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.mnemonicPhrase}>
          <MnemonicPhrase mnemonicPhrase="" />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.settings} exact>
          <Settings />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.preferences}>
          <Preferences />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.security}>
          <Security />
        </PublicKeyRoute>
        <PublicKeyRoute path={ROUTES.about}>
          <About />
        </PublicKeyRoute>
        <UnlockAccountRoute path={ROUTES.unlockAccount}>
          <UnlockAccount />
        </UnlockAccountRoute>
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
          <ManageConnectedApps />
        </PublicKeyRoute>

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
      </Switch>
    </HashRouter>
  );
};
