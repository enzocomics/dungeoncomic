// LIBRARIES
import React, { Suspense } from "react"
import { redirect, RedirectType } from "next/navigation"
import { marked } from "marked"
import { readSettings } from "@directus/sdk"
// STYLES
import { colorVariants } from "@/styles/colors"
import { displayFonts, copyFonts } from "@/styles/fonts"
// DATA
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { adminClient } from "@/lib/directus/clients"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// FUNCTIONS
import clsx from "clsx"
import { sanitize } from "@/lib/sanitize"
import { getUserVarsCookie } from "../_actions/variables"
import { replaceComicVariables } from "../_functions/parse-content"
// UI
import ComicContextProvider from "./context"
import AuthModal from "@/app/_ui/modal-auth"
import SiteNav from "@/app/_ui/site-nav"
import { SiteLayoutBackdrop, SiteLayoutMain, SiteLayoutWrapper } from "@/app/_ui/site-layout"
import SiteFooter from "@/ui/platform/components/site-footer"
import { ComicPageHeader } from "./page/comic"
import ComicLandingPageUI from "./page/comic-landing"

export async function ComicRootLayout({
	children,
	header,
	slug
}: {
	children: React.ReactNode
	header: React.ReactNode
	slug?: string
}) {

	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))

	const settings = await getSettings()
	const session = await verifySession()

	const frontpageComic = settings.frontpage_comic
	const routingMode = settings.routing_mode
	const isRoutingModeSingleSingle = routingMode === "single/single"
	// If a slug has been provided, fetch that comic
	// Otherwise, fall back to the frontpage comic
	const comic = await getComic({ slug: slug || frontpageComic?.slug })

	return <>
		<AuthModal public_registration={public_registration} />
		<ComicContextProvider getComic={comic} getSession={session} getSettings={settings}>
			<ComicLayoutWrapper comic={comic}>
				<SiteNav comic={comic} session={session} settings={settings}
					menu={isRoutingModeSingleSingle ? false : true}
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

export const ComicLayoutWrapper = ({
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

export const ComicLandingPage = async ({
	comic
}: {
	comic: Awaited<ReturnType<typeof getComic>>
}) => {
	const session = await verifySession()
	const userVariables = await getUserVarsCookie({ comic: comic })
	// Get the comic page & variables
	const variables = await getComicVariables(comic?.slug)
	// CHECK `landingPage` SETTING
	const landingPage = comic.landing_page
	const landingPageContent = replaceComicVariables({
		content:
			String(
				marked.parse(
					sanitize(String(comic.landing_page_content))
				)
			),
		variables: variables,
		userVariables: userVariables,
		html: true
	})
	const page_count = comic.pages_count

	switch (landingPage) {
		// SHOW LANDING PAGE UI
		case "cover-page":
			return <Suspense>
				<ComicLandingPageUI
					content={`${landingPageContent}`}
					comic={comic}
					session={session}
					variables={variables}
					userVariables={userVariables}
				/>
			</Suspense>
		// REDIRECT TO FIRST PAGE
		case "first-page":
			redirect(`1`, RedirectType.replace)
		// REDIRECT TO LAST PAGE
		case "last-page":
			redirect(`${page_count}`, RedirectType.replace)
		// REDIRECT TO A SPECIFIC PAGE
		default:
			redirect(`${landingPage}`, RedirectType.replace)
	}
}