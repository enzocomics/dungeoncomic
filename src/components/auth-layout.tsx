import clsx from "clsx"
import type React from "react"
import { BuildingLibraryIcon } from "@heroicons/react/24/solid"

export function AuthLayout({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			"p-2.5",
			"flex",
			"min-w-sm",
			"min-h-full",
			"flex-col",
			"justify-center",
		)}>
			<header className={clsx(
				"my-4",
				"mx-auto",
				"w-full",
				"max-w-sm"
			)}>
				{/* Temporary Logo */}
				<BuildingLibraryIcon className={clsx(
					"mx-auto",
					"size-10",
					"md:size-20",
					"w-auto",
					"fill-sky-500"
				)} />
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
	return <h2 className="text-center text-2xl/12 font-bold tracking-tight text-gray-900 dark:text-white">
		{children}
	</h2>
}

export function AuthHeaderDescription({ children }: { children?: React.ReactNode }) {
	return <div className={clsx(
		"text-center",
		"text-xs",
		"text-balance",
		"text-gray-900/70",
		"dark:text-white/70"
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
				"bg-white",
				"px-6",
				"pt-12",
				"pb-18",
				"shadow-sm",
				"sm:rounded",
				"sm:px-12",
				"dark:bg-gray-800/50",
				"dark:shadow-none",
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-white/10"
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
			"text-gray-900/70",
			"dark:text-white/70"
		)}>
			{children}
		</div>
	</>
}

function AuthFooter() {
	return <footer className={clsx(
		"my-4",
		"lg:mt-10",
		"text-center",
		"text-xs",
		"text-gray-500/50",
		"sm:mx-auto",
		"sm:w-full",
		"sm:max-w-120"
	)}>
		&copy; 2026 Dungeon Construction Co.
	</footer>
}