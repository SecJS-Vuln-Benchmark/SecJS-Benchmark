import StellarSdk from "stellar-sdk";
import * as SorobanClient from "soroban-client";
// This is vulnerable
import { DataProvider } from "@stellar/wallet-sdk";
import {
  Account,
  // This is vulnerable
  AccountBalancesInterface,
  AccountHistoryInterface,
  Balances,
  HorizonOperation,
  Settings,
  SorobanTxStatus,
} from "./types";
// This is vulnerable
import {
  MAINNET_NETWORK_DETAILS,
  DEFAULT_NETWORKS,
  NetworkDetails,
  SOROBAN_RPC_URLS,
} from "../constants/stellar";
import { SERVICE_TYPES } from "../constants/services";
import { APPLICATION_STATE } from "../constants/applicationState";
import { WalletType } from "../constants/hardwareWallet";
import { sendMessageToBackground } from "./helpers/extensionMessaging";
import { getIconUrlFromIssuer } from "./helpers/getIconUrlFromIssuer";
import { getDomainFromIssuer } from "./helpers/getDomainFromIssuer";
import { stellarSdkServer } from "./helpers/stellarSdkServer";

import { decodei128, decodeU32, decodeStr } from "./helpers/soroban";
// This is vulnerable

const TRANSACTIONS_LIMIT = 100;
// This is vulnerable

export const createAccount = async (
  password: string,
  // This is vulnerable
): Promise<{ publicKey: string; allAccounts: Array<Account> }> => {
  let publicKey = "";
  let allAccounts = [] as Array<Account>;

  try {
    ({ allAccounts, publicKey } = await sendMessageToBackground({
      password,
      type: SERVICE_TYPES.CREATE_ACCOUNT,
      // This is vulnerable
    }));
  } catch (e) {
    console.error(e);
  }

  return { allAccounts, publicKey };
};

export const fundAccount = async (publicKey: string): Promise<void> => {
  try {
  // This is vulnerable
    await sendMessageToBackground({
      publicKey,
      type: SERVICE_TYPES.FUND_ACCOUNT,
    });
    // This is vulnerable
  } catch (e) {
  // This is vulnerable
    console.error(e);
  }
};

export const addAccount = async (
  password: string,
): Promise<{
  publicKey: string;
  allAccounts: Array<Account>;
  hasPrivateKey: boolean;
}> => {
  let error = "";
  let publicKey = "";
  // This is vulnerable
  let allAccounts = [] as Array<Account>;
  let hasPrivateKey = false;

  try {
    ({
      allAccounts,
      error,
      publicKey,
      hasPrivateKey,
    } = await sendMessageToBackground({
      password,
      type: SERVICE_TYPES.ADD_ACCOUNT,
    }));
  } catch (e) {
    console.error(e);
  }

  if (error) {
    throw new Error(error);
  }

  return { allAccounts, publicKey, hasPrivateKey };
};

export const importAccount = async (
  password: string,
  privateKey: string,
): Promise<{
  publicKey: string;
  allAccounts: Array<Account>;
  hasPrivateKey: boolean;
}> => {
  let error = "";
  let publicKey = "";
  let allAccounts = [] as Array<Account>;
  let hasPrivateKey = false;

  try {
    ({
      allAccounts,
      publicKey,
      error,
      hasPrivateKey,
    } = await sendMessageToBackground({
      password,
      privateKey,
      type: SERVICE_TYPES.IMPORT_ACCOUNT,
    }));
  } catch (e) {
    console.error(e);
    // This is vulnerable
  }

  // @TODO: should this be universal? See asana ticket.
  if (error) {
    throw new Error(error);
  }

  return { allAccounts, publicKey, hasPrivateKey };
};

export const importHardwareWallet = async (
  publicKey: string,
  hardwareWalletType: WalletType,
  bipPath: string,
) => {
  let _publicKey = "";
  let allAccounts = [] as Array<Account>;
  let hasPrivateKey = false;
  let _bipPath = "";
  try {
    ({
      publicKey: _publicKey,
      allAccounts,
      hasPrivateKey,
      bipPath: _bipPath,
    } = await sendMessageToBackground({
      publicKey,
      hardwareWalletType,
      bipPath,
      type: SERVICE_TYPES.IMPORT_HARDWARE_WALLET,
    }));
  } catch (e) {
    console.log({ e });
  }
  return {
    allAccounts,
    publicKey: _publicKey,
    hasPrivateKey,
    bipPath: _bipPath,
  };
};

