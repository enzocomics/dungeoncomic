/**----------------------------------- */
import clsx from "clsx"
// LIBRARIES
import React, { ComponentPropsWithoutRef } from "react"
import { getTranslations } from "next-intl/server"
// DATA
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
// UI
import ComicPageContentUI from "./comic-page"
import { ClientComicPageHeaderTitle } from "./client/comic-page-header-title"
import { sanitize } from "@/lib/sanitize"
import { marked } from "marked"


/**----------------------------------- */
// TYPES
export type ComicPageUIProps = {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	session?: Awaited<ReturnType<typeof verifySession>>
	children?: React.ReactNode
	header?: React.ReactNode
}


/**-----------------------------------
 * Comic Page UI
 * ---
 */

export default async function ComicPageUI({
	page,
	variables,
	userVariables,
	session,
}: ComicPageUIProps) {

	const t = await getTranslations("ComicPage")
	// COMIC VARS
	const comic = page.comic
	const hasBanner = !!comic.banner
	const hasLogo = !!comic.logo
	const hasAuthors = !!comic.authors && comic.authors.length > 0
	// PARSED MARKDOWN
	const comicDescription = marked.parse(sanitize(comic.description))

	return <>
		<ComicPageContentUI
			page={page}
			variables={variables}
			userVariables={userVariables}
			session={session}
		>
			<ComicPageHeader page={page} >
				<ClientComicPageHeaderTitle
					page={page}
					variables={variables}
					userVariables={userVariables}
				/>
			</ComicPageHeader>
			<ComicPageContentWrapper />
		</ComicPageContentUI>
	</>
}

/**
 * The header component of the Comic Page
 * - Contains Comic Page Title (Client Component)
 * 
 */
export function ComicPageHeader({
	page,
	className,
	...props
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
} & ComponentPropsWithoutRef<"header">) {
	const comic = page.comic
	const hasBanner = !!comic.banner
	const hasLogo = !!comic.logo
	const hasAuthors = !!comic.authors && comic.authors.length > 0
	return <header
		{...props}
		className={clsx(
			className,
			// This div wraps around the actual header, and provides some spacing on larger screens. It's full-width and transparent
			// Structure
			"fixed",
			"z-10",
			"left-0",
			"md:left-1/2",
			"md:-translate-x-1/2",
			// Size
			"w-full",
			"min-w-xs",
			"max-w-6xl",
			// Spacing
			!hasLogo && "md:py-4",
			hasLogo && "h-20",
			"md:px-6",
			// Text
			"text-white",
		)}
	>		{/* COMIC PAGE HEADER - FILL */}
		<div
			className={clsx(
				// 
				// Position
				"relative",
				"h-full",
				"z-1",
				// Size
				// Spacing
				"mx-auto",
				// Appearance
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-base-5/50",
				"md:rounded",
				hasLogo ? [
					"bg-transparent",
				] : [
					"bg-neutral-800/80",
					"dark:bg-neutral-900/90",
					"backdrop-blur-xs",
					"border-b-6",
					"border-comic-accent-900",
				],

				hasBanner ? [
					// No Prev Page + Banner
					"drop-shadow-xl",
					"drop-shadow-neutral-900/45",
					"md:bg-transparent",
					"md:backdrop-blur-none",
					"md:border-none",
					"dark:md:bg-transparent",
					"dark:outline-none",
				] : [
					// No Prev Page + No Banner
				]

			)}
		>
			{props.children}
		</div>
	</header>

}

export function ComicPageContentWrapper({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) {
	return <div
		{...props}
		className={clsx(
			className,
		)}
	>


	</div>
}