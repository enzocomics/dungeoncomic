/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { readSettings } from "@directus/sdk"
// DATA
import { verifySession } from "@/data/session"
import { adminClient } from "@/lib/directus/clients"
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import PlatformRootLayout from "@/ui/platform/layout"
import { NotFoundUI } from "@/ui/platform/not-found"
import { PlatformMainArticle } from "@/ui/platform/components/main"
import { ComicRootLayout } from "@/ui/comic/layout"
import { ClientComicPageHeaderTitle } from "@/ui/comic/components/client/comic-page-header-title"

/**----------------------------------- */
export default async function NotFoundPage({
	header
}: {
	header: React.ReactNode
}) {
	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))
	const settings = await getSettings()
	const logo = settings.project_logo
	const banner = settings.project_banner
	const session = await verifySession()
	const comic = await getComic({ slug: settings.frontpage_comic?.slug })

	const routingMode = settings.routing_mode

	switch (routingMode) {
		case "single/single":
			return <>
				<ComicRootLayout header={<ClientComicPageHeaderTitle comic={comic} />}>
					<PlatformMainArticle>
						<NotFoundUI />
					</PlatformMainArticle>
				</ComicRootLayout>
			</>
		case "single/multiple":
		case "multiple/multiple":
			return <>
				<PlatformRootLayout header={header}>
					<PlatformMainArticle>
						<NotFoundUI />
					</PlatformMainArticle>
				</PlatformRootLayout>
			</>
	}
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("404Page")
	return {
		title: t("title"),
	}
}