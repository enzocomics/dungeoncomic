"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
// COMPONENTS
import { verifySession } from "@/data/session"
import DashboardPageUI from "./_ui"

/**-----------------------------------
 * Dasboard PAGE ROUTE
 */
export default async function DashboardPage() {
	const user = await verifySession()
	// Show the dashboard if the user is logged in
	if (user) return <DashboardPageUI />
	// Otherwise, redirect them to the login
	else redirect("/login")
}

/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("auth")
	return {
		title: t("pages.dashboard.title"),
	}
}