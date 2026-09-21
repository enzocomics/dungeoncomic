import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export const PageContentWrapper = (
	props: ComponentPropsWithoutRef<"article">
) => (
	<article
		className={clsx(
			"relative",
			// Structure
			"flex",
			"flex-col",
			"gap-6",
			// Spacing
			"pt-6",
			"pb-18",
			// Appearance
			"md:rounded",
			// Colours
			"bg-base-1",
			"dark:bg-base-2",
			"dark:shadow-none",
			"dark:outline",
			"dark:-outline-offset-1",
			"dark:outline-base-5/50",
		)}
	>
		{props.children}
	</article>
)
