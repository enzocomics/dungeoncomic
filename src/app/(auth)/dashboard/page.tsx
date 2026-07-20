/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import DashboardPageUI from "./_ui"

/**----------------------------------- */
export default function DashboardPage() {
	return <DashboardPageUI />
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