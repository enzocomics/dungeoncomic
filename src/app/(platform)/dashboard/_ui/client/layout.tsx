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


	return <>
		<Link className={clsx(
			"cursor-pointer",
			"flex",
			"flex-row",
			"items-center",
			"px-4",
			"pt-2",
			"pb-1",
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
			className
		)}
			data-current={pathname == props?.href ? true : undefined}
			{...props}
		>
			<>
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
			</>
		</Link>
	</>
}



