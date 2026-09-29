"use client"
// LIBRARIES
import Icon, { icons } from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentPropsWithoutRef } from "react"


export const ClientDashboardNavTab = ({
	className,
	icon,
	iconRight = false,
	...props
}: {
	icon?: keyof typeof icons
	iconRight?: boolean
	href?: string
} & ComponentPropsWithoutRef<typeof Link>) => {

	const pathname = usePathname()

	const isCurrent = (

		pathname == props?.href || // if the pathname is equal to the href
		(
			pathname.startsWith("/dashboard/edit") &&
			!props?.href.startsWith("/dashboard/profile") &&
			!props?.href.startsWith("/dashboard/settings")
		)
	) || undefined

	return <>
		<Link className={clsx(
			"group",
			"cursor-pointer",
			"font-semibold",
			"font-platform-headers",
			"text-md",
			"text-base-content/30",
			"rounded-t",
			"border-b-2",
			"border-b-transparent",
			"bg-base-2/40",
			"data-current:bg-red-500",
			"data-current:text-white",
			"hover:bg-red-700",
			"hover:text-red-100",
			// Transition
			"hover:duration-0",
			"transition-all",
			"ease-in-out",
			"duration-300",
			"outline-transparent",
			"outline-4",
			// "data-current:focus:bg-red-600",
			// "data-current:focus:text-red-500",
			"data-current:focus:duration-0",
			className
		)}
			data-current={isCurrent ? true : undefined}
			{...props}
		>
			<span className={clsx(
				"flex",
				"flex-row",
				"items-center",
				"px-4",
				"pt-2",
				"pb-1",
				"rounded-t",
				"group-active:translate-px",
				"group-focus:outline-offset-2",
				"group-focus:outline-4",
				"group-focus:outline-comic-accent-500",
			)}>
				{icon && !iconRight &&
					<Icon name={icon} className={clsx(
						"size-4",
						"mr-1.5",
					)} />
				}
				{props.children}
				{icon && iconRight &&
					<Icon name={icon} className={clsx(
						"size-4",
						"ml-1.5",
					)} />

				}
			</span>
		</Link>
	</>
}



