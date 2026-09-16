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
import ComicPageUI from "../_ui/page-comic"
import ComicLandingPageUI from "../_ui/page-comic-landing"
import { comicMetadata, comicPageMetadata, notFoundMetadata } from "../_ui/metadata"
import { getUserVarsCookie } from "../_actions/variables"
import { CommentsSection } from "../_ui/page-comic-comments"
import { getComments } from "@/lib/directus/get-comments"
import { adminClient } from "@/lib/directus/clients"
import { readItems } from "@directus/sdk"

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
	const singleComicSite = settings.single_comic_site
	// Get the user session
	const session = await verifySession()

	/**----------------------------------- */
	// IF `singleComicSite` has been set BUT THE ROUTE IS A STRING/NOT A NUMBER
	// - Throw a 404
	if (singleComicSite && isNaN(parseInt(route))) {
		notFound()
	}

	/**----------------------------------- */
	// LAYOUT MODE 1: SINGLE COMIC SITE
	// IF `singleComicSite` has been set AND THE ROUTE IS A NUMBER
	// - It's detecting a page number. Display the comic single page UI
	else if (singleComicSite && !isNaN(parseInt(route))) {
		// Get the comic that has been defined as the frontpageComic
		// If a frontpageComic has not been selected, it will default to the first comic it finds
		const comic = await getComic({ slug: frontpage_comic?.slug })

		// if the comic exists
		if (comic) {
			// Get the page details
			const page = await getComicPage(comic.slug, parseInt(route))
			// 404 if it does not exist
			if (!page) notFound()

			// Get the User Variable Cookie
			const userVariables = await getUserVarsCookie({ comic: comic })
			// Get the comic page & variables
			const variables = await getComicVariables(comic.slug)
			const comicPage = await getComicPage(comic.slug, parseInt(route))

			if (!comicPage || comicPage && comicPage.status !== "published") {
				notFound()
			} else {

				// Get the comments
				const comments = await getComments(comicPage.id as number)
				return <>
					<ComicPageUI
						page={comicPage}
						variables={variables}
						userVariables={userVariables}
						session={session}
					/>

					<CommentsSection
						page={comicPage}
						comments={comments}
						session={session}
						variables={variables}
						userVariables={userVariables}
					/>

				</>
			}
		} else {
			// if `singleComicSite` has been selected but no comics exist (probably deleted?)
			notFound()
		}
	}

	/**----------------------------------- */
	// LAYOUT MODE 2: MULTI-COMIC SITE
	// - Display the comic landing page UI
	else if (!singleComicSite) {
		// Fetch the comic by route param
		const comic = await getComic({ slug: route })
		// Throw 404 if it doesn't exist
		if (!comic) notFound()
		const userVariables = await getUserVarsCookie({ comic: comic })
		// Get the comic page & variables
		const variables = await getComicVariables(route)
		// Otherwise, render it
		// CHECK `landing_page` SETTING
		const landing_page = comic.landing_page
		const page_count = comic.pages_count
		switch (landing_page) {
			// SHOW LANDING PAGE UI
			case "cover-page":
				return <ComicLandingPageUI
					comic={comic}
					session={session}
					variables={variables}
					userVariables={userVariables}
				/>
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
	const singleComicSite = settings.single_comic_site

	const comic = await getComic({ slug: frontpage_comic?.slug })

	const frontpageComicPage = frontpage_comic && !isNaN(parseInt(route))
		? await getComicPage(frontpage_comic.slug, parseInt(route))
		: null

	/**----------------------------------- */
	// LAYOUT MODE 1: SINGLE COMIC SITE
	// IF `frontpage_comic` + comic + comic page all exist: return comic page metadata

	// if (frontpage_comic && comic && frontpageComicPage) {
	// 	return await comicPageMetadata(frontpage_comic.slug, parseInt(route))
	// }

	if (singleComicSite && comic) {
		return await comicPageMetadata(comic.slug, parseInt(route))
	}
	/**----------------------------------- */
	// LAYOUT MODE 2: MULTI-COMIC SITE
	// IF `singleComicSite` is not selected return comic landing metadata
	else if (!singleComicSite) {
		return await comicMetadata(route)
	}

	/**----------------------------------- */
	// ELSE - 404
	return await notFoundMetadata()

}

/**-----------------------------------
 * Generate Static Params
 * ---
 **/

/*
export async function generateStaticParams() {
	const settings = await getSettings()

	// Generate params for the individual comic pages ONLY if there IS frontpage comic
	if (settings.frontpage_comic) {
		const comicPages = await adminClient.request(
			readItems("pages", {
				limit: -1,
				filter: {
					comic: {
						slug: {
							_eq: settings.frontpage_comic.slug
						}
					}
				},

			})
		)

		return comicPages.map((page) => ({
			route: page.comic_pagenum.toString()
		}))
	}
	// If there is NO frontpage comic, generate the comic series
	else if (!settings.frontpage_comic) {
		const comics = await adminClient.request(
			readItems("comics", {
				limit: -1,
				fields: ["slug"]
			})
		)
		return comics.map((comic) => ({
			route: comic.slug
		}))
	}
	return []
}*/