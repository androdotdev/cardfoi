import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

type QStashClaims = {
  iss?: unknown;
  sub?: unknown;
  exp?: unknown;
  nbf?: unknown;
  body?: unknown;
};

function matchesSignature(token: string, key: string): boolean {
  const pieces = token.split(".");
  if (pieces.length !== 3) return false;
  const expected = createHmac("sha256", key).update(`${pieces[0]}.${pieces[1]}`).digest();
  let received: Buffer;
  try {
    received = Buffer.from(pieces[2], "base64url");
  } catch {
    return false;
  }
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function verifyQStashRequest(input: {
  signature: string | null;
  body: string;
  url: string;
}): boolean {
  const currentKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const nextKey = process.env.QSTASH_NEXT_SIGNING_KEY;
  if (!input.signature || !currentKey || !nextKey) return false;

  const pieces = input.signature.split(".");
  if (pieces.length !== 3 || (!matchesSignature(input.signature, currentKey) && !matchesSignature(input.signature, nextKey))) {
    return false;
  }

  let claims: QStashClaims;
  try {
    claims = JSON.parse(Buffer.from(pieces[1], "base64url").toString("utf8")) as QStashClaims;
  } catch {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const bodyHash = createHash("sha256")
    .update(input.body)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return claims.iss === "Upstash" &&
    claims.sub === input.url &&
    typeof claims.exp === "number" && claims.exp >= now &&
    typeof claims.nbf === "number" && claims.nbf <= now &&
    typeof claims.body === "string" && claims.body === bodyHash;
}
