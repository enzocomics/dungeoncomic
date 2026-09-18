/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import React from "react"
// STYLES
import { colorVariants } from "@/styles/colors"
import { displayFonts, copyFonts } from "@/styles/fonts"
// DATA
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"
import { getComic } from "@/lib/directus/get-comics"
import { verifySession } from "@/data/session"
// UI
import SiteNav from "../../_ui/site-nav"
import { SiteLayoutBackdrop, SiteLayoutMain, SiteLayoutWrapper } from "@/app/_ui/site-layout"

/**-----------------------------------
 * COMIC FRONTPAGE LAYOUT
 * ---
 * - Default homepage
 */
export function ComicLayoutUI({
	children,
	comic,
	session,
	settings,
}: {
	children: React.ReactNode
	comic: Awaited<ReturnType<typeof getComic>>
	session?: Awaited<ReturnType<typeof verifySession>>
	settings?: Awaited<ReturnType<typeof getSettings>>
}) {
	// FETCH COMIC APPEARANCE VARS
	const displayFontSlug = displayFonts[comic.display_font.toString()].slug
	const copyFontSlug = copyFonts[comic.copy_font.toString()].slug
	const accentColor = comic.accent_color || "red"

	// FRONTPAGE COIMC BOOLEAN
	const singleComicSite = settings?.single_comic_site

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
			<SiteNav
				comic={comic}
				session={session}
				menu={singleComicSite ? false : true}
			// Hide the navmenu if it's a single comic site
			// TODO:In the future, if we had subpages, add a conditional that checks if subpages exist as well before hiding
			/>
			<SiteLayoutMain>
				{children}
			</SiteLayoutMain>
		</SiteLayoutWrapper>
	)
}

/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
export async function FrontpageLayoutUI({
	children,
	session
}: {
	children: React.ReactNode
	session?: Awaited<ReturnType<typeof verifySession>>
}) {

	const settings = await getSettings()
	const banner = settings.project_banner
	const hasBanner = !!banner
	return <>
		<SiteLayoutWrapper className={clsx("font-platform-copy")}>
			{hasBanner &&
				<SiteLayoutBackdrop style={{
					backgroundImage: `url(${directusURL}/assets/${banner?.filename_disk})`,
				}} />
			}
			<SiteNav
				menu={true}
				session={session}
			/>
			<SiteLayoutMain>
				{children}
			</SiteLayoutMain>
		</SiteLayoutWrapper>
	</>
}




