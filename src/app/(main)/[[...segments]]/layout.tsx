/**----------------------------------- */
// LIBRARIES
import { notFound } from "next/navigation"
// DATA
import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
// FUNCTIONS
import { resolveRoute } from "@/ui/platform/functions/resolver"
// UI
import { ComicRootLayout } from "@/ui/comic/layout"
import PlatformRootLayout from "@/ui/platform/layout"
import ClientLandingPageHeader from "@/ui/comic/components/@header/effects"
import { getComic } from "@/lib/directus/get-comics"
import { ClientComicPageHeaderTitle } from "@/ui/comic/components/client/comic-page-header-title"
import { PlatformMainArticle } from "@/ui/platform/components/main"
import { PlatformHeaderLogo } from "@/ui/platform/components/header-logo"

/**----------------------------------- */
export default async function Layout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ segments?: string[] }>
}) {
	const { segments = [] } = await params
	const session = await verifySession()
	const settings = await getSettings()
	const route = await resolveRoute(segments, settings.routing_mode)

	if (!route) notFound()

	switch (route.type) {
		/**----------------------------------- */
		case "platform-homepage": {
			return <>
				<PlatformRootLayout header={
					<ClientLandingPageHeader settings={settings} />
				}>
					{children}
				</PlatformRootLayout>
			</>
		}

		/**----------------------------------- */
		case "platform-category-page": {
			return <>
				<PlatformRootLayout header={
					<PlatformHeaderLogo />
				}>
					{children}
				</PlatformRootLayout>
			</>
		}

		/**----------------------------------- */
		case "comic-landing-page": {
			const comic = await getComic({ slug: route.comicSlug })
			return <>
				<ComicRootLayout header={
					<ClientLandingPageHeader comic={comic} settings={settings} />
				}>
					{children}
				</ComicRootLayout>
			</>
		}
		/**----------------------------------- */
		case "comic-single-page": {
			const comic = await getComic({ slug: route.comicSlug })
			return <>
				<ComicRootLayout header={
					<ClientComicPageHeaderTitle comic={comic} />
				}>
					{children}
				</ComicRootLayout>
			</>
		}
		case "comic-named-page":
		case "comic-single-page-action":
			{
				// TODO:
				const comic = await getComic({ slug: route.comicSlug })
				return <>
					<ComicRootLayout header={
						<ClientComicPageHeaderTitle comic={comic} />
					}>
						<PlatformMainArticle>
							{children}
						</PlatformMainArticle>
					</ComicRootLayout>
				</>
			}
	}

}