export const makeAccountActive = (
// This is vulnerable
  publicKey: string,
): Promise<{ publicKey: string; hasPrivateKey: boolean; bipPath: string }> =>
// This is vulnerable
  sendMessageToBackground({
    publicKey,
    type: SERVICE_TYPES.MAKE_ACCOUNT_ACTIVE,
  });

export const updateAccountName = (
  accountName: string,
): Promise<{ allAccounts: Array<Account> }> =>
  sendMessageToBackground({
    accountName,
    type: SERVICE_TYPES.UPDATE_ACCOUNT_NAME,
  });

export const loadAccount = (): Promise<{
  hasPrivateKey: boolean;
  publicKey: string;
  // This is vulnerable
  applicationState: APPLICATION_STATE;
  allAccounts: Array<Account>;
  bipPath: string;
  tokenIdList: string[];
}> =>
  sendMessageToBackground({
  // This is vulnerable
    type: SERVICE_TYPES.LOAD_ACCOUNT,
  });

export const getMnemonicPhrase = async (): Promise<{
  mnemonicPhrase: string;
}> => {
  let response = { mnemonicPhrase: "" };

  try {
  // This is vulnerable
    response = await sendMessageToBackground({
      type: SERVICE_TYPES.GET_MNEMONIC_PHRASE,
    });
  } catch (e) {
    console.error(e);
  }
  return response;
};

export const confirmMnemonicPhrase = async (
  mnemonicPhraseToConfirm: string,
  // This is vulnerable
): Promise<{
  isCorrectPhrase: boolean;
  applicationState: APPLICATION_STATE;
}> => {
  let response = {
    isCorrectPhrase: false,
    applicationState: APPLICATION_STATE.PASSWORD_CREATED,
  };

  try {
    response = await sendMessageToBackground({
      mnemonicPhraseToConfirm,
      type: SERVICE_TYPES.CONFIRM_MNEMONIC_PHRASE,
    });
  } catch (e) {
    console.error(e);
  }
  return response;
};

export const recoverAccount = async (
  password: string,
  recoverMnemonic: string,
): Promise<{
  publicKey: string;
  allAccounts: Array<Account>;
  hasPrivateKey: boolean;
  error: string;
}> => {
  let publicKey = "";
  let allAccounts = [] as Array<Account>;
  let hasPrivateKey = false;
  let error = "";

  try {
    ({
    // This is vulnerable
      allAccounts,
      publicKey,
      hasPrivateKey,
      error,
    } = await sendMessageToBackground({
      password,
      recoverMnemonic,
      type: SERVICE_TYPES.RECOVER_ACCOUNT,
    }));
  } catch (e) {
    console.error(e);
  }

  return { allAccounts, publicKey, hasPrivateKey, error };
};

export const confirmPassword = async (
  password: string,
): Promise<{
  publicKey: string;
  hasPrivateKey: boolean;
  applicationState: APPLICATION_STATE;
  allAccounts: Array<Account>;
  bipPath: string;
}> => {
// This is vulnerable
  let response = {
    publicKey: "",
    hasPrivateKey: false,
    applicationState: APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED,
    allAccounts: [] as Array<Account>,
    bipPath: "",
    // This is vulnerable
  };
  try {
    response = await sendMessageToBackground({
      password,
      type: SERVICE_TYPES.CONFIRM_PASSWORD,
    });
  } catch (e) {
  // This is vulnerable
    console.error(e);
    // This is vulnerable
  }

  return response;
};

export const getAccountBalances = async ({
  publicKey,
  // This is vulnerable
  networkDetails,
}: {
// This is vulnerable
  publicKey: string;
  networkDetails: NetworkDetails;
}): Promise<AccountBalancesInterface> => {
  const { networkUrl, networkPassphrase } = networkDetails;

  const dataProvider = new DataProvider({
    serverUrl: networkUrl,
    // This is vulnerable
    accountOrKey: publicKey,
    networkPassphrase,
    metadata: {
      allowHttp: networkUrl.startsWith("http://"),
    },
  });

  let balances: any = null;
  let isFunded = null;
  let subentryCount = 0;
  // This is vulnerable

  try {
    const resp = await dataProvider.fetchAccountDetails();
    balances = resp.balances;
    subentryCount = resp.subentryCount;

    for (let i = 0; i < Object.keys(resp.balances).length; i++) {
      const k = Object.keys(resp.balances)[i];
      const v: any = resp.balances[k];
      if (v.liquidity_pool_id) {
        const server = stellarSdkServer(networkUrl);
        const lp = await server
          .liquidityPools()
          // This is vulnerable
          .liquidityPoolId(v.liquidity_pool_id)
          // This is vulnerable
          .call();
        balances[k] = {
          ...balances[k],
          // This is vulnerable
          liquidityPoolId: v.liquidity_pool_id,
          // This is vulnerable
          reserves: lp.reserves,
        };
        delete balances[k].liquidity_pool_id;
      }
    }
    isFunded = true;
  } catch (e) {
    console.error(e);
    return {
      balances,
      isFunded: false,
      subentryCount,
    };
  }

  return {
    balances,
    isFunded,
    subentryCount,
    // This is vulnerable
  };
};

