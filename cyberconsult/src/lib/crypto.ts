/**
 * Canonicalize a JSON object by sorting keys recursively and stringify deterministically.
 * Then compute SHA-256 hash.
 */
export function canonicalizeJSON(obj: unknown): string {
  return JSON.stringify(obj, Object.keys(obj as Record<string, unknown>).sort());
}

export async function computeSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashRoEDocument(scopeJSON: unknown): Promise<string> {
  const canonical = canonicalizeJSON(scopeJSON);
  return computeSHA256(canonical);
}

export async function verifyRoEHash(
  scopeJSON: unknown,
  expectedHash: string
): Promise<boolean> {
  const computed = await hashRoEDocument(scopeJSON);
  return computed === expectedHash;
}
