import clsx from "clsx"
import type React from 'react'
import StatusMessage from "@/components/status-message"
import { BuildingLibraryIcon } from "@heroicons/react/24/solid"

export function AuthLayout({ children }: { children: React.ReactNode }) {
	return <>
		<main className={clsx(
			"flex",
			"min-h-full",
			"flex-col",
			"justify-center",
			"py-12",
			"sm:px-6",
			"lg:px-8",
		)}>
			{children}

			<AuthFooter />
		</main >
	</>
}

export function AuthHeader({ children }: { children: React.ReactNode }) {
	return <>
		<div className="sm:mx-auto sm:w-full sm:max-w-sm">
			{/* Temporary Logo */}
			<BuildingLibraryIcon className={clsx(
				"mx-auto",
				"size-20",
				"w-auto",
				"fill-sky-500"
			)} />
			<h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white">
				{children}
			</h2>
		</div>
	</>
}

export function AuthBody({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			"mt-10",
			"sm:mx-auto",
			"sm:w-full",
			"sm:max-w-120"
		)}>
			<div className={clsx(
				"bg-white",
				"px-6",
				"py-12",
				"shadow-sm",
				"sm:rounded",
				"sm:px-12",
				"dark:bg-gray-800/50",
				"dark:shadow-none",
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-white/10"
			)}>
				<StatusMessage className="mb-6" />
				{children}
			</div>
		</div >
	</>
}

function AuthFooter() {
	return <div className={clsx(
		"mt-10",
		"text-center",
		"text-xs",
		"text-gray-500/50",
		"sm:mx-auto",
		"sm:w-full",
		"sm:max-w-120"
	)}>
		&copy; 2026 Dungeon Construction Co.
	</div>
}