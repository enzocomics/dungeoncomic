"use server"
/**----------------------------------- */
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicLayoutUI, PlatformLayoutUI } from "./_ui/layout"
import { getComic } from "@/lib/directus/get-comics"
import ComicContextProvider from "./_ui/context"
import { verifySession } from "@/data/session"
import React from "react"
import AuthModal from "./_ui/modal-auth"
import { adminClient } from "@/lib/directus/clients"
import { readSettings } from "@directus/sdk"
import SiteFooter from "../_ui/site-footer"

/**-----------------------------------
 * HOMEPAGE LAYOUT
 * ---
 * - Conditionally render the comic layout UI or not, based on the layout mode
 * 
 * ---
 * ** MODE 1: SINGLE COMIC SITE: (Default)**
 * - Displays the selected `frontpage_comic` at the root
 * - (if none is selected, default to the first one)
 * - Subpages would be accessible at i.e. `dungeoncomic.com/1`
 * - 
 * 
 * ** MODE 2: MULTI-COMIC SITE **
 * - All comics live in their subfolder `dungeoncomic.com/comicslug`
 * - Subpages would be accessible at i.e. `dungeoncomic.com/comicslug/1`
 * 
 */

export default async function HomepageLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// FETCH REQUIRED DATA
	const session = await verifySession()
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic
	const singleComicSite = settings.single_comic_site
	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))

	/**----------------------------------- */
	// LAYOUT MODE 1: SINGLE COMIC SITE
	// - Display the comic layout UI at the root
	if (singleComicSite) {
		const comic = await getComic({ slug: frontpageComic?.slug })
		// If a comic has been selected as the frontpageComic, display it.
		// If a frontpageComic has not been selected, it will default to the first comic it finds
		if (comic)
			return <>
				<ComicContextProvider
					getSession={session}
					getSettings={settings}
					getComic={comic}
				>
					<AuthModal public_registration={public_registration} />
					<ComicLayoutUI
						settings={settings}
						comic={comic}
						session={session}>
						{children}
						<SiteFooter />
					</ComicLayoutUI>
				</ComicContextProvider>
			</>
		else
			// if `singleComicSite` has been selected but no comics exist (probably deleted?) just show the regular layout
			return <>
				<AuthModal public_registration={public_registration} />
				<PlatformLayoutUI>
					{children}
				</PlatformLayoutUI>
				<SiteFooter />
			</>

	}

	/**----------------------------------- */
	// LAYOUT MODE 2: MULTI-COMIC SITE
	// - Return the frontpage layout UI at the root
	else if (!singleComicSite)
		return <>
			<AuthModal public_registration={public_registration} />
			{children}
			<SiteFooter />
		</>

}