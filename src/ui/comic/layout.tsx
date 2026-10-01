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
import { getUserVarsCookie } from "../../app/(root)/_actions/variables"
import { replaceComicVariables } from "./functions/parse-content"
// UI
import ClientPlatformNav from "@/ui/platform/components/nav"
import { PlatformBackdrop, PlatformMain } from "@/ui/platform/components/main"
import PlatformFooter from "@/ui/platform/components/footer"
import ComicContextProvider from "@/ui/comic/context"

import AuthModal from "@/ui/platform/components/auth-modal"
import { PlatformMainWrapper } from "@/ui/platform/components/main"
import { ComicPageHeader } from "../../app/(root)/_ui/page/comic"
import ComicLandingPageUI from "../../app/(root)/_ui/page/comic-landing"

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
			<ComicMainWrapper comic={comic}>
				<ClientPlatformNav comic={comic} session={session} settings={settings}
					menu={isRoutingModeSingleSingle ? false : true}
				>
					<ComicPageHeader comic={comic}>
						{header}
					</ComicPageHeader>
				</ClientPlatformNav>
				<PlatformMain>
					{children}
				</PlatformMain>
			</ComicMainWrapper>
		</ComicContextProvider>
		<PlatformFooter />
	</>
}

export const ComicMainWrapper = ({
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
		<PlatformMainWrapper className={clsx("font-comic-copy")}
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
				<PlatformBackdrop style={{
					backgroundImage: `url(${directusURL}/assets/${comic.banner?.filename_disk})`,
				}} />
			}
			{children}
		</PlatformMainWrapper>
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