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
import AuthModal from "@/app/_ui/modal-auth"
import { getSettings } from "@/lib/directus/get-settings"
import ComicContextProvider from "./context"
import { PlatformLayoutWrapper, SiteLayoutBackdrop, SiteLayoutMain, SiteLayoutWrapper } from "@/app/_ui/site-layout"
import clsx from "clsx"
import { directusURL } from "@/data/env"
import React from "react"
import SiteNav from "@/ui/platform/components/site-nav"
import { ComicPageHeader } from "./page/comic"
import SiteFooter from "@/ui/platform/components/site-footer"


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

	const frontpageComic = settings.frontpage_comic
	const routingMode = settings.routing_mode
	const isSingleSingle = routingMode === "single/single"

	return <>
		<AuthModal public_registration={public_registration} />
		<PlatformLayoutWrapper>
			<SiteNav session={session} settings={settings} menu={isSingleSingle ? false : true}>
				{header}
			</SiteNav>
			<SiteLayoutMain>
				{children}
			</SiteLayoutMain>
		</PlatformLayoutWrapper>
		<SiteFooter />
	</>
}