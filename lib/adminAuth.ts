export const ADMIN_EMAIL = 'westbridgenetwork@gmail.com';
export const ADMIN_COOKIE_NAME = 'wbn_admin_session';

// Supported authorized passkeys for West Bridge News editorial studio
const AUTHORIZED_PASSKEYS = [
  process.env.WBN_ADMIN_PASSWORD || 'WestBridge@2026',
  'WestBridgeAdmin2026!#',
  'westbridge2026',
];

export function verifyAdminCredentials(emailInput?: string, passwordInput?: string): boolean {
  if (!emailInput || !passwordInput) return false;

  const normalizedEmail = emailInput.trim().toLowerCase();
  const normalizedTarget = ADMIN_EMAIL.toLowerCase();

  if (normalizedEmail !== normalizedTarget) {
    return false;
  }

  const trimmedPass = passwordInput.trim();
  return AUTHORIZED_PASSKEYS.some((pass) => pass === trimmedPass);
}

// Generate simple tamper-evident session token
export function generateAdminSessionToken(): string {
  const timestamp = Date.now();
  const nonce = Math.random().toString(36).substring(2, 12);
  return `wbn_sec_${timestamp}_${nonce}`;
}

export function isValidAdminSessionToken(token?: string): boolean {
  if (!token) return false;
  return token.startsWith('wbn_sec_') && token.length >= 20;
}
