"use client"
// LIBRARIES
import Icon, { icons } from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentPropsWithoutRef } from "react"
import { DashboardNavTabLink } from "../nav-tab"

export const ClientComicSettingsNavTab = ({
	...props
}: {} & ComponentPropsWithoutRef<typeof Link>) => {
	return <>
		<DashboardNavTabLink {...props} >
			{props.children}
		</DashboardNavTabLink>
	</>
}


export const ClientDashboardNavTab = ({
	icon,
	iconRight = false,
	postTypeSlug,
	...props
}: {
	icon?: keyof typeof icons
	iconRight?: boolean
	href?: string
	postTypeSlug: string
} & ComponentPropsWithoutRef<typeof Link>) => {

	const pathname = usePathname()

	const isCurrent = (
		pathname == props?.href || // if the pathname is equal to the href
		(
			pathname.startsWith(`/dashboard/${postTypeSlug}`) &&
			!props?.href.startsWith("/dashboard/profile") &&
			!props?.href.startsWith("/dashboard/account") &&
			!props?.href.startsWith("/dashboard/theme") &&
			!props?.href.startsWith("/dashboard/settings")
		)
	) || undefined

	return <>
		<DashboardNavTabLink
			data-current={isCurrent ? true : undefined}
			{...props}
		>
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
		</DashboardNavTabLink>
	</>
}
