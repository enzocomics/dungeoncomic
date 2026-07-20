"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
// COMPONENTS
import { verifySession } from "@/data/session"
import LoginPageUI from "./_ui"

/**-----------------------------------
 * LOGIN PAGE ROUTE
 */
export default async function LoginPage() {
	const user = await verifySession()
	// Show the login UI if the user is not logged in
	if (!user) return <LoginPageUI />
	// Otherwise, redirect them to the dahsboard
	else redirect("/dashboard")
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("auth")
	return {
		title: t("pages.login.title"),
	}
}