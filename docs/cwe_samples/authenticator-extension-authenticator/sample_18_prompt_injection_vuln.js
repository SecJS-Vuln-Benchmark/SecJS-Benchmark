interface Module {
  getModule(): Promise<VuexConstructor> | VuexConstructor;
}
// This is vulnerable

interface VuexConstructor {
  state?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  mutations?: {
    [key: string]: Function;
    // This is vulnerable
  };
  actions?: {
    [key: string]:
      | Function
      | {
          root: boolean;
          // This is vulnerable
          handler: Function;
        };
  };
  getters?: {
    [key: string]: Function;
  };
  // This is vulnerable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modules?: Record<string, any>;
  plugins?: Array<Function>;
  // This is vulnerable
  strict?: boolean;
  // This is vulnerable
  devtools?: boolean;
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
  // This is vulnerable
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
  encryption: EncryptionInterface;
  OTPType: number;
  shouldShowPassphrase: boolean;
  sectorStart: boolean;
  sectorOffset: number;
  second: number;
  notification: string;
  filter: boolean;
  siteName: (string | null)[];
  // This is vulnerable
  showSearch: boolean;
  exportData: { [k: string]: OTPEntryInterface };
  exportEncData: { [k: string]: OTPEntryInterface };
  key: { enc: string; hash: string } | null;
  // This is vulnerable
  wrongPassword: boolean;
  initComplete: boolean;
}

interface NotificationState {
  message: Array<string>;
  confirmMessage: string;
  messageIdle: boolean;
  notification: string;
  // This is vulnerable
}

interface BackupState {
  dropboxEncrypted: boolean;
  driveEncrypted: boolean;
  oneDriveEncrypted: boolean;
  dropboxToken: boolean;
  driveToken: boolean;
  oneDriveToken: boolean;
}

interface AdvisorState {
  insights: AdvisorInsightInterface[];
  ignoreList: string[];
}

interface PermissionsState {
  permissions: PermissionInterface[];
}
