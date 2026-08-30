"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// LIBRARIES
import { notFound, redirect, RedirectType } from "next/navigation"
// DATA
import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
// UI
import ComicPageUI, { ComicLandingPageUI } from "../_ui/comic-page"
import { comicMetadata, comicPageMetadata, notFoundMetadata } from "../_ui/metadata"
import { getUserVarsCookie } from "../_actions/actions"

/**-----------------------------------
 * COMIC ROUTE **OR** SUBPAGE
 * ---
 * - Conditionally renders comic landing page UI or comic single page UI based on the layout
 * - Conditionally generates comic landing page metadata or comic single page metadata based on the layout
 * 
 * ---
 * **Layout Mode 1 (Default)**
 * - Only available when there is only one comic
 * - Display comic at the root 
 * - Subpages would be accessible at i.e. `dungeoncomic.com/1`
 * 
 * **Layout Mode 2**
 * - All comics live in their subfolder `dungeoncomic.com/comicslug`
 * - Subpages would be accessible at i.e. `dungeoncomic.com/comicslug/1`
 * 
 */
export default async function RoutePage({
	params
}: {
	params: Promise<{ route: string }>
}) {
	// GET THE ROUTE PARAMS
	const { route } = await params
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic

	/**----------------------------------- */
	// IF `frontpage_comic` EXISTS BUT THE ROUTE IS A STRING/NOT A NUMBER
	// - Throw a 404
	if (frontpage_comic && isNaN(parseInt(route))) {
		notFound()
	}

	/**----------------------------------- */
	// IF `frontpage_COMIC` EXISTS AND THE ROUTE IS A NUMBER
	// - It's detecting a page number. Display the comic single page UI
	else if (frontpage_comic && !isNaN(parseInt(route))) {
		// Get the page details
		const page = await getComicPage(frontpage_comic.slug, parseInt(route))
		// 404 if it does not exist
		if (!page) notFound()

		// Get the user session
		const session = await verifySession()
		// Get the User Variable Cookie
		const comic = await getComic(frontpage_comic.slug)
		const userVariables = await getUserVarsCookie({ comic: comic })
		// Get the comic page & variables
		const variables = await getComicVariables(frontpage_comic.slug)
		const comicPage = await getComicPage(frontpage_comic.slug, parseInt(route))

		if (!comicPage || comicPage && comicPage.status !== "published")
			notFound()
		else
			return <ComicPageUI
				page={comicPage}
				variables={variables}
				userVariables={userVariables}
				session={session}
			/>
	}

	/**----------------------------------- */
	// IF `frontpage_comic` DOESN'T EXIST
	// - Display the comic landing page UI
	else if (!frontpage_comic) {
		// Fetch the comic by route param
		const comic = await getComic(route)
		// Throw 404 if it doesn't exist
		if (!comic) notFound()
		// Otherwise, render it
		// CHECK `landing_page` SETTING
		const landing_page = comic.landing_page
		const page_count = comic.pages_count
		switch (landing_page) {
			// SHOW LANDING PAGE UI
			case "cover-page":
				return <ComicLandingPageUI comic={comic} />
			// REDIRECT TO FIRST PAGE
			case "first-page":
				redirect(`${route}/1`, RedirectType.replace)
			// REDIRECT TO LAST PAGE
			case "last-page":
				redirect(`${route}/${page_count}`, RedirectType.replace)
			// REDIRECT TO A SPECIFIC PAGE
			default:
				redirect(`${route}/${landing_page}`, RedirectType.replace)
		}
	}
}

/**-----------------------------------
 * Generate Metadata
 * ---
 **/
export async function generateMetadata({
	params
}: {
	params: Promise<{ route: string }>
}): Promise<Metadata | undefined> {
	// GET THE ROUTE PARAMS
	const { route } = await params
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic

	const comic = await getComic(frontpage_comic?.slug || route)
	const frontpageComicPage = frontpage_comic && !isNaN(parseInt(route))
		? await getComicPage(frontpage_comic.slug, parseInt(route))
		: null

	/**----------------------------------- */
	// IF `frontpage_comic` + comic + comic page all exist: return comic page metadata
	if (frontpage_comic && comic && frontpageComicPage) {
		return await comicPageMetadata(frontpage_comic.slug, parseInt(route))
	}

	/**----------------------------------- */
	// IF `frontpage_comic` DOESN'T EXIST, but the page does: return comic landing metadata
	else if (!frontpage_comic && comic) {
		return await comicMetadata(route)
	}

	/**----------------------------------- */
	// ELSE - 404
	return await notFoundMetadata()

}