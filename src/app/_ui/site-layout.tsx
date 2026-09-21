import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export const SiteLayoutWrapper = (
	props: ComponentPropsWithoutRef<"div">
) => (
	<div
		{...props}
		className={clsx(
			props.className,
			"relative",
			"bg-top",
			"bg-repeat-x",
			"bg-fixed",
		)}
	>
		{props.children}
	</div>
)

export const SiteLayoutBackdrop = (
	props: ComponentPropsWithoutRef<"div">
) => (
	<div
		{...props}
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
		)}
	>
		{props.children}
	</div>
)

export const SiteLayoutMain = (
	props: ComponentPropsWithoutRef<"main">
) => (
	<main
		{...props}
		className={clsx(
			props.className,
			"relative",
			"mx-auto",
			"max-w-6xl",
			"md:px-6",
		)}
	>
		{props.children}
	</main>
)