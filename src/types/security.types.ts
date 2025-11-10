// src/types/security.types.ts
export interface IPRange {
  id: string;
  range: string;
}

export interface SSOConfig {
  clientId: string;
  secret: string;
  metadataUrl: string;
}

export interface SecuritySettings {
  mfaEnabled: boolean;
  ipAllowlist: IPRange[];
  sso: SSOConfig;
}

export const SECURITY_SECTIONS = {
  MFA: "mfa",
  IP_ALLOWLIST: "ipAllowlist",
  SSO: "sso",
} as const;

export type SecuritySectionKey =
  (typeof SECURITY_SECTIONS)[keyof typeof SECURITY_SECTIONS];
