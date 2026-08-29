"use client"
/**----------------------------------- */
// LIBRARIES
import { Suspense } from "react"
import { Link } from "@/components/link"
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getComic } from "@/lib/directus/get-comics"
import Image from "next/image"
import { directusURL } from "@/data/env"
import { displayFonts, copyFonts, fonts } from "@/styles/fonts"
/**-----------------------------------
 * COMIC FRONTPAGE LAYOUT
 * ---
 * - Default homepage
 */
export function ComicLayoutUI({
	children,
	comic
}: {
	children: React.ReactNode
	comic: Awaited<ReturnType<typeof getComic>>
}) {
	// FETCH COMIC APPEARANCE VARS
	const displayFontSlug = displayFonts[comic.display_font.toString()].slug
	const copyFontSlug = copyFonts[comic.copy_font.toString()].slug

	return <div className={clsx(
		// Temporary CSS
		"border",
		"border-orange-500",
		"border-dashed",
		// Appearance
		"h-full",
		"px-8",
		"font-copy"
	)}
		// COMIC APPEARANCE
		style={{
			// Accent Color
			backgroundColor: comic.accent_color ? `${comic.accent_color}40` : "transparent",
			// Fonts
			"--font-copy": `var(--font-${copyFontSlug})`,
			"--font-display": `var(--font-${displayFontSlug})`
		} as React.CSSProperties}
	>
		{/* <h3 className={clsx(
			// Temporary CSS
			"font-display",
			"text-2xl",
		)}>Comic Layout UI</h3> */}
		{/* {comic.logo &&
			<Image
				src={`${directusURL}/assets/${comic.logo.filename_disk}`}
				width={comic.logo.width || 100}
				height={comic.logo.height || 100}
				alt={comic.logo.description || comic.title}
			/>
		} */}
		{/* {!comic.logo && */}
		<h2 className={clsx(
			"my-4",
			"font-bold",
			"text-1xl"
		)}>{comic.title}</h2>
		{/* } */}
		{/* <strong>Comic Description</strong>: {comic.description} <br /> */}
		<div className={clsx(
			// "bg-base-1",
			"mx-auto"
		)}>
			{children}
		</div>
	</div>
}

/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
export function FrontpageLayoutUI({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			// 
			"flex",
			"h-full",
			"flex-col",
			"bg-base-1"
		)}>
			<div className={clsx()}>
				<h2 className={clsx(
					// Temporary CSS
					"text-4xl",
					"font-bold",
					"font-display"
				)}>
					Root Layout
				</h2>
				Navigation:&nbsp;&nbsp;
				<Link href="/">Project Homepage</Link>&nbsp;&mdash;&nbsp;
				<Link href="/dungeoncomic">Comic Landing Page</Link>&nbsp;&mdash;&nbsp;
				<Link href="/dungeoncomic/1">Comic Page 1</Link>
				<Suspense>
					{children}
				</Suspense>
			</div>
		</div>
	</>
}