/**----------------------------------- */
import { redirect } from "next/navigation"
import { verifySession } from "@/data/session"

/**
 * Redirect the user to `/dashboard` if they are logged in.
 * - Wraps the Auth Layout
 */

export default async function RedirectIfAuthenticated({
	children
}: {
	children: React.ReactNode
}) {
	const user = await verifySession()
	if (user) redirect("/dashboard")
	return children
}