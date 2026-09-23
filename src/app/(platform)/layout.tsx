
import clsx from "clsx"
/**----------------------------------- */
// DATA
import { PlatformLayoutUI } from "../(comic)/_ui/layout"
import AuthModal from "../(comic)/_ui/modal-auth"
import { adminClient } from "@/lib/directus/clients"
import { readSettings } from "@directus/sdk"
import { getSettings } from "@/lib/directus/get-settings"
import Image from "next/image"
import { directusURL } from "@/data/env"
import Link from "next/link"
import { PageContentWrapper } from "../_ui/site-page"
import { verifySession } from "@/data/session"
import StatusMessage from "@/components/status-message"
import SiteNav from "../_ui/site-nav"
import { SiteLayoutMain } from "../_ui/site-layout"
import SiteFooter from "../_ui/site-footer"
import ClientLandingPageHeader from "../(comic)/[route]/@header/_effects"

export default async function PlatformLayout(props: LayoutProps<"/">) {
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
			>
				<Link href="/" className={clsx(
					"pointer-events-auto",
					"w-auto",
					"flex",
					"items-center",
					"group",
					"cursor-pointer",
					"h-full",
					"hover:scale-105",
					"hover:duration-0",
					// Transition
					"transition-all",
					"ease-in-out",
					"duration-300",
					"rounded",
					"data-open:bg-comic-accent-700/80",
					"data-open:outline-4",
					"data-open:outline-comic-accent-500",
					"data-open:outline-offset-2",
					"flex",
					"justify-center",
					"items-center",
				)}>
					{!logo &&
						<span className={clsx(
							"inline-block",
							"font-platform-display",
							"text-xl",
							"md:text-4xl",
							"text-center",
							"text-pretty",
							"font-bold",
							// "p-4",
							"w-full",
							"whitespace-nowrap",
							"overflow-x-hidden",
							"text-ellipsis",
							!!banner && [
								"text-white",
								"[text-stroke:8px_black",
								"[-webkit-text-stroke:8px_black]",
								"[paint-order:stroke_fill]",
								"drop-shadow-black/50",
								"drop-shadow-md",
							],

						)}>
							{settings.project_name}
						</span>
					}
					{logo &&
						<Image
							src={`${directusURL}/assets/${logo.filename_disk}`}
							alt={logo.description || ""}
							width={logo.width || "160"}
							height={logo.height || "120"}
							className={clsx(
								"drop-shadow-black/50",
								"drop-shadow-sm",
								"w-auto",
								"h-14",
								"md:h-19",
							)}
						/>
					}
				</Link>
			</SiteNav>
			<SiteLayoutMain>
				{/* <div className={clsx(
				"relative",
				"pt-12",
				"md:pt-22",
			)}> */}
				<PageContentWrapper>
					{props.children}
				</PageContentWrapper>
				{/* </div> */}
			</SiteLayoutMain>
			<SiteFooter />
		</PlatformLayoutUI >
	</>
}