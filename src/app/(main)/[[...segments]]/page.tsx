/**----------------------------------- */
// LIBRARIES
import { notFound, redirect } from "next/navigation"
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
import ComicsListPage from "@/ui/platform/pages/comics-list"
import { PlatformMainArticle } from "@/ui/platform/components/main"

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
		case "platform-category-page": {
			// TODO:
			// - Only display content if the post type slug matches what is defined in the cms
			// i.e. dungeoncomic.com/d/ for dungeons
			//      dungeoncomic.com/u/ for users

			// If the singular post type slug is different from the plural slug, redirect to it
			if (
				route.postTypeSlug === settings.post_type_name_slug
				&& settings.post_type_name_slug !== settings.post_type_name_plural_slug
			)
				redirect(`/${settings.post_type_name_plural_slug}`)

			// List all comics
			if (route.postTypeSlug === settings.post_type_name_plural_slug)
				return <>
					<PlatformMainArticle>
						<ComicsListPage />
					</PlatformMainArticle>
				</>

			// If the singular post type slug is different from the plural slug, redirect to it
			if (
				route.postTypeSlug === settings.user_type_name_slug
				&& settings.user_type_name_slug !== settings.user_type_name_plural_slug
			)
				redirect(`/${settings.user_type_name_plural_slug}`)

			// List all users
			if (route.postTypeSlug === settings.user_type_name_plural_slug)
				return <>
					<PlatformMainArticle>
						List users
					</PlatformMainArticle>
				</>
			notFound()
		}

		/**----------------------------------- */
		case "comic-landing-page": {
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