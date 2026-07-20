import "server-only"
/**----------------------------------- */
// LIBRARIES
import { SignJWT, jwtVerify } from "jose"
import { sessionSecret } from "@/data/env"

// ENCODE THE SESSION SECRET KEY
const encodedKey = new TextEncoder().encode(sessionSecret)

// PAYLOAD TYPE
export type SessionPayload = {
	access_token: string
	refresh_token: string | null
	expiresAt: number | null
}

// Signs a JWT with the session payload
export async function encrypt(payload: SessionPayload): Promise<string> {
	return new SignJWT({ ...payload })
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("7d")
		.sign(encodedKey)
}

// Verifies a JWT and returns its payload, or null if invalid/expired
export async function decrypt(token: string): Promise<SessionPayload | null> {
	try {
		const { payload } = await jwtVerify(token, encodedKey, {
			algorithms: ["HS256"],
		})
		return payload as unknown as SessionPayload
	} catch {
		return null
	}
}
