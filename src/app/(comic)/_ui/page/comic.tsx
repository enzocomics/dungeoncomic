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
import { ClientComicPageContentTitle } from "./client/comic-page-content-title"
import { ClientComicPageNextNav } from "./client/comic-page-next-nav"
import { ClientComicPageNavbar } from "./client/comic-page-navbar"
import { ClientComicPanels } from "./client/comic-page-panels"
import { ClientComicPageFeedback } from "./client/comic-page-feedback"
import ClientComicPageEffects from "./client/comic-page-effects"
import { PageContentWrapper } from "@/app/_ui/site-page"

import { detailedDate, relativeDate } from "@/lib/dayjs"
import StatusMessage from "@/components/status-message"
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
	const lastPage = await getComicPage(page.comic.slug, page.comic.pages_count)
	const hasBanner = !!page.comic.banner
	const hasLogo = !!page.comic.logo

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
	const pageSubtitle = prepareText({
		content: page.subtitle,
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
		<PageContentWrapper>
			<ClientComicPageContentTitle
				pagePanels={page.comic_panels}
				pageTitle={pageTitle}
				pageSubtitle={pageSubtitle}
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
			<ComicPageMeta page={page} />
		</PageContentWrapper>
		<ClientComicPageNavbar
			page={page}
			lastPage={lastPage}
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
	comic,
	className,
	...props
}: {
	comic: Awaited<ReturnType<typeof getComic>>
} & ComponentPropsWithoutRef<"div">) {
	const hasLogo = !!comic.logo
	return <div
		{...props}
		className={clsx(
			className,
			// Structure
			"sticky",
			"pointer-events-auto",
			"top-0",
			"z-10",
			"left-0",
			// Spacing
			// !hasLogo && "md:py-4",
			// hasLogo && "h-20",
			// Text
			"text-white",
		)}
	>
		{props.children}
	</div>

}

const ComicPageMeta = ({
	page,
	...props
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
}) => {
	return <div className={clsx(
		"p-1",
		"w-full",
		"mx-auto",
		"absolute",
		"bottom-0",

	)}>
		<div className={clsx(
			"flex",
			"justify-center",
			"gap-1.5",
			"py-3",
			"px-2",
			"md:px-6",
			"bg-neutral-100/50",
			"dark:bg-neutral-800",
			"text-xs",
			"text-neutral-400",
			"dark:text-neutral-500"
		)}>
			<span>
				Published <time
					dateTime={new Date(page.date_created).toISOString()}
					title={detailedDate(new Date(page.date_created))}
					className={
						clsx(
							"cursor-help"
						)
					}>
					{relativeDate(new Date(page.date_created))}
				</time>
			</span>
			{page.date_updated &&
				<>
					<span>∙</span>
					<span>
						Last updated <time
							dateTime={new Date(page.date_updated).toISOString()}
							title={detailedDate(new Date(page.date_updated))}
							className={
								clsx(
									"cursor-help"
								)
							}>
							{relativeDate(new Date(page.date_updated))}
						</time>
					</span>
				</>
			}
		</div>
	</div>
}