"use client"
/**----------------------------------- */
import clsx from "clsx"
// LIBRARIES
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
	userVariables,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	userVariables?: Record<string, string>
}) {
	const router = useRouter()
	const pathname = usePathname()
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

	return <>
		<div className={clsx(
			"bg-comic-accent-700",
			"dark:bg-comic-accent-900",
			"text-base",
			"sm:text-sm",
			"text-white",
			"font-comic-header",
			"md:rounded",
			"sticky",
			"bottom-0",
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
						hasCoverPage
							? Link
							: "div"
					}
						className={clsx(
							"rounded-l",
							"hover:rounded-l"
						)}
						href={
							hasCoverPage
								? "./"
								: undefined
						}
						disabled={
							hasCoverPage
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
					)}>
						<PrevPageButton
							className={clsx(
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
						"relative"
					)}>
						<Menu>
							<MenuButton
								as={PrevPageButton}
								className={clsx(
									"group",
									// "bg-transparent",
									"data-closed:duration-300",
									"data-open:bg-comic-accent-950",
									"data-open:duration-none",
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
								"bottom-8",
								"left-0",
								"rounded-t",
								"data-closed:bottom-6",

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
					<NavbarButton as={Link} href="/"
						className={clsx(
							"rounded-r",
							"hover:rounded-r"
						)}
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
			"p-2",
			"px-3",
			props.disabled ? [
				"text-neutral-400",
				"bg-neutral-500",
			] : [
				"cursor-pointer",
				// Hover
				"duration-300",
				"hover:bg-black/50",
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
			"rounded",
			"border-4",
			"border-t-white/10",
			"border-b-black/10",
			"border-l-white/5",
			"border-r-black/5",

			"bg-comic-accent-500",
			"scale-100",
			// "sm:scale-105",
			"hover:bg-comic-accent-400!",
			"active:translate-px",
			"drop-shadow-lg",
			"drop-shadow-black/20",
			"ring-4",
			"ring-comic-accent-700",
		)}>
		{props.children}
	</NavbarButton>
)