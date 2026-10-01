/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
// DATA
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import PlatformRootLayout from "@/ui/platform/layout"
import { NotFoundUI } from "@/ui/platform/not-found"
import { PlatformHeaderLogo } from "@/ui/platform/components/header-logo"
import { ComicRootLayout } from "@/ui/comic/layout"
import { ClientComicPageHeaderTitle } from "@/ui/comic/components/client/comic-page-header-title"

/**----------------------------------- */
export default async function NotFoundPage() {
	const settings = await getSettings()
	const comic = await getComic({ slug: settings.frontpage_comic?.slug })
	const routingMode = settings.routing_mode
	switch (routingMode) {
		case "single/single":
			return <>
				<ComicRootLayout header={<ClientComicPageHeaderTitle comic={comic} />}>
					<NotFoundUI />
				</ComicRootLayout>
			</>
		case "single/multiple":
		case "multiple/multiple":
			return <>
				<PlatformRootLayout header={<PlatformHeaderLogo />}>
					<NotFoundUI />
				</PlatformRootLayout>
			</>
	}
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 * TODO: This doesn't seem to be showing up or having any effect
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("404Page")
	return {
		title: t("title"),
	}
}