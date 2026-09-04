"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import React, { useActionState, useEffect, useState } from "react"
import Image from "next/image"
import Form from "next/form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import replaceComicVariables from "../_functions/replace-comic-vars"
// CONTEXT
import { useComicContext } from "./context"
// ACTIONS
import { saveUserVarsCookie } from "../_actions/cookies"
import { deleteUserPlotSuggestion, submitUserPlotSuggestion, voteOnPlotSuggestion } from "../_actions/plot-suggestions"
// UI
import StatusMessage, { useChangeStatus } from "@/components/status-message"
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "@/components/dropdown"
import { Radio, RadioField, RadioGroup } from "@/components/radio"
import { ErrorMessage, Field, Fieldset, Label, Legend } from "@/components/fieldset"
import { Link } from "@/components/link"
import { Textarea } from "@/components/textarea"
import { Button } from "@headlessui/react"
import Icon from "@/styles/icons"
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"

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
	// VARIABLES
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()
	const t = useTranslations("ComicPage")
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
	// Submit the User Variables
	useEffect(() => {

		// Check if variables have been submitted to this page and save them to cookie
		const saveUserVariables = async () => {
			// Save Variables if they have been submitted
			if (varsSubmitted) {
				// if vars already exist, put them together so they don't get overwritten
				await saveUserVarsCookie({
					vars: {
						...userVariables,
						...submittedUserVars
					},
					page: page
				})
			}
		}
		saveUserVariables()
	}, [pathname, searchParams.toString()])

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

	const [thing, setThing] = useState<any>()

	useEffect(() => {

		// Set the current page as the "previous page", this value will be used on the next page update (whenever pathname/searchparams is changed)
		// LEAVE THIS AT THE VERY BOTTOM, it shoudl happen LAST
		setComicPreviousPage({
			pagenum: page.comic_pagenum,
			params: searchParams.toString() || undefined
		})

		let isHistorySet = false

		if (
			!isHistorySet
			// && !varsSubmitted
			&& `${comicPreviousPage.pagenum}` !== comicPageHistory.at(-1)
		) {
			setComicPageHistory([...comicPageHistory, `${comicPreviousPage.pagenum}`])
			isHistorySet = true
		}

		/* --------- */

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


	}, [pathname, searchParams.toString()])


	// useEffect(() => {
	// 	if (
	// 		navClickType == "prev" &&
	// 		!(comicPageHistory.at(-1) == comicPreviousPage.pagenum)
	// 	) {
	// 		// only delete from history if it's the same
	// 		// if (comicPreviousPage.pagenum == comicPageHistory.at(-1))
	// 		// setComicPageHistory([...comicPageHistory.slice(0, 1)])
	// 		// setComicPageHistory([...comicPageHistory.slice(0, -1), `${comicPreviousPage.pagenum}`])
	// 	}
	// 	// Add to history
	// 	else if (
	// 		navClickType == "next" &&
	// 		// Don't add to history if it repeats
	// 		!(comicPageHistory.at(-1) == comicPreviousPage.pagenum)
	// 	) {
	// 		setComicPageHistory([...comicPageHistory, `${comicPreviousPage.pagenum}`])
	// 	}
	// 	// setComicPageHistory([...comicPageHistory, `${comicPreviousPage.pagenum}`])

	// }, [navClickType])
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

		{/* Header */}
		<div
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
			<div
				className={clsx(
					// The "filled/backdrop" part of the header
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
				)}>
				{/* Title Card */}
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
							"peer",
							"flex",
							"max-w-full",
							"justify-center",
							"cursor-pointer",
							"data-open:bg-comic-accent-600",
							"dark:data-open:bg-comic-accent-700",

							"pl-3 pr-1.5",
							"py-1.5",
							"rounded-lg",

							"ml-5",
							"relative",
							"z-45",
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
								<h1 className={clsx(
									"inline",
									"font-semibold",
								)}>
									{comic.title}
								</h1>

								{comic.authors && comic.authors.length > 0 &&
									<span className={clsx(
										"hidden",
										"md:inline-block",
										"px-1",
										"text-xs",
										"text-neutral-500",
										"group-data-open:text-white/40",
										"font-normal",
										"italic",
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
													"group-data-open:text-white/70",
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

							<Icon name="caretDown" className="text-comic-accent-500 size-5 ml-1 group-data-open:hidden shrink-0" />
							<Icon name="xmark" className="text-white size-5 p-0.5 ml-1 hidden group-data-open:inline shrink-0" />

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
							"rounded",
							"drop-shadow-2xl",
							"drop-shadow-neutral-900/50",
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
								"rounded",
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
												"rounded",
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
											"peer-visible:ml-5",
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
				{
					/**------------------------------
					 * PREV NAVIGATION
					 * - Instead of linking directly to the previous page,
					 *   we are going back 1 step in browser history
					 * - This is because pages can have multiple `prev_pages`
					 */
				}

			</div >
			{
				hasPrevPage &&
				<>
					<div className={clsx(
						// "max-w-6xl",
						// "mx-auto",
						"bg-comic-accent-700",
						"dark:bg-comic-accent-900",
						"text-xs",
						"md:rounded-b",
						"md:drop-shadow-xl",
						"md:drop-shadow-neutral-900/45",
					)}>

						<nav className={clsx(
							"list-none",
							"flex",
							"justify-center",
							"gap-2",
						)}>
							<li>
								<Link
									className={clsx(
										"block",
										"flex",
										"items-center",
										"p-2",
										"hover:bg-black/10",
									)}

									onClick={() => { setNavClickType("prev") }}
									href="./1"
								>
									<Icon name="forwardStep" className={clsx(
										"inline-block",
										"size-3",
										"rotate-180",
										"mr-1",
									)} />
									<span>{t("go-to-start")}</span>
								</Link>
							</li>

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
											"hover:bg-black/10",
											"cursor-pointer"
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
											// varsSubmitted && "Variable Form Page"
											!varsSubmitted && page.prev_pages && page.prev_pages.length == 1 && "single prev page back"
											// canGoBack && page.prev_pages && page.prev_pages.length > 1 && "multi prev + browser back"
										}
									</button>
								</li>
							}
							{!canGoBack
								&& page.prev_pages && page.prev_pages.length > 1 &&
								<li className={clsx(
									"relative"
								)}>
									<Menu>
										<MenuButton
											className={clsx(
												"w-full",
												"flex",
												"items-center",
												"p-2",
												"hover:bg-black/10",
												"cursor-pointer"
											)}>
											Previous Pages Dropdown
										</MenuButton>

										<MenuItems className={clsx(
											"absolute",
											"z-10",
											"top-10"
										)}>
											{page.prev_pages.map((n, index) =>
												<MenuItem key={index}
												>
													<a className="block" onClick={() => { setNavClickType("prev") }}
														href={
															`${n.pages_id.comic_pagenum}` + makeComicVarsUrl({
																comicVars: getComicPageVars(n.pages_id.comic_panels as typeof page.comic_panels),
																userVars: userVariables
															})
														}>
														{/* <Link className={clsx(
															"block",
															"p-2",
															"hover:bg-black/10",
														)} href={`${n.pages_id.comic_pagenum}`}> */}
														<strong>&laquo; {n.pages_id.variables_submit_button_text || n.pages_id.title}</strong>
														{/* </Link> */}
													</a>
												</MenuItem>
											)}
										</MenuItems>
									</Menu>
								</li>
							}




							{/* 
										Back button:
										- If there is no previous page from the same hostname in history, and:
										- If THIS PAGE has submitted variables:
											- GO BACK to the "pre-submitted" version of THIS PAGE
									*/}
							{/* {(!canGoBack && varsSubmitted) && */}
							{/* {(varsSubmitted) &&
								<li className="hidden">
									<Link className={clsx(
										"block",
										"p-2",
										"hover:bg-black/10",
									)}
										onClick={() => { setNavClickType("prev") }}
										href={pathname}>&laquo; {t("go-back")} (Variable Form Page)</Link>
								</li>
							} */}
							{/* 
										Back button: 
										- If there is no previous page from the same hostname in history,
										- If there are no variables being submitted on THIS page,
										- If the previous page has variable:
										  - If user variables already exist, rebuild the previous page url with the userVars
											- If user variables do not exist, build the previouspage url with the default vars
									*/}
							{/* {(
								// canGoBack && !varsSubmitted &&
								!varsSubmitted &&
								page.prev_pages && page.prev_pages.length == 1
							) &&
								<li className="hidden">
									<Link className={clsx(
										"block",
										"p-2",
										"hover:bg-black/10",
									)}
										onClick={() => { setNavClickType("prev") }}
										href={`${page.prev_pages[0].pages_id.comic_pagenum}` + makeComicVarsUrl({
											comicVars: getComicPageVars(page.prev_pages[0].pages_id.comic_panels as typeof page.comic_panels),
											userVars: userVariables
										})}
									>&laquo; {t("go-back")} (Single Previous Page)</Link>

								</li>
							} */}
							{/* <li>{getComicPageVars(page.prev_pages[0].pages_id.comic_panels as typeof page.comic_panels)}</li> */}
							{/* 
										Display list of previous pages if there's more than one, OR if the user's "previous page" in the browser history is NOT a possible previous page in this comic series
									*/}

							{/* 
										Back button: Go back 1 step in user's browser history
										- IF the browser's previousPage (saved in state) is on the list of prev pages
									*/}
							{/* {
								// canGoBack &&
								canGoBack &&
								page.prev_pages && page.prev_pages.length > 1 &&
								<li>
									<button className={clsx(
										"hidden",
										"w-full",
										"flex",
										"items-center",
										"p-2",
										"hover:bg-black/10",
										"cursor-pointer"
									)} onClick={() => {
										router.back()
										setNavClickType("prev")
									}} >
										<Icon name="play" className={clsx(
											"inline-block",
											"size-3",
											"rotate-180",
											"mr-1",
										)} />
										<span>{t("go-back")}</span>
									</button>
								</li>
							} */}
							{/* {
								!canGoBack &&
								page.prev_pages && page.prev_pages.length > 1 &&
								<Dropdown>
									<DropdownButton outline>
										<Icon name="play" className={clsx(
											"text-white",
											"inline-block",
											"size-3",
											"rotate-180",
											"mr-1",
										)} />
										<span className="text-white text-xs">
											{t("go-back")}
										</span>
									</DropdownButton>
									<DropdownMenu>
										{page.prev_pages.map((n, index) =>
											<DropdownItem key={index}
												onClick={() => { setNavClickType("prev") }}
												href={
													`${n.pages_id.comic_pagenum}` + makeComicVarsUrl({
														comicVars: getComicPageVars(n.pages_id.comic_panels as typeof page.comic_panels),
														userVars: userVariables
													})
												}>
												<Link className={clsx(
															"block",
															"p-2",
															"hover:bg-black/10",
														)} href={`${n.pages_id.comic_pagenum}`}>
												<strong>&laquo; {n.pages_id.variables_submit_button_text || n.pages_id.title}</strong>
												</Link>
											</DropdownItem>
										)}
									</DropdownMenu>
								</Dropdown>
							} */}
						</nav>
					</div>
				</>
			}
		</div >
		{/* eo Header */}

		{/* Main Body */}
		< div className={
			clsx(
				// Comic Nav Menu
				"pt-13.5",
				hasBanner && "pt-20",
				hasPrevPage && "pt-20",
				"md:pt-22.5",
				hasBanner && "md:pt-28",
				hasPrevPage && "md:pt-28",
			)
		} >
			{/* CONTENT */}
			< div className={
				clsx(
					"flex",
					"flex-col",

					"bg-base-1",
					"dark:bg-neutral-700",
					"text-center",

					"md:rounded",
				)
			} >
				<h4 className={clsx(
					"py-6",
					"text-2xl",
					"font-semibold",
					"font-display",
					"text-center"
				)}>
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
				</h4>
				{/* <p>{page.description}</p> */}
				{
					/**------------------------------
					 *	DISPLAY THE COMIC PANELS
					 * ---
					 * - Do not show if variables have been submitted correctly
					 */
				}
				<VariablesForm varsExist={varsExist}>
					{page.comic_panels ? page.comic_panels.map((p, index) => {
						// Conditionally render comic panels before OR after variables are submitted based on page option
						if (
							(!varsSubmitted && !p.place_after_variables_submitted) ||
							(varsSubmitted && p.place_after_variables_submitted)
						)
							// Render
							return <div key={index}>
								{p.panel_image &&
									<p><Image
										className={clsx(
											"mx-auto",
										)}
										src={`${directusURL}/assets/${p.panel_image.filename_disk}.${p.panel_image.type}`}
										width={`${p.panel_image.width}`}
										height={`${p.panel_image.height}`}
										alt={`${p.panel_image.description}`}
										loading="eager"
									/></p>
								}
								{/* <p>{p.panel_title}</p> */}
								<div className={clsx(
									"mt-4",
									"prose"
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
									<section className={clsx(
										"bg-comic-accent-100",
										"dark:bg-comic-accent-900",
										"p-2",
										"w-2/3",
										"mx-auto",
										"mt-8",
									)}>
										<section>
											{p.variables.map((v, index) => {
												return <div key={index}>
													<p className={clsx(
														"text-center"
													)}><label>{v.prompt || v.name}</label></p>
													<p>&gt; <input className={clsx(
														"p-2",
														"bg-white",
														"text-black",
														"w-9/10",
													)} type="text" name={v.slug} defaultValue={
														userVariables && userVariables[v.slug] ? userVariables[v.slug] as string : v.default_value

													} required></input></p>
												</div>
											})}
										</section>
									</section>
									: null}
							</div>
					}) : null}

					{
						/**------------------------------
						 * SUBMIT BUTTON
						 * ---
						 * - Show ONLY if variables exist BUT they haven't been submitted
						 */
					}
					{(varsExist && !varsSubmitted) &&
						<div className={clsx(
							"flex",
							"flex-col",
							"w-2/3",
							"mx-auto",
							"mt-8",
							"gap-2",
							"p-2",
							"bg-comic-accent-100",
							"dark:bg-comic-accent-900",
							"text-xs"
						)}>
							<button className={clsx(
								"block",
								"p-2",
								"hover:bg-black/10",
								"cursor-pointer"
							)}>{`${page.variables_submit_button_text || t("next")} »`}</button>
						</div>
					}
				</VariablesForm>

				{
					(varsExist && varsSubmitted || !varsExist) && page.plot_prompt &&
					<UserFeedbackSection />
				}
				{
					/**------------------------------
					 * NAVIGATION BLOCK
					 * -
					 */
				}
				<section className={clsx(
					"mt-8",
					"flex",
					"flex-col",
					"gap-8",
					"w-full"
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
							"mx-auto",
							"w-2/3",
						)}>
							{hasNextPage &&
								<>
									<ul className={clsx(
										"flex",
										"flex-col",
										"gap-2",
										"p-2",
										"bg-comic-accent-100",
										"dark:bg-comic-accent-900",
										"text-xs"
									)}>
										{page?.next_pages?.map((n, index) =>
											<li key={index} className={clsx(
											)}>
												<Link className={clsx(
													"block",
													"p-2",
													"hover:bg-black/10",
												)}
													onClick={() => { setNavClickType("next") }}
													href={`./${n.linked_pages_id.comic_pagenum}`}>
													<strong>{
														replaceComicVariables({
															content: n.linked_pages_id.title,
															variables: variables,
															userVariables: userVariables
														})
													} &raquo;</strong><br />
													{n.linked_pages_id.subtitle &&
														<p>{
															replaceComicVariables({
																content: n.linked_pages_id.subtitle,
																variables: variables,
																userVariables: userVariables
															})
														}</p>
													}
												</Link>
											</li>
										)}
									</ul>
								</>
							}
						</div>
					}



				</section >

				{
					/**------------------------------
					 *	Page Meta
					 */
				}
				<section>
					<h4 className={clsx(
						"font-semibold"
					)}>Page Metadata</h4>
					<ul className={clsx(
						"p-2",
						"bg-comic-accent-100",
						"dark:bg-comic-accent-900",
						"text-xs"
					)}>
						<li><strong>Created by</strong> @{page.user_created.username ? page.user_created.username : ""} on {page.date_created}</li>
						{page.user_updated &&
							<li><strong>Last updated by</strong> @{page.user_updated.username} on {page.date_updated}</li>
						}
					</ul>
				</section >

			</div >
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
	// LAYOUT FUNCTIONS

	/**-----------------------------------
	 * Conditionally Render the Form depending on if variables exist
	 * ---
	 */
	function VariablesForm({
		varsExist,
		children
	}: {
		varsExist: Boolean
		children: React.ReactNode
	}) {
		// Render Form tags if vars exist
		if (varsExist)
			return <Form action="">
				{children}
			</Form>
		// Otherwise, render nothing
		else if (!varsExist)
			return children

	}

	/**-----------------------------------
	 * User Feedback Section
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

			// Handle the form
			if (selected == selectUserSuggestion) {
				console.log("handle the form")
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

		const setStatus = useChangeStatus("")

		// Check if the user has submitted anything yet
		const userSubmission = page.plot_suggestions!.find(
			s => s.user_created.id === loggedInUserID
		)

		// Don't allow submissions if they have already submitted one (also if they're the author, they can just edit it in the dashboard)
		const [userHasSubmitted, setUserHasSubmitted] = useState(userSubmission ? true : false)

		// DEBUG: uncomment me
		// const [userHasSubmitted, setUserHasSubmitted] = useState(false)

		const [deleteSuggestion, setDeleteSuggestion] = useState<number | null>(null)

		useEffect(() => {

		}, [])

		/**----------------------------------- */
		// Render
		return <>
			{
				/**------------------------------
				 * FEEDBACK
				 * -
				 */
			}
			<section className={clsx(
				"bg-pink-100",
				"dark:bg-pink-800",
				"p-4",
				"mt-8",
			)}>
				{!session &&
					<h4
						className={clsx(
							"text-2xl"
						)}>
						{t.rich("please-login-to-vote", {
							loginLink: (chunks) => <Link href="/login">{chunks}</Link>
						})}
					</h4>
				}
				<StatusMessage />
				<Fieldset
					disabled={session ? false : true}>
					<Legend>{replaceComicVariables({
						content: page.plot_prompt,
						variables: variables,
						userVariables: userVariables
					})}</Legend>
					<RadioGroup
						name="suggestions"
						value={selected}
						onChange={(selected) => handleClick(selected)}
						className={clsx(
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
								return <RadioField
									key={index}
									className={clsx(
										"text-left",
										"w-2/3",
										"mx-auto"
									)}>
									<Radio value={`${s.id}`} />
									<Label>
										{`${s.id}`} -&nbsp;
										{replaceComicVariables({
											content: s.title,
											variables: variables,
											userVariables: userVariables
										})}
										{/* SEPARATE AUTHOR SUGGESTIONS FROM USER SUGGESTIONS */}
										{page.user_created.id !== s.user_created.id &&
											<em>&nbsp;&mdash; @{s.user_created.username}</em>
										}
										&nbsp;| <strong>{votes}</strong>
										{(session !== false && session !== undefined) && s.user_created.id == session.id &&
											<>
												<Button
													className={clsx("ml-5")}>
													{t("edit-suggestion")}
												</Button>
												<Button
													className={clsx("ml-5")}
													onClick={async () => {
														deleteUserPlotSuggestion(s.id)
														setDeleteSuggestion(s.id)
														setUserHasSubmitted(false)
														setStatus("success", t("suggestion-deleted"))
													}}
												>
													{t("delete-suggestion")}
												</Button>
											</>
										}
									</Label>
								</RadioField>
						}
						) : null}
						{/* 
								SUBMIT OWN SUGGESTION
								- Only display this radio button if the user hasn't already submitted something
								- When it's selected, display the suggestion form
						*/}
						{page.allow_user_suggestions &&
							!userHasSubmitted &&
							<RadioField className={clsx(
								"text-left",
								"w-2/3",
								"mx-auto"
							)}>
								<Radio value={selectUserSuggestion} />
								<Label>
									{t("submit-own-suggestion")}
								</Label>
							</RadioField>
						}
					</RadioGroup>

				</Fieldset>
				{/* 
						SUGGESTION FORM
				*/}
				{page.allow_user_suggestions && selected == selectUserSuggestion &&
					<UserSuggestionForm />
				}
			</section>

		</> // EO UserSuggestionForm() RENDER

		/**----------------------------------- */

		function UserSuggestionForm() {
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
					setStatus("success", "Your suggestion has been submitted.")
					router.refresh()
				}
			}, [lastResult])

			// Render
			return <>
				{session &&
					<form
						id={form.id}
						onSubmit={form.onSubmit}
						action={action}
						noValidate>
						<Field className={clsx(
							"mt-8"
						)}>
							<Label required htmlFor={fields.userSuggestion.name}>{t("suggestion-form-title")}</Label>
							<Textarea
								id={fields.userSuggestion.name}
								name={fields.userSuggestion.name}
								key={fields.userSuggestion.key}
							/>
							<ErrorMessage>{fields.userSuggestion.errors}</ErrorMessage>
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
						<Button type="submit">{t("submit-suggestion")}</Button>
					</form>
				}
			</>
		} // EO UserSuggestionForm()
		/**----------------------------------- */
	} // EO UserFeedbackSection()

}