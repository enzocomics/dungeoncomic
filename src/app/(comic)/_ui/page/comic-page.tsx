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
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
import { detailedDate, relativeDate } from "@/lib/dayjs"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA
import { directusURL } from "@/data/env"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { prepareText, replaceComicVariables } from "../../_functions/parse-content"
// ACTIONS
import { saveUserVars } from "../../_actions/variables"
import { deleteUserPlotSuggestion, PlotSuggestionType, submitUserPlotSuggestion, voteOnPlotSuggestion } from "../../_actions/plot-suggestions"
// UI
import * as Headless from "@headlessui/react"
import { Button, Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions, Field, Fieldset, Label, Legend, Radio, RadioGroup, Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useComicContext } from "../context"
import StatusMessage, { useChangeStatus } from "@/components/status-message"
import { ErrorMessage } from "@/components/forms"
import Link from "next/link"
import Icon from "@/styles/icons"
import { Textarea } from "@/components/textarea"
import { ComicButton } from "@/components/button"
import { AuthLink } from "@/components/auth"
import { ComicPageUIProps } from "./comic"

/**-----------------------------------
 * Comic Page UI
 * ---
 */

export default function ComicPageContentUI({
	page,
	variables,
	userVariables,
	session,
	children,
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

	const hasCoverPage = comic.landing_page === "cover-page" ? true : false

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
	const hasLogo = !!page.comic.logo
	const hasAuthors = !!comic.authors && comic.authors.length > 0

	/**-----------use------------------------ */
	// State that checks if we can go backwards, to the same site, using browser history 

	// State that checks which nav button type has been clicked
	const [navClickType, setNavClickType] = useState<"next" | "prev" | null>(null)

	// Retrieve Context
	const {
		canGoBack, setCanGoBack,
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
				"font-platform-mono",
			)}>
			<p><strong>prevpage in state:</strong> {comicPreviousPage.pagenum}</p>
			<p><strong>page history:</strong> {comicPageHistory.map(h => `${h}, `)}</p>
		</span>

		{children}

		{/* COMIC PAGE - CONTENT WRAPPER */}
		<div
			className={clsx(
				"relative",
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
					"dark:bg-base-2",
					"dark:shadow-none",
					"dark:outline",
					"dark:-outline-offset-1",
					"dark:outline-base-5/50",
					"text-center",
					hasBanner || !hasPrevPage ? "md:rounded-t" : "",
					// "md:rounded-t",
					"md:last:rounded-b",
				)}
			>

			</article >
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
					"max-w-2xl",
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
				"font-comic-copy",
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

	/**-----------------------------------
	 * SECTION: USER FEEDBACK
	 * ---
	 */

}