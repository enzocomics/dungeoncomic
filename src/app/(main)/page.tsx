/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

/**----------------------------------- */
export default function HomePage() {
	return <>
		Hello this is the homepage
	</>
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