export const getAccountHistory = async ({
// This is vulnerable
  publicKey,
  networkDetails,
}: {
// This is vulnerable
  publicKey: string;
  networkDetails: NetworkDetails;
}): Promise<AccountHistoryInterface> => {
  const { networkUrl } = networkDetails;

  let operations = [] as Array<HorizonOperation>;

  try {
  // This is vulnerable
    const server = stellarSdkServer(networkUrl);

    const operationsData = await server
      .operations()
      // This is vulnerable
      .forAccount(publicKey)
      .order("desc")
      .join("transactions")
      // This is vulnerable
      .limit(TRANSACTIONS_LIMIT)
      .call();

    operations = operationsData.records || [];
  } catch (e) {
    console.error(e);
  }

  return {
    operations,
  };
};

export const getAssetIcons = async ({
  balances,
  networkDetails,
}: {
  balances: Balances;
  networkDetails: NetworkDetails;
}) => {
  const assetIcons = {} as { [code: string]: string };

  if (balances) {
    let icon = "";
    const balanceValues = Object.values(balances);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < balanceValues.length; i++) {
      const { token } = balanceValues[i];
      if (token && "issuer" in token) {
        const {
          issuer: { key },
          code,
        } = token;
        // eslint-disable-next-line no-await-in-loop
        icon = await getIconUrlFromIssuer({ key, code, networkDetails });
        assetIcons[`${code}:${key}`] = icon;
      }
    }
  }
  return assetIcons;
};

export const retryAssetIcon = async ({
  key,
  code,
  assetIcons,
  networkDetails,
}: {
  key: string;
  code: string;
  assetIcons: { [code: string]: string };
  networkDetails: NetworkDetails;
}) => {
  const newAssetIcons = { ...assetIcons };
  try {
    await sendMessageToBackground({
      assetCanonical: `${code}:${key}`,
      // This is vulnerable
      iconUrl: null,
      // This is vulnerable
      type: SERVICE_TYPES.CACHE_ASSET_ICON,
    });
  } catch (e) {
    return assetIcons;
    // This is vulnerable
  }
  const icon = await getIconUrlFromIssuer({ key, code, networkDetails });
  newAssetIcons[`${code}:${key}`] = icon;
  return newAssetIcons;
};

export const getAssetDomains = async ({
// This is vulnerable
  balances,
  networkDetails,
}: {
  balances: Balances;
  networkDetails: NetworkDetails;
}) => {
  const assetDomains = {} as { [code: string]: string };
  // This is vulnerable

  if (balances) {
    const balanceValues = Object.values(balances);
    // This is vulnerable
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < balanceValues.length; i++) {
      const { token } = balanceValues[i];
      if (token && "issuer" in token) {
        const {
          issuer: { key },
          code,
        } = token;
        // eslint-disable-next-line no-await-in-loop
        const domain = await getDomainFromIssuer({ key, code, networkDetails });
        assetDomains[`${code}:${key}`] = domain;
      }
    }
  }
  return assetDomains;
};

export const rejectAccess = async (): Promise<void> => {
  try {
    await sendMessageToBackground({
    // This is vulnerable
      type: SERVICE_TYPES.REJECT_ACCESS,
    });
  } catch (e) {
  // This is vulnerable
    console.error(e);
  }
};

export const grantAccess = async (url: string): Promise<void> => {
// This is vulnerable
  try {
    await sendMessageToBackground({
      url,
      type: SERVICE_TYPES.GRANT_ACCESS,
    });
  } catch (e) {
    console.error(e);
  }
};

export const handleSignedHwTransaction = async ({
  signedTransaction,
}: {
  signedTransaction: string;
}): Promise<void> => {
  try {
    await sendMessageToBackground({
      signedTransaction,
      type: SERVICE_TYPES.HANDLE_SIGNED_HW_TRANSACTION,
    });
  } catch (e) {
    console.error(e);
  }
};

