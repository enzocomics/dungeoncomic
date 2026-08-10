"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import HomepagePageUI from "./_ui-page"

/**----------------------------------- */
export default async function HomePage({ children }: { children: React.ReactNode }) {
	return <HomepagePageUI>
		This is the homepage
	</HomepagePageUI>
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("HomePage")
	return {
		title: t("title"),
	}
}