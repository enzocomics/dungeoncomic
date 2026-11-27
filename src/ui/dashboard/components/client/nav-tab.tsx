"use client"
// LIBRARIES
import Icon, { icons } from "@/styles/icons"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentPropsWithoutRef } from "react"
import { DashboardNavTabLink } from "../nav-tab"
import type { getComic } from "@/lib/directus/get-comics"
import getComicPath from "@/ui/comic/functions/get-comic-path"

export const ClientComicSettingsNavTab = ({
	comicPath,
	icon,
	iconOnly = false,
	iconRight = false,
	...props
}: {
	comicPath?: Awaited<ReturnType<typeof getComicPath>>
	icon?: keyof typeof icons
	iconOnly?: boolean
	iconRight?: boolean
} & ComponentPropsWithoutRef<typeof Link>) => {

	const pathname = usePathname()
	const isCurrent = pathname == props?.href

	// This does not take into account subpages

	return <>
		<DashboardNavTabLink
			data-current={isCurrent ? true : undefined}
			{...props} >
			{icon && !iconRight &&
				<Icon name={icon} className={clsx(
					"size-4",
					"h-6",
				)} />
			}
			<span className={clsx(
				icon && !iconOnly && !iconRight && "ml-1.5",
				icon && !iconOnly && iconRight && "mr-1.5",
			)}>
				{props.children}
			</span>
			{icon && iconRight &&
				<Icon name={icon} className={clsx(
					"size-4",
				)} />
			}
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
