// LIBRARIES
import React, { Suspense } from "react"
import { redirect, RedirectType } from "next/navigation"
import { marked } from "marked"
import { readSettings } from "@directus/sdk"
// STYLES
import { colorVariants } from "@/styles/colors"
import { headersFonts, labelsFonts, copyFonts, monoFonts } from "@/styles/fonts"
// DATA
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { adminClient } from "@/lib/directus/clients"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// FUNCTIONS
import clsx from "clsx"
import { sanitize } from "@/lib/sanitize"
import { getUserVarsCookie } from "./actions/variables"
import { replaceComicVariables } from "./functions/parse-content"
// UI
import ClientPlatformNav from "@/ui/platform/components/nav"
import { PlatformBackdrop, PlatformMain } from "@/ui/platform/components/main"
import PlatformFooter from "@/ui/platform/components/footer"
import ComicContextProvider from "@/ui/comic/context"

import AuthModal from "@/ui/platform/components/auth-modal"
import { PlatformMainWrapper } from "@/ui/platform/components/main"
import { ComicPageHeader } from "./pages/single"
import ComicLandingPageUI from "./pages/landing-page"

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
	const isRoutingModeSingleSingle = routingMode === "single-single"
	// If a slug has been provided, fetch that comic
	// Otherwise, fall back to the frontpage comic
	const comic = await getComic({ slug: slug || frontpageComic?.slug })

	return <>
		<AuthModal public_registration={public_registration} />
		{/* <ComicContextProvider key={comic.slug} getComic={comic} getSession={session} getSettings={settings}> */}
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
			<PlatformFooter />
		</ComicMainWrapper>
		{/* </ComicContextProvider> */}
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
	const displayFontSlug = headersFonts[comic.display_font.toString()].slug
	const copyFontSlug = copyFonts[comic.copy_font.toString()].slug
	const accentColor = comic.accent_color || "red"

	// RENDER COMIC LAYOUT UI
	return (
		<PlatformMainWrapper className={clsx("font-comic-copy")}
			style={
				{
					// Fonts
					"--font-comic-copy": `var(--font-${copyFontSlug})`,
					"--font-comic-labels": `var(--font-${copyFontSlug})`,
					"--font-comic-headers": `var(--font-${displayFontSlug})`,
					"--color-platform-accent-50": `var(${colorVariants[accentColor]["50"]})`,
					"--color-platform-accent-100": `var(${colorVariants[accentColor]["100"]})`,
					"--color-platform-accent-200": `var(${colorVariants[accentColor]["200"]})`,
					"--color-platform-accent-300": `var(${colorVariants[accentColor]["300"]})`,
					"--color-platform-accent-400": `var(${colorVariants[accentColor]["400"]})`,
					"--color-platform-accent-500": `var(${colorVariants[accentColor]["500"]})`,
					"--color-platform-accent-600": `var(${colorVariants[accentColor]["600"]})`,
					"--color-platform-accent-700": `var(${colorVariants[accentColor]["700"]})`,
					"--color-platform-accent-800": `var(${colorVariants[accentColor]["800"]})`,
					"--color-platform-accent-900": `var(${colorVariants[accentColor]["900"]})`,
					"--color-platform-accent-950": `var(${colorVariants[accentColor]["950"]})`,
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
	const settings = await getSettings()
	const routingMode = settings.routing_mode
	const comicPrefixSlug = settings.comic_type_name_slug
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

	let urlPrefix

	if (routingMode === "single-single") urlPrefix = ""
	if (routingMode === "single-multiple") urlPrefix = `${comic.slug}/`
	if (routingMode === "multiple-multiple") urlPrefix = `${comicPrefixSlug}/${comic.slug}/`

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
			redirect(`/${urlPrefix}1`)
		// REDIRECT TO LAST PAGE
		case "last-page":
			redirect(`/${urlPrefix}${page_count}`, RedirectType.replace)
		// REDIRECT TO A SPECIFIC PAGE
		default:
			redirect(`/${urlPrefix}`, RedirectType.replace)
	}
}