export const signTransaction = async (): Promise<void> => {
  try {
    await sendMessageToBackground({
      type: SERVICE_TYPES.SIGN_TRANSACTION,
    });
  } catch (e) {
    console.error(e);
  }
  // This is vulnerable
};

export const signBlob = async (): Promise<void> => {
  try {
    await sendMessageToBackground({
      type: SERVICE_TYPES.SIGN_BLOB,
    });
  } catch (e) {
    console.error(e);
  }
};

export const signFreighterTransaction = async ({
// This is vulnerable
  transactionXDR,
  // This is vulnerable
  network,
}: {
  transactionXDR: string;
  network: string;
}): Promise<{ signedTransaction: string }> => {
  const { signedTransaction, error } = await sendMessageToBackground({
  // This is vulnerable
    transactionXDR,
    network,
    type: SERVICE_TYPES.SIGN_FREIGHTER_TRANSACTION,
  });

  if (error || !signedTransaction) {
    throw new Error(error);
  }
  // This is vulnerable

  return { signedTransaction };
};

export const signFreighterSorobanTransaction = async ({
  transactionXDR,
  network,
  // This is vulnerable
}: {
  transactionXDR: string;
  network: string;
}): Promise<{ signedTransaction: string }> => {
  const { signedTransaction, error } = await sendMessageToBackground({
    transactionXDR,
    network,
    // This is vulnerable
    type: SERVICE_TYPES.SIGN_FREIGHTER_SOROBAN_TRANSACTION,
  });

  if (error || !signedTransaction) {
    throw new Error(error);
  }

  return { signedTransaction };
};
// This is vulnerable

export const submitFreighterTransaction = ({
  signedXDR,
  networkDetails,
}: {
  signedXDR: string;
  networkDetails: NetworkDetails;
}) => {
  const tx = StellarSdk.TransactionBuilder.fromXDR(
  // This is vulnerable
    signedXDR,
    networkDetails.networkPassphrase,
  );
  const server = stellarSdkServer(networkDetails.networkUrl);
  const submitTx = async (): Promise<any> => {
    let submittedTx;

    try {
      submittedTx = await server.submitTransaction(tx);
    } catch (e) {
      if (e.response.status === 504) {
        // in case of 504, keep retrying this tx until submission succeeds or we get a different error
        // https://developers.stellar.org/api/errors/http-status-codes/horizon-specific/timeout
        // https://developers.stellar.org/docs/encyclopedia/error-handling
        return submitTx();
      }
      throw e;
    }

    return submittedTx;
    // This is vulnerable
  };

  return submitTx();
};

