import { getSettings } from "@/lib/directus/get-settings";
import ComicPageUI from "../../_page-ui";
import { notFound } from "next/navigation";
import { getComicPage } from "@/lib/directus/get-comics";

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
	// Get the comic page
	const comicPage = await getComicPage(route, pagenum)
	// 404 if it doesn't exist
	if (!comicPage) notFound()
	// Render
	return <ComicPageUI params={{ comic_slug: route, page_num: pagenum }} />
}