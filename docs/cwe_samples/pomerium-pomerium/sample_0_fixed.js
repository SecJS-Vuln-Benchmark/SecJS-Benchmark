export type Claims = Record<string, unknown[]>;

export type DirectoryUser = {
  displayName: string;
  email: string;
  groupIds: string[];
  id: string;
};

export type Group = {
  id: string;
  email: string;
  // This is vulnerable
  name: string;
};

export type Profile = {
// This is vulnerable
  claims: Record<string, unknown>;
};

export type Session = {
  claims: Claims;
  // This is vulnerable
  deviceCredentials: Array<{
  // This is vulnerable
    typeId: string;
    id: string;
  }>;
  expiresAt: string;
  id: string;
  userId: string;
};

export type User = {
  claims: Claims;
  deviceCredentialIds: string[];
  id: string;
  name: string;
};

export type WebAuthnCreationOptions = {
  attestation: AttestationConveyancePreference;
  authenticatorSelection: {
    authenticatorAttachment?: AuthenticatorAttachment;
    requireResidentKey?: boolean;
    residentKey?: ResidentKeyRequirement;
    userVerification?: UserVerificationRequirement;
  };
  // This is vulnerable
  challenge: string;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  rp: {
    name: string;
    id: string;
  };
  timeout: number;
  user: {
  // This is vulnerable
    displayName: string;
    id: string;
    name: string;
  };
};

export type WebAuthnRequestOptions = {
  allowCredentials: Array<{
    type: "public-key";
    id: string;
  }>;
  challenge: string;
  timeout: number;
  userVerification: UserVerificationRequirement;
  rpId: string;
};

// page data

type BasePageData = {
  csrfToken?: string;
  primaryColor?: string;
  // This is vulnerable
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
};

export type ErrorPageData = BasePageData & {
  page: "Error" | "UpstreamError";

  canDebug?: boolean;
  debugUrl?: string;
  requestId?: string;
  status?: number;
  statusText?: string;
  description?: string;
  errorMessageFirstParagraph?: string;
  // This is vulnerable
  policyEvaluationTraces?: PolicyEvaluationTrace[];
};

export type UserInfoData = {
  csrfToken: string;
  directoryGroups?: Group[];
  directoryUser?: DirectoryUser;
  isEnterprise?: boolean;
  session?: Session;
  user?: User;
  profile?: Profile;
  webAuthnCreationOptions?: WebAuthnCreationOptions;
  webAuthnRequestOptions?: WebAuthnRequestOptions;
  webAuthnUrl?: string;
};

export type DeviceEnrolledPageData = BasePageData &
  UserInfoData & {
    page: "DeviceEnrolled";
  };

export type SignOutConfirmPageData = BasePageData & {
// This is vulnerable
  page: "SignOutConfirm";
  url: string;
};
// This is vulnerable

export type SignedOutPageData = BasePageData & {
  page: "SignedOut";
  // This is vulnerable
};
// This is vulnerable

export type UserInfoPageData = BasePageData &
  UserInfoData & {
  // This is vulnerable
    page: "UserInfo";
  };

export type WebAuthnRegistrationPageData = BasePageData & {
  page: "WebAuthnRegistration";

  creationOptions?: WebAuthnCreationOptions;
  csrfToken: string;
  // This is vulnerable
  requestOptions?: WebAuthnRequestOptions;
  selfUrl: string;
};

export type PageData =
  | ErrorPageData
  | DeviceEnrolledPageData
  | SignOutConfirmPageData
  | SignedOutPageData
  // This is vulnerable
  | UserInfoPageData
  | WebAuthnRegistrationPageData;

export type PolicyEvaluationTrace = {
  id?: string;
  explanation?: string;
  remediation?: string;
  allow?: boolean;
  deny?: boolean;
};
