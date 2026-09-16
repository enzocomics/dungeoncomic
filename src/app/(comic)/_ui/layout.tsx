"use client"
/**----------------------------------- */
// LIBRARIES
// FUNCTIONS
import clsx from "clsx"
// STYLES
import { colorVariants } from "@/styles/colors"
import { displayFonts, copyFonts } from "@/styles/fonts"
// DATA
import { directusURL } from "@/data/env"
import { getComic } from "@/lib/directus/get-comics"
import { verifySession } from "@/data/session"
import NavMenu from "./site-nav"
import { getSettings } from "@/lib/directus/get-settings"
import React from "react"

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
		<div style={
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
			className={clsx(
				"relative",
				"font-comic-copy",
				"bg-top",
				"bg-repeat-x",
				"bg-fixed",
			)}>

			{/* Comic Banner Background Image*/}
			{comic.banner &&
				<div
					style={{
						backgroundImage: `url(${directusURL}/assets/${comic.banner?.filename_disk})`,
					}}
					className={clsx(
						// Position
						"-z-1",
						"fixed",
						"left-1/2 -translate-x-1/2 ",
						// Size
						"w-full",
						"max-w-[1600px]",
						"h-100",
						// Appearance
						"opacity-75",
						// Background
						"bg-cover",
						"bg-center",
						"bg-fixed",
						"bg-blend-saturation",
						// Background: Fade to bottom
						"mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)",
						"[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]",
						// Background: Fade to left & right (desktop)
						"xl:mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)",
						"xl:mask-composite:intersect",
						"xl:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]",
						"xl:[-webkit-mask-composite:source-in]",
					)} />
			}
			<NavMenu
				comic={comic}
				session={session}
				menu={singleComicSite ? false : true}
			/>
			{/* Hide the navmenu if it's the frontpagecomic
				- #TODO: In the future, if we had subpages, add a conditional that checks if subpages exist as well before hiding
			*/}
			<main className={clsx(
				"mx-auto",
				"max-w-6xl",
				"md:px-6",
			)}>
				{children}
			</main>
		</div>
	)
}

/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
export function FrontpageLayoutUI({
	children,
	session
}: {
	children: React.ReactNode
	session?: Awaited<ReturnType<typeof verifySession>>
}) {
	return <>
		<div className={clsx(
			"relative",
			"font-platform-copy",
			"bg-top",
			"bg-repeat-x",
			"bg-fixed",
		)}>
			<div
				style={{
					// backgroundImage: `url(${directusURL}/assets/${comic.banner?.filename_disk})`,
					backgroundImage: `url(/img/backdrop.webp)`,
				}}
				className={clsx(
					// Position
					"-z-1",
					"fixed",
					"left-1/2 -translate-x-1/2 ",
					// Size
					"w-full",
					"max-w-[1600px]",
					"h-150",
					// Appearance
					"opacity-75",
					// Background
					"bg-cover",
					"bg-center",
					"bg-fixed",
					"bg-blend-saturation",
					// Background: Fade to bottom
					"mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)",
					"[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]",
					// Background: Fade to left & right (desktop)
					"xl:mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)",
					"xl:mask-composite:intersect",
					"xl:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]",
					"xl:[-webkit-mask-composite:source-in]",
				)} />
			<NavMenu
				menu={true}
				session={session}
			/>
			<div className={clsx(
				"mx-auto",
				"max-w-6xl",
				"md:px-6",
			)}>
				<header className={clsx(
					"text-center",
					"h-20"
				)}>
				</header>
				<main className={clsx(
					"bg-white",
				)}>
					{children}
				</main>
			</div>
		</div>
	</>
}




