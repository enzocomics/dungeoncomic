/**----------------------------------- */
// LIBRARIES
import { notFound } from "next/navigation"
import { marked } from "marked"
// DATA
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// FUNCTIONS
import { resolveRoute } from "@/ui/platform/functions/resolver"
import { sanitize } from "@/lib/sanitize"
import { getUserVarsCookie } from "@/ui/comic/actions/variables"
// UI
import ComicPageUI from "@/ui/comic/pages/single"
import { ComicLandingPage } from "@/ui/comic/layout"
import { PlatformHomepage } from "@/ui/platform/pages/home"

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
			console.log(route.comicSlug)
			const comic = await getComic({ slug: route.comicSlug })
			if (comic) return <>
				<ComicLandingPage comic={comic} />
			</>
			else notFound()
		}
		/**----------------------------------- */
		case "comic-named-page": {
			return <>
				{/* TODO: */}
				{route.type}: {route.pageSlug}
			</>
		}

		/**----------------------------------- */
		case "comic-single-page": {
			const comic = await getComic({ slug: route.comicSlug! })
			const comicPage = await getComicPage(route.comicSlug!, route.pageNum)
			const variables = await getComicVariables(route.comicSlug!)
			const userVariables = await getUserVarsCookie({ comic: comic })
			if (comicPage) return <>
				<ComicPageUI
					page={comicPage}
					variables={variables}
					userVariables={userVariables}
					session={session}
				/>
			</>
			else notFound()
		}
		/**----------------------------------- */
		case "comic-single-page-action":
			return <>
				{/* TODO: */}
				{route.type}
			</>

		/**----------------------------------- */
	}
}