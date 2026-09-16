
import { ComponentPropsWithoutRef } from "react"
import Link from "next/link"
import { Button } from "@headlessui/react"
import clsx from "clsx"
import Icon, { icons } from "@/styles/icons"

export function SmallComicButton({
	className,
	color,
	icon,
	...props
}: ComponentPropsWithoutRef<"button"> & {
	icon?: { name: keyof typeof icons, position: "left" | "right" }
}) {

	return <Button
		{...props}
		className={
			clsx(
				className,
				// Functionality
				"cursor-pointer",
				// Structure
				"flex",
				"flex-row",
				"gap-x-1.5",
				// Spacing
				"py-1",
				icon?.position == "left" && [
					"pl-1",
					"pr-2",
				],
				icon?.position == "right" && [
					"pl-2",
					"pr-1",
				],
				!icon && "px-2",
				// Text
				"text-xs",
				// Appearance
				"rounded-sm",
				"border-y-2",
				// States
				"hover:duration-0",
				"active:translate-px",
				// Transition
				"transition-all",
				"ease-in-out",
				"duration-300",
				// Media Queries
				"lg:text-sm",
				// Colors
				"text-white",
				color == "red" ? [
					"bg-red-500",
					"border-t-red-400",
					"border-b-red-600",
					"hover:bg-red-600",
					"hover:border-t-red-500",
					"hover:border-b-red-700",
				] : [
					"bg-comic-accent-500",
					"border-t-comic-accent-400",
					"border-b-comic-accent-600",
					"hover:bg-comic-accent-600",
					"hover:border-t-comic-accent-500",
					"hover:border-b-comic-accent-700",
				]
			)
		}
	>
		{icon &&
			<Icon name={icon.name} className={
				clsx(
					icon.position == "left" && [
						"order-first",
					],
					icon.position == "right" && [
						"order-last",
					],
					"size-4",
					"lg:size-5",
				)
			} />
		}
		<span className={
			clsx(
				"order-1"
			)
		}>
			{props.children}
		</span>
	</Button>

}

export function ComicButton({
	className,
	disabled,
	visited = false,
	...props }:
	| ({
		as?: "button",
		disabled?: boolean,
		visited?: boolean
	} & ComponentPropsWithoutRef<"button">)
	| ({
		as?: "link",
		disabled?: boolean,
		visited?: boolean
	} & ComponentPropsWithoutRef<typeof Link>)
) {
	console.log(visited)
	const classes = clsx(
		className,

		"p-2",
		"w-full",
		"flex",
		"items-center",
		"justify-center",
		"rounded-sm",
		"text-white",
		"text-base",
		"lg:text-lg",
		"font-comic-header",
		"font-semibold",
		"border-y-2",
		"border-t-white/40",
		"border-b-black/20",
		disabled ? [
			"cursor-not-allowed",
			"bg-neutral-500",
			"opacity-20",
		] : [
			"cursor-pointer",
			// Appearance
			"bg-comic-accent-500",
			visited && "visited:bg-neutral-500",
			// States
			"hover:duration-0",
			"hover:bg-comic-accent-700",
			"active:translate-px",
			"active:bg-comic-accent-900",
			// Transition
			"transition-all",
			"ease-in-out",
			"duration-300",
			// Outline
			"outline-transparent",
			"focus:outline-4",
			"focus:outline-offset-4",
			"focus:outline-comic-accent-500",
		]
	)

	// logic here that returns Button or Link conditionally

	if (props.as === "link") {
		const { as, ...linkProps } = props
		return <Link className={classes} {...linkProps}>
			{linkProps.children}
		</Link>
	}
	if (props.as === "button") {
		const { as, ...buttonProps } = props
		return <Button {...buttonProps} className={classes}>
			{props.children}
		</Button>
	}
}

export function PlatformButton({
	className,
	...props
}: ComponentPropsWithoutRef<"button">) {
	return <Button
		{...props}
		className={clsx(
			className,
			// Spacing
			"py-1",
			// Appearance
			"rounded",
			// Colours
			"border-y-2",
			"border-t-white/40",
			"border-b-black/20",
			"border-t-comic-accent-300",
			// Text
			"text-white",
			"text-base",
			"font-platform-header",
			// States
			props.disabled ? [
				"cursor-not-allowed",
				"bg-neutral-500",
				"opacity-20",
			] : [
				"cursor-pointer",
				// Appearance
				"bg-comic-accent-500",
				"visited:bg-neutral-500",
				// States
				"hover:duration-0",
				"hover:bg-comic-accent-700",
				"active:translate-px",
				"active:bg-comic-accent-900",
				// Transition
				"transition-all",
				"ease-in-out",
				"duration-300",
				// Outline
				"outline-transparent",
				"focus:outline-4",
				"focus:outline-offset-4",
				"focus:outline-comic-accent-500",
			]
		)}
	>
		{props.children}
	</Button>
}