"use client"
/**----------------------------------- */
// LIBRARIES
import { ComponentPropsWithoutRef, RefObject, Suspense, useEffect, useRef, useState } from "react"
// import { Link } from "@/components/link"
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getComic } from "@/lib/directus/get-comics"
import Image from "next/image"
import { directusURL } from "@/data/env"
import { displayFonts, copyFonts, fonts } from "@/styles/fonts"
import { CloseButton, Popover, PopoverButton, PopoverPanel, useClose } from '@headlessui/react'
import { Seal } from "@/styles/seal"
import { usePathname, useRouter } from "next/navigation"
import { colorVariants } from "@/styles/colors"
import Icon from "@/styles/icons"
import { useTheme } from "@teispace/next-themes"
import Link from "next/link"


/**-----------------------------------
 * COMIC FRONTPAGE LAYOUT
 * ---
 * - Default homepage
 */
export function ComicLayoutUI({
	children,
	comic
}: {
	children: React.ReactNode
	comic: Awaited<ReturnType<typeof getComic>>
}) {
	// FETCH COMIC APPEARANCE VARS
	const displayFontSlug = displayFonts[comic.display_font.toString()].slug
	const copyFontSlug = copyFonts[comic.copy_font.toString()].slug
	const accentColor = comic.accent_color || "red"


	return (

		<div style={
			{
				// Accent Color
				// backgroundColor: comic.accent_color ? `${comic.accent_color}40` : "transparent",
				// backgroundImage: comic.banner ? `url(${directusURL}/assets/${comic.banner.filename_disk})` : `none`,

				// Fonts
				"--font-comic-copy": `var(--font-${copyFontSlug})`,
				"--font-comic-header": `var(--font-${copyFontSlug})`,
				"--font-comic-display": `var(--font-${displayFontSlug})`,
				"--color-comic-accent-50": `var(${colorVariants[accentColor]["50"]})`,
				"--color-comic-accent-100": `var(${colorVariants[accentColor]["100"]})`,
				"--color-comic-accent-200": `var(${colorVariants[accentColor]["200"]})`,
				"--color-comic-accent-300": `var(${colorVariants[accentColor]["300"]})`,
				"--color-comic-accent-400": `var(${colorVariants[accentColor]["400"]})`,
				"--color-comic-accent-500": `var(${colorVariants[accentColor]["500"]})`,
				"--color-comic-accent-600": `var(${colorVariants[accentColor]["600"]})`,
				"--color-comic-accent-700": `var(${colorVariants[accentColor]["700"]})`,
				"--color-comic-accent-800": `var(${colorVariants[accentColor]["800"]})`,
				"--color-comic-accent-900": `var(${colorVariants[accentColor]["900"]})`,
				"--color-comic-accent-950": `var(${colorVariants[accentColor]["950"]})`,
			} as React.CSSProperties}
			className={clsx(
				"relative",
				"font-comic-copy",
				"bg-top",
				"bg-repeat-x",
				"bg-fixed",
			)}>
			{/* Comic Banner Background Image*/}
			{comic.banner &&
				<div
					style={{
						backgroundImage: `url(${directusURL}/assets/${comic.banner?.filename_disk})`,
					}}
					className={clsx(
						// Position
						"-z-1",
						"fixed",
						"left-1/2 -translate-x-1/2 ",
						// Size
						"w-full",
						"max-w-[1600px]",
						"h-100",
						// Appearance
						"opacity-75",
						// Background
						"bg-cover",
						"bg-center",
						"bg-fixed",
						"bg-blend-saturation",
						// Background: Fade to bottom
						"mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)",
						"[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]",
						// Background: Fade to left & right (desktop)
						"xl:mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)",
						"xl:mask-composite:intersect",
						"xl:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]",
						"xl:[-webkit-mask-composite:source-in]",
					)} />
			}
			<NavMenu menu={true} />
			<main className={clsx(
				"mx-auto",
				"max-w-6xl",
				"md:px-6",
			)}>
				{children}
			</main>

		</div>
	)

}

/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
export function FrontpageLayoutUI({
	children,
}: {
	children: React.ReactNode
}) {

	return <>
		{/* <NavMenu /> */}
		{children}
	</>

}


/**-----------------------------------
 * NAVIGATION LAYOUT
 * ---
 * - 
 * 
 */
