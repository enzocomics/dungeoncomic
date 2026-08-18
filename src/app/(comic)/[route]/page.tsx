"use server"
/**----------------------------------- */
// LIBRARIES
import { notFound } from "next/navigation"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
import { getComicPage } from "@/lib/directus/get-comics"
// UI
import ComicPageUI, { ComicLandingPageUI } from "../_page-ui"

/**----------------------------------- */
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
		// RETURN THE COMIC ROUTE WITH PAGE NUMBER
		return <ComicPageUI params={{ comic_slug: frontpage_comic.slug, page_num: parseInt(route) }} />
	}

	/**----------------------------------- */
	// IF `frontpage_comic` DOESN'T EXIST
	// - Display the comic landing page UI
	else if (!frontpage_comic) {
		return <ComicLandingPageUI />
	}

}