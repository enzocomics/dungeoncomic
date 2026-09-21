import { getSettings } from "@/lib/directus/get-settings"
import { ComicLayoutUI } from "../_ui/layout"
import { getComic } from "@/lib/directus/get-comics"
import { notFound } from "next/navigation"
import ComicContextProvider from "../_ui/context"
import { verifySession } from "@/data/session"
import React from "react"
import AuthModal from "../_ui/modal-auth"
import { adminClient } from "@/lib/directus/clients"
import { readSettings } from "@directus/sdk"
import SiteNav from "@/app/_ui/site-nav"
import { ComicPageHeader } from "../_ui/page/comic"
import { SiteLayoutMain } from "@/app/_ui/site-layout"

/**-----------------------------------
 * ROUTE LAYOUT
 * ---
 * - Conditionally renders comic layout UI or not, based on the layout mode
 * - When a comic frontpage is selected, the comic layout UI is loaded on the root instead of this file
 * ---
 * 
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
export default async function RouteLayout({
	children,
	header,
	params,
}: {
	children: React.ReactNode
	header: React.ReactNode
	params: Promise<{ route: string }>
}) {
	const { route } = await params
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic
	const singleComicSite = settings.single_comic_site
	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))
	// CHECK IF user is logged in
	const session = await verifySession()

	/**----------------------------------- */
	// LAYOUT MODE 1: SINGLE COMIC SITE
	// - No additional UI. We are displaying the comic layout in the root already
	if (singleComicSite)
		return <>
			{children}
		</>

	/**----------------------------------- */
	// LAYOUT MODE 2: MULTI-COMIC SITE
	// - Display comic layout UI
	if (!singleComicSite) {
		// FETCH COMIC BY ROUTE
		const comic = await getComic({ slug: route })
		const hasLandingPage = !!comic.landing_page

		// THROW 404 IF IT DOESN"T EXIST
		if (!comic) notFound()

		// RENDER
		return <>
			<ComicContextProvider
				getSession={session}
				getSettings={settings}
				getComic={comic}

			>
				<ComicLayoutUI settings={settings} comic={comic} session={session}
					header={
						<SiteNav
							comic={comic}
							session={session}
							menu={singleComicSite ? false : true}
						>
							<ComicPageHeader comic={comic} >
								{header}
							</ComicPageHeader>
						</SiteNav>
					}
				>
					<SiteLayoutMain>
						{children}
					</SiteLayoutMain>
				</ComicLayoutUI>
			</ComicContextProvider>
		</>
	}
}