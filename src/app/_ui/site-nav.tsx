"use client"
/**----------------------------------- */
// LIBRARIES
import Link from "next/link"
import { CloseButton, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useTheme } from "@teispace/next-themes"
// FUNCTIONS
import clsx from "clsx"
// STYLES
import Icon, { icons } from "@/styles/icons"
import Seal from "@/styles/seal"
// DATA
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { AuthModalSchema, useGlobalContext } from "@/app/_context"
import { SetStateAction } from "react"
import { AuthLink } from "@/components/auth"
import { getComic } from "@/lib/directus/get-comics"
import { useTranslations } from "next-intl"
import { LogoutButton } from "@/components/auth-client"
import StatusMessage from "@/components/status-message"

/**-----------------------------------
 * NAVIGATION LAYOUT
 * ---
 * - Main Navigation Popover Menu
 * - User/Account Popover Menu
 * 
 */
export default function SiteNav({
	session,
	menu = false,
	comic,
	children
}: {
	session?: Awaited<ReturnType<typeof verifySession>>
	menu?: boolean
	comic?: Awaited<ReturnType<typeof getComic>>
	children?: React.ReactNode
}) {
	//Hooks
	const router = useRouter()
	const pathname = usePathname()
	const t = useTranslations()
	const { theme, setTheme } = useTheme()


	// TODO: These are all hardcoded & should be in the dictionaries
	const comicNavigation: {
		name: string,
		href: string,
		current: boolean,
		icon: keyof typeof icons
	}[] = [
			{
				name: "Homepage",
				href: "/",
				current: !!(pathname == "/"),
				icon: "house",
			},
			{
				name: "View All",
				href: "/list",
				current: !!(pathname == "/list"),
				icon: "rectangleList"
			}
		]

	const platformNavigation = [
		{ name: "Dungeon Construction Co.", href: "/", current: false },
	]


	const accountMenuNavigation = session && [
		{ name: "Edit Profile", href: "/dashboard", modal: null },
		{ name: "Settings", href: "/dashboard/settings", modal: null },
		// { name: "Logout", href: "/logout" },
	]

	const accountMenuAuthNav = !session ? [
		{ name: "Login", href: "/login", modal: "login" },
		{ name: "Sign up", href: "/register", modal: "register" },
	] : []

	// RENDER NAV MENU
	return (
		<div className={clsx(

			// Structure
			"sticky!",
			"z-50",
			"top-0",
		)}>
			<StatusMessage />

			{/* MAIN MENU NAV - POPOVER WRAPPER */}
			<nav
				className={clsx(
					// Position
					// "relative",
					// "left-1/2",
					// "-translate-x-1/2",
					"mx-auto",
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
						className={clsx(
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
							"focus:outline-offset-2",
							"focus:outline-comic-accent-500",
						)}
					>
						{/* LOGO WRAPPER */}
						<span className={
							clsx(
								"relative",
								menu && [
									"after:hidden",
									// black bg on the menu icon
									// hide it on desktop only if there is 
									// - no banner AND no logo
									// - if it's the landing page
									comic && ((!comic.banner && !comic.logo && !comic.landing_page))
										? "md:after:hidden"
										: "md:after:block",
									"after:absolute",
									"after:-z-1",
									"after:w-15",
									"after:h-9",
									"after:bg-neutral-800/80",
									"after:dark:bg-neutral-900/80",
									"group-data-open:after:bg-comic-accent-500",
									"group-data-open:dark:after:bg-comic-accent-600",
									"after:top-[20.5px]",
									"after:left-19",
									"after:rounded-r",
									// "group-focus:after:outline-4",
									// "group-focus:after:outline-offset-4",
									// "group-focus:after:outline-comic-accent-500",
									// Hover
									"group-hover:after:duration-0",
									"group-hover:after:bg-comic-accent-700",
									"group-active:after:translate-px",
									"group-active:after:bg-comic-accent-900",
									// Transition
									"after:transition-all",
									"after:ease-in-out",
									"after:duration-300",
								],

							)}>

							<Image src="/img/logomark.svg" width="128" height="128" alt=""
								className={
									clsx(
										"absolute",
										"z-5",
										"left-9",
										"top-5.5",
										"size-7",
										"md:top-4.5",
										"md:left-8.5",
										"md:size-8",
										menu && [
											"hidden",
											"md:block",
										]
									)
								} />
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
										// Seal
										"left-9",
										"top-5.5",
										"size-7",
										"md:left-8.5",
										"md:top-5",
										"md:size-8",
									],
								)
							}>

								{menu &&
									<span
										className={clsx(
											"relative",
											"md:top-0.75",
											"md:left-16"
										)}
									>
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
									</span>
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
										// "group-data-open:-rotate-24",
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
						<span className="sr-only group-data-open:hidden">
							{t("navigation.open-main-nav")}
						</span>
						<span className="hidden group-data-open:sr-only">
							{t("navigation.close-main-nav")}
						</span>
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
								"max-w-72",
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
							<div
								className={clsx(
									// Appearance
									"rounded-sm",
									"md:rounded",
									// Colours
									"bg-base-1",
									"dark:bg-base-3",
									"dark:outline",
									"dark:-outline-offset-1",
									"dark:outline-base-5/50",
									"py-1",
									"font-platform-labels",
								)}>
								{/* COMIC MENU */}
								{comicNavigation.map((item) => (
									<CloseButton
										as={Link}
										key={item.name}
										href={item.href}
										aria-current={item.current ? 'page' : undefined}
										className={clsx(
											"flex",
											"items-center",
											"px-5",
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
											item.current ? [
												"text-white",
												"bg-comic-accent-400",
												"dark:bg-comic-accent-600/50",
												"hover:bg-comic-accent-700",
											] : [
												"hover:bg-comic-accent-100",
												"dark:hover:bg-white/5",
											],
										)}
									>
										<Icon name={item.icon} className={clsx(
											"size-5",
											"mr-4",
										)} />
										{item.name}
									</CloseButton>
								))}
							</div>
						</PopoverPanel>
					}
				</Popover>

				{children}

				{/* ACCOUNT MENU POPOVER */}
				<Popover>
					<PopoverButton className={clsx(
						"pointer-events-auto",
						"mr-1.5",
						"group",
						"relative",
						"flex",
						"rounded",
						// Functionality
						"cursor-pointer",
						// Appearance
						"bg-black/50",
						"p-1",
						"data-open:bg-comic-accent-600",
						"dark:data-open:bg-comic-accent-700",
						"rounded",
						// Hover

						"hover:duration-0",
						"hover:bg-comic-accent-600",
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
						<span className="sr-only group-data-open:hidden">
							{t("navigation.open-user-nav")}
						</span>
						<span className="hidden group-data-open:sr-only">
							{t("navigation.close-user-nav")}
						</span>
						<span className={
							clsx(
								"relative",
								"size-7",
							)
						}>
							{session && session.avatar &&
								<Image
									src={`${directusURL}/assets/${session.avatar.filename_disk}`}
									alt={session.avatar.description || ""}
									width={session.avatar.width || "64"}
									height={session.avatar.height || "64"}
									className={
										clsx(
											"size-6",
											"rounded-sm",
											// Transition
											"transition-all",
											"ease-in-out",
											"duration-300",
											// Diff
											"opacity-100",
											"bg-comic-accent-700",
											"group-data-open:opacity-0",
										)
									}
								/>
							}
							{(!session || (session && !session.avatar)) &&
								<Icon name="skull" className={clsx(
									"size-7",
									"p-1",
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
							}
							<Icon name="xmark" className={clsx(
								"text-white",
								"size-7",
								"p-1",
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
								// "group-hover:duration-0",
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
						{({ close }) => (
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
										"font-platform-labels",
									)
								}>
									{accountMenuNavigation?.map((item, index) => (
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
									{accountMenuAuthNav?.map((item, index) => (
										<AuthLink
											isModal={true}
											modal={item.modal as AuthModalSchema}
											key={index}
											// href={item.href}
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
											// Because <AuthLink> has a preventDefault on it
											onClick={() => close()}
										>
											{item.name}
										</AuthLink>
									))}
									{session &&
										// Use a regular anchor tag instead of <Link> because we want to force a refresh
										<CloseButton as={LogoutButton} className={
											clsx(
												"block",
												"w-full",
												"text-left",
												"cursor-pointer",
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
										>
											{t("auth.logout")}
										</CloseButton>
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
						)}
					</PopoverPanel>
				</Popover>
			</nav >
		</div>
	)
}