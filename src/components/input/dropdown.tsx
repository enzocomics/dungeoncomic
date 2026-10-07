import * as Headless from "@headlessui/react"
import clsx from "clsx"
import Icon from "@/styles/icons"
import { Fragment } from "react"

export function Select({
	className,
	...props
}: { className?: string } & Omit<Headless.SelectProps, "className">) {
	return <>
		<div className={clsx(
			"grid",
			"grid-cols-1",
		)}>
			<Headless.Select
				{...props}
				className={clsx(
					className,

					"cursor-pointer",
					"appearance-none",
					// Grid
					"col-start-1",
					"row-start-1",
					// Size
					"w-full",
					"py-2",
					"px-4",
					"pr-8",
					"my-3",
					// Appearance
					"border-2",
					// "text-left",
					"font-platform-mono",
					"rounded",
					// Colors
					"bg-white",
					"border-neutral-200",
					"text-neutral-900",
					"dark:border-white/10",
					"dark:bg-white/5",
					"dark:text-white",
					//
					"focus:outline-4",
					"focus:-outline-offset-2",
					"focus:outline-comic-accent-500",
				)}
			>
				{props.children}
			</Headless.Select>
			<Icon name="caretDown" className={clsx(
				"pointer-events-none",
				"mr-2",
				"relative",
				"top-1/2",
				"-translate-y-1/2",
				"size-5",
				"col-start-1",
				"row-start-1",
				"justify-self-end",
				"text-comic-accent-500",
			)} />
		</div>
	</>
}

