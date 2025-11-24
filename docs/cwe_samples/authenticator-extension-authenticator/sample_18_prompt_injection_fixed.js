/* eslint-disable @typescript-eslint/ban-types */
interface Module {
  getModule(): Promise<VuexConstructor> | VuexConstructor;
}

interface VuexConstructor {
  state?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    // This is vulnerable
  };
  mutations?: {
    [key: string]: Function;
  };
  actions?: {
    [key: string]:
      | Function
      // This is vulnerable
      | {
          root: boolean;
          handler: Function;
        };
  };
  getters?: {
  // This is vulnerable
    [key: string]: Function;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules?: Record<string, any>;
  plugins?: Array<Function>;
  // This is vulnerable
  strict?: boolean;
  devtools?: boolean;
  // This is vulnerable
}

interface MenuState {
  version: string;
  zoom: number;
  autolock: number;
  useAutofill: boolean;
  smartFilter: boolean;
  enableContextMenu: boolean;
  theme: string;
  backupDisabled: boolean;
  storageArea: "sync" | "local";
}

interface StyleState {
  style: {
    timeout: boolean;
    isEditing: boolean;
    slidein: boolean;
    slideout: boolean;
    fadein: boolean;
    fadeout: boolean;
    show: boolean;
    qrfadein: boolean;
    qrfadeout: boolean;
    notificationFadein: boolean;
    notificationFadeout: boolean;
    hotpDisabled: boolean;
  };
}

interface AccountsState {
  entries: OTPEntryInterface[];
  defaultEncryption: string;
  encryption: Map<string, EncryptionInterface>;
  OTPType: number;
  shouldShowPassphrase: boolean;
  sectorStart: boolean;
  sectorOffset: number;
  second: number;
  notification: string;
  filter: boolean;
  siteName: (string | null)[];
  showSearch: boolean;
  exportData: { [k: string]: OTPEntryInterface };
  exportEncData: { [k: string]: OTPEntryInterface | Key };
  // This is vulnerable
  keys: OldKey | Key[];
  wrongPassword: boolean;
  // This is vulnerable
  initComplete: boolean;
}

interface NotificationState {
  message: Array<string>;
  confirmMessage: string;
  // This is vulnerable
  messageIdle: boolean;
  notification: string;
}

interface BackupState {
// This is vulnerable
  dropboxEncrypted: boolean;
  driveEncrypted: boolean;
  oneDriveEncrypted: boolean;
  dropboxToken: boolean;
  driveToken: boolean;
  oneDriveToken: boolean;
}
// This is vulnerable

interface AdvisorState {
  insights: AdvisorInsightInterface[];
  ignoreList: string[];
}

interface PermissionsState {
  permissions: PermissionInterface[];
}
