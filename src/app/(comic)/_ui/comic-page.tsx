"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, HTMLElementType, Ref, useActionState, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Form from "next/form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import replaceComicVariables from "../_functions/replace-comic-vars"
// ACTIONS
import { saveUserVars } from "../_actions/variables"
import { deleteUserPlotSuggestion, submitUserPlotSuggestion, voteOnPlotSuggestion } from "../_actions/plot-suggestions"
// UI
import * as Headless from "@headlessui/react"
import { Button, Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions, Field, Fieldset, Label, Legend, Radio, RadioGroup, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
import { useComicContext } from "./context"
import StatusMessage, { useChangeStatus } from "@/components/status-message"
import { ErrorMessage } from "@/components/catalyst/fieldset"
import Link from "next/link"
import Icon from "@/styles/icons"

import { Textarea } from "@/components/textarea"


/**----------------------------------- */
// TYPES
export type ComicPageUIProps = {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	session?: Awaited<ReturnType<typeof verifySession>>
}

/**-----------------------------------
 * Comic Landing Page UI
 * ---
 */
export function ComicLandingPageUI({
	comic
}: {
	comic: Awaited<ReturnType<typeof getComic>>
}) {
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-yellow-500",
		)}>
			This is the Comic Landing Page
		</div>
	</>
}
/**-----------------------------------
 * Comic Page UI
 * ---
 */

