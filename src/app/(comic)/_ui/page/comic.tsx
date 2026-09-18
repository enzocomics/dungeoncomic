/**----------------------------------- */
import clsx from "clsx"
// LIBRARIES
import React, { ComponentPropsWithoutRef } from "react"
import { getTranslations } from "next-intl/server"
// DATA
import { prepareText } from "../../_functions/parse-content"
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
// UI
import { ClientComicPageHeaderTitle } from "./client/comic-page-header-title"
import { ClientComicPageContentTitle } from "./client/comic-page-content-title"
import { ClientComicPageNextNav } from "./client/comic-page-next-nav"
import { ClientComicPageNavbar } from "./client/comic-page-navbar"
import { ClientComicPanels } from "./client/comic-page-panels"
import { ClientComicPageFeedback } from "./client/comic-page-feedback"
import ClientComicPageEffects from "./client/comic-page-effects"

/**-----------------------------------
 * Comic Page UI
 * ---
 */

export default async function ComicPageUI({
	page,
	variables,
	userVariables,
	session,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	session?: Awaited<ReturnType<typeof verifySession>>
	children?: React.ReactNode
	header?: React.ReactNode
}) {
	// COMIC VARS
	const t = await getTranslations("ComicPage")
	const comic = page.comic
	const hasBanner = !!comic.banner
	const hasLogo = !!comic.logo
	const hasAuthors = !!comic.authors && comic.authors.length > 0

	// PARSE & SANITIZE CONTENT
	const comicDescription = prepareText({
		content: comic.description,
		variables: variables,
		userVariables: userVariables,
		parseMarked: true,
		varHtml: true
	})
	const pageTitle = prepareText({
		content: page.title,
		variables: variables,
		userVariables: userVariables,
		parseMarked: false,
		varHtml: true
	})
	const pageSubmitText = prepareText({
		content: page.variables_submit_button_text,
		variables: variables,
		userVariables: userVariables,
		parseMarked: false,
		varHtml: true
	})
	const nextPageTitles = page?.next_pages?.map((n, index) => {
		return prepareText({
			content: n.linked_pages_id.title,
			variables: variables,
			userVariables: userVariables,
			parseMarked: false,
			varHtml: false
		})
	})
	const nextPageSubtitles = page?.next_pages?.map((n, index) => {
		return prepareText({
			content: n.linked_pages_id.subtitle,
			variables: variables,
			userVariables: userVariables,
			parseMarked: false,
			varHtml: false
		})
	})
	const panelDescriptions = page?.comic_panels?.map((p, index) => {
		return prepareText({
			content: p.panel_description,
			variables: variables,
			userVariables: userVariables,
			parseMarked: true,
			varHtml: true

		})
	})

	// RENDER
	return <>
		<ClientComicPageEffects page={page} />
		<ComicPageHeader page={page} >
			<ClientComicPageHeaderTitle
				page={page}
				comicDescription={comicDescription}
			/>
		</ComicPageHeader>
		<ComicPageContentWrapper page={page}>
			<ClientComicPageContentTitle
				pagePanels={page.comic_panels}
				pageTitle={pageTitle}
				pageSubmitText={pageSubmitText}
			/>
			<ClientComicPanels
				page={page}
				userVariables={userVariables}
				variables={variables}
				panelDescriptions={panelDescriptions}
			/>
			<ClientComicPageNextNav
				page={page}
				nextPageTitles={nextPageTitles}
				nextPageSubtitles={nextPageSubtitles}
			/>
			<ClientComicPageFeedback
				page={page}
				variables={variables}
				userVariables={userVariables}
				session={session}
			/>
		</ComicPageContentWrapper>
		<ClientComicPageNavbar
			where="bottom"
			page={page}
			userVariables={userVariables}
		/>
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
	page,
	className,
	...props
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
} & ComponentPropsWithoutRef<"div">) {
	const hasBanner = !!page.comic.banner
	const hasLogo = !!page.comic.logo
	return <div
		{...props}
		className={clsx(
			className, "relative",
			hasBanner ? [
				// Banner
				"pt-22",
			] : [
				// No Banner
				hasLogo
					? "pt-22"
					: "pt-14",
				"md:pt-22",
			],
		)}
	>
		<article
			className={clsx(
				// Structure
				"flex",
				"flex-col",
				"gap-6",
				// Spacing
				"pt-6",
				"pb-18",
				// Appearance
				"md:rounded",
				// Colours
				"bg-base-1",
				"dark:bg-base-2",
				"dark:shadow-none",
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-base-5/50",
			)}
		>

			{props.children}
		</article>
	</div>
}