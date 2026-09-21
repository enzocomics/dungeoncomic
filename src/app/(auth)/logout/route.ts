/**----------------------------------- */
import { NextRequest, NextResponse } from "next/server"
import { logout } from "./_action"
/** ------------------------------------------------ **
 * LOGOUT ROUTE
 */

// Check if the value is a safe internal redirect path
function getSafeRedirectPath(value: string | null) {
	if (
		// If it doesn't exist
		!value ||
		// or it's from an external host
		!value.startsWith("/") ||
		value.startsWith("//")
	) {
		// Then redirect to our site
		return "/"
	}
	// Otherwise, return the value
	return value
}

export async function GET(request: NextRequest) {
	const referralPath = getSafeRedirectPath(
		request.nextUrl.searchParams.get("r"),
	)

	await logout()

	// console.log("referralPath", referralPath)
	// Create the redirect URL from the referral path
	const redirectUrl = new URL(referralPath, request.url)
	// Add the "logged-out status param
	redirectUrl.searchParams.set("status", "logged-out")

	// Return
	return NextResponse.redirect(redirectUrl)
}
