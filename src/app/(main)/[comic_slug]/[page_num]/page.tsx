"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import ComicPageUI from "./_ui"

/**----------------------------------- */
export default async function ComicPage({
	params
}: {
	params: Promise<{ comic_slug: string, page_num: number }>
}) {
	return <>
		<ComicPageUI params={await params} />
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