/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import type React from "react"
// UI
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGithub } from "@fortawesome/free-brands-svg-icons"

/**-----------------------------------
 * AUTH - UI LAYOUTS
 * - `AuthLayout()`
 *   - `AuthHeader()`
 *     - `AuthHeaderTitle()`
 *     - `AuthHeaderDescription()`
 *   - `AuthBody()`
 *   - `AuthNav()`
 *   - `AuthFooter()`
 * 
 */
export function AuthLayout({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			"flex",
			"flex-col",
			"justify-center",
			"p-2.5",
			"min-w-sm",
			"min-h-full",
		)}>
			<header className={clsx(
				"mx-auto",
				"w-full",
				"max-w-120",
			)}>
				<Image src="/img/header.webp" alt="" width="990" height="260" />
			</header>
			{children}
			<AuthFooter />
		</div >
	</>
}

export function AuthHeader({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			"mb-8",
		)} >
			{children}
		</div>
	</>
}

export function AuthHeaderTitle({ children }: { children: React.ReactNode }) {
	return <h1 className={clsx(
		"font-display",
		"text-center",
		"text-3xl/16",
		"mb-4",
		"border-b",
		"border-dashed",
		"border-base-5/20",
		"dark:border-base-5",
	)}>
		{children}
	</h1>
}

export function AuthHeaderDescription({ children }: { children?: React.ReactNode }) {
	return <div className={clsx(
		"text-center",
		"text-xs",
		"text-balance",
		"text-base-content/70",
	)}>
		{children}
	</div>
}

export function AuthBody({ children }: { children: React.ReactNode }) {
	return <>
		<main className={clsx(
			"mx-auto",
			"w-full",
			"max-w-120"
		)}>
			<div className={clsx(
				"bg-base-1",
				"px-6",
				"pt-10",
				"pb-18",
				"shadow-sm",
				"sm:rounded",
				"sm:px-12",
				"dark:bg-base-2",
				"dark:shadow-none",
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-base-5"
			)}>
				{children}
			</div>
		</main >
	</>
}

export function AuthNav({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			"mt-4",
			"flex",
			"justify-between",
			"content-center",
			"text-xs",
			"text-current/70",
		)}>
			{children}
		</div>
	</>
}

function AuthFooter() {
	return <footer className={clsx(
		"flex",
		"justify-center",
		"gap-2",
		"my-4",
		"lg:mt-10",
		"text-xs",
		"text-current/40",
		"sm:mx-auto",
		"sm:w-full",
		"sm:max-w-120"
	)}>
		<span>&copy; {new Date().getFullYear().toString()} Dungeon Construction Co.</span>
		<a href="https://github.com/enzocomics/dungeoncomic" target="_blank"
			title="Visit DungeonComic's Github Project Repository"
			className={clsx(
				"active:text-primary-500",
				"transition-all",
				"duration-300",
				"lg:hover:transition-none",
				"lg:hover:text-primary-500",
				"lg:hover:scale-120",
			)}
		>
			<FontAwesomeIcon icon={faGithub} className="size-4" />
		</a>
	</footer>
}