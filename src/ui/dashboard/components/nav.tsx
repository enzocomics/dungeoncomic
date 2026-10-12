import clsx from "clsx"
import { ComponentPropsWithoutRef, PropsWithChildren } from "react"

export const DashboardNav = (props: ComponentPropsWithoutRef<"nav">) => {
	return <>
		<nav className={clsx(
			"-mt-6",
			"px-2",
			"py-2",
			"md:pt-2",
			"md:pb-0",
			"md:px-0",
			"md:px-2",
			"flex",
			"flex-row",
			"flex-wrap",
			"justify-center",
			"md:justify-start",
			"w-full",
			"gap-1",
			"md:gap-x-1",
			// "pt-2",

			"mx-auto",
			"bg-base-2/30",
			"rounded-t",
			"dark:bg-base-3/50",
			"border-b-4",
			"border-platform-accent-500",
			"text-sm",
			"md:text-base",

		)}>
			{props.children}
		</nav>
	</>
}

export const DashboardSection = (props: ComponentPropsWithoutRef<"section">) => {
	return <>
		<section className={clsx(
			"px-6",
		)}>
			{props.children}
		</section>
	</>
}