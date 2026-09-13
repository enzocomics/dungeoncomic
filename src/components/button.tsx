import { Button } from "@headlessui/react"
import clsx from "clsx"
import Link from "next/link"
import { ComponentPropsWithoutRef } from "react"

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