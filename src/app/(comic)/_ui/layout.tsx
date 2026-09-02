"use client"
/**----------------------------------- */
// LIBRARIES
import { ComponentPropsWithoutRef, Suspense, useEffect, useState } from "react"
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
import { Seal } from "@/styles/seal"
import { usePathname, useRouter } from "next/navigation"
import { colorVariants } from "@/styles/colors"


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

	const navigation = [
		{ name: 'Dashboard', href: '#', current: true },
		{ name: 'Team', href: '#', current: false },
		{ name: 'Projects', href: '#', current: false },
		{ name: 'Calendar', href: '#', current: false },
	]

	return (
		<div style={
			{
				// Accent Color
				// backgroundColor: comic.accent_color ? `${comic.accent_color}40` : "transparent",
				// backgroundImage: comic.banner ? `url(${directusURL}/assets/${comic.banner.filename_disk})` : `none`,
				// Fonts
				"--font-copy": `var(--font-${copyFontSlug})`,
				"--font-display": `var(--font-${displayFontSlug})`,
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
				"font-copy"
			)}>
			<NavMenu menu={true} />

			{children}

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
		<NavMenu />
		{children}
	</>

}


/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
function NavMenu({
	menu = false,
}: {
	menu?: boolean
}) {


	const navigation = [
		{ name: 'Dashboard', href: '#', current: true },
		{ name: 'Team', href: '#', current: false },
		{ name: 'Projects', href: '#', current: false },
		{ name: 'Calendar', href: '#', current: false },
	]

	return <>
		<Disclosure
			as="nav"
			className={clsx(
				// Structure
				"fixed!",
				"z-50",
				"top-0",
				"relative",
				// Size
				"min-w-xs",
				"w-full",
				// Functionality
				"pointer-events-none",
			)}
		>
			<div className="mx-auto max-w-7xl ">
				<div className="relative flex items-center justify-between">
					<div className={clsx(
						"relative",
						"inset-y-0",
						"left-0",
						"flex",
						"items-center",
						"h-12"
					)}>
						{/* Mobile menu button*/}
						<DisclosureButton className={clsx(
							"group",
							"flex",
							"items-center",
							// Structure
							"absolute",
							"-top-1.75",
							"-left-4",
							// Appearance
							"text-comic-accent-500",
							// Functionality
							"cursor-pointer",
							"pointer-events-auto",

						)}>
							{/* LOGO */}
							<Seal
								menu={menu}
								className={clsx(
									"group/menu",
									"w-20",
								)} />
						</DisclosureButton>
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
					<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 pointer-events-auto">

						{/* Profile dropdown */}
						<Menu as="div" className="relative ml-3">
							<MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
								<span className="absolute -inset-1.5" />
								<span className="sr-only">Open user menu</span>
								<img
									alt=""
									src="/apple-touch-icon.png"
									className="size-12 border-4 border-comic-accent-900 relative rounded-full bg-gray-800"
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

			{/* PLATFORM MENU */}
			<DisclosurePanel className="">
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
	</>
}
