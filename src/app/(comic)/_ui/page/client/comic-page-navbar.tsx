"use client"
/**----------------------------------- */
import clsx from "clsx"
// LIBRARIES
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions, Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react"
// DATA
import { getComicPage, getComicVariables } from "@/lib/directus/get-comics"
// HELPERS
import { doVarsExist, getComicPageVars, haveVarsBeenSubmitted, makeComicVarsUrl } from "@/app/(comic)/_functions/check-vars"
import { checkCoverPage, checkHasNextPage, checkHasPrevPage } from "@/app/(comic)/_functions/check-pages"
// UI
import { useComicContext } from "../../context"
import Icon from "@/styles/icons"
import { ComponentPropsWithoutRef } from "react"



export function ClientComicPageNavbar({
	page,
	lastPage,
	userVariables,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	lastPage: Awaited<ReturnType<typeof getComicPage>>
	userVariables?: Record<string, string>
}) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { canGoBack, setCanGoBack } = useComicContext()

	const t = useTranslations("ComicPage")
	const varsExist = doVarsExist(page.comic_panels)
	const varsSubmitted = haveVarsBeenSubmitted(page.comic_panels)
	const hasNextPage = checkHasNextPage(page.next_pages)
	const hasPrevPage = checkHasPrevPage(page.prev_pages, page.comic_panels)
	const hasCoverPage = checkCoverPage(page.comic.landing_page)
	const hasBanner = !!page.comic.banner
	const hasLogo = !!page.comic.logo
	const isFirstPage = !!(page.comic_pagenum == 1)
	const isLastPage = !!(page.comic_pagenum == page.comic.pages_count)
	// Last Page Vars
	const lastPageNum = page.comic.pages_count
	const lastPageVarsExist = doVarsExist(lastPage.comic_panels)
	const lastPageVars = getComicPageVars(lastPage.comic_panels)
	const lastPageVarsUrl = makeComicVarsUrl({
		comicVars: lastPageVars,
		userVars: userVariables
	})
	const lastPageVarsSubmitted = haveVarsBeenSubmitted(lastPage.comic_panels, new URLSearchParams(lastPageVarsUrl))

	return <>
		<div className={clsx(
			"bg-comic-accent-700",
			"dark:bg-comic-accent-800",
			"text-xs",
			"sm:text-sm",
			"text-white",
			"font-comic-header",
			"md:rounded",
			// "sticky",
			// "bottom-0",
			"md:bottom-2",
			"mt-2",
		)}>

			<nav className={clsx(
				"list-none",
				"flex",
				"justify-between",
				// isTop ? "justify-center" : "justify-between",
			)}>
				{/* GO BACK TO START BUTTON */}
				<li>
					<NavbarButton as={
						// It's a link If it has a cover page, or it ISN't the first page
						hasCoverPage || !isFirstPage
							? Link
							: "div"
					}
						className={clsx(
							"rounded-l",
							"hover:rounded-l",
						)}
						href={
							hasCoverPage
								? "./"
								: "./1"
						}
						disabled={
							hasCoverPage || !hasCoverPage && !isFirstPage
								? false
								: true
						}
					>
						<Icon name="forwardStep"
							className={clsx(
								"inline-block",
								"h-4",
								"size-3",
								"rotate-180",
								"sm:mr-1",
							)} />
						<span className={clsx(
							"hidden sm:block"
						)}>{t("go-to-start")}</span>
					</NavbarButton>
					{/* } */}
				</li>

				{/* Back Button */}
				{
					(hasPrevPage || hasCoverPage && isFirstPage && !varsSubmitted)
					&& (
						// Submission Form
						!canGoBack && varsSubmitted
						// Single Previous Page Back
						|| !varsSubmitted && page.prev_pages && page.prev_pages.length == 1
						// Browser History + Multiple Page Back
						|| canGoBack && page.prev_pages && page.prev_pages.length > 1
						// If it's the first page and a cover exists
						|| hasCoverPage && isFirstPage && !varsSubmitted
					)
					&&
					<li className={clsx(
						// "grow"
					)}>
						<PrevPageButton
							className={clsx(
								// "max-w-2xl",
								// "mx-auto",
							)}
							onClick={() => {
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
								// Go back to the cover if it exists and we're on the first page with no variables
								hasCoverPage && isFirstPage && !varsSubmitted
									&& router.push("./")
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
						</PrevPageButton>
					</li>
				}
				{/* BACK BUTTON: MULTIPLE PREVIOUS PAGES DROPDOWN */}
				{!canGoBack
					&& page.prev_pages && page.prev_pages.length > 1 &&
					<li className={clsx(
						"relative",
					)}>
						<Menu>
							<MenuButton
								as={PrevPageButton}
								className={clsx(
									"group",
									"peer",
									// "bg-transparent",
									"data-closed:duration-300",
									"data-open:bg-comic-accent-950",
									"data-open:duration-none",
									"data-open:rounded-t-none",
									"data-focus-within:bg-red-500",
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
								"left-1/2",
								"-translate-x-1/2",
								// "sm:left-0",
								// "xs:left-auto",
								// "left-0",
								"flex",
								"flex-col",


								// "min-w-46",
								// "md:min-w-80",
								"w-[calc(100vw-24px)]",
								"max-w-xl",
								// Appearance
								"bg-comic-accent-950",
								// Transitions
								"transition-all",
								"ease-in-out",
								"duration-300",
								"scale-100",
								"opacity-100",
								"data-closed:opacity-0",
								"data-closed:duration-300",
								"data-closed:scale-90",
								"data-open:duration-none",
								"bottom-9",
								"left-0",
								"rounded",
								"data-closed:bottom-6",
								// Outline
								"outline-none",
								"ring-4",
								"ring-comic-accent-950",
								"-ring-offset-4",
								"peer-hover:duration-0",
								"peer-hover:ring-comic-accent-500",

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
												"px-3",
												"py-2",
												"text-sm",
												"text-white/90",
												// "bg-comic-accent-700",
												"visited:bg-neutral-500",
												// "hover:text-white",
												// "hover:bg-comic-accent-900",

												// Transition
												"hover:duration-0",
												"transition-all",
												"ease-in-out",
												"duration-300",
												"data-active:outline-none",
												"data-active:bg-comic-accent-500",

											)}
											onClick={() => {
												// setNavClickType("prev")
												// setFirstLoad(false)
											}}
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
				{/* GO TO LATEST PAGE */}
				<li>
					<NavbarButton as={
						!isLastPage || (isLastPage && lastPageVarsExist && !lastPageVarsSubmitted)
							? "button"
							: "div"
					}
						className={clsx(
							"rounded-r",
							"hover:rounded-r",
						)}
						onClick={
							() => {
								!isLastPage || (isLastPage && lastPageVarsExist && !lastPageVarsSubmitted)
									? router.push(`./${lastPageNum}${lastPageVarsExist && `?${lastPageVarsUrl}`}`)
									: null
							}
						}
						disabled={
							!isLastPage || (isLastPage && lastPageVarsExist && !lastPageVarsSubmitted)
								? false
								: true
						}
					>
						<span className={clsx(
							"hidden",
							"sm:block",
						)}>Latest Page</span>
						<Icon name="forwardStep" className={clsx(
							"inline-block",
							"h-4",
							"size-3",
							"rotate-0",
							"sm:ml-1",
						)} />
					</NavbarButton>
				</li>

				{/* ARCHIVE COMBOBOX: WIP */}
				{/*
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
						*/}

			</nav>
		</div >
	</>
}

const NavbarButton = ({
	as: Tag = "button",
	...props
}: {
	as?: import("react").ElementType
} & ComponentPropsWithoutRef<import("react").ElementType>) => (
	<Tag
		{...props}
		className={clsx(
			props.className,
			"w-full",
			"h-full",
			"flex",
			"items-center",
			"justify-center",
			"p-2",
			"px-3",
			props.disabled ? [
				"cursor-not-allowed",
				"text-neutral-200",
				"bg-neutral-300",
				"dark:text-neutral-400",
				"dark:bg-neutral-500",
			] : [
				"cursor-pointer",
				// Hover
				"duration-300",
				"hover:bg-comic-accent-500",
				"dark:hover:bg-comic-accent-600",
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

			],
		)}>
		{props.children}
	</Tag>
)


const PrevPageButton = ({
	...props
}: ComponentPropsWithoutRef<typeof NavbarButton>) => (
	<NavbarButton
		{...props}
		className={clsx(
			props.className,
			"rounded-sm",
			// "border-4",
			// "border-t-white/10",
			// "border-b-black/10",
			// "border-l-white/5",
			// "border-r-black/5",

			"bg-comic-accent-800",
			"dark:bg-comic-accent-900",
			"hover:bg-comic-accent-500!",
			"dark:hover:bg-comic-accent-600!",
			"active:translate-px",
			"drop-shadow-lg",
			"drop-shadow-black/20",
			"ring-2",
			"ring-comic-accent-800",
			"dark:ring-comic-accent-900",
			"hover:ring-comic-accent-500",
			"dark:hover:ring-comic-accent-600",

		)}>
		{props.children}
	</NavbarButton>
)