import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ClientComicPageHeaderTitle } from "@/ui/comic/components/client/comic-page-header-title"
import { ComicRootLayout } from "@/ui/comic/layout"
import PlatformRootLayout from "@/ui/platform/layout"
import { PlatformHeaderLogo } from "@/ui/platform/components/header-logo"
import { PlatformMainArticle } from "@/ui/platform/components/main"

export default async function Layout(props: LayoutProps<"/">) {
	const settings = await getSettings()
	const routingMode = settings.routing_mode
	const frontpageComic = settings.frontpage_comic

	switch (routingMode) {

		case "single-single": {
			let comic = await getComic(frontpageComic ? { slug: frontpageComic.slug } : {})
			if (comic)
				return <>
					<ComicRootLayout slug={comic.slug} header={
						<ClientComicPageHeaderTitle comic={comic} />
					}>
						<PlatformMainArticle>
							{props.children}
						</PlatformMainArticle>
					</ComicRootLayout>
				</>
			else
				return <>
					<PlatformRootLayout header={
						<PlatformHeaderLogo />
					}>
						<PlatformMainArticle>
							{props.children}
						</PlatformMainArticle>
					</PlatformRootLayout>
				</>
		}
		case "single-multiple":
		case "multiple-multiple": {
			return <>
				<PlatformRootLayout header={
					<PlatformHeaderLogo />
				}>
					<PlatformMainArticle>
						{props.children}
					</PlatformMainArticle>
				</PlatformRootLayout>
			</>
		}

	}

}