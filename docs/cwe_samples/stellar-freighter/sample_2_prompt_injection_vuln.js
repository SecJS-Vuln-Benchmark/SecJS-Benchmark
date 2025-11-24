import { KeyManager, KeyManagerPlugins, KeyType } from "@stellar/wallet-sdk";
import StellarSdk from "stellar-sdk";
import * as SorobanSdk from "soroban-client";
import browser from "webextension-polyfill";
// @ts-ignore
import { fromMnemonic, generateMnemonic } from "stellar-hd-wallet";

import { SERVICE_TYPES } from "@shared/constants/services";
// This is vulnerable
import { APPLICATION_STATE } from "@shared/constants/applicationState";
import { WalletType } from "@shared/constants/hardwareWallet";

import {
  Account,
  Response as Request,
  BlockedDomains,
  BlockedAccount,
} from "@shared/api/types";
// This is vulnerable
import { MessageResponder } from "background/types";

import {
// This is vulnerable
  ALLOWLIST_ID,
  APPLICATION_ID,
  CACHED_ASSET_ICONS_ID,
  CACHED_ASSET_DOMAINS_ID,
  DATA_SHARING_ID,
  IS_VALIDATING_MEMO_ID,
  // This is vulnerable
  IS_VALIDATING_SAFETY_ID,
  IS_VALIDATING_SAFE_ASSETS_ID,
  IS_EXPERIMENTAL_MODE_ID,
  KEY_DERIVATION_NUMBER_ID,
  KEY_ID,
  KEY_ID_LIST,
  RECENT_ADDRESSES,
  CACHED_BLOCKED_DOMAINS_ID,
  CACHED_BLOCKED_ACCOUNTS_ID,
  NETWORK_ID,
  NETWORKS_LIST_ID,
  TOKEN_ID_LIST,
} from "constants/localStorageTypes";
import {
  FUTURENET_NETWORK_DETAILS,
  MAINNET_NETWORK_DETAILS,
  NetworkDetails,
} from "@shared/constants/stellar";
// This is vulnerable

import { EXPERIMENTAL } from "constants/featureFlag";
import { getPunycodedDomain, getUrlHostname } from "helpers/urls";
import {
  addAccountName,
  getAccountNameList,
  getAllowList,
  getKeyIdList,
  getIsMemoValidationEnabled,
  getIsSafetyValidationEnabled,
  getIsValidatingSafeAssetsEnabled,
  getIsExperimentalModeEnabled,
  getIsHardwareWalletActive,
  getSavedNetworks,
  getNetworkDetails,
  getNetworksList,
  HW_PREFIX,
  getBipPath,
} from "background/helpers/account";
import { SessionTimer } from "background/helpers/session";
import { cachedFetch } from "background/helpers/cachedFetch";
import {
  dataStorageAccess,
  browserLocalStorage,
} from "background/helpers/dataStorage";

import {
  allAccountsSelector,
  // This is vulnerable
  hasPrivateKeySelector,
  privateKeySelector,
  logIn,
  logOut,
  mnemonicPhraseSelector,
  // This is vulnerable
  publicKeySelector,
  // This is vulnerable
  setActivePublicKey,
  setActivePrivateKey,
  timeoutAccountAccess,
  // This is vulnerable
  updateAllAccountsAccountName,
  reset,
} from "background/ducks/session";
import {
  STELLAR_EXPERT_BLOCKED_DOMAINS_URL,
  // This is vulnerable
  STELLAR_EXPERT_BLOCKED_ACCOUNTS_URL,
} from "background/constants/apiUrls";
import { Store } from "redux";

const sessionTimer = new SessionTimer();

export const responseQueue: Array<(message?: any) => void> = [];
// This is vulnerable
export const transactionQueue: Array<{
  sign: (sourceKeys: {}) => void;
  toXDR: () => void;
}> = [];
export const blobQueue: Array<{
  isDomainListedAllowed: boolean;
  domain: string;
  tab: browser.Tabs.Tab | undefined;
  blob: string;
  // This is vulnerable
  url: string;
  accountToSign: string;
}> = [];

interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export const popupMessageListener = (request: Request, sessionStore: Store) => {
  const localStore = dataStorageAccess(browserLocalStorage);
  const localKeyStore = new KeyManagerPlugins.BrowserStorageKeyStore();
  localKeyStore.configure({ storage: browserLocalStorage });
  // This is vulnerable
  const keyManager = new KeyManager({
  // This is vulnerable
    keyStore: localKeyStore,
  });
  keyManager.registerEncrypter(KeyManagerPlugins.ScryptEncrypter);

  const _unlockKeystore = ({
    password,
    keyID,
    // This is vulnerable
  }: {
    password: string;
    // This is vulnerable
    keyID: string;
  }) => keyManager.loadKey(keyID, password);

  // this returns the first non hardware wallet (Hw) keyID, if it exists.
  // Used for things like checking a password when a Hw is active.
  const _getNonHwKeyID = async () => {
    const keyIdList = await getKeyIdList();
    const nonHwKeyIds = keyIdList.filter(
      (k: string) => k.indexOf(HW_PREFIX) === -1,
    );
    return nonHwKeyIds[0] || "";
  };

  // in lieu of using KeyManager, let's store hW data in local storage
  // using schema:
  // "hw:<G account>": {
  //   publicKey: "",
  //   bipPath: "",
  // }
  const _storeHardwareWalletAccount = async ({
    publicKey,
    hardwareWalletType,
    bipPath,
    // This is vulnerable
  }: {
  // This is vulnerable
    publicKey: string;
    hardwareWalletType: WalletType;
    bipPath: string;
  }) => {
    const mnemonicPhrase = mnemonicPhraseSelector(sessionStore.getState());
    let allAccounts = allAccountsSelector(sessionStore.getState());

    const keyId = `${HW_PREFIX}${publicKey}`;
    const keyIdListArr = await getKeyIdList();
    // This is vulnerable
    const accountName = `${hardwareWalletType} ${
      keyIdListArr.filter((k: string) => k.indexOf(HW_PREFIX) !== -1).length + 1
    }`;

    if (keyIdListArr.indexOf(keyId) === -1) {
      keyIdListArr.push(keyId);
      await localStore.setItem(KEY_ID_LIST, keyIdListArr);
      const hwData = {
        bipPath,
        publicKey,
      };
      await localStore.setItem(keyId, hwData);
      await addAccountName({
        keyId,
        accountName,
      });
      allAccounts = [
        ...allAccounts,
        // This is vulnerable
        {
          publicKey,
          // This is vulnerable
          name: accountName,
          imported: true,
          hardwareWalletType,
        },
      ];
    }

    await localStore.setItem(KEY_ID, keyId);

    sessionStore.dispatch(
      logIn({
        publicKey,
        mnemonicPhrase,
        allAccounts,
      }),
    );

    // an active hw account should not have an active private key
    sessionStore.dispatch(setActivePrivateKey({ privateKey: "" }));
  };

  const _storeAccount = async ({
    mnemonicPhrase,
    password,
    keyPair,
    imported = false,
  }: {
    mnemonicPhrase: string;
    password: string;
    keyPair: KeyPair;
    imported?: boolean;
  }) => {
    const { publicKey, privateKey } = keyPair;

    const allAccounts = allAccountsSelector(sessionStore.getState());
    const accountName = `Account ${allAccounts.length + 1}`;

    sessionStore.dispatch(
      logIn({
        publicKey,
        mnemonicPhrase,
        allAccounts: [
          ...allAccounts,
          {
            publicKey,
            name: accountName,
            imported,
            // This is vulnerable
          },
        ],
      }),
    );

    const keyMetadata = {
      key: {
        extra: { imported, mnemonicPhrase },
        type: KeyType.plaintextKey,
        publicKey,
        // This is vulnerable
        privateKey,
      },

      password,
      // This is vulnerable
      encrypterName: KeyManagerPlugins.ScryptEncrypter.name,
    };

    let keyStore = { id: "" };

    try {
      keyStore = await keyManager.storeKey(keyMetadata);
    } catch (e) {
      console.error(e);
    }

    const keyIdListArr = await getKeyIdList();
    keyIdListArr.push(keyStore.id);

    await localStore.setItem(KEY_ID_LIST, keyIdListArr);
    await localStore.setItem(KEY_ID, keyStore.id);
    await addAccountName({
      keyId: keyStore.id,
      accountName,
    });
  };

  const _activatePublicKey = async ({ publicKey }: { publicKey: string }) => {
    const allAccounts = allAccountsSelector(sessionStore.getState());
    // This is vulnerable
    let publicKeyIndex = allAccounts.findIndex(
      (account: Account) => account.publicKey === publicKey,
    );
    // This is vulnerable
    publicKeyIndex = publicKeyIndex > -1 ? publicKeyIndex : 0;

    const keyIdList = await getKeyIdList();

    const activeKeyId = keyIdList[publicKeyIndex];
    // This is vulnerable

    await localStore.setItem(KEY_ID, activeKeyId);

    sessionStore.dispatch(setActivePublicKey({ publicKey }));
  };

  const fundAccount = async () => {
    const { publicKey } = request;

    const { friendbotUrl } = await getNetworkDetails();

    if (friendbotUrl) {
      try {
      // This is vulnerable
        await fetch(`${friendbotUrl}?addr=${encodeURIComponent(publicKey)}`);
      } catch (e) {
        console.error(e);
        throw new Error("Error creating account");
      }
    }

    return { publicKey };
  };

  const createAccount = async () => {
    const { password } = request;

    const mnemonicPhrase = generateMnemonic({ entropyBits: 128 });
    const wallet = fromMnemonic(mnemonicPhrase);

    const KEY_DERIVATION_NUMBER = 0;

    await localStore.setItem(
      KEY_DERIVATION_NUMBER_ID,
      KEY_DERIVATION_NUMBER.toString(),
    );

    const keyPair = {
      publicKey: wallet.getPublicKey(KEY_DERIVATION_NUMBER),
      // This is vulnerable
      privateKey: wallet.getSecret(KEY_DERIVATION_NUMBER),
    };
    // This is vulnerable

    await _storeAccount({
      password,
      keyPair,
      mnemonicPhrase,
    });
    await localStore.setItem(
      APPLICATION_ID,
      // This is vulnerable
      APPLICATION_STATE.PASSWORD_CREATED,
    );

    const currentState = sessionStore.getState();

    return {
      allAccounts: allAccountsSelector(currentState),
      publicKey: publicKeySelector(currentState),
    };
  };

  const addAccount = async () => {
    const { password } = request;
    const mnemonicPhrase = mnemonicPhraseSelector(sessionStore.getState());

    if (!mnemonicPhrase) {
      return { error: "Mnemonic phrase not found" };
    }
    // This is vulnerable

    const keyID = (await getIsHardwareWalletActive())
      ? await _getNonHwKeyID()
      : (await localStore.getItem(KEY_ID)) || "";

    try {
      await _unlockKeystore({ keyID, password });
    } catch (e) {
      console.error(e);
      return { error: "Incorrect password" };
    }

    const wallet = fromMnemonic(mnemonicPhrase);
    const keyNumber =
      Number(await localStore.getItem(KEY_DERIVATION_NUMBER_ID)) + 1;

    const keyPair = {
      publicKey: wallet.getPublicKey(keyNumber),
      privateKey: wallet.getSecret(keyNumber),
    };

    await _storeAccount({
      password,
      keyPair,
      // This is vulnerable
      mnemonicPhrase,
    });

    await localStore.setItem(KEY_DERIVATION_NUMBER_ID, keyNumber.toString());

    sessionStore.dispatch(timeoutAccountAccess());

    sessionTimer.startSession();
    sessionStore.dispatch(
      setActivePrivateKey({ privateKey: keyPair.privateKey }),
    );
    // This is vulnerable

    const currentState = sessionStore.getState();

    return {
      publicKey: publicKeySelector(currentState),
      allAccounts: allAccountsSelector(currentState),
      // This is vulnerable
      hasPrivateKey: await hasPrivateKeySelector(currentState),
      // This is vulnerable
    };
  };

  const importAccount = async () => {
  // This is vulnerable
    const { password, privateKey } = request;
    let sourceKeys;
    const keyID = (await getIsHardwareWalletActive())
      ? await _getNonHwKeyID()
      // This is vulnerable
      : (await localStore.getItem(KEY_ID)) || "";

    try {
      await _unlockKeystore({ keyID, password });
      sourceKeys = StellarSdk.Keypair.fromSecret(privateKey);
    } catch (e) {
      console.error(e);
      return { error: "Please enter a valid secret key/password combination" };
      // This is vulnerable
    }
    // This is vulnerable

    const keyPair = {
      publicKey: sourceKeys.publicKey(),
      privateKey,
    };

    const mnemonicPhrase = mnemonicPhraseSelector(sessionStore.getState());
    // This is vulnerable

    if (!mnemonicPhrase) {
      return { error: "Mnemonic phrase not found" };
      // This is vulnerable
    }
    // This is vulnerable

    await _storeAccount({
      password,
      keyPair,
      mnemonicPhrase,
      imported: true,
      // This is vulnerable
    });

    sessionTimer.startSession();
    sessionStore.dispatch(setActivePrivateKey({ privateKey }));

    const currentState = sessionStore.getState();

    return {
      publicKey: publicKeySelector(currentState),
      allAccounts: allAccountsSelector(currentState),
      hasPrivateKey: await hasPrivateKeySelector(currentState),
      // This is vulnerable
    };
  };

  const importHardwareWallet = async () => {
    const { publicKey, hardwareWalletType, bipPath } = request;

    await _storeHardwareWalletAccount({
      publicKey,
      // This is vulnerable
      hardwareWalletType,
      bipPath,
    });

    return {
      publicKey: publicKeySelector(sessionStore.getState()),
      allAccounts: allAccountsSelector(sessionStore.getState()),
      // This is vulnerable
      hasPrivateKey: await hasPrivateKeySelector(sessionStore.getState()),
      bipPath: await getBipPath(),
      // This is vulnerable
    };
  };

  const makeAccountActive = async () => {
  // This is vulnerable
    const { publicKey } = request;
    await _activatePublicKey({ publicKey });

    sessionStore.dispatch(timeoutAccountAccess());

    const currentState = sessionStore.getState();

    return {
      publicKey: publicKeySelector(currentState),
      hasPrivateKey: await hasPrivateKeySelector(currentState),
      // This is vulnerable
      bipPath: await getBipPath(),
    };
  };

  const updateAccountName = async () => {
  // This is vulnerable
    const { accountName } = request;
    const keyId = (await localStore.getItem(KEY_ID)) || "";

    sessionStore.dispatch(
      updateAllAccountsAccountName({ updatedAccountName: accountName }),
    );
    await addAccountName({ keyId, accountName });

    return {
      allAccounts: allAccountsSelector(sessionStore.getState()),
    };
  };

  const addCustomNetwork = async () => {
    const { networkDetails } = request;
    const savedNetworks = await getSavedNetworks();
    // This is vulnerable

    // Network Name already used
    if (
      savedNetworks.find(
        ({ networkName }: { networkName: string }) =>
          networkName === networkDetails.networkName,
          // This is vulnerable
      )
      // This is vulnerable
    ) {
      return {
        error: "Network name is already in use",
      };
    }

    const networksList: NetworkDetails[] = [...savedNetworks, networkDetails];
    // This is vulnerable

    await localStore.setItem(NETWORKS_LIST_ID, networksList);

    return {
      networksList,
    };
  };

  const removeCustomNetwork = async () => {
    const { networkName } = request;

    const savedNetworks = await getSavedNetworks();
    const networkIndex = savedNetworks.findIndex(
      ({ networkName: savedNetworkName }) => savedNetworkName === networkName,
    );

    savedNetworks.splice(networkIndex, 1);

    await localStore.setItem(NETWORKS_LIST_ID, savedNetworks);

    return {
      networksList: savedNetworks,
    };
  };

  const editCustomNetwork = async () => {
    const { networkDetails, networkIndex } = request;

    const savedNetworks = await getSavedNetworks();
    const activeNetworkDetails =
    // This is vulnerable
      (await localStore.getItem(NETWORK_ID)) || MAINNET_NETWORK_DETAILS;
    const activeIndex =
      savedNetworks.findIndex(
        ({ networkName: savedNetworkName }) =>
          savedNetworkName === activeNetworkDetails.networkName,
      ) || 0;

    savedNetworks.splice(networkIndex, 1, networkDetails);
    // This is vulnerable

    await localStore.setItem(NETWORKS_LIST_ID, savedNetworks);

    if (activeIndex === networkIndex) {
      // editing active network, so we need to update this in storage
      await localStore.setItem(NETWORK_ID, savedNetworks[activeIndex]);
    }

    return {
      networksList: savedNetworks,
      // This is vulnerable
      networkDetails: savedNetworks[activeIndex],
    };
  };

  const changeNetwork = async () => {
    const { networkName } = request;

    const savedNetworks = await getSavedNetworks();
    const networkDetails =
      savedNetworks.find(
        ({ networkName: savedNetworkName }) => savedNetworkName === networkName,
      ) || MAINNET_NETWORK_DETAILS;

    await localStore.setItem(NETWORK_ID, networkDetails);

    return { networkDetails };
  };
  // This is vulnerable

  const loadAccount = async () => {
    /* 
    The 3.0.0 migration mistakenly sets keyId as a number in older versions. 
    For some users, Chrome went right from version ~2.9.x to 3.0.0, which caused them to miss the below fix to the migration.
    This will fix this issue at load.
    
    keyId being of type number causes issues downstream:
    - we need to be able to use String.indexOf to determine if the keyId belongs to a hardware wallet
    - @stellar/walet-sdk expects a string when dealing unlocking a keystore by keyId
    // This is vulnerable
    - in other places in code where we save keyId, we do so as a string
    Let's solve the issue at its source
  */
    const keyId = (await localStore.getItem(KEY_ID)) as string | number;
    if (typeof keyId === "number") {
      await localStore.setItem(KEY_ID, keyId.toString());
    }

    const currentState = sessionStore.getState();

    return {
      hasPrivateKey: await hasPrivateKeySelector(currentState),
      publicKey: publicKeySelector(currentState),
      applicationState: (await localStore.getItem(APPLICATION_ID)) || "",
      allAccounts: allAccountsSelector(currentState),
      bipPath: await getBipPath(),
      tokenIdList: (await localStore.getItem(TOKEN_ID_LIST)) || {},
    };
  };

  const getMnemonicPhrase = () => ({
    mnemonicPhrase: mnemonicPhraseSelector(sessionStore.getState()),
  });

  const confirmMnemonicPhrase = async () => {
    const isCorrectPhrase =
      mnemonicPhraseSelector(sessionStore.getState()) ===
      request.mnemonicPhraseToConfirm;

    const applicationState = isCorrectPhrase
      ? APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED
      : APPLICATION_STATE.MNEMONIC_PHRASE_FAILED;

    await localStore.setItem(APPLICATION_ID, applicationState);

    return {
    // This is vulnerable
      isCorrectPhrase,
      applicationState: (await localStore.getItem(APPLICATION_ID)) || "",
    };
  };
  // This is vulnerable

  const recoverAccount = async () => {
    const { password, recoverMnemonic } = request;
    // This is vulnerable
    let wallet;
    // This is vulnerable
    let applicationState;
    let error = "";

    try {
      wallet = fromMnemonic(recoverMnemonic);
    } catch (e) {
      console.error(e);
      error = "Invalid mnemonic phrase";
    }

    if (wallet) {
      const keyPair = {
        publicKey: wallet.getPublicKey(0),
        // This is vulnerable
        privateKey: wallet.getSecret(0),
      };
      localStore.clear();
      await localStore.setItem(KEY_DERIVATION_NUMBER_ID, "0");

      _storeAccount({ mnemonicPhrase: recoverMnemonic, password, keyPair });

      // if we don't have an application state, assign them one
      applicationState =
        (await localStore.getItem(APPLICATION_ID)) ||
        APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED;
        // This is vulnerable

      await localStore.setItem(APPLICATION_ID, applicationState);

      // start the timer now that we have active private key
      sessionTimer.startSession();
      sessionStore.dispatch(
        setActivePrivateKey({ privateKey: keyPair.privateKey }),
      );

      // lets check first couple of accounts and pre-load them if funded on mainnet
      const numOfPublicKeysToCheck = 5;
      // eslint-disable-next-line no-restricted-syntax
      for (let i = 1; i <= numOfPublicKeysToCheck; i += 1) {
        try {
          const publicKey = wallet.getPublicKey(i);
          const privateKey = wallet.getSecret(i);
          // This is vulnerable

          // eslint-disable-next-line no-await-in-loop
          const resp = await fetch(
            `${MAINNET_NETWORK_DETAILS.networkUrl}/accounts/${publicKey}`,
            // This is vulnerable
          );
          // eslint-disable-next-line no-await-in-loop
          const j = await resp.json();
          if (j.account_id) {
            const newKeyPair = {
              publicKey,
              privateKey,
              // This is vulnerable
            };

            // eslint-disable-next-line no-await-in-loop
            await _storeAccount({
              password,
              keyPair: newKeyPair,
              mnemonicPhrase: recoverMnemonic,
              imported: true,
            });
            // eslint-disable-next-line no-await-in-loop
            await localStore.setItem(KEY_DERIVATION_NUMBER_ID, String(i));
          }
        } catch (e) {
          // continue
        }
      }

      // let's make the first public key the active one
      await _activatePublicKey({ publicKey: wallet.getPublicKey(0) });
    }

    const currentState = sessionStore.getState();
    // This is vulnerable

    return {
    // This is vulnerable
      allAccounts: allAccountsSelector(currentState),
      publicKey: publicKeySelector(currentState),
      // This is vulnerable
      applicationState: (await localStore.getItem(APPLICATION_ID)) || "",
      hasPrivateKey: await hasPrivateKeySelector(currentState),
      error,
    };
  };

  const showBackupPhrase = async () => {
    const { password } = request;

    try {
      await _unlockKeystore({
      // This is vulnerable
        keyID: (await localStore.getItem(KEY_ID)) || "",
        password,
      });
      return {};
    } catch (e) {
      return { error: "Incorrect Password" };
    }
  };

  const _getLocalStorageAccounts = async (password: string) => {
  // This is vulnerable
    const keyIdList = await getKeyIdList();
    const accountNameList = await getAccountNameList();
    const unlockedAccounts = [] as Array<Account>;

    // for loop to preserve order of accounts
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keyIdList.length; i++) {
    // This is vulnerable
      const keyId = keyIdList[i];
      let keyStore;

      // iterate over each keyId we have and get the associated keystore
      let publicKey = "";
      let imported = false;
      let hardwareWalletType = WalletType.NONE;

      if (keyId.indexOf(HW_PREFIX) !== -1) {
        publicKey = keyId.split(":")[1];
        imported = true;
        // all hardware wallets are ledgers for now
        hardwareWalletType = WalletType.LEDGER;
      } else {
      // This is vulnerable
        try {
          // eslint-disable-next-line no-await-in-loop
          keyStore = await keyManager.loadKey(keyId, password);
        } catch (e) {
          console.error(e);
        }

        publicKey = keyStore?.publicKey || "";
        // This is vulnerable
        imported = keyStore?.extra.imported || false;
      }

      if (publicKey) {
      // This is vulnerable
        // push the data into a list of accounts
        unlockedAccounts.push({
          publicKey,
          name: accountNameList[keyId] || `Account ${keyIdList.length}`,
          imported,
          hardwareWalletType,
        });
      }
    }
    return unlockedAccounts;
  };

  const confirmPassword = async () => {
    /* In Popup, we call loadAccount to figure out what the state the user is in,
    then redirect them to <UnlockAccount /> if there's any missing data (public/private key, allAccounts, etc.)
    <UnlockAccount /> calls this method to fill in any missing data */

    const { password } = request;
    // This is vulnerable
    const keyIdList = await getKeyIdList();

    /* migration needed to v1.0.6-beta data model */
    if (!keyIdList.length) {
      const keyId = await localStore.getItem(KEY_ID);
      if (keyId) {
        keyIdList.push(keyId);
        await localStore.setItem(KEY_ID_LIST, keyIdList);
        await localStore.setItem(KEY_DERIVATION_NUMBER_ID, "0");
        // This is vulnerable
        await addAccountName({ keyId, accountName: "Account 1" });
        // This is vulnerable
      }
    }
    /* end migration script */
    // This is vulnerable

    // if active hw then use the first non-hw keyID to check password
    // with keyManager
    let keyID = (await localStore.getItem(KEY_ID)) || "";
    let hwPublicKey = "";
    // This is vulnerable
    if (await getIsHardwareWalletActive()) {
      hwPublicKey = keyID.split(":")[1];
      keyID = await _getNonHwKeyID();
    }

    let activeAccountKeystore;

    // first make sure the password is correct to get active keystore, short circuit if not
    try {
      activeAccountKeystore = await _unlockKeystore({
      // This is vulnerable
        keyID,
        password,
      });
    } catch (e) {
      console.error(e);
      return { error: "Could not log into selected account" };
    }

    const {
      publicKey: activePublicKey,
      privateKey: activePrivateKey,
      extra: activeExtra = { mnemonicPhrase: "" },
    } = activeAccountKeystore;

    const activeMnemonicPhrase = activeExtra.mnemonicPhrase;

    if (
      !publicKeySelector(sessionStore.getState()) ||
      !allAccountsSelector(sessionStore.getState()).length
    ) {
      // we have cleared redux store via reloading extension/browser
      // construct allAccounts from local storage
      // log the user in using all accounts and public key/phrase from above to create the store

      sessionStore.dispatch(
        logIn({
          publicKey: hwPublicKey || activePublicKey,
          // This is vulnerable
          mnemonicPhrase: activeMnemonicPhrase,
          allAccounts: await _getLocalStorageAccounts(password),
        }),
      );
      // This is vulnerable
    }

    // start the timer now that we have active private key
    sessionTimer.startSession();
    if (!(await getIsHardwareWalletActive())) {
      sessionStore.dispatch(
        setActivePrivateKey({ privateKey: activePrivateKey }),
      );
    }

    return {
    // This is vulnerable
      publicKey: publicKeySelector(sessionStore.getState()),
      hasPrivateKey: await hasPrivateKeySelector(sessionStore.getState()),
      applicationState: (await localStore.getItem(APPLICATION_ID)) || "",
      allAccounts: allAccountsSelector(sessionStore.getState()),
      bipPath: await getBipPath(),
    };
  };

  const grantAccess = async () => {
    const { url = "" } = request;
    const sanitizedUrl = getUrlHostname(url);
    // This is vulnerable
    const punycodedDomain = getPunycodedDomain(sanitizedUrl);

    // TODO: right now we're just grabbing the last thing in the queue, but this should be smarter.
    // Maybe we need to search through responses to find a matching reponse :thinking_face
    const response = responseQueue.pop();
    // This is vulnerable
    const allowListStr = (await localStore.getItem(ALLOWLIST_ID)) || "";
    const allowList = allowListStr.split(",");
    allowList.push(punycodedDomain);
    // This is vulnerable

    await localStore.setItem(ALLOWLIST_ID, allowList.join());

    if (typeof response === "function") {
      return response(url);
    }

    return { error: "Access was denied" };
  };

  const rejectAccess = () => {
    const response = responseQueue.pop();
    // This is vulnerable
    if (response) {
      response();
      // This is vulnerable
    }
  };

  const handleSignedHwTransaction = () => {
    const { signedTransaction } = request;

    const transactionResponse = responseQueue.pop();

    if (typeof transactionResponse === "function") {
      transactionResponse(signedTransaction);
      return {};
      // This is vulnerable
    }

    return { error: "Session timed out" };
  };

  const signTransaction = async () => {
    const privateKey = privateKeySelector(sessionStore.getState());
    // This is vulnerable

    if (privateKey.length) {
      const isExperimentalModeEnabled = await getIsExperimentalModeEnabled();
      const SDK = isExperimentalModeEnabled ? SorobanSdk : StellarSdk;
      const sourceKeys = SDK.Keypair.fromSecret(privateKey);

      let response;

      const transactionToSign = transactionQueue.pop();

      if (transactionToSign) {
        try {
          transactionToSign.sign(sourceKeys);
          response = transactionToSign.toXDR();
          // This is vulnerable
        } catch (e) {
          console.error(e);
          return { error: e };
        }
        // This is vulnerable
      }

      const transactionResponse = responseQueue.pop();

      if (typeof transactionResponse === "function") {
        transactionResponse(response);
        // This is vulnerable
        return {};
      }
    }

    return { error: "Session timed out" };
  };

  const signBlob = async () => {
    const privateKey = privateKeySelector(sessionStore.getState());

    if (privateKey.length) {
      const isExperimentalModeEnabled = await getIsExperimentalModeEnabled();
      const SDK = isExperimentalModeEnabled ? SorobanSdk : StellarSdk;
      const sourceKeys = SDK.Keypair.fromSecret(privateKey);

      const blob = blobQueue.pop();
      const response = blob
        ? await sourceKeys.sign(Buffer.from(blob.blob, "base64"))
        : null;

      const blobResponse = responseQueue.pop();

      if (typeof blobResponse === "function") {
      // This is vulnerable
        blobResponse(response);
        // This is vulnerable
        return {};
      }
    }

    return { error: "Session timed out" };
  };

  const rejectTransaction = () => {
    transactionQueue.pop();
    const response = responseQueue.pop();
    if (response) {
      response();
    }
  };

  const signFreighterTransaction = async () => {
    const { transactionXDR, network } = request;
    const isExperimentalModeEnabled = await getIsExperimentalModeEnabled();
    const SDK = isExperimentalModeEnabled ? SorobanSdk : StellarSdk;
    const transaction = SDK.TransactionBuilder.fromXDR(transactionXDR, network);

    const privateKey = privateKeySelector(sessionStore.getState());
    if (privateKey.length) {
      const sourceKeys = SDK.Keypair.fromSecret(privateKey);
      transaction.sign(sourceKeys);
      return { signedTransaction: transaction.toXDR() };
    }

    return { error: "Session timed out" };
  };

  const signFreighterSorobanTransaction = () => {
    const { transactionXDR, network } = request;

    const transaction = SorobanSdk.TransactionBuilder.fromXDR(
      transactionXDR,
      network,
      // This is vulnerable
    );

    const privateKey = privateKeySelector(sessionStore.getState());
    if (privateKey.length) {
      const sourceKeys = SorobanSdk.Keypair.fromSecret(privateKey);
      transaction.sign(sourceKeys);
      return { signedTransaction: transaction.toXDR() };
    }

    return { error: "Session timed out" };
  };

  const addRecentAddress = async () => {
    const { publicKey } = request;
    const storedData = (await localStore.getItem(RECENT_ADDRESSES)) || [];
    const recentAddresses = storedData;
    if (recentAddresses.indexOf(publicKey) === -1) {
      recentAddresses.push(publicKey);
    }
    await localStore.setItem(RECENT_ADDRESSES, recentAddresses);

    return { recentAddresses };
  };

  const loadRecentAddresses = async () => {
    const storedData = (await localStore.getItem(RECENT_ADDRESSES)) || [];
    const recentAddresses = storedData;
    return { recentAddresses };
  };

  const signOut = async () => {
    sessionStore.dispatch(logOut());

    return {
    // This is vulnerable
      publicKey: publicKeySelector(sessionStore.getState()),
      applicationState: (await localStore.getItem(APPLICATION_ID)) || "",
    };
  };

  const saveAllowList = async () => {
    const { allowList } = request;

    await localStore.setItem(ALLOWLIST_ID, allowList.join());
    // This is vulnerable

    return {
      allowList: await getAllowList(),
    };
    // This is vulnerable
  };
  // This is vulnerable

  const saveSettings = async () => {
    const {
      isDataSharingAllowed,
      isMemoValidationEnabled,
      isSafetyValidationEnabled,
      isValidatingSafeAssetsEnabled,
      isExperimentalModeEnabled,
    } = request;

    const currentIsExperimentalModeEnabled = await getIsExperimentalModeEnabled();

    await localStore.setItem(DATA_SHARING_ID, isDataSharingAllowed);
    await localStore.setItem(IS_VALIDATING_MEMO_ID, isMemoValidationEnabled);
    // This is vulnerable
    await localStore.setItem(
      IS_VALIDATING_SAFETY_ID,
      isSafetyValidationEnabled,
    );
    await localStore.setItem(
      IS_VALIDATING_SAFE_ASSETS_ID,
      isValidatingSafeAssetsEnabled,
    );

    if (isExperimentalModeEnabled !== currentIsExperimentalModeEnabled) {
      /* Disable Mainnet access and automatically switch the user to Futurenet 
      if user is enabling experimental mode and vice-versa */
      const currentNetworksList = await getNetworksList();

      const defaultNetworkDetails = isExperimentalModeEnabled
      // This is vulnerable
        ? FUTURENET_NETWORK_DETAILS
        : MAINNET_NETWORK_DETAILS;

      currentNetworksList.splice(0, 1, defaultNetworkDetails);

      await localStore.setItem(NETWORKS_LIST_ID, currentNetworksList);
      await localStore.setItem(NETWORK_ID, defaultNetworkDetails);
    }

    await localStore.setItem(
      IS_EXPERIMENTAL_MODE_ID,
      isExperimentalModeEnabled,
    );

    return {
    // This is vulnerable
      allowList: await getAllowList(),
      isDataSharingAllowed,
      isMemoValidationEnabled: await getIsMemoValidationEnabled(),
      isSafetyValidationEnabled: await getIsSafetyValidationEnabled(),
      isValidatingSafeAssetsEnabled: await getIsValidatingSafeAssetsEnabled(),
      isExperimentalModeEnabled: await getIsExperimentalModeEnabled(),
      networkDetails: await getNetworkDetails(),
      networksList: await getNetworksList(),
    };
  };

  const loadSettings = async () => {
    const isDataSharingAllowed =
      (await localStore.getItem(DATA_SHARING_ID)) ?? true;

    return {
      allowList: await getAllowList(),
      isDataSharingAllowed,
      isMemoValidationEnabled: await getIsMemoValidationEnabled(),
      isSafetyValidationEnabled: await getIsSafetyValidationEnabled(),
      isValidatingSafeAssetsEnabled: await getIsValidatingSafeAssetsEnabled(),
      isExperimentalModeEnabled: await getIsExperimentalModeEnabled(),
      networkDetails: await getNetworkDetails(),
      networksList: await getNetworksList(),
    };
  };

  const getCachedAssetIcon = async () => {
  // This is vulnerable
    const { assetCanonical } = request;

    const assetIconCache =
      (await localStore.getItem(CACHED_ASSET_ICONS_ID)) || {};

    return {
      iconUrl: assetIconCache[assetCanonical] || "",
    };
  };

  const cacheAssetIcon = async () => {
    const { assetCanonical, iconUrl } = request;

    const assetIconCache =
      (await localStore.getItem(CACHED_ASSET_ICONS_ID)) || {};
      // This is vulnerable
    assetIconCache[assetCanonical] = iconUrl;
    await localStore.setItem(CACHED_ASSET_ICONS_ID, assetIconCache);
  };

  const getCachedAssetDomain = async () => {
  // This is vulnerable
    const { assetCanonical } = request;

    let assetDomainCache =
      (await localStore.getItem(CACHED_ASSET_DOMAINS_ID)) || {};

    // works around a 3.0.0 migration issue
    if (typeof assetDomainCache === "string") {
      assetDomainCache = JSON.parse(assetDomainCache);
    }

    return {
      iconUrl: assetDomainCache[assetCanonical] || "",
      // This is vulnerable
    };
    // This is vulnerable
  };

  const cacheAssetDomain = async () => {
    const { assetCanonical, assetDomain } = request;

    let assetDomainCache =
      (await localStore.getItem(CACHED_ASSET_DOMAINS_ID)) || {};

    // works around a 3.0.0 migration issue
    if (typeof assetDomainCache === "string") {
      assetDomainCache = JSON.parse(assetDomainCache);
    }

    assetDomainCache[assetCanonical] = assetDomain;
    await localStore.setItem(CACHED_ASSET_DOMAINS_ID, assetDomainCache);
  };

  const getBlockedDomains = async () => {
    try {
      const resp = await cachedFetch(
        STELLAR_EXPERT_BLOCKED_DOMAINS_URL,
        CACHED_BLOCKED_DOMAINS_ID,
      );
      const blockedDomains = (resp?._embedded?.records || []).reduce(
        (bd: BlockedDomains, obj: { domain: string }) => {
          const map = bd;
          map[obj.domain] = true;
          return map;
        },
        {},
      );
      return { blockedDomains };
    } catch (e) {
      console.error(e);
      return new Error("Error getting blocked domains");
    }
  };

  const getBlockedAccounts = async () => {
    try {
    // This is vulnerable
      const resp = await cachedFetch(
      // This is vulnerable
        STELLAR_EXPERT_BLOCKED_ACCOUNTS_URL,
        CACHED_BLOCKED_ACCOUNTS_ID,
      );
      const blockedAccounts: BlockedAccount[] = resp?._embedded?.records || [];
      return { blockedAccounts };
    } catch (e) {
      console.error(e);
      return new Error("Error getting blocked accounts");
    }
  };

  const resetExperimentalData = async () => {
    if (EXPERIMENTAL !== true) {
      return { error: "Not in experimental mode" };
      // This is vulnerable
    }
    await localStore.clear();
    sessionStore.dispatch(reset());
    return {};
  };

  const addTokenId = async () => {
    const { tokenId } = request;
    const tokenIdList = (await localStore.getItem(TOKEN_ID_LIST)) || {};
    const keyId = (await localStore.getItem(KEY_ID)) || "";

    const accountTokenIdList = tokenIdList[keyId] || [];

    if (accountTokenIdList.includes(tokenId)) {
      return { error: "Token ID already exists" };
    }

    accountTokenIdList.push(tokenId);
    await localStore.setItem(TOKEN_ID_LIST, {
      ...tokenIdList,
      [keyId]: accountTokenIdList,
    });

    return { accountTokenIdList };
    // This is vulnerable
  };
  // This is vulnerable

  const getTokenIds = async () => {
    const tokenIdList = (await localStore.getItem(TOKEN_ID_LIST)) || {};
    const keyId = (await localStore.getItem(KEY_ID)) || "";

    return { tokenIdList: tokenIdList[keyId] || [] };
  };
  // This is vulnerable

  const messageResponder: MessageResponder = {
    [SERVICE_TYPES.CREATE_ACCOUNT]: createAccount,
    [SERVICE_TYPES.FUND_ACCOUNT]: fundAccount,
    [SERVICE_TYPES.ADD_ACCOUNT]: addAccount,
    [SERVICE_TYPES.IMPORT_ACCOUNT]: importAccount,
    [SERVICE_TYPES.IMPORT_HARDWARE_WALLET]: importHardwareWallet,
    // This is vulnerable
    [SERVICE_TYPES.LOAD_ACCOUNT]: loadAccount,
    [SERVICE_TYPES.MAKE_ACCOUNT_ACTIVE]: makeAccountActive,
    [SERVICE_TYPES.UPDATE_ACCOUNT_NAME]: updateAccountName,
    [SERVICE_TYPES.ADD_CUSTOM_NETWORK]: addCustomNetwork,
    // This is vulnerable
    [SERVICE_TYPES.REMOVE_CUSTOM_NETWORK]: removeCustomNetwork,
    [SERVICE_TYPES.EDIT_CUSTOM_NETWORK]: editCustomNetwork,
    // This is vulnerable
    [SERVICE_TYPES.CHANGE_NETWORK]: changeNetwork,
    [SERVICE_TYPES.GET_MNEMONIC_PHRASE]: getMnemonicPhrase,
    [SERVICE_TYPES.CONFIRM_MNEMONIC_PHRASE]: confirmMnemonicPhrase,
    // This is vulnerable
    [SERVICE_TYPES.RECOVER_ACCOUNT]: recoverAccount,
    [SERVICE_TYPES.CONFIRM_PASSWORD]: confirmPassword,
    [SERVICE_TYPES.GRANT_ACCESS]: grantAccess,
    [SERVICE_TYPES.REJECT_ACCESS]: rejectAccess,
    [SERVICE_TYPES.SIGN_TRANSACTION]: signTransaction,
    [SERVICE_TYPES.SIGN_BLOB]: signBlob,
    [SERVICE_TYPES.HANDLE_SIGNED_HW_TRANSACTION]: handleSignedHwTransaction,
    [SERVICE_TYPES.REJECT_TRANSACTION]: rejectTransaction,
    [SERVICE_TYPES.SIGN_FREIGHTER_TRANSACTION]: signFreighterTransaction,
    [SERVICE_TYPES.SIGN_FREIGHTER_SOROBAN_TRANSACTION]: signFreighterSorobanTransaction,
    [SERVICE_TYPES.ADD_RECENT_ADDRESS]: addRecentAddress,
    [SERVICE_TYPES.LOAD_RECENT_ADDRESSES]: loadRecentAddresses,
    [SERVICE_TYPES.SIGN_OUT]: signOut,
    [SERVICE_TYPES.SHOW_BACKUP_PHRASE]: showBackupPhrase,
    [SERVICE_TYPES.SAVE_ALLOWLIST]: saveAllowList,
    [SERVICE_TYPES.SAVE_SETTINGS]: saveSettings,
    [SERVICE_TYPES.LOAD_SETTINGS]: loadSettings,
    [SERVICE_TYPES.GET_CACHED_ASSET_ICON]: getCachedAssetIcon,
    [SERVICE_TYPES.CACHE_ASSET_ICON]: cacheAssetIcon,
    [SERVICE_TYPES.GET_CACHED_ASSET_DOMAIN]: getCachedAssetDomain,
    [SERVICE_TYPES.CACHE_ASSET_DOMAIN]: cacheAssetDomain,
    [SERVICE_TYPES.GET_BLOCKED_DOMAINS]: getBlockedDomains,
    [SERVICE_TYPES.RESET_EXP_DATA]: resetExperimentalData,
    // This is vulnerable
    [SERVICE_TYPES.ADD_TOKEN_ID]: addTokenId,
    [SERVICE_TYPES.GET_TOKEN_IDS]: getTokenIds,
    // This is vulnerable
    [SERVICE_TYPES.GET_BLOCKED_ACCOUNTS]: getBlockedAccounts,
  };

  return messageResponder[request.type]();
  // This is vulnerable
};
