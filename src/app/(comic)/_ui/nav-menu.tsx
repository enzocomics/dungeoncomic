"use client"
/**----------------------------------- */
// LIBRARIES
import Link from "next/link"
import { CloseButton, Popover, PopoverButton, PopoverPanel, useClose } from "@headlessui/react"
import { useTheme } from "@teispace/next-themes"
// FUNCTIONS
import clsx from "clsx"
// STYLES
import Icon from "@/styles/icons"
import Seal from "@/styles/seal"
import { colorVariants } from "@/styles/colors"
import { displayFonts, copyFonts } from "@/styles/fonts"
// DATA
import { directusURL } from "@/data/env"
import { getComic } from "@/lib/directus/get-comics"
import { verifySession } from "@/data/session"
import { useRouter } from "next/navigation"
import Image from "next/image"

/**-----------------------------------
 * NAVIGATION LAYOUT
 * ---
 * - Main Navigation Popover Menu
 * - User/Account Popover Menu
 * 
 */
export default function NavMenu({
	session,
	menu = false
}: {
	session?: Awaited<ReturnType<typeof verifySession>>
	menu?: boolean
}) {

	const router = useRouter()
	const { theme, setTheme } = useTheme()

	const comicNavigation = [
		{ name: 'Home', href: './', current: true },
		{ name: 'About', href: './about', current: false },
	]

	const navigation = [
		{ name: 'Dungeon Construction Co.', href: '/', current: false },
	]

	const accountMenuNavigation = session ? [
		{ name: "Edit Profile", href: "/dashboard" },
		{ name: "Settings", href: "/dashboard/settings" },
		// { name: "Logout", href: "/logout" },

	] : [
		{ name: "Login", href: "/login" },
		{ name: "Sign up", href: "/register" },
	]

	// RENDER NAV MENU
	return (
		<>
			{/* MAIN MENU NAV - POPOVER WRAPPER */}
			<nav
				className={clsx(
					// Structure
					"fixed!",
					"z-50",
					"top-0",
					// Position
					// "relative",
					"left-0",
					"md:left-1/2",
					"md:-translate-x-1/2",
					// Size
					"min-w-xs",
					"max-w-6xl",
					"h-12",
					"md:h-20",
					// "mx-auto",
					"w-full",
					// Spacing
					"md:py-4",
					"md:px-6",
					// Functionality
					"pointer-events-none",
					"relative flex items-center justify-between"
				)}
			>
				{/* MOBILE MENU BUTTON */}
				<Popover>
					<PopoverButton
						onClick={() => !menu && router.push("/")}
						className={
							clsx(
								"group",
								// Structure
								"relative",
								"flex",
								"items-center",
								"top-0",
								"-left-8",
								"md:-left-4.5",
								// Appearance
								"text-comic-accent-500",
								"dark:text-comic-accent-600",
								"rounded-full",
								// Functionality
								"cursor-pointer",
								"pointer-events-auto",
								// Hover
								"hover:duration-0",
								"active:translate-px",
								// Transition
								"transition-all",
								"ease-in-out",

								"focus:outline-4",
								"focus:outline-offset-1",
								"focus:outline-comic-accent-500",
							)}>
						{/* LOGO WRAPPER */}
						<span className={
							clsx(
								"relative"
							)}>
							{/* ICONS WRAPPER */}
							<span className={
								clsx(
									"absolute",
									"z-5",
									menu ? [
										"left-9",
										"top-6",
										"-rotate-1",
										"size-6",
									] : [
										"left-8.5",
										"top-5",
										"size-8",
									],
								)
							}>
								{!menu &&
									<>
										<Image src="img/logomark.svg" width="128" height="128" alt=""
											className={
												clsx(
												)
											} />
									</>
								}
								{menu &&
									<>
										<Icon name="bars" className={
											clsx(
												"rotate-0",
												"opacity-100",
												"text-white",
												"group-data-open:opacity-0",
												"group-data-open:rotate-45",
												// Transition
												"transition-all",
												"ease-in-out",
												"outline-none",
											)} />
										<Icon name="xmark" className={clsx(
											"absolute",
											"top-0",
											"opacity-0",
											"text-white",
											"-rotate-45",
											"group-data-open:rotate-0",
											"group-data-open:block",
											"group-data-open:opacity-100",
											// Transition
											"transition-all",
											"ease-in-out",
											"outline-none",
										)} />
									</>
								}
							</span>
							{/* WAX SEAL SVG */}
							<Seal
								className={clsx(
									"group/menu",
									"w-24",
									// Outline
									"rounded-full",
									"outline-transparent",
									"rotate-0",
									"group-hover:text-comic-accent-600",
									"dark:group-hover:text-comic-accent-700",
									"group-active:text-comic-accent-700",
									"dark:group-active:text-comic-accent-800",
									menu ? [
										"group-data-open:rotate-12",
										"group-data-open:text-comic-accent-700",
										"dark:group-data-open:text-comic-accent-800",
									] : [

										"drop-shadow-lg",
										"drop-shadow-neutral-900/45",
									],
									// Transition
									"transition-all",
									"ease-in-out",
									"outline-none",
								)} />
						</span>
						{/* BUTTON LABELS (FOR SCREENREADERS) */}
						<span className="sr-only group-data-open:hidden">Open Main Navigation</span>
						<span className="hidden group-data-open:sr-only">Close Main Navigation</span>
					</PopoverButton>
					{/* MAIN MENU */}
					{menu &&
						<PopoverPanel
							as="nav"
							transition
							className={clsx(
								"absolute",
								"pointer-events-auto",
								// Transitions
								"transition-all",
								"ease-in-out",
								"data-closed:opacity-0",
								"data-closed:duration-300",
								"data-closed:scale-90",
								"opacity-100",
								"data-open:duration-none",
								"scale-100",
								// Position
								"origin-top-left",
								// "relative",
								"left-0",
								"top-13.5",
								"md:left-6",
								"md:top-17.5",
								"z-1",
								// Size & Spacing
								"w-full",
								"sm:max-w-sm",
								"rounded-sm",
								"drop-shadow-2xl",
								"drop-shadow-neutral-900/45",
								// Arrow
								"before:absolute",
								"before:z-10",
								"before:-top-2.5",
								"before:left-1.5",
								"md:before:left-5",

								"before:h-0 before:w-0",
								"before:border-l-11 before:border-r-11",
								"before:border-t-11",
								"before:border-l-transparent before:border-r-transparent",
								"before:border-t-base-1 dark:before:border-t-base-3",
								"before:rotate-180"
							)}
						>
							<section className={
								clsx(
									// Appearance
									"rounded-sm",
									"md:rounded",
									// Colours
									"bg-base-1",
									"dark:bg-base-3",
									"dark:outline",
									"dark:-outline-offset-1",
									"dark:outline-base-5/50",
								)
							}>
								{/* COMIC MENU */}
								<section className={
									clsx(
										"space-y-1 px-2 pt-2 pb-3"
									)
								}>
									{comicNavigation.map((item) => (
										<CloseButton
											as={Link}
											key={item.name}
											href={item.href}
											aria-current={item.current ? 'page' : undefined}
											className={clsx(
												item.current
													? "bg-comic-accent-700 text-white"
													: 'text-neutral-400 hover:bg-white/5 hover:text-white',
												'block rounded-md px-3 py-2 text-base font-medium',
											)}
										>
											{item.name}
										</CloseButton>
									))}
								</section>
								{/* PLATFORM MENU */}
								<section className={
									clsx(
										"bg-base-2/20",
										"dark:bg-base-2/50",
									)
								}>
									{navigation.map((item) => (
										<CloseButton
											as={"a"}
											key={item.name}
											href={item.href}
											aria-current={item.current ? 'page' : undefined}
											className={clsx(
												item.current
													? "bg-comic-accent-700 text-white"
													: 'text-neutral-400 hover:bg-white/5 hover:text-white',
												'block rounded-md px-3 py-2 text-sm',
											)}
										>
											{item.name}
										</CloseButton>
									))}
								</section>
							</section>
						</PopoverPanel>
					}
				</Popover>

				{/* ACCOUNT MENU POPOVER */}
				<Popover>
					<PopoverButton className={clsx(
						"pointer-events-auto",
						"mr-2.5",
						"group",
						"relative",
						"flex",
						"rounded",
						// Functionality
						"cursor-pointer",
						// Appearance
						"data-open:bg-comic-accent-600",
						"dark:data-open:bg-comic-accent-700",
						"rounded-lg",
						// Hover
						"scale-100",
						"hover:duration-0",
						"hover:scale-120",
						"active:translate-px",
						"active:bg-comic-accent-900",
						// Transition
						"transition-all",
						"ease-in-out",
						"duration-300",
						// Outline
						"outline-transparent",
						"focus:outline-4",
						"focus:outline-offset-2",
						"focus:outline-comic-accent-500",
					)}>
						<span className="sr-only group-data-open:hidden">Open user menu</span>
						<span className="hidden group-data-open:sr-only">Close user menu</span>
						<span className={
							clsx(
								"relative",
								"size-8",
							)
						}>
							<Icon name="skull" className={clsx(
								"size-8",
								"p-1.5",
								"rounded-sm",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								"group-hover:duration-0",
								// Diff
								"opacity-100",
								"text-white",
								"bg-comic-accent-700",
								"group-data-open:opacity-0",
								"group-data-open:rotate-45",
							)} />
							<Icon name="xmark" className={clsx(
								"text-white",
								"size-8",
								"p-1.5",
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
					</PopoverButton>

					<PopoverPanel
						as="nav"
						transition
						className={clsx(
							"pointer-events-auto",
							// Transitions
							"transition-all",
							"ease-in-out",
							"data-closed:opacity-0",
							"data-closed:duration-300",
							"data-closed:scale-90",
							"opacity-100",
							"data-open:duration-none",
							"scale-100",
							// Position
							"origin-top-right",
							"absolute",
							"right-0",
							"z-50",
							"top-13.5",
							"md:right-6",
							"md:top-17.5",
							// Size & Spacing
							"max-w-lg",
							"rounded-sm",
							"drop-shadow-2xl",
							"drop-shadow-neutral-900/45",
						)}
					>
						<div className={
							clsx(
								// Appearance
								"rounded-sm",
								"md:rounded",
								// Colours
								"bg-base-1",
								"dark:bg-base-3",
								"dark:outline",
								"dark:-outline-offset-1",
								"dark:outline-base-5/50",
								// Arrow
								"before:absolute",
								"before:z-10",
								"before:-top-2.5",
								"before:right-3.5",

								"before:h-0 before:w-0",
								"before:border-l-11 before:border-r-11",
								"before:border-t-11",
								"before:border-l-transparent before:border-r-transparent",
								"before:border-t-base-1 dark:before:border-t-base-3",
								"before:rotate-180"
							)
						}>
							<section className={
								clsx(
									"py-1",
									"font-platform-header",
								)
							}>
								{accountMenuNavigation.map((item, index) => (
									<CloseButton
										as={Link}
										key={index}
										href={item.href}
										className={
											clsx(
												"block",
												"px-4",
												"py-2",
												"text-sm",
												"hover:bg-comic-accent-500",
												"dark:hover:bg-comic-accent-700",
												"hover:text-white",
												"hover:duration-0",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
											)
										}
									>
										{item.name}
									</CloseButton>
								))}
								{session &&
									// Use a regular anchor tag instead of <Link> because we want to force a refresh
									<a href="/logout" className={
										clsx(
											"block",
											"px-4",
											"py-2",
											"text-sm",
											"hover:bg-comic-accent-500",
											"dark:hover:bg-comic-accent-700",
											"hover:text-white",
											"hover:duration-0",
											// Transition
											"transition-all",
											"ease-in-out",
											"duration-300",
										)}
									>Log out</a>
								}
							</section>
							{/* MODE TOGGLER */}
							<section className={
								clsx(
									"flex",
									"px-4",
									"py-2",
									"justify-center",
									"bg-base-2/20",
									"dark:bg-base-2/50",
								)
							}>
								<div className={
									clsx(

										"p-1",
										"gap-x-1",
										"items-center",
										"justify-center",
										"rounded-2xl",
										"bg-base-2/40",
										"dark:bg-base-2",
									)
								} >
									<div
										data-theme={theme}
										className={
											clsx(
												"group",
												"relative",
												"flex",
											)
										}>
										<button className={
											clsx(
												"relative",
												"z-1",
												"peer",
												"peer/system",
												"flex",
												"items-center",
												"justify-center",
												"cursor-pointer",
												"p-1",
												"px-2",
												"rounded-2xl",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
												// Button Specific
												theme == "system" && "text-white",
												"group-data-[theme=system]:group-hover:text-base-content",
												"hover:text-white!",
											)
										}
											onClick={(e) => (setTheme("system"))}
										>
											<Icon name="desktop" className={
												clsx(
													"size-5",
												)
											} />
										</button>
										<button className={
											clsx(
												"relative",
												"z-1",
												"peer/light",
												"flex",
												"peer",
												"items-center",
												"justify-center",
												"cursor-pointer",
												"p-1",
												"px-2",
												"rounded-2xl",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
												// Button Specific
												theme == "light" && "text-white",
												"group-data-[theme=light]:group-hover:text-base-content",
												"hover:text-white!",
											)
										}
											onClick={(e) => (setTheme("light"))}
										>
											<Icon name="sun" className={
												clsx(
													"size-5",
												)
											} />
										</button>
										<button className={
											clsx(
												"relative",
												"z-1",
												"peer",
												"peer/dark",
												"flex",
												"items-center",
												"justify-center",
												"cursor-pointer",
												"p-1",
												"px-2",
												"rounded-2xl",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
												// Button Specific
												theme == "dark" && "text-white",
												"group-data-[theme=dark]:group-hover:text-base-content",
												"hover:text-white!",
											)
										}
											onClick={(e) => (setTheme("dark"))}
										>
											<Icon name="moon" className={
												clsx(
													"size-5",
												)
											} />
										</button>
										<span className={
											clsx(
												// Toggle
												"block",
												"absolute",
												"top-1/2",
												"-translate-1/2",
												"size-7",
												"bg-comic-accent-500",
												"dark:bg-comic-accent-500/50",
												"rounded-full",
												// "-z-1",
												"scale-100",
												"peer-hover:scale-120",
												"dark:peer-hover:bg-comic-accent-500/90",
												"peer-hover/system:left-4.5",
												"peer-hover/light:left-13.5",
												"peer-hover/dark:left-22.5",
												theme == "system" && "left-4.5",
												theme == "light" && "left-13.5",
												theme == "dark" && "left-22.5",
												// Transition
												"transition-all",
												"ease-in-out",
												"duration-300",
											)
										} />
									</div>
								</div>
							</section>
						</div>
					</PopoverPanel>
				</Popover>
			</nav>
		</>
	)
}