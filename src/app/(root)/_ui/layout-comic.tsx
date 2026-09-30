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
import { SiteLayoutBackdrop, SiteLayoutMain, SiteLayoutWrapper } from "@/app/_ui/site-layout"
import clsx from "clsx"
import { directusURL } from "@/data/env"
import React from "react"
import SiteNav from "@/app/_ui/site-nav"
import { ComicPageHeader } from "./page/comic"
import SiteFooter from "@/app/_ui/site-footer"

export async function ComicRootLayout({
	children,
	header,
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
	const comic = await getComic({ slug: frontpageComic?.slug })

	return <>
		<AuthModal public_registration={public_registration} />
		<ComicContextProvider getComic={comic} getSession={session} getSettings={settings}>
			<ComicLayoutWrapper comic={comic}>
				<SiteNav comic={comic} session={session} settings={settings}

					menu={isSingleSingle ? false : true}
				>
					<ComicPageHeader comic={comic}>
						{header}
					</ComicPageHeader>
				</SiteNav>
				<SiteLayoutMain>
					{children}
				</SiteLayoutMain>
			</ComicLayoutWrapper>
		</ComicContextProvider>
		<SiteFooter />
	</>
}

const ComicLayoutWrapper = ({
	children,
	comic,
}: {
	children: React.ReactNode
	comic: Awaited<ReturnType<typeof getComic>>
}) => {
	// FETCH COMIC APPEARANCE VARS
	const displayFontSlug = displayFonts[comic.display_font.toString()].slug
	const copyFontSlug = copyFonts[comic.copy_font.toString()].slug
	const accentColor = comic.accent_color || "red"

	// RENDER COMIC LAYOUT UI
	return (
		<SiteLayoutWrapper className={clsx("font-comic-copy")}
			style={
				{
					// Fonts
					"--font-comic-copy": `var(--font-${copyFontSlug})`,
					"--font-comic-header": `var(--font-${copyFontSlug})`,
					"--font-comic-display": `var(--font-${displayFontSlug})`,
					"--color-comic-accent-50": `var(${colorVariants[accentColor]["50"]})`,
					"--color-comic-accent-100": `var(${colorVariants[accentColor]["100"]})`,
					"--color-comic-accent-200": `var(${colorVariants[accentColor]["200"]})`,
					"--color-comic-accent-300": `var(${colorVariants[accentColor]["300"]})`,
					"--color-comic-accent-400": `var(${colorVariants[accentColor]["400"]})`,
					"--color-comic-accent-500": `var(${colorVariants[accentColor]["500"]})`,
					"--color-comic-accent-600": `var(${colorVariants[accentColor]["600"]})`,
					"--color-comic-accent-700": `var(${colorVariants[accentColor]["700"]})`,
					"--color-comic-accent-800": `var(${colorVariants[accentColor]["800"]})`,
					"--color-comic-accent-900": `var(${colorVariants[accentColor]["900"]})`,
					"--color-comic-accent-950": `var(${colorVariants[accentColor]["950"]})`,
				} as React.CSSProperties}
		>
			{comic.banner &&
				<SiteLayoutBackdrop style={{
					backgroundImage: `url(${directusURL}/assets/${comic.banner?.filename_disk})`,
				}} />
			}
			{children}
		</SiteLayoutWrapper>
	)
}