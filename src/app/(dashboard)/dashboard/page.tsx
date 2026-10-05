/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
// COMPONENTS
import { verifySession } from "@/data/session"
import DashboardHomePageUI from "@/ui/dashboard/pages/home"

/**-----------------------------------
 * Dasboard PAGE ROUTE
 */
export default async function DashboardPage() {
	return <DashboardHomePageUI />
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