"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// LIBRARIES
import { redirect, RedirectType } from "next/navigation"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
// UI
import { comicMetadata } from "./_ui/metadata"
import { HomepagePageUI } from "./_ui/page-home"
import ComicLandingPageUI from "./_ui/page-comic-landing"
import { Suspense } from "react"
import { verifySession } from "@/data/session"
import { getUserVarsCookie } from "./_actions/variables"

/**-----------------------------------
 * HOMEPAGE PAGE
 * ---
 * - Conditionally render Homepage Page UI or Comic Landing Page UI, based on the layout mode
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
export default async function Homepage() {
	// CHECK IF `singleComicSite` HAS BEEN SET
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic
	const singleComicSite = settings.single_comic_site
	//GET THE SESSION
	const session = await verifySession()

	/**----------------------------------- */
	// LAYOUT MODE 1: SINGLE COMIC SITE
	// - Display the comic page at the root
	if (singleComicSite) {
		// FETCH COMIC DATA
		const comic = await getComic({ slug: frontpageComic?.slug })
		const userVariables = await getUserVarsCookie({ comic: comic })
		// Get the comic page & variables
		const variables = await getComicVariables(frontpageComic?.slug)
		// CHECK `landing_page` SETTING
		const landing_page = comic.landing_page
		const page_count = comic.pages_count
		switch (landing_page) {
			// SHOW LANDING PAGE UI
			case "cover-page":
				return <Suspense>
					<ComicLandingPageUI
						comic={comic}
						session={session}
						variables={variables}
						userVariables={userVariables}
					/>
				</Suspense>
			// REDIRECT TO FIRST PAGE
			case "first-page":
				redirect(`1`, RedirectType.replace)
			// REDIRECT TO LAST PAGE
			case "last-page":
				redirect(`${page_count}`, RedirectType.replace)
			// REDIRECT TO A SPECIFIC PAGE
			default:
				redirect(`${landing_page}`, RedirectType.replace)
		}
	}
	// LAYOUT MODE 2: MULTI-COMIC SITE
	// - If a frontpage comic is selected, redirect to it
	// - If a frontpage comic is not selected, display homepage
	else {
		if (frontpageComic) {
			redirect(`/${frontpageComic.slug}`)
		} else {
			return <Suspense>
				<HomepagePageUI session={session} />
			</Suspense>
		}
	}

}

/**-----------------------------------
 * Generate Metadata
 * ---
 **/
export async function generateMetadata(): Promise<Metadata | undefined> {
	// FETCH SETTINGS
	const settings = await getSettings()
	const singleComicSite = settings.single_comic_site
	const comic = await getComic({ slug: settings.frontpage_comic?.slug })
	/**----------------------------------- */
	// LAYOUT MODE 1: SINGLE COMIC SITE
	// - Load the comic metadata
	if (singleComicSite)
		return comic ? await comicMetadata(comic.slug) : {}
	/**----------------------------------- */
	// LAYOUT MODE 2: HOMEPAGE
	// - Don't return anything. All the metadata is already defined in the root layout
	else if (!singleComicSite)
		return {}
}