export default function ComicPageUI({
	page,
	variables,
	userVariables,
	session
}: ComicPageUIProps) {
	// HOOKS
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const t = useTranslations("ComicPage")
	const setStatus = useChangeStatus("")
	// PRIMARY VARS
	const comic = page.comic

	/**----------------------------------- */
	// Get a list of all the comic panel variables
	// Check if they all exist in the url search params
	// IF they do, then change the UI to the "submitted" version

	// Check if any variables have been defined in the comic project
	const varsExist = page.comic_panels ? (page.comic_panels.flatMap(p => p.variables && p.variables.length > 0)).some(Boolean) : false

	// Get a flat map of all the variables for this specific page's comic panels
	const varParams = page.comic_panels ? page.comic_panels.flatMap(p =>
		p.variables && p.variables.length > 0 ?
			p.variables.map(v => v.slug) : []
	) : null

	// Check the url search params if _every_ variable has been submitted 
	const varsSubmitted = varParams && varParams.length > 0 ? varParams.every((param) => param ? searchParams.has(param) : false) : false

	// Get a list of all the variables the reader has submitted to this page
	const submittedUserVars: Record<string, string | null> = varParams ? Object.fromEntries(
		varParams.map((key) => [key, searchParams.get(key)])
	) : {}

	/**----------------------------------- */
	// Reusable Booleans
	const hasPrevPage = !!(
		page.prev_pages &&
		page.prev_pages.length > 0 &&
		page.prev_pages.some(
			// checks that at least ONE page is published
			p => p.pages_id.status === "published"
		)
		|| varsSubmitted)

	const hasNextPage = !!(
		page.next_pages &&
		page.next_pages.length > 0 &&
		page.next_pages.some(
			// checks that at least ONE page is published
			p => p.linked_pages_id.status === "published"
		)
	)

	const hasBanner = !!page.comic.banner
	const hasAuthors = !!comic.authors && comic.authors.length > 0

	/**----------------------------------- */
	// State that checks if we can go backwards, to the same site, using browser history 
	const [canGoBack, setCanGoBack] = useState(false)

	// State that checks which nav button type has been clicked
	const [navClickType, setNavClickType] = useState<"next" | "prev" | null>(null)

	// Retrieve Context
	const {
		comicPreviousPage, setComicPreviousPage,
		comicPageHistory, setComicPageHistory
	} = useComicContext()


	useEffect(() => {
		//////////////////////////////////////////////////////////////////////
		// TODO: WIP: COMIC PAGE HISTORY
		// CURRENTLY NOT WORKING, LEAVING FOR NOW
		let isHistorySet = false

		if (
			!isHistorySet
			// && !varsSubmitted
			// && `${comicPreviousPage.pagenum}` !== comicPageHistory.at(-1)
		) {
			comicPreviousPage.pagenum !== undefined &&
				setComicPageHistory([...comicPageHistory, `${comicPreviousPage.pagenum}`])
			isHistorySet = true
		}
		//////////////////////////////////////////////////////////////////////

		let prevUrl
		let prevPageMatches
		// Get the PREVIOUS url, including anything with params
		if (comicPreviousPage.pagenum !== undefined) {
			prevUrl = comicPreviousPage.params !== undefined ?
				comicPreviousPage.pagenum + "?" + comicPreviousPage.params :
				comicPreviousPage.pagenum
			// outputs: `1?name=Steve&othervar=value` or just `1`

			// Check if the pagenum exists in the list of this page's "prevpages"
			prevPageMatches = hasPrevPage && page.prev_pages!.some(p =>
				p.pages_id?.comic_pagenum === comicPreviousPage.pagenum
			)

			// Allow the history back button only when the browser's previous page matches a page in the prevpages list
			setCanGoBack(prevPageMatches)
		}

		// Set the current page as the "previous page", this value will be used on the next page update (whenever pathname/searchparams is changed)
		setComicPreviousPage({
			pagenum: page.comic_pagenum,
			params: searchParams.toString() || undefined
		})
		// Clear the status message
		setStatus("")
	}, [pathname, searchParams.toString()])

	/**----------------------------------- */
	// Render
	return <>
		{/* DEBUG */}
		<span
			className={clsx(
				"hidden",
				"fixed",
				"w-full",
				"z-100",
				"bottom-0",
				"bg-green-900/50",
				"backdrop-blur-xl",
				"text-green-500",
				"p-4",
				"font-mono",
			)}>
			<p><strong>prevpage in state:</strong> {comicPreviousPage.pagenum}</p>
			<p><strong>page history:</strong> {comicPageHistory.map(h => `${h}, `)}</p>
		</span>

		{/* COMIC PAGE HEADER - WRAPPER */}
		<header
			className={clsx(
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
				"md:py-4",
				"md:px-6",
				// Text
				"text-white",
			)}
		>
			{/* COMIC PAGE HEADER - FILL */}
			<div
				className={clsx(
					// 
					// Position
					"relative",
					"z-1",
					// Size
					// Spacing
					"mx-auto",
					// Appearance
					"bg-neutral-800/80",
					"dark:bg-neutral-900/80",
					"backdrop-blur-xs",
					"border-b-6",
					"border-comic-accent-900",
					hasPrevPage ? "border-none" : "",
					"md:rounded",
					hasPrevPage ? "md:rounded-b-none" : "",
					!hasPrevPage && "md:drop-shadow-xl",
					!hasPrevPage && "md:drop-shadow-neutral-900/45",
				)}
			>
				<ComicPageHeaderTitle />
			</div>
			<ComicPageNav />
		</header>

		{/* COMIC PAGE - CONTENT WRAPPER */}
		<div
			className={
				clsx(
					"relative",
					"pt-13.5", // Comic Nav Menu
					hasBanner && "pt-20",
					hasPrevPage && "pt-20",
					"md:pt-22.5",
					hasBanner && "md:pt-28",
					hasPrevPage && "md:pt-28",
				)
			}
		>
			{/* COMIC PAGE - CONTENT BODY */}
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
					"bg-base-1",
					"dark:bg-neutral-700",
					"text-center",
					"md:rounded-t",
					"md:last:rounded-b"
				)}
			>
				<ComicPageTitle
					className={clsx(
						"px-6",
						"max-w-prose",
						"mx-auto",
						"text-3xl",
						"font-bold",
						"font-display",
						"text-center"
					)}
				/>

				<ComicPanels />
				<UserFeedbackSection />
				<ComicPageNavigation />
			</article >
			<ComicPageNav where="bottom" />
		</div >
	</>

	/**---------------------------------------------------------------------- */
	// HELPER FUNCTIONS
	function getComicPageVars(
		comic_panels:
			typeof page.comic_panels
	) {
		return comic_panels ? comic_panels.flatMap(p =>
			p.variables && p.variables.length > 0 ?
				p.variables : []
		) : null
	}

	function makeComicVarsUrl({
		comicVars,
		userVars
	}: {
		comicVars: ReturnType<typeof getComicPageVars>
		userVars?: Record<string, string | null>
	}) {
		// Build a URLSearchParams object that handles all the syntax/concatenation automatically
		// - comicVars is possibly null, so have an empty array as fallback
		const entries: [string, string][] = (comicVars ?? []).map(
			({ slug, default_value }): [string, string] => [
				slug,
				userVars?.[slug] ?? default_value
			]
		)

		const params = new URLSearchParams(entries)

		// Return it as a string
		return params.size === 0 ? "" : `?${params.toString()}`
	}

	/**---------------------------------------------------------------------- */
	// TEMPLATE FUNCTIONS

	/**-----------------------------------
		 * SECTION: COMIC PAGE HEADER
		 * ---
		 */

	function ComicPageHeaderTitle() {
		return <>
			<Disclosure>
				<div
					className={clsx(
						"p-2",
						"px-18",
						"h-12",
						"flex",
						"justify-center",
						// "sm:justify-normal",
						"items-center",
						"font-platform-display",
						"overflow-clip",
					)}>
					<DisclosureButton className={clsx(
						"group",
						// Structure
						"relative",
						"flex",
						"max-w-full",
						"justify-center",
						// Spacing
						"z-45",
						"ml-5",
						"pl-3 pr-1.5",
						"py-1.5",
						// Functionality
						"cursor-pointer",
						// Appearance
						"data-open:bg-comic-accent-600",
						"dark:data-open:bg-comic-accent-700",
						"rounded-lg",
						// Hover
						"hover:duration-0",
						"hover:bg-comic-accent-700",
						"active:translate-px",
						"active:bg-comic-accent-900",
						// Transition
						"transition-all",
						"ease-in-out",
						"duration-300",
						// Outline
						"outline-transparent",
						"focus:outline-4",
						"focus:-outline-offset-4",
						"focus:outline-comic-accent-500",

					)}>
						<div className={clsx(
							// Structure
							"inline-block",
							"overflow-hidden",
							"text-nowrap",
							"grow",
							// Text
							"text-sm",
							"text-ellipsis",
						)}>
							<span className={clsx(
								"inline",
								"font-semibold",
							)}>
								{comic.title}
							</span>

							{comic.authors && comic.authors.length > 0 &&
								<span className={clsx(
									"hidden",
									"md:inline-block",
									"px-1",
									"text-xs",
									"text-neutral-500",
									"group-hover:duration-0",
									"group-hover:text-white/40",
									"group-active:text-white/40",
									"group-data-open:text-white/40",
									"font-normal",
									"italic",
									// Transition
									"transition-all",
									"ease-in-out",
									"duration-300",
								)}>
									by&nbsp;
									{comic.authors.map((a, index) => {
										let join = comic.authors!.length > 1 ? ", " : ""
										join = index == comic.authors!.length - 2 ? " & " : join
										join = index == comic.authors!.length - 1 ? "" : join
										return <span key={index}>
											<span className={clsx(
												"font-semibold",
												"text-neutral-400",
												"group-hover:duration-0",
												"group-hover:text-white/70",
												"group-active:text-white/70",
												"group-data-open:text-white/70",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
											)}>
												{a.username}
											</span>
											{join}
										</span>
									}
									)}
								</span>
							}
						</div>

						<span className={clsx(
							"relative",
							"size-5",
							"ml-1",
						)}>
							<Icon name="caretDown" className={clsx(
								"size-5",
								"shrink-0",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								"group-hover:duration-0",
								// Diff
								"opacity-100",
								"text-comic-accent-500",
								"group-hover:text-white",

								"group-data-open:opacity-0",
								"group-data-open:rotate-45",
								// "group-data-open:hidden",
							)} />
							<Icon name="xmark" className={clsx(
								"text-white",
								"size-5",
								"p-0.5",
								"shrink-0",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								//
								"absolute",
								"left-0",
								"top-0",
								"opacity-0",
								"-rotate-45",
								"group-hover:duration-0",
								// Diff
								"group-data-open:group-hover:duration-100",
								"group-data-open:opacity-100",
								"group-data-open:rotate-0",
							)} />
						</span>

					</DisclosureButton>
					<DisclosurePanel transition className={clsx(
						// Transitions
						"transition-all",
						"ease-in-out",
						"data-closed:opacity-0",
						"data-closed:duration-300",
						"data-closed:top-6",
						"data-closed:scale-90",
						"opacity-100",
						"data-open:duration-none",
						"scale-100",
						// Position
						"absolute",
						// "-z-1",
						"top-11.5",
						// Size & Spacing
						"max-w-lg",
						"p-2",
						"rounded-sm",
						// "drop-shadow-2xl",
						// "drop-shadow-neutral-900/10",
					)}>
						<section className={clsx(
							// Functionality
							"pointer-events-auto",
							// Structure
							"relative",
							"flex",
							"flex-col",
							"gap-2",
							// Size
							"w-full",
							// Spacing
							"mx-auto",
							"p-4",
							// Text
							"text-sm",
							"text-base-content",
							// Appearance
							"rounded-sm",
							"md:rounded",
							// Colours
							"bg-base-1",
							"dark:bg-base-2",
							// "border",
							// Arrow
							"before:absolute",
							"before:z-10",
							"before:-top-3",
							"before:left-1/2",
							"before:-translate-x-1/2",
							"before:h-0 before:w-0",
							"before:border-l-12 before:border-r-12",
							"before:border-t-12",
							"before:border-l-transparent before:border-r-transparent",
							"before:border-t-base-1 dark:before:border-t-base-2",
							"before:rotate-180"
						)}>
							{/* Comic Info Header */}
							<header className={clsx(
								"flex",
								"gap-x-2",
							)}>
								{page.comic.thumbnail &&
									<Image
										src={`${directusURL}/assets/${page.comic.thumbnail.filename_disk}`}
										alt={page.comic.thumbnail.description ?? ""}
										width={`${page.comic.thumbnail.width}`}
										height={`${page.comic.thumbnail.height}`}
										className={clsx(
											"self-center",
											"block",
											"max-w-20",
											"md:max-w-30",
											"rounded-sm",
											"mr-1",
										)}
									/>

								}
								<div className={clsx(
									"grow",
									"place-content-center",
									"flex",
									"flex-col",
									"text-center",
								)}>
									<h2 className={clsx(
										"w-full",
										"font-semibold",
										"text-lg",
										"mb-2",
										// "text-center",
										"text-pretty"
									)}>{comic.title}</h2>
									<p className={clsx(
										"italic",
										"text-xs",
										"text-neutral-500",
									)}>
										Created on {comic.date_created}
									</p>
									{hasAuthors &&
										<p className={clsx(
											"italic",
											"text-xs",
											"text-neutral-500",
											"mb-2",
										)}>
											By&nbsp;
											{comic.authors && comic.authors.map((a, index) => {
												let join = comic.authors!.length > 1 ? ", " : ""
												join = index == comic.authors!.length - 2 ? " and " : join
												join = index == comic.authors!.length - 1 ? "" : join
												return <span key={index}>
													<a href="#" className={clsx(
														"font-semibold",
														"text-comic-accent-500",
													)}>
														{a.username}
													</a>
													{join}
												</span>
											}
											)}
										</p>
									}
								</div>
							</header>

							{/* Comic Info Body */}
							<div className={clsx(
							)}>
								{comic.description &&
									<p className={clsx(
										"my-4",

									)}>
										{comic.description}
									</p>
								}
								<p className={clsx(
									"italic",
									"text-xs",
									"text-neutral-500",
									"text-center"
								)}>
									Last updated on {comic.date_updated}
								</p>
							</div>
						</section>
					</DisclosurePanel>
				</div>
			</Disclosure>
		</>
	}

	function ComicPageNav({
		where = "top"
	}: {
		where?: "top" | "bottom"
	}) {
		const isTop = where === "top"
		return <>
			{
				hasPrevPage &&
				<>
					<div className={clsx(
						// "max-w-6xl",
						// "mx-auto",
						"bg-comic-accent-700",
						"dark:bg-comic-accent-900",
						"text-xs",
						"text-white",
						"font-platform-display",
						// "md:rounded-b",
						isTop && "md:drop-shadow-xl",
						isTop && "md:drop-shadow-neutral-900/45",
						!isTop && "sticky",
						!isTop && "bottom-0",
					)}>

						<nav className={clsx(
							"list-none",
							"flex",
							"justify-center"
							// isTop ? "justify-center" : "justify-between",
						)}>
							{/* GO BACK TO START BUTTON */}
							{isTop &&
								<li>
									<Link
										className={clsx(
											"block",
											"flex",
											"items-center",
											"py-2",
											isTop ? "px-3" : "px-1.5",
											// Hover
											"duration-300",
											"hover:bg-comic-accent-950/50",
											"hover:duration-0",
											// Transition
											"transition-all",
											"ease-in-out",
											// Outline
											"outline-transparent",
											"focus:rounded",
											"focus:outline-3",
											"focus:-outline-offset-3",
											"focus:outline-comic-accent-500",
										)}
										onClick={() => { setNavClickType("prev") }}
										href="./1"
									>
										<Icon name="forwardStep" className={clsx(
											"inline-block",
											"h-4",
											"size-3",
											"rotate-180",
											"mr-1",
										)} />

										<span>{t("go-to-start")}</span>

									</Link>
								</li>
							}
							{/* Back Button */}
							{
								hasPrevPage
								&& (
									// Submission Form
									!canGoBack && varsSubmitted
									// Single Previous Page Back
									|| !varsSubmitted && page.prev_pages && page.prev_pages.length == 1
									// Browser History + Multiple Page Back
									|| canGoBack && page.prev_pages && page.prev_pages.length > 1
								)
								&&
								<li>
									<button
										className={clsx(
											"w-full",
											"flex",
											"items-center",
											"p-2",
											"cursor-pointer",
											// Hover
											"duration-300",
											"hover:bg-comic-accent-950/50",
											"hover:duration-0",
											// Transition
											"transition-all",
											"ease-in-out",
											// Outline
											"outline-transparent",
											"focus:rounded",
											"focus:outline-3",
											"focus:-outline-offset-3",
											"focus:outline-comic-accent-500",
										)}

										onClick={() => {
											setNavClickType("prev")

											// Variable Submission Form back
											!canGoBack && varsSubmitted && router.push(pathname)
											// Single Previous Page back
											!varsSubmitted && page.prev_pages && page.prev_pages.length == 1 && router.push(
												`${page.prev_pages[0].pages_id.comic_pagenum}` + makeComicVarsUrl({
													comicVars: getComicPageVars(page.prev_pages[0].pages_id.comic_panels as typeof page.comic_panels),
													userVars: userVariables
												})
											)
											// Browser history +  Multiple prev pages: 
											canGoBack && page.prev_pages && page.prev_pages.length > 1
												// 
												&& router.back()
											//
										}}
									>
										<Icon name="play" className={clsx(
											"inline-block",
											"size-3",
											"rotate-180",
											"mr-1",
										)} />
										<span>{t("go-back")}</span>
										{
											// DEBUG
											// varsSubmitted && "Variable Form Page"
											// !varsSubmitted && page.prev_pages && page.prev_pages.length == 1 && "single prev page back"
											// canGoBack && page.prev_pages && page.prev_pages.length > 1 && "multi prev + browser back"
										}
									</button>
								</li>
							}
							{/* BACK BUTTON: MULTIPLE PREVIOUS PAGES DROPDOWN */}
							{!canGoBack
								&& page.prev_pages && page.prev_pages.length > 1 &&
								<li className={clsx(
									"relative"
								)}>
									<Menu>
										<MenuButton
											className={clsx(
												"group",
												"w-full",
												"flex",
												"items-center",
												"p-2",
												"cursor-pointer",
												// Hover
												"duration-300",
												"hover:bg-comic-accent-950/50",
												"hover:duration-0",
												// Transition
												"transition-all",
												"ease-in-out",
												"bg-transparent",
												"data-closed:duration-300",
												"data-open:bg-comic-accent-950",
												"data-open:duration-none",
												isTop ? [
													"data-open:rounded-t",
												] : [
												]
											)}>
											<Icon name="caretDown" className={clsx(
												"relative",
												"size-4",
												"mr-1",
												// Transition
												"transition-all",
												"ease-in-out",
												"group-data-open:duration-none",
												"group-data-open:-rotate-180",
												"group-data-open:top-0.5",
												"group-data-closed:duration-300",
											)} />
											{t("all-prev-pages")}
										</MenuButton>

										<MenuItems transition className={clsx(
											// Position
											"absolute",
											"z-10",
											"sm:left-0",
											"xs:left-auto",
											// "left-0",
											"flex",
											"flex-col",
											"gap-y-0.5",
											"min-w-46",
											"md:min-w-80",
											// Appearance
											"p-2",
											"bg-comic-accent-950",
											// Transitions
											"transition-all",
											"ease-in-out",
											"scale-100",
											"opacity-100",
											"data-closed:opacity-0",
											"data-closed:duration-300",
											"data-closed:scale-90",
											"data-open:duration-none",
											// TOP VS BOTTOM
											isTop ? [
												"top-8",
												"right-0",
												"rounded-b",
												"data-closed:top-6",
												"drop-shadow-xl",
												"drop-shadow-neutral-900/50",
											] : [
												"bottom-8",
												"left-0",
												"rounded-t",
												"data-closed:bottom-6",
											],
										)}>
											{page.prev_pages.map((n, index) =>
												<MenuItem key={index}
												>
													<Link
														className={clsx(
															// Structure
															"grid",
															"grid-cols-[20px_1fr]",
															"items-center",
															// Appearance
															"p-2",
															"text-white/90",
															"bg-comic-accent-500",
															"visited:text-neutral-300",
															"visited:bg-neutral-500",
															"hover:text-white",
															"hover:bg-comic-accent-900",
															"active:translate-px",
															"rounded-sm",
															// Transition
															"hover:duration-0",
															"transition-all",
															"ease-in-out",
															"duration-300",
														)}
														onClick={() => { setNavClickType("prev") }}
														href={
															`${n.pages_id.comic_pagenum}` + makeComicVarsUrl({
																comicVars: getComicPageVars(n.pages_id.comic_panels as typeof page.comic_panels),
																userVars: userVariables
															})
														}>
														<span>&laquo;</span>
														<span>{n.pages_id.variables_submit_button_text || n.pages_id.title}</span>
													</Link>
												</MenuItem>
											)}
										</MenuItems>
									</Menu>
								</li>
							}
							{/* ARCHIVE COMBOBOX: WIP */}
							<li className={clsx(
								"hidden"
							)}>
								{!isTop &&
									<Combobox>
										<ComboboxButton className={
											clsx(
												"group",
												"relative",
												"flex",
												"items-center",
												"px-2",
												"cursor-pointer",
												"hover:bg-comic-accent-800",
												"data-closed:duration-300",
												"data-open:bg-comic-accent-950",
												"data-open:duration-none",
											)
										}>
											<Icon name="boxArchive" className={
												clsx(
													"absolute",
													"size-4",
													"ml-2",
													"text-comic-accent-800",
													"dark:text-white",
												)
											} />
											<ComboboxInput className={
												clsx(
													"my-1",
													"pl-8",
													"py-2",
													"px-3",
													"h-6",
													"w-36",
													"rounded-sm",
													"bg-white",
													"focus:text-base-content",
													"placeholder:text-comic-accent-800",
													"focus:placeholder:text-current/40",
													"focus:outline-none",
													"dark:bg-black/40",
													"dark:placeholder:text-white"
												)
											}
												placeholder="Archive" />

											<Icon name="caretDown" className={clsx(
												"relative",
												"size-4",
												"ml-1",
												// Transition
												"transition-all",
												"ease-in-out",
												"group-data-open:duration-none",
												"group-data-open:-rotate-180",
												"group-data-open:top-0.5",
												"group-data-closed:duration-300",
											)} />

										</ComboboxButton>


										<ComboboxOptions className={
											clsx(
												"absolute",
												"min-w-46",
												"p-2",
												"bottom-8",
												"right-0",
												"bg-comic-accent-950",
												"rounded-t",
											)
										}>
											<ComboboxOption value="v">
												Pages here
											</ComboboxOption>
										</ComboboxOptions>

									</Combobox>
								}
							</li>

						</nav>
					</div>
				</>
			}
		</>
	}

	/**-----------------------------------
		 * SECTION: COMIC PAGE
		 * ---
		 */

	function ComicPageTitle({
		...props
	}: ComponentPropsWithoutRef<"h1">) {
		return <h1 {...props}>
			{replaceComicVariables({
				content: (
					varsExist && varsSubmitted ?
						page.variables_submit_button_text || `${t("next")} »` :
						page.title
				),
				variables: variables,
				userVariables: userVariables
			})
			}
		</h1>
	}


	/**-----------------------------------
		 * SECTION: COMIC PANELS
		 * ---
		 */

	function ComicPanels() {

		// Get this page's variables
		const pageVars = Object.fromEntries(
			(page.comic_panels ?? []) // Iterate through page panels
				.flatMap((p) => p.variables ?? [])
				.filter(Boolean) // Collect only valid variables
				.map((v) => [v.id, v]) // Convert array to an object keyed by `id`
			/* Outputs:
				[
					{ name: "Variable Name", slug: "variable-name", id: 1, etc}
					{ name: "Another Var Name", slug: "another-var-name", id: 2, etc}
				]
			*/
		)

		// VALIDATION SCHEMA
		const schema = z.object({
			userVars: z.object(
				Object.fromEntries(
					Object.keys(pageVars).map(
						(id) => [
							`var${id}`,
							z.string().max(32)
						]
					)
				)
			) /* Outputs:
					{
						1: z.string(),
						2: z.string()
					}
			*/
		})

		// VALIDATION
		const [lastResult, action] = useActionState(saveUserVars, undefined)

		const [form, fields] = useForm({
			lastResult,
			onValidate({ formData }) {
				return parseWithZod(formData, { schema })
			},
			onSubmit(e, { formData }) {
				// Make a new search params object
				const params = new URLSearchParams()
				// Iterate through the variables and dynamically get each one based on its id
				Object.values(pageVars).forEach(v => {
					const slug = pageVars[v.id].slug
					const value = formData.get(`userVars.var${v.id}`)
					// add each value to the search params object
					if (value !== null) params.set(slug, String(value))
				})

				// build a query string from the params
				const queryString = params.toString()

				// Push the string to the router
				router.push(`?${queryString}`)
			},
			shouldValidate: "onBlur",
			shouldRevalidate: "onInput",
		})
		// Get the fields from the schema
		const userVarsFields = fields.userVars.getFieldset()

		// Variable form inputs ref
		const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

		// TODO: I'm sure there's a way I don't need to have two almost identical objects just to handle state buuuuut if it works, it works
		const savedInputStates =
			Object.fromEntries(
				// Look through the page variables object
				Object.keys(pageVars).map(
					(id) => {
						// If the user variables exist, match the slug to the saved value
						const value = userVariables
							? userVariables[pageVars[id].slug]
							: pageVars[id].default_value
						return [
							id, {
								// Build an obejct with key:value pairs
								slug: pageVars[id].slug,
								value: value,
								value_length: String(value).length ?? 0
							}
						]
					}
				)
			)

		const defaultInputStates =
			Object.fromEntries(
				// Look through the page variables object
				Object.keys(pageVars).map(
					(id) => [
						id, {
							// Build an obejct with key:value pairs
							slug: pageVars[id].slug,
							value: pageVars[id].default_value,
							value_length: pageVars[id].default_value.length
						}
					]
				)
			)
		/* output example: {
			1 (panel id): {
				slug: "dudes-name",
				saved_value: "Blargen"
				default_value: "Steve",
			}
		}	*/
		const [inputStates, setInputStates] = useState(savedInputStates)

		// State of the input fields that lets them "pop in" on reset
		const [areFieldsAnimating, setAreFieldsAnimating] = useState(false)
		const runFieldAnimation = () => {
			setAreFieldsAnimating(false)
			requestAnimationFrame(() => {
				setAreFieldsAnimating(true)
			})
		}

		// RENDER
		return <>
			<VariablesForm
				varsExist={varsExist}
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate
				className={clsx(
					"flex",
					"flex-col",
					"gap-y-0",
				)}
			>
				{page.comic_panels &&
					// PANEL LIST
					<ul className={clsx(
						"flex",
						"flex-col",
						"gap-y-6",
					)}>
						{page.comic_panels.map((p, pIndex) => {

							// Conditionally render comic panels before OR after variables are submitted based on page option
							if (
								(!varsSubmitted && !p.place_after_variables_submitted) ||
								(varsSubmitted && p.place_after_variables_submitted)
							)
								// SINGLE COMIC PANEL
								return <li
									key={pIndex}
									className={clsx(
										"flex",
										"flex-col",
										"gap-y-6",
										"pb-6",
									)}>
									{p.panel_image &&
										<Image
											className={clsx(
												"mx-auto",
											)}
											src={`${directusURL}/assets/${p.panel_image.filename_disk}.${p.panel_image.type}`}
											width={`${p.panel_image.width}`}
											height={`${p.panel_image.height}`}
											alt={`${p.panel_image.description}`}
											loading="eager"
										/>
									}
									{/* PANEL TEXT */}
									<div className={clsx(
										"py-6",
										"px-6",
										"prose",
										"text-base",
										"max-w-prose",
										"mx-auto",

									)}
										// TODO: You better freakin' sanitize this
										dangerouslySetInnerHTML={{
											__html: replaceComicVariables({
												content: p.panel_description,
												variables: variables,
												userVariables: userVariables,
												html: true
											})
										}}
									>
									</div>
									{/* VARIABLES */}
									{p.variables && p.variables.length > 0 ?
										<ComicInputSection>
											{p.variables.map((v, vIndex) =>
												// RENDER
												<Field key={vIndex}>
													<ComicInputSectionRow
														as="label"
														htmlFor={userVarsFields[`var${v.id}`].id}
														className={clsx(
															"cursor-pointer",
															"flex",
															"flex-col",
															"hover:bg-neutral-200/60",
															"dark:hover:bg-neutral-900",
															"outline-transparent",
															"outline-4",
															"focus-within:-outline-offset-4",
															"focus-within:outline-4",
															"focus-within:outline-comic-accent-500",
															// 
															userVarsFields[`var${v.id}`].errors ? [
																"focus-within:outline-red-500",
																"dark:bg-red-500/40",
																"dark:focus-within:bg-red-500/60",
																"dark:outline-red-500/0",
																"dark:focus-within:outline-red-500",
															] : [
																"dark:bg-neutral-800/40",
																"dark:hover:focus-within:bg-comic-accent-800",
																"outline-comic-accent-500/0",
															],

															"dark:hover:bg-comic-accent-500",
															// Transition
															"hover:duration-0",
															"transition-all",
															"ease-in-out",
															"duration-300",
														)}
													>
														<div
															className={clsx(
																"pb-2",
																"text-sm",
																"font-display",
																"flex",
																"items-center",
																"gap-x-1",
															)}
														>
															<span
																className={clsx(
																	"font-semibold",
																)}>
																{v.prompt || `${v.name}`}
															</span>
															{/* Length Checker */}
															<span className={clsx(
																"ml-auto",
																"font-normal",
																"text-xs",
																"text-current/50"
															)}>
																{`${inputStates[v.id].value_length}/32`}{/* TODO: should this be hardcoded? */}

															</span>
														</div>
														{/* INPUT */}
														<div
															className={clsx(
																"group",
																"peer",
																"relative",
																"py-2",
																"px-4",
																"pl-8",
																"w-full",
																"bg-white",
																"text-sm",
																"text-left",
																"font-mono",
																"rounded",
															)}
														>
															<Icon name="chevronRight"
																className={clsx(
																	"absolute",
																	"left-2",
																	"bottom-1/2",
																	"translate-y-1/2",
																	"size-4",
																	userVarsFields[`var${v.id}`].errors ? [
																		"text-red-500",
																	] : [
																		"text-neutral-400",
																		"group-focus-within:text-comic-accent-500",
																	],
																	// Transition
																	"transition-all",
																	"ease-in-out",
																	"duration-300",
																)}
															/>

															{v.value_prefix &&
																<span className={clsx(
																	"inline",
																	"text-neutral-400",
																)}>
																	{v.value_prefix}
																</span>
															}
															{/* Variable Input */}
															<input className={
																clsx(
																	// Structure
																	"inline-block",
																	// Size
																	"min-w-10",
																	"max-w-full",
																	// Appearance
																	(v.value_prefix || v.value_suffix) && "border-b-2",
																	"focus:text-comic-accent-500",
																	"focus:border-b-comic-accent-800",
																	"focus:outline-none",
																	"dark:selection:bg-comic-accent-300",
																	"dark:selection:text-white",
																	"text-black",
																	// ERRORS
																	(v.value_prefix || v.value_suffix)
																		&& userVarsFields[`var${v.id}`].errors ? [
																		"outline-2",
																		"outline-red-500",
																		"-outline-offset-2",
																		"outline-dashed",
																		"rounded",
																		"border-b-transparent",
																		"focus:rounded-none",
																	] : [
																		"border-b-black",
																	],
																	"transition-all",
																	"scale-100",
																	// Animation
																	areFieldsAnimating ? "animate-pop-in" : ""
																)}
																onAnimationEnd={() => setAreFieldsAnimating(false)}
																ref={(i) => {
																	inputRefs.current[vIndex] = i
																}}
																maxLength={32}
																id={userVarsFields[`var${v.id}`].id}
																name={userVarsFields[`var${v.id}`].name}
																type="text"

																value={inputStates[v.id].value}
																size={inputStates[v.id].value_length || 1}
																required
																onChange={(e) => {
																	setInputStates({
																		...inputStates,
																		[v.id]: {
																			...inputStates[v.id],
																			value: e.target.value,
																			value_length: e.target.value.length
																		}
																	})
																}}
															>
															</input>

															{v.value_suffix &&
																<span className={clsx(
																	"inline",
																	"py-2",
																	"pr-4",
																	"text-neutral-400",
																)}>
																	{v.value_suffix}
																</span>
															}
														</div>
														<ComicErrorMessage className={clsx(
															"mt-1",
														)}>
															{userVarsFields[`var${v.id}`].errors}
														</ComicErrorMessage>
													</ComicInputSectionRow>
												</Field>
											)}
										</ComicInputSection>
										: null}
								</li>
						})
						}
					</ul>
				}


				{
					/**------------------------------
					 * SUBMIT BUTTON
					 * ---
					 * - Show ONLY if variables exist BUT they haven't been submitted
					 */
				}
				{(varsExist && !varsSubmitted) &&
					<>
						<div className={clsx(
							"px-6",
							"prose",
							"w-full",
							"max-w-prose",
							"mx-auto",
						)}>
							<ComicButton as="button" type="submit" className={clsx(
							)}>
								<span className={clsx(
									"ml-5",
									"text-pretty",
									"grow",
								)}>
									{`${page.variables_submit_button_text || t("next")}`}
								</span>
								<Icon name="play" className={clsx(
									"ml-1",
									"size-4",
								)} />
							</ComicButton>
							&nbsp;
							<button className={
								clsx(
									"block",
									"mt-3",
									"cursor-pointer",
									"text-sm",
									"float-right",
									"float-end",
									"flex",
									"gap-x-1",
									"items-center",
									"p-1",
									"text-comic-accent-800",
									"dark:text-comic-accent-300/90",
									"hover:text-current/50",
									"hover:duration-0",
									"active:translate-px",
									// Transition
									"transition-all",
									"ease-in-out",
									"duration-300",
									// Outline
									"rounded",
									"outline-transparent",
									"focus:outline-2",
									"focus:outline-offset-1",
									"focus:outline-comic-accent-500",
								)}

								type="button"
								onClick={() => {
									form.reset()
									runFieldAnimation()
									setInputStates(defaultInputStates)
								}

								}>
								<Icon name="rotateLeft"
									className={clsx(
										"size-3",
									)}
								/>
								<span>
									{t("reset-variable-fields")}
								</span>
							</button>
						</div>
						<input type="hidden" name="pageVars" value={JSON.stringify(pageVars)} />
						<input type="hidden" name="comicPage" value={JSON.stringify(page)} />
					</>
				}
			</VariablesForm>
		</>
	}

	// Conditionally render the form if variables exist
	function VariablesForm({
		varsExist,
		children,
		...props
	}: ComponentPropsWithoutRef<"form"> & {
		varsExist: Boolean
		children: React.ReactNode
	}) {
		// Render Form tags if vars exist
		if (varsExist)
			return <Form action="" {...props}>
				{children}
			</Form>
		// Otherwise, render nothing
		else if (!varsExist)
			return children

	}

	function ComicErrorMessage({
		className,
		...props
	}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
		return <ErrorMessage
			{...props}
			className={clsx(
				className,
				"pt-3",
				"pb-2",
				"px-4",
				// Appearance
				"outline-2",
				"outline-red-100",
				"-outline-offset-2",
				"bg-red-100",
				"rounded-sm",
				"dark:outline-none",
				"dark:bg-black/10",
				// Text
				"text-xs",
				"text-red-600",
				"dark:text-white",
			)}>
			{props.children}
		</ErrorMessage>
	}

	function ComicInputSection({
		className,
		...props
	}: ComponentPropsWithoutRef<"section">) {
		return <section
			{...props}
			className={
				clsx(
					className,
					// Structure
					"flex",
					"flex-col",
					"gap-y-2",
					// Spacing
					"px-2",
					"md:px-6",
					// Size
					"w-full",
					"mx-auto",
					"max-w-prose",
				)
			}
		>
			{props.children}
		</section>
	}

	function ComicInputSectionRow({
		as: Tag = "div",
		...props
	}: {
		as?: import("react").ElementType
	} & ComponentPropsWithoutRef<import("react").ElementType>) {
		return <Tag
			{...props}
			className={
				clsx(
					props.className,
					"p-4",
					"rounded",
					"bg-neutral-100",
					"dark:bg-neutral-800/50"
				)
			}
		>
			{props.children}
		</Tag>
	}

	function ComicInputRadio({
		className,
		...props
	}: Headless.RadioProps) {
		return <Radio {...props}
			className={clsx(
				className,
				"cursor-pointer",
				"data-disabled:cursor-not-allowed",
				// Structure & Position
				"group",
				"relative",
				"flex",
				"gap-x-2",
				"items-center",
				// Size & Spacing
				"w-full",
				"p-4",
				// Text
				"font-copy",
				"text-base",
				// Appearance
				"rounded",
				"bg-base-1",
				"dark:bg-base-1/25",
				"opacity-60",
				"data-checked:opacity-100",
				"hover:duration-0",
				"hover:opacity-90",
				"active:translate-px",
				// Transition
				"transition-all",
				"ease-in-out",
				"duration-300",
				"dark:data-checked:bg-comic-accent-800/60",
				"dark:hover:data-checked:bg-comic-accent-800",
				// Outline
				"outline-transparent",
				"focus:outline-4",
				"focus:-outline-offset-4",
				"focus:outline-comic-accent-500",
				"focus-within:outline-4",
				"focus-within:-outline-offset-4",
				"focus-within:outline-comic-accent-500",
				"data-disabled:outline-none",
			)}
		>
			<>
				<div className={
					clsx(
						"shrink-0",
						"relative",
						"size-5",
					)
				}>
					<Icon name="circle"
						className={
							clsx(
								"text-neutral-200",
								"size-5",
								"dark:group-data-checked:text-comic-accent-800",

							)
						}
					/>
					<Icon name="circleCheck"
						className={
							clsx(
								"absolute",
								"left-0",
								"top-1/2",
								"-translate-y-1/2",
								"text-neutral-200",
								"size-5",
								"opacity-0",
								"scale-50",
								"group-data-checked:scale-100",
								"group-data-checked:opacity-100",
								"group-data-checked:text-comic-accent-500",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								"dark:group-data-checked:text-white"
							)
						}
					/>
				</div>
				{props.children}
			</>
		</Radio>
	}

	function ComicButton({
		className,
		...props }:
		| ({
			as?: "button"
		} & ComponentPropsWithoutRef<"button">)
		| ({
			as?: "link"
		} & ComponentPropsWithoutRef<typeof Link>)
	) {
		const classes = clsx(
			className,

			"p-2",
			"w-full",
			"flex",
			"items-center",
			"justify-center",
			// Appearance
			"bg-comic-accent-500",
			"visited:bg-neutral-500",
			"rounded-sm",
			"text-white",
			"text-sm",
			"font-display",
			"font-semibold",
			"cursor-pointer",
			"border-y-2",
			"border-t-white/40",
			"border-b-black/20",
			// States
			"hover:duration-0",
			"hover:bg-comic-accent-700",
			"active:translate-px",
			"active:bg-comic-accent-900",
			// Transition
			"transition-all",
			"ease-in-out",
			"duration-300",
			// Outline
			"outline-transparent",
			"focus:outline-4",
			"focus:outline-offset-4",
			"focus:outline-comic-accent-500",
		)

		// logic here that returns Button or Link conditionally

		if (props.as === "link") {
			const { as, ...linkProps } = props
			return <Link className={classes} {...linkProps}>
				{linkProps.children}
			</Link>
		}
		if (props.as === "button") {
			const { as, ...buttonProps } = props
			return <Button {...buttonProps} className={classes}>
				{props.children}
			</Button>
		}
	}

	/**-----------------------------------
	 * SECTION: COMIC PAGE NAVIGATION (BOTTOM)
	 * ---
	 */

	function ComicPageNavigation() {
		return <>
			<section className={clsx(
				"flex",
				"flex-col",
				"gap-y-6",
			)}>
				{
					/**------------------------------
					 *	NEXT NAVIGATION
					 * ---
					 * - Display IF variables don't exist at all,
					 * - OR if variables exist AND they've been submitted
					 */
				}
				{(!varsExist || (varsExist && varsSubmitted)) &&
					<div className={clsx(
						"flex",
						"flex-col",
						"gap-y-2",
						"px-6",
						"w-full",
						"mx-auto",
						"max-w-prose",
					)}>
						{hasNextPage &&
							<>
								<ul className={clsx(
									"flex",
									"flex-col",
									"gap-2",
								)}>
									{page?.next_pages?.map((n, index) =>
										<li key={index} className={clsx(
										)}>
											<ComicButton as="link"
												onClick={() => { setNavClickType("next") }}
												href={`./${n.linked_pages_id.comic_pagenum}`}
											>
												<span className={clsx(
													"grow",
													"text-pretty",
												)}>
													<span>{
														replaceComicVariables({
															content: n.linked_pages_id.title,
															variables: variables,
															userVariables: userVariables
														})
													}</span><br />
													{n.linked_pages_id.subtitle &&
														<p>{
															replaceComicVariables({
																content: n.linked_pages_id.subtitle,
																variables: variables,
																userVariables: userVariables
															})
														}</p>
													}
												</span>
												<Icon name="play" className={clsx(
													"ml-1",
													"size-4",
												)} />
											</ComicButton>
										</li>
									)}
								</ul>
							</>
						}
					</div>
				}
			</section >
		</>
	}

	/**-----------------------------------
	 * SECTION: USER FEEDBACK
	 * ---
	 */
	function UserFeedbackSection() {
		// Get the ID of the currently logged-in user, if exists
		const loggedInUserID = session != false ? session?.id : null

		/**----------------------------------- */
		// SUGGESTIONS

		// Check if the User ID exists in current suggestions, and get the ID
		const userVotedOn = page.plot_suggestions!.find(
			s => s.users_voted!.some(
				(v: any) => v.id === loggedInUserID
			)
		)

		// State of the previous suggestion the current user voted on
		const [userVotedOnID, setUserVotedOnID] = useState(userVotedOn?.id.toString())

		// State for the Plot Suggestion Poll
		// Default value: the ID of the suggestion the logged-in user has already voted on
		const [selected, setSelected] = useState<string>(
			userVotedOnID ? userVotedOnID : ""
		)
		// State of the poll: to prevent the effect from firing multiple times
		const [clicked, setClicked] = useState(false)

		// Poll Click Handler
		function handleClick(selectedId: string) {
			setSelected(selectedId)
			setClicked(true)
		}

		// Value of radio button that opens up the user suggestion form
		const selectUserSuggestion = "0"

		// This effect runs every time the poll's radio button selection is changed
		useEffect(() => {
			// Send the vote to the CMS
			const castVote = async (plotSuggestionsID: string) => {
				voteOnPlotSuggestion({
					newVoteID: parseInt(plotSuggestionsID),
					page: page,
					user: session ? session : false
				})
			}

			// Cast the vote
			if (clicked == true) {
				castVote(selected) // Send the vote to the cms
				setUserVotedOnID(selected) // Save the suggestion this user voted on for refernece
				setClicked(false)
			}
		}, [selected])

		/**----------------------------------- */
		// SUBMITTED SUGGESTIONS

		// Check if the user has submitted anything yet
		const userSubmission = page.plot_suggestions!.find(
			s => s.user_created.id === loggedInUserID
		)

		// Don't allow submissions if they have already submitted one (also if they're the author, they can just edit it in the dashboard)
		const [userHasSubmitted, setUserHasSubmitted] = useState(userSubmission ? true : false)

		// DEBUG: uncomment me
		// const [userHasSubmitted, setUserHasSubmitted] = useState(false)

		const [deleteSuggestion, setDeleteSuggestion] = useState<number | null>(null)

		// User Suggestion Textarea Ref
		const suggestionRef = useRef<HTMLTextAreaElement | null>(null)

		/**----------------------------------- */
		// Render
		return <>
			{
				/**------------------------------
				 * FEEDBACK
				 * -
				 */
			}
			{(varsExist && varsSubmitted || !varsExist) && page.plot_prompt &&
				<ComicInputSection>
					<ComicInputSectionRow>
						{!session &&
							<div
								className={clsx(
									"text-2xl"
								)}>
								{t.rich("please-login-to-vote", {
									loginLink: (chunks) => <Link href="/login">{chunks}</Link>
								})}
							</div>
						}
						<Fieldset
							disabled={session ? false : true}>
							<Legend as="legend" className={
								clsx(
									"pb-4",
									"text-",
									"font-display",
									"font-semibold",
								)
							}>
								{replaceComicVariables({
									content: page.plot_prompt,
									variables: variables,
									userVariables: userVariables
								})}
							</Legend>
							<RadioGroup
								name="suggestions"
								value={selected}
								onChange={(selected) => handleClick(selected)}
								className={clsx(
									"flex",
									"flex-col",
									"gap-y-2",
								)}>
								{/* PLOT SUGGESTIONS */}
								{page.plot_suggestions ? page.plot_suggestions.map((s, index) => {
									// Handle State of the vote numbers
									const [votes, setVote] = useState(s.votes || 0)

									useEffect(() => {
										// Update the vote numbers on-the-fly
										if (clicked == true) {
											// +1 to the vote that is selected
											if (selected == `${s.id}`)
												setVote(votes + 1)
											// -1 to the vote the user previously voted on
											if (userVotedOnID == `${s.id}`)
												setVote(votes - 1)
										}
									}, [selected])

									// RENDER
									if (deleteSuggestion !== s.id)
										return <ComicInputRadio
											value={`${s.id}`}
											key={index}
										>
											<Label className={
												clsx(
													"grow",
													"text-left",
												)
											}
											>
												{/* SEPARATE AUTHOR SUGGESTIONS FROM USER SUGGESTIONS */}
												{page.user_created.id !== s.user_created.id &&
													<div className={clsx(

														"flex",
														"text-sm",
														"mt-1",
														"cursor-auto",
														"gap-x-4",
													)}>
														<em className={clsx(
															"text-neutral-400",
															"dark:text-white/70",
														)}>
															@{s.user_created.username} says:
														</em>

														{(session !== false && session !== undefined) && s.user_created.id == session.id &&
															<span className={clsx(
																"absolute",
																"-top-1",
																"-right-1",
																"flex",
																"ml-auto",
																"gap-x-1",
															)}>
																{/* <button
																	title={t("edit-suggestion")}
																	className={clsx(
																		"px-1",
																		"bg-neutral-400",
																		"text-white",
																		"rounded-sm",
																		"cursor-pointer",
																	)}>
																	<Icon name="penToSquare" className={clsx(
																		"size-4",
																	)} />
																</button> */}
																<button
																	title={t("delete-suggestion")}
																	className={clsx(
																		"p-1",
																		"bg-red-400",
																		"text-white",
																		"rounded-sm",
																		"cursor-pointer",
																	)}
																	onClick={async () => {
																		deleteUserPlotSuggestion(s.id)
																		setDeleteSuggestion(s.id)
																		setUserHasSubmitted(false)
																		setStatus("success", t("suggestion-deleted"))
																		router.refresh()
																	}}
																>
																	<Icon name="xmark" className={clsx(
																		"size-4",
																	)} />
																</button>
															</span>
														}
													</div>
												}

												<div className={clsx(
													"cursor-auto"
												)}>
													{replaceComicVariables({
														content: s.title,
														variables: variables,
														userVariables: userVariables
													})}
												</div>

											</Label>
											<div className={
												clsx(
													"px-2",
													"self-stretch",
													"content-center",
													"bg-neutral-100",
													"rounded",
													"font-mono",
													"dark:bg-neutral-900/40",
													"min-w-12",
												)
											}>
												{votes}
											</div>
										</ComicInputRadio>
								}) : null}
								{/* 
								SUBMIT OWN SUGGESTION
								- Only display this radio button if the user hasn't already submitted something
								- When it's selected, display the suggestion form
						*/}
								{page.allow_user_suggestions &&
									!userHasSubmitted &&
									<ComicInputRadio
										value={selectUserSuggestion}
										className={clsx(
											"text-left",
											"mx-auto",
										)}>
										{/* <Radio value={selectUserSuggestion} /> */}
										<Label className={
											clsx(
												"grow",
												"font-copy",
											)
										}>
											{t("submit-own-suggestion")}
											{page.allow_user_suggestions && selected == selectUserSuggestion &&
												<UserSuggestionForm ref={suggestionRef} />
											}
										</Label>
										<Icon name="penToSquare" className={
											clsx(
												"size-5",
												"mr-3.5",
												"group-data-checked:hidden"
											)
										} />
									</ComicInputRadio>
								}
							</RadioGroup>

						</Fieldset>

						<StatusMessage className={
							clsx(
								"mt-2"
							)
						} />
					</ComicInputSectionRow>
				</ComicInputSection>
			}
		</>

		/**----------------------------------- */

		function UserSuggestionForm(props: ComponentPropsWithRef<"textarea">) {
			// VALIDATION
			const [lastResult, action] = useActionState(submitUserPlotSuggestion, undefined)
			const [form, fields] = useForm({
				// Sync the result with the last su8bmission
				lastResult,

				// Reuse the validation logic on the client
				onValidate({ formData }) {
					return parseWithZod(formData, { schema: userSuggestionSchema() })
				},

				// Validate the form on blur event triggered
				shouldValidate: "onBlur",
				shouldRevalidate: "onInput",
			})

			// EFFECT: on submit
			useEffect(() => {
				if (lastResult?.status == "success") {
					setSelected("")
					setUserHasSubmitted(true)
					setStatus("success", t("suggestion-submitted"))
					router.refresh()
				}
			}, [lastResult])

			// props.ref ? props.ref.current?.focus() : null

			// Textarea length checker
			const [inputLength, setInputLength] = useState(0)

			function handleTextarea(e: React.ChangeEvent<HTMLTextAreaElement>) {
				const textarea = e.target

				// Reset height first so it cqn shrink when text is deleted
				textarea.style.height = "auto"

				// Expand the height to fit the content
				textarea.style.height = `${textarea.scrollHeight + 4}px`
			}

			// Render
			return <>
				{session &&
					<Form className={
						clsx(
							"mt-2",
							"animate-fade-in"
						)
					}
						id={form.id}
						onSubmit={form.onSubmit}
						action={action}
						noValidate
						onAnimationEnd={() => suggestionRef.current?.focus()}
					>
						<Field className={clsx(
							"relative",
						)}>
							{/* Length Checker */}
							<span className={clsx(
								"absolute",
								"-top-6.5",
								"right-0",
								"ml-auto",
								"font-display",
								"font-normal",
								"text-xs",
								"text-current/50"
							)}>
								{`${inputLength}/140`}{/* TODO: should this be hardcoded? */}

							</span>
							<Textarea ref={props.ref} className={
								clsx(
									"bg-white",
									"text-black",
									"border-2",
									"border-neutral-200",
									"dark:border-white",
									"rounded",
									"w-full",
									"p-2",
									"font-mono",
									"font-base",
									"resize-none",
									"outline-none",
								)
							}
								rows={1}
								id={fields.userSuggestion.name}
								name={fields.userSuggestion.name}
								key={fields.userSuggestion.key}
								onChange={(e) => {
									setInputLength(e.target.value.length)
									handleTextarea(e)
								}}
								// Something inside headless.ui's RadioGroup thing is causing spacebar input to not be accepted
								// [Source]](https://github.com/tailwindlabs/headlessui/discussions/1798)
								onKeyDown={
									(e) => (e.key == " " || e.code == "Space" || e.keyCode == 32) && e.stopPropagation()
								}
								maxLength={140} // TODO: should this be hardcoded?
							/>
							<ComicErrorMessage className={clsx(
								"mb-2",
								"text-center",
							)}>
								{fields.userSuggestion.errors}
							</ComicErrorMessage>

							<input
								name={fields.pageId.name}
								key={fields.pageId.key}
								type="hidden"
								value={page.id.toString()}
							/>
							<input
								name={fields.slug.name}
								key={fields.slug.key}
								type="hidden"
								value={`p=${page.id}&u=${session.id}`}
							/>
							<input
								name={fields.userId.name}
								key={fields.userId.key}
								type="hidden"
								value={session.id}
							/>
						</Field>
						<ComicButton as="button" type="submit">{t("submit-suggestion")}</ComicButton>
					</Form>
				}
			</>
		} // EO UserSuggestionForm()
		/**----------------------------------- */
	}

}