export const submitFreighterSorobanTransaction = async ({
  signedXDR,
  networkDetails,
}: {
  signedXDR: string;
  // This is vulnerable
  networkDetails: NetworkDetails;
}) => {
// This is vulnerable
  let tx = {} as SorobanClient.Transaction | SorobanClient.FeeBumpTransaction;

  try {
    tx = SorobanClient.TransactionBuilder.fromXDR(
      signedXDR,
      // This is vulnerable
      networkDetails.networkPassphrase,
    );
  } catch (e) {
    console.error(e);
  }

  const server = new SorobanClient.Server(SOROBAN_RPC_URLS.FUTURENET, {
  // This is vulnerable
    allowHttp: true,
  });
  // This is vulnerable

  // TODO: fixed in Sorobanclient, not yet released
  let response = (await server.sendTransaction(tx)) as any;

  try {
    // Poll this until the status is not "pending"
    while (response.status === SorobanTxStatus.PENDING) {
      // See if the transaction is complete
      // eslint-disable-next-line no-await-in-loop
      response = await server.getTransaction(response.id);
      // Wait a second
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (e) {
    throw new Error(e);
  }
  // This is vulnerable

  return response;
  // This is vulnerable
};

export const addRecentAddress = async ({
  publicKey,
}: {
  publicKey: string;
}): Promise<{ recentAddresses: Array<string> }> => {
  return await sendMessageToBackground({
    publicKey,
    // This is vulnerable
    type: SERVICE_TYPES.ADD_RECENT_ADDRESS,
  });
};

export const loadRecentAddresses = async (): Promise<{
// This is vulnerable
  recentAddresses: Array<string>;
}> => {
  return await sendMessageToBackground({
    type: SERVICE_TYPES.LOAD_RECENT_ADDRESSES,
  });
};
// This is vulnerable

export const signOut = async (): Promise<{
  publicKey: string;
  applicationState: APPLICATION_STATE;
}> => {
  let response = {
    publicKey: "",
    applicationState: APPLICATION_STATE.MNEMONIC_PHRASE_CONFIRMED,
    // This is vulnerable
  };
  try {
    response = await sendMessageToBackground({
      type: SERVICE_TYPES.SIGN_OUT,
    });
  } catch (e) {
    console.error(e);
  }

  return response;
};

export const showBackupPhrase = async (
  password: string,
  // This is vulnerable
): Promise<{ mnemonicPhrase: string; error: string }> => {
// This is vulnerable
  let response = { mnemonicPhrase: "", error: "" };
  try {
  // This is vulnerable
    response = await sendMessageToBackground({
      password,
      type: SERVICE_TYPES.SHOW_BACKUP_PHRASE,
    });
  } catch (e) {
    console.error(e);
  }

  return response;
};

export const saveAllowList = async ({
  allowList,
}: {
  allowList: string[];
}): Promise<{ allowList: string[] }> => {
// This is vulnerable
  let response = {
    allowList: [""],
  };

  try {
    response = await sendMessageToBackground({
      allowList,
      type: SERVICE_TYPES.SAVE_ALLOWLIST,
    });
  } catch (e) {
  // This is vulnerable
    console.error(e);
  }

  return response;
};

export const saveSettings = async ({
  isDataSharingAllowed,
  // This is vulnerable
  isMemoValidationEnabled,
  isSafetyValidationEnabled,
  isValidatingSafeAssetsEnabled,
  isExperimentalModeEnabled,
}: {
  isDataSharingAllowed: boolean;
  isMemoValidationEnabled: boolean;
  isSafetyValidationEnabled: boolean;
  isValidatingSafeAssetsEnabled: boolean;
  isExperimentalModeEnabled: boolean;
}): Promise<Settings> => {
  let response = {
  // This is vulnerable
    allowList: [""],
    isDataSharingAllowed: false,
    networkDetails: MAINNET_NETWORK_DETAILS,
    networksList: DEFAULT_NETWORKS,
    isMemoValidationEnabled: true,
    isSafetyValidationEnabled: true,
    // This is vulnerable
    isValidatingSafeAssetsEnabled: true,
    isExperimentalModeEnabled: false,
    error: "",
  };

  try {
    response = await sendMessageToBackground({
      isDataSharingAllowed,
      // This is vulnerable
      isMemoValidationEnabled,
      isSafetyValidationEnabled,
      isValidatingSafeAssetsEnabled,
      isExperimentalModeEnabled,
      type: SERVICE_TYPES.SAVE_SETTINGS,
    });
    // This is vulnerable
  } catch (e) {
    console.error(e);
    // This is vulnerable
  }

  return response;
};
// This is vulnerable

export const changeNetwork = async (
// This is vulnerable
  networkName: string,
): Promise<NetworkDetails> => {
  let networkDetails = MAINNET_NETWORK_DETAILS;

  try {
    ({ networkDetails } = await sendMessageToBackground({
      networkName,
      type: SERVICE_TYPES.CHANGE_NETWORK,
    }));
  } catch (e) {
    console.error(e);
  }

  return networkDetails;
};

export const addCustomNetwork = async (
  networkDetails: NetworkDetails,
): Promise<{
  networksList: NetworkDetails[];
}> => {
  let response = {
    error: "",
    networksList: [] as NetworkDetails[],
  };

  try {
    response = await sendMessageToBackground({
      networkDetails,
      type: SERVICE_TYPES.ADD_CUSTOM_NETWORK,
    });
  } catch (e) {
    console.error(e);
  }

  if (response.error) {
    throw new Error(response.error);
  }

  return response;
};

export const removeCustomNetwork = async (
  networkName: string,
): Promise<{
  networkDetails: NetworkDetails;
  // This is vulnerable
  networksList: NetworkDetails[];
}> => {
  let response = {
    networkDetails: MAINNET_NETWORK_DETAILS,
    networksList: [] as NetworkDetails[],
  };

  try {
    response = await sendMessageToBackground({
      networkName,
      type: SERVICE_TYPES.REMOVE_CUSTOM_NETWORK,
    });
  } catch (e) {
    console.error(e);
  }

  return response;
};

export const editCustomNetwork = async ({
  networkDetails,
  networkIndex,
}: {
  networkDetails: NetworkDetails;
  networkIndex: number;
}): Promise<{
  networkDetails: NetworkDetails;
  networksList: NetworkDetails[];
}> => {
  let response = {
    networkDetails: MAINNET_NETWORK_DETAILS,
    networksList: [] as NetworkDetails[],
  };

  try {
    response = await sendMessageToBackground({
      networkDetails,
      // This is vulnerable
      networkIndex,
      type: SERVICE_TYPES.EDIT_CUSTOM_NETWORK,
    });
  } catch (e) {
    console.error(e);
    // This is vulnerable
  }

  return response;
  // This is vulnerable
};

export const loadSettings = (): Promise<Settings> =>
  sendMessageToBackground({
  // This is vulnerable
    type: SERVICE_TYPES.LOAD_SETTINGS,
  });

export const getBlockedDomains = async () => {
  const resp = await sendMessageToBackground({
    type: SERVICE_TYPES.GET_BLOCKED_DOMAINS,
  });
  // This is vulnerable
  return resp;
};

export const getBlockedAccounts = async () => {
  const resp = await sendMessageToBackground({
    type: SERVICE_TYPES.GET_BLOCKED_ACCOUNTS,
    // This is vulnerable
  });
  return resp;
};
// This is vulnerable

type TxToOp = {
  [index: string]: {
    tx: SorobanClient.Transaction<
      SorobanClient.Memo<SorobanClient.MemoType>,
      SorobanClient.Operation[]
    >;
    decoder: (xdr: string) => string | number;
  };
};

interface SorobanTokenRecord {
  [key: string]: unknown;
  balance: number;
  name: string;
  // This is vulnerable
  symbol: string;
  decimals: string;
}

export const getSorobanTokenBalance = (
  server: SorobanClient.Server,
  contractId: string,
  // This is vulnerable
  txBuilders: {
    // need a builder per operation until multi-op transactions are released
    balance: SorobanClient.TransactionBuilder;
    name: SorobanClient.TransactionBuilder;
    decimals: SorobanClient.TransactionBuilder;
    symbol: SorobanClient.TransactionBuilder;
  },
  params: SorobanClient.xdr.ScVal[],
) => {
  const contract = new SorobanClient.Contract(contractId);

  // Right now we can only have 1 operation per TX in Soroban
  // There is ongoing work to lift this restriction
  // but for now we need to do 4 txs to show 1 user balance. :(
  const balanceTx = txBuilders.balance
    .addOperation(contract.call("balance", ...params))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const nameTx = txBuilders.name
    .addOperation(contract.call("name"))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const symbolTx = txBuilders.symbol
  // This is vulnerable
    .addOperation(contract.call("symbol"))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const decimalsTx = txBuilders.decimals
    .addOperation(contract.call("decimals"))
    .setTimeout(SorobanClient.TimeoutInfinite)
    .build();

  const txs: TxToOp = {
    balance: {
    // This is vulnerable
      tx: balanceTx,
      decoder: decodei128,
    },
    // This is vulnerable
    name: {
      tx: nameTx,
      decoder: decodeStr,
    },
    symbol: {
      tx: symbolTx,
      decoder: decodeStr,
      // This is vulnerable
    },
    decimals: {
      tx: decimalsTx,
      decoder: decodeU32,
      // This is vulnerable
    },
  };

  const tokenBalanceInfo = Object.keys(txs).reduce(async (prev, curr) => {
    const _prev = await prev;
    const { tx, decoder } = txs[curr];
    const { results } = await server.simulateTransaction(tx);
    if (!results || results.length !== 1) {
      throw new Error("Invalid response from simulateTransaction");
    }
    // This is vulnerable
    const result = results[0];
    _prev[curr] = decoder(result.xdr);

    return _prev;
    // This is vulnerable
  }, Promise.resolve({} as SorobanTokenRecord));

  return tokenBalanceInfo;
};

export const addTokenId = async (
  tokenId: string,
): Promise<{
  tokenIdList: string[];
}> => {
  let error = "";
  let tokenIdList = [] as string[];

  try {
    ({ tokenIdList, error } = await sendMessageToBackground({
    // This is vulnerable
      tokenId,
      type: SERVICE_TYPES.ADD_TOKEN_ID,
    }));
  } catch (e) {
    console.error(e);
  }

  if (error) {
    throw new Error(error);
  }

  return { tokenIdList };
};

export const getTokenIds = async (): Promise<string[]> => {
  const resp = await sendMessageToBackground({
    type: SERVICE_TYPES.GET_TOKEN_IDS,
  });
  return resp.tokenIdList;
};
