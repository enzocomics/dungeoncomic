/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"

/**----------------------------------- */
export default function HomePage() {
	const t = useTranslations("HomePage")
	return <h1 className="text-3xl">{t("title")}</h1>
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