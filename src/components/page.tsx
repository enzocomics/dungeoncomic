import clsx from "clsx"
import { ComponentPropsWithoutRef } from "react"

export const PageTitleH1 = (props: ComponentPropsWithoutRef<"h1">) => {
	return <h1 className={clsx(
		props.className,
		"font-platform-display",
		"text-3xl/16",
		"mb-6",
		"border-b",
		"border-dashed",
		"border-base-5/20",
		"dark:border-base-5",
	)}>
		{props.children}
	</h1>
}