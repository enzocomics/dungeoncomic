"use client"
/**----------------------------------- */
// LIBRARIES
import { Suspense } from "react"
import { Link } from "@/components/link"
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getComic } from "@/lib/directus/get-comics"
import Image from "next/image"
import { directusURL } from "@/data/env"
import { displayFonts, copyFonts, fonts } from "@/styles/fonts"
import { StackedLayout } from "@/components/stacked-layout"
import { Navbar, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from "@/components/navbar"
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "@/components/dropdown"
import { Avatar } from "@/components/avatar"
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'


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

	return <div
		style={{
			// Accent Color
			// backgroundColor: comic.accent_color ? `${comic.accent_color}40` : "transparent",
			// backgroundImage: comic.banner ? `url(${directusURL}/assets/${comic.banner.filename_disk})` : `none`,
			// Fonts
			"--font-copy": `var(--font-${copyFontSlug})`,
			"--font-display": `var(--font-${displayFontSlug})`
		} as React.CSSProperties}
		className={clsx(
			"font-copy"
		)}
	>
		{children}
	</div>

	// return <div className={clsx(
	// 	// Temporary CSS
	// 	// "border",
	// 	// "border-orange-500",
	// 	// "border-dashed",
	// 	// Background
	// 	"bg-top",
	// 	"bg-repeat-x",
	// 	"bg-base-2",
	// 	// Appearance
	// 	"h-full",
	// 	"text-base-content",
	// 	// "px-8",
	// 	"font-copy"
	// )}
	// 	// COMIC APPEARANCE
	// 	style={{
	// 		// Accent Color
	// 		// backgroundColor: comic.accent_color ? `${comic.accent_color}40` : "transparent",
	// 		// backgroundImage: comic.banner ? `url(${directusURL}/assets/${comic.banner.filename_disk})` : `none`,
	// 		// Fonts
	// 		"--font-copy": `var(--font-${copyFontSlug})`,
	// 		"--font-display": `var(--font-${displayFontSlug})`
	// 	} as React.CSSProperties}
	// >
	// 	{/* <h3 className={clsx(
	// 		// Temporary CSS
	// 		"font-display",
	// 		"text-2xl",
	// 	)}>Comic Layout UI</h3> */}
	// 	{/* {comic.logo &&
	// 		<Image
	// 			src={`${directusURL}/assets/${comic.logo.filename_disk}`}
	// 			width={comic.logo.width || 100}
	// 			height={comic.logo.height || 100}
	// 			alt={comic.logo.description || comic.title}
	// 		/>
	// 	} */}
	// 	{/* {!comic.logo && */}
	// 	{/* } */}
	// 	{/* <strong>Comic Description</strong>: {comic.description} <br /> */}
	// 	<div className={clsx(
	// 		// "bg-base-1",
	// 		"max-w-7xl",
	// 		"mx-auto"
	// 	)}>
	// 		<h2 className={clsx(
	// 			// "my-4",
	// 			"py-3",
	// 			"font-semibold",
	// 			"font-display",
	// 			"text-2xl",
	// 		)}>{comic.title}</h2>
	// 		{children}
	// 	</div>
	// </div>
}

/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
export function FrontpageLayoutUI({ children }: { children: React.ReactNode }) {
	const navigation = [
		{ name: 'Dashboard', href: '#', current: true },
		{ name: 'Team', href: '#', current: false },
		{ name: 'Projects', href: '#', current: false },
		{ name: 'Calendar', href: '#', current: false },
	]

	// function classNames(...classes) {
	// 	return classes.filter(Boolean).join(' ')
	// }
	return (
		<>
			<Disclosure
				as="nav"
				className={clsx(
					"relative",
					"bg-neutral-800",
					"dark:bg-black",
					"dark:after:pointer-events-none",
					"dark:after:absolute",
					"dark:after:inset-x-0",
					"dark:after:bottom-0",
					"dark:after:h-px",
					"dark:after:bg-white/10"
				)}
			>
				<div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
					<div className="relative flex h-16 items-center justify-between">
						<div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
							{/* Mobile menu button*/}
							<DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-500">
								<span className="absolute -inset-0.5" />
								<span className="sr-only">Open main menu</span>
								<span aria-hidden="true" className="block size-6 group-data-open:hidden" >=</span>
								<span aria-hidden="true" className="hidden size-6 group-data-open:block" >X</span>
							</DisclosureButton>
						</div>
						<div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
							<div className="flex shrink-0 items-center">
								<img
									alt="Your Company"
									src="/img/logomark.svg"
									className="h-8 w-auto"
								/>
							</div>
							<div className="hidden sm:ml-6 sm:block">
								<div className="flex space-x-4">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											aria-current={item.current ? 'page' : undefined}
											className={clsx(
												item.current
													? 'bg-gray-900 text-white dark:bg-gray-950/50'
													: 'text-gray-300 hover:bg-white/5 hover:text-white',
												'rounded-md px-3 py-2 text-sm font-medium',
											)}
										>
											{item.name}
										</a>
									))}
								</div>
							</div>
						</div>
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

							{/* Profile dropdown */}
							<Menu as="div" className="relative ml-3">
								<MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
									<span className="absolute -inset-1.5" />
									<span className="sr-only">Open user menu</span>
									<img
										alt=""
										src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
										className="size-8 rounded-full bg-gray-800 outline -outline-offset-1 outline-white/10"
									/>
								</MenuButton>

								<MenuItems
									transition
									className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
								>
									<MenuItem>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
										>
											Your profile
										</a>
									</MenuItem>
									<MenuItem>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
										>
											Settings
										</a>
									</MenuItem>
									<MenuItem>
										<a
											href="#"
											className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-white/5"
										>
											Sign out
										</a>
									</MenuItem>
								</MenuItems>
							</Menu>
						</div>
					</div>
				</div>

				<DisclosurePanel className="sm:hidden">
					<div className="space-y-1 px-2 pt-2 pb-3">
						{navigation.map((item) => (
							<DisclosureButton
								key={item.name}
								as="a"
								href={item.href}
								aria-current={item.current ? 'page' : undefined}
								className={clsx(
									item.current
										? 'bg-gray-900 text-white dark:bg-gray-950/50'
										: 'text-gray-300 hover:bg-white/5 hover:text-white',
									'block rounded-md px-3 py-2 text-base font-medium',
								)}
							>
								{item.name}
							</DisclosureButton>
						))}
					</div>
				</DisclosurePanel>
			</Disclosure>
			<main className={clsx(
				"max-w-7xl",
				"mx-auto",
			)}>
				{children}
			</main>
		</>
	)
}