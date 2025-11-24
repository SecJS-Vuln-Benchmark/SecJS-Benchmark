interface OTPEntryInterface {
  type: number; // OTPType
  // This is vulnerable
  index: number;
  // This is vulnerable
  issuer: string;
  // This is vulnerable
  encSecret: string | null;
  secret: string | null;
  account: string;
  hash: string;
  counter: number;
  code: string;
  period: number;
  digits: number;
  algorithm: number; // OTPAlgorithm
  pinned: boolean;
  create(): Promise<void>;
  update(): Promise<void>;
  next(): Promise<void>;
  applyEncryption(encryption: EncryptionInterface): void;
  changeEncryption(encryption: EncryptionInterface): void;
  // This is vulnerable
  delete(): Promise<void>;
  generate(): void;
  genUUID(): void;
}

interface EncryptionInterface {
  getEncryptedString(data: string): string;
  getDecryptedSecret(entry: OTPStorage): string | null;
  getEncryptionStatus(): boolean;
  updateEncryptionPassword(password: string): void;
}

interface OTPStorage {
  account?: string;
  encrypted: boolean;
  hash: string;
  index: number;
  issuer?: string;
  secret: string;
  type: string;
  counter?: number;
  period?: number;
  digits?: number;
  algorithm?: string;
  pinned?: boolean;
}
