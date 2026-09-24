/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import AuthModal from "./(comic)/_ui/modal-auth"
import { adminClient } from "@/lib/directus/clients"
import { readSettings } from "@directus/sdk"
import { getSettings } from "@/lib/directus/get-settings"
import { verifySession } from "@/data/session"
import { PlatformLayoutUI } from "./(comic)/_ui/layout"
import SiteNav from "./_ui/site-nav"
import { SiteLayoutMain } from "./_ui/site-layout"
import { PageContentWrapper } from "./_ui/site-page"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"

/**----------------------------------- */
export default async function NotFoundPage() {
	const t = await getTranslations("404Page")
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
					<h1 className={clsx(
						"px-6",
						"lg:pt-6",
						"max-w-prose",
						"mx-auto",
						"font-platform-display",
						"text-center",
						"text-4xl",
					)}>{t("title")}</h1>
					<p className={clsx(
						"px-6",
						"lg:pt-6",
						"max-w-prose",
						"mx-auto",
					)}>
						<Image src="/img/404.webp"
							width="320"
							height="240"
							alt="A crazy-looking capybara."
						/>
					</p>

					<Link href="/" className={clsx(
						"px-6",
						"lg:pt-6",
						"max-w-prose",
						"mx-auto",
						"font-semibold",
						"font-platform-header",
						"text-red-700",
						"hover:duration-0",
						"hover:text-red-800",
						"dark:text-red-400",
						"dark:hover:text-600",
						"ease-in-out",
						"transition-all",
						"duration-300",
					)}
					>&laquo; {t("return-home")}</Link>
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