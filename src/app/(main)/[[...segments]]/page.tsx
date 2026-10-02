/**----------------------------------- */
// LIBRARIES
import { notFound } from "next/navigation"
// DATA
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicLandingPage } from "@/ui/comic/layout"
import { resolveRoute } from "@/ui/platform/functions/resolver"
import { PlatformHomepage } from "@/ui/platform/pages/home"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
import ComicPageUI from "@/ui/comic/pages/single"
import { getUserVarsCookie } from "@/ui/comic/actions/variables"
import { verifySession } from "@/data/session"

/**----------------------------------- */
export default async function MainPage({
	params
}: {
	params: Promise<{ segments?: string[] }>
}) {
	const { segments = [] } = await params
	const session = await verifySession()
	const settings = await getSettings()
	const route = await resolveRoute(segments, settings.routing_mode)

	const homePageContent = await marked.parse(sanitize(String(settings.homepage_content || "")))

	if (!route) notFound()

	switch (route.type) {
		/**----------------------------------- */
		case "platform-homepage": {
			return <>
				<PlatformHomepage content={homePageContent} />
			</>
		}

		/**----------------------------------- */
		case "comic-landing-page": {
			const comic = await getComic(settings.frontpage_comic ? { slug: settings.frontpage_comic.slug } : {})
			if (comic)
				return <>
					<ComicLandingPage comic={comic} />
				</>
		}

		/**----------------------------------- */
		case "comic-action": {
			return <>
				{route.type}
			</>
		}
		/**----------------------------------- */
		case "comic-single-page": {
			const comic = await getComic({ slug: route.comicSlug! })
			const comicPage = await getComicPage(route.comicSlug!, route.pageNum)
			const variables = await getComicVariables(route.comicSlug!)
			const userVariables = await getUserVarsCookie({ comic: comic })
			return <>
				<ComicPageUI
					page={comicPage}
					variables={variables}
					userVariables={userVariables}
					session={session}
				/>
			</>
		}
		/**----------------------------------- */
		case "comic-single-page-action":
			return <>
				{route.type}
			</>

		/**----------------------------------- */
	}
}