function NavMenu({
	menu = false,
}: {
	menu?: boolean
}) {
	const { theme, setTheme } = useTheme()

	const comicNavigation = [
		{ name: 'Home', href: './', current: true },
		{ name: 'About', href: './about', current: false },
	]

	const navigation = [
		{ name: 'Dungeon Construction Co.', href: '/', current: false },
	]

	return (
		<>
			{/* MAIN MENU NAVIGATION POPOVER */}
			<Popover
				as="nav"
				className={clsx(
					// Structure
					"fixed!",
					"z-50",
					"top-0",
					// Position
					"relative",
					"left-0",
					"md:left-1/2",
					"md:-translate-x-1/2",
					// Size
					"min-w-xs",
					"max-w-6xl",
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

				<div className={
					clsx(
						"relative",
						"inset-y-0",
						"left-0",
						"flex",
						"items-center",
						"h-12"
					)}>
					{/* Mobile menu button*/}
					<PopoverButton className={
						clsx(
							"group",
							// Structure
							"absolute",
							"flex",
							"items-center",
							"-top-3",
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
						{/* LOGO */}
						<span className={
							clsx(
								"relative"
							)}>
							<span className={
								clsx(
									"absolute",
									"z-5",
									"left-9",
									"top-6",
									"size-6",
									"-rotate-1",
								)
							}>
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
							<Seal
								menu={menu}
								className={clsx(
									"group/menu",
									"w-24",
									// Outline
									"rounded-full",
									"outline-transparent",
									"rotate-0",
									"group-hover:text-comic-accent-600",
									"dark:group-hover:text-comic-accent-700",
									"group-data-open:rotate-12",
									"group-data-open:text-comic-accent-700",
									"dark:group-data-open:text-comic-accent-800",
									"group-active:text-comic-accent-700",
									"dark:group-active:text-comic-accent-800",
									// Transition
									"transition-all",
									"ease-in-out",
									"outline-none",
								)} />
						</span>
						<span className="sr-only">Open Main Navigation</span>
					</PopoverButton>
				</div>
				<div className={clsx(
					"flex",
					"flex-1",
					// "items-center",
					// "justify-center",
					// "sm:items-stretch",
					// "sm:justify-start"
				)}>

				</div>
				<div className="absolute inset-y-0 right-0 flex items-center pr-2.5 sm:static sm:inset-auto sm:ml-6 pointer-events-auto">

					{/* Profile dropdown */}
					<Popover as="div" className="relative"  >
						<PopoverButton className={clsx(
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
							{/* <span className="absolute -inset-1.5" /> */}
							<span className="sr-only">Open user menu</span>
							<span className={
								clsx(
									"relative",
									"size-8",
								)
							}>
								{/* <Icon name="skull" className={clsx(
									"text-white",
									"size-8",
									"p-2",
									"bg-comic-accent-700",
									"rounded-sm",
								)} /> */}
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
							transition
							className={clsx(
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
								"top-11.5",
								// Size & Spacing
								"max-w-lg",
								"rounded-sm",
								"drop-shadow-2xl",
								"drop-shadow-neutral-900/45",
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
									// "border",
									// Arrow
									"before:absolute",
									"before:z-10",
									"before:-top-2.5",
									"before:right-1",

									"before:h-0 before:w-0",
									"before:border-l-11 before:border-r-11",
									"before:border-t-11",
									"before:border-l-transparent before:border-r-transparent",
									"before:border-t-base-1 dark:before:border-t-base-3",
									"before:rotate-180"
								)
							}>
								<div>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
									>
										Your profile
									</a>
								</div>
								<div>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
									>
										Settings
									</a>
								</div>
								<div>
									<a
										href="#"
										className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
									>
										Sign out
									</a>
								</div>
								{/* MODE TOGGLER */}
								<div className={
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
								</div>
							</section>
						</PopoverPanel>
					</Popover>
				</div>



				{/* MAIN MENU */}
				<PopoverPanel
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
						<div className={
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
						</div>
						{/* PLATFORM MENU */}
						<div className={
							clsx(
								// "space-y-1 px-2 pt-2 pb-3 bg-base-2/50"
								"bg-base-2/20",
								"dark:bg-base-2/50",
							)
						}>
							{navigation.map((item) => (
								<CloseButton
									as={Link}
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
						</div>
					</section>
				</PopoverPanel>
			</Popover>
		</>
	)

}


