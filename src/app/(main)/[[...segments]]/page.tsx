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
import { comicMetadata, comicPageMetadata, notFoundMetadata } from "@/ui/comic/metadata"
import { Metadata } from "next"
import { CommentsSection } from "@/ui/comic/components/comic-comments"
import { getComments } from "@/lib/directus/get-comments"
import { Suspense } from "react"
import { connection } from "next/server"
import { cacheTag } from "next/cache"
/**----------------------------------- */
export default async function MainPage({
	params
}: {
	params: Promise<{ segments?: string[] }>
}) {
	return <>
		<Suspense>
			<MainPageContent params={params} />
		</Suspense>
	</>
}

export async function MainPageContent({
	params
}: {
	params: Promise<{ segments?: string[] }>
}) {
	await connection()
	const { segments = [] } = await params
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
		case "platform-content-type-page": {
			// TODO:
			// - Only display content if the post type slug matches what is defined in the cms
			// i.e. dungeoncomic.com/d/ for dungeons
			//      dungeoncomic.com/u/ for users

			// If the singular post type slug is different from the plural slug, redirect to it
			if (
				route.postTypeSlug === settings.comic_type_name_slug
				&& settings.comic_type_name_slug !== settings.comic_type_name_plural_slug
			)
				redirect(`/${settings.comic_type_name_plural_slug}`)

			// List all comics
			if (route.postTypeSlug === settings.comic_type_name_plural_slug)
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
			// console.log(comic)
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
			const comments = await getComments(comicPage.id as number)
			const variables = await getComicVariables(route.comicSlug!)
			const userVariables = await getUserVarsCookie({ comic: comic })
			if (comic && comicPage) return <>
				<ComicPageUI
					page={comicPage}
					variables={variables}
					userVariables={userVariables}
				// session={session}
				/>
				{/* <CommentsSection
					page={comicPage}
					comments={comments}
					// session={session}
					variables={variables}
					userVariables={userVariables}
				/> */}
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



/**-----------------------------------
 * Generate Metadata
 * ---
 **/
export async function generateMetadata({
	params
}: {
	params: Promise<{ segments?: string[] }>
}): Promise<Metadata | undefined> {


	const { segments = [] } = await params
	const settings = await getSettings()
	const route = await resolveRoute(segments, settings.routing_mode)

	if (!route) return await notFoundMetadata()

	switch (route.type) {
		case "platform-homepage": {
			return {}
		}
		case "platform-content-type-page": {
			return {}
		}
		case "comic-landing-page": {
			return await comicMetadata(route.comicSlug)
		}
		case "comic-named-page": {
			return {}
		}
		case "comic-single-page": {
			return await comicPageMetadata(route.comicSlug, route.pageNum)
		}
		case "comic-single-page-action": {
			return {}
		}
		// 404
		default: {
			return await notFoundMetadata()
		}
	}
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