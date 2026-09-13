
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
				"bg-base-1",
				"border",
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
				color == "red" ? [
					"border-red-200/50",
					"text-red-700",
					"bg-red-100/50",
					"hover:text-red-700",
					"hover:border-red-300/50",
					"hover:bg-red-200",
				] : [
					"border-base-2/50",
					"text-base-content/50",
					"hover:text-comic-accent-500",
					"hover:border-comic-accent-500/10",
					"hover:bg-comic-accent-100",
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
	...props }:
	| ({
		as?: "button"
	} & ComponentPropsWithoutRef<"button">)
	| ({
		as?: "link"
	} & ComponentPropsWithoutRef<typeof Link>)
) {
	const classes = clsx(
		className,

		"p-2",
		"w-full",
		"flex",
		"items-center",
		"justify-center",
		// Appearance
		"bg-comic-accent-500",
		"visited:bg-neutral-500",
		"rounded-sm",
		"text-white",
		"text-base",
		"lg:text-lg",
		"font-comic-header",
		"font-semibold",
		"cursor-pointer",
		"border-y-2",
		"border-t-white/40",
		"border-b-black/20",
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