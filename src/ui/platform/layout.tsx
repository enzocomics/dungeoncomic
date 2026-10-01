// LIBRARIES
import { readSettings } from "@directus/sdk"
// STYLES
import { colorVariants } from "@/styles/colors"
import { displayFonts, copyFonts } from "@/styles/fonts"
// DATA
import { verifySession } from "@/data/session"
import { adminClient } from "@/lib/directus/clients"
import { getComic } from "@/lib/directus/get-comics"
// UI
import AuthModal from "@/ui/platform/components/auth-modal"
import { getSettings } from "@/lib/directus/get-settings"
import ComicContextProvider from "@/ui/comic/context"

import { PlatformMainWrapper, PlatformBackdrop, PlatformMain } from "@/ui/platform/components/main"
import clsx from "clsx"
import { directusURL } from "@/data/env"
import React, { ComponentPropsWithoutRef } from "react"
import ClientPlatformNav from "@/ui/platform/components/nav"
import { ComicPageHeader } from "../comic/pages/single"
import PlatformFooter from "@/ui/platform/components/footer"


export default async function PlatformRootLayout({
	children,
	header
}: {
	children: React.ReactNode
	header: React.ReactNode
}) {
	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))

	const settings = await getSettings()
	const session = await verifySession()

	const banner = settings.project_banner
	const hasBanner = !!banner
	const frontpageComic = settings.frontpage_comic
	const routingMode = settings.routing_mode
	const isSingleSingle = routingMode === "single/single"

	return <>
		<AuthModal public_registration={public_registration} />
		<PlatformMainWrapper>
			{hasBanner &&
				<PlatformBackdrop style={{
					backgroundImage: `url(${directusURL}/assets/${banner?.filename_disk})`,
				}} />
			}
			<ClientPlatformNav session={session} settings={settings} menu={isSingleSingle ? false : true}>
				{header}
			</ClientPlatformNav>
			<PlatformMain>
				{children}
			</PlatformMain>
		</PlatformMainWrapper>
		<PlatformFooter />
	</>
}
