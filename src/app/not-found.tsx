/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import AuthModal from "./_ui/modal-auth"
import { adminClient } from "@/lib/directus/clients"
import { readSettings } from "@directus/sdk"
import { getSettings } from "@/lib/directus/get-settings"
import { verifySession } from "@/data/session"
import ClientPlatformNav from "@/ui/platform/components/nav"
import { PageContentWrapper } from "../ui/platform/components/site-page"
import { NotFoundUI } from "./_ui/not-found"
import { ComicMainWrapper, ComicRootLayout } from "../ui/comic/layout"
import { getComic } from "@/lib/directus/get-comics"
import PlatformRootLayout from "@/ui/platform/layout"

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
				{/* <AuthModal public_registration={public_registration} />
				<ComicLayoutWrapper comic={comic}>
					<ClientPlatformNav
						session={session}
						settings={settings}
						menu={false}
					></ClientPlatformNav>
					<PlatformMain>
						<PageContentWrapper>
							<NotFoundUI />
						</PageContentWrapper>
					</PlatformMain>
				</ComicLayoutWrapper> */}
				<ComicRootLayout header={header}>
					<PageContentWrapper>
						<NotFoundUI />
					</PageContentWrapper>
				</ComicRootLayout>
			</>
		case "single/multiple":
			return <>
				<PlatformRootLayout header={header}>
					<NotFoundUI />
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