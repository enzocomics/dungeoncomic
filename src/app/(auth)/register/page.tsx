"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
// COMPONENTS
import { verifySession } from "@/data/session"
import RegisterPageUI from "./_ui"

/**-----------------------------------
 * REGISTER PAGE ROUTE
 */
export default async function RegisterPage() {
	const user = await verifySession()
	// Show the create account UI if the user is not logged in
	if (!user) return <RegisterPageUI />
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
		title: t("pages.register.title"),
	}
}