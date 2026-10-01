/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import AuthModal from "../app/_ui/modal-auth"
import { adminClient } from "@/lib/directus/clients"
import { readSettings } from "@directus/sdk"
import { getSettings } from "@/lib/directus/get-settings"
import { verifySession } from "@/data/session"
import { PlatformLayoutUI } from "./(comic)/_ui/layout"
import SiteNav from "./_ui/site-nav"
import { SiteLayoutMain } from "./_ui/site-layout"
import { PageContentWrapper } from "./_ui/site-page"
import { NotFoundUI } from "./_ui/not-found"

/**----------------------------------- */
export default async function NotFoundPage() {
	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))
	const settings = await getSettings()
	const logo = settings.project_logo
	const banner = settings.project_banner
	const session = await verifySession()
	return <>
		<AuthModal public_registration={public_registration} />
		<PlatformLayoutUI session={session}>
			<SiteNav
				session={session}
				settings={settings}
				menu={true}
			></SiteNav>
			<SiteLayoutMain>
				<PageContentWrapper>
					<NotFoundUI />
				</PageContentWrapper>
			</SiteLayoutMain>
		</PlatformLayoutUI>
	</>
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