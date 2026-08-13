"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// I18N
import { getTranslations } from "next-intl/server"
// DATA
// UI
import ComicLandingPageUI from "./_page-ui"
import { getComic } from "@/lib/directus/get-comics"

/** ------------------------------------------------ **
 *  COMIC ROUTE PAGE
 */
export default async function ComicLandingPage() {
	// Get the comic slug parameter
	return <ComicLandingPageUI />
}

/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata({
	params
}: {
	params: Promise<{ comic_slug: string }>
}): Promise<Metadata> {
	// Get the comic slug parameter
	const { comic_slug } = await params
	// Get the comic collection from the CMS
	const comic = await getComic(comic_slug)
	return {
		title: comic.title,
		description: comic.description
	}
}