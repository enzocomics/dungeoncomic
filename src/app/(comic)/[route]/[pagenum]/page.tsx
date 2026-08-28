"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// LIBRARIES
import { notFound } from "next/navigation"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
// UI
import { comicPageMetadata, notFoundMetadata } from "../../_metadata"
import ComicPageUI from "../../_ui-page"
import { getUserVarsCookie } from "../../_action"

/**-----------------------------------
 * COMIC SINGLE SUBPAGE
 * ---
 * - Checks if the dynamic route params are valid based on the layout mode selected
 * - Renders UI or throws a 404 based on the layout mode selected
 * - Generates comic single page metadata or based on the layout mode selected
 * 
 * ---
 * **Layout Mode 1 (Default)**
 * - Only available when there is only one comic
 * - Display comic at the root 
 * - Subpages would be accessible at i.e. `dungeoncomic.com/1`
 * - THIS ROUTE IS 404
 * 
 * **Layout Mode 2**
 * - All comics live in their subfolder `dungeoncomic.com/comicslug`
 * - Subpages would be accessible at i.e. `dungeoncomic.com/comicslug/1`
 * 
 */
export default async function ComicPagenumPage({
	params
}: {
	params: Promise<{ route: string, pagenum: number }>
}) {
	// GET THE ROUTE PARAMS
	const { route, pagenum } = await params
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic

	/**----------------------------------- */
	// LAYOUT MODE 1: IF `frontpage_comic` EXISTS
	// - Throw 404
	if (frontpage_comic) notFound()

	/**----------------------------------- */
	// LAYOUT MODE 2
	// Throw 404 if the pagenum param is not a number
	if (isNaN(pagenum)) notFound()

	// Get the User Variable Cookie
	const comic = await getComic(route)
	const userVarsCookie = await getUserVarsCookie(comic)
	// Get the comic page IF it is published
	const variables = await getComicVariables(route)
	const comicPage = await getComicPage(route, pagenum)
	if (!comicPage || comicPage && comicPage.status !== "published")
		notFound()
	else
		return <ComicPageUI
			page={comicPage}
			variables={variables}
			userVarsCookie={userVarsCookie}
		/>
}

/**-----------------------------------
 * Generate Metadata
 * ---
 **/

export async function generateMetadata({
	params
}: {
	params: Promise<{ route: string, pagenum: number }>
}): Promise<Metadata | undefined> {
	// GET THE ROUTE PARAMS
	const { route, pagenum } = await params
	// CHECK IF PAGENUM IS A NUMBER
	let comicPage

	/**----------------------------------- */
	// RETURN PAGE METADATA IF IT EXISTS
	if (!isNaN(pagenum)) {
		comicPage = await getComicPage(route, pagenum)
		if (comicPage) return await comicPageMetadata(route, pagenum)
	}

	/**----------------------------------- */
	// THROW 404 
	return await notFoundMetadata()

}