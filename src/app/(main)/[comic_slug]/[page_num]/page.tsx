"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import ComicPageUI from "./_ui"
import { getComicPage } from "@/lib/directus/get-comics"
import { notFound } from "next/navigation"

/**----------------------------------- */
export default async function ComicPage({
	params
}: {
	params: Promise<{ comic_slug: string, page_num: number }>
}) {
	const { comic_slug, page_num } = await params
	// Get the page details
	const page = await getComicPage(comic_slug, page_num)

	// 404 if it does not exist
	if (!page) notFound()
	else
		return <>
			<ComicPageUI params={await params} page={page} />
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