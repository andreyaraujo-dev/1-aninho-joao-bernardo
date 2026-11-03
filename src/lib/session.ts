import { cookies } from "next/headers"
import {
  accessTokenCookie,
  accessTokenMaxAge,
  signAccessToken,
  verifyAccessToken,
} from "@/lib/access-token"

export { accessTokenCookie, verifyAccessToken }

export async function createSession(userId: string) {
  const token = await signAccessToken(userId)
  const store = await cookies()
  store.set(accessTokenCookie, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: accessTokenMaxAge,
    path: "/",
  })
}

export async function getSessionUserId() {
  const token = (await cookies()).get(accessTokenCookie)?.value
  if (!token) return null

  return verifyAccessToken(token)
}

export async function clearSession() {
  const store = await cookies()
  store.delete(accessTokenCookie)
  store.delete("convite_session")
}
