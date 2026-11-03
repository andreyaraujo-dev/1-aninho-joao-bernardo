import { SignJWT, jwtVerify } from "jose"

export const accessTokenCookie = "access_token"
const issuer = "1-aninho-joao-bernardo"
const audience = "admin-area"
const sessionDuration = 60 * 60 * 8
const configuredSecret = process.env.SESSION_SECRET

if (
  process.env.NODE_ENV === "production" &&
  (!configuredSecret || configuredSecret.length < 32)
) {
  throw new Error("SESSION_SECRET must contain at least 32 characters in production.")
}

const secret = new TextEncoder().encode(
  configuredSecret ?? "development-only-session-secret-change-me",
)

export async function signAccessToken(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(userId)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${sessionDuration}s`)
    .sign(secret)
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer,
      audience,
      requiredClaims: ["sub", "iat", "exp"],
    })
    return payload.sub ?? null
  } catch {
    return null
  }
}

export const accessTokenMaxAge = sessionDuration
