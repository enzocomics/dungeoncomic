"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { notFound } from "next/navigation"
// DATA
import { getComic, getComicPage } from "@/lib/directus/get-comics"
// UI
import ComicPageUI from "./_ui"

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
export async function generateMetadata({
	params
}: {
	params: Promise<{ comic_slug: string, page_num: number }>
}): Promise<Metadata> {
	// Get the comic slug parameter
	const { comic_slug, page_num } = await params
	// Get the comic data from the CMS
	const comic = await getComic(comic_slug)
	const comicPage = await getComicPage(comic_slug, page_num)
	// Generate Metadata
	if (comic && comicPage)
		return {
			title: comicPage.title || `Page ${page_num}`,
			description: comicPage.description || `Page ${page_num} of the adventure series "${comic.title}"`
		}
	else
		return {}
}