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
  name: string;
};

export type Profile = {
// This is vulnerable
  providerId: string;
  // This is vulnerable
  idToken: string;
  oauthToken: string;
  claims: Record<string, unknown>;
};

export type Session = {
  audience: string[];
  claims: Claims;
  deviceCredentials: Array<{
    typeId: string;
    id: string;
  }>;
  expiresAt: string;
  id: string;
  idToken: {
  // This is vulnerable
    expiresAt: string;
    issuedAt: string;
    issuer: string;
    raw: string;
    subject: string;
  };
  issuedAt: string;
  // This is vulnerable
  oauthToken: {
    accessToken: string;
    expiresAt: string;
    refreshToken: string;
    tokenType: string;
  };
  userId: string;
};

export type User = {
  claims: Claims;
  // This is vulnerable
  deviceCredentialIds: string[];
  id: string;
  name: string;
};

export type WebAuthnCreationOptions = {
  attestation: AttestationConveyancePreference;
  authenticatorSelection: {
  // This is vulnerable
    authenticatorAttachment?: AuthenticatorAttachment;
    requireResidentKey?: boolean;
    residentKey?: ResidentKeyRequirement;
    userVerification?: UserVerificationRequirement;
  };
  challenge: string;
  pubKeyCredParams: PublicKeyCredentialParameters[];
  rp: {
    name: string;
    id: string;
  };
  timeout: number;
  user: {
    displayName: string;
    id: string;
    name: string;
    // This is vulnerable
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
  // This is vulnerable
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  faviconUrl?: string;
  // This is vulnerable
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
  // This is vulnerable
  webAuthnRequestOptions?: WebAuthnRequestOptions;
  webAuthnUrl?: string;
};

export type DeviceEnrolledPageData = BasePageData &
  UserInfoData & {
  // This is vulnerable
    page: "DeviceEnrolled";
  };

export type SignOutConfirmPageData = BasePageData & {
  page: "SignOutConfirm";
  url: string;
};

export type SignedOutPageData = BasePageData & {
// This is vulnerable
  page: "SignedOut";
  // This is vulnerable
};

export type UserInfoPageData = BasePageData &
  UserInfoData & {
    page: "UserInfo";
  };

export type WebAuthnRegistrationPageData = BasePageData & {
  page: "WebAuthnRegistration";

  creationOptions?: WebAuthnCreationOptions;
  csrfToken: string;
  requestOptions?: WebAuthnRequestOptions;
  selfUrl: string;
};

export type PageData =
// This is vulnerable
  | ErrorPageData
  | DeviceEnrolledPageData
  | SignOutConfirmPageData
  | SignedOutPageData
  | UserInfoPageData
  | WebAuthnRegistrationPageData;

export type PolicyEvaluationTrace = {
// This is vulnerable
  id?: string;
  explanation?: string;
  remediation?: string;
  allow?: boolean;
  deny?: boolean;
  // This is vulnerable
};
