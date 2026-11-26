// LIBRARIES
import Icon, { icons } from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentPropsWithoutRef } from "react"

export const DashboardNavTabLink = ({ ...props }: {} & ComponentPropsWithoutRef<typeof Link>) => {
	return <>
		<Link 	{...props} className={clsx(
			"group",
			"cursor-pointer",
			"font-semibold",
			"font-platform-labels",
			"text-md",
			"text-base-content/30",
			"rounded",
			"md:rounded-b-none",
			"md:border-b-2",
			"md:border-b-transparent",
			"bg-base-2/40",
			"data-current:bg-platform-accent-500",
			"data-current:text-white",
			"hover:bg-platform-accent-700",
			"hover:text-platform-accent-100",
			// Transition
			"hover:duration-0",
			"transition-all",
			"ease-in-out",
			"duration-300",
			"outline-transparent",
			"outline-4",
			// "data-current:focus:bg-platform-accent-600",
			// "data-current:focus:text-platform-accent-500",
			"data-current:focus:duration-0",
			props.className
		)}

		>
			<span className={clsx(
				"flex",
				"flex-row",
				"items-center",
				"px-4",
				"pt-2",
				"pb-2",
				"md:pb-1",
				"rounded",
				"md:rounded-b-none",
				"group-active:translate-px",
				"group-focus:outline-offset-2",
				"group-focus:outline-4",
				"group-focus:outline-platform-accent-500",
			)}>
				{props.children}
			</span>
		</Link>
	</>
}
